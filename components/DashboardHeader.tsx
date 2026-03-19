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
        {title || `${getGreeting()}, ${session?.user?.name?.split(" ")[0] || "User"} 👋`}
      </h1>
      <button 
        onClick={() => router.push("/dashboard/competitors")}
        className="px-3 py-2 md:px-4 md:py-2 bg-blue-500 text-white text-sm md:text-base font-medium rounded-lg hover:bg-blue-600 transition-colors"
      >
        + Add Competitor
      </button>
    </div>
  );
}
