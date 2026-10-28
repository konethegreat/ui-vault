#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const API = (process.env.UI_VAULT_API || "https://ui-vault-api.erictshivhinda.workers.dev").replace(/\/$/, "");
const PAGES = "https://konethegreat.github.io/ui-vault";
const RAW = "https://raw.githubusercontent.com/konethegreat/ui-vault/main";
const REPO_ROOT = fileURLToPath(new URL("../", import.meta.url));

const USAGE = `ui-vault — a provenance-first UI reference index

Usage:
  ui-vault list [--tier <tier>] [--type <type>] [--tag <tag>] [--demo <live|link|none>] [--limit <n>] [--json]
  ui-vault search <words...> [--json]
  ui-vault show <id> [--json]
  ui-vault prompt <id>
  ui-vault api [--json]

Base URL: ${API}
Source:   https://github.com/konethegreat/ui-vault`;

class CliError extends Error {}

function die(message) {
  throw new CliError(message);
}

async function fetchWithTimeout(url) {
  return fetch(url, { signal: AbortSignal.timeout(8000), headers: { "user-agent": "ui-vault-cli" } });
}

async function fetchJson(url) {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function getCatalog() {
  try {
    return await fetchJson(`${API}/api/entries`);
  } catch {
    const local = join(REPO_ROOT, "catalog.json");
    if (existsSync(local)) {
      try {
        return JSON.parse(await readFile(local, "utf8"));
      } catch {
        // fall through to the published copy
      }
    }
    return fetchJson(`${PAGES}/catalog.json`);
  }
}

function entryMatches(entry, filters) {
  if (filters.tier && entry.tier !== filters.tier) return false;
  if (filters.type && entry.type !== filters.type) return false;
  if (filters.tag && !(entry.tags || []).includes(filters.tag)) return false;
  if (filters.demo && entry.demo !== filters.demo) return false;
  if (filters.q) {
    const haystack = [
      entry.id,
      entry.title,
      entry.summary,
      entry.type,
      entry.tier,
      entry.source_author,
      ...(entry.tags || [])
    ]
      .join(" ")
      .toLowerCase();
    if (!filters.q.toLowerCase().split(/\s+/).every((word) => haystack.includes(word))) return false;
  }
  return true;
}

function filterEntries(entries, filters) {
  const matched = entries.filter((entry) => entryMatches(entry, filters));
  const limit = Number(filters.limit);
  return Number.isFinite(limit) && limit > 0 ? matched.slice(0, limit) : matched;
}

function printTable(rows, headers) {
  const widths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => String(row[i]).length))
  );
  const line = (row) => row.map((cell, i) => String(cell).padEnd(widths[i])).join("  ").trimEnd();
  console.log(line(headers));
  console.log(widths.map((width) => "-".repeat(width)).join("  "));
  for (const row of rows) console.log(line(row));
}

function printEntries(entries) {
  if (!entries.length) {
    console.log("No entries matched.");
    return;
  }
  printTable(
    entries.map((entry) => [entry.id, entry.tier, entry.type, entry.rights, entry.demo, entry.title]),
    ["ID", "TIER", "TYPE", "RIGHTS", "DEMO", "TITLE"]
  );
}

async function findEntry(id) {
  const payload = await getCatalog();
  return (payload.entries || []).find((entry) => entry.id === id);
}

async function cmdList(filters) {
  const payload = await getCatalog();
  const matches = filterEntries(payload.entries || [], filters);
  if (filters.json) {
    console.log(JSON.stringify(matches, null, 2));
    return;
  }
  printEntries(matches);
  console.log(`\n${matches.length} of ${(payload.entries || []).length} entries`);
}

async function cmdSearch(words, json) {
  const filters = { q: words.join(" "), limit: undefined, json };
  const payload = await getCatalog();
  const matches = filterEntries(payload.entries || [], filters);
  if (json) {
    console.log(JSON.stringify(matches, null, 2));
    return;
  }
  printEntries(matches);
  console.log(`\n${matches.length} match${matches.length === 1 ? "" : "es"} for "${words.join(" ")}"`);
}

function promptPathFor(entry) {
  if (entry.prompt) return entry.prompt;
  if (entry.prompt_path) return entry.prompt_path;
  if (entry.path) return entry.path.replace(/entry\.md$/, "prompt.md");
  return "";
}

