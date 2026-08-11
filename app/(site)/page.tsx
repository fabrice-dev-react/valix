"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useLogin } from "@/components/LoginContext";
import {
  ArrowRight,
  BedDouble,
  Bot,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarClock,
  CarFront,
  Contact,
  CreditCard,
  Dumbbell,
  GraduationCap,
  Handshake,
  Headset,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Scissors,
  Sheet,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UserPlus,
  UtensilsCrossed,
  Zap,
} from "lucide-react";

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

/* ============================================================
   HERO — realistic WhatsApp conversation between customer & AI
   ============================================================ */
function WhatsAppChat() {
  return (
    <div className="rounded-3xl border border-line bg-paper shadow-[0_32px_64px_-24px_rgba(22,19,17,0.28)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-cream">
        <span className="w-9 h-9 rounded-full bg-moss flex items-center justify-center text-white text-[13px] font-bold">
          B
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-ink leading-tight">Bloom Hair Studio</p>
          <p className="flex items-center gap-1.5 text-[12px] text-ink-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            AI assistant · online
          </p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 text-[#1da851] text-[11px] font-bold px-2.5 py-1">
          <Bot className="w-3 h-3" />
          AI
        </span>
      </div>

      <div className="bg-mist/40 px-5 py-6 space-y-3">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#d9fdd3] px-4 py-2.5 shadow-sm">
            <p className="text-[13.5px] leading-relaxed text-ink">
              Hi! How much is a haircut? And are you open tomorrow?
            </p>
            <p className="mt-1 text-right text-[10px] text-ink-soft/70">09:12</p>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-paper border border-line px-4 py-2.5 shadow-sm">
            <p className="text-[13.5px] leading-relaxed text-ink">
              Hey Sarah! A classic cut is <span className="font-semibold">$25</span>. We open tomorrow
              at 9 AM — I can book you in. What time works?
            </p>
            <p className="mt-1 text-right text-[10px] text-ink-soft/70">09:12</p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#d9fdd3] px-4 py-2.5 shadow-sm">
            <p className="text-[13.5px] leading-relaxed text-ink">
              3pm works. I&apos;m Sarah Chen, my number is 555-0142.
            </p>
            <p className="mt-1 text-right text-[10px] text-ink-soft/70">09:13</p>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-paper border border-line px-4 py-2.5 shadow-sm">
            <p className="text-[13.5px] leading-relaxed text-ink">
              You&apos;re booked for <span className="font-semibold">tomorrow at 3:00 PM</span> with
              Maria. I&apos;ll send a reminder the day before. See you then! ✅
            </p>
            <p className="mt-1 text-right text-[10px] text-ink-soft/70">09:13</p>
          </div>
        </div>

        <div className="flex justify-center pt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[11px] font-semibold px-3 py-1.5">
            <Headset className="w-3.5 h-3.5" />
            Lead captured · booking confirmed
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-5 py-4 border-t border-line bg-paper">
        <span className="flex-1 rounded-full bg-mist/60 border border-line px-4 py-2.5 text-[13px] text-ink-soft/70">
          Ask us anything…
        </span>
        <span className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   FEATURES
   ============================================================ */
const features = [
  {
    title: "AI customer support",
    desc: "The AI answers questions about your services, prices, opening hours, location, policies and FAQs — instantly, in a natural WhatsApp conversation. You never have to write a prompt or build a workflow.",
    span: "lg:col-span-2 lg:row-span-2",
    visual: "chat",
  },
  {
    title: "Instant answers",
    desc: "Customers get answers in seconds — even when you're busy, closed or sleeping.",
    span: "",
    visual: "bolt",
  },
  {
    title: "Lead capture",
    desc: "The AI collects name, phone, email and what they want — so no enquiry slips away.",
    span: "",
    visual: "lead",
  },
  {
    title: "Booking automation",
    desc: "Customers book, reschedule and confirm appointments directly in the chat.",
    span: "",
    visual: "booking",
  },
  {
    title: "Automatic follow-ups",
    desc: "Reminders before bookings, and a nudge for anyone who asked but didn't book.",
    span: "",
    visual: "followup",
  },
  {
    title: "Human handoff",
    desc: "When a customer needs a real person, the chat transfers to your team. The AI assists your staff — it never replaces them.",
    span: "",
    visual: "handoff",
  },
];

function FeatureVisual({ visual }: { visual: string }) {
  if (visual === "chat") {
    return (
      <div className="mt-6 space-y-2.5">
        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-xl rounded-br-sm bg-[#d9fdd3] px-3.5 py-2 text-[12.5px] text-ink">
            Do you offer keratin treatments?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[82%] rounded-xl rounded-bl-sm bg-paper border border-line px-3.5 py-2 text-[12.5px] text-ink">
            Yes! We have keratin smoothing from $120. Want me to check available slots?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-xl rounded-br-sm bg-[#d9fdd3] px-3.5 py-2 text-[12.5px] text-ink">
            Yes please 🙏
          </div>
        </div>
      </div>
    );
  }
  if (visual === "lead") {
    return (
      <div className="mt-6 space-y-2">
        {[
          ["Name", "Sarah Chen"],
          ["Phone", "+1 555 0142"],
          ["Interested in", "Keratin treatment"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded-lg border border-line bg-paper px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{k}</span>
            <span className="text-[12.5px] font-semibold text-ink">{v}</span>
          </div>
        ))}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-moss/15 text-moss text-[11px] font-bold px-3 py-1">
          <UserPlus className="w-3 h-3" />
          New lead captured
        </span>
      </div>
    );
  }
  if (visual === "booking") {
    return (
      <div className="mt-6 rounded-xl border border-line bg-paper p-3.5">
        <p className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">Booking confirmed</p>
        <p className="mt-1.5 text-[13px] font-bold text-ink">Keratin smoothing</p>
        <p className="mt-0.5 text-[12px] text-ink-soft">Thursday · 2:00 PM</p>
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-moss/10 px-3 py-2">
          <span className="text-[12px] font-semibold text-moss">Confirmed via WhatsApp</span>
          <CalendarCheck className="w-4 h-4 text-moss" />
        </div>
      </div>
    );
  }
  if (visual === "followup") {
    return (
      <div className="mt-6 space-y-2">
        <div className="rounded-xl border border-line bg-paper px-3.5 py-2.5">
          <p className="text-[12.5px] text-ink">
            Hi Sarah, you asked about a cut earlier — want me to book you in this week? 🗓️
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-ink-soft">
            Follow-up · 3 days later
          </p>
        </div>
      </div>
    );
  }
  if (visual === "handoff") {
    return (
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[11px] font-semibold px-3 py-1.5">
          <Headset className="w-3.5 h-3.5" />
          Transferred to Maria
        </span>
        <span className="text-[11px] text-ink-soft">your stylist</span>
      </div>
    );
  }
  return (
    <div className="mt-6 flex items-center gap-2">
      <span className="w-8 h-8 rounded-lg bg-signal-soft flex items-center justify-center">
        <Zap className="w-4 h-4 text-signal-dark" />
      </span>
      <span className="text-[12px] font-semibold text-ink">&lt; 3 seconds to reply</span>
    </div>
  );
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */
const steps = [
  {
    number: "01",
    title: "We learn your business",
    desc: "We collect everything the AI needs to know: your services, prices, opening hours, location, FAQs, policies and booking rules.",
  },
  {
    number: "02",
    title: "We build your AI assistant",
    desc: "We configure the AI for your business — conversation flows, WhatsApp connection, booking setup, lead capture and human handoff rules.",
  },
  {
    number: "03",
    title: "We connect it to WhatsApp",
    desc: "Your AI assistant goes live on your own WhatsApp Business number. Customers message you exactly like they always have.",
  },
  {
    number: "04",
    title: "We test and launch",
    desc: "Before anything goes live, we run real customer conversations to make sure the AI answers correctly. Then we launch.",
  },
  {
    number: "05",
    title: "We maintain and improve it",
    desc: "We keep monitoring, updating business info, adding FAQs, improving responses and fixing issues. You don't manage anything.",
  },
];

/* ============================================================
   INDUSTRIES
   ============================================================ */
const industries = [
  { icon: Scissors, name: "Salons & Barbers", note: "Bookings, prices, reminders" },
  { icon: Stethoscope, name: "Clinics", note: "Appointments & patient info" },
  { icon: UtensilsCrossed, name: "Restaurants", note: "Reservations & hours" },
  { icon: Building2, name: "Real Estate", note: "Viewings & lead capture" },
  { icon: BedDouble, name: "Hotels", note: "Stays & guest questions" },
  { icon: CarFront, name: "Auto Services", note: "Repairs & quotes" },
  { icon: Dumbbell, name: "Fitness", note: "Classes & memberships" },
  { icon: Briefcase, name: "Professional Services", note: "Consultations & bookings" },
  { icon: ShoppingBag, name: "Retail", note: "Products & availability" },
  { icon: GraduationCap, name: "Education & Training", note: "Courses & enrollment" },
];

/* ============================================================
   PRICING
   ============================================================ */
const setupIncluded = [
  "AI customer support setup",
  "WhatsApp automation setup",
  "Business information configuration",
  "FAQ setup",
  "Service & product information",
  "Lead capture",
  "Booking automation",
  "Human handoff",
  "Basic follow-up automation",
  "Testing before launch",
  "Launch and setup support",
];

/* ============================================================
   INTEGRATIONS
   ============================================================ */
const integrations = [
  { icon: MessageCircle, name: "WhatsApp Business", color: "#25D366", desc: "Your AI assistant runs on your own WhatsApp number" },
  { icon: CalendarCheck, name: "Google Calendar", color: "#4285F4", desc: "Bookings sync to your calendar automatically" },
  { icon: CalendarClock, name: "Calendly", color: "#00A2FF", desc: "Availability and scheduling connected to the chat" },
  { icon: Contact, name: "HubSpot", color: "#FF7A59", desc: "Captured leads flow straight into your CRM" },
  { icon: Zap, name: "Zapier", color: "#FF4F00", desc: "Connect to 6,000+ apps with a single trigger" },
  { icon: Sheet, name: "Google Sheets", color: "#34A853", desc: "Every new lead lands in a spreadsheet" },
  { icon: MessageSquare, name: "Slack", color: "#4A154B", desc: "Your team is notified the moment a handoff happens" },
  { icon: CreditCard, name: "Stripe", color: "#635BFF", desc: "Collect payments and deposits in the conversation" },
];

const maintenanceIncluded = [
  "AI monitoring",
  "Updating business information",
  "Updating FAQs",
  "Improving AI responses",
  "Small workflow changes",
  "Fixing automation issues",
  "System maintenance",
  "Ongoing support",
];

/* ============================================================
   FAQ
   ============================================================ */
const faqs = [
  {
    q: "Do I need technical knowledge?",
    a: "No. We handle the entire setup and all technical work. You simply provide your business information and tell us what you want the AI to handle.",
  },
  {
    q: "Will AI replace my staff?",
    a: "No. The AI handles repetitive conversations while your staff can take over whenever needed. The goal is to assist your team, not replace them.",
  },
  {
    q: "Can customers book appointments through WhatsApp?",
    a: "Yes. Booking flows are customized to your business — appointments, consultations, meetings, reservations and more can all be handled in the chat.",
  },
  {
    q: "Can the AI answer questions about my business?",
    a: "Yes. We configure it using your business information, services, prices, FAQs and policies, so customers get accurate answers about you.",
  },
  {
    q: "Can a human take over a conversation?",
    a: "Yes. Human handoff is built into the system. When a customer asks for a person, or a conversation needs one, it transfers to your team instantly.",
  },
  {
    q: "Do you maintain the AI after setup?",
    a: "Yes. The optional monthly maintenance plan covers monitoring, updates, improvements and workflow changes. You can also manage the system yourself after setup.",
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

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
  const { openLogin } = useLogin();

  const handleCTA = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      openLogin();
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
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="animate-fade-up">
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  <Eyebrow>Your AI receptionist on WhatsApp</Eyebrow>
                </div>

                <h1 className="mt-7 text-[34px] sm:text-5xl md:text-[52px] lg:text-[58px] font-extrabold tracking-[-0.03em] leading-[1.08] text-ink">
                  We automate your{" "}
                  <span className="text-signal">WhatsApp customer support.</span>
                </h1>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-soft max-w-xl">
                  We build and run an AI assistant that answers your customers in WhatsApp —
                  questions, bookings and leads handled automatically. You don&apos;t set up or
                  manage a thing.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    onClick={handleCTA}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-signal text-white text-[15px] font-semibold hover:bg-signal-dark transition-all duration-200 shadow-[0_16px_40px_-12px_rgba(255,77,47,0.6)]"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-black transition-all duration-200"
                  >
                    Book a Demo
                    <CalendarCheck className="w-4 h-4" />
                  </Link>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2.5">
                    <Stars />
                    <p className="text-[13px] text-ink-soft">
                      <span className="font-semibold text-ink">4.9</span> from 350 businesses
                    </p>
                  </div>
                  <div className="hidden sm:block h-4 w-px bg-line" />
                  <p className="text-[13px] text-ink-soft">
                    We do the setup. You do the business.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
                <WhatsAppChat />
              </div>
            </div>
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
                Your customers are already messaging you. Why make them wait?
              </h2>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-lg">
                Every day, customers ask the same questions — prices, opening hours, availability.
                Your team repeats the same answers over and over, and messages sit unanswered while
                you&apos;re busy. Slow replies cost you customers.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  "Staff spend hours on repetitive questions every week",
                  "Messages go unanswered when you're busy or closed",
                  "Interested customers lose patience and move on",
                  "Bookings and leads slip through the cracks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-signal/10 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-signal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-[14.5px] text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-line bg-cream p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                  The same questions. Every. Single. Day.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "How much does this cost?",
                    "Are you open today?",
                    "Where are you located?",
                    "Can I book tomorrow?",
                    "What time is available?",
                    "Do you offer this service?",
                    "Can I speak to someone?",
                  ].map((q, i) => (
                    <div
                      key={q}
                      className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 animate-fade-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <span className="w-7 h-7 shrink-0 rounded-full bg-mist flex items-center justify-center">
                        <MessageCircle className="w-3.5 h-3.5 text-ink-soft" />
                      </span>
                      <p className="text-[14px] font-medium text-ink">{q}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[13px] text-ink-soft leading-relaxed">
                  Each of these is easy to answer once. Repeating them a hundred times a week is
                  what&apos;s costing your business time and customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOLUTION ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>The solution</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Let AI handle the repetitive conversations
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-lg mx-auto">
              Your customer sends a message, the AI responds instantly, captures the lead or handles
              the booking — and a human takes over when a real person is needed.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { icon: MessageCircle, label: "Customer", desc: "Sends a WhatsApp message", tone: "outline" },
              { icon: Bot, label: "AI understands", desc: "And answers instantly", tone: "green" },
              { icon: Zap, label: "AI responds", desc: "Answers questions", tone: "signal" },
              { icon: UserPlus, label: "Lead captured", desc: "Details collected", tone: "green" },
              { icon: CalendarCheck, label: "Booking made", desc: "Confirmed in chat", tone: "signal" },
              { icon: Headset, label: "Human handoff", desc: "When needed", tone: "ink" },
            ].map((step, i) => (
              <div key={step.label} className="relative">
                <div
                  className={`h-full rounded-2xl border p-5 ${
                    step.tone === "signal"
                      ? "bg-signal-soft border-signal/25"
                      : step.tone === "green"
                        ? "bg-[#e9f9e3] border-[#25D366]/30"
                        : step.tone === "ink"
                          ? "bg-ink border-ink text-white"
                          : "bg-paper border-line"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${
                        step.tone === "ink"
                          ? "bg-white/10 text-white"
                          : step.tone === "green"
                            ? "bg-[#25D366]/15 text-[#1da851]"
                            : step.tone === "signal"
                              ? "bg-signal/15 text-signal-dark"
                              : "bg-mist text-ink-soft"
                      }`}
                    >
                      <step.icon className="w-4.5 h-4.5" />
                    </span>
                    <p
                      className={`text-[13.5px] font-bold leading-tight ${
                        step.tone === "ink" ? "text-white" : "text-ink"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  <p
                    className={`mt-2.5 text-[12px] leading-relaxed ${
                      step.tone === "ink" ? "text-white/60" : "text-ink-soft"
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
                {i < 5 && (
                  <ArrowRight className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/40 z-10 bg-cream rounded-full" />
                )}
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[14px] text-ink-soft max-w-xl mx-auto">
            The result: faster responses, more captured leads, fewer missed bookings — and your team
            free to focus on the customers who need a human. <span className="font-semibold text-ink">We build and manage the entire system for you.</span>
          </p>
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
              Everything your WhatsApp needs to work for you 24/7
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
                <FeatureVisual visual={feature.visual} />
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
                  We do the setup. You watch the bookings come in.
                </h2>
                <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-md">
                  You don&apos;t build the AI, write prompts, configure automation or monitor
                  anything. You provide your business information — we handle the rest, from
                  building to maintenance.
                </p>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-paper px-4 py-2">
                  <span className="font-mono text-xs text-ink-soft">you provide</span>
                  <span className="font-mono text-sm font-bold text-ink">just business info</span>
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

      {/* ============ INDUSTRIES ============ */}
      <section className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Who we help</Eyebrow>
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Built for any small business that runs on WhatsApp
            </h2>
            <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-xl">
              The AI is customized for each business — its services, prices, hours and booking
              rules. If customers reach you on WhatsApp, this works for you.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {industries.map((ind) => (
              <div
                key={ind.name}
                className="rounded-2xl border border-line bg-cream p-5 transition-all duration-200 hover:border-ink/20 hover:shadow-[0_16px_32px_-16px_rgba(22,19,17,0.15)]"
              >
                <span className="w-9 h-9 rounded-lg bg-signal-soft flex items-center justify-center">
                  <ind.icon className="w-4.5 h-4.5 text-signal-dark" />
                </span>
                <h3 className="mt-3.5 text-[14.5px] font-bold text-ink">{ind.name}</h3>
                <p className="mt-1 text-[12px] text-ink-soft">{ind.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTEGRATIONS ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-signal" />
                  <Eyebrow>Integrations</Eyebrow>
                </div>
                <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
                  Plugs into the tools you already use
                </h2>
                <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-md">
                  Your calendar, CRM and payment tools stay in the loop. The AI talks to customers
                  in WhatsApp — and everything it captures lands exactly where you need it.
                </p>
                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2">
                  <span className="font-mono text-xs text-ink-soft">more</span>
                  <span className="font-mono text-sm font-bold text-ink">
                    Instagram · Shopify · Zoom · Gmail
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-paper p-5 transition-all duration-200 hover:border-ink/20 hover:shadow-[0_16px_32px_-16px_rgba(22,19,17,0.15)]"
                  >
                    <span
                      className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: integration.color }}
                    >
                      <integration.icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold tracking-tight text-ink">
                        {integration.name}
                      </h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                        {integration.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BEFORE vs AFTER ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Before vs after</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              The difference AI makes
            </h2>
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-line bg-paper p-7 sm:p-9">
              <span className="inline-flex items-center gap-2 rounded-full bg-mist text-ink-soft text-[11px] font-bold uppercase tracking-wide px-3.5 py-1.5">
                Before
              </span>
              <div className="mt-7 space-y-0">
                {[
                  ["Customer sends a WhatsApp message", "true"],
                  ["Business is busy", "false"],
                  ["Customer waits", "false"],
                  ["Business replies later", "false"],
                  ["Customer may lose interest", "false"],
                ].map(([label, first], i) => (
                  <div key={label} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < 4 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-line" />}
                    <span
                      className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center ${
                        first === "true"
                          ? "border-line bg-paper text-ink-soft"
                          : "border-line bg-mist text-ink-soft/50"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-soft/40" />
                    </span>
                    <p
                      className={`pt-1.5 text-[14.5px] ${
                        first === "true" ? "font-medium text-ink" : "text-ink-soft/60"
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[13px] text-ink-soft leading-relaxed">
                Slow replies, lost momentum, missed customers — and your team doing the same work
                twice.
              </p>
            </div>

            <div className="rounded-3xl bg-ink text-white p-7 sm:p-9 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#25D366]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 text-[#6ee7a0] text-[11px] font-bold uppercase tracking-wide px-3.5 py-1.5">
                  After
                </span>
                <div className="mt-7 space-y-0">
                  {[
                    ["Customer sends a WhatsApp message", "true"],
                    ["AI responds immediately", "false"],
                    ["AI answers questions", "false"],
                    ["AI captures the lead", "false"],
                    ["AI handles the booking", "false"],
                    ["Human takes over when needed", "false"],
                  ].map(([label, first], i) => (
                    <div key={label} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < 5 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-white/10" />}
                      <span
                        className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center ${
                          first === "true"
                            ? "border-white/20 bg-white/5 text-white"
                            : "bg-[#25D366]/20 border-[#25D366]/40 text-[#6ee7a0]"
                        }`}
                      >
                        {first === "true" ? (
                          <MessageCircle className="w-3.5 h-3.5" />
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <p
                        className={`pt-1.5 text-[14.5px] ${
                          first === "true" ? "font-medium text-white" : "text-white/75"
                        }`}
                      >
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[13px] text-white/60 leading-relaxed">
                  Every customer handled instantly — 24/7 — with a human ready to step in whenever
                  it matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Pricing</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Simple pricing. No complicated plans.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-md mx-auto">
              One transparent setup fee. An optional maintenance plan. Nothing hidden.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Setup */}
            <div className="relative flex flex-col rounded-2xl bg-ink text-white p-8 shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                One-time setup
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                WhatsApp AI Automation
              </p>
              <p className="mt-1 text-sm text-white/70">
                We build and configure your WhatsApp AI assistant for your business.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-[52px] font-extrabold tracking-tight leading-none">$249</span>
                <span className="text-sm text-white/60">one-time setup</span>
              </div>
              <p className="mt-1 text-xs text-white/50">Build, test, launch &amp; setup support included</p>

              <ul className="mt-7 space-y-3 flex-1">
                {setupIncluded.map((feature) => (
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
                Get Started
              </button>
            </div>

            {/* Maintenance */}
            <div className="relative flex flex-col rounded-2xl bg-cream border border-line p-8">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#25D366] text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                Optional
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                Monthly Maintenance
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Keep us involved to monitor, improve and manage your system.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-[52px] font-extrabold tracking-tight leading-none text-ink">$59</span>
                <span className="text-sm text-ink-soft">/month</span>
              </div>
              <p className="mt-1 text-xs text-ink-soft/70">
                No long-term commitment · optional after setup
              </p>

              <ul className="mt-7 space-y-3 flex-1">
                {maintenanceIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-moss/10 flex items-center justify-center">
                      {checkIcon}
                    </span>
                    <span className="text-[14px] text-ink">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleCTA}
                className="mt-8 w-full py-3 rounded-full bg-ink text-white text-[14px] font-semibold transition-all duration-200 hover:bg-black"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="mt-10 max-w-4xl mx-auto rounded-2xl border border-line bg-cream p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-soft text-signal-dark text-[11px] font-bold px-3 py-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Important
              </span>
              <p className="text-[13.5px] text-ink-soft leading-relaxed">
                The <span className="font-semibold text-ink">$249 setup fee</span> covers building and
                launching your automation. The <span className="font-semibold text-ink">$59/month</span>{" "}
                covers ongoing management and improvements. Any third-party software fees, WhatsApp/Meta
                messaging charges or external platform costs are separate where applicable.
              </p>
            </div>
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
                  Questions business owners ask us
                </h2>
                <p className="mt-5 text-[15px] text-ink-soft max-w-sm">
                  Something else on your mind?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors"
                  >
                    Contact us
                  </Link>{" "}
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
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#25D366]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 font-semibold">
                Done for you — start to finish
              </p>
            </div>
            <h2 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white">
              Stop spending your day answering the same WhatsApp questions
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/60 leading-relaxed max-w-lg mx-auto">
              Let us build your AI assistant and turn your WhatsApp into an automated customer
              support and booking system.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCTA}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-signal text-white text-[15px] font-semibold hover:bg-signal-dark transition-all duration-200 shadow-[0_16px_40px_-12px_rgba(255,77,47,0.6)]"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/15 text-white text-[15px] font-semibold hover:bg-white/15 transition-all duration-200"
              >
                Book a Demo
                <CalendarCheck className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
              <p className="flex items-center gap-2 text-[13px] text-white/50">
                <Sparkles className="w-3.5 h-3.5 text-[#6ee7a0]" />
                $249 one-time setup
              </p>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
              <p className="flex items-center gap-2 text-[13px] text-white/50">
                <RefreshCw className="w-3.5 h-3.5 text-[#6ee7a0]" />
                Optional $59/month maintenance
              </p>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
              <p className="flex items-center gap-2 text-[13px] text-white/50">
                <Handshake className="w-3.5 h-3.5 text-[#6ee7a0]" />
                No tech skills needed
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
