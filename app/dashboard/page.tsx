"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRuns } from "@/lib/clientRuns";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [url, setUrl] = useState("");
  const [runs, setRuns] = useState(() => getRuns());

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const refresh = () => setRuns(getRuns());
    window.addEventListener("focus", refresh);
    window.addEventListener("valix:runs", refresh as EventListener);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("valix:runs", refresh as EventListener);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            One moment
          </span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const firstName = session.user?.name?.split(" ")[0] || "there";

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between gap-4 pt-6 lg:pt-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
            Overview
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
            Hey {firstName},
          </h1>
          <p className="mt-2 text-[15px] text-ink-soft">
            Drop a URL below — Valix will read it and build your ads.
          </p>
        </div>
      </div>

      {/* Generator card */}
      <section className="mt-8 rounded-3xl bg-paper border border-line p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-signal" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
            New creative run
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (url.trim()) router.push(`/analyzing?url=${encodeURIComponent(url.trim())}`);
          }}
          className="mt-5"
        >
          <label htmlFor="url" className="block text-sm font-semibold text-ink">
            Your landing page
          </label>
          <p className="mt-1 text-[13px] text-ink-soft">
            Any page works — homepage, product page, a live campaign.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              id="url"
              type="url"
              required
              placeholder="https://your-store.com/product"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl bg-cream border border-line text-[15px] text-ink placeholder:text-ink-soft/50 outline-none transition-colors focus:border-ink/40 focus:bg-white"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-ink/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
            >
              Generate ads
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
        <p className="mt-4 text-[12px] text-ink-soft">
          Four ad variations · Facebook &amp; Instagram · ready in under a minute
        </p>
      </section>

      {/* Recent generations */}
      <section className="mt-6 rounded-3xl bg-paper border border-line p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
              Recent generations
            </p>
          </div>
          {runs.length > 0 && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/70 rounded-full bg-mist px-2.5 py-1">
              {runs.length} saved
            </span>
          )}
        </div>

        {runs.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-signal-soft flex items-center justify-center">
              <svg className="w-6 h-6 text-signal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="mt-4 text-[15px] font-semibold text-ink">
              No ads generated yet
            </p>
            <p className="mt-1.5 text-[13px] text-ink-soft max-w-xs">
              Your first run of four ad variations will show up here.
            </p>
            <button
              onClick={() => router.push("/analyzing")}
              className="mt-6 h-11 px-5 rounded-full bg-ink text-white text-[14px] font-semibold hover:bg-ink/90 active:scale-[0.98] transition-all"
            >
              Create your first ad
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {runs.map((run) => (
              <button
                key={run.runId}
                onClick={() => router.push(`/analyzing?run=${run.runId}`)}
                className="text-left rounded-2xl border border-line bg-cream overflow-hidden hover:border-ink/25 hover:shadow-[0_8px_24px_-12px_rgba(22,19,17,0.2)] transition-all group"
              >
                <div className="relative aspect-square w-full bg-ink overflow-hidden">
                  <img
                    src={run.heroImagePath || "/fallback/fallback.svg"}
                    alt={run.brand}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <p className="absolute bottom-2.5 left-3 right-3 text-[13px] font-bold text-white leading-tight line-clamp-2">
                    {run.ads[0]?.primary || run.brand}
                  </p>
                </div>
                <div className="px-3.5 py-3">
                  <p className="text-[13px] font-semibold text-ink truncate">{run.brand}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft truncate">
                    {run.domain} · {run.ads.length} ads
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
