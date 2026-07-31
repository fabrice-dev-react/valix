"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navSections = [
  {
    label: "Workspace",
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
          </svg>
        ),
      },
      {
        label: "New ad",
        href: "/analyzing",
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Coming soon",
    items: [
      {
        label: "Creatives",
        href: "#",
        soon: true,
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h9.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V19a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm6 2h4m-6 4h6m-6 4h6" />
          </svg>
        ),
      },
      {
        label: "Settings",
        href: "#",
        soon: true,
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (session?.user?.name || "V")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
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
        className={`fixed inset-y-0 left-0 z-50 w-[270px] bg-paper border-r border-line flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 lg:transition-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 lg:h-[72px] flex items-center px-5 border-b border-line">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Valix" className="w-8 h-8 rounded-[9px]" />
            <span className="text-[17px] font-bold tracking-tight text-ink">Valix</span>
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

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/70">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-disabled={"soon" in item ? item.soon : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors ${
                        active
                          ? "bg-ink text-white"
                          : "soon" in item && item.soon
                            ? "text-ink-soft/60 cursor-default"
                            : "text-ink-soft hover:text-ink hover:bg-mist/60"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      {"soon" in item && item.soon && (
                        <span
                          className={`ml-auto text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${
                            active ? "bg-white/15 text-white/70" : "bg-mist text-ink-soft/70"
                          }`}
                        >
                          Soon
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-line px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 shrink-0 rounded-full bg-ink text-white flex items-center justify-center text-[12px] font-bold">
              {initials}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-ink truncate">
                {session?.user?.name || "Valix user"}
              </p>
              <p className="text-[11px] text-ink-soft truncate">
                {session?.user?.email || ""}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label="Log out"
              title="Log out"
              className="p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-mist transition-colors"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-[270px]">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 lg:pt-10 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
