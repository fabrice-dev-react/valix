import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { extractSite, saveHeroImage } from "@/lib/site";
import { generateAds } from "@/lib/openrouter";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to generate ads." }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user?.hasPaid) {
    return NextResponse.json(
      { error: "Activate your account to generate ads." },
      { status: 403 }
    );
  }

  let payload: { url?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawUrl = typeof payload.url === "string" ? payload.url.trim() : "";
  if (!rawUrl) {
    return NextResponse.json({ error: "A URL is required." }, { status: 400 });
  }

  let normalized: string;
  try {
    const u = new URL(rawUrl);
    normalized = u.toString();
  } catch {
    return NextResponse.json(
      { error: "That doesn't look like a valid URL." },
      { status: 400 }
    );
  }

  try {
    const site = await extractSite(normalized);
    const runId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const heroImagePath = await saveHeroImage(site, runId);
    const { brand, ads } = await generateAds(site);

    return NextResponse.json({
      runId,
      url: site.url,
      domain: site.domain,
      brand,
      heroImagePath,
      ads,
    });
  } catch (err: unknown) {
    let message = err instanceof Error ? err.message : "Something went wrong while generating your ads.";
    const status = /status|invalid|doesn't|Local|private|resolve|HTML|http/i.test(message) ? 400 : 500;
    if (/402|Insufficient credits|credits/i.test(message)) {
      message = "The OpenRouter account has no credits left. Add credits at openrouter.ai/settings/credits and try again.";
      return NextResponse.json({ error: message }, { status: 402 });
    }
    return NextResponse.json({ error: message }, { status });
  }
}
