import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/components/ApiError";
import { HlsVideoPlayer } from "@/components/HlsVideoPlayer";
import { EpisodeSidebar } from "@/components/EpisodeSidebar";
import { CommentsSection } from "@/components/CommentsSection";
import { animeIdFromParam, animeDetailHref } from "@/lib/anime-path";
import { animeKaiInfo, AnimeKaiError } from "@/lib/animekai";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const slug = animeIdFromParam(id);
  if (!slug) return { title: "Watch" };
  try {
    const anime = await animeKaiInfo(slug);
    return { title: `Watch · ${anime.title}` };
  } catch {
    return { title: "Watch" };
  }
}

export default async function WatchPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const slug = animeIdFromParam(id);
  if (!slug) notFound();

  let anime;
  try {
    anime = await animeKaiInfo(slug);
  } catch (err) {
    if (err instanceof AnimeKaiError && err.status === 404) notFound();
    const message = err instanceof AnimeKaiError ? err.message : "Failed to load.";
    const status = err instanceof AnimeKaiError ? err.status : undefined;
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ApiError message={message} status={status} />
      </div>
    );
  }

  const episodes = [...(anime.episodes ?? [])].sort((a, b) => a.number - b.number);
  const epParam = Number(sp.ep);
  const currentEp =
    Number.isFinite(epParam) && epParam > 0 ? epParam : episodes[0]?.number ?? 1;
  const currentEpisode = episodes.find((e) => e.number === currentEp) ?? episodes[0];
  const poster = anime.image?.trim() ?? "";
  const title = anime.title;
  const episodeLabel =
    currentEpisode?.title != null
      ? `E${currentEp} · ${currentEpisode.title}`
      : `Episode ${currentEp}`;

  const synopsis =
    anime.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ?? "";

  if (!currentEpisode?.id) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ApiError message="No episodes available for this title." />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/" className="transition-smooth hover:text-accent">
          Home
        </Link>
        <span>/</span>
        <Link href={animeDetailHref(anime.id)} className="transition-smooth hover:text-accent">
          {title}
        </Link>
        <span>/</span>
        <span className="text-foreground">Watch</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="min-w-0 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{episodeLabel}</p>
            <HlsVideoPlayer episodeId={currentEpisode.id} poster={poster || undefined} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted">
              {synopsis.slice(0, 320)}
              {synopsis.length > 320 ? "…" : ""}
            </p>
            <Link
              href={animeDetailHref(anime.id)}
              className="mt-3 inline-block text-sm font-semibold text-accent hover:text-red-400"
            >
              Full details →
            </Link>
          </div>
        </div>

        <EpisodeSidebar animeId={anime.id} episodes={episodes} currentEp={currentEp} />
      </div>

      <CommentsSection />
    </main>
  );
}
