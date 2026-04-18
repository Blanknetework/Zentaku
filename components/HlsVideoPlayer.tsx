"use client";

import { useEffect, useRef, useState } from "react";

type WatchJson = {
  headers?: Record<string, string>;
  sources: { url: string; quality: string; isM3U8: boolean; isIframe?: boolean }[];
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
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState(category);

  useEffect(() => {
    const video = videoRef.current;
    if (!episodeId) return;

    let cancelled = false;
    setError(null);
    setLoading(true);
    setIframeUrl(null);
    if (video) {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.removeAttribute("src");
      video.load();
    }

    const run = async () => {
      try {
        const qs = new URLSearchParams({
          episodeId,
          category: activeCategory,
        });
        const res = await fetch(`/api/animekai/watch?${qs}`);
        const body = (await res.json()) as WatchJson & { error?: string };
        if (!res.ok) {
          throw new Error(body.error ?? "Stream lookup failed");
        }
        if (cancelled) return;

        const src = pickSource(body);
        if (!src?.url) throw new Error("No playable source returned");

        if (src.isIframe) {
          setIframeUrl(src.url);
          setLoading(false);
          return;
        }

        if (!video) return;

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
  }, [episodeId, activeCategory]);

  return (
    <div className="space-y-3">
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
        {iframeUrl && !error ? (
          <iframe
            src={iframeUrl}
            className="absolute inset-0 h-full w-full border-none z-0"
            allowFullScreen
          />
        ) : null}
        <video
          ref={videoRef}
          className={`h-full w-full ${iframeUrl ? "hidden" : ""}`}
          controls
          playsInline
          poster={poster}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-surface/50 p-3 sm:flex-row sm:items-center sm:justify-start">

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Audio:</span>
          <div className="flex flex-wrap gap-2">
            {["sub", "dub", "raw"].map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase transition-all ${
                  activeCategory === c
                    ? "bg-accent text-white shadow-[0_0_10px_rgba(255,26,26,0.3)]"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
