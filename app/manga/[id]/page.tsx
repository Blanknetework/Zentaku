import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/components/ApiError";
import { malImageShouldSkipOptimization, pickJpgLarge } from "@/lib/image-url";
import { getMangaById, JikanError } from "@/lib/jikan";
import { searchMangaByTitle, getMangaChapters, MangaDexError } from "@/lib/mangadex";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const malId = Number(id);
  if (!Number.isFinite(malId)) return { title: "Manga" };
  try {
    const manga = await getMangaById(malId);
    return { title: manga.title_english || manga.title };
  } catch {
    return { title: "Manga" };
  }
}

export default async function MangaDetailPage({ params }: Props) {
  const { id } = await params;
  const malId = Number(id);
  if (!Number.isFinite(malId)) notFound();

  let manga;
  try {
    manga = await getMangaById(malId);
  } catch (err) {
    if (err instanceof JikanError && err.status === 404) notFound();
    const message = err instanceof JikanError ? err.message : "Failed to load manga.";
    const status = err instanceof JikanError ? err.status : undefined;
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ApiError message={message} status={status} />
      </div>
    );
  }

  const title = manga.title_english || manga.title;
  const poster = pickJpgLarge(manga.images.jpg);

  let mdId: string | null = null;
  let chapters: { id: string; label: string }[] = [];
  try {
    const found = await searchMangaByTitle(title);
    mdId = found[0]?.id ?? null;
    if (mdId) {
      const raw = await getMangaChapters(mdId, 80);
      chapters = raw.map((c) => ({
        id: c.id,
        label:
          c.attributes.title?.trim() ||
          (c.attributes.chapter != null ? `Ch. ${c.attributes.chapter}` : "Chapter"),
      }));
    }
  } catch (err) {
    if (err instanceof MangaDexError && err.status !== 404) {
      /* optional chapters */
    }
  }
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-start">
        <div className="mx-auto w-full max-w-[300px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl transition-all md:mx-0">
          <div className="relative aspect-[2/3] w-full">
            {poster ? (
              <Image
                src={poster}
                alt=""
                fill
                className="object-cover"
                sizes="300px"
                priority
                unoptimized={malImageShouldSkipOptimization(poster)}
              />
            ) : (
              <div className="h-full bg-surface-2" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <p className="mb-3 w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent backdrop-blur-md border border-accent/30 shadow-[0_0_15px_rgba(255,26,26,0.2)]">
              Manga Vault
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">{title}</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {manga.genres?.map((g) => (
              <span
                key={g.mal_id}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-semibold tracking-wide text-white/60">
            {manga.score != null && <span className="flex items-center gap-1.5"><span className="text-yellow-400">★</span> {manga.score} Score</span>}
            {manga.chapters != null && <span>• {manga.chapters} Chapters</span>}
            {manga.volumes != null && <span>• {manga.volumes} Volumes</span>}
          </div>

          <p className="max-w-4xl text-sm leading-relaxed text-slate-300 md:text-base selection:bg-accent/40">
            {manga.synopsis?.replace(/\r?\n\[Written by MAL Rewrite\]/i, "").trim() ||
              "No synopsis available."}
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-wider text-white drop-shadow-md">Available Chapters</h2>
        {!mdId && (
          <div className="rounded-3xl border border-white/5 bg-surface-2/40 p-10 text-center backdrop-blur-sm">
            <p className="text-sm font-medium text-white/60">
              No matching chapters found on MangaDex for this title. Try another series or check back later!
            </p>
          </div>
        )}
        {mdId && chapters.length === 0 && (
          <div className="rounded-3xl border border-white/5 bg-surface-2/40 p-10 text-center backdrop-blur-sm">
            <p className="text-sm font-medium text-white/60">No English chapters listed yet.</p>
          </div>
        )}
        {mdId && chapters.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {chapters.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/read/${c.id}?md=${mdId}`}
                  className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 text-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/10 hover:shadow-[0_8px_20px_-6px_rgba(255,26,26,0.3)] backdrop-blur-sm"
                >
                  <span className="line-clamp-1 font-bold text-white/80 transition-colors group-hover:text-white">{c.label}</span>
                  <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-accent transition-transform group-hover:translate-x-1">Read →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
