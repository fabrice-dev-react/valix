"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fileToResizedDataUrl } from "@/lib/clientImage";

type ConfluenceFactor = {
  name: string;
  met: boolean;
};

type Plan = {
  confidence: number;
  confluence: ConfluenceFactor[];
  confluenceCount: number;
  grade: "A+" | "A" | "B" | "C" | "AVOID";
  verdict: "TRADE" | "CAUTION" | "AVOID";
  issues: string[];
  riskReward: string | null;
  effectiveRR: number | null;
  positionAdvice: string;
  newsAdvice: string;
  note: string;
};

type MarketContextData = {
  instrument: string;
  currencies: string[];
  style: "scalper" | "intraday" | "swing";
  session: {
    name: string | null;
    overlap: string | null;
    note: string;
    open: boolean;
  };
  nextHighImpact: {
    title: string;
    country: string;
    date: string;
    timeToEventMin: number;
    forecast?: string;
  } | null;
  riskState: "HIGH" | "NORMAL" | "QUIET";
  riskReason: string;
  error: string | null;
};

type Signal = {
  market: string;
  timeframe: string;
  direction: "BUY" | "SELL" | "NEUTRAL";
  entry: string | null;
  stopLoss: string | null;
  takeProfit: string | null;
  confidence: number;
  riskReward: string | null;
  reasoning: string;
  trend: string;
  structure: string;
  higherTimeframeBias: string;
  regime: string;
  keyLevels: { support: string[]; resistance: string[] };
  candlePatterns: string[];
  momentum: string;
  volatility: string;
  newsRisk: string;
  plan: Plan;
};

const PENDING_KEY = "valix.pendingChart";

