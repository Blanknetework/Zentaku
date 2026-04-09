import React from "react";

export async function OfficialStreams({ alId }: { alId: number }) {
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        streamingEpisodes {
          title
          site
          url
        }
        externalLinks {
          site
          url
        }
      }
    }
  `;

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id: alId },
      }),
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const streamingEpisodes = json?.data?.Media?.streamingEpisodes || [];
    const externalLinks = json?.data?.Media?.externalLinks || [];

    // Deduplicate sites
    const sites = new Map<string, string>();
    streamingEpisodes.forEach((ep: any) => {
      if (ep.site && ep.url && !sites.has(ep.site)) {
        sites.set(ep.site, ep.url);
      }
    });
    externalLinks.forEach((link: any) => {
      // sites like Crunchyroll, Hulu, Netflix
      const validSites = ["Crunchyroll", "Hulu", "Netflix", "Amazon", "Funimation", "Tubi TV"];
      if (link.site && link.url && validSites.includes(link.site) && !sites.has(link.site)) {
        sites.set(link.site, link.url);
      }
    });

    if (sites.size === 0) return null;

    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/70">
          Official Streams
        </h3>
        <p className="mb-4 text-xs text-white/50">
          If internal stream lookup failed, support the creators by watching on official platforms:
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from(sites.entries()).map(([site, url]) => (
            <a
              key={site}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-accent/20 px-4 py-2 text-sm font-bold text-accent hover:bg-accent hover:text-white transition-colors"
            >
              {site}
            </a>
          ))}
        </div>
      </div>
    );
  } catch (e) {
    return null;
  }
}
