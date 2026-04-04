"use client";

import { useMemo } from "react";

type Props = {
  embedUrl: string | null;
  youtubeId: string | null;
  poster?: string;
  title: string;
  episodeLabel?: string;
};

export function VideoPlayer({
  embedUrl,
  youtubeId,
  poster,
  title,
  episodeLabel,
}: Props) {
  const src = useMemo(() => {
    if (embedUrl) {
      const u = embedUrl.replace("http://", "https://");
      if (u.includes("youtube.com/embed")) return u.split("?")[0] + "?rel=0";
      return u;
    }
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    }
    return null;
  }, [embedUrl, youtubeId]);

  if (src) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black glow-red">
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {episodeLabel && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
            {episodeLabel}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-accent-deep/50 to-black"
      style={
        poster
          ? {
              backgroundImage: `linear-gradient(to top,rgba(0,0,0,.85),transparent), url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="text-center px-6">
        <p className="text-sm font-semibold text-white">{title}</p>
        {episodeLabel && (
          <p className="mt-1 text-xs text-muted">{episodeLabel}</p>
        )}
        <p className="mt-4 text-sm text-muted">
          Trailer not available — select another series or check back later.
        </p>
      </div>
    </div>
  );
}
