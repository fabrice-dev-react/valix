"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;

  const handleCTA = () => {
    if (isLoggedIn) {
      router.push("/pricing");
    } else {
      router.push("/login?callbackUrl=/pricing");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col p-6">
      <style>{`
        .btn-glow { box-shadow: 0 6px 24px rgba(37,99,235,0.35); transition: box-shadow 0.2s, transform 0.2s; }
        .btn-glow:hover { box-shadow: 0 10px 36px rgba(37,99,235,0.45); transform: translateY(-2px); }
      `}</style>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* LEFT — Copy */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-6 shadow-lg shadow-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-xs font-bold text-white tracking-wide">80% WIN RATE STRATEGY</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-5">
              This might finally be the year{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                you become profitable.
              </span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-4 max-w-lg">
              If you're tired of losing money on NASDAQ and S&P500, this book gives you 
              the exact system to flip your results. Entry rules. Risk management. Only 1 hour of trading time per day. No fluff. Just what works.
            </p>


            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8 max-w-md mx-auto md:mx-0">
              {[
                "85% win rate on confirmed setups",
                "Only 1 hour per day required",
                "Works on NASDAQ & S&P500",
                "Clear entry & exit rules",
                "1:3 risk-reward on every trade",
                "Works almost every day",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 text-sm justify-center md:justify-start">
              <div className="flex -space-x-2">
                {["DM", "SK", "JR"].map((initials, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${["bg-blue-600", "bg-purple-600", "bg-emerald-600"][i]}`}>
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-slate-400">
                <span className="text-slate-700 font-semibold">3,200+</span> traders already using it
              </span>
            </div>

            {/* Lifestyle section */}
            <div className="mt-8 max-w-md mx-auto md:mx-0">
              <div className="bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-600 leading-relaxed">
                  If you're not yet profitable — or you run a business or work a job and don't want to spend all day in front of charts — this system is built for you.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Just <span className="text-blue-600 font-semibold">1 hour per day</span> from your phone or laptop, anywhere in the world. 
                  Passive income. Freedom from the 9–5. More time with family. The ability to travel and live life on your own terms.
                </p>
                <p className="text-sm text-slate-500 mt-3 italic">
                  That's what this system gave me. It can do the same for you.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Book Card */}
          <div className="flex-shrink-0 w-full max-w-sm">
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-200 overflow-hidden">
              {/* Book cover */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-0 flex items-center justify-center min-h-[320px] md:min-h-[360px]">
                <img
                  src="/images/cover.png"
                  alt="Trading Strategy Book Cover"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Price & CTA */}
              <div className="p-6 md:p-8">
                <div className="flex items-baseline justify-center gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">$59</span>
                  <span className="text-slate-400">one-time</span>
                </div>

                <button
                  onClick={handleCTA}
                  className="btn-glow w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold text-base flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Get the System →
                </button>

                <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-3">
                  <span>🔒 Secure checkout</span>
                  <span>🛡️ 30-day guarantee</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
