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
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.plan === "book") {
          router.push("/dashboard");
        } else {
          router.push("/pricing");
        }
      } catch {
        router.push("/login");
      }
    }
    checkAccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
