"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rawPlan = searchParams.get("plan");
  const plan = (rawPlan === "starter" || rawPlan === "growth") ? rawPlan : null;
  const success = !!rawPlan;

  useEffect(() => {
    async function processPayment() {
      if (!success || !plan) {
        setProcessing(false);
        setError("Payment was not completed.");
        return;
      }

      try {
        const response = await fetch("/api/payment/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, success: true }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to process payment");
          setProcessing(false);
          return;
        }

        setProcessing(false);

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch {
        setError("An error occurred while processing your payment");
        setProcessing(false);
      }
    }

    processPayment();
  }, [success, plan, router]);

  if (processing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Processing Payment...</h1>
          <p className="text-slate-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Failed</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/pricing")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
        <p className="text-slate-600 mb-2">
          You now have <span className="font-semibold text-blue-600">{plan === "growth" ? "Growth" : "Starter"}</span> plan access.
        </p>
        <p className="text-slate-500 text-sm">Redirecting...</p>
      </div>
    </div>
  );
}

export default function PaymentProcessing() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentProcessingContent />
    </Suspense>
  );
}
