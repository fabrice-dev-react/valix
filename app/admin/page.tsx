"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminUser = {
  email: string;
  name?: string | null;
  createdAt: string;
  hasPaid: boolean;
};

type AdminStats = {
  totalUsers: number;
  paidUsers: number;
  users: AdminUser[];
  messages: ContactMessage[];
};

type ContactMessage = {
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const result = await res.json();
          setStats(result);
          setAuthenticated(true);
        }
      } catch {
        // stay on the login form
      }
    };
    check();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid password");
        return;
      }

      const result = await res.json();
      setStats(result);
      setAuthenticated(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authenticated && stats) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">Back to App</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Paid Users</p>
              <p className="text-3xl font-bold text-slate-800">{stats.paidUsers}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">All Users</h2>
            </div>            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {stats.users.map((user: AdminUser, index: number) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{user.name || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.hasPaid ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Paid</span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">Free</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">Contact Messages</h2>
            </div>
            {stats.messages.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-500">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {stats.messages.map((msg: ContactMessage, index: number) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {msg.name || "Anonymous"}
                        {msg.email && (
                          <span className="ml-2 font-normal text-slate-500">· {msg.email}</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-600 whitespace-pre-line">{msg.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Access</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-black hover:bg-slate-800 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              )}
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">Back to App</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
