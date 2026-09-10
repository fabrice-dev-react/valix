"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useLogin } from "@/components/LoginContext";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardList,
  Crown,
  Palette,
  PenTool,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-signal-dark font-semibold">
      {children}
    </p>
  );
}

function PrimaryCTA({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-3 px-5 pr-2.5 py-2 rounded-full bg-signal text-white text-[16px] font-bold hover:bg-signal-dark transition-all duration-300 shadow-[0_20px_50px_-12px_rgba(255,77,47,0.55)] ${className}`}
    >
      <span className="relative z-10">Start my side hustle</span>
      <span className="w-9 h-9 shrink-0 rounded-full bg-white flex items-center justify-center">
        <ArrowRight className="w-4.5 h-4.5 text-signal transition-transform duration-300 group-hover:translate-x-0.5 -rotate-45" />
      </span>
    </button>
  );
}

/* ============================================================
   FEATURES
   ============================================================ */
const features = [
  {
    icon: Target,
    title: "Market Validation",
    desc: "AI researches your niche, finds demand signals, and tells you if your idea has real customers before you spend a dime.",
    example: "Analyzes search volume, competition, and buyer intent automatically.",
    tone: "signal",
  },
  {
    icon: Palette,
    title: "Offer Design",
    desc: "Get a complete offer crafted for your niche — positioning, deliverables, and differentiation that makes people say yes.",
    example: "\"Logo design package for startups\" — priced, positioned, ready.",
    tone: "moss",
  },
  {
    icon: BarChart3,
    title: "Pricing Strategy",
    desc: "AI sets your prices based on market data, competitor analysis, and what your target audience is willing to pay.",
    example: "Dynamic pricing suggestions that maximize revenue.",
    tone: "ink",
  },
  {
    icon: PenTool,
    title: "Content Planning",
    desc: "Weekly content calendars with hooks, captions, and posting schedules tailored to your audience and platform.",
    example: "7-day content plan generated in under 2 minutes.",
    tone: "signal",
  },
  {
    icon: ClipboardList,
    title: "Daily Action Tasks",
    desc: "Wake up to a prioritized task list. AI tells you exactly what to do today to grow your side hustle.",
    example: "\"Post 1 Reel, DM 5 prospects, update portfolio\" — done.",
    tone: "moss",
  },
  {
    icon: TrendingUp,
    title: "Growth Tracking",
    desc: "Track revenue, leads, and progress across every phase. See what's working and what to adjust.",
    example: "Dashboard shows your side hustle health at a glance.",
    tone: "ink",
  },
];

/* ============================================================
   HOW IT WORKS — step visuals
   ============================================================ */
function StepVisual({ step }: { step: number }) {
  if (step === 1) {
    return (
      <div className="rounded-xl border border-line bg-paper overflow-hidden mt-4">
        <div className="p-4 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-signal/15 text-signal-dark flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </span>
          <div>
            <p className="text-[13px] font-bold text-ink leading-tight">Market scan complete</p>
            <p className="text-[10.5px] text-ink-soft">3 validated opportunities found in your niche.</p>
          </div>
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="rounded-xl border border-line bg-paper overflow-hidden mt-4">
        <div className="px-4 pt-3.5 text-[10px] font-mono uppercase tracking-wide text-ink-soft">AI generated your offer</div>
        <div className="p-4 pt-2 space-y-2">
          {[
            ["Service", "Logo Design Package"],
            ["Positioning", "For early-stage startups"],
            ["Price point", "$200/logo"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-line pb-1.5 last:border-0 last:pb-0">
              <span className="text-[11px] text-ink-soft">{k}</span>
              <span className="text-[11px] font-semibold text-ink">{v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (step === 3) {
    return (
      <div className="rounded-xl border border-line bg-paper overflow-hidden mt-4">
        <div className="flex items-center justify-between px-4 py-2.5 bg-mist/50">
          <span className="text-[10px] font-mono uppercase tracking-wide text-ink-soft">Today&apos;s tasks</span>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-white bg-signal rounded-full px-2 py-0.5 uppercase">
            <Zap className="w-2.5 h-2.5" /> 5 tasks
          </span>
        </div>
        <div className="p-3.5 space-y-2">
          {["Post a Reel about your service", "DM 5 potential clients", "Update portfolio with new mockup"].map((t, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-lg border border-line bg-cream px-3 py-2">
              <span className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${i < 1 ? "border-moss bg-moss" : "border-line"}`}>
                {i < 1 && <Check className="w-2.5 h-2.5 text-white" />}
              </span>
              <span className={`text-[11.5px] ${i < 1 ? "text-ink-soft line-through" : "text-ink"}`}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-line bg-paper overflow-hidden mt-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-mist/50">
        <span className="text-[10px] font-mono uppercase tracking-wide text-ink-soft">Revenue tracker</span>
        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-white bg-moss rounded-full px-2 py-1 uppercase">
          <TrendingUp className="w-2.5 h-2.5" /> Growing
        </span>
      </div>
      <div className="px-4 py-3.5">
        <p className="text-[13px] font-bold text-ink">Month 1: $450 → Month 3: $2,100</p>
        <p className="text-[11px] text-ink-soft mt-0.5">Your side hustle is gaining traction.</p>
      </div>
    </div>
  );
}

