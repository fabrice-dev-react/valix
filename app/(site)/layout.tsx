"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginOverlay from "@/components/LoginOverlay";
import { LoginContext } from "@/components/LoginContext";

const emptySubscribe = () => () => {};

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
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (loginOpen) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [loginOpen]);

  return (
    <LoginContext.Provider value={{ openLogin: () => setLoginOpen(true) }}>
      {!isHome && <Header />}
      <main>{children}</main>
      {!isHome && <Footer />}
      <LoginOverlay open={loginOpen && mounted} onClose={() => setLoginOpen(false)} />
    </LoginContext.Provider>
  );
}
