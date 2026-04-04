import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { TrendingPanels } from "@/components/TrendingPanels";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { MangaUpdatesRow } from "@/components/MangaUpdatesRow";
import { ApiError } from "@/components/ApiError";
import {
  HeroSkeleton,
  TrendingPanelSkeleton,
  CardRowSkeleton,
  MangaCardSkeleton,
} from "@/components/skeletons";
import { getTopManga, getRecentMangaUpdates, JikanError } from "@/lib/jikan";
import {
  AnimeKaiError,
  animeKaiRecent,
  animeKaiTopAiring,
} from "@/lib/animekai";
import { dedupeById, dedupeByMalId } from "@/lib/lists";

function catalogError(err: unknown) {
  if (err instanceof AnimeKaiError || err instanceof JikanError) {
    return { message: err.message, status: err.status };
  }
  return { message: "Failed to load catalog.", status: undefined as number | undefined };
}

async function HomeData() {
  let topAiring;
  let topManga;
  let mangaRow;
  let recentAnime;
  try {
    [topAiring, topManga, mangaRow, recentAnime] = await Promise.all([
      animeKaiTopAiring(1, 12),
      getTopManga(8),
      getRecentMangaUpdates(15),
      animeKaiRecent(1, 12),
    ]);
  } catch (err) {
    const { message, status } = catalogError(err);
    return (
      <div className="mx-auto max-w-lg py-16">
        <ApiError message={message} status={status} />
      </div>
    );
  }

  const topAiringU = dedupeById(topAiring);
  const topMangaU = dedupeByMalId(topManga);
  const mangaRowU = dedupeByMalId(mangaRow);
  const recentAnimeU = dedupeById(recentAnime);

  const heroFeatured = topAiringU[0] ?? recentAnimeU[0] ?? null;
  const featuredCarousel = recentAnimeU.length ? recentAnimeU : topAiringU;

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-4 lg:px-8 lg:pt-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Main Left Column */}
          <div className="min-w-0 flex-1 flex flex-col gap-12">
            <Hero featured={heroFeatured} />
            <FeaturedCarousel items={featuredCarousel} />
            <MangaUpdatesRow items={mangaRowU} />
          </div>
          
          {/* Right Sidebar */}
          <div className="w-full shrink-0 lg:w-[320px] xl:w-[360px]">
            <TrendingPanels anime={topAiringU} manga={topMangaU} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-4 lg:px-8 lg:pt-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Main Left Column Skeleton */}
            <div className="min-w-0 flex-1 flex flex-col gap-12">
              <HeroSkeleton />
              <CardRowSkeleton />
              <MangaCardSkeleton />
            </div>
            {/* Right Sidebar Skeleton */}
            <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[320px] xl:w-[360px]">
              <TrendingPanelSkeleton />
              <TrendingPanelSkeleton />
            </div>
          </div>
        </div>
      }
    >
      <HomeData />
    </Suspense>
  );
}
