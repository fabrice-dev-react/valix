"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function Stars({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className={`${className} text-signal`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-signal-dark font-semibold">
      {children}
    </p>
  );
}

const checkIcon = (
  <svg className="w-3.5 h-3.5 text-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const steps = [
  {
    number: "01",
    title: "Paste the URL",
    desc: "Any page works — your site, a client's, a landing page. Valix crawls it in seconds, no sign-up hoops beyond your account.",
  },
  {
    number: "02",
    title: "It gets what you sell",
    desc: "Valix figures out your offer, your customers and the pain point that sells them — no briefs, no explaining, no guessing.",
  },
  {
    number: "03",
    title: "Ten ads, ten angles",
    desc: "Beautiful, ready-to-publish Facebook & Instagram ads, each with a different angle — correct sizes, clear copy, your voice.",
  },
  {
    number: "04",
    title: "Pick the winner",
    desc: "Launch straight to Ads Manager or hand the brief to your team. You choose which ad earns the test budget.",
  },
];

const features = [
  {
    title: "The brief writes itself",
    desc: "Valix reads your whole site — not just the title tag. It finds the offer, the tone, the proof, and the pages that actually sell. You get a brief your team can use, instead of a blank document.",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Hooks people don't swipe past",
    desc: "Headline options that don't sound like every other ad in the feed. Pattern-matched from 800 creatives that actually drove sales.",
    span: "",
  },
  {
    title: "Right size, right length",
    desc: "Correct dimensions and copy length for Facebook and Instagram. No more 'oops, this was made for the wrong format'.",
    span: "",
  },
  {
    title: "Ten variations, never one",
    desc: "Every run ships ten angles — different hooks, different proof, different CTAs. Because you can't A/B test a single idea.",
    span: "",
  },
  {
    title: "Your voice, not 'AI voice'",
    desc: "Valix lifts phrasing from your own copy so the ads read like your brand wrote them. It doesn't bolt on the generic AI tone.",
    span: "",
  },
  {
    title: "Export to where you work",
    desc: "One click copies the brief, downloads the creatives, or pushes the specs into Ads Manager. Your team never re-types anything.",
    span: "",
  },
];

const plans = [
  {
    name: "Pro",
    tagline: "Everything Valix does, in one plan",
    price: 39,
    cta: "Pay $39 and start generating",
    features: [
      "Unlimited ad generations",
      "Ten ad variations per run",
      "Facebook + Instagram sizes",
      "Static image ads, ready to publish",
      "Copy in your brand's voice",
      "Export as images & copy",
    ],
  },
];

const testimonials = [
  {
    quote:
      "I used to spend three days briefing a designer for every test. Now I paste a URL and have eight variations before my coffee gets cold. Our ROAS went from 1.6x to 3.1x in two months — the control-losses finally beat the old hero ads.",
    name: "Sarah Chen",
    role: "DTC Brand Manager, Halcyon",
    featured: true,
  },
  {
    quote: "We run 14 client accounts. This cut creative turnaround from days to minutes, which is the whole job.",
    name: "Marcus Williams",
    role: "Owner, Brightline Studio",
  },
  {
    quote: "The hook options alone are worth it. Our CTR doubled the week we switched from hand-written ads.",
    name: "Jessica Park",
    role: "Founder, Northbound",
  },
  {
    quote: "It kept our voice. That was the thing I was most worried about and the thing it got most right.",
    name: "Diego Alvarez",
    role: "Growth Lead, Kite & Co",
  },
];

