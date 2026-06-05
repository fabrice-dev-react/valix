"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account" },
    { id: "billing", label: "Billing" },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border border-blue-500"
                : "text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200">
        {activeTab === "billing" && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Billing</h2>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-800">NASDAQ & S&P500 Trading Strategy Book</p>
                  <p className="text-blue-600 text-sm">$59 • One-time payment • Lifetime updates</p>
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-sm">
              This is a one-time purchase. You have lifetime access to the book and all future updates.
            </p>
          </div>
        )}

        {activeTab === "account" && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Account Settings</h2>

            <div className="space-y-6">
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Change Password</h3>
                <p className="text-slate-500 text-sm mb-4">Update your password to keep your account secure.</p>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                  Change Password
                </button>
              </div>

              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                <p className="text-red-600 text-sm mb-4">Permanently delete your account and all associated data.</p>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
