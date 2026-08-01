"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

type BillingInfo = {
  plan: string;
  paymentDate: string | null;
  email: string | null;
};

const planFeatures = [
  "Unlimited chart analyses",
  "Forex, indices, crypto, gold & stocks",
  "Buy/sell with entry, stop & take profit",
  "Confidence score on every signal",
  "Market reasoning behind each call",
];

export default function BillingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=1");
    }
  }, [status, router]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/payment/status");
        const data = await res.json();
        if (data && typeof data.plan === "string") {
          setBilling({
            plan: data.plan,
            paymentDate: typeof data.paymentDate === "string" ? data.paymentDate : null,
            email: typeof data.email === "string" ? data.email : null,
          });
        }
      } catch {
        setBilling(null);
      }
    })();
  }, []);

  const startCheckout = useCallback(async () => {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      if (data.alreadyPaid) {
        await fetch("/api/auth/refresh-session", { method: "POST" });
        router.replace("/billing");
        return;
      }

      window.location.assign(data.checkoutUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setCheckingOut(false);
    }
  }, [router]);

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

  const hasPaid = session?.user?.hasPaid ?? false;
  const paymentDate = billing?.paymentDate
    ? new Date(billing.paymentDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  let renewLabel: string | null = null;
  if (hasPaid && billing?.paymentDate) {
    const start = new Date(billing.paymentDate);
    const next = new Date(start);
    next.setMonth(next.getMonth() + 1);
    const days = Math.ceil((next.getTime() - Date.now()) / 86400000);
    renewLabel =
      days <= 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="pt-2 lg:pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
          Account
        </p>
        <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">
          Billing
        </h1>
        <p className="mt-3 text-[15px] text-ink-soft max-w-md">
          Manage your Valix Pro subscription.
        </p>
      </div>

      <div className="mt-10 bg-paper border border-line rounded-3xl overflow-hidden">
        {/* Plan */}
        <div className="px-6 sm:px-8 py-7">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                Current plan
              </p>
              <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] text-ink">
                Valix Pro
              </h2>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                Price
              </p>
              <p className="mt-2 text-[26px] font-extrabold tracking-[-0.02em] text-ink">
                $39
                <span className="text-[14px] font-medium text-ink-soft">/month</span>
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${hasPaid ? "bg-[#34b36b]" : "bg-ink-soft/50"}`}
            />
            <span className="text-[13px] font-medium text-ink">
              {hasPaid ? "Active" : "Not subscribed"}
            </span>
          </div>
        </div>

        <div className="border-t border-line" />

        {/* Account */}
        {billing?.email && (
          <div className="px-6 sm:px-8 py-5 flex items-center gap-3.5">
            <span className="w-9 h-9 shrink-0 rounded-lg bg-ink text-white flex items-center justify-center text-[13px] font-bold">
              {billing.email.trim().charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-ink truncate">{billing.email}</p>
              <p className="text-[12.5px] text-ink-soft">
                {hasPaid && paymentDate
                  ? `Subscribed since ${paymentDate}`
                  : "No active subscription"}
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-line" />

        {/* Body */}
        <div className="px-6 sm:px-8 py-6">
          {hasPaid ? (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-line bg-cream/60 px-4 py-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                    Next billing
                  </p>
                  <p className="mt-1 text-[16px] font-bold text-ink capitalize">
                    {renewLabel || "Monthly"}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-cream/60 px-4 py-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                    Monthly price
                  </p>
                  <p className="mt-1 text-[16px] font-bold text-ink">$39.00</p>
                </div>
              </div>

              <p className="mt-5 text-[14px] leading-relaxed text-ink-soft max-w-md">
                Your plan renews automatically. You have unlimited access to chart analysis — no
                limits, no surprises.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full bg-ink text-white text-[13.5px] font-semibold hover:bg-black active:scale-[0.98] transition-all text-center"
                >
                  Analyze a chart
                </Link>
              </div>
            </>
          ) : (
            <>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {planFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <svg
                      className="mt-[5px] w-3.5 h-3.5 text-signal-dark shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[13.5px] text-ink-soft">{feature}</span>
                  </li>
                ))}
              </ul>

              {error && (
                <div className="mt-6 rounded-xl bg-signal-soft border border-signal/20 px-4 py-3">
                  <p className="text-[13px] font-medium text-signal-dark">{error}</p>
                </div>
              )}

              <button
                onClick={startCheckout}
                disabled={checkingOut}
                className="mt-8 w-full h-12 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-black active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Opening checkout…
                  </>
                ) : (
                  <>
                    Subscribe for $39/month
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[12px] text-ink-soft/80">
                Secure checkout by Dodo Payments
              </p>
            </>
          )}
        </div>
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-ink-soft/80 max-w-xl">
        Payments are handled by Dodo Payments. Billing is monthly and you can cancel anytime,
        no contracts. Your Pro access activates instantly once a payment is confirmed.
      </p>
    </div>
  );
}
