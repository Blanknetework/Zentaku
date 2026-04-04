import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ApiError } from "@/components/ApiError";
import { Skeleton } from "@/components/skeletons";
import { malImageShouldSkipOptimization, pickAnimeImage, streamingPosterUnoptimized } from "@/lib/image-url";
import { getTopManga, searchManga, JikanError } from "@/lib/jikan";
import {
  AnimeKaiError,
  animeKaiPopular,
  animeKaiSearch,
  animeKaiTopAiring,
} from "@/lib/animekai";
import { animeDetailHref } from "@/lib/anime-path";
import { dedupeById, dedupeByMalId } from "@/lib/lists";
import type { AnimeKaiListItem } from "@/lib/animekai";
import type { JikanMangaListEntry } from "@/lib/types";

type SearchParams = Promise<{
  q?: string;
  type?: string;
  sort?: string;
}>;

type BrowseData = {
  type: "anime" | "manga";
  q: string;
  title: string;
  isPopularView: boolean;
  animeList: AnimeKaiListItem[] | null;
  mangaList: JikanMangaListEntry[] | null;
};

function apiError(err: unknown) {
  if (err instanceof AnimeKaiError || err instanceof JikanError) {
    return { message: err.message, status: err.status };
  }
  return { message: "Failed to load.", status: undefined as number | undefined };
}

async function loadBrowseData(sp: Awaited<SearchParams>): Promise<BrowseData> {
  const type = sp.type === "manga" ? "manga" : "anime";
  const q = (sp.q ?? "").trim();
  const popular = sp.sort === "popular";

  let animeList: AnimeKaiListItem[] | null = null;
  let mangaList: JikanMangaListEntry[] | null = null;

  if (type === "anime") {
    if (q) {
      const page = await animeKaiSearch(q);
      animeList = page.results;
    } else if (popular) {
      animeList = await animeKaiPopular(1, 24);
    } else {
      animeList = await animeKaiTopAiring(1, 24);
    }
  } else {
    if (q) mangaList = await searchManga(q, 24);
    else mangaList = await getTopManga(24);
  }

  const title =
    q !== ""
      ? `Results for “${q}”`
      : popular
        ? "Popular now"
        : type === "anime"
          ? "Trending anime"
          : "Top manga";

  return { type, q, title, isPopularView: popular, animeList, mangaList };
}

async function BrowseResults({ sp }: { sp: Awaited<SearchParams> }) {
  let data: BrowseData;
  try {
    data = await loadBrowseData(sp);
  } catch (err) {
    const { message, status } = apiError(err);
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ApiError message={message} status={status} />
      </div>
    );
  }

  const { type, q, title, isPopularView, animeList, mangaList } = data;
  const animeDeduped = animeList ? dedupeById(animeList) : null;
  const mangaDeduped = mangaList ? dedupeByMalId(mangaList) : null;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl drop-shadow-md">{title}</h1>
          <p className="text-sm font-medium text-white/50">
            {type === "anime"
              ? "Explore the ultimate anime collection"
              : "Discover the latest chapters and top-rated manga"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          <Link
            href={`/browse?type=anime${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              type === "anime" && !isPopularView
                ? "bg-accent text-white shadow-[0_0_15px_rgba(255,26,26,0.4)] hover:shadow-[0_0_20px_rgba(255,26,26,0.6)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Anime Tracker
          </Link>
          <Link
            href={`/browse?type=manga${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              type === "manga"
                ? "bg-accent text-white shadow-[0_0_15px_rgba(255,26,26,0.4)] hover:shadow-[0_0_20px_rgba(255,26,26,0.6)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Manga Vault
          </Link>
          <Link
            href={`/browse?type=anime&sort=popular${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              isPopularView && type === "anime"
                ? "bg-accent text-white shadow-[0_0_15px_rgba(255,26,26,0.4)] hover:shadow-[0_0_20px_rgba(255,26,26,0.6)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Trending Now
          </Link>
        </div>
      </div>

      {type === "anime" && animeDeduped && (
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
          {animeDeduped.map((a) => {
            const src = a.image?.trim() ?? "";
            const name = a.title;
            return (
              <li key={a.id}>
                <Link
                  href={animeDetailHref(a.id)}
                  className="group block overflow-hidden rounded-3xl border border-white/5 bg-surface transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_10px_30px_-5px_rgba(255,26,26,0.4)]"
                >
                  <div className="relative aspect-[2/3] w-full min-h-[220px] sm:min-h-[260px] md:min-h-[280px]">
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 240px"
                        unoptimized={streamingPosterUnoptimized(src)}
                      />
                    ) : (
                      <div className="h-full min-h-[220px] bg-surface-2" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 opacity-100 transition-transform duration-300 group-hover:-translate-y-1">
                      <p className="line-clamp-2 text-left text-sm font-bold leading-snug tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-base">
                        {name}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {type === "manga" && mangaDeduped && (
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {mangaDeduped.map((m) => {
            const src = pickAnimeImage(m.images);
            const name = m.title_english || m.title;
            return (
              <li key={m.mal_id}>
                <Link
                  href={`/manga/${m.mal_id}`}
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-surface transition-smooth hover:border-accent/35"
                >
                  <div className="relative aspect-[2/3]">
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width:640px) 50vw, 160px"
                        unoptimized={malImageShouldSkipOptimization(src)}
                      />
                    ) : (
                      <div className="h-full bg-surface-2" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-xs font-semibold text-foreground">{name}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function BrowseFallback() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
      <Skeleton className="mb-8 h-10 w-64" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full" />
        ))}
      </div>
    </div>
  );
}

export default function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<BrowseFallback />}>
      <BrowseWrapper searchParams={searchParams} />
    </Suspense>
  );
}

async function BrowseWrapper({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return <BrowseResults sp={sp} />;
}
