import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, resolve } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const CLI_PATH = join(REPO_ROOT, "bin", "ui-vault.mjs");
const LOCAL_CATALOG = JSON.parse(readFileSync(join(REPO_ROOT, "catalog.json"), "utf8"));

const FIXTURE_ENTRIES = [
  {
    id: "alpha-card",
    title: "Alpha Card",
    tier: "pattern",
    type: "component",
    rights: "own",
    demo: "live",
    status: "usable",
    tags: ["card", "motion"],
    source_author: "Test Author",
    license: "MIT",
    source_url: "https://example.com/alpha",
    demo_url: "https://example.com/demo",
    summary: "Interactive card pattern.",
    prompt_url: "https://example.test/api/entries/alpha-card/prompt",
  },
  {
    id: "beta-hero",
    title: "Beta Hero",
    tier: "reference",
    type: "section",
    rights: "permissive",
    demo: "link",
    status: "usable",
    tags: ["hero", "layout"],
    source_author: "Another Author",
    license: "Apache-2.0",
    source_url: "https://example.com/beta",
    demo_url: "https://example.com/beta-demo",
    summary: "Full-bleed hero layout.",
    prompt_url: "https://example.test/api/entries/beta-hero/prompt",
  },
  {
    id: "gamma-nav",
    title: "Gamma Nav",
    tier: "source",
    type: "library",
    rights: "restricted",
    demo: "none",
    status: "usable",
    tags: ["nav"],
    source_author: "Third Author",
    license: "Custom",
    source_url: "https://example.com/gamma",
    summary: "Navigation primitives.",
    prompt_url: "https://example.test/api/entries/gamma-nav/prompt",
  },
];

const ALPHA_PROMPT = "# Alpha Card\n\nUse semantic markup and reduced-motion fallbacks.";

let server;
let apiBaseUrl;
let closedBaseUrl;

async function getUnusedLocalUrl() {
  const tempServer = createServer();
  await new Promise((resolveListen) => tempServer.listen(0, "127.0.0.1", resolveListen));
  const address = tempServer.address();
  await new Promise((resolveClose) => tempServer.close(resolveClose));
  return `http://127.0.0.1:${address.port}`;
}

async function runCli(args, envOverrides = {}) {
  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [CLI_PATH, ...args], {
      cwd: REPO_ROOT,
      env: { ...process.env, UI_VAULT_API: apiBaseUrl, ...envOverrides },
    });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return {
      code: typeof error.code === "number" ? error.code : 1,
      stdout: error.stdout || "",
      stderr: error.stderr || "",
    };
  }
}

before(async () => {
  server = createServer((req, res) => {
    if (req.url === "/api/entries") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ entries: FIXTURE_ENTRIES }));
      return;
    }
    if (req.url === "/api/entries/alpha-card/prompt") {
      res.writeHead(200, { "content-type": "text/markdown; charset=utf-8" });
      res.end(ALPHA_PROMPT);
      return;
    }
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  const address = server.address();
  apiBaseUrl = `http://127.0.0.1:${address.port}`;
  closedBaseUrl = await getUnusedLocalUrl();
});

after(async () => {
  if (server) {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("help prints usage and base URL", async () => {
  const result = await runCli(["--help"]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /ui-vault list/);
  assert.ok(result.stdout.includes(apiBaseUrl));
});

test("list renders a table, supports filters, and handles empty matches", async () => {
  const all = await runCli(["list"]);
  assert.equal(all.code, 0);
  assert.match(all.stdout, /ID\s+TIER\s+TYPE\s+RIGHTS\s+DEMO\s+TITLE/);
  assert.match(all.stdout, /alpha-card/);
  assert.match(all.stdout, /beta-hero/);
  assert.match(all.stdout, /gamma-nav/);
  assert.match(all.stdout, /3 of 3 entries/);

  const filtered = await runCli(["list", "--tier", "pattern", "--type", "component", "--tag", "motion", "--demo", "live"]);
  assert.equal(filtered.code, 0);
  assert.match(filtered.stdout, /alpha-card/);
  assert.doesNotMatch(filtered.stdout, /beta-hero/);
  assert.match(filtered.stdout, /1 of 3 entries/);

  const limited = await runCli(["list", "--limit", "2"]);
  assert.equal(limited.code, 0);
  assert.match(limited.stdout, /2 of 3 entries/);

  const empty = await runCli(["list", "--tag", "nonexistent-tag"]);
  assert.equal(empty.code, 0);
  assert.match(empty.stdout, /No entries matched\./);
  assert.match(empty.stdout, /0 of 3 entries/);
});

test("list --json outputs valid JSON matching applied filters", async () => {
  const result = await runCli(["list", "--tier=reference", "--json"]);
  assert.equal(result.code, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].id, "beta-hero");
});

test("search matches across fields and supports --json", async () => {
  const textResult = await runCli(["search", "alpha", "motion"]);
  assert.equal(textResult.code, 0);
  assert.match(textResult.stdout, /alpha-card/);
  assert.doesNotMatch(textResult.stdout, /beta-hero/);
  assert.match(textResult.stdout, /1 match for "alpha motion"/);

  const jsonResult = await runCli(["search", "hero", "--json"]);
  assert.equal(jsonResult.code, 0);
  const parsed = JSON.parse(jsonResult.stdout);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].id, "beta-hero");

  const missingWords = await runCli(["search"]);
  assert.equal(missingWords.code, 1);
  assert.match(missingWords.stderr, /Missing search words/);
});

