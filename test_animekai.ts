import { HiAnime } from "hianime";

async function main() {
  const hianime = new HiAnime.Scraper();
  try {
    const res = await hianime.getEpisodeSources("nippon-sangoku-rkkm9?ep=1");
    console.log("HiAnime Sources:", res);
  } catch (e) {
    console.error("HiAnime Error:", e);
  }
}
main();
