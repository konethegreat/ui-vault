import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const catalog = JSON.parse(readFileSync(join(root, "catalog.json"), "utf8"));

const entries = catalog.entries.map((entry) => {
  const { prompt_url: _promptUrl, ...rest } = entry;
  return {
    ...rest,
    prompt: readFileSync(join(root, entry.prompt), "utf8"),
  };
});

const data = {
  name: "ui-vault",
  owner: "Kone Tshivhinda",
  generated: catalog.generated,
  counts: catalog.counts,
  entries,
  upstream: catalog.upstream,
};

writeFileSync(join(root, "worker", "src", "data.json"), JSON.stringify(data) + "\n");
console.log(`Wrote worker data: ${entries.length} entries, ${catalog.upstream.length} libraries`);
