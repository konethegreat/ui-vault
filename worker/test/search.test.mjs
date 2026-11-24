import assert from "node:assert/strict";
import { test } from "node:test";
import {
  filterComponents,
  filterEntries,
  getEntry,
  normalize,
  publicEntry,
} from "../src/search.js";

const sampleEntries = [
  {
    id: "liquid-sculpture-hero",
    title: "Liquid Sculpture Hero",
    tier: "reference",
    type: "hero",
    status: "usable",
    tags: ["particles", "GPU", "hero"],
    license: "MIT",
    rights: "permissive",
    source_author: "Guglielmo Giannattasio",
    source_url: "https://21st.dev/@gughigug/components/liquid-sculpture-hero",
    summary: "A hero that rebuilds an image as GPU particles.",
    demo: "live",
    demo_url: "",
    path: "references/liquid-sculpture-hero/entry.md",
    prompt: "# Build Liquid Sculpture Hero\n\nAttribution: Guglielmo Giannattasio, MIT.",
  },
  {
    id: "interactive-3d-machine",
    title: "Interactive 3D Machine",
    tier: "reference",
    type: "interaction",
    status: "inspiration-only",
    tags: ["3d", "three-js"],
    license: "unknown",
    rights: "private-reference",
    source_author: "Evgeny Shilov",
    source_url: "https://agentic-factory-3d.vercel.app",
    summary: "A five-station procedural factory.",
    demo: "link",
    demo_url: "https://agentic-factory-3d.vercel.app",
    path: "references/interactive-3d-machine/entry.md",
    prompt: "# Build a 3D machine\n\nDo not copy the source.",
  },
  {
    id: "minimal-card-grid",
    title: "Minimal Card Grid",
    tier: "pattern",
    type: "layout",
    status: "usable",
    tags: ["grid", "cards"],
    license: "MIT",
    rights: "own",
    source_author: "UI Vault",
    source_url: "",
    summary: "Responsive card grid without extra dependencies.",
    demo: "",
    demo_url: "",
    path: "",
    prompt: "# Build Minimal Card Grid",
  },
];

const sampleUpstream = [
  {
    id: "magic-ui",
    library: "Magic UI",
    license: "MIT",
    rights: "permissive",
    repo: "https://github.com/magicuidesign/magicui",
    install: "npx shadcn@latest add @magicui/<name>",
    components: [
      { name: "marquee", category: "animation" },
      { name: "number-ticker", category: "text" },
    ],
  },
  {
    id: "shadcn-ui",
    library: "shadcn/ui",
    license: "MIT",
    rights: "permissive",
    repo: "https://github.com/shadcn-ui/ui",
    install: "npx shadcn@latest add <name>",
    components: [
      { name: "button", category: "input" },
      { name: "dialog", category: "overlay" },
    ],
  },
];

test("normalize lowercases strings and handles nullish values", () => {
  assert.equal(normalize("MiXeD Case"), "mixed case");
  assert.equal(normalize(42), "42");
  assert.equal(normalize(null), "");
  assert.equal(normalize(undefined), "");
});

test("publicEntry strips prompt and derives prompt_path and prompt_url", () => {
  const withoutOrigin = publicEntry(sampleEntries[0]);
  assert.equal("prompt" in withoutOrigin, false);
  assert.equal(withoutOrigin.id, "liquid-sculpture-hero");
  assert.equal(withoutOrigin.prompt_path, "references/liquid-sculpture-hero/prompt.md");
  assert.equal(withoutOrigin.prompt_url, "/api/entries/liquid-sculpture-hero/prompt");

  const withOrigin = publicEntry(sampleEntries[0], "https://api.test");
  assert.equal(withOrigin.prompt_url, "https://api.test/api/entries/liquid-sculpture-hero/prompt");

  const missingPath = publicEntry(sampleEntries[2]);
  assert.equal(missingPath.prompt_path, "");
});

test("getEntry returns matching entry or null", () => {
  assert.equal(getEntry(sampleEntries, "interactive-3d-machine")?.title, "Interactive 3D Machine");
  assert.equal(getEntry(sampleEntries, "missing-id"), null);
  assert.equal(getEntry([], "liquid-sculpture-hero"), null);
});

