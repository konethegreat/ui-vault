import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const site = join(here, "..");

await mkdir(join(site, "public"), { recursive: true });
await copyFile(join(root, "catalog.json"), join(site, "public", "catalog.json"));

// Prompts are served from the site so the copy buttons work without the API.
const catalog = JSON.parse(await readFile(join(root, "catalog.json"), "utf8"));
await mkdir(join(site, "public", "prompts"), { recursive: true });
for (const entry of catalog.entries) {
  await copyFile(join(root, entry.prompt), join(site, "public", "prompts", `${entry.id}.md`));
}

// The built site bundles third-party code, so it must also serve their notices.
await mkdir(join(site, "public", "licenses"), { recursive: true });
await copyFile(join(root, "references", "magic-ui-LICENSE.md"), join(site, "public", "licenses", "magic-ui.txt"));
await copyFile(
  join(root, "references", "liquid-sculpture-hero", "LICENSE.md"),
  join(site, "public", "licenses", "liquid-sculpture.txt")
);
await copyFile(
  join(root, "references", "mascot-portfolio-hero", "LICENSE.md"),
  join(site, "public", "licenses", "mascot-portfolio.txt")
);
await copyFile(
  join(root, "references", "glass-folder-cards", "LICENSE.md"),
  join(site, "public", "licenses", "glass-folder-cards.txt")
);
await copyFile(
  join(root, "references", "fonts-LICENSE.txt"),
  join(site, "public", "licenses", "fonts.txt")
);

// The reference entries hold the published source. The site imports a byte-for-byte
// copy so the files resolve React from this package instead of the repository root.
const vendor = [
  ["references/liquid-sculpture-hero/SculptureHero.tsx", "SculptureHero.tsx"],
  ["references/mascot-portfolio-hero/MascotPortfolioHero.tsx", "MascotPortfolioHero.tsx"],
  ["references/glass-folder-cards/GlassFolderCards.tsx", "GlassFolderCards.tsx"],
  ["references/marquee/Marquee.tsx", "Marquee.tsx"],
  ["references/animated-shiny-text/AnimatedShinyText.tsx", "AnimatedShinyText.tsx"],
  ["references/number-ticker/NumberTicker.tsx", "NumberTicker.tsx"],
  ["references/dot-pattern/DotPattern.tsx", "DotPattern.tsx"],
  ["library/button/Button.tsx", "Button.tsx"],
  ["library/button/button.css", "button.css"],
  ["library/nebula-hero/NebulaHero.tsx", "NebulaHero.tsx"],
  ["library/nebula-hero/nebula-hero.css", "nebula-hero.css"],
  ["library/depth-zoom-parallax/DepthZoomParallax.tsx", "DepthZoomParallax.tsx"],
  ["library/depth-zoom-parallax/depth-zoom-parallax.css", "depth-zoom-parallax.css"],
  ["library/editorial-image-accordion/EditorialImageAccordion.tsx", "EditorialImageAccordion.tsx"],
  ["library/editorial-image-accordion/editorial-image-accordion.css", "editorial-image-accordion.css"],
  ["library/station-machine/StationMachine.tsx", "StationMachine.tsx"],
  ["library/station-machine/station-machine.css", "station-machine.css"],
  ["library/rocket-field-hero/RocketFieldHero.tsx", "RocketFieldHero.tsx"],
  ["library/rocket-field-hero/rocket-field-hero.css", "rocket-field-hero.css"],
];

await mkdir(join(site, "src", "vendor"), { recursive: true });
for (const [from, name] of vendor) {
  await copyFile(join(root, from), join(site, "src", "vendor", name));
}

console.log(
  `Synced catalog, ${catalog.entries.length} prompts, ${vendor.length} component sources and 4 license notices into the site`
);
