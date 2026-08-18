"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import {
  ArrowRight,
  Check,
  Flame,
  CreditCard,
  Plus,
  Target,
  TrendingUp,
  Zap,
  Sparkles,
} from "lucide-react";

type DailyAction = {
  id: string;
  text: string;
  channel: string;
  completed: boolean;
};

const defaultActions: DailyAction[] = [
  { id: "1", text: "Write a founder story thread on Twitter", channel: "Twitter", completed: false },
  { id: "2", text: "Reply to 5 posts in your niche on LinkedIn", channel: "LinkedIn", completed: false },
  { id: "3", text: "Share one lesson you learned building your SaaS", channel: "Twitter", completed: false },
  { id: "4", text: "Engage in 2 relevant Reddit communities", channel: "Reddit", completed: false },
  { id: "5", text: "Send 3 personalized outreach DMs", channel: "Outreach", completed: false },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [actions, setActions] = useState<DailyAction[]>(defaultActions);
  const [newAction, setNewAction] = useState("");
  const streak = 12;

  const firstName = (session?.user?.name || "there").split(" ")[0];
  const hasPaid = !!session?.user?.hasPaid;
  const completedCount = actions.filter((a) => a.completed).length;
  const totalActions = actions.length;
  const progressPct = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

  const toggleAction = useCallback((id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  }, []);

  const addAction = useCallback(() => {
    if (!newAction.trim()) return;
    setActions((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        text: newAction.trim(),
        channel: "Custom",
        completed: false,
      },
    ]);
    setNewAction("");
  }, [newAction]);

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

  return (
    <div>
      <div className="pt-2 lg:pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
          Dashboard
        </p>
        <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">
          Welcome back, {firstName}
        </h1>
        <p className="mt-3 text-[15px] text-ink-soft max-w-md">
          Here are your marketing actions for today. Ship them and keep your streak alive.
        </p>
      </div>

      {/* Payment banner */}
      <div className="mt-8 space-y-4">
        {!hasPaid && (
          <div className="flex items-start sm:items-center gap-3.5 rounded-2xl border border-signal/25 bg-signal-soft p-5">
            <span className="w-9 h-9 shrink-0 rounded-full bg-signal/15 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-signal-dark" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-bold text-ink">Activate your plan</p>
              <p className="text-[13px] text-ink-soft">
                Subscribe to unlock your full daily marketing plan.
              </p>
            </div>
            <Link
              href="/payment"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[13px] font-semibold px-4 py-2.5 hover:bg-black transition-colors"
            >
              Subscribe
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Streak</span>
            </div>
            <p className="mt-2 text-[28px] font-extrabold text-ink leading-none">{streak}</p>
            <p className="mt-1 text-[12px] text-ink-soft">days in a row</p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-moss" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Today</span>
            </div>
            <p className="mt-2 text-[28px] font-extrabold text-ink leading-none">{completedCount}/{totalActions}</p>
            <p className="mt-1 text-[12px] text-ink-soft">actions shipped</p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-signal-dark" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">This week</span>
            </div>
            <p className="mt-2 text-[28px] font-extrabold text-ink leading-none">{completedCount * 5 + 8}</p>
            <p className="mt-1 text-[12px] text-ink-soft">total actions</p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-signal-dark" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Progress</span>
            </div>
            <p className="mt-2 text-[28px] font-extrabold text-ink leading-none">{progressPct}%</p>
            <div className="mt-2 h-1.5 bg-mist rounded-full overflow-hidden">
              <div
                className="h-full bg-signal rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily actions */}
      <div className="mt-6 rounded-2xl border border-line bg-paper overflow-hidden">
        <div className="px-6 py-5 border-b border-line flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-ink">Today&apos;s Actions</h2>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              {completedCount} of {totalActions} completed
            </p>
          </div>
          <div className="h-10 w-10 rounded-full border-4 border-mist flex items-center justify-center relative">
            <span className="text-[11px] font-bold text-ink">{progressPct}%</span>
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-moss"
                strokeDasharray={`${progressPct * 1.07} 107`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="divide-y divide-line">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => toggleAction(action.id)}
              className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-cream/50 transition-colors"
            >
              <span
                className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                  action.completed
                    ? "border-moss bg-moss text-white"
                    : "border-line hover:border-ink/30"
                }`}
              >
                {action.completed && (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[14.5px] leading-relaxed ${
                    action.completed ? "text-ink-soft line-through" : "text-ink font-medium"
                  }`}
                >
                  {action.text}
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-mono uppercase tracking-wide text-ink-soft bg-mist px-2.5 py-1 rounded-full">
                {action.channel}
              </span>
            </button>
          ))}
        </div>

        {/* Add custom action */}
        <div className="px-6 py-4 border-t border-line bg-cream/30">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 shrink-0 rounded-full border-2 border-dashed border-line flex items-center justify-center">
              <Plus className="w-3 h-3 text-ink-soft" />
            </span>
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAction()}
              placeholder="Add a custom action..."
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-soft/50 focus:outline-none"
            />
            {newAction.trim() && (
              <button
                onClick={addAction}
                className="text-[13px] font-semibold text-signal-dark hover:text-signal transition-colors"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-line bg-paper p-6 md:p-7">
          <span className="w-10 h-10 rounded-xl bg-moss/15 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-moss" />
          </span>
          <h2 className="mt-4 text-[17px] font-bold tracking-tight text-ink">
            Billing &amp; payments
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            View your plan, payment history and subscription status. Cancel anytime.
          </p>
          <Link
            href="/billing"
            className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors"
          >
            Manage billing
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6 md:p-7">
          <span className="w-10 h-10 rounded-xl bg-signal-soft flex items-center justify-center">
            <Target className="w-5 h-5 text-signal-dark" />
          </span>
          <h2 className="mt-4 text-[17px] font-bold tracking-tight text-ink">
            Update your plan
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            Change your marketing hours, channels, or goals to get better daily actions.
          </p>
          <Link
            href="/onboarding"
            className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors"
          >
            Update settings
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
