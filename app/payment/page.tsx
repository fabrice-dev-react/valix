"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const features = [
  "Unlimited ad generations",
  "Ten ad variations per run",
  "Static Facebook + Instagram ads, ready to publish",
  "Copy in your brand's voice",
  "Export as images & copy",
];

type Phase = "checking" | "redirecting" | "ready" | "error";

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
  const startedRef = useRef(false);

  const refreshSession = useCallback(async () => {
    try {
      await fetch("/api/auth/refresh-session", { method: "POST" });
    } catch {
      // best-effort; the session fetch below may already be fresh enough
    }
  }, []);

  const goToDashboard = useCallback(() => {
    router.replace("/dashboard");
  }, [router]);

  const startCheckout = useCallback(async () => {
    setPhase("redirecting");
    setError(null);
    try {
      const res = await fetch("/api/payment/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      if (data.alreadyPaid) {
        await refreshSession();
        goToDashboard();
        return;
      }

      if (data.sessionId && typeof window !== "undefined") {
        window.localStorage.setItem("valix_dodo_session", data.sessionId);
      }

      window.location.assign(data.checkoutUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPhase("ready");
    }
  }, [refreshSession, goToDashboard]);

  useEffect(() => {
    if (startedRef.current) return;
    if (status === "loading") return;

    startedRef.current = true;

    if (session?.user?.hasPaid) {
      goToDashboard();
      return;
    }

    const cancelled = searchParams.get("cancelled") === "1";

    (async () => {
      try {
        const res = await fetch("/api/payment/status");
        const data = await res.json();

        if (data.hasPaid) {
          await refreshSession();
          goToDashboard();
          return;
        }

        const localSession =
          typeof window !== "undefined"
            ? window.localStorage.getItem("valix_dodo_session")
            : null;

        if (localSession) {
          try {
            const vres = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: localSession }),
            });
            const vdata = await vres.json();
            if (vdata.paid) {
              await refreshSession();
              goToDashboard();
              return;
            }
          } catch {
            // ignore; fall through to a fresh checkout
          }
        }

        if (!cancelled) {
          await startCheckout();
        } else {
          setPhase("ready");
        }
      } catch {
        setPhase("ready");
      }
    })();
  }, [status, session, searchParams, goToDashboard, refreshSession, startCheckout]);

  if (status === "loading" || phase === "checking" || phase === "redirecting") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
              {phase === "redirecting" ? "Opening secure checkout" : "One moment"}
            </span>
          </div>
          {phase === "redirecting" && (
            <p className="text-[13px] text-ink-soft/70">
              Taking you to the payment page…
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Valix" className="w-9 h-9 rounded-[10px]" />
            <span className="text-lg font-bold tracking-tight text-ink">Valix</span>
          </Link>
        </div>

        <div className="bg-paper border border-line rounded-3xl overflow-hidden shadow-[0_32px_64px_-24px_rgba(22,19,17,0.2)]">
          <div className="bg-ink px-6 py-5 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <p className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
              Valix Pro · monthly
            </p>
            <div className="relative mt-2 flex items-baseline gap-1.5">
              <span className="text-[44px] font-extrabold tracking-tight leading-none">$39</span>
              <span className="text-sm text-white/60">/month</span>
            </div>
            <p className="relative mt-1 text-[13px] text-white/60">
              Billed monthly. Cancel anytime, no questions asked.
            </p>
          </div>

          <div className="px-6 py-6">
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-signal-soft flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-signal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-[14px] text-ink-soft">{feature}</span>
                </li>
              ))}
            </ul>

            {error && (
              <div className="mt-5 rounded-xl bg-signal-soft border border-signal/20 px-4 py-3">
                <p className="text-[13px] font-medium text-signal-dark">{error}</p>
              </div>
            )}

            <button
              onClick={startCheckout}
              className="mt-7 w-full h-12 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-black active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Subscribe for $39/month and unlock Valix
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-[12px] text-ink-soft/80">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout by Dodo Payments
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-soft">
          Already paid?{" "}
          <button
            onClick={async () => {
              await refreshSession();
              goToDashboard();
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
