"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateLabel, formatSlotLabel } from "@/lib/meetings";

type AdminUser = {
  email: string;
  name?: string | null;
  createdAt: string;
  hasPaid: boolean;
};

type AdminMeeting = {
  name: string;
  email: string;
  whatsapp: string;
  date: string;
  slot: string;
  topic: string;
  status: string;
  createdAt: string;
};

type ContactMessage = {
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type AdminStats = {
  totalUsers: number;
  paidUsers: number;
  totalMeetings: number;
  users: AdminUser[];
  messages: ContactMessage[];
  meetings: AdminMeeting[];
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
      <div className="min-h-screen bg-cream">
        <div className="bg-paper border-b border-line px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-signal" />
              <h1 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink font-semibold">
                Valix · Admin
              </h1>
            </div>
            <Link
              href="/"
              className="text-xs font-medium text-ink-soft hover:text-signal transition-colors"
            >
              Back to site
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
              Everything happening at Valix
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Users, payments and booked meetings — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-paper rounded-2xl p-6 border border-line">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-2">
                Total users
              </p>
              <p className="text-4xl font-semibold text-ink tracking-tight">
                {stats.totalUsers}
              </p>
            </div>
            <div className="bg-paper rounded-2xl p-6 border border-line">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-2">
                Paid users
              </p>
              <p className="text-4xl font-semibold text-ink tracking-tight">
                {stats.paidUsers}
              </p>
            </div>
            <div className="bg-paper rounded-2xl p-6 border border-line">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-2">
                Booked meetings
              </p>
              <p className="text-4xl font-semibold text-ink tracking-tight">
                {stats.totalMeetings}
              </p>
            </div>
          </div>

          <div className="bg-paper rounded-2xl border border-line overflow-hidden">
            <div className="px-6 py-4 border-b border-line">
              <h3 className="text-sm font-semibold text-ink">All users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-mist/50 border-b border-line">
                  <tr>
                    <th className="px-6 py-3 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {stats.users.map((user: AdminUser, index: number) => (
                    <tr key={index} className="hover:bg-cream">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                        {user.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-soft">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.hasPaid ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-moss/15 text-moss">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-mist text-ink-soft">
                            Free
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-paper rounded-2xl border border-line overflow-hidden">
            <div className="px-6 py-4 border-b border-line">
              <h3 className="text-sm font-semibold text-ink">Booked meetings</h3>
            </div>
            {stats.meetings.length === 0 ? (
              <p className="px-6 py-8 text-sm text-ink-soft">No meetings booked yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {stats.meetings.map((m: AdminMeeting, index: number) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-signal-dark font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                        {formatDateLabel(m.date)} · {formatSlotLabel(m.slot)}
                      </span>
                      <div className="text-sm">
                        <span className="font-semibold text-ink">{m.name || "Anonymous"}</span>
                        <span className="ml-2 text-ink-soft">{m.email}</span>
                      </div>
                    </div>
                    {m.whatsapp && (
                      <p className="mt-1.5 text-[13px] text-ink-soft">
                        WhatsApp: <span className="font-medium text-ink">{m.whatsapp}</span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 bg-paper rounded-2xl border border-line overflow-hidden">
            <div className="px-6 py-4 border-b border-line">
              <h3 className="text-sm font-semibold text-ink">Contact messages</h3>
            </div>
            {stats.messages.length === 0 ? (
              <p className="px-6 py-8 text-sm text-ink-soft">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {stats.messages.map((msg: ContactMessage, index: number) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-ink">
                        {msg.name || "Anonymous"}
                        {msg.email && (
                          <span className="ml-2 font-normal text-ink-soft">· {msg.email}</span>
                        )}
                      </p>
                      <p className="text-xs text-ink-soft whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-1.5 text-sm text-ink whitespace-pre-line">{msg.message}</p>
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
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-paper rounded-2xl p-8 border border-line">
          <div className="mb-6 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-signal" />
            <h1 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink font-semibold">
              Admin access
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-signal/10 text-signal-dark text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-cream border border-line focus:border-signal focus:ring-2 focus:ring-signal/20 outline-none transition-all placeholder:text-ink-soft/60 text-ink"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-ink hover:bg-ink/85 text-paper font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-paper border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              )}
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-ink-soft hover:text-signal transition-colors">
              Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
