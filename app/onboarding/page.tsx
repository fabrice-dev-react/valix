"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/auth/refresh-session", { method: "POST" });
        if (!res.ok) {
          router.push("/?login=1");
          return;
        }
        router.push("/dashboard");
      } catch {
        router.push("/?login=1");
      }
    }
    checkAccess();
  }, [router]);

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
