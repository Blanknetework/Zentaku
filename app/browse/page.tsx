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
  type: "anime" | "manga" | "both";
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
  const popular = sp.sort === "popular";
  let type: "anime" | "manga" | "both" = "anime";
  
  if (sp.type === "manga") type = "manga";
  else if (sp.type === "anime") type = "anime";
  else if (popular) type = "both";

  const q = (sp.q ?? "").trim();

  let animeList: AnimeKaiListItem[] | null = null;
  let mangaList: JikanMangaListEntry[] | null = null;

  if (type === "anime" || type === "both") {
    if (q) {
      const page = await animeKaiSearch(q);
      animeList = page.results;
    } else if (popular) {
      animeList = await animeKaiPopular(1, 24);
    } else {
      animeList = await animeKaiTopAiring(1, 24);
    }
  }
  
  if (type === "manga" || type === "both") {
    if (q) mangaList = await searchManga(q, 24);
    else mangaList = await getTopManga(24);
  }

  const title =
    q !== ""
      ? `Results for “${q}”`
      : popular
        ? "Trending Now"
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
            {type === "both" 
              ? "Discover the hottest anime and manga"
              : type === "anime"
                ? "Explore the ultimate anime collection"
                : "Discover the latest chapters and top-rated manga"}
          </p>
        </div>
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          <form action="/browse" className="relative group w-full sm:w-72 md:w-80 lg:w-96">
            <input type="hidden" name="type" value={type} />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-accent">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder={type === "both" ? "Search..." : `Search ${type}...`}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-accent/40 focus:bg-white/10 focus:ring-2 focus:ring-accent/20"
            />
          </form>
        </div>
      </div>

      {(type === "anime" || type === "both") && animeDeduped && (
        <div className="mb-12">
          {type === "both" && <h2 className="mb-6 font-display text-2xl font-bold text-white">Trending Anime</h2>}
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
        </div>
      )}

      {(type === "manga" || type === "both") && mangaDeduped && (
        <div>
          {type === "both" && <h2 className="mb-6 font-display text-2xl font-bold text-white">Trending Manga</h2>}
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
        </div>
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
