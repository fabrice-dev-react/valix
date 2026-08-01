"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import LoginOverlay from "@/components/LoginOverlay";
import { fileToResizedDataUrl } from "@/lib/clientImage";

function Stars({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className={`${className} text-signal`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-signal-dark font-semibold">
      {children}
    </p>
  );
}

const checkIcon = (
  <svg className="w-3.5 h-3.5 text-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const steps = [
  {
    number: "01",
    title: "Upload your chart",
    desc: "Screenshot from your broker or charting platform — forex, indices, gold, crypto or stocks. Any pair, any timeframe. We detect the asset for you.",
  },
  {
    number: "02",
    title: "It reads the whole market",
    desc: "Valix scans the chart for trend, structure and key support & resistance — and checks the live economic news calendar for that exact market, plus which trading sessions are open right now.",
  },
  {
    number: "03",
    title: "It filters out the danger",
    desc: "Big news release near? Counter-trend chart? Weak reward? Valix holds you back and explains why — so you never trade into the windows that wipe out accounts.",
  },
  {
    number: "04",
    title: "One clear signal",
    desc: "Buy or sell, with an entry, a stop loss that respects structure, take-profit targets and an honest confidence score.",
  },
];

const features = [
  {
    title: "Reads the whole chart, not just the candles",
    desc: "Valix weighs trend, structure, key levels and candle patterns together, so the call reflects the full picture — not a single indicator flashing a random buy or sell.",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Signals you can actually trade",
    desc: "A clear direction with an entry zone, a stop that sits below real structure and take-profit levels targeting actual liquidity. Nothing vague, nothing to guess at.",
    span: "",
  },
  {
    title: "Every market, every timeframe",
    desc: "Forex pairs, indices, gold, crypto and stocks — from 1-minute scalps to weekly swings. Drop in a screenshot and it adapts to the asset and the timeframe.",
    span: "",
  },
  {
    title: "Confidence that's honest",
    desc: "Every signal carries a 0–100 confidence score, so you know which setups deserve your size — and which are worth passing on entirely.",
    span: "",
  },
  {
    title: "Reasons, not just results",
    desc: "Each call explains the levels it found and the logic behind them, so you can agree or disagree before you risk a single cent.",
    span: "",
  },
  {
    title: "Share the trade with your team",
    desc: "One click copies the full trade plan — pair, direction, entry, stop, targets — straight into your group chat or trading journal.",
    span: "",
  },
];

const plans = [
  {
    name: "Pro",
    tagline: "Everything Valix does, in one plan",
    price: 39,
    cta: "Start for $39/month",
    features: [
      "Unlimited chart analyses",
      "Forex, indices, crypto, gold & stocks",
      "Buy/sell with entry, stop & take profit",
      "Confidence score on every signal",
      "Market reasoning behind each call",
      "Export & share trade plans",
    ],
  },
];

const testimonials = [
  {
    quote:
      "I was stuck flipping tiny lots for months and going nowhere. Valix kept me out of the news-window traps and pointed me at clean setups — in two months I banked $17k trading gold. The stops finally sit where they should.",
    name: "Sarah Chen",
    role: "Pro trader, Halcyon Capital",
    featured: true,
  },
  {
    quote:
      "I took $11,400 out of the market in one month on EUR/USD scalps. What sold me is the news filter — it tells me to sit on my hands when it matters instead of letting me donate to the market.",
    name: "Marcus Williams",
    role: "Owner, Brightline Trading",
  },
  {
    quote:
      "The stop placement alone is worth it. I stopped giving back winners and pulled $9,200 of profit off my NAS100 swings last quarter.",
    name: "Jessica Park",
    role: "Trader, Northbound",
  },
  {
    quote:
      "It gave me reasons, not just a call, and it reads the crypto news for me. I've been averaging $2k a month since I started using it.",
    name: "Diego Alvarez",
    role: "Swing trader, Kite & Co",
  },
];

const faqs = [
  {
    q: "Which markets does Valix support?",
    a: "Forex pairs, indices, gold and other commodities, crypto and stocks. Screenshot the chart from your broker or charting platform — Valix adapts to the asset and the timeframe automatically.",
  },
  {
    q: "Does Valix tell me when to trade?",
    a: "No. Valix is an analysis tool, not an automated signal service. It reads your screenshot and gives you a setup with entry, stop, targets and confidence — you stay in control of every decision and every trade.",
  },
  {
    q: "What does a signal actually include?",
    a: "A direction (buy or sell), an entry zone, a stop loss, take-profit targets and a confidence score. Each signal also explains the levels and logic behind the call, so nothing arrives as a mystery.",
  },
  {
    q: "What's different from other signal tools?",
    a: "Most services guess from a single indicator or fire generic alerts. Valix analyzes the actual chart you screenshot — trend, structure, key levels and candle patterns together — and returns reasoning you can verify yourself.",
  },
  {
    q: "Can I try it before paying?",
    a: "Valix is $39/month. Start a subscription and you get everything from day one — unlimited analyses, every market, the full trade plan. Cancel anytime, no questions asked.",
  },
  {
    q: "What kind of results should I expect?",
    a: "Valix is a second opinion that reads a chart in seconds and shows you the levels it sees. Nothing replaces your own discipline, risk management or market judgment — and no tool can guarantee results.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-ink pr-4">{q}</span>
        <span
          className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-full border transition-all duration-200 ${
            open ? "bg-ink border-ink text-white rotate-45" : "border-line text-ink-soft"
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[15px] leading-relaxed text-ink-soft">{a}</p>
        </div>
      </div>
    </div>
  );
}

type Candle = { o: number; h: number; l: number; c: number };

const EUR_USD_CANDLES: Candle[] = [
  { o: 1.0841, h: 1.0849, l: 1.0836, c: 1.0844 },
  { o: 1.0844, h: 1.0847, l: 1.0832, c: 1.0835 },
  { o: 1.0835, h: 1.0841, l: 1.0828, c: 1.0831 },
  { o: 1.0831, h: 1.0836, l: 1.0824, c: 1.0830 },
  { o: 1.0830, h: 1.0839, l: 1.0827, c: 1.0837 },
  { o: 1.0837, h: 1.0848, l: 1.0835, c: 1.0846 },
  { o: 1.0846, h: 1.0859, l: 1.0844, c: 1.0857 },
  { o: 1.0857, h: 1.0871, l: 1.0855, c: 1.0869 },
];

const NAS100_CANDLES: Candle[] = [
  { o: 19880, h: 19940, l: 19855, c: 19925 },
  { o: 19925, h: 20010, l: 19910, c: 19995 },
  { o: 19995, h: 20060, l: 19940, c: 19960 },
  { o: 19960, h: 20015, l: 19905, c: 19920 },
  { o: 19920, h: 19950, l: 19830, c: 19845 },
  { o: 19845, h: 19880, l: 19740, c: 19765 },
  { o: 19765, h: 19805, l: 19690, c: 19710 },
  { o: 19710, h: 19730, l: 19605, c: 19622 },
];

function MiniChart({ candles, className = "" }: { candles: Candle[]; className?: string }) {
  const W = 320;
  const H = 140;
  const pad = 8;
  const lows = candles.map((c) => c.l);
  const highs = candles.map((c) => c.h);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const range = max - min || 1;
  const y = (v: number) => pad + ((max - v) / range) * (H - pad * 2);
  const slot = (W - pad * 2) / candles.length;
  const cw = Math.min(16, slot * 0.55);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="none">
      {candles.map((c, i) => {
        const x = pad + i * slot + (slot - cw) / 2;
        const xm = pad + i * slot + slot / 2;
        const up = c.c >= c.o;
        const color = up ? "#34b36b" : "#ff6b52";
        const yO = y(c.o);
        const yC = y(c.c);
        const top = Math.min(yO, yC);
        const bodyH = Math.max(1.5, Math.abs(yC - yO));
        return (
          <g key={i}>
            <line x1={xm} x2={xm} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1.5} />
            <rect x={x} y={top} width={cw} height={bodyH} rx={1.5} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

function SignalCard({
  pair,
  timeframe,
  direction,
  entry,
  stop,
  target,
  confidence,
  candles,
}: {
  pair: string;
  timeframe: string;
  direction: "BUY" | "SELL";
  entry: string;
  stop: string;
  target: string;
  confidence: number;
  candles: Candle[];
}) {
  const buy = direction === "BUY";
  return (
    <div className="rounded-2xl border border-white/10 bg-ink text-white overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            {pair} · {timeframe}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
                buy ? "bg-[#34b36b]/20 text-[#5fd697]" : "bg-signal/25 text-signal"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {direction}
            </span>
            <span className="text-[12px] text-white/50">confidence</span>
            <span className="text-[14px] font-bold tabular-nums">{confidence}%</span>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
          Valix
        </span>
      </div>

      <MiniChart candles={candles} className="mt-4 w-full h-36 px-1.5" />

      <div className="grid grid-cols-3 gap-2 px-5 py-4">
        {[
          ["Entry", entry],
          ["Stop loss", stop],
          ["Take profit", target],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">{k}</p>
            <p className="mt-0.5 text-[13px] font-bold font-mono tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
  const inputRef = useRef<HTMLInputElement>(null);
  const [loginOpen, setLoginOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.has("login") || params.has("error");
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (loginOpen) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [loginOpen]);

  const handleCTA = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      setLoginOpen(true);
    }
  };

  const handleFile = async (file: File) => {
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      sessionStorage.setItem("valix.pendingChart", dataUrl);
      setPreview(dataUrl);
      if (isLoggedIn) {
        router.push("/dashboard");
      } else {
        setLoginOpen(true);
      }
    } catch {
      // ignore invalid files
    }
  };

  return (
    <div className="bg-cream text-ink overflow-x-clip">
      {/* ============ HERO ============ */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[680px] max-w-full rounded-full bg-signal/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                <Eyebrow>From screenshot to trade in seconds</Eyebrow>
              </div>

              <h1 className="mt-7 text-[36px] sm:text-5xl md:text-[56px] lg:text-[62px] font-extrabold tracking-[-0.03em] leading-[1.08] text-ink">
                From any chart screenshot to{" "}
                <span className="relative inline-block whitespace-nowrap align-baseline">
                  <span className="relative z-10 text-signal">your next profitable trade</span>
                  <span className="absolute left-0 bottom-[0.06em] right-0 h-[0.16em] bg-signal/20 rounded-sm z-0" />
                </span>
                .
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-soft max-w-xl mx-auto">
                You don&apos;t have to learn trading to make money. Valix AI is
                trained enough to make you profitable. Just give us your chart
                screenshot.
              </p>

              <div className="mt-9 max-w-5xl mx-auto">
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
                  className={`w-full rounded-3xl border-2 border-dashed bg-paper/80 px-6 py-10 sm:py-14 transition-all duration-200 cursor-pointer group ${
                    dragOver
                      ? "border-signal bg-signal-soft/40 scale-[1.01]"
                      : "border-line hover:border-signal/50 hover:bg-paper"
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
                      <img
                        src={preview}
                        alt="Your chart screenshot"
                        className="max-h-[260px] w-auto rounded-xl border border-line bg-cream"
                      />
                      <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
                        {isLoggedIn
                          ? "Opening your dashboard to analyze…"
                          : "Sign in to analyze this chart"}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="w-14 h-14 rounded-2xl bg-signal-soft flex items-center justify-center group-hover:bg-signal/15 transition-colors">
                        <svg className="w-6 h-6 text-signal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 15a2 2 0 002 2h14a2 2 0 002-2m-3-4l-5-5-5 5m5-5v9" />
                        </svg>
                      </span>
                      <span className="mt-4 block text-lg font-bold text-ink">
                        Drop your chart screenshot
                      </span>
                      <span className="mt-1 block text-[13.5px] text-ink-soft">
                        or click to browse — PNG or JPG, any asset, any timeframe
                      </span>
                      <span className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-[14px] font-semibold group-hover:bg-black transition-colors">
                        Upload chart
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2.5">
                  <Stars />
                  <p className="text-[13px] text-ink-soft">
                    <span className="font-semibold text-ink">4.9</span> from 1,800+ traders
                  </p>
                </div>
                <div className="hidden sm:block h-4 w-px bg-line" />
                <p className="text-[13px] text-ink-soft">
                  Trained on 40,000+ annotated market setups
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SIGNAL SHOWCASE ============ */}
      <section className="border-y border-line bg-paper py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-signal" />
                <Eyebrow>See what Valix returns</Eyebrow>
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink max-w-xl">
                One screenshot in. A full trade plan out.
              </h2>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-lg">
                Every analysis comes back as a clear, copy-paste trade plan —
                direction, entry, stop loss, targets and the reasoning behind
                them. No jargon, no guesswork.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  "Buy or sell — never ambiguous",
                  "Entry, stop & take-profit levels on every signal",
                  "Confidence score so you size the trade honestly",
                  "Reasoning you can verify against the chart yourself",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-moss/10 flex items-center justify-center">
                      {checkIcon}
                    </span>
                    <span className="text-[14.5px] text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                <SignalCard
                  pair="EUR/USD"
                  timeframe="H1"
                  direction="BUY"
                  entry="1.0845"
                  stop="1.0789"
                  target="1.0932"
                  confidence={78}
                  candles={EUR_USD_CANDLES}
                />
                <SignalCard
                  pair="US100 (NAS100)"
                  timeframe="M15"
                  direction="SELL"
                  entry="19,845"
                  stop="19,930"
                  target="19,610"
                  confidence={64}
                  candles={NAS100_CANDLES}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF MARQUEE ============ */}
      <section className="border-y border-line bg-paper/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft mb-6">
            Traders at these firms analyze with Valix
          </p>
          <div className="relative overflow-hidden">
            <div className="flex gap-14 w-max animate-marquee">
              {[
                "Halcyon Capital",
                "Brightline Trading",
                "Northbound",
                "Kite & Co",
                "Meridian FX",
                "Veridian Futures",
                "Copperline",
                "Onyx Markets",
              ].concat([
                "Halcyon Capital",
                "Brightline Trading",
                "Northbound",
                "Kite & Co",
                "Meridian FX",
                "Veridian Futures",
                "Copperline",
                "Onyx Markets",
              ]).map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="text-lg font-bold tracking-tight text-ink/30 hover:text-ink/60 transition-colors whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent" />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-signal" />
                  <Eyebrow>How it works</Eyebrow>
                </div>
                <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
                  From screenshot to setup in about thirty seconds
                </h2>
                <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-md">
                  No indicators to configure. No platform to install. Valix
                  reads your chart, scans the news for that market and filters
                  the risk before you trade — the whole flow runs itself.
                </p>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-paper px-4 py-2">
                  <span className="font-mono text-xs text-ink-soft">avg. time</span>
                  <span className="font-mono text-sm font-bold text-ink">&lt; 30s</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-0">
                {steps.map((step, i) => (
                  <div key={step.number} className="relative flex gap-6 pb-10 last:pb-0">
                    {i < steps.length - 1 && (
                      <span className="absolute left-[27px] top-12 bottom-0 w-px bg-line" />
                    )}
                    <div className="w-14 h-14 shrink-0 rounded-full border border-line bg-paper flex items-center justify-center font-mono text-sm font-bold text-ink">
                      {step.number}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-bold tracking-tight text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES (BENTO) ============ */}
      <section id="features" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Features</Eyebrow>
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Built for traders who want an edge every single day
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`relative bg-cream border border-line rounded-2xl p-6 md:p-8 transition-all duration-200 hover:border-ink/20 hover:shadow-[0_24px_48px_-24px_rgba(22,19,17,0.2)] ${
                  feature.span || ""
                }`}
              >
                <span className="font-mono text-[11px] text-ink-soft/70">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {i === 0 && (
                  <div className="mt-6">
                    <SignalCard
                      pair="XAU/USD"
                      timeframe="H4"
                      direction="BUY"
                      entry="2,342.6"
                      stop="2,328.0"
                      target="2,371.4"
                      confidence={82}
                      candles={EUR_USD_CANDLES}
                    />
                  </div>
                )}

                {i === 1 && (
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-line bg-paper px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-moss/15 text-moss text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        BUY · EUR/USD
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft">confidence 78%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ["Entry", "1.0845"],
                        ["Stop", "1.0789"],
                        ["Target", "1.0932"],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-lg border border-line bg-paper px-2 py-2 text-center">
                          <p className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">{k}</p>
                          <p className="mt-0.5 text-[12px] font-bold font-mono text-ink">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {i === 2 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {[
                      ["EUR/USD", "30m"],
                      ["XAU/USD", "4H"],
                      ["NAS100", "D1"],
                      ["BTC/USD", "15m"],
                    ].map(([label, tf]) => (
                      <div key={label} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2">
                        <span className="text-[12px] font-semibold text-ink">{label}</span>
                        <span className="font-mono text-[10px] text-ink-soft">{tf}</span>
                      </div>
                    ))}
                  </div>
                )}

                {i === 3 && (
                  <div className="mt-6 space-y-2.5">
                    {[
                      ["EUR/USD", 78],
                      ["NAS100", 64],
                      ["XAU/USD", 52],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                          {label}
                        </span>
                        <div className="h-1.5 flex-1 rounded-full bg-mist">
                          <div
                            className={`h-full rounded-full ${
                              Number(value) >= 70
                                ? "bg-moss"
                                : Number(value) >= 60
                                  ? "bg-signal"
                                  : "bg-ink/30"
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-ink-soft w-8 text-right tabular-nums">
                          {value}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {i === 4 && (
                  <div className="mt-6 space-y-1.5">
                    <div className="rounded-lg bg-signal-soft border border-signal/20 px-3 py-2 text-[12px] font-medium text-ink">
                      Price held 1.0830 twice and formed a double bottom against a rising trendline — momentum favors the long.
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft px-1 pt-1">
                      ← key levels Valix found in your chart
                    </p>
                  </div>
                )}

                {i === 5 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {["Copy trade plan", "Share signal", "Journal it"].map((b) => (
                      <span key={b} className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[12px] font-semibold px-3.5 py-2">
                        {b}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="mt-6 text-lg font-bold tracking-tight text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Pricing</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              One plan. One price. No surprises.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-md mx-auto">
              One simple plan at $39/month — no seat fees, no usage caps,
              cancel anytime.
            </p>
          </div>

          <div className="mt-12 max-w-md mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-2xl bg-ink text-white p-8 shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)]"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                  Most popular
                </span>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                  {plan.name}
                </p>
                <p className="mt-1 text-sm text-white/70">{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-[52px] font-extrabold tracking-tight leading-none">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-white/60">/month</span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Billed monthly · cancel anytime
                </p>

                <ul className="mt-7 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-signal/20 flex items-center justify-center">
                        {checkIcon}
                      </span>
                      <span className="text-[14px] text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleCTA}
                  className="mt-8 w-full py-3 rounded-full bg-signal text-white text-[14px] font-semibold transition-all duration-200 hover:bg-signal-dark"
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-[13px] text-ink-soft">
            Secure checkout by Dodo Payments. Cancel anytime, no questions asked.
          </p>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-signal" />
                <Eyebrow>Word on the street</Eyebrow>
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink max-w-lg">
                What happens when the second opinion is always there
              </h2>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <Stars className="w-4 h-4" />
              <p className="text-sm font-semibold text-ink">4.9 / 5</p>
              <p className="text-sm text-ink-soft">· 1,800+ reviews</p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={`bg-cream border border-line rounded-2xl p-7 md:p-8 flex flex-col justify-between ${
                  t.featured ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <Stars />
                  <p className={`mt-4 leading-relaxed text-ink ${t.featured ? "text-lg md:text-xl" : "text-[15px]"} font-medium`}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white ${
                      t.featured ? "bg-signal" : "bg-ink"
                    }`}
                  >
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                    <p className="text-[13px] text-ink-soft">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-signal" />
                  <Eyebrow>FAQ</Eyebrow>
                </div>
                <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
                  Questions people actually ask
                </h2>
                <p className="mt-5 text-[15px] text-ink-soft max-w-sm">
                  Something else on your mind?{" "}
                  <a href="mailto:hello@valix.com" className="font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors">
                    Email us
                  </a>{" "}
                  — a human replies within a day.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-paper border border-line rounded-2xl px-6">
                {faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="pb-20 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative overflow-hidden bg-ink rounded-3xl px-6 py-16 md:py-24 text-center">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-signal/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <Eyebrow>{"\u2014>"} No card. No call. No catch.</Eyebrow>
            <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white">
              Your next trade is one screenshot away
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/60 leading-relaxed max-w-lg mx-auto">
              Drop a chart, get a plan. Read the reasoning, check the levels and
              decide for yourself — every analysis, every market, one price.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCTA}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-signal text-white text-[15px] font-semibold hover:bg-signal-dark transition-all duration-200 shadow-[0_16px_40px_-12px_rgba(255,77,47,0.6)]"
              >
                Analyze your first chart
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="mt-4 text-[13px] text-white/40">
              $39/month · cancel anytime · AI analysis, not financial advice
            </p>
          </div>
        </div>
      </section>

      <LoginOverlay open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
