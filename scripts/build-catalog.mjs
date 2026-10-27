import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { listEntries, splitList, firstParagraph, escapeHtml } from "./lib.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const now = new Date();
const generated = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

const TIER_RANK = { source: 0, reference: 1, pattern: 2 };
const TIER_LABEL = { source: "Source", reference: "Reference", pattern: "Library" };
const SITE_URL = "https://konethegreat.github.io/ui-vault";

function demoCell(entry) {
  if (entry.demo === "live") return `[live](${SITE_URL}/#demo-${entry.id})`;
  if (entry.demo === "link" && entry.demo_url) return `[original](${entry.demo_url})`;
  return "";
}

function toEntry(entry) {
  const d = entry.data;
  return {
    id: d.id,
    title: d.title,
    tier: d.tier,
    type: d.type,
    status: d.status,
    stack: splitList(d.stack),
    tags: splitList(d.tags),
    license: d.license,
    rights: d.rights,
    source_url: d.source_url || "",
    source_author: d.source_author || "",
    upstream_repo: d.upstream_repo || "",
    upstream_commit: d.upstream_commit || "",
    retrieved: d.retrieved || "",
    published_source: d.published_source === true,
    demo: d.demo || "none",
    demo_url: d.demo_url || "",
    demo_source: d.demo_source || "",
    license_url: d.license_url || "",
    path: `${entry.folder}/${d.id}/entry.md`,
    summary: firstParagraph(entry.body),
  };
}

const all = listEntries(root).map(toEntry);
const entries = all.sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || a.title.localeCompare(b.title));
const sources = entries.filter((entry) => entry.tier === "source");
const references = entries.filter((entry) => entry.tier === "reference");
const patterns = entries.filter((entry) => entry.tier === "pattern");

const upstream = [];
for (const source of sources) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(root, "sources", source.id, "components.json"), "utf8"));
  } catch {
    continue;
  }
  const components = [];
  for (const [category, names] of Object.entries(data.categories || {})) {
    for (const name of names) components.push({ name, category });
  }
  upstream.push({
    id: source.id,
    library: data.library,
    license: data.license,
    rights: source.rights,
    source_url: data.source_url,
    repo: data.repo,
    commit: data.commit,
    install: data.install,
    docs: data.docs || "",
    categories: data.categories,
    components,
  });
}

const upstreamCount = upstream.reduce((sum, item) => sum + item.components.length, 0);

const catalog = {
  name: "ui-vault",
  license: "MIT for original work, see NOTICE.md",
  generated,
  counts: {
    sources: sources.length,
    references: references.length,
    patterns: patterns.length,
    upstream_components: upstreamCount,
  },
  entries,
  upstream,
};

