"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { JikanMangaListEntry } from "@/lib/types";
import { malImageShouldSkipOptimization, pickAnimeImage } from "@/lib/image-url";

type Props = {
  items: JikanMangaListEntry[];
};

export function MangaUpdatesRow({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold text-muted md:text-xl">New Manga Updates</h2>
        <div className="flex items-center gap-4">
          <div className="hidden gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-accent/40 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,26,26,0.3)]"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-accent/40 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,26,26,0.3)]"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-1 pr-4"
      >
        {items.map((manga) => {
          const src = pickAnimeImage(manga.images as JikanMangaListEntry["images"]);
          const title = manga.title_english || manga.title;
          const genre =
            manga.genres?.[0]?.name ??
            (manga.chapters != null ? `${manga.chapters} ch` : "Manga");

          return (
            <Link
              key={manga.mal_id}
              href={`/manga/${manga.mal_id}`}
              className="group w-[140px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/5 bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_8px_30px_-6px_rgba(255,26,26,0.5)] md:w-[160px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                {src ? (
                  <Image
                    src={src}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="160px"
                    unoptimized={malImageShouldSkipOptimization(src)}
                  />
                ) : (
                  <div className="h-full w-full bg-surface-2" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-40" />
                <div className="absolute top-2 right-2">
                  <span className="inline-block rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent border border-white/10">
                    {genre}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-xs font-extrabold leading-snug text-white/90 transition-colors group-hover:text-white">
                  {title}
                </p>
              </div>
            </Link>
          );
        })}
        <Link
          href="/browse?type=manga"
          className="group flex w-[140px] shrink-0 snap-start items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-surface/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:bg-surface hover:shadow-[0_8px_30px_-6px_rgba(255,26,26,0.5)] md:w-[160px]"
        >
          <div className="flex flex-col items-center gap-3 p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
              →
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-white/80 transition-colors group-hover:text-white">
              View All
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