const faqs = [
  {
    q: "How does Valix actually read my website?",
    a: "You give it a URL and it crawls the public pages — homepage, product pages, testimonials, about. It pulls the offer, pricing signals, tone of voice and proof points into a brief. It doesn't store your site's content; it only uses it to generate your ads.",
  },
  {
    q: "Do I need design or copywriting skills?",
    a: "No. Valix writes the copy and lays out the creative at the correct sizes. That said, everything is editable before export. Most people tweak two or three words per headline and call it done.",
  },
  {
    q: "Which platforms and formats do you support?",
    a: "Static image ads for Facebook and Instagram — feed and Stories. No motion, no editing, just ads you can make in seconds and run anywhere. Each format gets its own dimensions and copy-length rules, because what works in a story is not what works in the feed.",
  },
  {
    q: "What's different from other AI ad tools?",
    a: "Most tools generate from a text prompt and return generic copy. Valix generates from your actual site, keeps your phrasing, and returns ten tested angles per run rather than one. It's built for people who run ads every week, not for one-off experiments.",
  },
  {
    q: "Can I try it before paying?",
    a: "Valix is a one-time purchase — you pay $39 once to unlock it. There's no free trial and no monthly fee, so you never lose access because of a subscription expiring.",
  },
  {
    q: "What kind of results should I expect?",
    a: "Most teams cut creative production time from days to minutes, and the ten-variation output makes testing far cheaper. CTR improvements depend on your offer and market — but the ads are only ever as good as the offer behind them.",
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


export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
  const [showcaseImages, setShowcaseImages] = useState<string[]>([]);
  const [heroUrl, setHeroUrl] = useState("");

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setShowcaseImages(data.images);
        }
      })
      .catch(() => {});
  }, []);

  const handleCTA = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    let trimmed = heroUrl.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    if (isLoggedIn) {
      router.push(`/analyzing?url=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="bg-cream text-ink overflow-x-clip">
      {/* ============ HERO ============ */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[680px] max-w-full rounded-full bg-signal/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                <Eyebrow>Paste a URL. Get ads.</Eyebrow>
              </div>

              <h1 className="mt-7 text-[36px] sm:text-5xl md:text-[56px] lg:text-[62px] font-extrabold tracking-[-0.03em] leading-[1.08] text-ink">
                Generate{" "}
                <span className="relative inline-block whitespace-nowrap align-baseline">
                  <span className="relative z-10 text-signal">viral &amp; converting</span>
                  <span className="absolute left-0 bottom-[0.06em] right-0 h-[0.16em] bg-signal/20 rounded-sm z-0" />
                </span>
                <br />
                static ads from a website URL.
              </h1>

              <p className="mt-7 text-base sm:text-lg leading-relaxed text-ink-soft max-w-2xl mx-auto">
                Paste any URL. Valix understands what you offer, who you&apos;re
                selling to and the pain point that sells them — then turns it
                into 10 beautiful static Facebook &amp; Instagram ads, each a different
                angle, ready to publish. Trained on 800 ads that worked. You
                just pick the winner.
              </p>

              <form
                onSubmit={handleGenerate}
                className="mt-9 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 rounded-2xl sm:rounded-full border border-line bg-paper p-1.5 sm:p-2 shadow-[0_8px_24px_-16px_rgba(22,19,17,0.25)] transition-colors duration-200 focus-within:border-signal/50 w-full"
              >
                <div className="flex items-center flex-1 gap-2.5 px-3 sm:px-4 w-full">
                  <svg
                    className="w-4 h-4 text-ink-soft shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <input
                    type="text"
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={heroUrl}
                    onChange={(e) => setHeroUrl(e.target.value)}
                    placeholder="yourwebsite.com"
                    className="w-full bg-transparent py-3 text-[15px] font-medium text-ink outline-none placeholder:text-ink-soft/60"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-[14px] font-semibold hover:bg-black transition-all duration-200"
                >
                  Generate ads
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </button>
              </form>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2.5">
                  <Stars />
                  <p className="text-[13px] text-ink-soft">
                    <span className="font-semibold text-ink">4.9</span> from 2,400+ marketers
                  </p>
                </div>
                <div className="hidden sm:block h-4 w-px bg-line" />
                <p className="text-[13px] text-ink-soft">
                  Trained on 800 ads that actually worked
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ADS SHOWCASE GRID ============ */}
      {showcaseImages.length > 0 && (
        <section className="border-y border-line bg-paper py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>See ads that Valix generated</Eyebrow>
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink max-w-xl">
              Real ads, generated by Valix
            </h2>
            <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-lg">
              Static Facebook &amp; Instagram ads Valix generated from real
              website URLs — different angles, your voice, ready to publish.
            </p>

            <div className="mt-12 columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-5">
              {showcaseImages.map((image) => (
                <div
                  key={image}
                  className="mb-4 sm:mb-5 break-inside-avoid rounded-2xl bg-cream border border-line overflow-hidden p-2.5"
                >
                  <img
                    src={image}
                    alt="Valix generated creative"
                    loading="lazy"
                    className="block w-full h-auto rounded-lg bg-mist"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ SOCIAL PROOF MARQUEE ============ */}
      <section className="border-y border-line bg-paper/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft mb-6">
            Ad teams at these brands ship with Valix
          </p>
          <div className="relative overflow-hidden">
            <div className="flex gap-14 w-max animate-marquee">
              {[
                "Halcyon",
                "Brightline Studio",
                "Northbound",
                "Kite & Co",
                "NOVA Labs",
                "Ferris Goods",
                "Solstice",
                "Onyx Supply",
              ].concat([
                "Halcyon",
                "Brightline Studio",
                "Northbound",
                "Kite & Co",
                "NOVA Labs",
                "Ferris Goods",
                "Solstice",
                "Onyx Supply",
              ]).map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="text-lg font-bold tracking-tight text-ink/30 hover:text-ink/60 transition-colors whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent" />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-signal" />
                  <Eyebrow>How it works</Eyebrow>
                </div>
                <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
                  From URL to launch in about two minutes
                </h2>
                <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft max-w-md">
                  No onboarding call. No template library to dig through. The
                  whole flow is four steps, and most of it runs itself.
                </p>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-paper px-4 py-2">
                  <span className="font-mono text-xs text-ink-soft">avg. time</span>
                  <span className="font-mono text-sm font-bold text-ink">01:47</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-0">
                {steps.map((step, i) => (
                  <div key={step.number} className="relative flex gap-6 pb-10 last:pb-0">
                    {i < steps.length - 1 && (
                      <span className="absolute left-[27px] top-12 bottom-0 w-px bg-line" />
                    )}
                    <div className="w-14 h-14 shrink-0 rounded-full border border-line bg-paper flex items-center justify-center font-mono text-sm font-bold text-ink">
                      {step.number}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-bold tracking-tight text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES (BENTO) ============ */}
      <section id="features" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Features</Eyebrow>
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              Built for people who run ads every single week
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`relative bg-cream border border-line rounded-2xl p-6 md:p-8 transition-all duration-200 hover:border-ink/20 hover:shadow-[0_24px_48px_-24px_rgba(22,19,17,0.2)] ${
                  feature.span || ""
                }`}
              >
                <span className="font-mono text-[11px] text-ink-soft/70">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {i === 0 && (
                  <div className="mt-6 bg-paper border border-line rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                        Generated brief
                      </p>
                      <span className="text-[10px] font-semibold text-moss bg-moss/10 px-2 py-0.5 rounded-full">
                        from valix.app
                      </span>
                    </div>
                    {[
                      ["Offer", "AI ad generator for FB & IG"],
                      ["Tone", "confident, direct, plainspoken"],
                      ["Proof", "5,000+ campaigns analyzed"],
                      ["CTA", "Start free, no card required"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline gap-3 py-1.5 border-b border-line/60 last:border-0">
                        <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                          {k}
                        </span>
                        <span className="text-[13px] font-medium text-ink truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {i === 1 && (
                  <div className="mt-6 space-y-2">
                    {[
                      "Stop outsourcing your ads to generic AI.",
                      "Hooks that match how your best customer talks.",
                      "We found the 10 ads your audience actually clicks.",
                    ].map((h, j) => (
                      <div key={j} className="rounded-lg border border-line bg-paper px-3 py-2 text-[13px] font-medium text-ink">
                        {h}
                      </div>
                    ))}
                  </div>
                )}

                {i === 2 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {[
                      ["FB Feed", "4:5"],
                      ["IG Feed", "4:5"],
                      ["Stories", "9:16"],
                      ["Square", "1:1"],
                    ].map(([label, ratio]) => (
                      <div key={label} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2">
                        <span className="text-[12px] font-semibold text-ink">{label}</span>
                        <span className="font-mono text-[10px] text-ink-soft">{ratio}</span>
                      </div>
                    ))}
                  </div>
                )}

                {i === 3 && (
                  <div className="mt-6 space-y-2">
                    {["Angle A", "Angle B", "Angle C", "Angle D"].map((a, j) => (
                      <div key={a} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${j === 2 ? "bg-signal text-white" : "bg-mist text-ink-soft"}`}>
                          {a.replace("Angle ", "")}
                        </span>
                        <div className="h-1.5 flex-1 rounded-full bg-mist">
                          <div className={`h-full rounded-full ${j === 2 ? "bg-signal w-4/5" : "bg-ink/20 w-2/5"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {i === 4 && (
                  <div className="mt-6 space-y-1.5">
                    <div className="rounded-lg bg-signal-soft border border-signal/20 px-3 py-2 text-[12px] font-medium text-ink">
                      We&apos;re not a template. We do the thinking for you.
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft px-1 pt-1">
                      ← copied from your site, untouched
                    </p>
                  </div>
                )}

                {i === 5 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {["Export brief", "Download creatives", "Ads Manager spec"].map((b) => (
                      <span key={b} className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[12px] font-semibold px-3.5 py-2">
                        {b}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </span>
                    ))}
                  </div>
                )}

                <h3 className={`text-lg font-bold tracking-tight text-ink ${i === 0 ? "mt-6" : "mt-6"}`}>
                  {feature.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <Eyebrow>Pricing</Eyebrow>
              <span className="h-px w-8 bg-signal" />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              One plan. One price. No surprises.
            </h2>
            <p className="mt-5 text-[15px] sm:text-base text-ink-soft max-w-md mx-auto">
              Pay $39 once and unlock everything Valix does — no monthly
              subscription, no seat fees, no usage caps.
            </p>
          </div>

          <div className="mt-12 max-w-md mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-2xl bg-ink text-white p-8 shadow-[0_32px_64px_-24px_rgba(22,19,17,0.5)]"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                  Most popular
                </span>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                  {plan.name}
                </p>
                <p className="mt-1 text-sm text-white/70">{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-[52px] font-extrabold tracking-tight leading-none">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-white/60">one-time</span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  No subscription · lifetime access
                </p>

                <ul className="mt-7 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-signal/20 flex items-center justify-center">
                        {checkIcon}
                      </span>
                      <span className="text-[14px] text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleCTA}
                  className="mt-8 w-full py-3 rounded-full bg-signal text-white text-[14px] font-semibold transition-all duration-200 hover:bg-signal-dark"
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-[13px] text-ink-soft">
            Secure checkout by Dodo Payments. Cancel anytime, no questions asked.
          </p>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="py-20 md:py-28 bg-paper border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-signal" />
                <Eyebrow>Word on the street</Eyebrow>
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink max-w-lg">
                What happens when the briefs stop piling up
              </h2>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <Stars className="w-4 h-4" />
              <p className="text-sm font-semibold text-ink">4.9 / 5</p>
              <p className="text-sm text-ink-soft">· 2,400+ reviews</p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={`bg-cream border border-line rounded-2xl p-7 md:p-8 flex flex-col justify-between ${
                  t.featured ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <Stars />
                  <p className={`mt-4 leading-relaxed text-ink ${t.featured ? "text-lg md:text-xl" : "text-[15px]"} font-medium`}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white ${
                      t.featured ? "bg-signal" : "bg-ink"
                    }`}
                  >
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                    <p className="text-[13px] text-ink-soft">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-signal" />
                  <Eyebrow>FAQ</Eyebrow>
                </div>
                <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
                  Questions people actually ask
                </h2>
                <p className="mt-5 text-[15px] text-ink-soft max-w-sm">
                  Something else on your mind?{" "}
                  <a href="mailto:hello@valix.com" className="font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors">
                    Email us
                  </a>{" "}
                  — a human replies within a day.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-paper border border-line rounded-2xl px-6">
                {faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="pb-20 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative overflow-hidden bg-ink rounded-3xl px-6 py-16 md:py-24 text-center">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-signal/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <Eyebrow>{"\u2014>"} No card. No call. No catch.</Eyebrow>
            <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white">
              Your next winning ad is one URL away
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/60 leading-relaxed max-w-lg mx-auto">
              Paste a link, get ten ads, run the test. If the ads don&apos;t beat
              your control in 30 days, the free trial cost you nothing.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCTA}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-signal text-white text-[15px] font-semibold hover:bg-signal-dark transition-all duration-200 shadow-[0_16px_40px_-12px_rgba(255,77,47,0.6)]"
              >
                Generate your first ads
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="mt-4 text-[13px] text-white/40">
              $39 one-time · no subscription · lifetime access
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
