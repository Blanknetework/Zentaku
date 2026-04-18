const BASE = "https://api.mangadex.org";

const init: RequestInit & { next?: { revalidate: number } } = {
  next: { revalidate: 120 },
  headers: { Accept: "application/json" },
};

export class MangaDexError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "MangaDexError";
    this.status = status;
  }
}

async function mdJson<T>(path: string, retries = 3, delay = 1000): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (res.status === 429 && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return mdJson<T>(path, retries - 1, delay * 2);
  }
  if (!res.ok) {
    throw new MangaDexError(`MangaDex request failed (${res.status})`, res.status);
  }
  return res.json() as Promise<T>;
}

export type MangaDexChapterSummary = {
  id: string;
  attributes: {
    chapter: string | null;
    title: string | null;
    pages: number;
  };
};

function mangaDexTitle(attr: {
  title: Record<string, string> | string | null;
}): string {
  const t = attr.title;
  if (typeof t === "string") return t;
  if (!t) return "";
  return t.en ?? t["ja-ro"] ?? Object.values(t)[0] ?? "";
}

export async function searchMangaByTitle(title: string) {
  const q = encodeURIComponent(title.slice(0, 120));
  const json = await mdJson<{
    data: { id: string; attributes: { title: Record<string, string> } }[];
  }>(`/manga?title=${q}&limit=5&contentRating[]=safe&contentRating[]=suggestive`);
  return json.data.map((d) => ({
    id: d.id,
    title: mangaDexTitle(d.attributes),
  }));
}

export async function getMangaChapters(mangaDexMangaId: string, limit = 100) {
  const json = await mdJson<{
    data: MangaDexChapterSummary[];
  }>(
    `/manga/${mangaDexMangaId}/feed?limit=${limit}&translatedLanguage[]=en&order[chapter]=asc&order[volume]=asc`,
  );
  return json.data;
}

export async function getAdjacentChapterIds(
  mangaDexMangaId: string,
  currentChapterId: string,
) {
  const chapters = await getMangaChapters(mangaDexMangaId, 500);
  const idx = chapters.findIndex((c) => c.id === currentChapterId);
  if (idx === -1) return { prev: null as string | null, next: null as string | null };
  return {
    prev: chapters[idx - 1]?.id ?? null,
    next: chapters[idx + 1]?.id ?? null,
  };
}

export type ChapterPageUrls = {
  urls: string[];
  chapterTitle: string | null;
};

export async function getChapterPageUrls(chapterId: string): Promise<ChapterPageUrls> {
  const [chapterRes, serverRes] = await Promise.all([
    fetch(`${BASE}/chapter/${chapterId}?includes[]=scanlation_group`, {
      ...init,
      next: { revalidate: 60 },
    }),
    fetch(`${BASE}/at-home/server/${chapterId}`, {
      ...init,
      next: { revalidate: 60 },
    }),
  ]);

  if (!chapterRes.ok) {
    throw new MangaDexError("Chapter not found", chapterRes.status);
  }
  if (!serverRes.ok) {
    throw new MangaDexError("Chapter images unavailable", serverRes.status);
  }

  const chapterJson = (await chapterRes.json()) as {
    data: {
      attributes: { title: string | null; chapter: string | null };
    };
  };
  const serverJson = (await serverRes.json()) as {
    baseUrl: string;
    chapter: { hash: string; data: string[] };
  };

  const { baseUrl, chapter } = serverJson;
  const urls = chapter.data.map(
    (filename) => `${baseUrl}/data/${chapter.hash}/${filename}`,
  );

  return {
    urls,
    chapterTitle:
      chapterJson.data.attributes.title ??
      (chapterJson.data.attributes.chapter
        ? `Chapter ${chapterJson.data.attributes.chapter}`
        : null),
  };
}
