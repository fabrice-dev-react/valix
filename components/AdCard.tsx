"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { SavedAd } from "@/lib/clientRuns";

const FALLBACK_IMAGE = "/fallback/fallback.svg";

type AdCardProps = {
  ad: SavedAd;
  brand: string;
  imagePath: string | null;
  index: number;
  onChange: (index: number, field: keyof SavedAd, value: string) => void;
  registerDownload?: (index: number, fn: () => Promise<void>) => void;
};

export default function AdCard({
  ad,
  brand,
  imagePath,
  index,
  onChange,
  registerDownload,
}: AdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `valix-ad-${index + 1}.png`;
      a.click();
    } catch {
      // export failed silently
    } finally {
      setDownloading(false);
    }
  };

  useRegisterDownload(registerDownload, index, handleDownload);

  return (
    <div className="group">
      {/* ===== Final image (exact export) ===== */}
      <div
        ref={cardRef}
        className="relative aspect-[4/5] w-full overflow-hidden bg-ink select-none"
      >
        <img
          src={imagePath || FALLBACK_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
        />

        {/* Legibility gradient */}
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Frosted text panel */}
        <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
          <div className="rounded-2xl border border-white/15 bg-ink/45 backdrop-blur-xl px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                {brand}
              </p>
            </div>

            <p className="mt-2.5 text-[13px] sm:text-sm font-extrabold uppercase tracking-wide text-white/95 leading-snug">
              {ad.headline}
            </p>
            <p className="mt-1.5 text-[22px] sm:text-2xl font-extrabold tracking-[-0.02em] text-white leading-[1.04]">
              {ad.primary}
            </p>
            <p className="mt-2 text-[13px] sm:text-[13.5px] font-medium text-white/80 leading-snug">
              {ad.body}
            </p>

            <div className="mt-3.5">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-ink text-[13px] font-bold">
                {ad.cta}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Controls (not part of the image) ===== */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft rounded-full bg-mist px-2 py-1">
            {ad.angle}
          </span>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink text-white text-[12px] font-semibold hover:bg-ink/90 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {downloading ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5m-5 5V4" />
              </svg>
            )}
            {downloading ? "Exporting…" : "Download PNG"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">Headline</span>
            <input
              value={ad.headline}
              onChange={(e) => onChange(index, "headline", e.target.value)}
              className="mt-1 w-full h-9 px-3 rounded-lg bg-paper border border-line text-[13px] text-ink outline-none focus:border-ink/40 transition-colors"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">Primary text</span>
            <input
              value={ad.primary}
              onChange={(e) => onChange(index, "primary", e.target.value)}
              className="mt-1 w-full h-9 px-3 rounded-lg bg-paper border border-line text-[13px] text-ink outline-none focus:border-ink/40 transition-colors"
            />
          </label>
          <label className="block col-span-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">Body</span>
            <textarea
              value={ad.body}
              onChange={(e) => onChange(index, "body", e.target.value)}
              rows={2}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-paper border border-line text-[13px] text-ink outline-none focus:border-ink/40 transition-colors resize-none"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">CTA</span>
            <input
              value={ad.cta}
              onChange={(e) => onChange(index, "cta", e.target.value)}
              className="mt-1 w-full h-9 px-3 rounded-lg bg-paper border border-line text-[13px] text-ink outline-none focus:border-ink/40 transition-colors"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function useRegisterDownload(
  register: AdCardProps["registerDownload"],
  index: number,
  fn: () => Promise<void>
) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  useEffect(() => {
    if (!register) return;
    register(index, () => fnRef.current());
  }, [register, index]);
}
