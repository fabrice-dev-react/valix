"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>(null);

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

      const data = await fetch("/api/admin/users");
      const result = await data.json();
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Paid Users</p>
              <p className="text-3xl font-bold text-green-600">{stats.paidUsers}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Free Users</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.freeUsers}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Verified Emails</p>
              <p className="text-3xl font-bold text-slate-800">{stats.verifiedUsers}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {stats.users.map((user: any, index: number) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{user.name || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 capitalize">{user.plan}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isPaid ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
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