async function cmdShow(id, json) {
  if (!id) die("Missing entry id. Try: ui-vault list");
  const entry = await findEntry(id);
  if (!entry) die(`No entry with id "${id}". Try: ui-vault search <words>`);
  if (json) {
    console.log(JSON.stringify(entry, null, 2));
    return;
  }
  const promptPath = promptPathFor(entry);
  const next = `npx github:konethegreat/ui-vault prompt ${entry.id}`;
  const lines = [
    `${entry.id} — ${entry.title}`,
    `Tier:     ${entry.tier}`,
    `Type:     ${entry.type}`,
    `Rights:   ${entry.rights}`,
    `Author:   ${entry.source_author || "—"}`,
    `License:  ${entry.license || "—"}`,
    `Status:   ${entry.status}`,
    `Summary:  ${entry.summary}`,
    `Source:   ${entry.source_url || "—"}`,
    `Demo:     ${entry.demo}${entry.demo_url ? ` (${entry.demo_url})` : ""}`,
    `Prompt:   ${promptPath || entry.prompt_url}`,
    "",
    `Next:     ${next}`
  ];
  for (const line of lines) console.log(line);
}

async function readPrompt(entry) {
  const promptPath = promptPathFor(entry);
  if (promptPath) {
    const local = join(REPO_ROOT, promptPath);
    if (existsSync(local)) {
      try {
        return await readFile(local, "utf8");
      } catch {
        // fall through to the network copies
      }
    }
  }
  try {
    const res = await fetchWithTimeout(`${API}/api/entries/${entry.id}/prompt`);
    if (res.ok) return res.text();
  } catch {
    // fall through to raw GitHub
  }
  if (!promptPath) throw new Error("no prompt path published for this entry");
  const res = await fetchWithTimeout(`${RAW}/${promptPath}`);
  if (!res.ok) throw new Error(`prompt fetch failed with ${res.status}`);
  return res.text();
}

async function cmdPrompt(id) {
  if (!id) die("Missing entry id. Try: ui-vault list");
  const entry = await findEntry(id);
  if (!entry) die(`No entry with id "${id}". Try: ui-vault search <words>`);
  const text = await readPrompt(entry);
  process.stdout.write(text.endsWith("\n") ? text : `${text}\n`);
}

function cmdApi(json) {
  const endpoints = [
    ["GET", "/api/health", "Counts and generation date"],
    ["GET", "/api/entries?q=&tier=&type=&tag=&demo=&limit=", "Filtered entry list"],
    ["GET", "/api/entries/:id", "One entry"],
    ["GET", "/api/entries/:id/prompt", "Agent prompt as markdown"],
    ["GET", "/api/components?q=&library=&limit=", "Upstream component index"],
    ["POST", "/mcp", "MCP over Streamable HTTP, JSON-RPC 2.0"]
  ];
  if (json) {
    console.log(JSON.stringify({ base: API, endpoints: endpoints.map(([method, path, purpose]) => ({ method, path, purpose })) }, null, 2));
    return;
  }
  console.log(`Base: ${API}\n`);
  printTable(endpoints, ["METHOD", "PATH", "PURPOSE"]);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg.startsWith("--")) {
      const [key, inline] = arg.slice(2).split("=");
      const value = inline ?? argv[++i];
      if (value === undefined) die(`Missing value for --${key}`);
      flags[key] = value;
      continue;
    }
    positional.push(arg);
  }
  return { positional, flags, json };
}

function checkFlags(flags, allowed) {
  for (const key of Object.keys(flags)) {
    if (!allowed.includes(key)) die(`Unknown flag --${key}. Try: ui-vault --help`);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help" || command === "-h") {
    console.log(USAGE);
    return;
  }
  const { positional, flags, json } = parseArgs(rest);

  switch (command) {
    case "list":
      checkFlags(flags, ["tier", "type", "tag", "demo", "limit"]);
      await cmdList({ ...flags, json });
      break;
    case "search":
      checkFlags(flags, ["limit"]);
      if (!positional.length) die("Missing search words. Try: ui-vault search liquid");
      await cmdSearch(positional, json);
      break;
    case "show":
      checkFlags(flags, []);
      await cmdShow(positional[0], json);
      break;
    case "prompt":
      checkFlags(flags, []);
      await cmdPrompt(positional[0]);
      break;
    case "api":
      checkFlags(flags, []);
      cmdApi(json);
      break;
    default:
      die(`Unknown command "${command}". Try: ui-vault --help`);
  }
}

main().catch((error) => {
  console.error(`ui-vault: ${error.message || "request failed"}`);
  process.exitCode = 1;
});
