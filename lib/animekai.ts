import { ANIME } from "@consumet/extensions";

const animekai = new ANIME.AnimeKai();

export class AnimeKaiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "AnimeKaiError";
    this.status = status;
  }
}

export type AnimeKaiListItem = {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate?: string;
  subOrDub?: string;
};

export type AnimeKaiSearchPage = {
  currentPage: number;
  hasNextPage: boolean;
  results: AnimeKaiListItem[];
};

export type AnimeKaiEpisode = {
  id: string;
  number: number;
  title: string;
  url: string;
};

export type AnimeKaiInfo = {
  id: string;
  title: string;
  url: string;
  image: string;
  description: string;
  genres: string[];
  subOrDub: string;
  type: string;
  status: string;
  otherName?: string;
  totalEpisodes: number;
  episodes: AnimeKaiEpisode[];
};

export type AnimeKaiWatchSource = {
  url: string;
  quality: string;
  isM3U8: boolean;
};

export type AnimeKaiWatchResult = {
  headers?: Record<string, string>;
  sources: AnimeKaiWatchSource[];
  download?: string;
};

function parseAnimeItem(r: any): AnimeKaiListItem {
  return {
    id: r.id,
    title: typeof r.title === "string" ? r.title : r.title?.english || r.title?.romaji || r.title?.native || "Unknown",
    url: r.url,
    image: r.image,
    releaseDate: r.releaseDate,
    subOrDub: r.sub || r.dub ? "sub" : undefined
  };
}

export async function animeKaiSearch(query: string, page = 1): Promise<AnimeKaiSearchPage> {
  const q = query.trim() || "a";
  const searchResult = await animekai.search(q, page);
  return {
    currentPage: searchResult.currentPage || page,
    hasNextPage: searchResult.hasNextPage || false,
    results: (searchResult.results || []).map(parseAnimeItem)
  };
}

export async function animeKaiInfo(id: string): Promise<AnimeKaiInfo> {
  const info = await animekai.fetchAnimeInfo(id);
  return {
    id: info.id,
    title: info.title.toString(),
    url: info.url || "",
    image: info.image || "",
    description: info.description || "",
    genres: info.genres || [],
    subOrDub: info.subOrDub || "sub",
    type: info.type || "TV",
    status: info.status || "Completed",
    otherName: info.japaneseTitle || undefined,
    totalEpisodes: info.episodes?.length || 0,
    episodes: (info.episodes || []).map((ep: any) => ({
      id: ep.id,
      number: ep.number,
      title: ep.title || `Episode ${ep.number}`,
      url: ep.url || ""
    }))
  };
}

export async function animeKaiWatch(
  episodeId: string,
  server = "vidstreaming",
  category = "sub",
): Promise<AnimeKaiWatchResult> {
  const src = await animekai.fetchEpisodeSources(episodeId, server as any, category as any);
  return {
    headers: src.headers,
    sources: (src.sources || []).map((s: any) => ({
      url: s.url,
      quality: s.quality,
      isM3U8: s.isM3U8
    })),
    download: Array.isArray(src.download) ? src.download[0]?.url : (typeof src.download === "string" ? src.download : undefined)
  };
}

export async function animeKaiAdvancedSearch(
  params: Record<string, string | number | undefined>,
): Promise<AnimeKaiSearchPage> {
  // Mapping advanced search to basic search since AnimeKai has limited sorting options out-the-box
  const query = String(params.keyword || params.q || "a");
  return animeKaiSearch(query, Number(params.page || 1));
}

export async function animeKaiPopular(page = 1, limitSlice = 24): Promise<AnimeKaiListItem[]> {
  try {
    const data = await animekai.search("a", page);
    return (data.results || []).slice(0, limitSlice).map(parseAnimeItem);
  } catch (e) {
    return [];
  }
}

export async function animeKaiRecent(page = 1, limitSlice = 24): Promise<AnimeKaiListItem[]> {
  try {
    const data = await animekai.fetchRecentlyAdded(page);
    return (data.results || []).slice(0, limitSlice).map(parseAnimeItem);
  } catch(e) {
    return [];
  }
}

export async function animeKaiTopAiring(page = 1, limitSlice = 24): Promise<AnimeKaiListItem[]> {
  try {
    const data = await animekai.fetchRecentlyUpdated(page);
    return (data.results || []).slice(0, limitSlice).map(parseAnimeItem);
  } catch (e) {
    return [];
  }
}
