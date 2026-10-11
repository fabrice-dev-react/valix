"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

export type ShowcaseVideo = {
  src: string;
  poster: string;
  title: string;
  category: string;
  duration: string;
  orientation: "landscape" | "vertical";
};

export const showcaseVideos: ShowcaseVideo[] = [
  {
    src: "/our-work/b2b-video-production.mp4",
    poster: "/our-work/posters/b2b-video-production.jpg",
    title: "Northloop",
    category: "B2B service promo",
    duration: "1:11",
    orientation: "landscape",
  },
  {
    src: "/our-work/client-explainer.mp4",
    poster: "/our-work/posters/client-explainer.jpg",
    title: "Sentient Foundation",
    category: "Brand film",
    duration: "1:15",
    orientation: "landscape",
  },
  {
    src: "/our-work/quibly-reel.mp4",
    poster: "/our-work/posters/quibly-reel.jpg",
    title: "Quibly",
    category: "Vertical launch reel",
    duration: "0:24",
    orientation: "vertical",
  },
  {
    src: "/our-work/imagine-art-reel.mp4",
    poster: "/our-work/posters/imagine-art-reel.jpg",
    title: "Imagine Art 2.0",
    category: "Launch announcement",
    duration: "0:42",
    orientation: "landscape",
  },
  {
    src: "/our-work/ventaz-ai-explainer.mp4",
    poster: "/our-work/posters/ventaz-ai-explainer.jpg",
    title: "Ventaz AI",
    category: "SaaS product explainer",
    duration: "1:17",
    orientation: "landscape",
  },
];

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ShowcaseVideoCard({
  video,
  onOpen,
}: {
  video: ShowcaseVideo;
  onOpen: (video: ShowcaseVideo) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);

  const stop = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  const start = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    try {
      await el.play();
      setPreviewing(true);
    } catch {
      setPreviewing(false);
    }
  }, []);

  const handleEnter = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) start();
  };

  const handleLeave = () => {
    setPreviewing(false);
    stop();
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(video)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      aria-label={`Play ${video.title} — ${video.category}`}
      className="group relative block w-full text-left focus:outline-none"
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink shadow-[0_18px_40px_-22px_rgba(22,19,17,0.45)] ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-[0_28px_60px_-20px_rgba(22,19,17,0.5)] group-hover:ring-signal/40 group-focus-visible:ring-2 group-focus-visible:ring-signal">
        <Image
          src={video.poster}
          alt={`${video.title} — ${video.category}`}
          fill
          loading="lazy"
          sizes="(min-width: 640px) 36rem, 100vw"
          className={`object-cover transition-opacity duration-500 ${
            previewing ? "opacity-0" : "opacity-100"
          }`}
        />
        <video
          ref={ref}
          src={video.src}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            previewing ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />

        {video.orientation === "vertical" && (
          <span className="absolute top-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
            9:16
          </span>
        )}

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:bg-signal">
            <Play className="ml-0.5 h-5 w-5 fill-ink text-ink transition-colors duration-300 group-hover:fill-white group-hover:text-white" />
          </span>
        </span>

        <span className="absolute bottom-3 right-3 rounded-md bg-ink/75 px-2 py-0.5 font-mono text-[10px] text-white/85 backdrop-blur-sm">
          {video.duration}
        </span>

        <span className="absolute inset-x-0 bottom-0 p-4">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
            {video.category}
          </span>
          <span className="mt-1 block text-[15px] font-bold leading-tight text-white">
            {video.title}
          </span>
        </span>
      </div>
    </button>
  );
}

export function ShowcaseVideoLightbox({
  video,
  onClose,
  onCta,
}: {
  video: ShowcaseVideo | null;
  onClose: () => void;
  onCta: () => void;
}) {
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 px-4 py-6 backdrop-blur-md sm:px-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${video.title} video`}
    >
      <button
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 sm:right-7 sm:top-6"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
          <div className="relative">
            <video
              key={video.src}
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => setLoaded(e.currentTarget.duration)}
              className="w-full bg-black object-contain"
              style={{
                aspectRatio:
                  video.orientation === "vertical" ? "9 / 16" : "16 / 9",
                maxHeight: "min(72vh, 760px)",
                marginInline: "auto",
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              {video.category}
            </p>
            <p className="mt-1 text-lg font-bold text-white">{video.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-white/40">
              {loaded ? formatTime(loaded) : video.duration} · edited by Valix
            </p>
          </div>
          <button
            onClick={onCta}
            className="group inline-flex items-center gap-2.5 rounded-full bg-signal px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-signal-dark"
          >
            Get one like this — $97/mo
            <Play className="h-3.5 w-3.5 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}