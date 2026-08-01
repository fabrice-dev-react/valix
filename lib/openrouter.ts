import {
  resolveStyle,
  STYLE_PROFILES,
  scoreSetup,
  type Reading,
  type ScoredPlan,
  type Direction,
} from "./edgeEngine";
import type { MarketContext } from "./marketContext";
import { formatCalendarForPrompt, instrumentCurrencies } from "./marketContext";

export interface AnalysisOptions {
  market?: string;
  timeframe?: string;
  symbol?: string;
  style?: "scalper" | "intraday" | "swing" | "auto";
  context?: MarketContext | null;
}

export interface AnalysisResult {
  reading: Reading;
  plan: ScoredPlan;
}

export interface Detection {
  symbol?: string;
  timeframe?: string;
  category?: string;
}

const SYSTEM_PROMPT = `You are a professional, disciplined technical analyst covering forex, indices, commodities, crypto and stocks. Your job is to read a chart screenshot and produce an honest, conservative trade plan. You never chase trades and you never force a setup.

Analyze the chart as a SEQUENCE OF STAGES, in this exact order:

STAGE 1 - IDENTIFY
Read the price scale, the asset and the timeframe. State what you can actually see. If the asset or timeframe is not legible, say "Unknown".

STAGE 2 - CONTEXT
Determine the higher-timeframe bias, the primary trend, the market structure (higher highs / higher lows for bullish, lower highs / lower lows for bearish) and the regime (trending, ranging, volatile). Be honest: a flat, choppy chart is a "ranging"/"choppy" regime, not a trend.

STAGE 3 - PRICE POSITION
Map the key support and resistance levels. Note where price sits relative to them (at support, at resistance, mid-range) and whether price is at a demand/supply zone. Note any candlestick patterns, the momentum (strong, moderate, weak) and the volatility (high, normal, low).

STAGE 4 - NEWS & SESSION DISCIPLINE
Use the provided market context (economic calendar, session, risk state). This is a hard filter:
- If the risk state is HIGH, an impactful release is firing for this market right now. Do NOT recommend an entry — prefer NEUTRAL unless the move is a clear, clean post-release continuation already visible on the chart.
- If a High-impact event is within 2 hours, flag it with newsRisk "high" and be a bit more conservative, but still give a direction when the setup is otherwise valid.
- Respect session liquidity: thin sessions (weekend, Asian dead zone) deserve lower confidence and smaller expectations.

STAGE 5 - CONFLUENCE & PLAN
Build a trade plan when the factors that are visible line up (trend + structure + key level + pattern + momentum). Count the factors that align. If at least 2 factors agree and you can place a sensible entry, stop and target, give a direction. Only return direction "NEUTRAL" when the chart genuinely has no trade (flat, choppy, no levels, no edge) — do not default to it.

Rules:
- Confidence must be honest and realistic. Most real setups land between 50 and 85. Reserve 85+ for textbook multi-factor setups. Confidence 0 is not allowed.
- Use only levels that are visible or directly estimable from the price scale. Never invent levels far from the visible price.
- Entry should sit at or just beyond a meaningful level. Stop loss must sit on the wrong side of a real structural level (behind support for BUY, behind resistance for SELL). Take profit must respect the next visible opposing level.
- Return ONLY a single valid JSON object. No markdown, no code fences, no text outside the JSON.`;

const MARKET_CONTEXT: Record<string, string> = {
  forex:
    "FX pairs are driven by interest-rate differentials, central-bank policy and macro data releases; moves cluster around the London and New York sessions and the economic calendar.",
  indices:
    "Index charts reflect macro data, earnings season, sector rotation and overall risk sentiment; they tend to trend with liquidity conditions and shift with volatility regimes.",
  crypto:
    "Crypto is sentiment and flow driven: exchange inflows and outflows, funding rates, regulatory news and 24/7 trading create sharp volatility and frequent liquidity sweeps.",
  gold:
    "Gold trades inversely to real yields and the US dollar, with additional demand from central banks and safe-haven flows during geopolitical stress.",
  stocks:
    "Single stocks respond to earnings, guidance, sector catalysts and company-specific news; gaps and post-earnings moves are common, so respect price levels rather than intraday noise.",
};

