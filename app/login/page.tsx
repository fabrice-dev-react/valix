"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const bullets = [
  "Four ad variations per run — test, don't guess.",
  "Copy in your brand's voice, not generic AI tone.",
  "Correct sizes for feed, Stories and Reels out of the box.",
];

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const csrfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return;

    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((data) => {
        if (csrfInputRef.current) {
          csrfInputRef.current.value = data.csrfToken;
        }
      });
  }, []);

  const handleGoogleSignIn = () => {
    formRef.current?.submit();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            One moment
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-2">
      {/* ===== Left / brand panel ===== */}
      <div className="hidden lg:flex flex-col justify-between bg-ink text-white p-12 xl:p-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-signal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <img src="/logo.png" alt="Valix" className="w-9 h-9 rounded-[10px] brightness-0 invert" />
            <span className="text-lg font-bold tracking-tight">Valix</span>
          </Link>

          <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
            Ad studio
          </p>
          <h1 className="mt-5 text-[40px] xl:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
            Your next winning ad starts with a URL.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/60 max-w-md">
            Valix reads your site, pulls the offer, the tone and the proof,
            then writes and designs four ready-to-publish Facebook &amp;
            Instagram ads in your voice.
          </p>

          <ul className="mt-10 space-y-4">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-signal/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-[15px] text-white/80">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex -space-x-2">
            {["S", "M", "J", "D"].map((i) => (
              <span
                key={i}
                className={`w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center text-[10px] font-bold text-white ${
                  ["bg-signal", "bg-moss", "bg-amber-600", "bg-ink-soft"][i.charCodeAt(0) % 4]
                }`}
              >
                {i}
              </span>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((s) => (
                <svg key={s} className="w-3 h-3 text-signal" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mt-1 text-[13px] text-white/60">
              <span className="font-semibold text-white">4.9</span> from 2,400+ marketers
            </p>
          </div>
        </div>
      </div>

      {/* ===== Right / auth panel ===== */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
          <img src="/logo.png" alt="Valix" className="w-9 h-9 rounded-[10px]" />
          <span className="text-lg font-bold tracking-tight text-ink">Valix</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-signal" />
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
              Get started
            </p>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.03em] text-ink leading-tight">
            Welcome to Valix
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            New here? Your account is created automatically when you continue
            with Google — same button for your first visit and every visit
            after. You&apos;ll unlock the dashboard with a one-time $39 payment.
          </p>

          <form
            ref={formRef}
            method="POST"
            action="/api/auth/signin/google"
            className="mt-8"
          >
            <input ref={csrfInputRef} type="hidden" name="csrfToken" />
            <input type="hidden" name="callbackUrl" value="/dashboard" />

            <button
              type="submit"
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-4 rounded-full bg-paper border border-line text-ink font-semibold transition-all duration-200 flex items-center justify-center gap-3 hover:border-ink/30 hover:bg-white active:scale-[0.99] shadow-[0_1px_0_rgba(22,19,17,0.04)]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-cream px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                $39 one-time · no subscription
              </span>
            </div>
          </div>

          <p className="text-center text-[12px] text-ink-soft leading-relaxed">
            By continuing you agree to our{" "}
            <a href="#" className="font-semibold text-ink underline decoration-signal/50 underline-offset-2 hover:decoration-signal transition-colors">Terms</a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-ink underline decoration-signal/50 underline-offset-2 hover:decoration-signal transition-colors">Privacy Policy</a>.
          </p>

          <div className="mt-10 pt-6 border-t border-line flex items-center justify-between">
            <p className="text-[13px] text-ink-soft">
              Not ready yet?{" "}
              <Link href="/" className="font-semibold text-ink hover:text-signal-dark transition-colors">
                See what Valix does
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
