"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  title?: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">
        {title || `${getGreeting()}, ${session?.user?.name?.split(" ")[0] || "Trader"} 👋`}
      </h1>
    </div>
  );
}