const TIMEFRAME_CONTEXT: Record<string, string> = {
  M1: "M1 is a scalping timeframe — fast moves, tight levels and high noise; keep targets small.",
  M5: "M5 is a scalping timeframe — expect choppy action with short-lived trends.",
  M15: "M15 suits short-term trading with moderate noise.",
  M30: "M30 suits intraday trading with clearer structure than lower timeframes.",
  H1: "H1 is a solid intraday timeframe with clean, reliable structure.",
  H4: "H4 is a swing timeframe — fewer but stronger signals with clean structure.",
  D1: "D1 is a position timeframe — focus on the primary trend and major structural levels.",
  W1: "W1 is a long-term timeframe — use broad trend context and major structural levels.",
};

const OUTPUT_SCHEMA = `Output JSON with EXACTLY this shape:
{
  "market": "instrument name if identifiable, otherwise Unknown",
  "timeframe": "timeframe if visible (e.g. H1, M15, D1), otherwise Unknown",
  "trend": "up | down | sideways",
  "structure": "HHHL | LHLL | range | choppy",
  "higherTimeframeBias": "bullish | bearish | neutral",
  "regime": "trending | ranging | volatile",
  "keyLevels": { "support": ["1.0830", "1.0800"], "resistance": ["1.0900", "1.0940"] },
  "candlePatterns": ["engulfing", "doji"],
  "momentum": "strong | moderate | weak",
  "volatility": "high | normal | low",
  "direction": "BUY | SELL | NEUTRAL",
  "entry": "entry price or zone as a string, or null for NEUTRAL",
  "stopLoss": "stop loss level as a string, or null for NEUTRAL",
  "takeProfit": "take profit target as a string, or null for NEUTRAL",
  "riskReward": "risk to reward ratio as a string like 1:2.1, or null",
  "confidence": "integer from 30 to 90",
  "newsRisk": "none | low | high",
  "reasoning": "2-4 sentences in plain language: where price is relative to key levels, why this direction is preferred, and which factors align. If the provided market context shows relevant news for this market (an active release or one coming up), weave it in naturally in one short phrase, e.g. \"big news for this market in ~40 minutes, so expect sharp moves\". If there is no relevant news, do NOT mention news at all"
}`;

const DETECT_PROMPT = `Look carefully at this trading chart screenshot and identify its metadata. Make your best guess from what is visible. Return a single compact JSON object with exactly these keys:
{
  "symbol": "the asset or instrument ticker, e.g. EURUSD, XAUUSD, NAS100, BTCUSD. If the ticker text is small, read it from the chart (pair name, price scale, watermark). Only use Unknown if you really cannot read or infer it",
  "timeframe": "the chart timeframe (one of M1, M5, M15, M30, H1, H4, D1, W1). If not labeled, infer the best match from the number of candles on screen. Only use Unknown if it is truly impossible",
  "category": "the asset class: forex, indices, crypto, gold, stocks. Best guess if unclear"
}
Return ONLY the JSON object. No markdown, no other text.`;

const KNOWN_INDICES = [
  "US500", "US30", "NAS100", "SPX500", "DJ30", "NDX", "NQ100",
  "UK100", "GER30", "GER40", "DE30", "DE40", "DAX", "DAX40",
  "FRA40", "CAC40", "CAC", "JPN225", "NIKKEI", "NIKKEI225", "HSI", "HANGSENG",
];

function buildSystemPrompt(
  market: string,
  timeframe: string,
  symbol: string,
  style: "scalper" | "intraday" | "swing" | "auto",
  context?: MarketContext | null
): string {
  const lines: string[] = [SYSTEM_PROMPT];

  if (market && market !== "auto") {
    lines.push(`Market category: ${market.toUpperCase()}. ${MARKET_CONTEXT[market] || ""}`);
  } else {
    lines.push("Market category: not specified by the user. Identify the asset from the chart if possible.");
  }

  if (symbol && symbol !== "auto") {
    lines.push(`Instrument the user is trading: ${symbol.toUpperCase()}. Your market field should match this if the chart agrees.`);
  }

  if (timeframe && timeframe !== "auto") {
    lines.push(`Chart timeframe: ${timeframe}. ${TIMEFRAME_CONTEXT[timeframe] || ""}`);
  } else {
    lines.push("Chart timeframe: not specified. Read it from the chart if visible.");
  }

  const resolved = resolveStyle(style, timeframe);
  const profile = STYLE_PROFILES[resolved];
  lines.push(
    `Trader style: ${profile.label}. Suitable timeframes: ${profile.timeframes.join(", ")}. ` +
      `Discipline: ${profile.newsAdvice} Minimum acceptable reward:risk is ${profile.minRR}.`
  );
  if (timeframe && profile.timeframes.length && !profile.timeframes.includes(timeframe.toUpperCase())) {
    lines.push(`Note: ${timeframe} is outside the usual ${profile.label} range (${profile.timeframes.join(", ")}); size down or expect noisier behaviour.`);
  }

  if (context) {
    lines.push(`\nLIVE MARKET CONTEXT (from the economic calendar and market clock):\n${formatCalendarForPrompt(context)}`);
    if (context.riskState === "HIGH") {
      lines.push("RISK STATE IS HIGH — an impactful release is active for this market. Strongly prefer NEUTRAL unless a clean post-release continuation is visible.");
    }
  } else {
    lines.push("\nLIVE MARKET CONTEXT: unavailable this run. Do not assume any news. Rely on price structure only.");
  }

  lines.push(`\n${OUTPUT_SCHEMA}`);
  return lines.join("\n\n");
}

