import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readJsonIfExists, resolveGenerated } from "./lib.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const catalog = JSON.parse(readFileSync(join(root, "catalog.json"), "utf8"));
const dataPath = join(root, "worker", "src", "data.json");

const entries = catalog.entries.map((entry) => {
  const { prompt_url: _promptUrl, ...rest } = entry;
  return {
    ...rest,
    prompt: readFileSync(join(root, entry.prompt), "utf8").replace(/\r\n/g, "\n"),
  };
});

const data = {
  name: "ui-vault",
  owner: "Kone Tshivhinda",
  generated: "",
  counts: catalog.counts,
  entries,
  upstream: catalog.upstream,
};

// Worker data also carries prompt text, which catalog.json does not, so it keeps its own stamp:
// unchanged content keeps the committed date, and a prompt-only edit takes the current date.
data.generated = resolveGenerated(readJsonIfExists(dataPath), data);

writeFileSync(dataPath, JSON.stringify(data) + "\n");
console.log(`Wrote worker data: ${entries.length} entries, ${catalog.upstream.length} libraries`);
