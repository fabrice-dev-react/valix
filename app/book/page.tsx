"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  Check,
  Clock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  MEETING_DURATION_MIN,
  MEETING_SLOTS,
  MEETING_TOPIC,
  nextBusinessDays,
  formatDateLabel,
  formatSlotLabel,
} from "@/lib/meetings";

const DAYS = nextBusinessDays(14);

export default function BookPage() {
  const [dateKey, setDateKey] = useState<string>(DAYS[0]?.key ?? "");
  const [slot, setSlot] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState<{ date: string; slot: string } | null>(null);

  useEffect(() => {
    if (!dateKey) return;
    setLoadingSlots(true);
    setSlot(null);
    setError(null);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/meetings/availability?date=${dateKey}`);
        const data = await res.json();
        if (!cancelled) {
          setTakenSlots(Array.isArray(data.slots) ? data.slots : []);
        }
      } catch {
        if (!cancelled) setTakenSlots([]);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dateKey]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const whatsappValid = whatsapp.trim().length >= 7;
  const canSubmit = !!slot && emailValid && whatsappValid;

  const submit = async () => {
    if (!slot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateKey,
          slot,
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setBooked({ date: dateKey, slot });
      setTakenSlots((prev) => [...prev, slot]);
      setSlot(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const firstName = name.trim().split(" ")[0] || "there";

  return (
    <div className="bg-cream text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24">
        {booked ? (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl border border-line bg-paper p-8 sm:p-10 text-center shadow-[0_32px_64px_-32px_rgba(22,19,17,0.25)]">
              <span className="mx-auto w-16 h-16 rounded-full bg-moss/15 flex items-center justify-center">
                <Check className="w-8 h-8 text-moss" strokeWidth={3} />
              </span>
              <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                You&apos;re booked, {firstName}!
              </h1>
              <p className="mt-3 text-[15px] text-ink-soft max-w-sm mx-auto leading-relaxed">
                Your consultation is confirmed for
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-line bg-cream px-6 py-4">
                <CalendarCheck className="w-5 h-5 text-moss" />
                <div className="text-left">
                  <p className="text-[16px] font-bold text-ink">
                    {formatDateLabel(booked.date)}
                  </p>
                  <p className="text-[14px] text-ink-soft">
                    {formatSlotLabel(booked.slot)} · {MEETING_DURATION_MIN} minutes
                  </p>
                </div>
              </div>
              <p className="mt-6 text-[13.5px] text-ink-soft leading-relaxed max-w-sm mx-auto">
                We&apos;ll confirm by email at <span className="font-semibold text-ink">{email}</span>{" "}
                and message you on WhatsApp at{" "}
                <span className="font-semibold text-ink">{whatsapp}</span>. If you need to
                reschedule, just get in touch.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-ink text-white text-[14px] font-semibold hover:bg-black transition-colors"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-signal" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
                  Book a meeting
                </p>
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink leading-[1.05]">
                Book a free consultation
              </h1>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft">
                Pick a time that works for you. We&apos;ll walk through your business, what the
                WhatsApp AI assistant will handle, and how we set everything up for you.
              </p>
            </div>

            <div className="mt-12 grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-signal-dark" />
                    <h2 className="text-[16px] font-bold text-ink">Pick a day</h2>
                  </div>
                  <div className="mt-5 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {DAYS.map((day) => {
                      const active = day.key === dateKey;
                      const d = new Date(`${day.key}T00:00:00`);
                      return (
                        <button
                          key={day.key}
                          onClick={() => setDateKey(day.key)}
                          className={`shrink-0 w-[76px] rounded-xl border px-2 py-3 text-center transition-all duration-150 ${
                            active
                              ? "bg-ink border-ink text-white shadow-[0_8px_20px_-8px_rgba(22,19,17,0.5)]"
                              : "bg-cream border-line text-ink hover:border-ink/30"
                          }`}
                        >
                          <span
                            className={`block text-[11px] font-semibold uppercase ${
                              active ? "text-white/60" : "text-ink-soft"
                            }`}
                          >
                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="mt-0.5 block text-[18px] font-extrabold leading-none">
                            {d.getDate()}
                          </span>
                          <span
                            className={`mt-1 block text-[10px] font-medium uppercase ${
                              active ? "text-white/60" : "text-ink-soft/70"
                            }`}
                          >
                            {d.toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-signal-dark" />
                    <h2 className="text-[16px] font-bold text-ink">Pick a time</h2>
                    <span className="ml-auto text-[12px] text-ink-soft">
                      {MEETING_DURATION_MIN} min · all times local
                    </span>
                  </div>

                  {loadingSlots ? (
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {MEETING_SLOTS.map((s) => (
                        <div key={s} className="h-11 rounded-xl bg-mist/60 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {MEETING_SLOTS.map((s) => {
                        const taken = takenSlots.includes(s);
                        const active = slot === s;
                        return (
                          <button
                            key={s}
                            disabled={taken}
                            onClick={() => setSlot(s)}
                            className={`h-11 rounded-xl border text-[13.5px] font-semibold transition-all duration-150 ${
                              taken
                                ? "border-line bg-mist/40 text-ink-soft/40 line-through cursor-not-allowed"
                                : active
                                  ? "bg-signal border-signal text-white shadow-[0_8px_20px_-8px_rgba(255,77,47,0.6)]"
                                  : "bg-cream border-line text-ink hover:border-ink/30"
                            }`}
                          >
                            {formatSlotLabel(s)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-signal-dark" />
                    <h2 className="text-[16px] font-bold text-ink">Your details</h2>
                  </div>
                  <p className="mt-2 text-[13px] text-ink-soft">
                    Where should we send the confirmation?
                  </p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-[13px] font-semibold text-ink mb-1.5">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-[14px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-ink/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[13px] font-semibold text-ink mb-1.5">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-[14px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-ink/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="whatsapp" className="block text-[13px] font-semibold text-ink mb-1.5">
                        WhatsApp number
                      </label>
                      <input
                        id="whatsapp"
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+1 555 000 0000"
                        className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-[14px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-ink/30 transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mt-5 rounded-xl bg-signal-soft border border-signal/20 px-4 py-3">
                      <p className="text-[13px] font-medium text-signal-dark">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={submit}
                    disabled={!canSubmit || submitting}
                    className="mt-7 w-full h-12 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-black active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Booking…
                      </>
                    ) : (
                      <>
                        Confirm booking
                        <CalendarCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="rounded-2xl bg-ink text-white p-7 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />
                  <div className="relative">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                      Your meeting
                    </p>
                    <h3 className="mt-3 text-xl font-bold tracking-tight text-white">
                      {MEETING_TOPIC}
                    </h3>
                    <p className="mt-2 text-[13.5px] text-white/60 leading-relaxed">
                      A {MEETING_DURATION_MIN}-minute walkthrough of how we&apos;ll automate your
                      WhatsApp — questions, leads, bookings and human handoff.
                    </p>

                    <div className="mt-6 space-y-3">
                      {[
                        { icon: Sparkles, text: "See a live example conversation" },
                        { icon: MessageCircle, text: "Get answers for your business" },
                        { icon: ShieldCheck, text: "Clear pricing, no commitment" },
                      ].map((item) => (
                        <div key={item.text} className="flex items-start gap-3">
                          <span className="mt-0.5 w-6 h-6 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                            <item.icon className="w-3.5 h-3.5 text-[#6ee7a0]" />
                          </span>
                          <p className="text-[13px] text-white/80">{item.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                      <CalendarCheck className="w-4 h-4 text-[#6ee7a0]" />
                      <p className="text-[13px] text-white/80">
                        {slot
                          ? `${formatDateLabel(dateKey)} · ${formatSlotLabel(slot)}`
                          : "No time selected yet"}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[12.5px] text-ink-soft leading-relaxed">
                  Free, no obligation. We&apos;ll confirm by email and WhatsApp.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