const analysisSteps = [
  { label: "Reading your chart", detail: "Detecting the asset, timeframe and price scale" },
  { label: "Checking the news", detail: "Economic calendar and session context for this market" },
  { label: "Mapping structure", detail: "Trend, key levels and market regime" },
  { label: "Scoring confluence", detail: "Counting aligned factors and applying the filters" },
  { label: "Building the trade plan", detail: "Entry, stop, target, grade and risk advice" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Signal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [marketCtx, setMarketCtx] = useState<MarketContextData | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=1");
    }
  }, [status, router]);

  const runAnalysis = useCallback(async (dataUrl: string) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);
    setStepIndex(0);
    setProgress(0);

    const start = performance.now();
    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(96, (elapsed / 22000) * 100));
      setStepIndex(Math.min(4, Math.floor(elapsed / 4400)));
    }, 200);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      setProgress(100);
      setStepIndex(5);
      setResult(data.analysis as Signal);
      setMarketCtx((data.marketContext as MarketContextData | null) ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      clearInterval(timer);
      setAnalyzing(false);
      setTimeout(() => setProgress(0), 400);
    }
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const pending = sessionStorage.getItem(PENDING_KEY);
    if (pending) {
      sessionStorage.removeItem(PENDING_KEY);
      setPreview(pending);
    }
  }, []);

  const handleFile = async (file: File) => {
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setPreview(dataUrl);
      setResult(null);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "That file couldn't be read.");
    }
  };

  const startAnalysis = () => {
    if (preview && !analyzing) runAnalysis(preview);
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setMarketCtx(null);
    setCopied(null);
  };

  const copyValue = async (v: string | null, i: number) => {
    if (!v) return;
    try {
      await navigator.clipboard.writeText(v);
      setCopied(i);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  const firstName = session?.user?.name?.split(" ")[0] || "trader";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const strengthLabel =
    result && (result.plan.grade === "A+" || result.plan.grade === "A")
      ? "Strong signal"
      : result && result.plan.grade === "B"
        ? "Okay signal — trade small"
        : "Weak — best to skip";

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            One moment
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="pt-2 lg:pt-8">
        
        <h1 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">
          {greeting}, {firstName}
        </h1>
   <p className="mt-3 text-[15px] text-ink-soft max-w-md">
  Upload a chart screenshot and get a complete trade setup with entry,
  stop loss, take profits, confidence score, and reasoning.
</p>
      </div>

      {/* Setup: options + drop zone */}
      {!analyzing && !result && (
        <div className="mt-8 rounded-3xl bg-paper border border-line shadow-[0_12px_40px_-12px_rgba(22,19,17,0.08)] p-2 sm:p-3">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={`w-full rounded-[20px] border-2 border-dashed px-6 py-12 sm:py-16 transition-all duration-200 cursor-pointer group ${
            dragOver
              ? "border-signal bg-signal-soft/40 scale-[1.005]"
              : "border-line hover:border-signal/50 hover:bg-white"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />

          {preview ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={preview}
                  alt="Your chart screenshot"
                  className="max-h-[300px] w-auto rounded-xl border border-line bg-cream"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  aria-label="Remove image"
                  title="Remove image"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center shadow-md hover:bg-black active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <span className="text-[13px] font-semibold text-ink">
                Ready — drop another to replace it
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="w-16 h-16 rounded-2xl bg-signal-soft flex items-center justify-center group-hover:bg-signal/15 transition-colors shadow-sm">
                <svg className="w-7 h-7 text-signal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 15a2 2 0 002 2h14a2 2 0 002-2m-3-4l-5-5-5 5m5-5v9" />
                </svg>
              </span>
              <span className="mt-5 block text-lg font-bold text-ink">
                Drop your chart screenshot
              </span>
              <span className="mt-1 block text-[13.5px] text-ink-soft">
                or click to browse — PNG or JPG, any asset, any timeframe
              </span>
              <span className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ink text-white text-[14px] font-semibold group-hover:bg-black group-hover:shadow-lg transition-all">
                Upload chart
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </span>
            </div>
          )}
        </div>
        {preview && (
          <div className="px-4 py-4">
            <button
              onClick={startAnalysis}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-ink text-white text-[15px] font-bold hover:bg-black active:scale-[0.99] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze chart
            </button>
          </div>
        )}
        </div>
      )}

      {/* Error */}
      {error && !analyzing && (
        <div className="mt-6 rounded-xl bg-signal-soft border border-signal/20 px-4 py-3 flex items-center gap-3">
          <svg className="w-4 h-4 text-signal-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-[13px] font-medium text-signal-dark flex-1">{error}</p>
        </div>
      )}

      {/* Progress / steps */}
      {analyzing && (
        <div className="mt-6 rounded-3xl bg-paper border border-line shadow-[0_12px_40px_-12px_rgba(22,19,17,0.08)] px-6 sm:px-8 py-7">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Analyzing your chart
            </p>
            <p className="font-mono text-[11px] text-signal-dark font-semibold tabular-nums">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="mt-3 h-1.5 w-full bg-mist rounded-full overflow-hidden">
            <div
              className="h-full bg-signal rounded-full transition-[width] duration-200 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-7 space-y-0">
            {analysisSteps.map((step, i) => {
              const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
              return (
                <div
                  key={step.label}
                  className={`relative flex gap-4 pb-8 last:pb-0 ${
                    i !== analysisSteps.length - 1
                      ? "before:absolute before:left-[15px] before:top-8 before:bottom-0 before:w-px before:bg-line"
                      : ""
                  }`}
                >
                  <div className="relative shrink-0">
                    <span
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                        state === "done"
                          ? "bg-signal border-signal"
                          : state === "active"
                            ? "border-signal bg-white shadow-[0_0_0_4px_rgba(255,77,47,0.12)]"
                            : "border-line bg-paper"
                      }`}
                    >
                      {state === "done" ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : state === "active" ? (
                        <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-line" />
                      )}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <p
                      className={`text-[15px] font-semibold transition-colors duration-300 ${
                        state === "pending" ? "text-ink-soft/40" : "text-ink"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`mt-0.5 text-[13px] transition-colors duration-300 ${
                        state === "pending" ? "text-ink-soft/30" : "text-ink-soft"
                      }`}
                    >
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result */}
      {result && !analyzing && (
        <div className="mt-6 rounded-3xl bg-paper border border-line shadow-[0_12px_40px_-12px_rgba(22,19,17,0.08)] overflow-hidden relative">
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-signal/10 blur-3xl"
            aria-hidden="true"
          />

          {/* The call */}
          <div className="relative px-6 sm:px-8 pt-7 flex items-start justify-between gap-4">
            <div>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[18px] font-extrabold tracking-tight ${
                  result.direction === "BUY"
                    ? "bg-[#34b36b]/15 text-[#1e8a4f]"
                    : result.direction === "SELL"
                      ? "bg-signal/15 text-signal-dark"
                      : "bg-mist text-ink-soft"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {result.direction === "BUY" ? "BUY" : result.direction === "SELL" ? "SELL" : "WAIT"}
              </span>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                {result.market} · {result.timeframe}
                {marketCtx ? ` · ${marketCtx.style} trading` : ""}
              </p>
              <p className="mt-1.5 text-[14px] font-semibold text-ink">{strengthLabel}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[32px] leading-none font-extrabold tabular-nums text-[#2563eb]">
                {result.plan.confidence}%
              </p>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">
                confidence
              </p>
            </div>
          </div>

          {/* Levels */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 sm:px-8 py-6">
            {[
              { k: "Enter at", v: result.entry, copy: true },
              { k: "Stop loss", v: result.stopLoss, copy: true },
              { k: "Take profit", v: result.takeProfit, copy: true },
              { k: "Risk : Reward", v: result.plan.riskReward || result.riskReward, copy: false },
            ].map(({ k, v, copy }, i) => (
              <div key={k} className="relative rounded-xl bg-cream border border-line px-3 py-4 text-center">
                {copy && (
                  <button
                    onClick={() => copyValue(v, i)}
                    title="Copy"
                    aria-label={`Copy ${k}`}
                    className="absolute top-2 right-2 p-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-line transition-colors"
                  >
                    {copied === i ? (
                      <svg className="w-3.5 h-3.5 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    )}
                  </button>
                )}
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">{k}</p>
                <p className={`mt-1.5 text-[15px] font-bold font-mono tabular-nums text-ink ${copy ? "pr-4" : ""}`}>
                  {v || "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Why */}
          <div className="relative px-6 sm:px-8 pb-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">Why</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{result.reasoning}</p>
          </div>

          <div className="relative px-6 sm:px-8 pb-8 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={reset}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-ink text-white text-[13px] font-semibold hover:bg-black active:scale-[0.98] transition-all"
            >
              Analyze another chart
            </button>
        
          </div>
        </div>
      )}
    </div>
  );
}
