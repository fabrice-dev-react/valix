"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

const POLL_INTERVAL = 2500;
const POLL_ATTEMPTS = 12;

function ProcessingCard({
  state,
  errorMessage,
}: {
  state: "checking" | "processing" | "success" | "error";
  errorMessage: string;
}) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-paper p-8 sm:p-10 text-center shadow-[0_32px_64px_-24px_rgba(22,19,17,0.18)]">
      <div className="flex justify-center">
        <img src="/logo.png" alt="valix" className="w-12 h-12 rounded-[12px] object-cover" />
      </div>

      {state === "success" && (
        <>
          <span className="mt-6 inline-flex w-14 h-14 items-center justify-center rounded-full bg-moss/15">
            <Check className="w-7 h-7 text-moss" strokeWidth={3} />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-ink">Payment confirmed</h1>
          <p className="mt-2 text-[14px] text-ink-soft">
            Your side-hustle blueprint is unlocked. Taking you to your dashboard…
          </p>
        </>
      )}

      {state === "error" && (
        <>
          <span className="mt-6 inline-flex w-14 h-14 items-center justify-center rounded-full bg-signal/10">
            <X className="w-7 h-7 text-signal" strokeWidth={3} />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-ink">
            Payment not confirmed
          </h1>
          <p className="mt-2 text-[14px] text-ink-soft">{errorMessage}</p>
          <div className="mt-7 flex flex-col gap-2.5">
            <Link
              href="/pricing"
              className="w-full py-3 rounded-full bg-signal text-white text-[14px] font-semibold hover:bg-signal-dark transition-colors"
            >
              Back to pricing
            </Link>
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-full border border-line text-ink text-[14px] font-semibold hover:bg-mist transition-colors"
            >
              Go to dashboard
            </Link>
          </div>
        </>
      )}

      {(state === "checking" || state === "processing") && (
        <>
          <span className="mt-6 inline-flex w-14 h-14 items-center justify-center rounded-full bg-signal/10">
            <Loader2 className="w-7 h-7 text-signal animate-spin" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-ink">
            {state === "checking" ? "Almost there…" : "Verifying your payment…"}
          </h1>
          <p className="mt-2 text-[14px] text-ink-soft">
            {state === "checking"
              ? "Hang tight for a moment."
              : "Please wait, this only takes a few seconds."}
          </p>
        </>
      )}
    </div>
  );
}

function PaymentProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<"checking" | "processing" | "success" | "error">("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const paymentId = searchParams.get("payment_id") || "";
    const status = searchParams.get("status") || "";

    if (!paymentId) {
      if (status === "cancelled" || status === "failed") {
        const timer = setTimeout(() => {
          setState("error");
          setErrorMessage("Your payment didn't go through. You can try again or contact support.");
        }, 0);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => router.replace("/dashboard"), 2000);
      return () => clearTimeout(timer);
    }

    let attempts = 0;
    let cancelled = false;

    const verify = async () => {
      if (cancelled) return;

      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_id: paymentId }),
        });
        const data = await res.json().catch(() => ({}));

        if (data.verified) {
          setState("success");
          setTimeout(() => router.replace("/dashboard"), 1200);
          return;
        }

        if (res.status === 401) {
          setState("error");
          setErrorMessage("Please log in again, then come back to confirm your payment.");
          return;
        }

        if (res.status === 403 || res.status === 404) {
          setState("error");
          setErrorMessage(data?.error || "We couldn't confirm your payment.");
          return;
        }

        const pStatus = data?.status;
        if (pStatus === "failed" || pStatus === "cancelled") {
          setState("error");
          setErrorMessage("Your payment didn't go through. You can try again or contact support.");
          return;
        }
      } catch {
        // retry below
      }

      attempts += 1;
      if (attempts < POLL_ATTEMPTS) {
        setState("processing");
        setTimeout(verify, POLL_INTERVAL);
      } else {
        setState("error");
        setErrorMessage(
          "We couldn't confirm your payment just yet. It may still be processing — check your email or contact support."
        );
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div
      className="min-h-dvh flex items-center justify-center p-6"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage:
          "linear-gradient(rgba(60,50,40,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(60,50,40,0.045) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }}
    >
      <ProcessingCard state={state} errorMessage={errorMessage} />
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-dvh flex items-center justify-center p-6"
          style={{ backgroundColor: "#faf8f5" }}
        >
          <ProcessingCard state="checking" errorMessage="" />
        </div>
      }
    >
      <PaymentProcessingContent />
    </Suspense>
  );
}