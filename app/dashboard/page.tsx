"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [hasBook, setHasBook] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/auth/refresh-session", { method: "POST" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.plan === "book") {
          setHasBook(true);
        }
        setIsLoading(false);
      } catch {
        router.push("/login");
      }
    }
    checkAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasBook) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 max-w-lg mx-auto text-center">
          <div className="text-6xl mb-6">📘</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">You haven&apos;t purchased the book yet</h1>
          <p className="text-slate-600 mb-6">
            Get instant access to the complete NASDAQ & S&P500 trading strategy.
          </p>
          <button
            onClick={() => router.push("/pricing")}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buy the Book — $59
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-lg">
        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-40 md:w-48 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-blue-600 to-blue-900 mb-6">
              <img
                src="/images/cover.png"
                alt="Trading Strategy Book Cover"
                className="w-full h-auto object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              9:30 Precision Playbook
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              Complete NASDAQ & S&P500 Trading System
            </p>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {["Entry Rules", "Risk Management", "1 Hour/Day", "Real Trades"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="/book/9_30_Precision_Playbook-1.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
