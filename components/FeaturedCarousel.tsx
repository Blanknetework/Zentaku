"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { AnimeKaiListItem } from "@/lib/animekai";
import { animeDetailHref, animeWatchHref } from "@/lib/anime-path";
import { streamingPosterUnoptimized } from "@/lib/image-url";

type Props = {
  items: AnimeKaiListItem[];
};

export function FeaturedCarousel({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-4 w-full relative">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display tracking-wide font-semibold text-muted md:text-xl">Featured Series</h2>
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

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2 -mx-4 px-4 lg:-mx-0 lg:px-0"
      >
        {items.map((anime) => {
          const src = anime.image?.trim() ?? "";
          const title = anime.title;
          return (
              <article
                key={anime.id}
                className="group relative w-[260px] sm:w-[280px] md:w-[320px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/5 bg-surface transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_10px_40px_-10px_rgba(255,26,26,0.5)]"
              >
                <div className="relative aspect-[16/10]">
                  <Link href={animeDetailHref(anime.id)} className="relative block h-full w-full">
                    {src ? (
                      <Image
                        src={src}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes="(max-width:768px) 88vw, 360px"
                        unoptimized={streamingPosterUnoptimized(src)}
                      />
                    ) : (
                      <div className="h-full min-h-[200px] w-full bg-surface-2" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="line-clamp-2 text-lg font-extrabold tracking-tight text-white md:text-xl drop-shadow-md transition-transform duration-300 group-hover:-translate-y-2">{title}</h3>
                    </div>
                  </Link>

                  <Link
                    href={animeWatchHref(anime.id)}
                    className="absolute inset-0 z-20 flex items-center justify-center opacity-0 backdrop-blur-sm bg-black/40 transition-all duration-300 group-hover:opacity-100"
                  >
                    <span className="rounded-full bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-xl transition-transform hover:scale-110 hover:bg-red-600">
                      Watch Now
                    </span>
                  </Link>
                </div>
              </article>
          );
        })}
      </div>
    </section>
  );
}
