import Link from "next/link";
import type { AnimeKaiEpisode } from "@/lib/animekai";
import { animeWatchHref } from "@/lib/anime-path";

type Props = {
  animeId: string;
  episodes: AnimeKaiEpisode[];
  currentEp: number;
};

export function EpisodeSidebar({ animeId, episodes, currentEp }: Props) {
  return (
    <aside className="glass max-h-[min(70vh,520px)] overflow-hidden rounded-2xl border border-white/10">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Episodes</h2>
        <p className="mt-1 text-xs text-muted">{episodes.length} available</p>
      </div>
      <ol className="max-h-[min(60vh,460px)] space-y-1 overflow-y-auto p-2">
        {episodes.map((ep) => {
          const num = ep.number;
          const active = num === currentEp;
          return (
            <li key={`${animeId}-ep-${ep.id}`}>
              <Link
                href={animeWatchHref(animeId, num)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-smooth ${
                  active
                    ? "bg-accent/20 text-accent ring-1 ring-accent/40"
                    : "text-muted hover:bg-white/[0.06] hover:text-foreground"
                }`}
              >
                <span className="font-mono text-xs tabular-nums opacity-70">
                  {String(num).padStart(2, "0")}
                </span>
                <span className="line-clamp-2 flex-1">{ep.title || `Episode ${num}`}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
