import { ANIME } from "@consumet/extensions";

async function main() {
  const animekai = new ANIME.AnimeKai();
  console.log("Fetching anime info for nippon-sangoku...");
  try {
    const info = await animekai.fetchAnimeInfo("nippon-sangoku-rkkm9");
    console.log("Got info, fetching sources for ep 1...");
    if (info.episodes && info.episodes.length > 0) {
      const epId = info.episodes[0].id;
      console.log("epId:", epId);
      const sources = await animekai.fetchEpisodeSources(epId);
      console.log("Sources:", sources);
    } else {
      console.log("No episodes found.");
    }
  } catch (e) {
    console.error("Error:", e);
  }
}
main();
