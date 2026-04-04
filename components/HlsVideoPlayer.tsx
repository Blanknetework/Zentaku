"use client";

import { useEffect, useRef, useState } from "react";

type WatchJson = {
  headers?: Record<string, string>;
  sources: { url: string; quality: string; isM3U8: boolean }[];
};

function pickSource(data: WatchJson) {
  const list = data.sources ?? [];
  return (
    list.find((s) => s.quality === "default") ??
    list.find((s) => s.isM3U8) ??
    list[0]
  );
}

export function HlsVideoPlayer({
  episodeId,
  poster,
  server = "vidstreaming",
  category = "sub",
}: {
  episodeId: string;
  poster?: string;
  server?: string;
  category?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !episodeId) return;

    let cancelled = false;
    setError(null);
    setLoading(true);
    hlsRef.current?.destroy();
    hlsRef.current = null;
    video.removeAttribute("src");
    video.load();

    const run = async () => {
      try {
        const qs = new URLSearchParams({
          episodeId,
          server,
          category,
        });
        const res = await fetch(`/api/animekai/watch?${qs}`);
        const body = (await res.json()) as WatchJson & { error?: string };
        if (!res.ok) {
          throw new Error(body.error ?? "Stream lookup failed");
        }
        if (cancelled) return;

        const src = pickSource(body);
        if (!src?.url) throw new Error("No playable source returned");

        if (src.isM3U8 && video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src.url;
          setLoading(false);
          return;
        }

        if (src.isM3U8) {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup(xhr) {
                const h = body.headers;
                if (!h) return;
                for (const [k, v] of Object.entries(h)) {
                  try {
                    xhr.setRequestHeader(k, v);
                  } catch {
                    /* browser may block some header names */
                  }
                }
              },
            });
            hls.loadSource(src.url);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, (_, data) => {
              if (data.fatal) setError("Playback failed");
            });
            hlsRef.current = hls;
            setLoading(false);
            return;
          }
        }

        video.src = src.url;
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [episodeId, server, category]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-sm text-white">
          Loading stream…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 px-4 text-center text-sm text-red-200">
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        playsInline
        poster={poster}
      />
    </div>
  );
}
