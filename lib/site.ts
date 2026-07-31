import * as cheerio from "cheerio";
import { promises as fs } from "fs";
import path from "path";
import dns from "dns/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const MAX_HTML_BYTES = 3_000_000;
const MAX_IMAGE_BYTES = 10_000_000;
const MAX_TEXT_CHARS = 5000;

export type SiteImage = {
  src: string;
  w: number | null;
  h: number | null;
  priority: number;
};

export type ExtractedSite = {
  url: string;
  domain: string;
  brand: string;
  title: string;
  description: string;
  headings: string[];
  text: string;
  images: SiteImage[];
};

function isPrivateIp(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 0) return true;
  if (a >= 224) return true;
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
  return false;
}

async function assertSafeUrl(raw: string): Promise<URL> {
  const u = new URL(raw);
  if (!["http:", "https:"].includes(u.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }
  if (u.port && !["80", "443"].includes(u.port)) {
    throw new Error("Only default ports are allowed.");
  }
  const hostname = u.hostname.replace(/^\[|\]$/g, "");
  const isLiteralIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.includes(":");
  if (isLiteralIp && (isPrivateIp(hostname) || isPrivateIpv6(hostname))) {
    throw new Error("Local and private addresses are not allowed.");
  }
  if (!isLiteralIp) {
    if (
      hostname === "localhost" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith("localhost")
    ) {
      throw new Error("Local and private addresses are not allowed.");
    }
    try {
      const records = await dns.lookup(hostname, { all: true });
      const blocked = records.some((r) => isPrivateIp(r.address) || isPrivateIpv6(r.address));
      if (blocked) {
        throw new Error("Local and private addresses are not allowed.");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("Local and private")) throw err;
      throw new Error("Could not resolve the hostname.");
    }
  }
  return u;
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export async function extractSite(rawUrl: string): Promise<ExtractedSite> {
  const u = await assertSafeUrl(rawUrl);

  const res = await fetch(u.toString(), {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    throw new Error(`The site returned a ${res.status} status.`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("html")) {
    throw new Error("That URL doesn't point to an HTML page.");
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const html = buf
    .subarray(0, Math.min(buf.length, MAX_HTML_BYTES))
    .toString("utf8");

  const $ = cheerio.load(html);
  $("script, style, noscript, svg, canvas, iframe, template").remove();

  const ogImage = $('meta[property="og:image"]').attr("content") || $('meta[property="og:image:url"]').attr("content");
  const ogImageWidth = parseInt($('meta[property="og:image:width"]').attr("content") || "", 10) || null;
  const ogImageHeight = parseInt($('meta[property="og:image:height"]').attr("content") || "", 10) || null;
  const twitterImage = $('meta[name="twitter:image"]').attr("content");
  const linkImage = $('link[rel="image_src"]').attr("href");

  const domain = u.hostname.replace(/^www\./, "");
  const brand =
    $('meta[property="og:site_name"]').attr("content") ||
    $("link[rel=apple-touch-icon]").attr("href") ||
    domain;

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("title").text().trim() ||
    $("h1").first().text().trim();

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    $('meta[name="twitter:description"]').attr("content") ||
    "";

  const headings: string[] = [];
  $("h1, h2").each((_, el) => {
    const t = normalizeWhitespace($(el).text());
    if (t && t.length < 140 && headings.length < 10) headings.push(t);
  });

  const text = normalizeWhitespace(
    $("main").text() || $("body").text() || ""
  ).slice(0, MAX_TEXT_CHARS);

  const images: SiteImage[] = [];
  const pushImage = (src: string, w: number | null, h: number | null, priority: number) => {
    if (!src || /^data:/i.test(src) || /^blob:/i.test(src)) return;
    const abs = new URL(src, u).toString();
    if (images.some((i) => i.src === abs)) return;
    images.push({ src: abs, w, h, priority });
  };

  if (ogImage) {
    const small = ogImageWidth && ogImageHeight && (ogImageWidth < 500 || ogImageHeight < 300);
    pushImage(ogImage, ogImageWidth, ogImageHeight, small ? 55 : 100);
  }
  if (twitterImage) pushImage(twitterImage, null, null, 90);
  if (linkImage) pushImage(linkImage, null, null, 80);

  $("img").each((index, el) => {
    let src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-original");
    if (!src) {
      const srcset = $(el).attr("srcset") || $(el).attr("data-srcset");
      if (srcset) {
        const candidates = srcset
          .split(",")
          .map((s) => s.trim().split(/\s+/)[0])
          .filter(Boolean);
        src = candidates[candidates.length - 1];
      }
    }
    if (!src) return;
    const w = parseInt($(el).attr("width") || "", 10) || null;
    const h = parseInt($(el).attr("height") || "", 10) || null;
    const alt = ($(el).attr("alt") || "").toLowerCase();
    const cls = ($(el).attr("class") || "").toLowerCase();
    const keyword = /hero|banner|cover|featured|product|main|og-/i;
    const bonus = keyword.test(src) || keyword.test(alt) || keyword.test(cls) ? 20 : 0;
    const areaScore = w && h ? Math.min(40, Math.round(Math.log10(w * h))) : 10;
    const positionScore = Math.max(0, 12 - index);
    pushImage(src, w, h, 50 + bonus + areaScore + positionScore);
  });

  $("picture source").each((_, el) => {
    const srcset = $(el).attr("srcset") || $(el).attr("data-srcset");
    if (!srcset) return;
    const candidates = srcset
      .split(",")
      .map((s) => s.trim().split(/\s+/)[0])
      .filter(Boolean);
    const src = candidates[candidates.length - 1];
    if (src) pushImage(src, null, null, 70);
  });

  images.sort((a, b) => b.priority - a.priority);

  return { url: u.toString(), domain, brand, title, description, headings, text, images };
}

async function downloadImage(src: string, destPath: string, referer: string): Promise<string | null> {
  const u = new URL(src);
  if (!["http:", "https:"].includes(u.protocol)) return null;
  const res = await fetch(u.toString(), {
    headers: { "User-Agent": UA, Accept: "image/*", Referer: referer },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return null;
  const type = (res.headers.get("content-type") || "").toLowerCase();
  if (!type.startsWith("image/")) return null;

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_IMAGE_BYTES || buf.length < 100) return null;

  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  const ext = extMap[type] || "jpg";
  await fs.writeFile(`${destPath}.${ext}`, buf);
  return ext;
}

export async function saveHeroImage(site: ExtractedSite, runId: string): Promise<string | null> {
  const dir = path.join(process.cwd(), "public", "generated", runId);
  await fs.mkdir(dir, { recursive: true });

  const iconLike = /\.svg$/i;
  const iconName = /logo|icon|arrow|cart|shopping|badge|basket|placeholder|nav|menu|thumb|thumbnail/i;

  const tooSmall = (img: SiteImage) =>
    (img.w !== null && img.h !== null && (img.w < 400 || img.h < 300)) ||
    (img.w !== null && img.w < 400);

  const usable = site.images.filter(
    (i) => !iconLike.test(i.src) && !iconName.test(i.src) && !tooSmall(i)
  );

  const quality = (img: SiteImage) => {
    const area = img.w && img.h ? Math.log10(img.w * img.h) : Math.log10(600 * 600);
    return img.priority * 0.5 + area * 10;
  };

  const pool = usable
    .sort((a, b) => quality(b) - quality(a))
    .slice(0, 12);

  for (const img of pool) {
    try {
      const ext = await downloadImage(img.src, path.join(dir, "hero"), site.url);
      if (ext) {
        return `/generated/${runId}/hero.${ext}`;
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}
