"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/Button";

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated" && session;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="px-2 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image 
              src="/images/favicon.png" 
              alt="valix logo" 
              width={32} 
              height={32}
              className="w-7 h-7 md:w-8 md:h-8"
            />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Valix
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 md:gap-8 px-4">
            <a href="#how" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">How It Works</a>
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">Features</a>
            <Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">Pricing</Link>
          </div>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-3 md:px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors rounded-md">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-3 md:px-4 py-2 text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors border border-slate-300 rounded-md">Login</Link>
                <Link href="/signup">
                  <Button className="px-3 md:px-4 py-2 text-sm">
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 px-2">
            <div className="flex flex-col gap-3">
              <a href="#how" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm py-2">How It Works</a>
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm py-2">Features</a>
              <Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm py-2">Pricing</Link>
              <div className="flex gap-3 mt-2">
                {isLoggedIn ? (
                  <Link href="/dashboard" className="flex-1 px-4 py-2 text-center text-white font-medium text-sm transition-colors bg-blue-600 rounded-md">Dashboard</Link>
                ) : (
                  <>
                    <Link href="/login" className="flex-1 px-4 py-2 text-center text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors border border-slate-300 rounded-md">Login</Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full px-4 py-2 text-sm">
                        Signup
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
