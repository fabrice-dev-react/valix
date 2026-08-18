"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useLogin } from "@/components/LoginContext";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Flame,
  Globe,
  Send,
  Target,
  Zap,
} from "lucide-react";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-signal-dark font-semibold">
      {children}
    </p>
  );
}

/* Floating task card — left side of hero */
function TaskCard() {
  const actions = [
    { done: true, text: "Post founder story on LinkedIn" },
    { done: true, text: "Reply to 5 niche posts" },
    { done: false, text: "Write a Twitter thread" },
    { done: false, text: "Send 3 outreach DMs" },
  ];
  return (
    <div className="w-[260px] sm:w-[280px] rounded-2xl border border-line bg-paper shadow-[0_24px_48px_-16px_rgba(22,19,17,0.25)] overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-line bg-cream">
        <span className="w-6 h-6 rounded-full bg-ink flex items-center justify-center text-white text-[10px] font-bold">V</span>
        <p className="text-[11px] font-bold text-ink">Today&apos;s Actions</p>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-moss/10 text-moss text-[9px] font-bold px-2 py-0.5">
          <Flame className="w-2.5 h-2.5" />
          12d
        </span>
      </div>
      <div className="px-3.5 py-3 space-y-1.5">
        {actions.map((a) => (
          <div key={a.text} className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${a.done ? "border-moss/20 bg-moss/5" : "border-line bg-cream"}`}>
            <span className={`w-3.5 h-3.5 shrink-0 rounded-full border-2 flex items-center justify-center ${a.done ? "border-moss bg-moss text-white" : "border-line"}`}>
              {a.done && <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </span>
            <span className={`text-[11px] leading-snug ${a.done ? "text-ink-soft line-through" : "text-ink font-medium"}`}>{a.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Floating result card — right side of hero */
function ResultCard() {
  return (
    <div className="w-[260px] sm:w-[280px] rounded-2xl border border-line bg-paper shadow-[0_24px_48px_-16px_rgba(22,19,17,0.25)] overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-line bg-cream">
        <p className="text-[11px] font-bold text-ink">This week&apos;s results</p>
      </div>
      <div className="px-3.5 py-3 space-y-3">
        <div className="flex items-end gap-0.5">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <span className={`w-full rounded-sm ${i < 5 ? "h-8 bg-moss" : i === 5 ? "h-4 bg-mist" : "h-4 bg-mist"}`} />
              <span className="text-[8px] font-mono text-ink-soft">{d}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { n: "18", l: "Shipped" },
            { n: "12", l: "Streak" },
            { n: "4", l: "Channels" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-cream border border-line p-2 text-center">
              <p className="text-[16px] font-extrabold text-ink leading-none">{s.n}</p>
              <p className="mt-0.5 text-[8px] text-ink-soft">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {[
            { ch: "Twitter", pct: 80 },
            { ch: "LinkedIn", pct: 60 },
            { ch: "Reddit", pct: 40 },
          ].map((c) => (
            <div key={c.ch} className="flex items-center gap-1.5">
              <span className="text-[9px] font-medium text-ink-soft w-12">{c.ch}</span>
              <div className="flex-1 h-1 bg-mist rounded-full overflow-hidden">
                <div className="h-full bg-signal rounded-full" style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROBLEM SECTION
   ============================================================ */
const problems = [
  "You know you should be posting but don't know what to write",
  "You start strong then fall off after a week",
  "Marketing feels overwhelming with so many channels",
  "You spend hours on tasks that don't actually grow your SaaS",
];

const weekCycle = [
  "Monday: I should really start marketing",
  "Tuesday: Too busy with the product",
  "Wednesday: I'll post something tomorrow",
  "Thursday: What would I even write about?",
  "Friday: This week flew by, next week for sure",
  "Weekend: I'll do it Monday",
];

/* ============================================================
   SOLUTION STEPS — how it works visual flow
   ============================================================ */
const solutionSteps = [
  { icon: Globe, label: "Enter your website", desc: "We analyze your SaaS and audience", tone: "outline" },
  { icon: Target, label: "Get your plan", desc: "Channels, goals, and strategy", tone: "signal" },
  { icon: Zap, label: "Ship daily actions", desc: "Focused to-dos every morning", tone: "moss" },
  { icon: Flame, label: "Build your streak", desc: "Accountability that sticks", tone: "ink" },
];

/* ============================================================
   HOW IT WORKS — 3 steps with mini visuals
   ============================================================ */
function StepVisual({ step }: { step: number }) {
  if (step === 1) {
    return (
      <div className="rounded-xl border border-line bg-cream p-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-3.5 h-3.5 text-ink-soft" />
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">Analyzing</span>
        </div>
        <div className="space-y-1.5">
          {[
            ["Product", "Project management tool"],
            ["Audience", "Remote teams, 5-50 people"],
            ["Best channels", "LinkedIn, Twitter, SEO"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[11px] text-ink-soft">{k}</span>
              <span className={`text-[11px] font-semibold ${k === "Best channels" ? "text-signal-dark" : "text-ink"}`}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="rounded-xl border border-line bg-cream p-4 mt-4 space-y-2">
        {[
          { ch: "Twitter", goal: "Daily engagement", active: true },
          { ch: "LinkedIn", goal: "3 posts/week", active: true },
          { ch: "SEO", goal: "2 blog posts/month", active: false },
        ].map((c) => (
          <div key={c.ch} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${c.active ? "border-signal/25 bg-signal-soft" : "border-line bg-paper"}`}>
            <span className="text-[11px] font-semibold text-ink">{c.ch}</span>
            <span className="text-[10px] font-mono text-moss font-bold">{c.goal}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-line bg-cream p-4 mt-4 space-y-2">
      {["Write a founder story thread", "Reply to 10 posts in your niche", "Send 5 outreach DMs"].map((a, i) => (
        <div key={a} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2">
          <span className={`w-3.5 h-3.5 shrink-0 rounded-full border-2 ${i === 0 ? "border-moss bg-moss" : "border-line"}`} />
          <span className={`text-[11px] ${i === 0 ? "text-ink-soft line-through" : "text-ink font-medium"}`}>{a}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   PRICING
   ============================================================ */
const pricingFeatures = [
  "AI-powered website analysis",
  "Custom marketing channel plan",
  "Daily focused marketing actions",
  "Streak tracking & accountability",
  "Progress dashboard",
  "Channel recommendations",
  "New actions every morning",
];

/* ============================================================
   FAQ
   ============================================================ */
const faqs = [
  { q: "How does Valix know what to recommend?", a: "Enter your SaaS URL and Valix analyzes your product, audience, and positioning. It recommends the channels and actions that fit your specific situation — not generic advice." },
  { q: "What kind of daily actions do I get?", a: "Specific, actionable tasks: post a founder story, reply to comments in your niche, write a thread, send outreach DMs. Short enough to complete in your set daily hours." },
  { q: "I already know what to do. Why do I need this?", a: "Knowing and doing are different things. Valix gives you the structure, the plan, and the streak that keeps you shipping. That's the difference." },
  { q: "What if I miss a day?", a: "Your streak resets. That's the point — the streak creates enough friction that you'll think twice before skipping." },
  { q: "Can I add custom actions?", a: "Yes. Valix provides a baseline of smart daily actions, but you can always add your own custom tasks alongside them." },
  { q: "Can I change my channels later?", a: "Yes. Update your marketing hours, channels, and goals anytime from your dashboard. Valix adjusts your daily actions accordingly." },
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

  return (
    <div className="bg-cream text-ink overflow-x-clip">

      {/* ============ HERO ============ */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[680px] max-w-full rounded-full bg-signal/10 blur-3xl" aria-hidden="true" />

        {/* Floating cards — inset from edges, at vertical center of headline */}
        <div className="hidden 2xl:block absolute left-[3%] top-1/2 -translate-y-1/2 animate-fade-up opacity-75 hover:opacity-100 transition-opacity pointer-events-none rotate-[-2deg]" style={{ animationDelay: "0.2s" }}>
          <TaskCard />
        </div>
        <div className="hidden 2xl:block absolute right-[3%] top-1/2 -translate-y-1/2 animate-fade-up opacity-75 hover:opacity-100 transition-opacity pointer-events-none rotate-[2deg]" style={{ animationDelay: "0.35s" }}>
          <ResultCard />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              <Eyebrow>Daily marketing discipline for SaaS founders</Eyebrow>
            </div>

            <h1 className="mt-7 text-[38px] sm:text-5xl md:text-[56px] lg:text-[62px] font-extrabold tracking-[-0.03em] leading-[1.06] text-ink max-w-4xl mx-auto">
              Stay disciplined on your{" "}
              <span className="text-signal">SaaS marketing.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-soft max-w-xl mx-auto">
              90% of SaaS products fail because founders can&apos;t stay
              consistent with marketing. Valix fixes that with a daily plan
              built for your product.
            </p>

        <div className="mt-9">
  <button
    onClick={handleCTA}
    className="group relative inline-flex items-center justify-center gap-2.5 px-10 py-5 rounded-full bg-black text-white text-[16px] font-bold hover:bg-gray-900 transition-all duration-300 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)] hover:scale-[1.02] active:scale-[0.98]"
  >
    <span className="relative z-10">Build my marketing plan</span>
    <ArrowRight className="w-4.5 h-4.5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
  </button>
</div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-signal" />
                <p className="text-[13px] text-ink-soft">Built for founders who skip marketing</p>
              </div>
              <div className="hidden sm:block h-4 w-px bg-line" />
              <p className="text-[13px] text-ink-soft">$9/mo · cancel anytime</p>
            </div>
          </div>

          {/* Mobile / large tablet: cards stack below */}
          <div className="2xl:hidden flex flex-col items-center gap-6 mt-14">
            <div className="animate-fade-up"><TaskCard /></div>
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}><ResultCard /></div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="border-y border-line bg-paper py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-signal" />
                <Eyebrow>The problem</Eyebrow>
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink max-w-xl">
                You know marketing matters. You still don&apos;t do it.
              </h2>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-lg">
                You built something great. But marketing it feels overwhelming, vague,
                and easy to skip. There&apos;s always tomorrow. Until tomorrow becomes
                never, and your SaaS stays invisible.
              </p>
              <ul className="mt-7 space-y-3">
                {problems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-signal/10 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-signal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </span>
                    <span className="text-[14.5px] text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-line bg-cream p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">The same cycle. Every week.</p>
                <div className="mt-6 space-y-3">
                  {weekCycle.map((q, i) => (
                    <div key={q} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <span className="w-7 h-7 shrink-0 rounded-full bg-mist flex items-center justify-center">
                        <CalendarCheck className="w-3.5 h-3.5 text-ink-soft" />
                      </span>
                      <p className="text-[14px] font-medium text-ink">{q}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[13px] text-ink-soft leading-relaxed">
                  Sound familiar? You&apos;re not lazy — you just don&apos;t have a system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOLUTION FLOW ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>The solution</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              A system that makes marketing impossible to skip
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-lg mx-auto">
              Valix turns vague marketing goals into a focused daily plan — built for your
              SaaS, shipped every morning, tracked with a streak you don&apos;t want to break.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {solutionSteps.map((step, i) => (
              <div key={step.label} className="relative">
                <div className={`h-full rounded-2xl border p-5 ${step.tone === "signal" ? "bg-signal-soft border-signal/25" : step.tone === "moss" ? "bg-[#e9f9e3] border-moss/30" : step.tone === "ink" ? "bg-ink border-ink text-white" : "bg-paper border-line"}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${step.tone === "ink" ? "bg-white/10 text-white" : step.tone === "moss" ? "bg-moss/15 text-moss" : step.tone === "signal" ? "bg-signal/15 text-signal-dark" : "bg-mist text-ink-soft"}`}>
                      <step.icon className="w-4.5 h-4.5" />
                    </span>
                    <p className={`text-[13.5px] font-bold leading-tight ${step.tone === "ink" ? "text-white" : "text-ink"}`}>{step.label}</p>
                  </div>
                  <p className={`mt-2.5 text-[12px] leading-relaxed ${step.tone === "ink" ? "text-white/60" : "text-ink-soft"}`}>{step.desc}</p>
                </div>
                {i < 3 && <ArrowRight className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/40 z-10 bg-cream rounded-full" />}
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[14px] text-ink-soft max-w-xl mx-auto">
            No guesswork. No overwhelm. Just a clear plan, daily actions, and a streak
            that keeps you accountable.{" "}
            <span className="font-semibold text-ink">Your marketing finally compounds.</span>
          </p>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>How it works</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              From zero to daily marketing in minutes
            </h2>
            <p className="mt-5 text-[15px] text-ink-soft max-w-md mx-auto">
              No strategy sessions. No hiring. Just enter your website, get your plan, and start shipping.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Enter your website", desc: "Paste your SaaS URL. We analyze your product, audience, and positioning." },
              { n: "02", title: "Get your plan", desc: "We recommend channels, set goals, and build a focused marketing plan." },
              { n: "03", title: "Ship daily actions", desc: "Every morning: a short to-do list. Check them off, build your streak, grow." },
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
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Pricing</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Less than a coffee per day
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-md mx-auto">
              One flat price. No tiers. No upsells. Cancel anytime.
            </p>
          </div>

          <div className="mt-12 max-w-lg mx-auto">
            <div className="relative flex flex-col rounded-2xl bg-ink text-white p-8 shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">Everything included</span>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Valix — Daily Marketing Plan</p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[52px] font-extrabold tracking-tight leading-none">$9</span>
                <span className="text-sm text-white/60">/month</span>
              </div>
              <p className="mt-1 text-xs text-white/50">Cancel anytime · no contracts</p>
              <ul className="mt-7 space-y-3 flex-1">
                {pricingFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-signal/20 flex items-center justify-center"><Check className="w-3 h-3 text-signal" /></span>
                    <span className="text-[14px] text-white/90">{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={handleCTA} className="mt-8 w-full py-3 rounded-full bg-signal text-white text-[14px] font-semibold transition-all duration-200 hover:bg-signal-dark">
                Start shipping your marketing
              </button>
            </div>
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
              Questions SaaS founders ask
            </h2>
          </div>
          <div className="bg-cream border border-line rounded-2xl px-6">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="pb-20 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative overflow-hidden bg-ink rounded-3xl px-6 py-16 md:py-20 text-center">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-signal/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] text-white">
              Your SaaS deserves daily marketing. Start today.
            </h2>
            <p className="mt-4 text-base text-white/60 leading-relaxed max-w-md mx-auto">
              Enter your website, get your plan, and ship your first action today. No calls. No strategy sessions. Just marketing that ships.
            </p>
           <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
  <button
    onClick={handleCTA}
    className="group relative inline-flex items-center justify-center gap-2.5 px-10 py-5 rounded-full bg-signal text-white text-[16px] font-bold hover:bg-signal-dark transition-all duration-300 shadow-[0_20px_50px_-12px_rgba(255,77,47,0.55)] hover:shadow-[0_24px_60px_-12px_rgba(255,77,47,0.7)] hover:scale-[1.02] active:scale-[0.98]"
  >
    <span className="relative z-10">Build my marketing plan</span>
    <ArrowRight className="w-4.5 h-4.5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-signal via-signal to-[#ff6b3d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </button>
</div>
            <div className="mt-6 flex items-center justify-center gap-5 flex-wrap">
              <p className="flex items-center gap-1.5 text-[12px] text-white/50"><Target className="w-3 h-3 text-[#6ee7a0]" /> Custom plan</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/50"><Flame className="w-3 h-3 text-[#6ee7a0]" /> Daily streak</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/50"><Zap className="w-3 h-3 text-[#6ee7a0]" /> Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
