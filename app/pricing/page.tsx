"use client";

import Header from "@/components/Header";
import Pricing from "@/components/Pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-12">
        <Pricing />
      </div>
    </div>
  );
}
