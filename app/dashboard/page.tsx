"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CreditCard,
  Handshake,
  MessageCircle,
  RefreshCw,
  Sparkles,
  UserPlus,
  Zap,
} from "lucide-react";

const managedServices = [
  { icon: MessageCircle, title: "AI customer support", desc: "Answers every WhatsApp customer instantly, 24/7" },
  { icon: UserPlus, title: "Lead capture", desc: "Names, numbers and enquiries collected automatically" },
  { icon: CalendarCheck, title: "Booking automation", desc: "Bookings confirmed, rescheduled and reminded in chat" },
  { icon: Handshake, title: "Human handoff", desc: "Conversations transfer to your team when needed" },
  { icon: RefreshCw, title: "Ongoing maintenance", desc: "We monitor, update and improve your system for you" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

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

  const firstName = (session?.user?.name || "there").split(" ")[0];
  const hasPaid = !!session?.user?.hasPaid;
  const email = session?.user?.email || "";

  return (
    <div>
      <div className="pt-2 lg:pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
          Portal
        </p>
        <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">
          Welcome back, {firstName}
        </h1>
        <p className="mt-3 text-[15px] text-ink-soft max-w-md">
          Your WhatsApp AI assistant is being built and managed for you. Here&apos;s where things
          stand.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {hasPaid ? (
          <div className="flex items-start sm:items-center gap-3.5 rounded-2xl border border-line bg-paper p-5">
            <span className="w-9 h-9 shrink-0 rounded-full bg-moss/15 flex items-center justify-center">
              <Check className="w-4.5 h-4.5 text-moss" strokeWidth={2.5} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-bold text-ink">Your subscription is active</p>
              <p className="text-[13px] text-ink-soft">
                {email || "Your account"} · manage payments anytime
              </p>
            </div>
            <Link
              href="/billing"
              className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors"
            >
              Billing
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex items-start sm:items-center gap-3.5 rounded-2xl border border-signal/25 bg-signal-soft p-5">
            <span className="w-9 h-9 shrink-0 rounded-full bg-signal/15 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-signal-dark" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-bold text-ink">Activate your project</p>
              <p className="text-[13px] text-ink-soft">
                Complete your subscription and we&apos;ll start building your assistant.
              </p>
            </div>
            <Link
              href="/payment"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[13px] font-semibold px-4 py-2.5 hover:bg-black transition-colors"
            >
              Pay now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-line bg-paper p-6 md:p-7">
            <span className="w-10 h-10 rounded-xl bg-signal-soft flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-signal-dark" />
            </span>
            <h2 className="mt-4 text-[17px] font-bold tracking-tight text-ink">
              Book a consultation
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
              Pick a time and we&apos;ll walk through your business and what the assistant will
              handle — questions, leads, bookings and setup.
            </p>
            <Link
              href="/book"
              className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors"
            >
              Book a meeting
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-6 md:p-7">
            <span className="w-10 h-10 rounded-xl bg-moss/15 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-moss" />
            </span>
            <h2 className="mt-4 text-[17px] font-bold tracking-tight text-ink">
              Billing &amp; payments
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
              View your plan, payment history and subscription status in one place. Cancel anytime.
            </p>
            <Link
              href="/billing"
              className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors"
            >
              Manage billing
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6 md:p-7">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-signal-dark" />
            <h2 className="text-[16px] font-bold text-ink">What we handle for you</h2>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {managedServices.map((service) => (
              <div key={service.title} className="rounded-xl border border-line bg-cream p-4">
                <span className="w-8 h-8 rounded-lg bg-paper border border-line flex items-center justify-center">
                  <service.icon className="w-4 h-4 text-ink" />
                </span>
                <h3 className="mt-3 text-[14px] font-bold text-ink">{service.title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