function parseJson(content: string): Record<string, unknown> | null {
  try {
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/m, "")
      .trim();
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    try {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start === -1 || end === -1) return null;
      return JSON.parse(content.slice(start, end + 1)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

const DEFAULT_MODEL = "google/gemma-4-31b-it:free";

const FALLBACK_MODELS = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "openai/gpt-4o-mini",
];

export async function analyzeChart(
  imageDataUrl: string,
  options?: AnalysisOptions
): Promise<AnalysisResult> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const primary = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const models = [primary, ...FALLBACK_MODELS.filter((m) => m !== primary)];

  const systemPrompt = buildSystemPrompt(
    options?.market || "auto",
    options?.timeframe || "auto",
    options?.symbol || "auto",
    options?.style || "auto",
    options?.context ?? null
  );

  let lastError = "";
  for (const model of models) {
    try {
      const reading = await requestAnalysis(model, imageDataUrl, systemPrompt);
      const plan = scoreSetup(reading, options?.context ?? null);
      return { reading, plan };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : "Unknown error";
      if (/(401|402|403|404)/.test(lastError)) break;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  throw new Error(lastError || "Chart analysis failed.");
}

function parseDetection(parsed: Record<string, unknown>): Detection {
  const raw = (v: unknown): string | undefined => {
    if (v == null) return undefined;
    const s = String(v).trim();
    return s && s.toLowerCase() !== "unknown" ? s : undefined;
  };

  const symbolRaw = raw(parsed.symbol) || raw(parsed.asset) || raw(parsed.instrument);
  const symbol = symbolRaw
    ? symbolRaw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12) || undefined
    : undefined;

  const tfRaw = raw(parsed.timeframe);
  const tfMatch = tfRaw ? tfRaw.toUpperCase().match(/(W1|D1|H4|H1|M30|M15|M5|M1)/) : null;
  const timeframe = tfMatch ? tfMatch[1] : undefined;

  const catRaw = (raw(parsed.category) || raw(parsed.market) || raw(parsed.assetType) || "").toLowerCase();
  let category: string | undefined;
  if (["forex", "indices", "crypto", "gold", "stocks"].includes(catRaw)) category = catRaw;
  else if (catRaw.includes("commod") || catRaw.includes("metal")) category = "gold";
  else if (catRaw.includes("stock") || catRaw.includes("equit") || catRaw.includes("shares")) category = "stocks";
  else if (catRaw.includes("index") || catRaw.includes("indice")) category = "indices";
  else if (catRaw.includes("fx") || catRaw.includes("pair") || catRaw.includes("forex") || catRaw.includes("currenc")) category = "forex";
  else if (catRaw.includes("crypto") || catRaw.includes("coin") || catRaw.includes("btc") || catRaw.includes("eth")) category = "crypto";

  if (!category && symbol) {
    if (KNOWN_INDICES.includes(symbol)) category = "indices";
    else if (symbol === "XAUUSD" || symbol === "XAGUSD") category = "gold";
    else if (/^[A-Z]{6}$/.test(symbol)) category = "forex";
    else if (instrumentCurrencies(symbol, "crypto").crypto) category = "crypto";
  }

  return { symbol, timeframe, category };
}

async function requestDetection(model: string, imageDataUrl: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are a chart metadata reader. Return only compact JSON.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: DETECT_PROMPT },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      temperature: 0,
      max_tokens: 100,
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    throw new Error(`Detection failed (${res.status})`);
  }
  const data = await res.json();
  return String(data?.choices?.[0]?.message?.content || "");
}

