import Link from "next/link";
import type { AnimeKaiListItem } from "@/lib/animekai";
import type { JikanMangaListEntry } from "@/lib/types";
import { animeDetailHref } from "@/lib/anime-path";

type Props = {
  anime: AnimeKaiListItem[];
  manga: JikanMangaListEntry[];
};

export function TrendingPanels({ anime, manga }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:min-w-[280px] lg:max-w-[320px]">
      <Panel
        title="Trending Anime"
        href="/browse?type=anime&sort=popular"
        items={anime.slice(0, 5).map((a, i) => ({
          rank: i + 1,
          title: a.title,
          href: animeDetailHref(a.id),
        }))}
      />
      <Panel
        title="Latest Manga"
        href="/browse?type=manga"
        items={manga.slice(0, 5).map((m, i) => ({
          rank: i + 1,
          title: m.title_english || m.title,
          href: `/manga/${m.mal_id}`,
        }))}
      />
    </div>
  );
}

function Panel({
  title,
  href,
  items,
}: {
  title: string;
  href: string;
  items: { rank: number; title: string; href: string }[];
}) {
  return (
    <div className="glass rounded-3xl p-6 transition-all hover:border-accent/30 hover:shadow-2xl">
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-white/90">{title}</h2>
      </div>
      <ol className="space-y-3">
        {items.map((item) => (
          <li key={`${item.rank}-${item.href}`}>
            <Link
              href={item.href}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-transparent p-3 transition-all hover:border-white/10 hover:bg-white/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 font-display text-xl font-bold text-accent shadow-inner transition-colors group-hover:bg-accent group-hover:text-white">
                {item.rank}
              </span>
              <span className="line-clamp-2 text-sm font-semibold text-white/70 transition-colors group-hover:text-white">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <Link
        href={href}
        className="mt-5 block text-center text-xs font-bold uppercase tracking-widest text-accent/80 transition-colors hover:text-accent"
      >
        View All →
      </Link>
    </div>
  );
}
