import { ANIME } from "@consumet/extensions";

async function main() {
  const gogo = new ANIME.Gogoanime();
  try {
    const results = await gogo.search("classroom of the elite");
    console.log("Search:", results.results[0]);
    if (results.results.length > 0) {
      const info = await gogo.fetchAnimeInfo(results.results[0].id);
      console.log("Info ID:", info.id);
      if (info.episodes && info.episodes.length > 0) {
        const epId = info.episodes[0].id;
        console.log("Ep ID:", epId);
        const sources = await gogo.fetchEpisodeSources(epId);
        console.log("Sources:", sources.sources.map(s => s.quality));
      }
    }
  } catch(e) {
    console.error("Error:", e);
  }
}
main();
