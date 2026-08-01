"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLogin } from "@/components/LoginContext";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const { openLogin } = useLogin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLoggedIn = status === "authenticated" && session;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-cream/85 backdrop-blur-xl border-line"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Valix"
              className="w-8 h-8 rounded-[9px] group-hover:scale-105 transition-transform"
            />
            <span className="text-[17px] font-bold tracking-tight text-ink">
              Valix
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13.5px] font-medium text-ink-soft hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="text-[13.5px] font-medium text-ink-soft hover:text-ink transition-colors px-3 py-2"
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={openLogin}
                className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-white bg-ink hover:bg-black px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]"
              >
                Start now
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M22 7l-8.5 8.5-5-5L2 17" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7h6v6" />
                </svg>
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-mist transition-colors"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span
                className={`block h-[2px] bg-ink transition-transform duration-200 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`block h-[2px] bg-ink transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-[2px] bg-ink transition-transform duration-200 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-line bg-cream/95 backdrop-blur-xl">
          <div className="px-5 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-[15px] font-medium text-ink-soft hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-line">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-[15px] font-medium text-ink hover:text-ink"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openLogin();
                    }}
                    className="inline-flex items-center justify-center gap-2 py-3 text-[15px] font-semibold text-white bg-ink rounded-full"
                  >
                    Start now
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M22 7l-8.5 8.5-5-5L2 17" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7h6v6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
