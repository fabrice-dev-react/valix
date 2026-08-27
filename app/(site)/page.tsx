"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useLogin } from "@/components/LoginContext";
import {
  ArrowRight,
  BellRing,
  Check,
  LayoutDashboard,
  MessageSquareText,
  PhoneCall,
  PhoneMissed,
  ShieldCheck,
  Sparkles,
  TextSearch,
  Undo2,
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
      <span className="relative z-10">Recover my missed calls</span>
      <span className="w-9 h-9 shrink-0 rounded-full bg-white flex items-center justify-center">
        <ArrowRight className="w-4.5 h-4.5 text-signal transition-transform duration-300 group-hover:translate-x-0.5 -rotate-45" />
      </span>
    </button>
  );
}

/* ============================================================
   HERO — the qualified-lead list IS the hero
   ============================================================ */
function LeadCard({
  tone,
  name,
  need,
  meta,
  action,
}: {
  tone: "hot" | "warm";
  name: string;
  need: string;
  meta?: string;
  action: string;
}) {
  const isHot = tone === "hot";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3">
      <span
        className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold ${
          isHot ? "bg-signal-soft text-signal-dark" : "bg-[#fff4e0] text-[#b45309]"
        }`}
      >
        {name.charAt(0)}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-bold text-ink leading-tight truncate">{name}</p>
          <span
            className={`shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase rounded-full px-2 py-0.5 ${
              isHot
                ? "bg-signal text-white"
                : "bg-[#fff4e0] text-[#b45309] border border-[#f0c98a]"
            }`}
          >
            {isHot ? "HOT" : "WARM"}
          </span>
        </div>
        <p className="text-[12px] text-ink leading-snug truncate">{need}</p>
        {meta && <p className="text-[10.5px] text-ink-soft truncate">{meta}</p>}
      </div>
      <span
        className={`ml-auto shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold ${
          isHot ? "bg-moss text-white" : "bg-ink text-white/90"
        }`}
      >
        <PhoneCall className="w-3 h-3" /> {action}
      </span>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="w-full flex-1 flex flex-col rounded-3xl border border-line bg-paper shadow-[0_36px_80px_-24px_rgba(22,19,17,0.35)] overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-cream">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg bg-moss/15 text-moss flex items-center justify-center">
            <LayoutDashboard className="w-4.5 h-4.5" />
          </span>
          <div>
            <p className="text-[14px] font-bold text-ink leading-tight">Qualified leads</p>
            <p className="text-[11px] text-ink-soft">Ready for you to call back</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-moss rounded-full px-2.5 py-1 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" /> Live
        </span>
      </div>

      {/* How it got here: missed call → SMS → AI */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-1.5 flex-wrap text-[9.5px] font-mono uppercase tracking-wide text-ink-soft">
          <span className="inline-flex items-center gap-1"><PhoneMissed className="w-3 h-3 text-signal-dark" /> Missed call</span>
          <span className="text-ink-soft/40">→</span>
          <span className="inline-flex items-center gap-1"><MessageSquareText className="w-3 h-3 text-signal-dark" /> Instant SMS</span>
          <span className="text-ink-soft/40">→</span>
          <span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3 text-signal-dark" /> AI chat</span>
          <span className="text-ink-soft/40">→</span>
          <span className="inline-flex items-center gap-1 text-signal-dark font-bold"><Zap className="w-3 h-3" /> Qualified</span>
        </div>

        {/* Compact SMS/AI qualification snippet */}
        <div className="mt-3 rounded-xl border border-line bg-cream/50 px-3.5 py-3 space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 shrink-0 rounded-full bg-signal/20 text-signal-dark flex items-center justify-center">
              <PhoneMissed className="w-2.5 h-2.5" />
            </span>
            <p className="text-[11.5px] text-ink leading-snug rounded-lg rounded-bl-md border border-line bg-paper px-2.5 py-1.5">
              My water heater is leaking. I need someone today.
            </p>
          </div>
          <div className="flex justify-end items-center gap-2">
            <p className="text-[11.5px] text-white leading-snug rounded-lg rounded-br-md bg-ink px-2.5 py-1.5 max-w-[80%]">
              Got it. Is the leak actively causing water damage?
            </p>
            <span className="text-[9px] font-mono uppercase text-ink-soft/70 shrink-0">AI</span>
          </div>
        </div>
      </div>

      {/* The qualified lead list — the differentiator */}
      <div className="px-5 py-4 space-y-2.5">
        <LeadCard tone="hot" name="Mike J." need="Water heater leak" meta="Urgency: High · Needs service: Today" action="Call now" />
        <LeadCard tone="hot" name="Sarah K." need="Bathroom remodel quote" meta="Quote requested" action="Call now" />
        <LeadCard tone="warm" name="Devon L." need="Furnace repair" action="Follow up" />
      </div>

      <div className="px-5 py-3.5 border-t border-line bg-cream/60 flex items-center justify-between">
        <p className="text-[11px] text-ink-soft">
          Instead of wondering who called, you know who to call back.
        </p>
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-soft/60 shrink-0 ml-3">
          Example view
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   HERO — AI conversation card (tells how the app works)
   ============================================================ */
const heroThread = [
  {
    from: "ai",
    text: "Hi Mike! Sorry we missed your call. What can we help you with today?",
  },
  {
    from: "caller",
    text: "My water heater is leaking. I need someone today.",
  },
  {
    from: "ai",
    text: "Got it. Is the leak actively causing water damage?",
  },
  {
    from: "caller",
    text: "Yes, it's leaking into the basement.",
  },
];

function SMSThread() {
  return (
    <div className="w-full flex-1 flex flex-col rounded-3xl border border-line bg-paper shadow-[0_36px_80px_-24px_rgba(22,19,17,0.35)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-cream">
        <span className="w-9 h-9 rounded-full bg-moss/15 text-moss flex items-center justify-center shrink-0">
          <MessageSquareText className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-ink leading-tight truncate">Valix SMS Assistant</p>
          <p className="flex items-center gap-1.5 text-[10.5px] text-moss font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-moss animate-pulse" />
            Conversation with caller
          </p>
        </div>
        <span className="ml-auto text-[10px] font-mono text-ink-soft/70">Missed call</span>
      </div>

      <div className="px-4 py-4 space-y-2.5 bg-cream/30">
        <div className="rounded-lg border border-line bg-paper px-3 py-2 text-center">
          <span className="text-[10px] font-mono text-ink-soft">Missed call · 10:42 AM</span>
        </div>

        {heroThread.map((msg, i) => {
          const isAi = msg.from === "ai";
          const isCaller = msg.from === "caller";
          return (
            <div key={i} className={isAi ? "flex justify-end flex-col items-end" : "flex justify-start items-end gap-2"}>
              {isCaller && (
                <span className="w-5 h-5 rounded-full bg-signal/20 text-signal-dark flex items-center justify-center shrink-0">
                  <PhoneMissed className="w-2.5 h-2.5" />
                </span>
              )}
              <div className={`rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-snug shadow-sm ${
                isAi ? "rounded-br-md bg-ink text-white max-w-[86%]" : "rounded-bl-md bg-paper border border-line text-ink max-w-[80%]"
              }`}>
                {msg.text}
                {isAi && (
                  <span className="block mt-1 text-[8.5px] font-mono uppercase tracking-wide text-white/50">
                    {i === 0 ? "SMS sent · 12 sec" : "AI"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-4 border-t border-line bg-cream">
        <div className="rounded-2xl border border-ink bg-paper p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-moss">
              <Check className="w-3.5 h-3.5" /> Lead qualified
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-signal rounded-full px-2.5 py-1 uppercase">
              <Zap className="w-3 h-3" /> Hot lead
            </span>
          </div>
          <p className="mt-3 text-[13px] font-bold text-ink">Mike J.</p>
          <p className="mt-1 text-[12.5px] text-ink">Water heater leak</p>
          <div className="mt-2 space-y-1">
            <p className="text-[11.5px] text-ink-soft">Urgency: <span className="font-semibold text-ink">High</span></p>
            <p className="text-[11.5px] text-ink-soft">Needs service: <span className="font-semibold text-ink">Today</span></p>
            <p className="text-[11.5px] text-ink-soft">Status: <span className="font-semibold text-ink">Ready to call</span></p>
          </div>
          <div className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-moss text-white text-[13px] font-bold">
            <PhoneCall className="w-3.5 h-3.5" /> Call Mike
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FEATURES
   ============================================================ */
const features = [
  {
    icon: Zap,
    title: "Instant SMS Follow-Up",
    desc: "Every unanswered call triggers an SMS automatically, while the caller is still looking for help.",
    example: "Missed call at 10:42 AM → SMS texted within seconds.",
    tone: "signal",
  },
  {
    icon: TextSearch,
    title: "AI Lead Qualification",
    desc: "The AI asks conversational questions to understand what the caller needs and how urgent it is.",
    example: "\u201cWhat\u2019s the water heater doing?\u201d \u2014 to qualify the caller.",
    tone: "moss",
  },
  {
    icon: LayoutDashboard,
    title: "Qualified Lead List",
    desc: "See your best missed-call opportunities in one place, ranked by urgency and intent.",
    example: "Hot leads at the top, ready to call back.",
    tone: "ink",
  },
  {
    icon: Undo2,
    title: "Smart Follow-Up",
    desc: "If a caller goes quiet, Valix can follow up automatically so the opportunity doesn\u2019t disappear.",
    example: "Pings a missed caller again if they don\u2019t reply.",
    tone: "signal",
  },
  {
    icon: BellRing,
    title: "Hot Lead Alerts",
    desc: "Know when a serious lead is ready for you to call back.",
    example: "A ping on your phone the moment a hot lead is qualified.",
    tone: "moss",
  },
  {
    icon: Sparkles,
    title: "No CRM Required",
    desc: "Connect your number and start recovering missed calls without a complicated CRM setup.",
    example: "Point Valix at your number. Done.",
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
            <PhoneMissed className="w-4 h-4" />
          </span>
          <div>
            <p className="text-[13px] font-bold text-ink leading-tight">Missed call · 10:42 AM</p>
            <p className="text-[10.5px] text-ink-soft">From your business number, while you were on a job.</p>
          </div>
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="rounded-xl border border-line bg-paper overflow-hidden mt-4">
        <div className="px-4 pt-3.5 text-[10px] font-mono uppercase tracking-wide text-ink-soft">SMS sent · 12 seconds later</div>
        <div className="p-4 pt-2 flex items-start gap-2">
          <span className="w-5 h-5 shrink-0 rounded-full bg-signal/20 text-signal-dark flex items-center justify-center">
            <PhoneMissed className="w-2.5 h-2.5" />
          </span>
          <p className="text-[12px] text-ink leading-snug rounded-lg rounded-bl-md border border-line bg-paper px-3 py-2">
            &ldquo;Hi! You just missed us while we&rsquo;re with a customer. I can help right now — what can I do for you?&rdquo;
          </p>
        </div>
      </div>
    );
  }
  if (step === 3) {
    return (
      <div className="rounded-xl border border-line bg-paper overflow-hidden mt-4">
        <div className="flex items-center justify-between px-4 py-2.5 bg-mist/50">
          <span className="text-[10px] font-mono uppercase tracking-wide text-ink-soft">AI qualifies</span>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-white bg-signal rounded-full px-2 py-0.5 uppercase">
            <Zap className="w-2.5 h-2.5" /> Hot
          </span>
        </div>
        <div className="p-3.5 space-y-2">
          {[
            ["What they need", "Water heater — leaking"],
            ["Urgency", "High"],
            ["Needs service", "Today"],
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
  return (
    <div className="rounded-xl border border-line bg-paper overflow-hidden mt-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-mist/50">
        <span className="text-[10px] font-mono uppercase tracking-wide text-ink-soft">Qualified lead ready</span>
        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-white bg-moss rounded-full px-2 py-1 uppercase">
          <Check className="w-2.5 h-2.5" /> Ready
        </span>
      </div>
      <div className="px-4 py-3.5">
        <p className="text-[13px] font-bold text-ink">Mike J. · Water heater leak</p>
        <p className="text-[11px] text-ink-soft mt-0.5">Tap to call Mike back now.</p>
      </div>
    </div>
  );
}

/* ============================================================
   PRICING
   ============================================================ */
const plans = [
  {
    name: "Starter",
    price: 39,
    tagline: "A single business that wants to stop losing missed calls.",
    monthly: [
      "1 phone number",
      "Instant SMS follow-up",
      "AI lead qualification",
      "Qualified lead list",
      "Lead dashboard",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: 79,
    tagline: "An active crew that misses calls while out on jobs.",
    monthly: [
      "Everything in Starter",
      "2 phone numbers",
      "Smart follow-up",
      "Hot lead alerts",
      "More AI conversations",
      "Priority email support",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: 149,
    tagline: "Busy teams across locations and multiple business numbers.",
    monthly: [
      "Everything in Growth",
      "5+ phone numbers",
      "Multiple locations",
      "Team member alerts",
      "Advanced workflows",
      "Dedicated onboarding help",
    ],
    highlight: false,
  },
];

/* ============================================================
   FAQ
   ============================================================ */
const faqs = [
  {
    q: "Does Valix answer the phone?",
    a: "No. Valix is designed for missed-call recovery. When a call goes unanswered, Valix instantly follows up by SMS and starts a conversation with the caller.",
  },
  {
    q: "Does the caller know they're talking to AI?",
    a: "Valix should be transparent when appropriate. The AI handles the initial conversation and hands qualified opportunities back to your team.",
  },
  {
    q: "How does the AI qualify leads?",
    a: "It asks conversational questions about what the caller needs, urgency, and other information your business needs to decide who to call back first.",
  },
  {
    q: "Do I need a CRM?",
    a: "No. Valix is designed to work without requiring a CRM.",
  },
  {
    q: "How quickly does the caller receive the SMS?",
    a: "The SMS is sent automatically within seconds of an unanswered call.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Plans can be cancelled anytime, no contracts.",
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
                <ArrowRight className="w-3 h-3 text-signal-dark -rotate-45" />
              </span>
              <Eyebrow>AI missed-call recovery</Eyebrow>
            </div>

            <h1 className="mt-7 text-[40px] sm:text-5xl md:text-[58px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.04] text-ink max-w-4xl mx-auto">
              Never lose a customer to <span className="text-signal">a missed call again.</span>
            </h1>

            <p className="mt-6 text-[17px] sm:text-lg leading-relaxed text-ink-soft max-w-3xl mx-auto">
              Our AI instantly texts every missed caller by SMS, qualifies them through AI chat, and gives
              you a list of qualified leads ready to call back, so{" "}
              <span className="font-semibold text-ink">you don&apos;t lose them to a competitor.</span>
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
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> Live in minutes</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> No CRM required</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> Cancel anytime</span>
            </div>
          </div>

          {/* Hero visual — AI conversation + qualified leads */}
          <div className="mt-20 grid lg:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-soft shadow-sm">
                <MessageSquareText className="w-3 h-3 text-moss" /> AI texts your caller back
              </span>
              <div className="w-full max-w-md flex flex-col flex-1">
                <SMSThread />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-soft shadow-sm">
                <LayoutDashboard className="w-3 h-3 text-moss" /> You get qualified leads
              </span>
              <div className="w-full max-w-md flex flex-col flex-1">
                <HeroVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRADES ============ */}
      <section className="border-y border-line bg-paper py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-soft/70 mb-6">
            Built for businesses that depend on the phone
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {["Plumbers", "Electricians", "HVAC", "Roofers", "Landscapers", "Locksmiths"].map((t) => (
              <div key={t} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-cream px-4 py-4 text-[14px] font-semibold text-ink-soft">
                <PhoneCall className="w-3.5 h-3.5 text-signal shrink-0" />
                {t}
              </div>
            ))}
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
              You can&apos;t answer every call. Your customers won&apos;t always wait.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              You&apos;re on a job. Your phone rings. You can&apos;t pick up. The customer leaves a voicemail—or
              calls the next business they find.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* WITHOUT VALIX */}
            <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft/70">Without Valix</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink-soft bg-mist rounded-full px-2.5 py-1 uppercase">
                  A customer lost
                </span>
              </div>
              <div className="mt-6 space-y-2.5">
                {[
                  { t: "Missed call", sub: "You can\u2019t pick up" },
                  { t: "Voicemail", sub: "They\u2019re asked to leave a message" },
                  { t: "Customer waits", sub: "\u2026and gets impatient" },
                  { t: "Customer calls a competitor", sub: "The job goes elsewhere" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-cream px-4 py-3.5">
                      <PhoneMissed className="w-4 h-4 text-ink-soft shrink-0" />
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
              <p className="mt-6 text-[13.5px] font-semibold text-ink-soft">That&apos;s an avoidable lost job.</p>
            </div>

            {/* WITH VALIX */}
            <div className="rounded-3xl border border-moss/30 bg-paper p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(47,93,70,0.25)]">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss font-semibold">With Valix</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-moss bg-moss/10 border border-moss/25 rounded-full px-2.5 py-1 uppercase">
                  <Check className="w-3 h-3" /> A customer kept
                </span>
              </div>
              <div className="mt-6 space-y-2.5">
                {[
                  { t: "Missed call", sub: "You can\u2019t pick up" },
                  { t: "Instant SMS", sub: "Valix texts back in seconds" },
                  { t: "AI conversation", sub: "It finds out what they need" },
                  { t: "Qualified lead", sub: "Ready for you to call back" },
                  { t: "You call back", sub: "You keep the job" },
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
              <p className="mt-6 text-[13.5px] font-semibold text-moss">No lost customer. Just a lead to call back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VALUE PROPOSITION ============ */}
      <section className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-signal" />
                <Eyebrow>Know who to call back</Eyebrow>
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.03em] leading-[1.06] text-ink max-w-lg">
                Don&apos;t just text missed callers. Know who to call back.
              </h2>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-lg">
                Valix turns missed calls into qualified leads. The AI follows up by SMS, finds out what the
                caller needs, detects urgency, and puts the best opportunities at the top of your list.
              </p>
              <div className="mt-7 space-y-3">
                {[
                  "The caller, and what they need",
                  "How urgent it is",
                  "Ranked so you call the right people first",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-moss/15 flex items-center justify-center">
                      <Check className="w-3 h-3 text-moss" />
                    </span>
                    <span className="text-[14.5px] text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead dashboard */}
            <div className="rounded-3xl border border-line bg-paper p-5 sm:p-6 shadow-[0_36px_80px_-24px_rgba(22,19,17,0.25)]">
              <div className="flex items-center justify-between px-1 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-moss/15 text-moss flex items-center justify-center">
                    <LayoutDashboard className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-ink leading-tight">Your lead dashboard</p>
                    <p className="text-[10.5px] text-ink-soft">Ranked by urgency and intent</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-moss rounded-full px-2.5 py-1 uppercase">
                  <Zap className="w-3 h-3" /> Live
                </span>
              </div>
              <div className="space-y-2.5">
                <LeadCard tone="hot" name="Mike J." need="Water heater leak" meta="Urgency: High · Needs service: Today" action="Call now" />
                <LeadCard tone="hot" name="Sarah K." need="Bathroom remodel quote" meta="Quote requested" action="Call now" />
                <LeadCard tone="warm" name="Devon L." need="Furnace repair" action="Follow up" />
              </div>
              <div className="mt-4 pt-4 border-t border-line px-1">
                <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-soft/60">Example view</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Everything included</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Miss a call? Valix texts them.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-lg mx-auto">
              AI finds out what they need. You see the qualified lead. You call them back.
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
      <section id="how-it-works" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>How it works</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              From missed call to qualified lead.
            </h2>
          </div>

          {/* Timeline */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-[12px] font-mono uppercase tracking-wide text-ink-soft">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5"><PhoneMissed className="w-3.5 h-3.5 text-signal-dark" /> Missed call</span>
            <span className="text-ink-soft/40">↓</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5"><MessageSquareText className="w-3.5 h-3.5 text-signal-dark" /> SMS</span>
            <span className="text-ink-soft/40">↓</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5"><Sparkles className="w-3.5 h-3.5 text-signal-dark" /> AI chat</span>
            <span className="text-ink-soft/40">↓</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-signal bg-signal-soft px-3 py-1.5 font-bold text-signal-dark"><Zap className="w-3.5 h-3.5" /> Qualified lead</span>
            <span className="text-ink-soft/40">↓</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5"><PhoneCall className="w-3.5 h-3.5 text-moss" /> Call back</span>
          </div>

          <div className="mt-14 grid md:grid-cols-4 gap-6">
            {[
              { n: "Step 1", title: "Miss a call", desc: "The customer calls while you're busy." },
              { n: "Step 2", title: "AI texts them", desc: "Valix automatically sends an SMS and starts a conversation." },
              { n: "Step 3", title: "AI qualifies them", desc: "It finds out what they need and how urgent it is." },
              { n: "Step 4", title: "You call back", desc: "You get the qualified lead and know exactly who needs your attention." },
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Pricing</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              One recovered job can pay for the monthly plan.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              Pick the plan that matches how busy you are. Upgrade, downgrade, or cancel anytime. Every plan
              catches missed calls — higher plans catch them for more of your business.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  plan.highlight
                    ? "bg-ink text-white border-ink shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)]"
                    : "bg-paper border-line"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-ink"}`}>{plan.name}</h3>
                  {plan.highlight && <Zap className="w-4 h-4 text-signal" />}
                </div>
                <p className={`mt-2 text-[13px] leading-relaxed ${plan.highlight ? "text-white/60" : "text-ink-soft"}`}>
                  {plan.tagline}
                </p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className={`text-[46px] font-extrabold tracking-tight leading-none ${plan.highlight ? "text-white" : "text-ink"}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-ink-soft"}`}>/month</span>
                </div>
                <p className={`mt-1 text-xs ${plan.highlight ? "text-white/50" : "text-ink-soft/80"}`}>per business · cancel anytime</p>

                <ul className="mt-7 space-y-3 flex-1">
                  {plan.monthly.map((f) => (
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
                  Recover my missed calls
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-ink-soft">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-moss" /> Secure handling of customer info</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> No contracts, cancel anytime</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-moss" /> No CRM required</span>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT / TRUST ============ */}
      <section className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Who it&apos;s for</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Built for businesses that depend on the phone
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              If your customers call you to book the job, Valix makes sure you never miss the chance to
              win it back.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {["Plumbers", "Electricians", "HVAC", "Roofers", "Landscapers", "Locksmiths"].map((t) => (
              <div key={t} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-cream px-4 py-4 text-[14px] font-semibold text-ink-soft">
                <PhoneCall className="w-3.5 h-3.5 text-signal shrink-0" />
                {t}
              </div>
            ))}
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { icon: ShieldCheck, title: "Secure handling", desc: "Customer conversations and phone numbers are handled with care, and covered by our privacy policy and terms." },
              { icon: Check, title: "No long-term contract", desc: "Plans can be cancelled anytime. No lock-in, no hassle." },
              { icon: Zap, title: "Simple setup", desc: "Connect your number and you're live in minutes. No CRM, no integration project." },
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
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>FAQ</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Questions owners ask
            </h2>
          </div>
          <div className="bg-paper border border-line rounded-2xl px-6">
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
              Stop losing customers to missed calls.
            </h2>
            <p className="mt-4 text-base text-white/60 leading-relaxed max-w-md mx-auto">
              Let Valix follow up instantly, qualify the caller, and put the best missed-call leads in front
              of you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <PrimaryCTA onClick={handleCTA} />
            </div>
            <div className="mt-6 flex items-center justify-center gap-5 flex-wrap text-[12px] text-white/50">
              <p className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-[#6ee7a0]" /> Live in minutes</p>
              <p className="flex items-center gap-1.5"><PhoneMissed className="w-3 h-3 text-[#6ee7a0]" /> No CRM required</p>
              <p className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6ee7a0]" /> Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
