import type { JikanMangaListEntry, JikanPagination } from "./types";

const BASE = "https://api.jikan.moe/v4";

const defaultInit: RequestInit & { next?: { revalidate: number } } = {
  next: { revalidate: 300 },
  headers: { Accept: "application/json" },
};

export class JikanError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "JikanError";
    this.status = status;
  }
}

async function jikanJson<T>(path: string, retries = 3, delay = 1000): Promise<T> {
  const res = await fetch(`${BASE}${path}`, defaultInit);
  if (res.status === 429 && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return jikanJson<T>(path, retries - 1, delay * 2);
  }
  if (res.status === 429) {
    throw new JikanError("Rate limited. Please try again shortly.", 429);
  }
  if (!res.ok) {
    throw new JikanError(`Request failed (${res.status})`, res.status);
  }
  return res.json() as Promise<T>;
}

export async function getTopManga(limit = 10) {
  const json = await jikanJson<JikanPagination<JikanMangaListEntry[]>>(
    `/top/manga?limit=${limit}`,
  );
  return json.data;
}

export async function getRecentMangaUpdates(limit = 12) {
  const json = await jikanJson<JikanPagination<JikanMangaListEntry[]>>(
    `/manga?status=publishing&order_by=members&sort=desc&limit=${limit}`,
  );
  return json.data;
}

export async function searchManga(query: string, limit = 20) {
  const q = encodeURIComponent(query);
  const json = await jikanJson<JikanPagination<JikanMangaListEntry[]>>(
    `/manga?q=${q}&limit=${limit}`,
  );
  return json.data;
}

export async function getMangaById(id: number) {
  const json = await jikanJson<{
    data: JikanMangaListEntry & {
      synopsis: string | null;
      genres: { mal_id: number; name: string }[];
      chapters: number | null;
      volumes: number | null;
    };
  }>(`/manga/${id}/full`);
  return json.data;
}
