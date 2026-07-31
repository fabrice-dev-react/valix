import type { ExtractedSite } from "./site";

export type GeneratedAd = {
  angle: string;
  headline: string;
  primary: string;
  body: string;
  cta: string;
};

export type GenerateResponse = {
  brand: string;
  ads: GeneratedAd[];
};

const SYSTEM_PROMPT = `You are a senior direct-response copywriter and creative director for Facebook and Instagram ads. You write copy that reads like a real brand wrote it — never generic AI filler, never buzzword soup, never emoji spam.

You will receive JSON with content scraped from a company's website: brand name, page title, meta description, headings, and body text. Use ONLY that material to infer the offer, the audience, the tone of voice, and the proof points. Do not invent products, prices, discounts, claims or statistics that are not in the source. Do not use the phrase "unlock" or "elevate" or "supercharge".

Return a JSON object with exactly this shape:
{
  "brand": "the company's display name",
  "ads": [
    {
      "angle": "one-word angle label, e.g. Problem, Benefit, Proof, Curiosity",
      "headline": "a headline, max 40 characters, that makes someone stop scrolling",
      "primary": "the big bold statement overlaid on the ad image, max 5 words, punchy and specific",
      "body": "the main ad copy, 60-110 characters, under 4 lines, plain and conversational, no hashtags, no trailing periods if avoidable",
      "cta": "a call to action of 2-3 words, e.g. Shop now, Learn more, Get started, Book a call"
    }
  ]
}

Write FOUR ads. Each must use a different angle and different headline/primary/body wording so they can be A/B tested against each other. Follow the brand's tone from the source copy. Keep body copy concrete and benefit-driven.

Respond with ONLY a single valid JSON object matching that shape. Do not include markdown, code fences, explanations, or any text outside the JSON.`;

function parseJson(content: string): GenerateResponse | null {
  try {
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/m, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    try {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start === -1 || end === -1) return null;
      return JSON.parse(content.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

const FALLBACK_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "openai/gpt-oss-20b:free",
  "inclusionai/ling-3.0-flash:free",
];

export async function generateAds(site: ExtractedSite): Promise<GenerateResponse> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const models = [
    process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free",
    ...FALLBACK_MODELS.filter((m) => m !== (process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free")),
  ];

  const userContent = JSON.stringify({
    brand: site.brand,
    domain: site.domain,
    pageTitle: site.title,
    metaDescription: site.description,
    headings: site.headings,
    bodyText: site.text.slice(0, 3500),
  });

  let lastError = "";
  for (const model of models) {
    try {
      return await requestAds(model, userContent, site);
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : "Unknown error";
      if (/(401|402|403|404)/.test(lastError)) break;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  throw new Error(lastError || "Copy generation failed.");
}

async function requestAds(model: string, userContent: string, site: ExtractedSite): Promise<GenerateResponse> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.8,
      max_tokens: 1600,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Copy generation failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Copy generation returned an empty response.");

  const parsed = parseJson(content);
  if (!parsed || !Array.isArray(parsed.ads) || parsed.ads.length === 0) {
    throw new Error("Copy generation returned an unexpected response.");
  }

  const ads = parsed.ads
    .filter((a) => a.headline && a.body)
    .map((a) => ({
      angle: String(a.angle || "Ad").slice(0, 24),
      headline: String(a.headline).slice(0, 60),
      primary: String(a.primary || a.headline).slice(0, 40),
      body: String(a.body).slice(0, 200),
      cta: String(a.cta || "Shop now").slice(0, 24),
    }));

  if (ads.length === 0) throw new Error("Copy generation returned invalid ads.");

  return { brand: String(parsed.brand || site.brand).slice(0, 60), ads };
}
