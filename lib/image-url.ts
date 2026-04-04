import type { JikanImage, JikanMangaListEntry } from "./types";

/** Prefer CDN host so URLs match typical MAL delivery and avoid odd DNS paths in dev. */
export function normalizeMalImageUrl(url: string): string {
  if (!url) return url;
  const u = url.replace(/^http:\/\//i, "https://");
  try {
    const parsed = new URL(u);
    if (parsed.hostname === "myanimelist.net" && parsed.pathname.startsWith("/images/")) {
      parsed.hostname = "cdn.myanimelist.net";
      return parsed.toString();
    }
  } catch {
    /* ignore */
  }
  return u;
}

/**
 * Next.js image optimization fetches remotes on the server; some MAL hostnames resolve in ways
 * that trigger SSRF-style "private IP" blocks. Skip optimization for MAL hosts (browser loads directly).
 */
export function malImageShouldSkipOptimization(url: string): boolean {
  if (!url) return true;
  return /myanimelist\.net/i.test(url);
}

/** Remote catalog posters (e.g. AnimeKai) — optimize on the edge can fail for arbitrary CDNs. */
export function streamingPosterUnoptimized(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function pickAnimeImage(images: JikanMangaListEntry["images"]): string {
  const raw =
    images.webp.large_image_url ||
    images.jpg.large_image_url ||
    images.webp.image_url ||
    images.jpg.image_url;
  return normalizeMalImageUrl(raw?.replace(/^http:\/\//i, "https://") ?? "");
}

export function pickJpgLarge(jpg: JikanImage): string {
  const raw = jpg.large_image_url || jpg.image_url;
  return normalizeMalImageUrl(raw?.replace(/^http:\/\//i, "https://") ?? "");
}
