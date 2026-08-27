"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-[19px] h-[19px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg className="w-[19px] h-[19px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const avatarLetter = (session?.user?.email || session?.user?.name || "V")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-cream/90 backdrop-blur-xl border-b border-line flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="Valix" className="w-7 h-7 rounded-lg" />
          <span className="text-[15px] font-bold tracking-tight text-ink">Valix</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="p-2 -mr-1 rounded-lg hover:bg-mist transition-colors"
        >
          <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[270px] lg:w-[76px] bg-paper border-r border-line flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 lg:transition-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 lg:h-[72px] flex items-center justify-between lg:justify-center px-5 lg:px-0 border-b border-line">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Valix" className="w-8 h-8 rounded-[9px]" />
            <span className="text-[17px] font-bold tracking-tight text-ink lg:hidden">Valix</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden ml-auto p-2 -mr-2 rounded-lg hover:bg-mist transition-colors"
          >
            <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-3 lg:justify-center lg:gap-0 px-3 lg:px-0 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors ${
                  active
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:text-ink hover:bg-mist/60"
                }`}
              >
                {item.icon}
                <span className="lg:hidden">{item.label}</span>
                <span className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-ink text-white text-[12px] font-medium whitespace-nowrap opacity-0 pointer-events-none translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-150 z-50 shadow-lg">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-line px-4 lg:px-0 py-4 flex items-center gap-3 lg:flex-col">
          <span className="group relative w-9 h-9 lg:w-10 lg:h-10 shrink-0 rounded-full bg-ink text-white flex items-center justify-center text-[13px] font-bold cursor-default">
            {avatarLetter}
            <span className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-ink text-white text-[12px] font-medium whitespace-nowrap opacity-0 pointer-events-none translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-150 z-50 shadow-lg">
              {session?.user?.email || "Valix user"}
            </span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Log out"
            className="group relative p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-mist transition-colors lg:mt-1"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-ink text-white text-[12px] font-medium whitespace-nowrap opacity-0 pointer-events-none translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-150 z-50 shadow-lg">
              Log out
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-[76px]">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 lg:pt-10 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
