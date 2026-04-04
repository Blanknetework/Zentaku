import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/components/ApiError";
import { animeIdFromParam, animeWatchHref } from "@/lib/anime-path";
import { streamingPosterUnoptimized } from "@/lib/image-url";
import { animeKaiInfo, AnimeKaiError } from "@/lib/animekai";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const slug = animeIdFromParam(id);
  if (!slug) return { title: "Anime" };
  try {
    const anime = await animeKaiInfo(slug);
    return { title: anime.title };
  } catch {
    return { title: "Anime" };
  }
}

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;
  const slug = animeIdFromParam(id);
  if (!slug) notFound();

  let anime;
  try {
    anime = await animeKaiInfo(slug);
  } catch (err) {
    if (err instanceof AnimeKaiError && err.status === 404) notFound();
    const message = err instanceof AnimeKaiError ? err.message : "Failed to load anime.";
    const status = err instanceof AnimeKaiError ? err.status : undefined;
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ApiError message={message} status={status} />
      </div>
    );
  }

  if (!anime.title && !anime.episodes?.length) notFound();

  const poster = anime.image?.trim() ?? "";
  const title = anime.title;
  const synopsis =
    anime.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "";

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 lg:px-8">
      {/* Anime Info Section */}
      <div className="flex flex-col gap-10 md:flex-row md:items-start">
        {/* Poster Container */}
        <div className="mx-auto w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl glow-red md:mx-0">
          <div className="relative aspect-[2/3] w-full">
            {poster ? (
              <Image
                src={poster}
                alt={title || "Anime Poster"}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 280px"
                priority
                unoptimized={streamingPosterUnoptimized(poster)}
              />
            ) : (
              <div className="h-full w-full bg-surface-2 flex items-center justify-center text-muted">No Image</div>
            )}
          </div>
        </div>

        {/* Details Container */}
        <div className="min-w-0 flex-1 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-accent/90">Anime</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {anime.genres
              ?.filter((g) => g.length < 25 && !g.includes(":"))
              .map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md transition-colors hover:bg-white/10"
                >
                  {g}
                </span>
              ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/70">
            {anime.type && <span className="bg-surface-2 px-2 py-1 rounded-md">{anime.type}</span>}
            {anime.status && <span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${anime.status.toLowerCase() === 'completed' ? 'bg-green-500' : 'bg-accent'}`}></span>{anime.status}</span>}
            {anime.totalEpisodes != null && anime.totalEpisodes > 0 && <span>{anime.totalEpisodes} Episodes</span>}
            {anime.subOrDub && <span className="uppercase border border-white/20 px-2 py-0.5 rounded text-xs">{anime.subOrDub}</span>}
          </div>

          <div className="prose prose-invert max-w-4xl text-sm leading-8 text-white/80 md:text-base">
            <p>{synopsis || "No synopsis available for this title."}</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href={animeWatchHref(anime.id)}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:scale-105 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              Watch Now
            </Link>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      {anime.episodes && anime.episodes.length > 0 && (
        <div className="mt-20">
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Episodes <span className="ml-2 text-lg font-medium text-muted">({anime.episodes.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {anime.episodes.map((ep) => (
              <Link
                key={ep.id}
                href={animeWatchHref(anime.id, ep.number)}
                className="group flex items-center gap-4 rounded-xl border border-white/5 bg-surface p-4 transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-white/5 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-2 font-display text-lg font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  {ep.number}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white/90 group-hover:text-white">
                    {ep.title && ep.title !== `Episode ${ep.number}` ? ep.title : `Episode ${ep.number}`}
                  </p>
                  <p className="text-xs text-muted mt-1">Subbed</p>
                </div>
                <svg className="h-5 w-5 shrink-0 text-white/20 transition-colors group-hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
