import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { listEntries } from "./lib.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const errors = [];
const warnings = [];
const entries = listEntries(root);
const ids = new Map();

const TYPES = new Set([
  "hero",
  "nav",
  "section",
  "card",
  "button",
  "background",
  "interaction",
  "motion",
  "text",
  "data-display",
  "layout",
  "library",
  "docs",
  "other",
]);
const STATUSES = new Set(["usable", "needs-fix", "inspiration-only"]);
const RIGHTS = new Set(["own", "permissive", "restricted", "noncommercial", "unknown", "private-reference"]);
const DEMOS = new Set(["live", "link", "none"]);
const CODE_FILE = /\.(tsx?|jsx?|mjs|cjs|css|scss|glsl|frag|vert|html)$/i;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const COMMIT = /^[0-9a-f]{40}$/;

for (const entry of entries) {
  const { data: d, folder, id, dir } = entry;
  const where = `${folder}/${id}`;
  const fail = (message) => errors.push(`${where}: ${message}`);

  for (const key of ["id", "title", "tier", "type", "status", "license", "rights"]) {
    if (d[key] === undefined || d[key] === "") fail(`missing required field "${key}"`);
  }

  if (d.id && d.id !== id) fail(`id "${d.id}" does not match folder name`);
  if (d.id && !KEBAB.test(d.id)) fail("id must be kebab-case");
  if (d.id && ids.has(d.id)) fail(`duplicate id, also used by ${ids.get(d.id)}`);
  else if (d.id) ids.set(d.id, where);

  if (d.tier && d.tier !== entry.tier) fail(`tier "${d.tier}" must be "${entry.tier}" for this folder`);
  if (d.type && !TYPES.has(d.type)) fail(`unknown type "${d.type}"`);
  if (d.status && !STATUSES.has(d.status)) fail(`unknown status "${d.status}"`);
  if (d.rights && !RIGHTS.has(d.rights)) fail(`unknown rights "${d.rights}"`);

  if (d.tier === "reference") {
    for (const key of ["source_url", "source_author", "retrieved", "license"]) {
      if (!d[key]) fail(`reference entries require "${key}"`);
    }
    if (d.retrieved && !DATE.test(d.retrieved)) fail("retrieved must be YYYY-MM-DD");
    if (d.published_source === undefined) fail("reference entries require published_source true or false");
    if (d.published_source === false) {
      const code = readdirSync(dir).filter((name) => CODE_FILE.test(name));
      if (code.length) fail(`published_source is false but the folder contains code: ${code.join(", ")}`);
    }
    if (d.published_source === true && !d.files) fail("published_source is true but no files are listed");
    if (["unknown", "noncommercial", "private-reference"].includes(d.rights) && d.published_source !== false) {
      fail(`rights "${d.rights}" require published_source: false`);
    }
  }

  if (d.tier === "source") {
    for (const key of ["source_url", "source_author", "license", "upstream_repo", "upstream_commit"]) {
      if (!d[key]) fail(`source entries require "${key}"`);
    }
    if (d.upstream_commit && !COMMIT.test(d.upstream_commit)) fail("upstream_commit must be a full 40 character SHA");
    if (d.rights === "restricted" && d.published_source === true) fail("restricted sources cannot publish code");
    if (!existsSync(join(dir, "components.json"))) warnings.push(`${where}: no components.json, upstream index will be empty`);
  }

  if (d.tier === "pattern") {
    if (d.rights !== "own") fail('pattern entries require rights: own');
    if (d.license !== "MIT") fail('pattern entries require license: MIT');
    if (!d.files) fail("pattern entries require a files list");
  }

  if (d.demo && !DEMOS.has(d.demo)) fail(`unknown demo "${d.demo}"`);
  if (d.demo === "live") {
    if (!["own", "permissive"].includes(d.rights)) {
      fail(`demo: live requires rights own or permissive, found "${d.rights}"`);
    }
    if (!d.license || d.license === "unknown") fail("demo: live requires a verified license");
    if (!d.demo_source) fail('demo: live requires "demo_source"');
    else if (!existsSync(join(root, d.demo_source))) fail(`demo_source not found: ${d.demo_source}`);
  }
  if (d.demo === "link" && !d.demo_url) fail('demo: link requires "demo_url"');

  if (d.files) {
    for (const file of String(d.files).split(",").map((item) => item.trim()).filter(Boolean)) {
      if (!existsSync(join(dir, file))) fail(`listed file not found: ${file}`);
    }
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Validated ${entries.length} entries. No errors.`);
