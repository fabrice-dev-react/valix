import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { analyzeChart, detectChart } from "@/lib/openrouter";
import { buildMarketContext } from "@/lib/marketContext";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to analyze a chart." }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user?.hasPaid) {
    return NextResponse.json(
      { error: "Activate your account to analyze charts." },
      { status: 403 }
    );
  }

  let payload: { image?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const image = typeof payload.image === "string" ? payload.image.trim() : "";
  if (!image || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "A chart image is required." }, { status: 400 });
  }
  if (image.length > 8_000_000) {
    return NextResponse.json(
      { error: "That image is too large. Use a smaller screenshot." },
      { status: 400 }
    );
  }

  // Pass 1: detect the asset, timeframe and category straight off the chart —
  // the user never has to tell us what they are trading.
  const detection = await detectChart(image);

  // Pass 2: build precise context (only this market's news + session + style)
  // and run the full staged analysis.
  let marketContext: Awaited<ReturnType<typeof buildMarketContext>> | null = null;
  try {
    marketContext = await buildMarketContext({
      symbol: detection.symbol || undefined,
      category: detection.category || undefined,
      style: "auto",
      timeframe: detection.timeframe || undefined,
    });
  } catch (err: unknown) {
    console.error(
      "Market context error:",
      err instanceof Error ? err.message : err
    );
    marketContext = null;
  }

  try {
    const result = await analyzeChart(image, {
      market: detection.category,
      timeframe: detection.timeframe,
      symbol: detection.symbol,
      style: "auto",
      context: marketContext,
    });
    return NextResponse.json({
      analysis: {
        ...result.reading,
        plan: result.plan,
      },
      marketContext,
      detection,
    });
  } catch (err: unknown) {
    let message =
      err instanceof Error ? err.message : "Something went wrong while analyzing your chart.";
    if (/402|Insufficient credits|credits/i.test(message)) {
      message =
        "The OpenRouter account has no credits left. Add credits at openrouter.ai/settings/credits and try again.";
      return NextResponse.json({ error: message }, { status: 402 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
