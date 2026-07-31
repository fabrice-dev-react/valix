"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdCard from "@/components/AdCard";
import { saveRun, getRun, type SavedAd } from "@/lib/clientRuns";

const steps = [
  {
    label: "Reading your site",
    detail: "Scanning structure, headline and offer",
  },
  {
    label: "Pulling your tone",
    detail: "Matching your brand voice and proof points",
  },
  {
    label: "Writing copy",
    detail: "Drafting hooks, benefits and CTAs",
  },
  {
    label: "Designing creatives",
    detail: "Building four variants for feed, Stories and Reels",
  },
];

type GenerateResult = {
  runId: string;
  url: string;
  domain: string;
  brand: string;
  heroImagePath: string | null;
  ads: SavedAd[];
};

function getUrlParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

export default function Analyzing() {
  const router = useRouter();
  const { status } = useSession();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inputUrl, setInputUrl] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const firstRunRef = useRef(true);
  const downloadFnsRef = useRef<Map<number, () => Promise<void>>>(new Map());

  const registerDownload = useCallback((index: number, fn: () => Promise<void>) => {
    downloadFnsRef.current.set(index, fn);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const run = useCallback(async (url: string, loadFromStore = false) => {
    const stored = getRun(url);
    if (loadFromStore && stored) {
      setResult({
        runId: stored.runId,
        url: stored.url,
        domain: stored.domain,
        brand: stored.brand,
        heroImagePath: stored.heroImagePath,
        ads: stored.ads,
      });
      return;
    }

    setRunning(true);
    setError(null);
    setResult(null);
    setStepIndex(0);
    setProgress(0);
    setInputUrl(url);

    const start = performance.now();
    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(96, (elapsed / 20000) * 100));
      setStepIndex(Math.min(3, Math.floor(elapsed / 5000)));
    }, 200);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Try again.");
      }

      setProgress(100);
      setStepIndex(4);
      const r: GenerateResult = data;
      setResult(r);
      saveRun({
        runId: r.runId,
        url: r.url,
        domain: r.domain,
        brand: r.brand,
        heroImagePath: r.heroImagePath,
        ads: r.ads,
        createdAt: Date.now(),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      clearInterval(timer);
      setRunning(false);
      setTimeout(() => setProgress(0), 400);
    }
  }, []);

  useEffect(() => {
    if (!firstRunRef.current) return;
    firstRunRef.current = false;

    const runParam = getUrlParam("run");
    if (runParam) {
      const stored = getRun(runParam);
      if (stored) {
        setResult({
          runId: stored.runId,
          url: stored.url,
          domain: stored.domain,
          brand: stored.brand,
          heroImagePath: stored.heroImagePath,
          ads: stored.ads,
        });
        return;
      }
    }

    const urlParam = getUrlParam("url");
    if (urlParam) {
      run(urlParam);
    }
  }, [run]);

  const handleUpdate = (index: number, field: keyof SavedAd, value: string) => {
    setResult((prev) => {
      if (!prev) return prev;
      const ads = prev.ads.map((ad, i) => (i === index ? { ...ad, [field]: value } : ad));
      saveRun({
        runId: prev.runId,
        url: prev.url,
        domain: prev.domain,
        brand: prev.brand,
        heroImagePath: prev.heroImagePath,
        ads,
        createdAt: Date.now(),
      });
      return { ...prev, ads };
    });
  };

  const handleDownloadAll = async () => {
    setExportingAll(true);
    for (const fn of downloadFnsRef.current.values()) {
      await fn();
      await new Promise((r) => setTimeout(r, 600));
    }
    setExportingAll(false);
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            One moment
          </span>
        </div>
      </div>
    );
  }

  const showProgress = running;
  const done = !running && !!result;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pt-6 lg:pt-10">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
            {done ? "Run complete" : error ? "Something broke" : "Generating"}
          </p>
          {running && (
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
          )}
        </div>
      </div>

        {/* URL entry */}
        {!running && !done && (
          <div className="mt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputUrl.trim()) run(inputUrl.trim());
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="url"
                required
                placeholder="https://your-store.com/product"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 h-12 px-4 rounded-xl bg-paper border border-line text-[15px] text-ink placeholder:text-ink-soft/50 outline-none transition-colors focus:border-ink/40 focus:bg-white"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-ink/90 active:scale-[0.98] transition-all shrink-0"
              >
                Generate ads
              </button>
            </form>
            {error && (
              <div className="mt-4 rounded-xl bg-signal-soft border border-signal/20 px-4 py-3">
                <p className="text-[13px] font-medium text-signal-dark">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Progress / steps */}
        {showProgress && (
          <div className="mt-8">
            <div className="h-2 w-full bg-mist rounded-full overflow-hidden">
              <div
                className="h-full bg-signal rounded-full transition-[width] duration-200 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-[11px] text-ink-soft tabular-nums">
              {Math.round(progress)}%
            </p>

            <div className="mt-8 space-y-0">
              {steps.map((step, i) => {
                const state =
                  i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
                return (
                  <div
                    key={step.label}
                    className={`relative flex gap-4 pb-8 last:pb-0 ${
                      i !== steps.length - 1
                        ? "before:absolute before:left-[15px] before:top-8 before:bottom-0 before:w-px before:bg-line"
                        : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      <span
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                          state === "done"
                            ? "bg-signal border-signal"
                            : state === "active"
                              ? "border-signal bg-white"
                              : "border-line bg-paper"
                        }`}
                      >
                        {state === "done" ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : state === "active" ? (
                          <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-line" />
                        )}
                      </span>
                    </div>
                    <div className="pt-1.5">
                      <p
                        className={`text-[15px] font-semibold transition-colors duration-300 ${
                          state === "pending" ? "text-ink-soft/40" : "text-ink"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`mt-0.5 text-[13px] transition-colors duration-300 ${
                          state === "pending" ? "text-ink-soft/30" : "text-ink-soft"
                        }`}
                      >
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error during run */}
        {!running && error && !done && (
          <div className="mt-8 rounded-xl bg-signal-soft border border-signal/20 px-4 py-3 flex items-center gap-3">
            <svg className="w-4 h-4 text-signal-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-[13px] font-medium text-signal-dark flex-1">{error}</p>
            <button
              onClick={() => run(inputUrl)}
              className="px-4 py-2 rounded-full bg-ink text-white text-[12px] font-semibold hover:bg-ink/90 transition-colors shrink-0"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {done && result && (
          <div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">
                  {result.brand} <span className="text-ink-soft font-normal">·</span>{" "}
                  <span className="text-ink-soft">{result.domain}</span>
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">
                  Four variations, ready to publish. Edit any copy, then export.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => run(result.url)}
                  className="h-10 px-4 rounded-full border border-line bg-paper text-ink text-[13px] font-semibold hover:border-ink/30 transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleDownloadAll}
                  disabled={exportingAll}
                  className="h-10 px-5 rounded-full bg-ink text-white text-[13px] font-semibold hover:bg-ink/90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {exportingAll ? "Exporting…" : "Download all"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {result.ads.map((ad, i) => (
                <AdCard
                  key={`${result.runId}-${i}`}
                  ad={ad}
                  brand={result.brand}
                  imagePath={result.heroImagePath}
                  index={i}
                  onChange={handleUpdate}
                  registerDownload={registerDownload}
                />
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