writeFileSync(join(root, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");

const mdCell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

const indexLines = [
  "# Index",
  "",
  `${sources.length} sources, ${references.length} references, ${patterns.length} original patterns, ${upstreamCount} upstream components. Generated ${generated}.`,
  "",
  "Definitions live in [README.md](README.md). Machine-readable data lives in [catalog.json](catalog.json).",
  "",
  "## Sources",
  "",
  "| Library | Author | License | Components | Install |",
  "| --- | --- | --- | --- | --- |",
];

for (const source of sources) {
  const group = upstream.find((item) => item.id === source.id);
  const count = group ? `[${group.components.length}](sources/${source.id}/components.md)` : "0";
  indexLines.push(
    `| [${mdCell(source.title)}](${source.path}) | ${mdCell(source.source_author)} | ${mdCell(source.license)} | ${count} | \`${mdCell(group ? group.install : "")}\` |`
  );
}

indexLines.push("", "## References", "", "| Design | Author | License | Rights | Status | Demo | Notes |", "| --- | --- | --- | --- | --- | --- | --- |");

for (const reference of references) {
  indexLines.push(
    `| [${mdCell(reference.title)}](${reference.path}) | ${mdCell(reference.source_author)} | ${mdCell(reference.license)} | ${mdCell(reference.rights)} | ${mdCell(reference.status)} | ${demoCell(reference)} | ${mdCell(reference.summary)} |`
  );
}

indexLines.push("", "## Library", "");

if (patterns.length) {
  indexLines.push("| Pattern | Type | License | Demo | Notes |", "| --- | --- | --- | --- | --- |");
  for (const pattern of patterns) {
    indexLines.push(`| [${mdCell(pattern.title)}](${pattern.path}) | ${mdCell(pattern.type)} | ${mdCell(pattern.license)} | ${demoCell(pattern)} | ${mdCell(pattern.summary)} |`);
  }
} else {
  indexLines.push("No original patterns yet. See [library/README.md](library/README.md) for the bar an entry must meet.");
}

indexLines.push(
  "",
  "## Attribution",
  "",
  "Every third-party author, license and source link is listed in [THIRD_PARTY.md](THIRD_PARTY.md). Original work in `library/` is MIT. Nothing else is presented as mine.",
  ""
);

writeFileSync(join(root, "index.md"), indexLines.join("\n"));

const thirdPartyLines = [
  "# Third-party attribution",
  "",
  `Generated ${generated}. This file lists every source and reference. Names and trademarks belong to their owners.`,
  "",
  "| Item | Author | License | Rights | Source | Retrieved | Published source |",
  "| --- | --- | --- | --- | --- | --- | --- |",
];

for (const entry of [...sources, ...references]) {
  const licenseCell = entry.license_url
    ? `[${mdCell(entry.license)}](${entry.license_url})`
    : mdCell(entry.license);
  thirdPartyLines.push(
    `| [${mdCell(entry.title)}](${entry.path}) | ${mdCell(entry.source_author)} | ${licenseCell} | ${mdCell(entry.rights)} | ${entry.source_url ? `[link](${entry.source_url})` : ""} | ${mdCell(entry.retrieved)} | ${entry.published_source ? "yes" : "no"} |`
  );
}

thirdPartyLines.push(
  "",
  "`Published source: no` means the entry is documentation only and the original code is not hosted here.",
  ""
);

writeFileSync(join(root, "THIRD_PARTY.md"), thirdPartyLines.join("\n"));

function badge(label, className) {
  return `<span class="badge ${className}">${escapeHtml(label)}</span>`;
}

const entryCards = entries
  .map((entry) => {
    const tags = entry.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const search = [entry.title, entry.summary, entry.type, entry.tier, entry.source_author, ...entry.tags, ...entry.stack]
      .join(" ")
      .toLowerCase();
    const authorName = entry.source_author || (entry.tier === "pattern" ? "Kone" : "");
    const author = authorName
      ? `<dt>Author</dt><dd>${entry.source_url ? `<a href="${escapeHtml(entry.source_url)}" target="_blank" rel="noopener">${escapeHtml(authorName)}</a>` : escapeHtml(authorName)}</dd>`
      : "";
    const license = entry.license_url
      ? `<a href="${escapeHtml(entry.license_url)}" target="_blank" rel="noopener">${escapeHtml(entry.license)}</a>`
      : escapeHtml(entry.license);
    const demo =
      entry.demo === "live"
        ? `<a class="more" href="${SITE_URL}/#demo-${entry.id}" target="_blank" rel="noopener">Live demo</a>`
        : entry.demo === "link" && entry.demo_url
          ? `<a class="more" href="${escapeHtml(entry.demo_url)}" target="_blank" rel="noopener">Original demo</a>`
          : "";
    return `<article class="card entry-card" data-tier="${entry.tier}" data-search="${escapeHtml(search)}">
  <div class="badges">${badge(TIER_LABEL[entry.tier], `tier-${entry.tier}`)}${badge(entry.type, "plain")}${badge(entry.status, `status-${entry.status}`)}</div>
  <h3><a href="${escapeHtml(entry.path)}">${escapeHtml(entry.title)}</a></h3>
  <p>${escapeHtml(entry.summary)}</p>
  <dl>${author}<dt>License</dt><dd>${license}</dd><dt>Rights</dt><dd>${escapeHtml(entry.rights)}</dd></dl>
  ${demo}
  <div class="tags">${tags}</div>
</article>`;
  })
  .join("\n");

const upstreamCards = upstream
  .map(
    (item) => `<article class="card">
  <div class="badges">${badge("Source", "tier-source")}${badge(`${item.components.length} components`, "plain")}</div>
  <h3><a href="sources/${escapeHtml(item.id)}/entry.md">${escapeHtml(item.library)}</a></h3>
  <p class="mono">${escapeHtml(item.install)}</p>
  <p>License: ${escapeHtml(item.license)}. Rights: ${escapeHtml(item.rights)}.</p>
  <a class="more" href="sources/${escapeHtml(item.id)}/components.md">Component index</a>
</article>`
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>UI Vault</title>
<style>
  :root {
    color-scheme: light;
    --bg: #fafaf9;
    --panel: #ffffff;
    --ink: #1c1917;
    --muted: #57534e;
    --line: #e7e5e4;
    --soft: #f5f5f4;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1080px; margin: 0 auto; padding: 56px 24px 80px; }
  header { border-bottom: 1px solid var(--line); padding-bottom: 28px; margin-bottom: 28px; }
  h1 { font-size: 34px; letter-spacing: -0.03em; margin: 0 0 8px; }
  h2 { font-size: 18px; letter-spacing: -0.01em; margin: 40px 0 14px; }
  p { margin: 0 0 10px; color: var(--muted); }
  a { color: var(--ink); text-decoration-thickness: 1px; text-underline-offset: 3px; }
  code, .mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 12.5px; }
  .mono { color: var(--muted); background: var(--soft); padding: 6px 8px; border-radius: 6px; display: block; white-space: normal; overflow-wrap: anywhere; }
  .stats { display: flex; gap: 18px; flex-wrap: wrap; color: var(--muted); font-size: 13px; margin-top: 14px; }
  .stats strong { color: var(--ink); font-weight: 600; }
  .controls { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin: 18px 0 24px; }
  .filter {
    appearance: none; border: 1px solid var(--line); background: var(--panel); color: var(--ink);
    padding: 7px 13px; border-radius: 999px; font: inherit; font-size: 13px; cursor: pointer;
  }
  .filter[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: #fff; }
  #q {
    flex: 1 1 220px; min-width: 180px; border: 1px solid var(--line); background: var(--panel);
    border-radius: 999px; padding: 8px 14px; font: inherit; font-size: 13px; color: var(--ink);
  }
  #q:focus { outline: 2px solid var(--ink); outline-offset: 1px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px; }
  .card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
  .card h3 { font-size: 16px; margin: 0; letter-spacing: -0.01em; }
  .card p { font-size: 13.5px; margin: 0; }
  .badges { display: flex; gap: 6px; flex-wrap: wrap; }
  .badge { font-size: 11px; padding: 3px 8px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); background: var(--soft); text-transform: lowercase; }
  .tier-source { background: #ecfdf5; border-color: #a7f3d0; color: #047857; }
  .tier-reference { background: #fffbeb; border-color: #fde68a; color: #b45309; }
  .tier-pattern { background: #eef2ff; border-color: #c7d2fe; color: #3730a3; }
  .status-needs-fix { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
  .status-inspiration-only { background: #fafaf9; border-color: #d6d3d1; color: #57534e; }
  .status-usable { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; margin: 2px 0; font-size: 12.5px; }
  dt { color: var(--muted); }
  dd { margin: 0; }
  .tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: auto; padding-top: 6px; }
  .tag { font-size: 11px; color: var(--muted); }
  .tag::before { content: "#"; opacity: 0.55; }
  .more { font-size: 13px; }
  #empty { display: none; margin-top: 24px; font-size: 14px; }
  footer { margin-top: 56px; border-top: 1px solid var(--line); padding-top: 18px; font-size: 12.5px; color: var(--muted); }
  [hidden] { display: none !important; }
  @media (max-width: 520px) { .wrap { padding-top: 36px; } h1 { font-size: 28px; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>UI Vault</h1>
    <p>A provenance-first index of UI and UX patterns. Third-party work stays attributed and, where rights require it, unhosted.</p>
    <div class="stats">
      <span><strong>${sources.length}</strong> sources</span>
      <span><strong>${references.length}</strong> references</span>
      <span><strong>${patterns.length}</strong> original patterns</span>
      <span><strong>${upstreamCount}</strong> upstream components</span>
      <span>generated ${generated}</span>
    </div>
  </header>

  <h2>Upstream libraries</h2>
  <div class="grid">
${upstreamCards}
  </div>

  <h2>Entries</h2>
  <div class="controls">
    <button class="filter" data-filter="all" aria-pressed="true">All</button>
    <button class="filter" data-filter="source" aria-pressed="false">Sources</button>
    <button class="filter" data-filter="reference" aria-pressed="false">References</button>
    <button class="filter" data-filter="pattern" aria-pressed="false">Library</button>
    <input id="q" type="search" placeholder="Filter by title, author, tag, stack" aria-label="Filter entries">
  </div>
  <div class="grid" id="entries">
${entryCards}
  </div>
  <p id="empty">No entries match that filter.</p>

  <footer>
    <p>Original work is MIT. See NOTICE.md and THIRD_PARTY.md. Attribution is not optional.</p>
  </footer>
</div>
<script>
  const buttons = [...document.querySelectorAll(".filter")];
  const input = document.getElementById("q");
  const cards = [...document.querySelectorAll(".entry-card")];
  const empty = document.getElementById("empty");
  let tier = "all";

  function apply() {
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      const matchesTier = tier === "all" || card.dataset.tier === tier;
      const matchesQuery = !query || card.dataset.search.includes(query);
      const show = matchesTier && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    }
    empty.style.display = visible ? "none" : "block";
  }

  for (const button of buttons) {
    button.addEventListener("click", () => {
      tier = button.dataset.filter;
      for (const other of buttons) other.setAttribute("aria-pressed", String(other === button));
      apply();
    });
  }
  input.addEventListener("input", apply);
</script>
</body>
</html>
`;

writeFileSync(join(root, "gallery.html"), html);

console.log(`Built catalog: ${entries.length} entries, ${upstreamCount} upstream components.`);
console.log("Wrote catalog.json, index.md, THIRD_PARTY.md, gallery.html");
