"use client";

import { Check, Loader2, Zap } from "lucide-react";

export const plans = [
  {
    name: "Everything included",
    price: 19,
    oldPrice: 0,
    annualTotal: 228,
    tagline: "Everything you need to build and grow your AI side hustle — no add-ons, no tiers.",
    features: [
      "Unlimited AI business guidance",
      "Market validation & research",
      "Offer & pricing design",
      "Content planning engine",
      "Daily action task lists",
      "Revenue & growth tracking",
      "All business phases included",
      "Priority email support",
    ],
    highlight: true,
  },
];

export function PricingCard({
  onUpgrade,
  ctaLabel = "Start my side hustle — $19/mo",
  disabled = false,
}: {
  onUpgrade: () => void;
  ctaLabel?: string;
  disabled?: boolean;
}) {
  const plan = plans[0];
  const hasDiscount = plan.highlight && !!plan.oldPrice && plan.oldPrice > plan.price;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 w-full max-w-3xl ${
        plan.highlight
          ? "bg-ink text-white border-ink shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)]"
          : "bg-paper border-line"
      }`}
    >
      {hasDiscount && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
          Limited offer — {Math.round((1 - plan.price / plan.oldPrice) * 100)}% off
        </span>
      )}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-ink"}`}>
          {plan.name}
        </h3>
        {plan.highlight && <Zap className="w-4 h-4 text-signal" />}
      </div>
      <p className={`mt-2 text-[13px] leading-relaxed ${plan.highlight ? "text-white/60" : "text-ink-soft"}`}>
        {plan.tagline}
      </p>
      <div className="mt-5 flex items-baseline gap-3">
        <span className={`text-[46px] font-extrabold tracking-tight leading-none ${plan.highlight ? "text-white" : "text-ink"}`}>
          ${plan.price}
        </span>
        <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-ink-soft"}`}>/month</span>
        {hasDiscount && (
          <span className={`text-[13px] line-through ${plan.highlight ? "text-white/30" : "text-ink-soft/50"}`}>
            ${plan.oldPrice}/mo
          </span>
        )}
      </div>
      <p className={`mt-1 text-xs ${plan.highlight ? "text-white/50" : "text-ink-soft/80"}`}>
        Billed annually at ${plan.annualTotal}/year · cancel anytime
      </p>

      <ul className="mt-7 space-y-3 flex-1 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className={`mt-0.5 w-4 h-4 shrink-0 rounded-full flex items-center justify-center ${
              plan.highlight ? "bg-signal/20" : "bg-moss/15"
            }`}>
              <Check className={`w-3 h-3 ${plan.highlight ? "text-signal" : "text-moss"}`} />
            </span>
            <span className={`text-[14px] ${plan.highlight ? "text-white/90" : "text-ink"}`}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onUpgrade}
        disabled={disabled}
        className={`mt-8 w-full py-3.5 rounded-full text-[14px] font-semibold transition-all duration-200 active:scale-[0.99] inline-flex items-center justify-center gap-2 ${
          plan.highlight
            ? "bg-signal text-white hover:bg-signal-dark"
            : "bg-ink text-white hover:bg-black"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {disabled && <Loader2 className="w-4 h-4 animate-spin" />}
        {ctaLabel}
      </button>
    </div>
  );
}