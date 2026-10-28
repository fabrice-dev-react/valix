"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLogin } from "@/components/LoginContext";
import { Check, Download, ShieldCheck, Sparkles, Star } from "lucide-react";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-signal-dark font-semibold">
      {children}
    </p>
  );
}

function DownloadButton({
  onClick,
  loading = false,
  className = "",
}: {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-signal text-white text-[13.5px] font-bold hover:bg-signal-dark transition-all duration-300 shadow-[0_16px_36px_-14px_rgba(255,77,47,0.6)] disabled:opacity-70 disabled:cursor-wait ${className}`}
    >
      <Download className="w-3.5 h-3.5 shrink-0" />
      {loading ? "Opening checkout…" : "Download PDF $9"}
    </button>
  );
}

function BookCover() {
  return (
    <div className="relative w-[290px] sm:w-[370px] lg:w-[405px] overflow-hidden rounded-[16px] ring-1 ring-ink/10">
      <Image
        src="/images/book-cover.jpg"
        alt="30 Days to Becoming Your Manager's Favorite Employee book cover"
        width={1275}
        height={1650}
        priority
        className="h-auto w-full"
      />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const { openLogin } = useLogin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async () => {
    if (status !== "authenticated") {
      openLogin();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/checkout", { method: "POST" });
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
  }, [status, openLogin, router]);

  return (
    <div className="bg-cream text-ink overflow-x-clip">
      <section className="relative min-h-dvh flex items-center py-16 md:py-24">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[560px] w-[860px] max-w-full rounded-full bg-signal/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-[1.04fr_0.96fr] items-center gap-14 lg:gap-20">
            {/* LEFT */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-4 py-1.5 shadow-sm">
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center ring-1 ring-signal/15">
                  <Sparkles className="w-3 h-3 text-signal-dark" />
                </span>
                <Eyebrow>A new book by Valix</Eyebrow>
              </div>

              <h1 className="mt-6 font-serif text-[40px] sm:text-5xl md:text-[58px] lg:text-[62px] font-bold tracking-[-0.035em] leading-[1.02] text-ink">
                Become the <span className="text-signal">favorite employee</span> your manager
                fights to keep.
                <span className="mt-4 block font-sans text-[20px] sm:text-[22px] md:text-[24px] font-semibold leading-snug tracking-[-0.01em] text-ink-soft">
                  Even if you&apos;re not the smartest person in the room.
                </span>
              </h1>

              <p className="mt-6 text-[17px] sm:text-lg leading-relaxed text-ink-soft max-w-xl mx-auto lg:mx-0">
                <span className="font-semibold text-ink">
                  Guide to Becoming Your Manager&apos;s Favorite Employee
                </span>{" "}
                — the 30-day playbook that puts you first in line for promotions, raises,
                high-visibility projects, and the flexibility you have already earned.
              </p>

              <ul className="mt-7 space-y-3 max-w-xl mx-auto lg:mx-0 text-left">
                {[
                  "Get promoted faster — without waiting for the next review cycle",
                  "Become your manager's go-to person for the projects and conversations that matter",
                  "Get the raise, autonomy, and flexibility you have already earned",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-moss/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-moss" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-ink">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-2">
                <div className="flex items-center gap-0.5 text-signal">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[12.5px] text-ink-soft">
                  Early readers call it “the career conversation I wish I&apos;d had years ago.”
                </p>
              </div>
            </div>

            {/* RIGHT — BOOK + DOWNLOAD */}
            <div className="relative flex flex-col items-center">
              <div
                className="absolute top-4 h-[330px] w-[330px] sm:h-[400px] sm:w-[400px] rounded-full border border-line bg-paper/60"
                aria-hidden="true"
              />
              <div
                className="absolute top-10 h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] rounded-full bg-signal/5 blur-2xl"
                aria-hidden="true"
              />

              <div className="relative">
                <BookCover />
              </div>

              <div className="relative mt-7 flex flex-col items-center text-center">
                <DownloadButton onClick={startCheckout} loading={loading} />
                {error && (
                  <p className="mt-3 text-[12px] font-semibold text-signal">{error}</p>
                )}
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-soft/70">
                  <ShieldCheck className="w-3 h-3 text-moss" />
                  24-page PDF · instant download · 30-day guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