/* ============================================================
   PRICING
   ============================================================ */
const plans = [
  {
    name: "Everything included",
    price: 8,
    oldPrice: 19,
    annualTotal: 96,
    tagline: "Everything you need to build and grow your AI side hustle — no add-ons, no tiers.",
    features: [
      "Unlimited AI business coaching",
      "Market validation & research",
      "Offer & pricing design",
      "Content planning engine",
      "Daily action task lists",
      "Revenue & growth tracking",
      "All business phases included",
      "Priority email support",
    ],
    highlight: true,
  },
];

/* ============================================================
   FAQ
   ============================================================ */
const faqs = [
  {
    q: "What kind of side hustle can I start with this?",
    a: "Any AI-powered online side hustle — freelance services, digital products, content creation, consulting, SaaS tools, and more. The AI adapts to your skills and goals.",
  },
  {
    q: "Do I need any prior business experience?",
    a: "No. The AI walks you through every phase from market research to launch. It's designed for complete beginners who want to start earning online.",
  },
  {
    q: "How does the phase system work?",
    a: "Your side hustle progresses through validated phases: Market Validation → Offer Design → Pricing → Content & Launch → Daily Growth. You can't skip ahead — each phase builds on the last.",
  },
  {
    q: "How much can I realistically earn?",
    a: "It depends on your niche and effort. Users have reported earning $500–$3,000/month within the first 3 months. The AI optimizes your strategy as you grow.",
  },
  {
    q: "Can I use this for multiple side hustles?",
    a: "Yes. You can run multiple side hustle projects simultaneously, each with its own phases, tasks, and tracking.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans can be cancelled anytime, no contracts. Annual plans are billed once per year at the discounted rate.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 py-5 text-left">
        <span className="text-[15px] font-semibold text-ink pr-4">{q}</span>
        <span className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-full border transition-all duration-200 ${open ? "bg-ink border-ink text-white rotate-45" : "border-line text-ink-soft"}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2.5} d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden"><p className="text-[15px] leading-relaxed text-ink-soft">{a}</p></div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
  const { openLogin } = useLogin();

  const handleCTA = () => {
    if (isLoggedIn) { router.push("/dashboard"); } else { openLogin(); }
  };

  const toneClasses: Record<string, string> = {
    signal: "bg-signal-soft border-signal/25",
    moss: "bg-[#edf7ef] border-moss/25",
    ink: "bg-ink border-ink text-white",
  };

  return (
    <div className="bg-cream text-ink overflow-x-clip">

      {/* ============ HERO ============ */}
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-24">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[560px] w-[820px] max-w-full rounded-full bg-signal/10 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-4 py-1.5 shadow-sm">
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center ring-1 ring-signal/15">
                <Sparkles className="w-3 h-3 text-signal-dark" />
              </span>
              <Eyebrow>AI-powered side hustle builder</Eyebrow>
            </div>

            <h1 className="mt-7 text-[40px] sm:text-5xl md:text-[58px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.04] text-ink max-w-4xl mx-auto">
              Find and start your <span className="text-signal">perfect online AI side hustle.</span>
            </h1>

            <p className="mt-6 text-[17px] sm:text-lg leading-relaxed text-ink-soft max-w-3xl mx-auto">
              AI guides you from zero to income through validated phases — market research, offer design,
              pricing, content planning, and daily tasks. So{" "}
              <span className="font-semibold text-ink">you know exactly what to do next.</span>
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <PrimaryCTA onClick={handleCTA} />
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full border border-line bg-paper text-ink text-[15px] font-semibold hover:border-ink/30 transition-colors"
              >
                See how it works
              </a>
            </div>

            <div className="mt-7 flex items-center justify-center gap-5 flex-wrap text-[13px] text-ink-soft">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> Start in minutes</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> No experience needed</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> Cancel anytime</span>
            </div>
          </div>

        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>The problem</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Most people never start. Or they start and quit.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              You&apos;ve thought about starting a side hustle. You&apos;ve googled &quot;how to make money online&quot;
              a hundred times. But without a clear plan, you&apos;re stuck in research mode.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* WITHOUT */}
            <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft/70">Without AI guidance</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink-soft bg-mist rounded-full px-2.5 py-1 uppercase">
                  Stuck in limbo
                </span>
              </div>
              <div className="mt-6 space-y-2.5">
                {[
                  { t: 'Google "how to start"', sub: "Endless articles, no clear path" },
                  { t: "Pick a random idea", sub: "No validation, no demand check" },
                  { t: "Build in silence", sub: "No audience, no content plan" },
                  { t: "Give up after weeks", sub: "No revenue, no motivation" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-cream px-4 py-3.5">
                      <span className="w-4 h-4 shrink-0 text-ink-soft">✕</span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-ink">{s.t}</p>
                        <p className="text-[12px] text-ink-soft">{s.sub}</p>
                      </div>
                    </div>
                    {i < 3 && (
                      <div className="flex justify-center py-0.5 text-ink-soft/40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7M19 7l-7 7-7-7" /></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[13.5px] font-semibold text-ink-soft">That&apos;s the cycle most people are stuck in.</p>
            </div>

            {/* WITH */}
            <div className="rounded-3xl border border-moss/30 bg-paper p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(47,93,70,0.25)]">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss font-semibold">With AI guidance</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-moss bg-moss/10 border border-moss/25 rounded-full px-2.5 py-1 uppercase">
                  <Check className="w-3 h-3" /> Clear path forward
                </span>
              </div>
              <div className="mt-6 space-y-2.5">
                {[
                  { t: "AI validates your niche", sub: "Data-backed market research in minutes" },
                  { t: "AI designs your offer", sub: "Positioning, pricing, differentiation" },
                  { t: "AI plans your content", sub: "Weekly calendars, hooks, posting schedule" },
                  { t: "AI gives daily tasks", sub: "You know exactly what to do today" },
                  { t: "You start earning", sub: "Revenue tracking keeps you motivated" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2.5 rounded-xl border border-moss/20 bg-[#edf7ef] px-4 py-3.5">
                      <Check className="w-4 h-4 text-moss shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-ink">{s.t}</p>
                        <p className="text-[12px] text-ink-soft">{s.sub}</p>
                      </div>
                    </div>
                    {i < 4 && (
                      <div className="flex justify-center py-0.5 text-moss/40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7M19 7l-7 7-7-7" /></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[13.5px] font-semibold text-moss">From idea to income — guided every step.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PHASES ============ */}
      <section id="features" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Phase-based system</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Every phase. Handled by AI.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-lg mx-auto">
              No guessing. No overwhelm. AI guides you through each phase in order — so you never skip a step or waste time.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className={`h-full rounded-2xl border p-5 flex flex-col ${toneClasses[f.tone] || "bg-paper border-line"}`}>
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.tone === "ink" ? "bg-white/10 text-white" : "bg-ink/5 text-ink"}`}>
                  <f.icon className="w-4.5 h-4.5" />
                </span>
                <h3 className={`mt-4 text-[15px] font-bold leading-tight ${f.tone === "ink" ? "text-white" : "text-ink"}`}>{f.title}</h3>
                <p className={`mt-2 text-[12.5px] leading-relaxed ${f.tone === "ink" ? "text-white/70" : "text-ink-soft"}`}>{f.desc}</p>
                <div className="mt-auto pt-3">
                  <p className={`rounded-lg border px-3 py-2 text-[11.5px] font-medium ${f.tone === "ink" ? "bg-white/10 border-white/10 text-white/80" : "bg-paper/70 border-line text-ink-soft"}`}>{f.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>How it works</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              From idea to income in 4 phases.
            </h2>
          </div>

          {/* Timeline */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-[12px] font-mono uppercase tracking-wide text-ink-soft">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5"><Target className="w-3.5 h-3.5 text-signal-dark" /> Validate</span>
            <span className="text-ink-soft/40">↓</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5"><Palette className="w-3.5 h-3.5 text-signal-dark" /> Design offer</span>
            <span className="text-ink-soft/40">↓</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5"><BarChart3 className="w-3.5 h-3.5 text-signal-dark" /> Set pricing</span>
            <span className="text-ink-soft/40">↓</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-signal bg-signal-soft px-3 py-1.5 font-bold text-signal-dark"><Zap className="w-3.5 h-3.5" /> Launch & grow</span>
          </div>

          <div className="mt-14 grid md:grid-cols-4 gap-6">
            {[
              { n: "Phase 1", title: "Validate", desc: "AI researches your niche and confirms there are real customers willing to pay." },
              { n: "Phase 2", title: "Design your offer", desc: "AI crafts your service or product offer with positioning and differentiation." },
              { n: "Phase 3", title: "Set your pricing", desc: "Data-driven pricing based on market rates, competitor analysis, and value." },
              { n: "Phase 4", title: "Launch & grow", desc: "Content plans, daily tasks, and growth tracking to get your first paying customers." },
            ].map((step, i) => (
              <div key={step.n} className="rounded-2xl border border-line bg-cream p-6">
                <span className="font-mono text-[11px] text-ink-soft/60">{step.n}</span>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{step.desc}</p>
                <StepVisual step={i + 1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Pricing</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              One sale pays for the entire year.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              One plan. Everything you need to validate, launch, and grow your AI side hustle — with no add-ons. Cancel anytime.
            </p>
          </div>

          <div className="mt-14 flex justify-center">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-8 w-full max-w-3xl ${
                  plan.highlight
                    ? "bg-ink text-white border-ink shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)]"
                    : "bg-paper border-line"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                    Limited offer — 58% off
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-ink"}`}>{plan.name}</h3>
                  {plan.highlight && <Zap className="w-4 h-4 text-signal" />}
                </div>
                <p className={`mt-2 text-[13px] leading-relaxed ${plan.highlight ? "text-white/60" : "text-ink-soft"}`}>
                  {plan.tagline}
                </p>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className={`text-[46px] font-extrabold tracking-tight leading-none ${plan.highlight ? "text-white" : "text-ink"}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-ink-soft"}`}>/month</span>
                  <span className={`text-[13px] line-through ${plan.highlight ? "text-white/30" : "text-ink-soft/50"}`}>
                    ${plan.oldPrice}/mo
                  </span>
                </div>
                <p className={`mt-1 text-xs ${plan.highlight ? "text-white/50" : "text-ink-soft/80"}`}>
                  Billed annually at ${plan.annualTotal}/year · cancel anytime
                </p>

                <ul className="mt-7 space-y-3 flex-1 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className={`mt-0.5 w-4 h-4 shrink-0 rounded-full flex items-center justify-center ${
                        plan.highlight ? "bg-signal/20" : "bg-moss/15"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? "text-signal" : "text-moss"}`} />
                      </span>
                      <span className={`text-[14px] ${plan.highlight ? "text-white/90" : "text-ink"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleCTA}
                  className={`mt-8 w-full py-3.5 rounded-full text-[14px] font-semibold transition-all duration-200 active:scale-[0.99] ${
                    plan.highlight
                      ? "bg-signal text-white hover:bg-signal-dark"
                      : "bg-ink text-white hover:bg-black"
                  }`}
                >
                  Start my side hustle — ${plan.price}/mo
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-ink-soft">
            <span className="flex items-center gap-1.5"><Crown className="w-3.5 h-3.5 text-signal" /> Price locked for life</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> No contracts, cancel anytime</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> Instant access to all phases</span>
          </div>
        </div>
      </section>

      {/* ============ TRUST ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Why trust us</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Built for people who are ready to start
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              Whether you&apos;re a complete beginner or have tried before and quit — this is the system that actually works.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Target, title: "Data-backed decisions", desc: "Every recommendation is based on real market data — not guesswork or generic advice." },
              { icon: Zap, title: "Start in minutes", desc: "Answer a few questions about your skills and goals. AI builds your entire plan instantly." },
              { icon: TrendingUp, title: "Proven phase system", desc: "Each phase is designed to build on the last. You can't skip ahead, and you won't get stuck." },
            ].map((t) => (
              <div key={t.title} className="rounded-2xl border border-line bg-paper p-6 flex flex-col items-start">
                <span className="w-10 h-10 rounded-xl bg-moss/15 text-moss flex items-center justify-center">
                  <t.icon className="w-4.5 h-4.5" />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-ink">{t.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>FAQ</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Questions people ask
            </h2>
          </div>
          <div className="bg-cream border border-line rounded-2xl px-6">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="pb-20 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative overflow-hidden bg-ink rounded-3xl px-6 py-16 md:py-20 text-center">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-signal/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] text-white">
              Your side hustle starts today.
            </h2>
            <p className="mt-4 text-base text-white/60 leading-relaxed max-w-md mx-auto">
              Stop googling. Stop guessing. Let AI build your plan, give you daily tasks, and track your growth — starting now.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <PrimaryCTA onClick={handleCTA} />
            </div>
            <div className="mt-6 flex items-center justify-center gap-5 flex-wrap text-[12px] text-white/50">
              <p className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-[#6ee7a0]" /> Start in minutes</p>
              <p className="flex items-center gap-1.5"><Target className="w-3 h-3 text-[#6ee7a0]" /> No experience needed</p>
              <p className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6ee7a0]" /> Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
