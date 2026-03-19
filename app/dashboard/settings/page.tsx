"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("notifications");

  const tabs = [
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing" },
    { id: "account", label: "Account" },
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
        {activeTab === "notifications" && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Notification Preferences</h2>
            
            <div className="space-y-4">
              {[
                { label: "Email notifications", description: "Receive updates via email", enabled: true },
                { label: "Weekly digest", description: "Get a weekly summary of competitor reviews", enabled: true },
                { label: "New review alerts", description: "Get notified when new reviews appear", enabled: false },
                { label: "Complaint alerts", description: "Get notified when complaints are detected", enabled: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{item.label}</p>
                    <p className="text-slate-500 text-sm">{item.description}</p>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      item.enabled ? "bg-blue-500" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        item.enabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Billing & Plan</h2>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-800">Current Plan: Starter</p>
                  <p className="text-blue-600 text-sm">$79/month • 10 competitors</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                  Upgrade
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Payment Method</h3>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                    <span className="text-slate-600 text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">•••• •••• •••• 4242</p>
                    <p className="text-slate-400 text-sm">Expires 12/26</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
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
