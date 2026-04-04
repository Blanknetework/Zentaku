import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/components/ApiError";
import {
  getChapterPageUrls,
  getAdjacentChapterIds,
  MangaDexError,
} from "@/lib/mangadex";

type Props = {
  params: Promise<{ chapterId: string }>;
  searchParams: Promise<{ md?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { chapterId } = await params;
  return { title: `Chapter ${chapterId.slice(0, 8)}…` };
}

export default async function MangaReaderPage({ params, searchParams }: Props) {
  const { chapterId } = await params;
  const sp = await searchParams;
  const mdMangaId = sp.md ?? "";

  if (!chapterId || chapterId.length < 10) notFound();

  let pages;
  try {
    pages = await getChapterPageUrls(chapterId);
  } catch (err) {
    if (err instanceof MangaDexError && err.status === 404) notFound();
    const message = err instanceof MangaDexError ? err.message : "Failed to load chapter.";
    const status = err instanceof MangaDexError ? err.status : undefined;
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ApiError message={message} status={status} />
      </div>
    );
  }

  let prev: string | null = null;
  let next: string | null = null;
  if (mdMangaId && mdMangaId.length >= 10) {
    try {
      const adj = await getAdjacentChapterIds(mdMangaId, chapterId);
      prev = adj.prev;
      next = adj.next;
    } catch {
      /* ignore nav errors */
    }
  }

  const q = mdMangaId ? `?md=${encodeURIComponent(mdMangaId)}` : "";

  return (
    <div className="min-h-screen bg-[#050505]">
      <header className="sticky top-16 z-30 border-b border-white/10 bg-black/85 backdrop-blur-xl md:top-[4.25rem]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/browse?type=manga"
            className="text-sm font-semibold text-muted transition-smooth hover:text-accent"
          >
            ← Library
          </Link>
          <h1 className="max-w-[min(100%,280px)] truncate text-center text-sm font-semibold text-foreground">
            {pages.chapterTitle ?? "Reader"}
          </h1>
          <div className="flex gap-2">
            {prev ? (
              <Link
                href={`/read/${prev}${q}`}
                className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-semibold transition-smooth hover:border-accent/40"
              >
                Prev
              </Link>
            ) : (
              <span className="rounded-xl border border-white/5 px-3 py-1.5 text-xs text-muted/50">
                Prev
              </span>
            )}
            {next ? (
              <Link
                href={`/read/${next}${q}`}
                className="rounded-xl bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-smooth hover:bg-red-600"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-xl border border-white/5 px-3 py-1.5 text-xs text-muted/50">
                Next
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-2 py-6 sm:px-4">
        <div className="space-y-0 rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
          {pages.urls.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={`Page ${i + 1}`}
              className="block w-full h-auto"
              loading={i < 2 ? "eager" : "lazy"}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-3 pb-24">
          {prev && (
            <Link
              href={`/read/${prev}${q}`}
              className="rounded-xl border border-white/15 px-6 py-2 text-sm font-semibold transition-smooth hover:border-accent/40"
            >
              Previous chapter
            </Link>
          )}
          {next && (
            <Link
              href={`/read/${next}${q}`}
              className="rounded-xl bg-accent px-6 py-2 text-sm font-semibold text-white glow-red hover:bg-red-600"
            >
              Next chapter
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