export async function detectChart(imageDataUrl: string): Promise<Detection> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) return {};
  const primary = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  try {
    const content = await requestDetection(primary, imageDataUrl);
    const parsed = parseJson(content);
    if (parsed) {
      const detection = parseDetection(parsed);
      if (detection.symbol || detection.timeframe || detection.category) return detection;
    }
  } catch {
    // detection is best-effort — fall through to defaults
  }
  return {};
}

async function requestAnalysis(
  model: string,
  imageDataUrl: string,
  systemPrompt: string
): Promise<Reading> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this chart screenshot following the stages in your instructions and return the trade plan JSON.",
            },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 1800,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Chart analysis failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Chart analysis returned an empty response.");

  const parsed = parseJson(content);
  if (!parsed) throw new Error("Chart analysis returned an unexpected response.");

  return normalize(parsed);
}

function enumOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  const s = String(v || "").toLowerCase();
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
}

function numArray(v: unknown): number[] {
  if (typeof v === "number" && Number.isFinite(v)) return [v];
  if (typeof v === "string") {
    const n = parseFloat(v);
    if (Number.isFinite(n)) return [n];
    return [];
  }
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === "string" || typeof x === "number" ? parseFloat(String(x)) : NaN))
      .filter((n) => Number.isFinite(n));
  }
  return [];
}

function stringArray(v: unknown): string[] {
  if (typeof v === "string" && v.trim()) return [v.trim().slice(0, 40)];
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === "string" ? x.trim() : typeof x === "number" ? String(x) : ""))
      .filter((s) => s.length > 0)
      .slice(0, 6);
  }
  return [];
}

const TREND_VALUES = ["up", "down", "sideways", "unknown"] as const;
const STRUCTURE_VALUES = ["HHHL", "LHLL", "range", "choppy", "unknown"] as const;
const BIAS_VALUES = ["bullish", "bearish", "neutral", "unknown"] as const;
const REGIME_VALUES = ["trending", "ranging", "volatile", "unknown"] as const;
const MOMENTUM_VALUES = ["strong", "moderate", "weak", "unknown"] as const;
const VOLATILITY_VALUES = ["high", "normal", "low", "unknown"] as const;

function normalize(parsed: Record<string, unknown>): Reading {
  const rawDirection = String(parsed.direction || "NEUTRAL").toUpperCase();
  const direction: Direction =
    rawDirection === "BUY" || rawDirection === "SELL" ? rawDirection : "NEUTRAL";

  const keyLevelsRaw = parsed.keyLevels;
  const supportRaw =
    typeof keyLevelsRaw === "object" && keyLevelsRaw !== null
      ? (keyLevelsRaw as Record<string, unknown>).support
      : undefined;
  const resistanceRaw =
    typeof keyLevelsRaw === "object" && keyLevelsRaw !== null
      ? (keyLevelsRaw as Record<string, unknown>).resistance
      : undefined;

  const str = (v: unknown, max: number): string | null =>
    v === null || v === undefined || v === "" ? null : String(v).slice(0, max);

  return {
    market: str(parsed.market, 40) || "Unknown",
    timeframe: str(parsed.timeframe, 20) || "Unknown",
    trend: enumOf(parsed.trend, TREND_VALUES, "unknown"),
    structure: enumOf(parsed.structure, STRUCTURE_VALUES, "unknown"),
    higherTimeframeBias: enumOf(parsed.higherTimeframeBias, BIAS_VALUES, "unknown"),
    regime: enumOf(parsed.regime, REGIME_VALUES, "unknown"),
    keyLevels: {
      support: numArray(supportRaw).map((n) => String(n)),
      resistance: numArray(resistanceRaw).map((n) => String(n)),
    },
    candlePatterns: stringArray(parsed.candlePatterns),
    momentum: enumOf(parsed.momentum, MOMENTUM_VALUES, "unknown"),
    volatility: enumOf(parsed.volatility, VOLATILITY_VALUES, "unknown"),
    direction,
    entry: str(parsed.entry, 40),
    stopLoss: str(parsed.stopLoss, 40),
    takeProfit: str(parsed.takeProfit, 40),
    riskReward: str(parsed.riskReward, 20),
    confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
    newsRisk:
      String(parsed.newsRisk).toLowerCase() === "high"
        ? "high"
        : String(parsed.newsRisk).toLowerCase() === "low"
          ? "low"
          : "unknown",
    reasoning: str(parsed.reasoning, 800) || "",
  };
}
