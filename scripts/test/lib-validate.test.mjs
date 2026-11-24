import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  escapeHtml,
  firstParagraph,
  listEntries,
  parseFrontmatter,
  splitList,
} from "../lib.mjs";
import { validateEntries } from "../validate.mjs";

const VALID_PROMPT =
  "# Implementation Guide\n\n" +
  "Use this pattern for interactive surfaces with keyboard focus support, reduced-motion fallbacks, semantic markup, and clean layout boundaries across desktop and mobile viewports without introducing extra dependencies.";

const NON_COPYABLE_PROMPT =
  "# Original Inspiration\n\n" +
  "Do not copy the upstream source code. Build an original implementation inspired by the visual hierarchy, spacing, and motion timing while crediting the original author and keeping accessibility intact.";

function withTempRoot(fn) {
  const root = mkdtempSync(join(tmpdir(), "ui-vault-validate-"));
  try {
    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function writeEntry(root, folder, id, frontmatterLines, { prompt = VALID_PROMPT, files = {} } = {}) {
  const dir = join(root, folder, id);
  mkdirSync(dir, { recursive: true });
  const entryText = ["---", ...frontmatterLines, "---", "", "Summary paragraph for the entry.", ""].join("\n");
  writeFileSync(join(dir, "entry.md"), entryText, "utf8");
  if (prompt !== null) {
    writeFileSync(join(dir, "prompt.md"), prompt, "utf8");
  }
  for (const [name, content] of Object.entries(files)) {
    const filePath = join(dir, name);
    mkdirSync(join(filePath, ".."), { recursive: true });
    writeFileSync(filePath, content, "utf8");
  }
  return dir;
}

test("parseFrontmatter parses strings, booleans, comments, and CRLF line endings", () => {
  const input = [
    "---",
    "# comment line",
    "id: sample-card",
    'title: "Sample Card: Demo"',
    "published_source: true",
    "draft: false",
    "source_url: https://example.com/a:b",
    "",
    "---",
    "Body line one.",
    "Body line two.",
  ].join("\r\n");

  const { data, body } = parseFrontmatter(input);
  assert.deepEqual(data, {
    id: "sample-card",
    title: "Sample Card: Demo",
    published_source: true,
    draft: false,
    source_url: "https://example.com/a:b",
  });
  assert.equal(body, "Body line one.\nBody line two.");
});

test("parseFrontmatter rejects missing delimiters and lines without colons", () => {
  assert.throws(() => parseFrontmatter("id: no-delimiters"), /missing or malformed frontmatter/);
  assert.throws(() => parseFrontmatter("---\nbad line\n---\nbody"), /invalid frontmatter line/);
});

test("splitList, firstParagraph, and escapeHtml handle edge cases", () => {
  assert.deepEqual(splitList(["a", "b"]), ["a", "b"]);
  assert.deepEqual(splitList(" react, tailwind , , motion "), ["react", "tailwind", "motion"]);
  assert.deepEqual(splitList(null), []);

  const md = "\n# Heading\n\nFirst line\nsecond line.\n\nSecond paragraph.";
  assert.equal(firstParagraph(md), "First line second line.");

  assert.equal(escapeHtml(`<a href="x" title='y'>&</a>`), "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;");
  assert.equal(escapeHtml(undefined), "");
});

test("listEntries reads entries across tiers and ignores folders without entry.md", () => {
  withTempRoot((root) => {
    writeEntry(root, "library", "alpha-pattern", ["id: alpha-pattern", "title: Alpha Pattern"]);
    mkdirSync(join(root, "library", "empty-folder"), { recursive: true });
    writeFileSync(join(root, "library", "stray-file.txt"), "ignore", "utf8");

    const entries = listEntries(root);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].tier, "pattern");
    assert.equal(entries[0].id, "alpha-pattern");
  });
});

