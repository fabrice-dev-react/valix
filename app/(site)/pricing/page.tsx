"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Clock, ShieldCheck } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { useLogin } from "@/components/LoginContext";

export default function PricingPage() {
  const router = useRouter();
  const { status } = useSession();
  const { openLogin } = useLogin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onUpgrade = async () => {
    if (status !== "authenticated") {
      openLogin();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));

      if (data.alreadyPaid) {
        router.push("/dashboard");
        return;
      }

      if (!res.ok || !data.checkout_url) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      window.location.href = data.checkout_url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream text-ink min-h-dvh">
      <section className="pt-32 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-signal-dark font-semibold">
                Pricing
              </p>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              One plan. Twelve videos. $97.
            </h1>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              Pay and your first fully edited video lands in 24 hours. Love it and we deliver 12 a
              month. Don&apos;t like it and we refund every cent the same day — no questions asked.
            </p>
          </div>

          <div className="mt-14 flex justify-center">
            <PricingCard
              onUpgrade={onUpgrade}
              ctaLabel="Get my first video in 24h — $97/mo"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="mt-6 text-center text-[13px] font-semibold text-signal">{error}</p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-signal" /> First video in 24 hours
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-moss" /> Full refund, no questions asked
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-moss" /> You own every file
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}