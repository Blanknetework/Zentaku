"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AnimeKaiListItem } from "@/lib/animekai";
import { animeDetailHref, animeWatchHref } from "@/lib/anime-path";
import { streamingPosterUnoptimized } from "@/lib/image-url";

type HeroProps = {
  featuredList?: AnimeKaiListItem[] | null;
};

export function Hero({ featuredList }: HeroProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!featuredList || featuredList.length <= 1) return;
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % featuredList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredList]);

  if (!featuredList || featuredList.length === 0) {
    return (
      <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-surface md:min-h-[480px]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-deep/40 to-black" />
        <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-6 md:min-h-[480px] md:p-10">
          <h1 className="font-display text-4xl italic text-white md:text-6xl">ZENTAKU</h1>
          <p className="mt-2 max-w-xl text-muted">Stream anime. Read manga. One place.</p>
        </div>
      </div>
    );
  }

  const featured = featuredList[idx];
  const img = featured.image?.trim() ?? "";
  const title = featured.title;

  return (
    <div className="relative flex min-h-[460px] overflow-hidden rounded-[2rem] border border-white/5 bg-black md:min-h-[520px] shadow-2xl">
      {/* Split background layout */}
      {img && (
        <div key={img} className="absolute inset-y-0 right-0 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] animate-hero-bg">
          <Image
            src={img}
            alt=""
            fill
            className="object-cover object-center opacity-90"
            sizes="(max-width: 640px) 100vw, 80vw"
            priority
            unoptimized={streamingPosterUnoptimized(img)}
          />
          {/* Gradients to blend horizontal edge into the solid black left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent sm:via-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-50" />
          {/* Strong masking on the left border */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black to-transparent" />
        </div>
      )}

      {/* Content strictly aligned to left */}
      <div className="relative z-10 flex w-full flex-col justify-center p-6 sm:p-10 md:p-14 lg:w-[65%]">
        
        {/* Title */}
        <h1 
          key={`title-${title}`} 
          className="animate-fade-up font-display text-5xl sm:text-6xl font-extrabold tracking-tighter text-white md:text-7xl lg:text-[5.5rem] drop-shadow-2xl break-words whitespace-normal leading-[0.95]"
        >
          {title}
        </h1>

        {/* Metadata Row (Format, Status, Quality) */}
        <div key={`meta-${title}`} className="animate-fade-up-delay mt-6 flex flex-wrap items-center gap-6 border-l-2 border-accent pl-4 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-accent">Format</span>
            <span className="text-xs sm:text-sm font-bold text-white/90">TV</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-accent">Status</span>
            <span className="text-xs sm:text-sm font-bold text-white/90">AIRING</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-accent">Quality</span>
            <span className="text-xs sm:text-sm font-bold text-white/90">HD / SUB</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div key={`btn-${title}`} className="animate-fade-up-delay-2 mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href={animeWatchHref(featured.id)}
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-accent px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:bg-red-600 shadow-[0_0_25px_rgba(255,26,26,0.3)] hover:shadow-[0_0_35px_rgba(255,26,26,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 32 32">
                <path d="M10.667 8.667l14.667 7.333-14.667 7.333z" />
              </svg>
              Watch Now
            </span>
          </Link>
          <Link
            href={animeDetailHref(featured.id)}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white/80 transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </Link>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-2">
        {featuredList.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? "w-6 bg-accent" : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
