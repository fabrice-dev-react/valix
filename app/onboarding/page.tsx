"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";

type Step = "business" | "details";

const businessTypes = [
  "Home services",
  "Medical / Dental",
  "Legal",
  "Salon / Spa",
  "Auto services",
  "Real estate",
  "Restaurant",
  "Fitness / Yoga",
  "Contractor / Trades",
  "Other",
];

const tones = [
  { id: "professional", label: "Professional", desc: "Polished and trustworthy" },
  { id: "friendly", label: "Friendly", desc: "Warm and conversational" },
  { id: "concise", label: "Concise", desc: "Short and to the point" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { status } = useSession();
  const [step, setStep] = useState<Step>("business");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [open, setOpen] = useState("09:00");
  const [close, setClose] = useState("17:00");
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [aiTone, setAiTone] = useState("professional");
  const [aiInstructions, setAiInstructions] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=1");
      return;
    }
    if (status !== "authenticated") return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/onboarding");
        const data = await res.json();
        if (cancelled) return;
        const p = data.profile || {};
        if (p.businessName) setBusinessName(p.businessName);
        if (p.businessType) setBusinessType(p.businessType);
        if (p.businessDescription) setBusinessDescription(p.businessDescription);
        if (p.businessHours?.open) setOpen(p.businessHours.open);
        if (p.businessHours?.close) setClose(p.businessHours.close);
        if (Array.isArray(p.businessHours?.days) && p.businessHours.days.length)
          setDays(p.businessHours.days);
        if (p.aiTone) setAiTone(p.aiTone);
        if (p.aiInstructions) setAiInstructions(p.aiInstructions);
        const stepIndex = p.onboardingStep ?? 0;
        setStep(stepIndex === 1 ? "details" : "business");
      } catch {
        // ignore, start fresh
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, router]);

  const persist = useCallback(
    async (stepIndex: number, completed: boolean, partial?: Record<string, unknown>) => {
      setSaving(true);
      try {
        await fetch("/api/onboarding", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            onboardingStep: stepIndex,
            onboardingCompleted: completed === true,
            ...partial,
          }),
        });
        setSaved(true);
      } catch {
        setSaved(false);
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const markDirty = useCallback(() => {
    setSaved(false);
  }, []);

  const draft = useCallback((): Record<string, unknown> => {
    return {
      businessName,
      businessType,
      businessDescription,
      businessHours: { open, close, days },
      aiTone,
      aiInstructions,
    };
  }, [businessName, businessType, businessDescription, open, close, days, aiTone, aiInstructions]);

  const autoSave = useCallback(
    (stepIndex: number) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        persist(stepIndex, false, draft());
      }, 900);
    },
    [persist, draft]
  );

  useEffect(() => {
    if (!loaded || saved) return;
    if (step === "business") autoSave(0);
    else autoSave(1);
  }, [saved, loaded, step, draft, autoSave]);

  const toggleDay = (d: string) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
    markDirty();
  };

  const stepOrder: Step[] = ["business", "details"];
  const currentIndex = stepOrder.indexOf(step);

  const businessValid = businessName.trim().length > 1 && businessType.trim().length > 0;
  const detailsValid = true;

  const canNext = step === "business" ? businessValid : detailsValid;

  const handleContinue = async () => {
    if (step === "business") {
      await persist(1, false, draft());
      setStep("details");
    } else {
      await persist(2, true, draft());
      const res = await fetch("/api/auth/refresh-session", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (data?.phoneStatus && data.phoneStatus !== "not_connected") {
        router.push("/dashboard");
      } else {
        router.push("/phone");
      }
    }
  };

  if (status === "loading" || !loaded) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">One moment</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="border-b border-line bg-paper/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Valix" className="w-8 h-8 rounded-[9px]" />
            <span className="text-[17px] font-bold tracking-tight text-ink">Valix</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Step {currentIndex + 1} of {stepOrder.length}
            </span>
            {saving ? (
              <span className="w-4 h-4 border-2 border-signal border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <span className="text-[11px] font-medium text-moss">Saved</span>
            ) : null}
          </div>
        </div>
        <div className="h-0.5 bg-line">
          <div
            className="h-full bg-signal transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / (stepOrder.length + 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-xl">
          {step === "business" && (
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-xl bg-signal-soft flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-signal-dark" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                    Tell us about your business
                  </h1>
                  <p className="text-[14px] text-ink-soft mt-1">
                    This helps Valix answer calls like your team would.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                    Business name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); markDirty(); }}
                    placeholder="e.g. Maple Dental Studio"
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                    Business description
                  </label>
                  <textarea
                    rows={3}
                    value={businessDescription}
                    onChange={(e) => { setBusinessDescription(e.target.value); markDirty(); }}
                    placeholder="e.g. Family-owned dental studio specialising in cosmetic and emergency dentistry."
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                    Business type
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {businessTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setBusinessType(t); markDirty(); }}
                        className={`rounded-xl border px-4 py-3 text-left text-[13.5px] font-medium transition-all ${
                          businessType === t
                            ? "border-signal bg-signal-soft ring-1 ring-signal/20 text-ink"
                            : "border-line bg-paper text-ink-soft hover:border-ink/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-xl bg-signal-soft flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-signal-dark" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                    How should Valix handle calls?
                  </h1>
                  <p className="text-[14px] text-ink-soft mt-1">
                    Set your hours and how your AI should sound.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                    Business hours
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <button
                        key={d}
                        onClick={() => toggleDay(d)}
                        className={`px-3 py-2 rounded-lg border text-[13px] font-semibold transition-all ${
                          days.includes(d)
                            ? "border-signal bg-signal-soft text-signal-dark"
                            : "border-line bg-paper text-ink-soft hover:border-ink/20"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-ink-soft" />
                      <input
                        type="time"
                        value={open}
                        onChange={(e) => { setOpen(e.target.value); markDirty(); }}
                        className="rounded-lg border border-line bg-paper px-3 py-2 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-signal/30"
                      />
                    </div>
                    <span className="text-ink-soft">to</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-ink-soft" />
                      <input
                        type="time"
                        value={close}
                        onChange={(e) => { setClose(e.target.value); markDirty(); }}
                        className="rounded-lg border border-line bg-paper px-3 py-2 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-signal/30"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                    Tone
                  </label>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {tones.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setAiTone(t.id); markDirty(); }}
                        className={`rounded-xl border px-4 py-3 text-left transition-all ${
                          aiTone === t.id ? "border-signal bg-signal-soft ring-1 ring-signal/20" : "border-line bg-paper hover:border-ink/20"
                        }`}
                      >
                        <p className={`text-[14px] font-semibold ${aiTone === t.id ? "text-signal-dark" : "text-ink"}`}>{t.label}</p>
                        <p className="text-[12px] text-ink-soft">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                    Anything Valix should know?
                  </label>
                  <textarea
                    value={aiInstructions}
                    onChange={(e) => { setAiInstructions(e.target.value); markDirty(); }}
                    rows={3}
                    placeholder="e.g. Always offer the next available appointment slot, mention our Saturday hours, and never quote prices before understanding the job."
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            {currentIndex > 0 ? (
              <button
                onClick={() => setStep(stepOrder[currentIndex - 1])}
                className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft hover:text-ink transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleContinue}
              disabled={!canNext || saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-signal text-white text-[14px] font-semibold hover:bg-signal-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_12px_28px_-10px_rgba(255,77,47,0.5)]"
            >
              {step === "details" ? (
                <>
                  Finish setup
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
