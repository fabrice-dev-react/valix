"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Pricing from "@/components/Pricing";
import { useState, useEffect, useRef } from "react";

const reviewPlatforms = [
  { name: "G2", color: "bg-purple-100 text-purple-700" },
  { name: "Capterra", color: "bg-green-100 text-green-700" },
  { name: "Trustpilot", color: "bg-green-100 text-green-700" },
  { name: "Crozdesk", color: "bg-blue-100 text-blue-700" },
  { name: "GetApp", color: "bg-orange-100 text-orange-700" },
  { name: "Google Business", color: "bg-yellow-100 text-yellow-700" },
  { name: "Yelp", color: "bg-red-100 text-red-700" },
  { name: "Amazon", color: "bg-amber-100 text-amber-700" },
];

const liveAlerts = [
  { time: "2m ago", icon: "🔥", competitor: "Acme Corp", issue: "Users complaining about slow customer support", opportunity: "Highlight your 24/7 live chat" },
  { time: "18m ago", icon: "💡", competitor: "RivalSoft", issue: "Pricing too expensive for small teams", opportunity: "Target SMBs with your Starter plan" },
  { time: "41m ago", icon: "⚡", competitor: "DataPeak", issue: "Missing integrations with Slack & Notion", opportunity: "Push your 50+ native integrations" },
  { time: "1h ago", icon: "🎯", competitor: "FlowBase", issue: "Steep learning curve, poor onboarding", opportunity: "Promote your 1-day setup guarantee" },
];

const steps = [
  {
    num: "01",
    icon: "🎯",
    color: "bg-blue-50",
    title: "Add Your Competitors",
    desc: "Enter any competitor — a business name or URL. Rivalix automatically finds and tracks their reviews across all major platforms. Works for any type of business.",
  },
  {
    num: "02",
    icon: "🔍",
    color: "bg-purple-50",
    title: "AI Detects Every Complaint",
    desc: "Our AI reads thousands of reviews daily, clusters recurring complaints by theme, and scores them by severity. Real intelligence — not raw data dumps.",
  },
  {
    num: "03",
    icon: "🔔",
    color: "bg-amber-50",
    title: "Get Notified of Opportunities",
    desc: "The moment a new complaint spike is detected, you get an alert with the exact opportunity it creates — and what messaging to use to win those customers.",
  },
  {
    num: "04",
    icon: "🚀",
    color: "bg-green-50",
    title: "Win Their Customers",
    desc: "Use competitor weaknesses to position your business. Get specific messaging, ad copy, and feature recommendations grounded in real market demand.",
  },
];

const features = [
  { icon: "🧠", title: "AI Complaint Clustering", desc: "Groups thousands of reviews into meaningful themes — pricing, support, performance, missing features. No noise, only signal.", tag: "Core AI" },
  { icon: "🔔", title: "Daily Monitoring & Alerts", desc: "We scan competitor reviews every single day. The moment complaint volume spikes, you get an instant notification with the opportunity it creates.", tag: "Always On" },
  { icon: "📢", title: "Win-Rate Messaging Generator", desc: "Turn competitor weaknesses into ad copy, headlines, and sales talking points. Know exactly what to say to steal their unhappy customers.", tag: "Marketing Edge" },
  { icon: "📊", title: "Weakness Severity Scoring", desc: "Rank each weakness by frequency and frustration level — so you focus where it matters most and act at the perfect moment.", tag: "Prioritization" },
  { icon: "📋", title: "Competitor Reports", desc: "Export polished PDF reports comparing multiple competitors side by side. Perfect for sales decks, board meetings, and investor updates.", tag: "Reporting" },
  { icon: "🎯", title: "Feature Gap Roadmap", desc: "Based on what customers consistently wish your competitors had, Rivalix recommends exactly which features to build next.", tag: "Product Strategy" },
];

