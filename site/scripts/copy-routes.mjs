import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");
const routes = ["demos", "catalog", "use", "rights", "privacy", "takedown"];

for (const route of routes) {
  await mkdir(join(dist, route), { recursive: true });
  await copyFile(join(dist, "index.html"), join(dist, route, "index.html"));
}

// GitHub Pages serves 404.html for unknown paths, which keeps deep links working.
await copyFile(join(dist, "index.html"), join(dist, "404.html"));

console.log(`Wrote ${routes.length} route entry points and 404.html`);
