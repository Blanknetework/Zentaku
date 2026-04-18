import { ANIME } from "@consumet/extensions";

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
  alID?: number;
  malID?: number;
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
  isIframe?: boolean;
};

export type AnimeKaiWatchResult = {
  headers?: Record<string, string>;
  sources: AnimeKaiWatchSource[];
  download?: string;
};

const ANIPUB_API = "https://anipub.xyz";

function fixImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${ANIPUB_API}/${url}`;
}

export async function animeKaiSearch(query: string, page = 1): Promise<AnimeKaiSearchPage> {
  const q = query.trim() || "a";
  try {
    const res = await fetch(`${ANIPUB_API}/api/searchall/${encodeURIComponent(q)}?page=${page}`);
    if (!res.ok) return { currentPage: page, hasNextPage: false, results: [] };
    const data = await res.json();
    const results = (data.AniData || []).map((a: any) => ({
      id: a.finder,
      title: a.Name,
      url: "",
      image: fixImageUrl(a.ImagePath || a.Image),
      subOrDub: "sub"
    }));
    return {
      currentPage: data.currentPage || page,
      hasNextPage: results.length > 0,
      results
    };
  } catch (e) {
    return { currentPage: page, hasNextPage: false, results: [] };
  }
}

export async function animeKaiInfo(id: string): Promise<AnimeKaiInfo> {
  const res = await fetch(`${ANIPUB_API}/api/info/${id}`);
  if (!res.ok) {
    throw new AnimeKaiError("Anime not found", res.status);
  }
  const data = await res.json();
  
  const epCount = data.epCount || 0;
  const episodes: AnimeKaiEpisode[] = [];
  for (let i = 1; i <= epCount; i++) {
    episodes.push({
      id: `${data._id}-ep-${i}`,
      number: i,
      title: `Episode ${i}`,
      url: ""
    });
  }

  return {
    id: data.finder || id,
    title: data.Name,
    url: "",
    image: fixImageUrl(data.ImagePath),
    description: data.DescripTion || "",
    genres: data.Genres || [],
    subOrDub: "sub",
    type: "TV",
    status: data.Status || "Ongoing",
    totalEpisodes: epCount,
    episodes
  };
}

export async function animeKaiWatch(
  episodeId: string,
  server = "vidstreaming",
  category = "sub",
): Promise<AnimeKaiWatchResult> {
  const parts = episodeId.split("-ep-");
  const _id = parts[0];
  const epNum = parseInt(parts[1] || "1");

  const res = await fetch(`${ANIPUB_API}/v1/api/details/${_id}`);
  if (!res.ok) {
    throw new AnimeKaiError("Failed to fetch streaming details", res.status);
  }
  const data = await res.json();

  let iframeSrc = "";
  if (data.local) {
     if (epNum === 1) {
       iframeSrc = data.local.link;
     } else if (data.local.ep && data.local.ep[epNum - 2]) {
       iframeSrc = data.local.ep[epNum - 2].link;
     }
  }
  
  if (iframeSrc.startsWith("src=")) {
    iframeSrc = iframeSrc.replace("src=", "");
  }

  if (!iframeSrc) {
    throw new AnimeKaiError("Episode link not found", 404);
  }

  // Adjust audio category dynamically if the API allows it natively via path segments
  if (iframeSrc.endsWith("/sub") || iframeSrc.endsWith("/dub")) {
      iframeSrc = iframeSrc.replace(/\/(sub|dub)$/, `/${category}`);
  }

  return {
    sources: [{
      url: iframeSrc,
      quality: "default",
      isM3U8: false,
      isIframe: true
    }]
  };
}

export async function animeKaiAdvancedSearch(
  params: Record<string, string | number | undefined>,
): Promise<AnimeKaiSearchPage> {
  const query = String(params.keyword || params.q || "a");
  return animeKaiSearch(query, Number(params.page || 1));
}

export async function animeKaiPopular(page = 1, limitSlice = 24): Promise<AnimeKaiListItem[]> {
  try {
    const res = await fetch(`${ANIPUB_API}/api/findbyrating?page=${page}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.AniData || []).slice(0, limitSlice).map((a: any) => ({
      id: a.finder,
      title: a.Name,
      url: "",
      image: fixImageUrl(a.ImagePath),
    }));
  } catch (e) {
    return [];
  }
}

export async function animeKaiRecent(page = 1, limitSlice = 24): Promise<AnimeKaiListItem[]> {
  return animeKaiPopular(page, limitSlice);
}

export async function animeKaiTopAiring(page = 1, limitSlice = 24): Promise<AnimeKaiListItem[]> {
  return animeKaiPopular(page, limitSlice);
}
