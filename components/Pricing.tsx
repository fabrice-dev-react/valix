"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function Pricing() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isLoggedIn = status === "authenticated" && session;

  const handlePayment = async () => {
    if (!isLoggedIn) {
      router.push("/signup");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "book" }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Failed to create payment link. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white" id="pricing">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mt-2">
            One Price. Full Access. Lifetime Updates.
          </h2>
          <p className="text-slate-600 mt-3 max-w-lg mx-auto text-sm md:text-base">
            Get the complete NASDAQ & S&P500 trading strategy book — a one-time purchase, not a subscription.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-10 relative">
            <div className="text-center mb-6">
              <p className="text-blue-400 text-sm font-medium uppercase tracking-wider mb-2">PDF Book</p>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl md:text-6xl font-bold text-white">$59</span>
              </div>
              <p className="text-slate-400 text-sm">One-time payment</p>
            </div>

            <ul className="space-y-3 mb-8 max-w-sm mx-auto">
              {[
                "Complete 6-chapter trading strategy",
                "50+ annotated real trade examples",
                "Entry and exit rules for NASDAQ & S&P500",
                "Risk management framework",
                "Trading psychology system",
                "Lifetime updates & revisions",
                "30-day money-back guarantee",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full max-w-xs mx-auto py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors text-base disabled:opacity-50"
              >
                {loading ? "Processing..." : "Buy the Book →"}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-slate-400 text-xs flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay with card
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                30-day guarantee
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
