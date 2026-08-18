"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Globe,
  Rocket,
  Target,
} from "lucide-react";

const channels = [
  { id: "twitter", label: "Twitter / X", desc: "Threads, replies, DMs" },
  { id: "linkedin", label: "LinkedIn", desc: "Posts, comments, DMs" },
  { id: "reddit", label: "Reddit", desc: "Posts, comments, communities" },
  { id: "seo", label: "SEO / Blog", desc: "Articles, tutorials, guides" },
  { id: "email", label: "Email", desc: "Cold outreach, newsletter" },
  { id: "producthunt", label: "Product Hunt", desc: "Launches, updates" },
  { id: "indiehackers", label: "Indie Hackers", desc: "Posts, engagement" },
  { id: "youtube", label: "YouTube", desc: "Demos, tutorials" },
];

const dailyHours = [
  { value: 0.5, label: "30 min", desc: "Quick daily actions" },
  { value: 1, label: "1 hour", desc: "Focused marketing" },
  { value: 2, label: "2 hours", desc: "Deep marketing work" },
  { value: 3, label: "3+ hours", desc: "All-in marketing" },
];

type Step = "url" | "channels" | "hours" | "goal" | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const { status } = useSession();
  const [step, setStep] = useState<Step>("url");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [marketingGoal, setMarketingGoal] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=1");
    }
  }, [status, router]);

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const res = await fetch("/api/users/check-onboarding");
        const data = await res.json();
        if (data.completed) {
          router.push("/dashboard");
        }
      } catch {
        // continue with onboarding
      }
    }
    if (status === "authenticated") {
      checkOnboarding();
    }
  }, [status, router]);

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const canNext = (() => {
    if (step === "url") return websiteUrl.trim().length > 3;
    if (step === "channels") return selectedChannels.length > 0;
    if (step === "hours") return true;
    if (step === "goal") return marketingGoal.trim().length > 0;
    return false;
  })();

  const handleComplete = useCallback(async () => {
    setSaving(true);
    try {
      await fetch("/api/users/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl,
          channels: selectedChannels,
          dailyHours: selectedHours,
          marketingGoal,
        }),
      });
      router.push("/dashboard");
    } catch {
      setSaving(false);
    }
  }, [websiteUrl, selectedChannels, selectedHours, marketingGoal, router]);

  const stepOrder: Step[] = ["url", "channels", "hours", "goal"];
  const currentIndex = stepOrder.indexOf(step);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
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
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <div className="border-b border-line bg-paper/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Valix" className="w-8 h-8 rounded-[9px]" />
            <span className="text-[17px] font-bold tracking-tight text-ink">Valix</span>
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            Step {currentIndex + 1} of {stepOrder.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-line">
          <div
            className="h-full bg-signal transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / stepOrder.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-xl">
          {/* STEP: Website URL */}
          {step === "url" && (
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-xl bg-signal-soft flex items-center justify-center">
                  <Globe className="w-6 h-6 text-signal-dark" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                    What&apos;s your SaaS website?
                  </h1>
                  <p className="text-[14px] text-ink-soft mt-1">
                    We&apos;ll analyze it to build your custom marketing plan.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                  Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://your-saas.com"
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all"
                  autoFocus
                />
              </div>

              <p className="mt-4 text-[13px] text-ink-soft leading-relaxed">
                We&apos;ll look at your product, audience, and positioning to recommend
                the best marketing channels and actions for your SaaS.
              </p>
            </div>
          )}

          {/* STEP: Channels */}
          {step === "channels" && (
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-xl bg-signal-soft flex items-center justify-center">
                  <Target className="w-6 h-6 text-signal-dark" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                    Which channels interest you?
                  </h1>
                  <p className="text-[14px] text-ink-soft mt-1">
                    Select all that apply. We&apos;ll prioritize based on your SaaS.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {channels.map((ch) => {
                  const selected = selectedChannels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => toggleChannel(ch.id)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                        selected
                          ? "border-signal bg-signal-soft ring-1 ring-signal/20"
                          : "border-line bg-paper hover:border-ink/20"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                          selected
                            ? "border-signal bg-signal text-white"
                            : "border-line"
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-ink">{ch.label}</p>
                        <p className="text-[12px] text-ink-soft">{ch.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP: Daily Hours */}
          {step === "hours" && (
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-xl bg-signal-soft flex items-center justify-center">
                  <Clock className="w-6 h-6 text-signal-dark" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                    How many hours per day for marketing?
                  </h1>
                  <p className="text-[14px] text-ink-soft mt-1">
                    We&apos;ll tailor your daily actions to fit this time.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {dailyHours.map((opt) => {
                  const selected = selectedHours === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedHours(opt.value)}
                      className={`rounded-xl border px-5 py-5 text-center transition-all ${
                        selected
                          ? "border-signal bg-signal-soft ring-1 ring-signal/20"
                          : "border-line bg-paper hover:border-ink/20"
                      }`}
                    >
                      <p className={`text-[24px] font-extrabold ${selected ? "text-signal-dark" : "text-ink"}`}>
                        {opt.label}
                      </p>
                      <p className="mt-1 text-[13px] text-ink-soft">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP: Marketing Goal */}
          {step === "goal" && (
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-xl bg-signal-soft flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-signal-dark" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                    What&apos;s your main marketing goal?
                  </h1>
                  <p className="text-[14px] text-ink-soft mt-1">
                    This helps us prioritize the right actions for you.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  "Get my first 100 users",
                  "Build audience and followers",
                  "Generate consistent leads",
                  "Improve organic traffic",
                  "Launch on Product Hunt",
                  "Get beta users and feedback",
                ].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setMarketingGoal(goal)}
                    className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                      marketingGoal === goal
                        ? "border-signal bg-signal-soft ring-1 ring-signal/20"
                        : "border-line bg-paper hover:border-ink/20"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                        marketingGoal === goal
                          ? "border-signal bg-signal text-white"
                          : "border-line"
                      }`}
                    >
                      {marketingGoal === goal && <Check className="w-3 h-3" />}
                    </span>
                    <span className="text-[14px] font-medium text-ink">{goal}</span>
                  </button>
                ))}

                <div className="pt-2">
                  <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                    Or type your own
                  </label>
                  <input
                    type="text"
                    value={marketingGoal.startsWith("Get my first") || marketingGoal.startsWith("Build") || marketingGoal.startsWith("Generate") || marketingGoal.startsWith("Improve") || marketingGoal.startsWith("Launch") || marketingGoal.startsWith("Get beta") ? "" : marketingGoal}
                    onChange={(e) => setMarketingGoal(e.target.value)}
                    placeholder="e.g. Reach $10k MRR"
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP: Done */}
          {step === "done" && (
            <div className="animate-fade-up text-center">
              <div className="w-16 h-16 rounded-2xl bg-moss/15 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-moss" />
              </div>
              <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                You&apos;re all set!
              </h1>
              <p className="mt-3 text-[15px] text-ink-soft max-w-md mx-auto">
                We&apos;re building your custom marketing plan now. You&apos;ll see your first
                daily actions in your dashboard.
              </p>
              <button
                onClick={handleComplete}
                disabled={saving}
                className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-signal text-white text-[15px] font-semibold hover:bg-signal-dark transition-all shadow-[0_16px_40px_-12px_rgba(255,77,47,0.6)] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation */}
          {step !== "done" && (
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
                onClick={() => {
                  if (step === "goal") {
                    setStep("done");
                  } else {
                    setStep(stepOrder[currentIndex + 1]);
                  }
                }}
                disabled={!canNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-[14px] font-semibold hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === "goal" ? (
                  <>
                    Complete setup
                    <Rocket className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
