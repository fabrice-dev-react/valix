"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PLAN_PRICE } from "@/lib/payments";
import { Check, ArrowRight, Zap } from "lucide-react";

const planFeatures = [
  "5 phone numbers",
  "Instant SMS follow-up on missed calls",
  "AI lead qualification",
  "Qualified lead list",
  "Hot lead alerts",
  "Smart follow-up",
  "Multiple locations",
  "Team member access",
];

type Phase = "checking" | "ready";

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
              One moment
            </span>
          </div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [phase, setPhase] = useState<Phase>("checking");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const startedRef = useRef(false);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh-session", { method: "POST" });
      return await res.json().catch(() => null);
    } catch {
      return null;
    }
  }, []);

  const goNext = useCallback(
    async (data?: { onboardingCompleted?: boolean; phoneStatus?: string } | null) => {
      const info = data || (await refreshSession());
      if (info?.onboardingCompleted === false || info?.onboardingCompleted === undefined) {
        router.replace("/onboarding");
      } else if (!info?.phoneStatus || info.phoneStatus === "not_connected") {
        router.replace("/phone");
      } else {
        router.replace("/dashboard");
      }
    },
    [router, refreshSession]
  );

  const startCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "monthly" }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      if (data.alreadyPaid) {
        setLoading(false);
        goNext();
        return;
      }

      if (data.sessionId && typeof window !== "undefined") {
        window.localStorage.setItem("valix_dodo_session", data.sessionId);
      }

      window.location.assign(data.checkoutUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }, [goNext]);

  useEffect(() => {
    if (startedRef.current) return;
    if (status === "loading") return;

    startedRef.current = true;

    if (session?.user?.hasPaid) {
      goNext();
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/payment/status");
        const data = await res.json();

        if (data.hasPaid) {
          goNext();
          return;
        }
      } catch {
        // fall through
      }
      setPhase("ready");
    })();
  }, [status, session, goNext]);

  if (status === "loading" || phase === "checking") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            One moment
          </span>
        </div>
      </div>
    );
  }

  const cancelled = searchParams.get("cancelled") === "1";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Valix" className="w-9 h-9 rounded-[10px]" />
            <span className="text-lg font-bold tracking-tight text-ink">Valix</span>
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">
            Recover your missed calls
          </h1>
          <p className="mt-3 text-[15px] text-ink-soft max-w-md mx-auto">
            One plan. Everything included. Cancel anytime.
          </p>
          {cancelled && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-signal-soft border border-signal/20 px-4 py-1.5 text-[13px] font-medium text-signal-dark">
              Payment was cancelled — no charge was made. Try again below.
            </p>
          )}
        </div>

        <div className="bg-ink text-white rounded-3xl overflow-hidden shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)]">
          <div className="relative px-8 py-7 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-signal text-white text-[11px] font-bold px-3 py-1">
                <Zap className="w-3 h-3" />
                Everything included
              </span>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[52px] font-extrabold tracking-tight leading-none">
                  ${PLAN_PRICE}
                </span>
                <span className="text-sm text-white/60">/month</span>
              </div>
              <p className="mt-1 text-[13px] text-white/60">
                Cancel anytime · no contracts
              </p>
            </div>
          </div>

          <div className="px-8 py-7">
            <ul className="space-y-3">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-signal/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-signal" />
                  </span>
                  <span className="text-[14px] text-white/90">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={startCheckout}
              disabled={loading}
              className="mt-8 w-full h-13 py-3.5 rounded-full bg-signal text-white text-[15px] font-semibold hover:bg-signal-dark active:scale-[0.99] transition-all shadow-[0_16px_40px_-12px_rgba(255,77,47,0.6)] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Opening checkout...
                </>
              ) : (
                <>
                  Subscribe for ${PLAN_PRICE}/month
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-signal-soft border border-signal/20 px-4 py-3">
            <p className="text-[13px] font-medium text-signal-dark">{error}</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-ink-soft/80">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure checkout by Dodo Payments
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-soft">
          Already paid?{" "}
          <button
            onClick={async () => {
              goNext();
            }}
            className="font-semibold text-ink underline decoration-signal/50 underline-offset-2 hover:decoration-signal transition-colors"
          >
            Go to your dashboard
          </button>
        </p>
      </div>
    </div>
  );
}
