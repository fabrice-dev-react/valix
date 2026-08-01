"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginOverlay from "@/components/LoginOverlay";
import { LoginContext } from "@/components/LoginContext";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loginOpen, setLoginOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.has("login") || params.has("error");
  });

  useEffect(() => {
    if (loginOpen) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [loginOpen]);

  return (
    <LoginContext.Provider value={{ openLogin: () => setLoginOpen(true) }}>
      <Header />
      <main>{children}</main>
      <Footer />
      <LoginOverlay open={loginOpen} onClose={() => setLoginOpen(false)} />
    </LoginContext.Provider>
  );
}
