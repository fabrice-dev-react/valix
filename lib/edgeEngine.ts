import type { MarketContext } from "./marketContext";

export type TradingStyle = "scalper" | "intraday" | "swing";
export type Direction = "BUY" | "SELL" | "NEUTRAL";
export type Verdict = "TRADE" | "CAUTION" | "AVOID";
export type Grade = "A+" | "A" | "B" | "C" | "AVOID";
export type Trend = "up" | "down" | "sideways" | "unknown";
export type Structure = "HHHL" | "LHLL" | "range" | "choppy" | "unknown";
export type Bias = "bullish" | "bearish" | "neutral" | "unknown";
export type Regime = "trending" | "ranging" | "volatile" | "unknown";
export type Momentum = "strong" | "moderate" | "weak" | "unknown";
export type Volatility = "high" | "normal" | "low" | "unknown";

export interface KeyLevels {
  support: string[];
  resistance: string[];
}

export interface Reading {
  market: string;
  timeframe: string;
  trend: Trend;
  structure: Structure;
  higherTimeframeBias: Bias;
  regime: Regime;
  keyLevels: KeyLevels;
  candlePatterns: string[];
  momentum: Momentum;
  volatility: Volatility;
  direction: Direction;
  entry: string | null;
  stopLoss: string | null;
  takeProfit: string | null;
  riskReward: string | null;
  confidence: number;
  newsRisk: "none" | "low" | "high" | "unknown";
  reasoning: string;
}

export interface ConfluenceFactor {
  name: string;
  met: boolean;
}

export interface ScoredPlan {
  confidence: number;
  confluence: ConfluenceFactor[];
  confluenceCount: number;
  grade: Grade;
  verdict: Verdict;
  issues: string[];
  riskReward: string | null;
  effectiveRR: number | null;
  positionAdvice: string;
  newsAdvice: string;
  note: string;
}

export interface StyleProfile {
  key: TradingStyle;
  label: string;
  timeframes: string[];
  minRR: number;
  minConfluence: number;
  minConfidence: number;
  positionAdvice: string;
  newsAdvice: string;
}

export const STYLE_PROFILES: Record<TradingStyle, StyleProfile> = {
  scalper: {
    key: "scalper",
    label: "Scalper",
    timeframes: ["M1", "M5", "M15"],
    minRR: 1.2,
    minConfluence: 2,
    minConfidence: 45,
    positionAdvice:
      "Trade small size and take profit fast. Risk 0.25-0.5% of the account per scalp and exit at the first sign of stall — do not let a winning scalp turn into a losing swing trade.",
    newsAdvice:
      "Never enter in the 20 minutes before a High-impact release and wait 20 minutes after it. Scalps get destroyed by volatility spikes and spreads.",
  },
  intraday: {
    key: "intraday",
    label: "Intraday",
    timeframes: ["M15", "M30", "H1"],
    minRR: 1.3,
    minConfluence: 2,
    minConfidence: 50,
    positionAdvice:
      "Risk 0.5-1% of the account per trade. Take partial profit at the first target and trail the remainder — let winners run to a 2R+ reward.",
    newsAdvice:
      "Check today's calendar before trading. Avoid entering inside the 45-minute window around High-impact releases and do not hold through a rate decision or CPI without a clear plan.",
  },
  swing: {
    key: "swing",
    label: "Swing",
    timeframes: ["H4", "D1", "W1"],
    minRR: 1.5,
    minConfluence: 3,
    minConfidence: 50,
    positionAdvice:
      "Risk 1% or less per trade. Place stops beyond the swing structure, never on noise, and size so a full 2R loss stays within the monthly risk budget.",
    newsAdvice:
      "A High-impact event (rate decision, CPI, NFP) inside your intended holding window can invalidate the thesis. Check the calendar before opening and avoid holding through the event.",
  },
};

export function resolveStyle(
  style: TradingStyle | "auto" | undefined,
  timeframe?: string
): TradingStyle {
  if (style === "scalper" || style === "intraday" || style === "swing") return style;
  const tf = (timeframe || "").toUpperCase();
  if (tf === "M1" || tf === "M5" || tf === "M15") return "scalper";
  if (tf === "H4" || tf === "D1" || tf === "W1") return "swing";
  return "intraday";
}

function toNumber(v: string | null | undefined): number | null {
  if (v == null) return null;
  const m = String(v).replace(/[^0-9.]/g, "");
  if (!m) return null;
  const n = parseFloat(m);
  return Number.isFinite(n) ? n : null;
}

