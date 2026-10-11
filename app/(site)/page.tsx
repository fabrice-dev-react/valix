"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLogin } from "@/components/LoginContext";
import ShowcaseVideoCard, {
  ShowcaseVideoLightbox,
  showcaseVideos,
  type ShowcaseVideo,
} from "@/components/ShowcaseVideo";
import {
  ArrowRight,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-signal-dark font-semibold">
      {children}
    </p>
  );
}

function PrimaryCTA({
  onClick,
  label = "Get my first video in 24h",
  className = "",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-3 px-5 pr-2.5 py-2 rounded-full bg-signal text-white text-[16px] font-bold hover:bg-signal-dark transition-all duration-300 shadow-[0_20px_50px_-12px_rgba(255,77,47,0.55)] ${className}`}
    >
      <span className="relative z-10">{label}</span>
      <span className="w-9 h-9 shrink-0 rounded-full bg-white flex items-center justify-center">
        <ArrowRight className="w-4.5 h-4.5 text-signal transition-transform duration-300 group-hover:translate-x-0.5 -rotate-45" />
      </span>
    </button>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
const faqs = [
  {
    q: "What do I get for $97?",
    a: "Twelve finished videos a month — product explainers, founder-led shorts, feature walkthroughs and case study cuts. Every one ships with captions, a thumbnail and post copy, in 16:9 and 9:16. No tiers, no add-ons.",
  },
  {
    q: "How is the first video ready in 24 hours?",
    a: "Send us a link to your product and two or three videos whose style you like. That's enough to cut the first one. It lands within 24 hours of payment — usually a lot sooner.",
  },
  {
    q: "What if I don't like it?",
    a: "You reply with one word and we refund the full $97 the same day. No questions, no call, no attempt to talk you out of it. You keep the video and can use it either way.",
  },
  {
    q: "Do I need to film anything?",
    a: "No. With no footage we build from your product, screen recordings and motion graphics. If you record talking-head clips on your phone, we'll cut those up too.",
  },
  {
    q: "Who owns the videos?",
    a: "You do — permanently, including paid-ad rights. Run them as ads, on your site, anywhere. No exclusivity on our side and no extra fee.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-ink pr-4">{q}</span>
        <span
          className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-full border transition-all duration-200 ${
            open ? "bg-ink border-ink text-white rotate-45" : "border-line text-ink-soft"
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[15px] leading-relaxed text-ink-soft">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
  const { openLogin } = useLogin();
  const [active, setActive] = useState<ShowcaseVideo | null>(null);

  const handleCTA = useCallback(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      openLogin();
    }
  }, [isLoggedIn, router, openLogin]);

  return (
    <div className="bg-cream text-ink overflow-x-clip">
      {/* ============ HERO ============ */}
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[560px] w-[820px] max-w-full rounded-full bg-signal/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-4 py-1.5 shadow-sm">
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center ring-1 ring-signal/15">
                <Sparkles className="w-3 h-3 text-signal-dark" />
              </span>
              <Eyebrow>Video editing studio for SaaS founders</Eyebrow>
            </div>

            <h1 className="mt-7 text-[40px] sm:text-5xl md:text-[58px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.04] text-ink max-w-4xl mx-auto">
              Get 12 SaaS Videos A Month For Just $97.{" "}
              <span className="text-signal">100% Risk-Free.</span>
            </h1>

            <p className="mt-6 text-[17px] sm:text-lg leading-relaxed text-ink-soft max-w-2xl mx-auto">
              We edit high-converting videos for SaaS founders. Send us your assets, pay $97, and
              your first edit lands tomorrow. If you love it, we keep going. If you hate it, get
              100% of your money back the same day — no questions asked.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <PrimaryCTA onClick={handleCTA} />
            </div>

            <div className="mt-7 flex items-center justify-center gap-5 flex-wrap text-[13px] text-ink-soft">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-moss" /> First video in 24h
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-moss" /> 12 videos included
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-moss" /> Instant refund, no questions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ OUR WORK ============ */}
      <section id="work" className="py-20 md:py-28 scroll-mt-20 border-t border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Our work</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              This is what $97 a month looks like.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              Every video below was cut by us. Hover to preview, click to play it in full.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {showcaseVideos.map((video) => (
              <ShowcaseVideoCard key={video.src} video={video} onOpen={setActive} />
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <PrimaryCTA onClick={handleCTA} label="Edit my videos — $97/mo" />
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-20 md:py-28 bg-paper border-y border-line scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Pricing</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              One plan. Twelve videos. Ninety-seven dollars.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-xl mx-auto">
              No tiers, no seat minimums, no setup fee. You pay once a month and your content
              calendar fills itself.
            </p>
          </div>

          <div className="mt-14 mx-auto max-w-2xl">
            <div className="relative rounded-3xl bg-ink text-white p-8 sm:p-10 shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)] overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">The Full Month</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/20 border border-signal/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-signal">
                    <ShieldCheck className="w-3 h-3" /> Risk-free
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60 max-w-md">
                  12 finished videos, delivered weekly. Everything below is included — there is
                  nothing else to buy.
                </p>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-[54px] font-extrabold tracking-tight leading-none text-white">
                    $97
                  </span>
                  <span className="text-sm text-white/50">/month</span>
                </div>
                <p className="mt-2 text-xs text-white/45">
                  $1,164 a year · first video within 24 hours · cancel or refund any time
                </p>

                <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3.5">
                  {[
                    "12 edited videos per month",
                    "3 ad-ready hook variants each",
                    "16:9 master + 9:16 vertical cut",
                    "Captions, thumbnails & post copy",
                    "Unlimited revisions for 7 days",
                    "You own everything, forever",
                    "Delivery within 24 hours to start",
                    "Full refund if it’s not for you",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-signal/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-signal" />
                      </span>
                      <span className="text-[14px] text-white/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-col items-center gap-4">
                  <PrimaryCTA onClick={handleCTA} className="w-full sm:w-auto" />
                  <p className="flex items-center gap-1.5 text-[12px] text-white/45">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6ee7a0]" />
                    If you don&apos;t love the first video, we refund the full $97 the same day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-20 md:py-28 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>FAQ</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Questions founders ask first
            </h2>
          </div>
          <div className="bg-paper border border-line rounded-2xl px-6">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="pb-20 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative overflow-hidden bg-ink rounded-3xl px-6 py-16 md:py-20 text-center">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute -top-24 -right-24 w-96 h-96 bg-signal/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] text-white">
              Your first video is 24 hours and $97 away.
            </h2>
            <p className="mt-4 text-base text-white/60 leading-relaxed max-w-md mx-auto">
              Send us your product, pay, and watch the edit land tomorrow. If it isn&apos;t what you
              expected, you&apos;re refunded instantly and you keep the video.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <PrimaryCTA onClick={handleCTA} />
            </div>
            <div className="mt-6 flex items-center justify-center gap-5 flex-wrap text-[12px] text-white/50">
              <p className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#6ee7a0]" /> First video in 24h
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#6ee7a0]" /> Full refund, no questions
              </p>
              <p className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#6ee7a0]" /> Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <ShowcaseVideoLightbox
        key={active?.src ?? "closed"}
        video={active}
        onClose={() => setActive(null)}
        onCta={() => {
          setActive(null);
          handleCTA();
        }}
      />
    </div>
  );
}