const faqs = [
  { q: "Does this work for my type of business?", a: "Yes. Rivalix works for any business with competitors that have online reviews — SaaS, e-commerce, restaurants, local services, agencies, and more. If your competitors have reviews anywhere online, we analyze them." },
  { q: "How does the daily monitoring work?", a: "Every day our system crawls all monitored review platforms for your competitors. When we detect a new complaint pattern or a spike in a specific issue, we send you a notification with the opportunity summary and recommended action." },
  { q: "What review platforms do you cover?", a: "We monitor Google Business, G2, Capterra, Trustpilot, Crozdesk, GetApp, Yelp, Amazon, and more. We're continuously adding new platforms based on user demand." },
  { q: "How fast do I get results?", a: "Most users see their first competitor insights within 3 minutes of adding a competitor. Daily monitoring begins immediately after setup." },
  { q: "Is this ethical?", a: "Absolutely. We only analyze publicly available reviews that customers have chosen to make public. This is the same research any business could do manually — we just do it 1,000x faster and smarter." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no lock-in. Cancel any time from your account settings. We're confident you'll stay because you'll see results." },
];

// Hook: scroll reveal
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealDiv({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ${delay}ms ease, transform 0.65s ${delay}ms ease`,
      }}
    >
      {children}
    </div>
  );
}

// Animated live alert ticker
function AlertTicker() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % liveAlerts.length);
        setAnimating(false);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const alert = liveAlerts[current];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 max-w-2xl mx-auto mt-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
        <span className="text-xs font-semibold text-green-600 uppercase tracking-widest">Live opportunity detected</span>
        <span className="ml-auto text-xs text-slate-400">{alert.time}</span>
      </div>
      <div
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(6px)" : "translateY(0)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        <p className="text-sm text-slate-700 font-medium">
          {alert.icon} <span className="text-slate-900 font-bold">{alert.competitor}</span>: {alert.issue}
        </p>
        <p className="text-sm text-blue-700 font-semibold mt-1">→ {alert.opportunity}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCTA = () => router.push(isLoggedIn ? "/dashboard" : "/signup");

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .gradient-text { background: linear-gradient(135deg, #2563eb, #1e40af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .dot-grid { background-image: radial-gradient(circle at 1px 1px, rgb(180,190,200) 1px, transparent 0); background-size: 28px 28px; }
        .card-hover { transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
        .card-hover:hover { border-color: #93c5fd; box-shadow: 0 12px 40px rgba(37,99,235,0.1); transform: translateY(-3px); }
        .faq-body { overflow: hidden; transition: max-height 0.4s ease, opacity 0.3s ease; }
        .btn-glow { box-shadow: 0 6px 24px rgba(37,99,235,0.35); transition: box-shadow 0.2s, transform 0.2s, opacity 0.2s; }
        .btn-glow:hover { box-shadow: 0 10px 36px rgba(37,99,235,0.45); transform: translateY(-2px); }
        .step-num { font-size: 5rem; font-weight: 800; color: #f1f5f9; line-height: 1; position: absolute; top: -16px; right: 24px; user-select: none; }
        .compare-row:hover td { background: #eff6ff; }
      `}</style>

      <Header />

      {/* ── HERO ── */}
      <section className="pt-20 md:pt-32 pb-14 md:pb-24 px-4 md:px-6 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-50" />
        <div className="absolute top-0 left-1/4 w-72 md:w-[420px] h-72 md:h-[420px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-tl from-blue-600/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full mb-7 md:mb-9">
            <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wide">AI-Powered Competitive Intelligence</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.07] mb-5 md:mb-7">
            <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent block">
              Turn Your Competitors' Weakness Into Your 
            </span>
            <span className="gradient-text block">Greatest Strength</span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Find what customers hate about your competitors and turn their weakness into your winning advantage.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleCTA}
              className="btn-glow px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold text-sm md:text-base"
            >
              Start Winning Customers →
            </button>
            <a href="#how" className="px-8 py-3.5 rounded-full border border-slate-300 text-slate-700 font-semibold text-sm md:text-base hover:border-blue-400 hover:text-blue-600 transition-colors">
              See How It Works
            </a>
          </div>

          {/* Live alert ticker */}
          <AlertTicker />

          {/* Platforms */}
          <div className="mt-10">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-3">We monitor reviews from</p>
            <div className="flex flex-wrap justify-center gap-2">
              {reviewPlatforms.map((p) => (
                <span key={p.name} className={`px-3 py-1 rounded-full text-xs font-semibold border border-transparent ${p.color}`}>
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section id="why" className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <RevealDiv>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">The Problem</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-12 max-w-2xl">
              Every day you don't know competitors' weaknesses,{" "}
              <em className="not-italic text-blue-400">you're leaving money on the table.</em>
            </h2>
          </RevealDiv>

          <div className="grid md:grid-cols-3 gap-px">
            {[
              { icon: "😤", title: "You're guessing instead of knowing", desc: "Thousands of your competitors' frustrated customers are publicly begging for what you offer — and you're not listening." },
              { icon: "💸", title: "Your ad spend targets the wrong pain", desc: "Generic messaging means lower conversion. Lower conversion means wasted budget — on every campaign you run." },
              { icon: "🏃", title: "Competitor churns go elsewhere", desc: "Customers leaving a competitor are the hottest leads in your market. They're ready to switch. But they have to find you first." },
            ].map((card, i) => (
              <RevealDiv key={i} delay={i * 100} className="bg-white/3 border border-white/7 p-8 hover:bg-white/6 transition-colors">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-white font-bold mb-3 text-base">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
              </RevealDiv>
            ))}
          </div>

          <RevealDiv className="mt-12 p-10 rounded-2xl bg-gradient-to-br from-blue-600/15 to-blue-900/10 border border-blue-500/20 text-center">
            <p className="text-4xl md:text-6xl font-extrabold text-blue-400">73%</p>
            <p className="text-white/60 mt-3 max-w-xl mx-auto text-sm md:text-base">
              of customers who leave a competitor say they would have switched to an alternative if they'd known it solved their specific complaint. You could be that alternative.
            </p>
            <div className="mt-6">
              <a href="#how" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-sm">
                See How It Works →
              </a>
            </div>
          </RevealDiv>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <RevealDiv className="mb-12">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              From competitor complaint to closed deal — in 4 steps
            </h2>
            <p className="text-slate-500 text-base max-w-lg">Works for SaaS, e-commerce, restaurants, agencies, local businesses — any industry with online reviews.</p>
          </RevealDiv>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, i) => (
              <RevealDiv key={i} delay={i * 90} className={`relative ${step.color} rounded-2xl p-8 border border-slate-200 card-hover overflow-hidden`}>
                <span className="step-num">{step.num}</span>
                <div className="text-3xl mb-5">{step.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── DAILY MONITORING FEATURE ── */}
      <section id="monitoring" className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto">
          <RevealDiv className="text-center mb-14">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">Always Watching</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              We monitor competitor complaints every day.{" "}
              <span className="gradient-text">You get notified of every opportunity.</span>
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              You don't need to check anything manually. Rivalix runs 24/7 and pushes you an alert the moment a competitor's weakness creates an opening for you.
            </p>
          </RevealDiv>

          {/* Notification mockup */}
          <RevealDiv className="max-w-2xl mx-auto space-y-3">
            {liveAlerts.map((alert, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-start gap-4 card-hover"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{alert.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Opportunity detected</p>
                    <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{alert.time}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mb-1">
                    <span className="text-slate-900 font-bold">{alert.competitor}</span>: {alert.issue}
                  </p>
                  <p className="text-sm text-blue-700 font-semibold">→ {alert.opportunity}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <p className="text-xs text-slate-400 font-medium">
                🔔 Delivered via <span className="text-slate-600 font-semibold">email, Slack, or in-app</span> — your choice
              </p>
            </div>
          </RevealDiv>

          {/* Mini stats row */}
          <RevealDiv className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: "24/7", label: "Continuous monitoring" },
              { num: "8+", label: "Platforms tracked" },
              { num: "<1h", label: "Alert delivery time" },
              { num: "Any", label: "Industry or business" },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 text-center card-hover">
                <p className="text-3xl font-extrabold text-blue-600">{s.num}</p>
                <p className="text-slate-500 text-xs mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </RevealDiv>

          <div className="text-center mt-10">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">
              View Pricing Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <RevealDiv className="mb-12">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">Built to turn intelligence into revenue</h2>
            <p className="text-slate-500 text-base max-w-md">Not just data. A complete competitive advantage system.</p>
          </RevealDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <RevealDiv key={i} delay={i * 70} className="border border-slate-200 rounded-2xl p-7 card-hover bg-white">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{f.desc}</p>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{f.tag}</span>
              </RevealDiv>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
              Start Free Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <RevealDiv className="mb-10">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">Comparison</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Why businesses choose Rivalix
            </h2>
          </RevealDiv>
          <RevealDiv>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Capability</th>
                    <th className="px-6 py-4 text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-slate-100 text-center">Rivalix</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-center">Manual Research</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-center">Generic Analytics</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Monitors 8+ review platforms", "✓", "✗", "Partial"],
                    ["AI-powered complaint detection", "✓", "✗", "✗"],
                    ["Daily automated monitoring", "✓", "✗", "✗"],
                    ["Instant opportunity alerts", "✓", "✗", "✗"],
                    ["Actionable messaging recommendations", "✓", "✗", "✗"],
                    ["Google Business Reviews", "✓", "Manual", "✗"],
                    ["Works for any business type", "✓", "✓", "✗"],
                    ["Time to first insight", "3 min", "Weeks", "Days"],
                  ].map(([cap, rivalix, manual, generic], i) => (
                    <tr key={i} className="compare-row border-t border-slate-100">
                      <td className="px-6 py-4 text-sm text-slate-700">{cap}</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600 text-base">{rivalix}</td>
                      <td className="px-6 py-4 text-center text-slate-400 text-sm">{manual}</td>
                      <td className="px-6 py-4 text-center text-slate-400 text-sm">{generic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RevealDiv>
          <div className="text-center mt-8">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
              View Pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <RevealDiv className="text-center mb-12">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">What Businesses Say</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              Businesses that know their competitors win more deals
            </h2>
          </RevealDiv>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { stars: 5, text: "We discovered our main competitor's users constantly complained about slow onboarding. We made '1-day setup' our headline. Trial-to-paid conversion went up 34% in one month.", name: "Marcus K.", role: "Founder, B2B SaaS", initials: "MK", bg: "from-blue-600 to-blue-800" },
              { stars: 5, text: "I run a restaurant group. Rivalix pulled Yelp and Google reviews for all three competitors and showed me exactly what diners hated. I fixed those things. Now I'm the top-rated spot.", name: "Sofia R.", role: "Restaurant Owner", initials: "SR", bg: "from-purple-600 to-purple-800" },
              { stars: 5, text: "The messaging generator alone is worth 10x the price. The daily alerts caught a competitor's support meltdown before we did. We ran targeted ads that week. Our CTR doubled.", name: "James L.", role: "Head of Marketing, E-commerce", initials: "JL", bg: "from-emerald-600 to-emerald-800" },
            ].map((t, i) => (
              <RevealDiv key={i} delay={i * 100} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition-colors">
                <div className="text-amber-400 mb-4 tracking-widest text-sm">{"★".repeat(t.stars)}</div>
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.bg} flex items-center justify-center text-white font-bold text-sm`}>{t.initials}</div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors">
              Start Winning Today →
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <RevealDiv className="mb-10">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900">Common questions</h2>
          </RevealDiv>
          <RevealDiv className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
                  <span className={`text-blue-600 text-lg flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                <div
                  className="faq-body"
                  style={{ maxHeight: openFaq === i ? "200px" : "0px", opacity: openFaq === i ? 1 : 0 }}
                >
                  <p className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </RevealDiv>
        </div>
      </section>

      {/* ── PRICING ── */}
      <Pricing />

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/60 to-indigo-100/40 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <RevealDiv>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
              Your competitors' customers are{" "}
              <span className="gradient-text">ready to switch.</span>
              <br />Will they find you?
            </h2>
            <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Every frustrated review left about a competitor is a customer raising their hand. Rivalix makes sure you're the first to answer — every single day.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-5">
              <button onClick={handleCTA} className="btn-glow px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold text-base">
                Start Winning Customers Today →
              </button>
              <a href="#how" className="px-8 py-4 rounded-full border border-slate-300 text-slate-700 font-semibold text-base hover:border-blue-400 hover:text-blue-600 transition-colors">
                See How It Works
              </a>
            </div>
            <p className="text-slate-400 text-xs">
              <span className="text-green-500 font-semibold">✓</span> Free to start &nbsp;·&nbsp;
              <span className="text-green-500 font-semibold">✓</span> No credit card required &nbsp;·&nbsp;
              <span className="text-green-500 font-semibold">✓</span> First insight in 3 minutes
            </p>
          </RevealDiv>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white/50 py-14 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
            <div className="col-span-2 md:col-span-1">
              <span className="text-xl font-extrabold text-white block mb-3">Rivalix</span>
              <p className="text-sm leading-relaxed max-w-xs">
                AI-powered competitive intelligence for every type of business. Know your competitors' weaknesses — every day.
              </p>
            </div>
            <div>
              <h4 className="text-white/80 text-xs font-bold uppercase tracking-widest mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="#how" className="text-sm hover:text-blue-400 transition-colors">How It Works</a></li>
                <li><a href="#monitoring" className="text-sm hover:text-blue-400 transition-colors">Daily Monitoring</a></li>
                <li><Link href="/pricing" className="text-sm hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white/80 text-xs font-bold uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#why" className="text-sm hover:text-blue-400 transition-colors">Why Rivalix</a></li>
                <li><a href="mailto:niyomutabazifabrice100@gmail.com?subject=Feedback%20for%20Rivalix" className="text-sm hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white/80 text-xs font-bold uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#how" className="text-sm hover:text-blue-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs">© 2026 Rivalix. All rights reserved.</p>
            <a
              href="mailto:niyomutabazifabrice100@gmail.com?subject=Feedback%20for%20Rivalix&body=Hi%20Rivalix%20team%2C%0A%0AI%20have%20some%20feedback%20about%20your%20platform..."
              className="text-white/30 hover:text-blue-400 transition-colors"
              title="Contact us via Email"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}