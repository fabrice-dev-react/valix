"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-slate-800">Valix</span>
        <div className="w-10"></div>
      </div>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <DashboardSidebar />
      </div>

      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <DashboardSidebar />
      </div>

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
