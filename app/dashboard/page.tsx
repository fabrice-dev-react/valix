"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Download,
  FileText,
  Info,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";

function MiniBookCover() {
  return (
    <div className="relative w-[180px] sm:w-[220px] shrink-0 overflow-hidden rounded-[14px] ring-1 ring-ink/10">
      <Image
        src="/images/book-cover.jpg"
        alt="30 Days to Becoming Your Manager's Favorite Employee book cover"
        width={1275}
        height={1650}
        className="h-auto w-full"
      />
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = session?.user?.name || "";
  const firstName = displayName.split(" ")[0] || "";

  const loadAccess = useCallback(async (showSpinner = true) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res = await fetch("/api/intake", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setHasPaid(data?.hasPaid === true);
      } else if (res.status !== 401) {
        setError(data?.error || "We couldn't check your access. Please refresh.");
      }
    } catch {
      setError("We couldn't check your access. Please refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAccess();
  }, [loadAccess]);

  const startCheckout = async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.alreadyPaid) {
        setHasPaid(true);
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
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-cream">
      {/* ============ TOP BAR ============ */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-xl border-b border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Valix"
              className="w-8 h-8 rounded-[9px] group-hover:scale-105 transition-transform"
            />
            <span className="text-[17px] font-bold tracking-tight text-ink">Valix</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-full p-1 pr-2 hover:bg-mist/70 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff9a7a] to-[#ff4d2f] text-white flex items-center justify-center text-[13px] font-bold">
                {(displayName?.[0] || session?.user?.email?.[0] || "V").toUpperCase()}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-ink-soft transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-40 w-64 rounded-2xl border border-line bg-paper shadow-xl overflow-hidden animate-[slideIn_0.2s_ease]">
                  <div className="px-4 py-3.5 border-b border-line">
                    <p className="text-[13.5px] font-bold text-ink truncate">
                      {displayName || "Your account"}
                    </p>
                    <p className="text-[11.5px] text-ink-soft truncate mt-0.5">
                      {session?.user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-signal hover:bg-signal-soft/50 transition-colors border-t border-line"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============ MAIN ============ */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 pb-24">
        {loading ? (
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded-xl skeleton-bar" />
            <div className="h-56 rounded-3xl border border-line bg-paper skeleton-bar" />
          </div>
        ) : hasPaid ? (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-moss/25 bg-[#edf7ef] px-3.5 py-1.5">
              <Check className="w-3.5 h-3.5 text-moss" strokeWidth={3} />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-moss font-bold">
                You own the guide
              </span>
            </div>

            <h1 className="mt-5 text-[28px] sm:text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] text-ink">
              {firstName ? `It's yours, ${firstName}.` : "It's yours."}
            </h1>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
              Download your PDF below, then start with chapter 10 — the ten scripts. That is the
              fastest way to feel the difference.
            </p>

            <div className="mt-8 rounded-3xl border border-line bg-paper p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-7 sm:items-center">
                <MiniBookCover />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal-dark font-bold">
                    Your purchase
                  </p>
                  <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.02em] leading-tight text-ink">
                    Guide to Becoming Your Manager&apos;s Favorite Employee
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-signal" /> 24-page PDF
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-moss" /> ~90 min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-moss" /> Lifetime access
                    </span>
                  </div>

                  <a
                    href="/api/book/download"
                    className="group mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-3 px-5 pr-2.5 py-2 rounded-full bg-signal text-white text-[15px] font-bold hover:bg-signal-dark transition-all duration-300 shadow-[0_20px_50px_-12px_rgba(255,77,47,0.55)]"
                  >
                    <span>Download your PDF</span>
                    <span className="w-9 h-9 shrink-0 rounded-full bg-white flex items-center justify-center">
                      <Download className="w-4 h-4 text-signal transition-transform duration-300 group-hover:translate-y-0.5" />
                    </span>
                  </a>
                  <p className="mt-3 text-[11.5px] text-ink-soft">
                    Can&apos;t download? Check your browser settings or reply to your receipt.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-signal" />
                <h3 className="text-[15px] font-bold text-ink">What to do next</h3>
              </div>
              <ol className="mt-5 space-y-4">
                {[
                  {
                    title: "Read chapter 10 first",
                    body: "Use one of the ten scripts this week. The four-line update is the easiest win.",
                  },
                  {
                    title: "Run the 30-day plan",
                    body: "One principle per week. Do not try all nine at once — consistency beats intensity.",
                  },
                  {
                    title: "Check in every Friday",
                    body: "The 10-minute checklist keeps your reputation compounding, even on hard weeks.",
                  },
                ].map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3.5">
                    <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-ink text-white flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{step.title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-moss/20 bg-[#edf7ef] p-5">
              <ShieldCheck className="w-5 h-5 shrink-0 text-moss mt-0.5" />
              <p className="text-[13px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">30-day guarantee.</span> If the guide is
                not useful, reply to your receipt and we will refund your $9. You keep the PDF.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5">
              <BookOpen className="w-3.5 h-3.5 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft font-bold">
                One guide · $9 · instant download
              </span>
            </div>

            <h1 className="mt-5 text-[28px] sm:text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] text-ink">
              Unlock your copy of the guide.
            </h1>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
              You are one click away. Pay $9 once and the PDF appears here immediately — yours to
              keep, with a 30-day money-back guarantee.
            </p>

            {error && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-signal/30 bg-signal-soft px-4 py-3 text-[13.5px] font-semibold text-signal-dark">
                <Info className="w-4 h-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="shrink-0 text-signal-dark/60 hover:text-signal-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="mt-8 rounded-3xl border border-line bg-paper p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-7 sm:items-center">
                <MiniBookCover />
                <div className="flex-1 min-w-0">
                  <h2 className="text-[20px] font-extrabold tracking-[-0.02em] leading-tight text-ink">
                    Guide to Becoming Your Manager&apos;s Favorite Employee
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                    Nine practical principles, ten word-for-word scripts, a 30-day plan and a
                    weekly checklist.
                  </p>

                  <div className="mt-4 flex items-baseline gap-2.5">
                    <span className="text-[36px] font-extrabold tracking-tight leading-none text-ink">
                      $9
                    </span>
                    <span className="text-[13px] text-ink-soft">one-time</span>
                    <span className="text-[13px] text-ink-soft/50 line-through">$27</span>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {["Instant PDF download", "Lifetime access", "30-day refund guarantee"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[13px] text-ink">
                        <Check className="w-3.5 h-3.5 text-moss" strokeWidth={3} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={startCheckout}
                    disabled={checkoutLoading}
                    className="group mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-3 px-5 pr-2.5 py-2 rounded-full bg-signal text-white text-[15px] font-bold hover:bg-signal-dark transition-all duration-300 disabled:opacity-60 disabled:cursor-wait shadow-[0_20px_50px_-12px_rgba(255,77,47,0.55)]"
                  >
                    <span>{checkoutLoading ? "Opening checkout…" : "Get the guide — $9"}</span>
                    <span className="w-9 h-9 shrink-0 rounded-full bg-white flex items-center justify-center">
                      {checkoutLoading ? (
                        <Loader2 className="w-4 h-4 text-signal animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-signal" />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 text-[12.5px] text-ink-soft">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-signal fill-current" /> Loved by ambitious employees
              </span>
              <span className="text-line">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-moss" /> Secure checkout
              </span>
            </div>

            <button
              onClick={() => loadAccess()}
              disabled={refreshing}
              className="mx-auto mt-6 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-ink-soft hover:text-ink transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Already paid? Refresh access
            </button>

            <Link
              href="/#inside"
              className="mx-auto mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-signal hover:text-signal-dark transition-colors"
            >
              See what&apos;s inside
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
