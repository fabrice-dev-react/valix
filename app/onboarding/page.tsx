"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Question {
  id: string;
  type: "text" | "single" | "multi";
  label: string;
  sub?: string;
  placeholder?: string;
  emoji?: string;
  options?: { id: string; label: string; emoji?: string }[];
  maxSelect?: number;
}

const questions: Question[] = [
  {
    id: "name",
    type: "text",
    label: "What's your name?",
    sub: "We'll use this to personalize your experience.",
    placeholder: "Type your name...",
    emoji: "👋",
  },
  {
    id: "monthlyIncomeGoal",
    type: "single",
    label: "How much do you want to make per month?",
    sub: "This helps us recommend side hustles that match your income expectations.",
    emoji: "💰",
    options: [
      { id: "500-1000", label: "$500 – $1,000", emoji: "🌱" },
      { id: "1000-3000", label: "$1,000 – $3,000", emoji: "🌿" },
      { id: "3000-5000", label: "$3,000 – $5,000", emoji: "🌳" },
      { id: "5000-10000", label: "$5,000 – $10,000", emoji: "🔥" },
      { id: "10000+", label: "$10,000+", emoji: "🚀" },
    ],
  },
  {
    id: "weeklyTimeCommitment",
    type: "single",
    label: "How much time can you commit per week?",
    sub: "Your available time determines which strategies work best for you.",
    emoji: "⏰",
    options: [
      { id: "1-5", label: "1 – 5 hours", emoji: "☕" },
      { id: "5-15", label: "5 – 15 hours", emoji: "📚" },
      { id: "15-30", label: "15 – 30 hours", emoji: "💼" },
      { id: "30-40", label: "30 – 40 hours", emoji: "🏗️" },
      { id: "40+", label: "40+ hours", emoji: "⚡" },
    ],
  },
  {
    id: "startupCapital",
    type: "single",
    label: "How much can you invest to start?",
    sub: "Some side hustles need zero investment, others benefit from a small budget. Both work.",
    emoji: "🏦",
    options: [
      { id: "0", label: "Nothing — $0", emoji: "✨" },
      { id: "1-100", label: "$1 – $100", emoji: "🪙" },
      { id: "100-500", label: "$100 – $500", emoji: "💵" },
      { id: "500-2000", label: "$500 – $2,000", emoji: "💰" },
      { id: "2000+", label: "$2,000+", emoji: "🏦" },
    ],
  },
  {
    id: "skills",
    type: "multi",
    label: "What skills do you have?",
    sub: "Your existing skills give you a head start. It's okay if you're starting from zero.",
    emoji: "🎯",
    maxSelect: 6,
    options: [
      { id: "writing", label: "Writing", emoji: "✍️" },
      { id: "design", label: "Design", emoji: "🎨" },
      { id: "video", label: "Video / Editing", emoji: "🎬" },
      { id: "coding", label: "Coding / Tech", emoji: "💻" },
      { id: "sales", label: "Sales / Marketing", emoji: "📣" },
      { id: "teaching", label: "Teaching", emoji: "🎓" },
      { id: "data", label: "Data / Analytics", emoji: "📊" },
      { id: "social", label: "Social Media", emoji: "📱" },
      { id: "none", label: "Starting from zero", emoji: "🌱" },
    ],
  },
  {
    id: "comfortableWithPeople",
    type: "single",
    label: "Are you comfortable talking to people?",
    sub: "This helps us suggest side hustles that fit your communication style.",
    emoji: "🗣️",
    options: [
      { id: "yes", label: "Yes, I enjoy it", emoji: "😊" },
      { id: "somewhat", label: "Somewhat", emoji: "🤔" },
      { id: "no", label: "Not really", emoji: "🎧" },
    ],
  },
  {
    id: "languages",
    type: "multi",
    label: "What languages do you speak?",
    sub: "Speaking multiple languages opens up bigger markets and more opportunities.",
    emoji: "🌍",
    maxSelect: 5,
    options: [
      { id: "english", label: "English", emoji: "🇬🇧" },
      { id: "spanish", label: "Spanish", emoji: "🇪🇸" },
      { id: "french", label: "French", emoji: "🇫🇷" },
      { id: "german", label: "German", emoji: "🇩🇪" },
      { id: "portuguese", label: "Portuguese", emoji: "🇧🇷" },
      { id: "arabic", label: "Arabic", emoji: "🇸🇦" },
      { id: "hindi", label: "Hindi", emoji: "🇮🇳" },
      { id: "mandarin", label: "Mandarin", emoji: "🇨🇳" },
      { id: "japanese", label: "Japanese", emoji: "🇯🇵" },
      { id: "korean", label: "Korean", emoji: "🇰🇷" },
      { id: "other", label: "Other", emoji: "🌐" },
    ],
  },
  {
    id: "interests",
    type: "multi",
    label: "What interests you most?",
    sub: "Pick up to 3. We'll find side hustles that align with what excites you.",
    emoji: "✨",
    maxSelect: 3,
    options: [
      { id: "ai-automation", label: "AI & Automation", emoji: "🤖" },
      { id: "content-creation", label: "Content Creation", emoji: "🎥" },
      { id: "ecommerce", label: "E-commerce", emoji: "🛒" },
      { id: "freelancing", label: "Freelancing", emoji: "🤝" },
      { id: "consulting", label: "Consulting / Coaching", emoji: "🧠" },
      { id: "saas", label: "SaaS / Apps", emoji: "⚡" },
      { id: "social-media", label: "Social Media", emoji: "📱" },
      { id: "education", label: "Online Education", emoji: "📖" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [textInput, setTextInput] = useState("");
  const [multiSelects, setMultiSelects] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const inputRef = useRef<HTMLInputElement>(null);

  const total = questions.length;
  const current = questions[step];

  useEffect(() => {
    if (status === "unauthenticated") router.push("/?login=1");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/onboarding");
        const data = await res.json();
        if (cancelled) return;
        const p = data.profile || {};
        const sh = p.sideHustleProfile || {};
        const saved: Record<string, string | string[]> = {};
        if (p.businessName) saved.name = p.businessName;
        if (sh.monthlyIncomeGoal) saved.monthlyIncomeGoal = sh.monthlyIncomeGoal;
        if (sh.weeklyTimeCommitment) saved.weeklyTimeCommitment = sh.weeklyTimeCommitment;
        if (sh.startupCapital) saved.startupCapital = sh.startupCapital;
        if (Array.isArray(sh.skills) && sh.skills.length) saved.skills = sh.skills;
        if (sh.comfortableWithPeople) saved.comfortableWithPeople = sh.comfortableWithPeople;
        if (Array.isArray(sh.languages) && sh.languages.length) saved.languages = sh.languages;
        if (Array.isArray(sh.interests) && sh.interests.length) saved.interests = sh.interests;

        if (Object.keys(saved).length > 0) {
          setAnswers(saved);
          if (typeof saved.name === "string") setTextInput(saved.name);
          if (Array.isArray(saved.skills)) setMultiSelects((p) => ({ ...p, skills: saved.skills as string[] }));
          if (Array.isArray(saved.languages)) setMultiSelects((p) => ({ ...p, languages: saved.languages as string[] }));
          if (Array.isArray(saved.interests)) setMultiSelects((p) => ({ ...p, interests: saved.interests as string[] }));
          const firstUnanswered = questions.findIndex((q) => !Object.keys(saved).includes(q.id));
          if (firstUnanswered > 0) setStep(firstUnanswered);
        }
      } catch {
        // fresh
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [status]);

  useEffect(() => {
    if (current?.type === "text") {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [step, current]);

  const canProceed = () => {
    if (!current) return false;
    if (current.type === "text") return textInput.trim().length > 0;
    if (current.type === "single") return !!answers[current.id];
    if (current.type === "multi") return (multiSelects[current.id] || []).length > 0;
    return false;
  };

  const persist = async (stepIndex: number, completed: boolean, finalAnswers?: Record<string, string | string[]>): Promise<boolean> => {
    setSaving(true);
    setError(null);
    const a = finalAnswers || answers;
    try {
      const shData: Record<string, unknown> = {};
      if (a.monthlyIncomeGoal) shData.monthlyIncomeGoal = a.monthlyIncomeGoal;
      if (a.weeklyTimeCommitment) shData.weeklyTimeCommitment = a.weeklyTimeCommitment;
      if (a.startupCapital) shData.startupCapital = a.startupCapital;
      if (Array.isArray(a.skills)) {
        shData.skills = a.skills;
        shData.willingToLearn = a.skills.includes("none");
      }
      if (a.comfortableWithPeople) shData.comfortableWithPeople = a.comfortableWithPeople;
      if (Array.isArray(a.languages)) shData.languages = a.languages;
      if (Array.isArray(a.interests)) shData.interests = a.interests;

      const res = await fetch("/api/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          onboardingStep: stepIndex,
          onboardingCompleted: completed,
          businessName: a.name || "",
          sideHustleProfile: shData,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      return true;
    } catch (e) {
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (!canProceed()) return;
    setDirection("next");

    if (current.type === "text") {
      setAnswers((prev) => ({ ...prev, [current.id]: textInput.trim() }));
    }
    if (current.type === "multi") {
      setAnswers((prev) => ({ ...prev, [current.id]: multiSelects[current.id] || [] }));
    }

    const updated = {
      ...answers,
      [current.id]: current.type === "text" ? textInput.trim() : current.type === "multi" ? (multiSelects[current.id] || []) : answers[current.id],
    };

    if (step === total - 1) {
      setCompleting(true);
      setError(null);
      const saved = await persist(total, true, updated);
      if (!saved) {
        setCompleting(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/refresh-session", { method: "POST" });
        if (!res.ok) throw new Error("Session refresh failed");
        router.push("/dashboard");
      } catch {
        router.push("/dashboard");
      }
      return;
    }

    const saved = await persist(step + 1, false, updated);
    if (!saved) return;
    setTextInput("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setDirection("back");
    const prevQ = questions[step - 1];
    if (prevQ.type === "text" && typeof answers[prevQ.id] === "string") {
      setTextInput(answers[prevQ.id] as string);
    }
    setStep((prev) => prev - 1);
  };

  const handleMultiToggle = (optionId: string) => {
    const max = current.maxSelect || 99;
    setMultiSelects((prev) => {
      const sel = prev[current.id] || [];
      const next = sel.includes(optionId)
        ? sel.filter((id) => id !== optionId)
        : sel.length < max
          ? [...sel, optionId]
          : sel;
      return { ...prev, [current.id]: next };
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  if (status === "loading" || !loaded) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col overflow-hidden relative">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-signal/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-signal/5 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 pt-6 pb-2">
        <div className="max-w-xl mx-auto flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="Valix" className="w-8 h-8 rounded-[9px] group-hover:scale-105 transition-transform" />
            <span className="text-[17px] font-bold tracking-tight text-ink">Valix</span>
          </Link>
          <span className="text-[13px] font-semibold text-ink-soft">
            {step + 1}<span className="text-ink-soft/40"> / {total}</span>
          </span>
        </div>

        {/* Segmented dots */}
        <div className="max-w-xl mx-auto flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full overflow-hidden bg-mist/80"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  i <= step ? "w-full bg-signal" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-lg">
          <div
            key={`${step}-${direction}`}
            className={`${direction === "next" ? "animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)]" : "animate-[slideInBack_0.35s_cubic-bezier(0.16,1,0.3,1)]"}`}
          >
            {/* Emoji */}
            <div className="mb-5">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-paper border border-line shadow-sm text-2xl">
                {current.emoji}
              </span>
            </div>

            {/* Question */}
            <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.035em] leading-[1.1] text-ink">
              {current.label}
            </h1>
            {current.sub && (
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft max-w-md">
                {current.sub}
              </p>
            )}

            {/* Text input */}
            {current.type === "text" && (
              <div className="mt-8">
                <input
                  ref={inputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={current.placeholder}
                  className="w-full rounded-2xl border-2 border-line bg-paper px-5 py-4 text-[17px] font-medium text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-signal focus:ring-4 focus:ring-signal/10 transition-all duration-200"
                />
              </div>
            )}

            {/* Single select */}
            {current.type === "single" && current.options && (
              <div className="mt-8 grid gap-2.5">
                {current.options.map((opt, i) => {
                  const selected = answers[current.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers((prev) => ({ ...prev, [current.id]: opt.id }))}
                      style={{ animationDelay: `${i * 40}ms` }}
                      className={`group relative flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 animate-[optionIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both] ${
                        selected
                          ? "border-signal bg-signal-soft shadow-[0_0_0_1px_rgba(255,77,47,0.1)]"
                          : "border-line bg-paper hover:border-ink/15 hover:shadow-sm"
                      }`}
                    >
                      <span className={`flex items-center justify-center w-6 h-6 shrink-0 rounded-full border-2 transition-all duration-200 ${
                        selected ? "border-signal bg-signal scale-110" : "border-line group-hover:border-ink/30"
                      }`}>
                        {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </span>
                      {opt.emoji && (
                        <span className="text-lg shrink-0">{opt.emoji}</span>
                      )}
                      <span className={`text-[15.5px] font-semibold transition-colors ${
                        selected ? "text-signal-dark" : "text-ink"
                      }`}>
                        {opt.label}
                      </span>
                      {selected && (
                        <span className="ml-auto">
                          <ChevronRight className="w-4 h-4 text-signal" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Multi select */}
            {current.type === "multi" && current.options && (
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-2.5">
                  {current.options.map((opt, i) => {
                    const selected = (multiSelects[current.id] || []).includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleMultiToggle(opt.id)}
                        style={{ animationDelay: `${i * 35}ms` }}
                        className={`group relative flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-200 animate-[optionIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both] ${
                          selected
                            ? "border-signal bg-signal-soft shadow-[0_0_0_1px_rgba(255,77,47,0.1)]"
                            : "border-line bg-paper hover:border-ink/15 hover:shadow-sm"
                        }`}
                      >
                        <span className={`flex items-center justify-center w-5 h-5 shrink-0 rounded-lg border-2 transition-all duration-200 ${
                          selected ? "border-signal bg-signal scale-110" : "border-line group-hover:border-ink/30"
                        }`}>
                          {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </span>
                        {opt.emoji && (
                          <span className="text-base shrink-0">{opt.emoji}</span>
                        )}
                        <span className={`text-[13.5px] font-semibold transition-colors ${
                          selected ? "text-signal-dark" : "text-ink"
                        }`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {current.maxSelect && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: current.maxSelect }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i < (multiSelects[current.id] || []).length
                              ? "bg-signal scale-110"
                              : "bg-mist"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[12.5px] font-medium text-ink-soft">
                      {(multiSelects[current.id] || []).length} of {current.maxSelect}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 px-4 sm:px-6 pb-8 pt-4">
        {error && (
          <div className="max-w-xl mx-auto mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="shrink-0 text-red-500">⚠</span>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="shrink-0 text-red-400 hover:text-red-600 font-bold">✕</button>
          </div>
        )}
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink-soft hover:text-ink transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || saving || completing}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-signal text-white text-[15px] font-bold hover:bg-signal-dark transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_8px_30px_-8px_rgba(255,77,47,0.5)] hover:shadow-[0_8px_40px_-8px_rgba(255,77,47,0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {completing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Finding your side hustle...
              </>
            ) : step === total - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Find my side hustle
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