test("validateEntries accepts valid pattern, permissive reference, and source entries", () => {
  withTempRoot((root) => {
    mkdirSync(join(root, "site", "src", "demos"), { recursive: true });
    writeFileSync(join(root, "site", "src", "demos", "Alpha.tsx"), "export default function Alpha() { return null; }", "utf8");

    writeEntry(
      root,
      "library",
      "alpha-pattern",
      [
        "id: alpha-pattern",
        "title: Alpha Pattern",
        "tier: pattern",
        "type: card",
        "status: usable",
        "license: MIT",
        "rights: own",
        "files: Alpha.tsx",
        "demo: live",
        "demo_source: site/src/demos/Alpha.tsx",
      ],
      { files: { "Alpha.tsx": "export const Alpha = () => null;" } },
    );

    writeEntry(
      root,
      "references",
      "beta-ref",
      [
        "id: beta-ref",
        "title: Beta Ref",
        "tier: reference",
        "type: hero",
        "status: usable",
        "license: MIT",
        "rights: permissive",
        "source_url: https://example.com/beta",
        "source_author: Example Author",
        "retrieved: 2026-11-01",
        "published_source: true",
        "files: Beta.tsx",
      ],
      { files: { "Beta.tsx": "export const Beta = () => null;" } },
    );

    writeEntry(
      root,
      "sources",
      "gamma-src",
      [
        "id: gamma-src",
        "title: Gamma Src",
        "tier: source",
        "type: library",
        "status: usable",
        "license: MIT",
        "rights: permissive",
        "source_url: https://example.com/gamma",
        "source_author: Gamma Team",
        "upstream_repo: https://github.com/example/gamma",
        `upstream_commit: ${"a".repeat(40)}`,
      ],
      { files: { "components.json": "[]" } },
    );

    const result = validateEntries(root);
    assert.equal(result.entries.length, 3);
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.warnings, []);
  });
});

test("validateEntries enforces frontmatter identity, tier, and metadata rules", () => {
  withTempRoot((root) => {
    writeEntry(root, "library", "Bad_Id", [
      "id: Bad_Id",
      "title: Bad Entry",
      "tier: reference",
      "type: unknown-type",
      "status: broken",
      "license: MIT",
      "rights: own",
      "files: missing.tsx",
    ]);

    writeEntry(root, "library", "mismatch-folder", [
      "id: wrong-id",
      "title: Mismatch Entry",
      "tier: pattern",
      "type: card",
      "status: usable",
      "license: MIT",
      "rights: own",
      "files: Card.tsx",
    ], { files: { "Card.tsx": "export const Card = () => null;" } });

    const { errors } = validateEntries(root);
    assert.ok(errors.some((e) => e.includes('id "wrong-id" does not match folder name')));
    assert.ok(errors.some((e) => e.includes("id must be kebab-case")));
    assert.ok(errors.some((e) => e.includes('tier "reference" must be "pattern"')));
    assert.ok(errors.some((e) => e.includes('unknown type "unknown-type"')));
    assert.ok(errors.some((e) => e.includes('unknown status "broken"')));
    assert.ok(errors.some((e) => e.includes("listed file not found: missing.tsx")));
  });
});

