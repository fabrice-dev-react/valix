"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Download, Lock, ShieldCheck } from "lucide-react";
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
                The book
              </p>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h1 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.05] text-ink">
              One book. One price. $9.
            </h1>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              Become the employee your manager trusts, protects and promotes. Pay once, download
              the PDF instantly, and use it for the rest of your career.
            </p>
          </div>

          <div className="mt-14 flex justify-center">
            <PricingCard
              onUpgrade={onUpgrade}
              ctaLabel="Download the guide"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="mt-6 text-center text-[13px] font-semibold text-signal">{error}</p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-signal" /> Instant PDF download
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-moss" /> 30-day money-back guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-moss" /> Lifetime access
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-moss" /> Secure checkout
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
