"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function PaymentGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (status === "loading") return;

      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/refresh-session", { method: "POST" });
        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (data.onboardingCompleted) {
          setChecking(false);
          return;
        }

        if (pathname !== "/onboarding") {
          router.push("/onboarding");
          return;
        }

        setChecking(false);
      } catch {
        router.push("/login");
      }
    }

    checkAccess();
  }, [status, pathname, router]);

  if (checking || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