test("filterEntries returns all entries by default and supports metadata filters", () => {
  const all = filterEntries(sampleEntries);
  assert.equal(all.total, 3);
  assert.equal(all.entries.length, 3);

  const byTier = filterEntries(sampleEntries, { tier: "PATTERN" });
  assert.equal(byTier.total, 1);
  assert.equal(byTier.entries[0].id, "minimal-card-grid");

  const byType = filterEntries(sampleEntries, { type: "interaction" });
  assert.equal(byType.total, 1);
  assert.equal(byType.entries[0].id, "interactive-3d-machine");

  const byTag = filterEntries(sampleEntries, { tag: "gpu" });
  assert.equal(byTag.total, 1);
  assert.equal(byTag.entries[0].id, "liquid-sculpture-hero");

  const byDemoNone = filterEntries(sampleEntries, { demo: "none" });
  assert.equal(byDemoNone.total, 1);
  assert.equal(byDemoNone.entries[0].id, "minimal-card-grid");
});

test("filterEntries matches multi-word queries across fields and combines filters", () => {
  const multiWord = filterEntries(sampleEntries, { q: "  giannattasio   particles  " });
  assert.equal(multiWord.total, 1);
  assert.equal(multiWord.entries[0].id, "liquid-sculpture-hero");

  const combined = filterEntries(sampleEntries, {
    tier: "reference",
    demo: "link",
    tag: "three-js",
    q: "procedural",
  });
  assert.equal(combined.total, 1);
  assert.equal(combined.entries[0].id, "interactive-3d-machine");

  const noMatch = filterEntries(sampleEntries, { tier: "reference", q: "minimal" });
  assert.equal(noMatch.total, 0);
  assert.deepEqual(noMatch.entries, []);
});

test("filterEntries clamps limit between 1 and 500 with default 100", () => {
  const manyEntries = Array.from({ length: 550 }, (_, index) => ({
    ...sampleEntries[2],
    id: `entry-${index}`,
  }));

  const defaultLimited = filterEntries(manyEntries);
  assert.equal(defaultLimited.total, 550);
  assert.equal(defaultLimited.entries.length, 100);

  const maxLimited = filterEntries(manyEntries, { limit: 999 });
  assert.equal(maxLimited.total, 550);
  assert.equal(maxLimited.entries.length, 500);

  const minLimited = filterEntries(manyEntries, { limit: -10 });
  assert.equal(minLimited.total, 550);
  assert.equal(minLimited.entries.length, 1);

  const zeroFallback = filterEntries(manyEntries, { limit: 0 });
  assert.equal(zeroFallback.entries.length, 100);
});

test("filterComponents flattens, filters by library and query, and clamps limit", () => {
  const all = filterComponents(sampleUpstream);
  assert.equal(all.total, 4);
  assert.deepEqual(all.components[0], {
    id: "marquee",
    library: "Magic UI",
    library_id: "magic-ui",
    category: "animation",
    install: "npx shadcn@latest add @magicui/<name>",
    repo: "https://github.com/magicuidesign/magicui",
    license: "MIT",
    rights: "permissive",
  });

  const byLibrary = filterComponents(sampleUpstream, { library: "SHADCN-UI" });
  assert.equal(byLibrary.total, 2);
  assert.deepEqual(byLibrary.components.map((item) => item.id), ["button", "dialog"]);

  const byQuery = filterComponents(sampleUpstream, { q: "magic animation" });
  assert.equal(byQuery.total, 1);
  assert.equal(byQuery.components[0].id, "marquee");

  const manyUpstream = [
    {
      ...sampleUpstream[0],
      components: Array.from({ length: 550 }, (_, index) => ({
        name: `comp-${index}`,
        category: "ui",
      })),
    },
  ];
  assert.equal(filterComponents(manyUpstream).entries, undefined);
  assert.equal(filterComponents(manyUpstream).components.length, 50);
  assert.equal(filterComponents(manyUpstream, { limit: 999 }).components.length, 500);
  assert.equal(filterComponents(manyUpstream, { limit: -1 }).components.length, 1);
  assert.equal(filterComponents(manyUpstream, { limit: 0 }).components.length, 50);
});