test("show prints entry metadata, supports --json, and errors on missing or unknown id", async () => {
  const textResult = await runCli(["show", "alpha-card"]);
  assert.equal(textResult.code, 0);
  assert.match(textResult.stdout, /alpha-card/);
  assert.match(textResult.stdout, /Alpha Card/);
  assert.match(textResult.stdout, /Tier:\s+pattern/);
  assert.match(textResult.stdout, /Rights:\s+own/);
  assert.match(textResult.stdout, /Demo:\s+live \(https:\/\/example\.com\/demo\)/);
  assert.match(textResult.stdout, /Next:\s+npx github:konethegreat\/ui-vault prompt alpha-card/);

  const jsonResult = await runCli(["show", "beta-hero", "--json"]);
  assert.equal(jsonResult.code, 0);
  const parsed = JSON.parse(jsonResult.stdout);
  assert.equal(parsed.id, "beta-hero");
  assert.equal(parsed.license, "Apache-2.0");

  const missingId = await runCli(["show"]);
  assert.equal(missingId.code, 1);
  assert.match(missingId.stderr, /Missing entry id/);

  const unknownId = await runCli(["show", "does-not-exist"]);
  assert.equal(unknownId.code, 1);
  assert.match(unknownId.stderr, /No entry with id "does-not-exist"/);
});

test("prompt fetches remote prompt text and errors on missing or unknown id", async () => {
  const result = await runCli(["prompt", "alpha-card"]);
  assert.equal(result.code, 0);
  assert.equal(result.stdout, `${ALPHA_PROMPT}\n`);

  const missingId = await runCli(["prompt"]);
  assert.equal(missingId.code, 1);
  assert.match(missingId.stderr, /Missing entry id/);

  const unknownId = await runCli(["prompt", "does-not-exist"]);
  assert.equal(unknownId.code, 1);
  assert.match(unknownId.stderr, /No entry with id "does-not-exist"/);
});

test("api --json returns configured base URL and endpoints", async () => {
  const result = await runCli(["api", "--json"]);
  assert.equal(result.code, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.base, apiBaseUrl);
  assert.ok(Array.isArray(parsed.endpoints));
  assert.ok(parsed.endpoints.some((endpoint) => endpoint.path.startsWith("/api/entries")));
});

test("falls back to local catalog.json and local prompt files when API is unreachable", async () => {
  const listResult = await runCli(["list", "--json"], { UI_VAULT_API: closedBaseUrl });
  assert.equal(listResult.code, 0);
  const parsed = JSON.parse(listResult.stdout);
  assert.equal(parsed.length, LOCAL_CATALOG.entries.length);
  assert.equal(parsed[0].id, LOCAL_CATALOG.entries[0].id);

  const sampleEntry = LOCAL_CATALOG.entries.find((entry) => entry.prompt || entry.path);
  assert.ok(sampleEntry, "expected at least one local catalog entry with a prompt path");
  const promptRelative = sampleEntry.prompt || sampleEntry.path.replace(/entry\.md$/, "prompt.md");
  const expectedPrompt = readFileSync(join(REPO_ROOT, promptRelative), "utf8");

  const promptResult = await runCli(["prompt", sampleEntry.id], { UI_VAULT_API: closedBaseUrl });
  assert.equal(promptResult.code, 0);
  assert.equal(
    promptResult.stdout,
    expectedPrompt.endsWith("\n") ? expectedPrompt : `${expectedPrompt}\n`
  );
});

test("rejects unknown commands and unknown flags", async () => {
  const badCommand = await runCli(["unknown-cmd"]);
  assert.equal(badCommand.code, 1);
  assert.match(badCommand.stderr, /Unknown command "unknown-cmd"/);

  const badFlag = await runCli(["show", "alpha-card", "--bogus", "1"]);
  assert.equal(badFlag.code, 1);
  assert.match(badFlag.stderr, /Unknown flag --bogus/);
});