test("validateEntries enforces rights and license rules across tiers", () => {
  withTempRoot((root) => {
    writeEntry(
      root,
      "references",
      "unlicensed-ref",
      [
        "id: unlicensed-ref",
        "title: Unlicensed Ref",
        "tier: reference",
        "type: card",
        "status: inspiration-only",
        "license: unknown",
        "rights: unknown",
        "source_url: https://example.com/u",
        "source_author: Someone",
        "retrieved: 2026-11-01",
        "published_source: true",
        "files: Leaked.tsx",
        "demo: live",
        "demo_source: site/src/demos/Missing.tsx",
      ],
      {
        prompt: NON_COPYABLE_PROMPT,
        files: { "Leaked.tsx": "export const x = 1;" },
      },
    );

    writeEntry(
      root,
      "references",
      "private-ref",
      [
        "id: private-ref",
        "title: Private Ref",
        "tier: reference",
        "type: card",
        "status: inspiration-only",
        "license: proprietary",
        "rights: private-reference",
        "source_url: https://example.com/p",
        "source_author: Someone",
        "retrieved: 2026-11-01",
        "published_source: false",
      ],
      {
        prompt: NON_COPYABLE_PROMPT,
        files: { "Hidden.tsx": "export const x = 1;" },
      },
    );

    writeEntry(root, "library", "bad-pattern", [
      "id: bad-pattern",
      "title: Bad Pattern",
      "tier: pattern",
      "type: card",
      "status: usable",
      "license: Apache-2.0",
      "rights: permissive",
    ]);

    writeEntry(
      root,
      "sources",
      "restricted-src",
      [
        "id: restricted-src",
        "title: Restricted Src",
        "tier: source",
        "type: library",
        "status: usable",
        "license: Custom",
        "rights: restricted",
        "source_url: https://example.com/r",
        "source_author: Team",
        "upstream_repo: https://github.com/example/r",
        "upstream_commit: shortsha",
        "published_source: true",
      ],
      { prompt: NON_COPYABLE_PROMPT },
    );

    const { errors, warnings } = validateEntries(root);
    assert.ok(errors.some((e) => e.includes('rights "unknown" require published_source: false')));
    assert.ok(errors.some((e) => e.includes('demo: live requires rights own or permissive')));
    assert.ok(errors.some((e) => e.includes("demo: live requires a verified license")));
    assert.ok(errors.some((e) => e.includes("demo_source not found")));
    assert.ok(errors.some((e) => e.includes("published_source is false but the folder contains code: Hidden.tsx")));
    assert.ok(errors.some((e) => e.includes("pattern entries require rights: own")));
    assert.ok(errors.some((e) => e.includes("pattern entries require license: MIT")));
    assert.ok(errors.some((e) => e.includes("pattern entries require a files list")));
    assert.ok(errors.some((e) => e.includes("upstream_commit must be a full 40 character SHA")));
    assert.ok(errors.some((e) => e.includes("restricted sources cannot publish code")));
    assert.ok(warnings.some((w) => w.includes("no components.json")));
  });
});

test("validateEntries enforces prompt.md presence, length, heading, and do-not-copy rule", () => {
  withTempRoot((root) => {
    writeEntry(
      root,
      "library",
      "missing-prompt",
      [
        "id: missing-prompt",
        "title: Missing Prompt",
        "tier: pattern",
        "type: card",
        "status: usable",
        "license: MIT",
        "rights: own",
        "files: Card.tsx",
      ],
      { prompt: null, files: { "Card.tsx": "export const Card = () => null;" } },
    );

    writeEntry(
      root,
      "library",
      "short-prompt",
      [
        "id: short-prompt",
        "title: Short Prompt",
        "tier: pattern",
        "type: card",
        "status: usable",
        "license: MIT",
        "rights: own",
        "files: Card.tsx",
      ],
      { prompt: "No heading and too short.", files: { "Card.tsx": "export const Card = () => null;" } },
    );

    writeEntry(
      root,
      "references",
      "missing-do-not-copy",
      [
        "id: missing-do-not-copy",
        "title: Missing Do Not Copy",
        "tier: reference",
        "type: card",
        "status: inspiration-only",
        "license: unknown",
        "rights: unknown",
        "source_url: https://example.com/m",
        "source_author: Author",
        "retrieved: 2026-11-01",
        "published_source: false",
      ],
      { prompt: VALID_PROMPT },
    );

    const { errors } = validateEntries(root);
    assert.ok(errors.some((e) => e.includes("missing-prompt: missing prompt.md")));
    assert.ok(errors.some((e) => e.includes("short-prompt: prompt.md must be at least 200 characters")));
    assert.ok(errors.some((e) => e.includes("short-prompt: prompt.md must contain a markdown heading")));
    assert.ok(errors.some((e) => e.includes('missing-do-not-copy: prompt.md must say "do not copy" for non-copyable rights')));
  });
});
