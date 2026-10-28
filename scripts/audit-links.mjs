import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CATALOG = join(ROOT, "catalog.json");
const ALLOWLIST = join(ROOT, "scripts", "link-allowlist.txt");
const TEXT_FILES = [
  "README.md",
  "AGENTS.md",
  "NOTICE.md",
  "THIRD_PARTY.md",
  "index.md",
  "site/index.html",
];
const SOURCE_DIR = join(ROOT, "site", "src");
const CONCURRENCY = 6;
const TIMEOUT_MS = 10000;

const SKIP_PREFIXES = [
  "mailto:",
  "tel:",
  "javascript:",
  "data:",
  "%BASE_URL%",
  "http://localhost",
  "http://127.0.0.1",
  "https://localhost",
  "https://schema.org",
];

const SKIP_HOSTS = new Set(["localhost", "127.0.0.1"]);

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "vendor" || name === "dist") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(name)) files.push(full);
  }
  return files;
}

function trimUrl(url) {
  return url.replace(/[.,;:!?]+$/, "").replace(/[*_`]+$/g, "");
}

function collectFromCatalog(urls) {
  const catalog = JSON.parse(readFileSync(CATALOG, "utf8"));
  for (const entry of catalog.entries || []) {
    for (const key of ["source_url", "license_url", "demo_url", "prompt_url"]) {
      if (entry[key]) urls.add(trimUrl(entry[key]));
    }
  }
  for (const lib of catalog.upstream || []) {
    for (const key of ["source_url", "repo"]) {
      if (lib[key]) urls.add(trimUrl(lib[key]));
    }
  }
}

function collectFromFiles(urls) {
  const files = TEXT_FILES.map((name) => join(ROOT, name));
  files.push(...walk(SOURCE_DIR));
  const pattern = /https?:\/\/[^\s"'`)\]<>]+/g;
  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const match of text.match(pattern) || []) {
      urls.add(trimUrl(match));
    }
  }
}

function shouldSkip(url) {
  if (SKIP_PREFIXES.some((prefix) => url.startsWith(prefix))) return true;
  try {
    return SKIP_HOSTS.has(new URL(url).hostname);
  } catch {
    return true;
  }
}

function readAllowlist() {
  const allowed = new Map();
  let text = "";
  try {
    text = readFileSync(ALLOWLIST, "utf8");
  } catch {
    return allowed;
  }
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [url, ...reason] = trimmed.split(/\s+/);
    allowed.set(url, reason.join(" ") || "no reason given");
  }
  return allowed;
}

async function request(url, method) {
  return fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; ui-vault-link-audit/1.0)",
      accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
    },
  });
}

function classify(status) {
  if (status >= 200 && status < 300) return "ok";
  if (status >= 300 && status < 400) return "redirect";
  if (status === 404 || status === 410) return "broken";
  return "inconclusive";
}

async function check(url) {
  let status;
  try {
    let res = await request(url, "HEAD");
    if ([403, 405, 429, 501].includes(res.status)) {
      res = await request(url, "GET");
    }
    status = res.status;
  } catch (error) {
    return { url, status: 0, verdict: "inconclusive", note: error.name === "TimeoutError" ? "timeout" : "network error" };
  }
  return { url, status, verdict: classify(status) };
}

async function run(urls) {
  const queue = [...urls];
  const results = [];
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      results.push(await check(url));
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

function printTable(results) {
  const order = { broken: 0, inconclusive: 1, redirect: 2, ok: 3 };
  results.sort((a, b) => order[a.verdict] - order[b.verdict] || a.url.localeCompare(b.url));
  const rows = results.map((result) => [
    result.allowlisted ? "allowed" : result.verdict,
    String(result.status || "-"),
    result.url,
  ]);
  const headers = ["VERDICT", "CODE", "URL"];
  const widths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => row[i].length))
  );
  const line = (row) => row.map((cell, i) => cell.padEnd(widths[i])).join("  ").trimEnd();
  console.log(line(headers));
  console.log(widths.map((width) => "-".repeat(width)).join("  "));
  for (const row of rows) console.log(line(row));
}

async function main() {
  const urls = new Set();
  collectFromCatalog(urls);
  collectFromFiles(urls);

  const allowlist = readAllowlist();
  const targets = [...urls].filter((url) => url.startsWith("http") && !shouldSkip(url));
  console.log(`Checking ${targets.length} unique URLs with concurrency ${CONCURRENCY}...\n`);

  const results = await run(targets);
  for (const result of results) {
    const reason = allowlist.get(result.url);
    if (reason && result.verdict === "broken") {
      result.allowlisted = true;
      result.note = reason;
    }
  }

  printTable(results);

  const counts = results.reduce((acc, result) => {
    const key = result.allowlisted ? "allowed" : result.verdict;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log(
    `\nSummary: ${Object.entries(counts)
      .map(([key, value]) => `${value} ${key}`)
      .join(", ")}`
  );

  const failed = results.filter((result) => result.verdict === "broken" && !result.allowlisted);
  if (failed.length) {
    console.error(`\n${failed.length} broken link${failed.length === 1 ? "" : "s"} need fixing:`);
    for (const result of failed) console.error(`  ${result.status} ${result.url}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`audit failed: ${error.message}`);
  process.exitCode = 1;
});
