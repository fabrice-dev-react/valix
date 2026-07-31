"use client";

import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "mailto:hello@valix.com" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Valix" className="w-8 h-8 rounded-[9px] brightness-0 invert" />
              <span className="text-lg font-bold tracking-tight text-white">Valix</span>
            </Link>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              Paste a URL, get four publishable ads. Built for teams that ship
              Facebook &amp; Instagram creative every week.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 max-w-xs"
            >
              <p className="text-[12px] font-medium text-white/70 mb-2">
                Weekly notes on ads that work. No spam.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@brand.com"
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-2.5 rounded-full bg-signal text-white text-sm font-semibold hover:bg-signal-dark transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

          {[
            { title: "Product", links: footerLinks.product },
            { title: "Company", links: footerLinks.company },
            { title: "Legal", links: footerLinks.legal },
          ].map((col) => (
            <div key={col.title} className="md:col-span-2 md:col-start-auto">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-white/40 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Valix. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="X" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
