"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  competitorLimit: string;
  popular?: boolean;
}

const reviewPlatforms = [
  "G2", "Capterra", "Trustpilot", "Crozdesk", 
  "GetApp", "Google Business", "Yelp", "Amazon"
];

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$59",
    period: "/month",
    description: "Perfect for small teams getting started with competitive intelligence",
    competitorLimit: "10 competitors",
    features: [
      "Track up to 10 competitors",
      "Reviews from 8+ platforms (G2, Capterra, Trustpilot, Crozdesk, GetApp, Google Business, Yelp, Amazon)",
      "AI-powered complaint clustering",
      "Daily monitoring & instant alerts",
      "Win-rate messaging recommendations",
      "PDF competitor reports",
      "Email support"
    ]
  },
  {
    name: "Growth",
    price: "$99",
    period: "/month",
    description: "For teams scaling their competitive strategy",
    competitorLimit: "100 competitors",
    features: [
      "Track up to 100 competitors",
      "All Starter features",
      "Real-time review monitoring",
      "Custom alert thresholds",
      "API access",
      "Priority support",
      "Competitor weakness predictions",
      "Feature gap roadmap"
    ],
    popular: true
  }
];

export default function Pricing() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const isLoggedIn = status === "authenticated" && session;

  const handlePayment = async (plan: "starter" | "growth") => {
    if (!isLoggedIn) {
      router.push("/signup");
      return;
    }

    setLoading(plan);
    try {
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
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
      setLoading(null);
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white" id="pricing">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mt-2">
            Know Your Competitors. Outsmart Them.
          </h2>
          <p className="text-slate-600 mt-3 max-w-lg mx-auto text-sm md:text-base">
            Choose the plan that fits your competitive intelligence needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-slate-800 mb-1">Starter</h3>
              <p className="text-blue-600 text-sm font-medium">{plans[0].competitorLimit}</p>
              <p className="text-slate-500 text-sm">{plans[0].description}</p>
            </div>
            <div className="mb-5">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-bold text-slate-800">{plans[0].price}</span>
                <span className="text-slate-500">{plans[0].period}</span>
              </div>
            </div>
            <ul className="space-y-2.5 mb-6">
              {plans[0].features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full py-2.5 text-sm"
              onClick={() => handlePayment("starter")}
              disabled={loading === "starter"}
            >
              {loading === "starter" ? "Processing..." : "Get Started"}
            </Button>
          </div>

          {/* Growth Plan */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 relative">
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Most Popular
            </div>
            <div className="mb-5">
              <h3 className="text-xl font-bold text-white mb-1">Growth</h3>
              <p className="text-blue-400 text-sm font-medium">{plans[1].competitorLimit}</p>
              <p className="text-slate-400 text-sm">{plans[1].description}</p>
            </div>
            <div className="mb-5">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-bold text-white">{plans[1].price}</span>
                <span className="text-slate-400">{plans[1].period}</span>
              </div>
            </div>
            <ul className="space-y-2.5 mb-6">
              {plans[1].features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handlePayment("growth")}
              disabled={loading === "growth"}
              className="w-full py-2.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors text-sm disabled:opacity-50"
            >
              {loading === "growth" ? "Processing..." : "Get Growth Plan"}
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Need a custom plan? <a href="#" className="text-blue-600 hover:underline font-medium">Contact us</a>
          </p>
        </div>

        {/* Platforms */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">We Monitor Reviews From</p>
            <div className="flex flex-wrap justify-center gap-2">
              {reviewPlatforms.map((platform) => (
                <span 
                  key={platform} 
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