function parseRRString(v: string | null | undefined): number | null {
  if (!v) return null;
  const m = String(v).match(/1[:/](\d+(?:\.\d+)?)/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

function levelNear(
  price: number | null,
  levels: string[],
  tolerance: number
): boolean {
  if (price == null || !levels?.length) return false;
  return levels.some((lv) => {
    const n = toNumber(lv);
    return n != null && Math.abs(n - price) / price <= tolerance;
  });
}

export function scoreSetup(
  reading: Reading,
  ctx: MarketContext | null
): ScoredPlan {
  const profile = STYLE_PROFILES[ctx?.style ?? resolveStyle(undefined, reading.timeframe)];
  const isBuy = reading.direction === "BUY";
  const isSell = reading.direction === "SELL";
  const directional = isBuy || isSell;
  const issues: string[] = [];

  if (!directional) {
    return {
      confidence: Math.min(reading.confidence, 35),
      confluence: [],
      confluenceCount: 0,
      grade: "C",
      verdict: "AVOID",
      issues: ["No directional edge detected on this chart — the model returned NEUTRAL. Do not force a trade."],
      riskReward: reading.riskReward,
      effectiveRR: null,
      positionAdvice: profile.positionAdvice,
      newsAdvice: profile.newsAdvice,
      note: "Stand aside. No setup meets the minimum bar.",
    };
  }

  const trendMet = isBuy ? reading.trend === "up" : isSell ? reading.trend === "down" : false;
  const structureMet = isBuy
    ? reading.structure === "HHHL"
    : isSell
      ? reading.structure === "LHLL"
      : false;
  const htfMet = isBuy
    ? reading.higherTimeframeBias === "bullish"
    : isSell
      ? reading.higherTimeframeBias === "bearish"
      : false;

  const entryNum = toNumber(reading.entry);
  const tolerance = 0.005;
  const levelMet = isBuy
    ? levelNear(entryNum, reading.keyLevels?.support ?? [], tolerance)
    : isSell
      ? levelNear(entryNum, reading.keyLevels?.resistance ?? [], tolerance)
      : false;

  const patternMet = (reading.candlePatterns?.length ?? 0) > 0;
  const momentumMet = reading.momentum === "strong" || reading.momentum === "moderate";
  const volatilityMet = reading.volatility !== "high";
  const regimeMet =
    reading.regime === "trending" ||
    reading.regime === "ranging" ||
    reading.regime === "unknown";

  const confluence: ConfluenceFactor[] = [
    { name: "Trend aligned", met: trendMet },
    { name: "Structure aligned", met: structureMet },
    { name: "Higher-timeframe bias", met: htfMet },
    { name: "Entry at key level", met: levelMet },
    { name: "Candle pattern", met: patternMet },
    { name: "Momentum support", met: momentumMet },
    { name: "Volatility manageable", met: volatilityMet },
    { name: "Clean regime", met: regimeMet },
  ];
  const count = confluence.filter((f) => f.met).length;

  let conf = 30 + count * 8;
  if (reading.momentum === "strong") conf += 5;
  if (trendMet) conf += 3;
  if (htfMet) conf += 3;
  if (patternMet) conf += 2;

  const modelConf = Math.max(0, Math.min(100, reading.confidence || 0));
  let finalConf = Math.round(conf * 0.55 + modelConf * 0.45);

  let effRR: number | null = null;
  const entry = toNumber(reading.entry);
  const sl = toNumber(reading.stopLoss);
  const tp = toNumber(reading.takeProfit);
  if (entry != null && sl != null) {
    const risk = Math.abs(entry - sl);
    if (risk > 0) {
      if (tp != null) effRR = Math.abs(tp - entry) / risk;
      else effRR = parseRRString(reading.riskReward);
    }
  }
  if (effRR == null) effRR = parseRRString(reading.riskReward);
  if (effRR != null && Number.isFinite(effRR)) {
    effRR = Math.round(effRR * 10) / 10;
  }

  if (isBuy && entry != null && sl != null && sl >= entry)
    issues.push("Stop loss is not below the entry for a BUY — check the placement.");
  if (isSell && entry != null && sl != null && sl <= entry)
    issues.push("Stop loss is not above the entry for a SELL — check the placement.");
  if (isBuy && entry != null && tp != null && tp <= entry)
    issues.push("Take profit is not above the entry for a BUY — check the target.");
  if (isSell && entry != null && tp != null && tp >= entry)
    issues.push("Take profit is not below the entry for a SELL — check the target.");

  let hardBlock = false;
  let newsWarning = false;
  let rrLow = false;

  if (ctx) {
    if (ctx.riskState === "HIGH") {
      hardBlock = true;
      finalConf = Math.min(finalConf, 25);
      issues.push(
        `High-impact news is active for ${ctx.currencies.join("/")} right now (${ctx.riskReason}). Avoid entering — wait for the release to settle.`
      );
    }
    if (ctx.nextHighImpact && !hardBlock) {
      const mins = ctx.nextHighImpact.timeToEventMin;
      if (mins >= 0 && mins <= 120) {
        newsWarning = true;
        finalConf -= 5;
        issues.push(
          `High-impact event ${ctx.nextHighImpact.title} (${ctx.nextHighImpact.country}) is ~${mins} min away — it can invalidate the setup.`
        );
      } else if (mins > 120 && mins <= 360) {
        finalConf -= 3;
      }
    }
    if (ctx.windows.some((w) => w.isActive && w.impact === "Medium")) {
      newsWarning = true;
      finalConf -= 4;
      issues.push("A medium-impact release is active for this market — expect noise and widened spreads.");
    }
    if (!ctx.session.open && ctx.currencies.some((c) => c !== "CRYPTO")) {
      finalConf -= 5;
      issues.push("The market is currently closed (weekend). Levels can gap when trading reopens.");
    }
  }

  if (effRR != null) {
    if (effRR < profile.minRR) {
      rrLow = true;
      issues.push(`Reward profile is weak (1:${effRR}) — below the ${profile.minRR} floor for ${profile.label}.`);
    } else if (effRR >= 2.5) {
      finalConf += 2;
    }
  }

  if (count < profile.minConfluence) {
    issues.push(`Only ${count}/${confluence.length} confluence factors are met — below the ${profile.minConfluence} needed for ${profile.label}.`);
  }
  if (finalConf < profile.minConfidence) {
    issues.push(`Confidence (${finalConf}%) is below the ${profile.minConfidence}% floor for ${profile.label}.`);
  }

  if (hardBlock) {
    return {
      confidence: Math.max(0, Math.min(100, finalConf)),
      confluence,
      confluenceCount: count,
      grade: "AVOID",
      verdict: "AVOID",
      issues,
      riskReward: reading.riskReward,
      effectiveRR: effRR,
      positionAdvice: "Stand aside. Entering into this news window is a lottery ticket, not a trade.",
      newsAdvice: profile.newsAdvice,
      note: "Blocked by the news filter — no trade.",
    };
  }

  let grade: Grade;
  if (finalConf >= 75 && count >= 5) grade = "A+";
  else if (finalConf >= 65) grade = "A";
  else if (finalConf >= 55) grade = "B";
  else grade = "C";

  if (rrLow && (grade === "A+" || grade === "A")) grade = "B";
  if (newsWarning && grade === "A+") grade = "A";
  if (finalConf < profile.minConfidence && grade !== "C") grade = "B";
  if (count < profile.minConfluence && grade === "A+") grade = "A";

  let verdict: Verdict = "TRADE";
  if (grade === "B" || grade === "C") verdict = "CAUTION";
  if (finalConf < 40) verdict = "AVOID";

  const noteParts: string[] = [];
  if (count > 0) noteParts.push(`${count} of ${confluence.length} confluence factors are met`);
  else noteParts.push("No confluence factors are met");
  if (trendMet) noteParts.push("trend");
  if (htfMet) noteParts.push("higher timeframe");
  if (patternMet) noteParts.push("pattern");
  if (levelMet) noteParts.push("key level");
  if (effRR != null) noteParts.push(`${effRR >= 1 ? "1:" + effRR : "poor"} reward profile`);

  const note =
    noteParts.join(", ") +
    (finalConf >= 65 && !newsWarning && !rrLow
      ? " — a strong, high-conviction setup."
      : " — trade with care.");

  return {
    confidence: Math.max(0, Math.min(100, finalConf)),
    confluence,
    confluenceCount: count,
    grade,
    verdict,
    issues,
    riskReward: effRR != null ? `1:${effRR}` : reading.riskReward,
    effectiveRR: effRR,
    positionAdvice: profile.positionAdvice,
    newsAdvice: profile.newsAdvice,
    note,
  };
}
