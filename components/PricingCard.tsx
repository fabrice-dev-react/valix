"use client";

import { BookOpen, Check, Download, Loader2 } from "lucide-react";

export const plans = [
  {
    name: "The Complete Guide",
    price: 9,
    oldPrice: 27,
    tagline:
      "The full 24-page PDF: nine practical principles, ten word-for-word scripts, a 30-day plan and a weekly checklist. Pay once, keep it forever.",
    features: [
      "24-page PDF guide",
      "10 word-for-word scripts",
      "30-day action plan",
      "Weekly 10-minute checklist",
      "Instant download after payment",
      "Lifetime access in your dashboard",
      "Works for any manager or role",
      "30-day money-back guarantee",
    ],
    highlight: true,
  },
];

export function PricingCard({
  onUpgrade,
  ctaLabel = "Download the guide",
  disabled = false,
}: {
  onUpgrade: () => void;
  ctaLabel?: string;
  disabled?: boolean;
}) {
  const plan = plans[0];
  const hasDiscount = !!plan.oldPrice && plan.oldPrice > plan.price;

  return (
    <div className="relative flex flex-col rounded-3xl border border-line bg-paper p-8 w-full max-w-3xl">
      {hasDiscount && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
          Launch offer — {Math.round((1 - plan.price / plan.oldPrice) * 100)}% off
        </span>
      )}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[24px] font-bold text-ink">{plan.name}</h3>
        <BookOpen className="w-5 h-5 text-signal" />
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{plan.tagline}</p>
      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-[46px] font-extrabold tracking-tight leading-none text-ink">
          ${plan.price}
        </span>
        <span className="text-sm text-ink-soft">one-time</span>
        {hasDiscount && (
          <span className="text-[13px] text-ink-soft/50 line-through">${plan.oldPrice}</span>
        )}
      </div>
      <p className="mt-1 text-xs text-ink-soft/80">
        Instant PDF download · secure checkout · 30-day guarantee
      </p>

      <ul className="mt-7 space-y-3 flex-1 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-moss/15 flex items-center justify-center">
              <Check className="w-3 h-3 text-moss" />
            </span>
            <span className="text-[14px] text-ink">{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onUpgrade}
        disabled={disabled}
        className={`mt-8 w-full py-3.5 rounded-full text-[14px] font-semibold transition-all duration-200 active:scale-[0.99] inline-flex items-center justify-center gap-2 bg-signal text-white hover:bg-signal-dark ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {ctaLabel}
      </button>
    </div>
  );
}
