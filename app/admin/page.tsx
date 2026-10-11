"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminUser = {
  email: string;
  name?: string | null;
  createdAt: string;
  hasPaid: boolean;
  brief: {
    productName: string;
    websiteUrl: string;
    notes: string;
    contactMethod: string;
    contactDetail: string;
    submittedAt: string;
  } | null;
};

type AdminStats = {
  totalUsers: number;
  briefsSubmitted: number;
  payingUsers: number;
  users: AdminUser[];
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
              Every client brief, newest first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
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
                Paying clients
              </p>
              <p className="text-4xl font-semibold text-ink tracking-tight">
                {stats.payingUsers}
              </p>
            </div>
            <div className="bg-paper rounded-2xl p-6 border border-line">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-2">
                Briefs submitted
              </p>
              <p className="text-4xl font-semibold text-ink tracking-tight">
                {stats.briefsSubmitted}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mb-5">
            <h3 className="text-sm font-semibold text-ink">
              Submissions
              <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/60">
                {stats.users.length}
              </span>
            </h3>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-medium text-ink-soft hover:text-signal transition-colors"
            >
              Refresh
            </button>
          </div>

          {stats.users.length === 0 ? (
            <div className="bg-paper rounded-2xl border border-line px-6 py-12 text-center">
              <p className="text-sm text-ink-soft">No submissions yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.users.map((user: AdminUser, index: number) => (
                <article
                  key={index}
                  className={`rounded-2xl border bg-paper p-6 ${
                    user.hasPaid ? "border-moss/30" : "border-line"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-[16px] font-bold text-ink truncate">
                        {user.brief?.productName || user.name || "No SaaS name"}
                      </h4>
                      <p className="mt-0.5 text-[12.5px] text-ink-soft truncate">
                        {user.email}
                      </p>
                    </div>
                    {user.hasPaid ? (
                      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-moss/15 px-2.5 py-1 text-[11px] font-bold text-moss">
                        <span className="w-1.5 h-1.5 rounded-full bg-moss" />
                        Paid
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-2.5 py-1 text-[11px] font-bold text-signal-dark">
                        <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                        Unpaid
                      </span>
                    )}
                  </div>

                  {/* SaaS URL */}
                  <div className="mt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
                      SaaS URL
                    </p>
                    {user.brief?.websiteUrl ? (
                      <a
                        href={user.brief.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-[13px] text-signal hover:text-signal-dark transition-colors break-all"
                      >
                        {user.brief.websiteUrl}
                      </a>
                    ) : (
                      <p className="mt-1 text-[13px] text-ink-soft/60">—</p>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="mt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
                      Contact
                    </p>
                    {user.brief?.contactDetail ? (
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-cream border border-line px-2.5 py-0.5 text-[11px] font-semibold text-ink capitalize">
                          {user.brief.contactMethod}
                        </span>
                        <span className="text-[13px] text-ink break-all">
                          {user.brief.contactDetail}
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 text-[13px] text-ink-soft/60">
                        Not provided yet
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="mt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
                      Notes
                    </p>
                    {user.brief?.notes ? (
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft whitespace-pre-line">
                        {user.brief.notes}
                      </p>
                    ) : (
                      <p className="mt-1 text-[13px] text-ink-soft/60">
                        No notes added
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-line flex items-center justify-between gap-3 text-[11.5px] text-ink-soft">
                    <span>
                      Submitted{" "}
                      {user.brief?.submittedAt
                        ? new Date(user.brief.submittedAt).toLocaleString(undefined, {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </span>
                    <span>
                      Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
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