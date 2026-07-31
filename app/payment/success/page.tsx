"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "checking" | "waiting" | "paid" | "failed";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

type VerifyRef = { paymentId?: string; sessionId?: string };

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState<string | null>(null);
  const startedRef = useRef(false);
  const verifyRef = useRef<VerifyRef | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      await fetch("/api/auth/refresh-session", { method: "POST" });
    } catch {
      // best-effort
    }
  }, []);

  const goToDashboard = useCallback(() => {
    setStatus("paid");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  }, []);

  const verifyNow = useCallback(async () => {
    const res = await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verifyRef.current),
    });
    const data = await res.json().catch(() => ({}));

    if (res.status === 400) {
      setMessage("No payment reference found. Return to the payment page to try again.");
      setStatus("failed");
      return "failed" as const;
    }
    if (res.status === 403) {
      setMessage(data.error || "This payment does not belong to your account.");
      setStatus("failed");
      return "failed" as const;
    }
    if (!res.ok) {
      throw new Error(data.error || "Unable to confirm your payment.");
    }
    return data.paid ? ("paid" as const) : ("pending" as const);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const urlPayment =
      searchParams.get("payment_id") || searchParams.get("paymentId") || null;
    const urlSession =
      searchParams.get("session_id") ||
      searchParams.get("checkout_session_id") ||
      searchParams.get("sessionId") ||
      null;
    const localSession =
      typeof window !== "undefined"
        ? window.localStorage.getItem("valix_dodo_session")
        : null;

    const sessionId = urlSession || localSession;

    if (urlPayment) {
      verifyRef.current = { paymentId: urlPayment, ...(sessionId ? { sessionId } : {}) };
    } else if (sessionId) {
      verifyRef.current = { sessionId };
    } else {
      verifyRef.current = {};
    }

    (async () => {
      try {
        const result = await verifyNow();
        if (result === "paid") {
          await refreshSession();
          goToDashboard();
          return;
        }
        if (result === "failed") return;
      } catch {
        // fall through to polling
      }

      setStatus("waiting");
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts += 1;
        try {
          const result = await verifyNow();
          if (result === "paid") {
            clearInterval(poll);
            await refreshSession();
            goToDashboard();
          } else if (result === "failed") {
            clearInterval(poll);
          } else if (attempts >= 10) {
            clearInterval(poll);
            setMessage(
              "We're still confirming your payment. It may take a minute — your access will activate automatically."
            );
            setStatus("failed");
          }
        } catch {
          if (attempts >= 10) {
            clearInterval(poll);
            setMessage(
              "We couldn't reach the payment service. Try again in a moment."
            );
            setStatus("failed");
          }
        }
      }, 4000);
    })();
  }, [searchParams, verifyNow, refreshSession, goToDashboard]);

  if (status === "checking" || status === "waiting") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
              {status === "waiting" ? "Confirming your payment" : "One moment"}
            </span>
          </div>
          <p className="text-[13px] text-ink-soft/70">
            Checking with Dodo Payments…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-sm text-center">
        {status === "paid" ? (
          <div className="bg-paper border border-line rounded-3xl px-8 py-10 shadow-[0_32px_64px_-24px_rgba(22,19,17,0.2)]">
            <span className="w-14 h-14 mx-auto rounded-full bg-moss/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-ink">
              Payment confirmed
            </h1>
            <p className="mt-2 text-[14px] text-ink-soft">
              Welcome to Valix Pro. Taking you to your dashboard…
            </p>
          </div>
        ) : (
          <div className="bg-paper border border-line rounded-3xl px-8 py-10 shadow-[0_32px_64px_-24px_rgba(22,19,17,0.2)]">
            <span className="w-14 h-14 mx-auto rounded-full bg-signal-soft flex items-center justify-center">
              <svg className="w-7 h-7 text-signal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </span>
            <h1 className="mt-5 text-xl font-extrabold tracking-[-0.03em] text-ink">
              Payment not confirmed yet
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              {message || "We couldn't verify your payment."}
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full h-11 rounded-full bg-ink text-white text-[14px] font-semibold hover:bg-black transition-colors"
              >
                Try again
              </button>
              <Link
                href="/"
                className="text-[13px] text-ink-soft hover:text-ink transition-colors"
              >
                Back to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
