import { loadEnvFile } from "node:process";
loadEnvFile(".env.local");
if (process.argv[3]) process.env.OPENROUTER_MODEL = process.argv[3];
import { extractSite, saveHeroImage } from "../lib/site";
import { generateAds } from "../lib/openrouter";

async function main() {
  const url = process.argv[2] || "https://example.com";
  console.log("Extracting:", url);
  const site = await extractSite(url);
  console.log("brand:", site.brand);
  console.log("title:", site.title.slice(0, 80));
  console.log("desc:", site.description.slice(0, 120));
  console.log("headings:", site.headings.slice(0, 3));
  console.log("text length:", site.text.length);
  console.log("images:", site.images.length);
  site.images.slice(0, 3).forEach((i) => console.log("  -", i.src.slice(0, 90), i.priority));

  const runId = "test" + Date.now();
  const hero = await saveHeroImage(site, runId);
  console.log("heroImagePath:", hero);

  const res = await generateAds(site);
  console.log("brand:", res.brand);
  res.ads.forEach((ad, i) => {
    console.log(`ad${i + 1}:`, JSON.stringify(ad));
  });
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
