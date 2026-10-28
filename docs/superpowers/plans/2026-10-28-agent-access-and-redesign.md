# Agent Access and Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the 3D Machine reference, per-entry agent prompts, a free read-only API with MCP, a zero-dependency CLI, a link audit, and a redesigned site that shows Kone Tshivhinda as the owner.

**Architecture:** Markdown entries stay the source of truth. A build step adds prompt paths to `catalog.json` and embeds catalog plus prompt text into a dependency-free Cloudflare Worker. The Worker serves JSON, markdown prompts and a stateless MCP endpoint. The CLI and site read the Worker and fall back to the Pages catalog and local prompt copies.

**Tech Stack:** Node 24 (>=20), Cloudflare Workers, React 19, Vite 7, Tailwind CSS v4, Motion, self-hosted Instrument Serif, Geist and Geist Mono.

**Spec:** `docs/superpowers/specs/2026-10-28-agent-access-and-redesign-design.md`

## Global Constraints

- Node 20 or newer. CI uses Node 24.
- Zero runtime dependencies for the root scripts, Worker and CLI. The Worker uses the platform `fetch`, `crypto` and Web APIs only.
- Never copy, vendor or host source for `restricted`, `noncommercial`, `unknown` or `private-reference` entries.
- Every entry needs `prompt.md` with an explicit "do not copy" line when its rights are not `own` or `permissive`.
- No em dashes in new user-facing copy. Use commas, colons, parentheses or full stops.
- Site base path is `/ui-vault/`. All public links must work at `https://konethegreat.github.io/ui-vault/`.
- Owner links: `https://konethegreat.github.io/#top`, `https://github.com/konethegreat`, `https://www.linkedin.com/in/kone-tshivhinda-32a760233/`.
- Commit logical increments. Do not push until the Worker is deployed and verified.

---

### Task 1: Interactive 3D Machine entry and prompt

**Files:**
- Create: `references/interactive-3d-machine/entry.md`
- Create: `references/interactive-3d-machine/prompt.md`

**Interfaces:**
- Produces: catalog entry id `interactive-3d-machine`, `demo: link`, `demo_url: https://agentic-factory-3d.vercel.app`, `rights: private-reference`, `published_source: false`.

- [ ] **Step 1: Write the entry**

Frontmatter:

```yaml
id: interactive-3d-machine
title: Interactive 3D Machine
tier: reference
type: interaction
status: inspiration-only
stack: react, three.js, webgl, typescript
tags: 3d, three-js, product-tour, stations, camera, procedural
source_url: https://agentic-factory-3d.vercel.app
source_author: Evgeny Shilov (eugeneshilow); built with OpenAI Codex, ported to React by Claude
retrieved: 2026-10-28
license: unknown
rights: private-reference
published_source: false
demo: link
demo_url: https://agentic-factory-3d.vercel.app
```

Body sections: What it is, Why it is interesting, What to borrow, Reuse risks, Provenance. Record that the source has no license header, the template repository forbids redistributing templates, and the 21st.dev page claimed MIT without a record in the file. State that the code is not in this repository and must not be copied.

- [ ] **Step 2: Write the prompt**

Include: the goal (an original five-station 3D product machine in React and three.js), the five stations, four modes, five camera presets, procedural geometry, a small imperative control API, disposal of geometries, materials, textures and the renderer, `prefers-reduced-motion` support, an accessible label, and the requirement to keep the canvas decorative with real HTML controls. Start with `Do not copy the source`, name Evgeny Shilov and the live URL, and end with the attribution line.

- [ ] **Step 3: Validate**

Run: `npm run check`
Expected: 12 entries, no errors.

- [ ] **Step 4: Commit**

```bash
git add references/interactive-3d-machine
git commit -m "Add Interactive 3D Machine as a link-only reference"
```

---

### Task 2: Agent prompts for every entry

**Files:**
- Create: `references/animated-rocket-hero/prompt.md`
- Create: `references/animated-shiny-text/prompt.md`
- Create: `references/dot-pattern/prompt.md`
- Create: `references/liquid-sculpture-hero/prompt.md`
- Create: `references/marquee/prompt.md`
- Create: `references/number-ticker/prompt.md`
- Create: `sources/magic-ui/prompt.md`
- Create: `sources/react-bits/prompt.md`
- Create: `sources/shadcn-ui/prompt.md`
- Create: `library/button/prompt.md`
- Create: `library/nebula-hero/prompt.md`
- Modify: `scripts/validate.mjs`
- Modify: `scripts/build-catalog.mjs`
- Modify: `site/scripts/sync-data.mjs`
- Modify: `template/entry.md`
- Modify: `package.json`

**Interfaces:**
- Produces: each entry folder has `prompt.md`; catalog entries gain `"prompt": "<tier>/<id>/prompt.md"`; site gets `site/public/prompts/<id>.md` for every entry.
- Produces: `npm run validate` fails when a prompt is missing, too short, or lacks "do not copy" for non-permissive rights.

- [ ] **Step 1: Write the eleven prompts**

Each prompt is 25 to 60 lines with these headings:

```markdown
# Build TITLE in a project

Source: AUTHOR, SOURCE URL, LICENSE.
Rights: RIGHTS. Copy policy: COPY OR DO NOT COPY.

## Goal
One paragraph of concrete intent.

## Use it when
- Two or three situations.

## Build steps
1. Install or copy step that matches the rights.
2. Files to create.
3. Acceptance details.

## Requirements
- Accessibility, reduced motion, responsive behavior, performance.

## Do not
- The specific failure modes from the entry.

## Verify
- Three checks the agent can run.

## Attribution
Adapted from TITLE by AUTHOR (URL), LICENSE.
```

Rights-specific opening:

- `own`: "Copy the published files from `library/<id>/`, keep the MIT attribution line."
- `permissive`: "Copy the vendored files from `references/<id>/` or install from upstream, keep the author, source and license."
- `restricted` (React Bits source, animated rocket): "Do not copy the source. Use it only inside an application under its terms; never redistribute the component itself."
- `unknown` / `private-reference` (3D, rocket): "Do not copy the source. Read the notes, then write an original implementation and credit the inspiration."

- [ ] **Step 2: Add validator checks**

In `scripts/validate.mjs`, after the file checks add:

```js
const promptPath = join(dir, "prompt.md");
if (!existsSync(promptPath)) {
  fail("missing prompt.md");
} else {
  const prompt = readFileSync(promptPath, "utf8");
  if (prompt.trim().length < 200) fail("prompt.md must be at least 200 characters");
  if (!/^#\s/m.test(prompt)) fail("prompt.md must start with a heading");
  if (["restricted", "noncommercial", "unknown", "private-reference"].includes(d.rights)) {
    if (!/do not copy/i.test(prompt)) fail('prompt.md must say "do not copy" for non-copyable rights');
  }
}
```

Import `readFileSync` from `node:fs`.

- [ ] **Step 3: Add prompt fields to the catalog**

In `toEntry`, add:

```js
prompt: `${entry.folder}/${d.id}/prompt.md`,
prompt_url: `${API_BASE}/api/entries/${d.id}/prompt`,
```

Define `const API_BASE = "https://ui-vault-api.PLACEHOLDER.workers.dev";` in this task and replace it with the deployed URL in Task 3, before the catalog is regenerated for release. The field must exist in the output.

- [ ] **Step 4: Copy prompts to the site**

In `site/scripts/sync-data.mjs`, read `site/../catalog.json` and copy each entry's `prompt` file to `site/public/prompts/<id>.md`. Create the directory first. Log the count.

- [ ] **Step 5: Update the template**

Add a `prompt.md` requirement to `template/entry.md` under a `# Agent prompt` section, including the rights table and the "do not copy" rule.

- [ ] **Step 6: Test**

Run: `npm run check`
Expected: `Validated 12 entries. No errors.` and the prompt files appear in `site/public/prompts/`.

Temporarily rename one prompt and run `npm run validate` to confirm the failure, then restore it.

- [ ] **Step 7: Commit**

```bash
git add references sources library template scripts/build-catalog.mjs scripts/validate.mjs site/scripts/sync-data.mjs
git commit -m "Add agent-ready setup prompts for every entry"
```

---

### Task 3: Worker data, API and MCP, deployed before the site

**Files:**
- Create: `scripts/build-worker-data.mjs`
- Create: `worker/package.json`
- Create: `worker/wrangler.jsonc`
- Create: `worker/src/search.js`
- Create: `worker/src/mcp.js`
- Create: `worker/src/index.js`
- Create: `worker/src/data.json` (generated, committed)
- Create: `worker/test/mcp.test.mjs`
- Modify: `package.json`
- Modify: `scripts/build-catalog.mjs` (replace the API placeholder with the deployed URL)

**Interfaces:**
- Produces: `filterEntries(entries, params)`, `getEntry(entries, id)`, `filterComponents(upstream, params)`.
- Produces: `handleRpc(payload, data)` returning `{ status, body, headers? }` with JSON-RPC semantics.
- Produces: deployed `https://ui-vault-api.<subdomain>.workers.dev`.

- [ ] **Step 1: Write the data generator**

`scripts/build-worker-data.mjs` reads `catalog.json`, reads each entry's `prompt.md`, and writes:

```json
{
  "generated": "YYYY-MM-DD",
  "counts": {},
  "entries": [{ "id": "...", "prompt": "..." }],
  "upstream": [{ "id": "magic-ui", "library": "Magic UI", "components": [] }]
}
```

Strip `prompt_url` from stored entries; the Worker computes it from the request origin. Add `"build:worker": "node scripts/build-worker-data.mjs"` and wire it into `check` after `build`.

- [ ] **Step 2: Write pure search helpers**

`worker/src/search.js`:

```js
export function normalize(value) {
  return String(value ?? "").toLowerCase();
}

export function filterEntries(entries, params = {}) {
  const q = normalize(params.q).trim();
  const tier = normalize(params.tier);
  const type = normalize(params.type);
  const tag = normalize(params.tag);
  const demo = normalize(params.demo);
  const limit = Math.min(Math.max(Number(params.limit) || 100, 1), 500);
  const matches = entries.filter((entry) => {
    if (tier && normalize(entry.tier) !== tier) return false;
    if (type && normalize(entry.type) !== type) return false;
    if (demo && normalize(entry.demo) !== demo) return false;
    if (tag && !entry.tags.some((item) => normalize(item) === tag)) return false;
    if (!q) return true;
    return [entry.id, entry.title, entry.summary, entry.source_author, entry.type, ...entry.tags]
      .some((value) => normalize(value).includes(q));
  });
  return { total: matches.length, entries: matches.slice(0, limit) };
}
```

Add `getEntry` (by id) and `filterComponents` (flatten `upstream[].components`, filter by `q` and `library`, return `{ id, library, name, category, install, repo, license, rights }`).

- [ ] **Step 3: Write MCP dispatch**

`worker/src/mcp.js` exports `TOOLS` and `handleRpc`. Protocol versions: `["2025-06-18", "2025-03-26", "2024-11-05"]`. For a single or batch request, produce JSON-RPC responses for messages with an `id`; accept notifications with 202. Methods: `initialize`, `ping`, `tools/list`, `tools/call`; anything else returns `-32601`. Tool definitions:

- `search_entries`: `{ q, tier, type, tag, demo, limit }`, all optional.
- `get_entry`: `{ id }` required.
- `get_setup_prompt`: `{ id }` required.
- `search_components`: `{ q, library, limit }`.

Each tool sets `annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }`. `tools/call` returns:

```js
{
  content: [{ type: "text", text: JSON.stringify(structured, null, 2) }],
  structuredContent: structured,
  isError: false
}
```

Missing ids return `isError: true` with a short message, not a JSON-RPC error. Invalid arguments return `-32602`.

- [ ] **Step 4: Write the Worker entry**

`worker/src/index.js` imports `data.json`, `handleRpc`, the search helpers. Routes exactly as the spec. Include:

```js
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version",
  "Access-Control-Max-Age": "86400",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};
```

`GET /api/entries` and `/api/components` apply `Cache-Control: public, max-age=300, stale-while-revalidate=86400`. Prompts use `text/markdown; charset=utf-8` and `max-age=600`. `POST /mcp` returns JSON (never SSE) with `MCP-Protocol-Version` echoed when supplied. `GET /mcp` returns 405 with `Allow: POST`. Unknown paths return 404 JSON. Rate limit 120 per minute per `CF-Connecting-IP` with an in-memory `Map`, cleanup above 5000 keys, `429` and `Retry-After: 60`.

Entry detail returns the entry without `prompt` plus `prompt_url`; prompt route returns the text. List entries return a lean shape and never the prompt body.

- [ ] **Step 5: Write tests**

`worker/test/mcp.test.mjs` with `node:test` covers:

- `initialize` echoes a supported protocol version.
- `tools/list` returns four read-only tools.
- `tools/call` `search_entries` with `q=liquid` finds `liquid-sculpture-hero`.
- `get_entry` for a missing id returns `isError: true`.
- `get_setup_prompt` returns text containing "Attribution".
- Unknown method returns `-32601`.
- Notification-only batch returns status 202.

Run: `npm run test:worker` (add `"test:worker": "node --test worker/test/mcp.test.mjs"`).
Expected: all tests pass.

- [ ] **Step 6: Configure and deploy**

`worker/wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "ui-vault-api",
  "main": "src/index.js",
  "compatibility_date": "2026-10-28",
  "workers_dev": true,
  "observability": { "enabled": true }
}
```

`worker/package.json` is private with `"type": "module"` and a `deploy` script.

Run:

```bash
node scripts/build-worker-data.mjs
cd worker && npx --yes wrangler@latest deploy
```

Record the printed `https://ui-vault-api.<subdomain>.workers.dev` URL. Replace `API_BASE` in `scripts/build-catalog.mjs` and the CLI constant with it, then rerun `npm run check`.

- [ ] **Step 7: Verify the live Worker**

```bash
curl -s https://ui-vault-api.<subdomain>.workers.dev/api/health
curl -s "https://ui-vault-api.<subdomain>.workers.dev/api/entries?q=liquid"
curl -s https://ui-vault-api.<subdomain>.workers.dev/api/entries/liquid-sculpture-hero/prompt | head
curl -s -X POST https://ui-vault-api.<subdomain>.workers.dev/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1"}}}'
curl -s https://ui-vault-api.<subdomain>.workers.dev/api/entries/nope
```

Expected: health JSON, a filtered result, markdown, an initialize result with the same protocol version, and a 404 JSON. Record results in the commit message.

- [ ] **Step 8: Commit**

```bash
git add worker scripts/build-worker-data.mjs scripts/build-catalog.mjs package.json catalog.json
git commit -m "Add read-only Worker API and MCP, deploy ui-vault-api"
```

---

### Task 4: Zero-dependency CLI

**Files:**
- Create: `bin/ui-vault.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `ui-vault` bin with `list`, `search`, `show`, `prompt`, `api`, `--json`.
- Reads: Worker routes from Task 3; fallback to `https://konethegreat.github.io/ui-vault/catalog.json` and `https://raw.githubusercontent.com/konethegreat/ui-vault/main/<prompt>`.

- [ ] **Step 1: Implement the CLI**

Use `process.argv.slice(2)`, `fetch` with `AbortSignal.timeout(8000)`, and `readFile` from `node:fs/promises` for local prompt fallback. Keep it one file. `list` supports `--tier`, `--type`, `--tag`, `--demo`. `search` joins the remaining words. `show` prints title, tier, rights, author, license, summary, source, demo, prompt path and a next command. `prompt` prints the markdown only, so it can be piped. `api` prints the endpoint table. `--json` prints the raw API payload. Exit 1 with a message for unknown commands, missing ids and network failure after fallbacks.

- [ ] **Step 2: Register the bin**

Add:

```json
"bin": { "ui-vault": "bin/ui-vault.mjs" },
"files": ["bin", "catalog.json", "README.md", "NOTICE.md", "LICENSE"],
```

Add shebang `#!/usr/bin/env node` and keep the file executable in git (`git update-index --chmod=+x bin/ui-vault.mjs` on Windows or set via `git add --chmod=+x`).

- [ ] **Step 3: Test locally**

```bash
node bin/ui-vault.mjs list --tier reference
node bin/ui-vault.mjs search liquid
node bin/ui-vault.mjs show liquid-sculpture-hero
node bin/ui-vault.mjs prompt liquid-sculpture-hero | head -20
node bin/ui-vault.mjs list --json | head
node bin/ui-vault.mjs show nope
```

Expected: tables, JSON with `--json`, prompt markdown, and a friendly non-zero error for the missing id.

- [ ] **Step 4: Commit**

```bash
git add bin/ui-vault.mjs package.json
git commit -m "Add zero-dependency ui-vault CLI"
```

---

### Task 5: Link audit

**Files:**
- Create: `scripts/audit-links.mjs`
- Create: `scripts/link-allowlist.txt`
- Modify: `package.json`

- [ ] **Step 1: Implement the audit**

Collect URLs from `catalog.json` (`source_url`, `license_url`, `demo_url`, `prompt_url`, upstream `source_url` and `repo`) and from `README.md`, `AGENTS.md`, `NOTICE.md`, `THIRD_PARTY.md`, `index.md`, `site/index.html` and every `site/src/**/*.{ts,tsx}` file. Deduplicate. Skip `mailto:`, `tel:`, relative URLs, `localhost`, `%BASE_URL%` and `https://schema.org`.

Check with `HEAD` and `redirect: "follow"`, 10 second timeout, concurrency 6. Retry with `GET` when HEAD returns 403, 405 or 429. Classify `ok` (2xx), `redirect` (3xx after follow, informational), `inconclusive` (401, 403, 405, 429, 5xx, timeout), `broken` (404, 410). Read `scripts/link-allowlist.txt` as `<url> <reason>` and mark allowlisted broken URLs separately. Print a summary table and exit 1 only for non-allowlisted 404/410.

- [ ] **Step 2: Run it**

Run: `npm run audit`
Expected: a table. Fix every real 404 in entries or site code. Add only genuinely bot-blocked URLs to the allowlist, each with a reason. Do not allowlist a 404.

- [ ] **Step 3: Commit**

```bash
git add scripts/audit-links.mjs scripts/link-allowlist.txt package.json
git commit -m "Add link audit and fix broken references"
```

---

### Task 6: Site foundation, fonts and data layer

**Files:**
- Create: `site/public/fonts/instrument-serif.woff2`
- Create: `site/public/fonts/instrument-serif-italic.woff2`
- Create: `site/public/fonts/geist.woff2`
- Create: `site/public/fonts/geist-mono.woff2`
- Create: `site/src/lib/catalog.ts`
- Create: `site/src/hooks/useReveal.ts`
- Create: `site/src/components/DemoFrame.tsx`
- Modify: `site/src/styles.css`
- Modify: `site/index.html`

**Interfaces:**
- Produces: `Entry`, `Catalog`, `useCatalog()`, `fetchPrompt(entry)`, `copyText(text)`, `useReveal<T>()`.
- Produces: CSS variables `--paper`, `--paper-2`, `--ink`, `--graphite`, `--graphite-2`, `--amber`, `--line`, and font families `--font-display`, `--font-sans`, `--font-mono`.

- [ ] **Step 1: Self-host fonts**

Download latin woff2 files from Google Fonts with a browser user agent. Save only the latin subsets. Add `@font-face` blocks with `font-display: swap`:

- Instrument Serif 400 normal and italic.
- Geist variable 400 to 700.
- Geist Mono variable 400 to 600.

Preload `geist.woff2` and `instrument-serif.woff2` in `site/index.html`.

- [ ] **Step 2: Replace the stylesheet tokens**

Keep the Tailwind imports and shadcn token bridge. Add the palette, fonts, `body` background `--paper`, selection in amber, `.font-display`, `.label` (mono, uppercase, tracking), `.reveal` / `.is-visible`, hero stagger keyframes, card hover lift, and a `prefers-reduced-motion` block that disables reveal transforms and continuous animations. Keep the global focus ring but make it amber on dark sections via `.on-dark :focus-visible`.

- [ ] **Step 3: Add the data layer**

`site/src/lib/catalog.ts` exports:

```ts
export const REPO = "https://github.com/konethegreat/ui-vault";
export const API = "https://ui-vault-api.<subdomain>.workers.dev";
export const OWNER = { name: "Kone Tshivhinda", portfolio: "...", github: "...", linkedin: "..." };

export type Entry = { ... prompt: string; prompt_url: string };
export function useCatalog(): { catalog: Catalog | null; error: string };
export async function fetchPrompt(entry: Entry): Promise<string>;
export async function copyText(text: string): Promise<boolean>;
```

`fetchPrompt` tries the Worker prompt URL with a 4 second timeout, then `${import.meta.env.BASE_URL}prompts/${entry.id}.md`, then throws. `copyText` uses `navigator.clipboard.writeText` and falls back to a hidden textarea plus `document.execCommand("copy")`.

- [ ] **Step 4: Add reveal hook and frame**

`useReveal` returns a ref and adds `is-visible` when the element enters the viewport, once. If `prefers-reduced-motion` matches, add the class immediately.

`DemoFrame` keeps the existing API (`id`, `index`, `title`, `credit`, `note`, `bleed`, `children`) but renders a dark stage: graphite card, thin light border, mono index in amber, credit links, and a preview area with a min height. Keep `id={`demo-${id}`}` and `scroll-mt-24`.

- [ ] **Step 5: Build**

Run: `cd site && npm run build`
Expected: typecheck and Vite build pass.

- [ ] **Step 6: Commit**

```bash
git add site/public/fonts site/src/lib site/src/hooks site/src/components/DemoFrame.tsx site/src/styles.css site/index.html
git commit -m "Add site design tokens, self-hosted fonts and data layer"
```

---

### Task 7: Site sections and ownership

**Files:**
- Create: `site/src/components/SiteHeader.tsx`
- Create: `site/src/components/Hero.tsx`
- Create: `site/src/components/MachineSketch.tsx`
- Create: `site/src/components/Demos.tsx`
- Create: `site/src/components/UseVault.tsx`
- Create: `site/src/components/CatalogSection.tsx`
- Create: `site/src/components/Rights.tsx`
- Create: `site/src/components/SiteFooter.tsx`
- Modify: `site/src/App.tsx`
- Modify: `site/index.html`

**Interfaces:**
- Consumes: `useCatalog`, `fetchPrompt`, `copyText`, `useReveal`, `DemoFrame`, vendor components.
- Produces: one page with `#top`, `#demos`, `#use`, `#catalog`, `#rights` anchors and working actions.

- [ ] **Step 1: Header**

Dark sticky header. Brand monogram `UV` in amber, "UI Vault", a vertical rule, then "Kone Tshivhinda" as a link to the portfolio, visible at every width (on mobile it wraps under the brand, never hidden). Desktop nav: Demos, Catalog, Use, Rights, GitHub. Mobile: a real button with `aria-expanded` and `aria-controls` toggling a panel of the same links; close on link click and Escape. Skip link stays.

- [ ] **Step 2: Hero**

Render `NebulaHero` with:

```tsx
eyebrow="UI Vault · by Kone Tshivhinda"
headline="Interfaces, with the credits attached."
body="A working index of UI patterns ... live demos ... every third-party design named and licensed."
primaryCta={{ label: "Browse the catalog", href: "#catalog" }}
secondaryCta={{ label: "Use the vault", href: "#use" }}
height="min(88svh, 780px)"
```

Below it, a dark strip with a `Marquee` of entry names (aria-hidden) plus an `sr-only` list, and a row of stats using `NumberTicker` for entries, demos and upstream components, each with a label. Add the byline row: "Designed and maintained by Kone Tshivhinda" with portfolio, GitHub and LinkedIn links. Use `AnimatedShinyText` for the small "Open source, read-only API" status line above the stats.

- [ ] **Step 3: Demos**

Paper section header "01 / Live demos" with count. Dark stage frames:

1. Liquid Sculpture Hero, third-party MIT, existing demo.
2. Nebula Hero, own MIT, existing demo.
3. Button, own MIT, existing demo.
4. Marquee, Magic UI MIT, credit links.
5. Animated Shiny Text, Magic UI MIT.
6. Number Ticker, Magic UI MIT.
7. Dot Pattern, Magic UI MIT.

Then a full-width `MachineSketch` card for the 3D Machine: dark panel with an original SVG isometric illustration of five stations, a moving scan line (CSS, reduced-motion aware), the label "External reference, not hosted here", a short description, and an external link to the live demo plus the entry. No third-party code or screenshots.

- [ ] **Step 4: Use the vault**

Three tabs implemented with buttons and `aria-selected`, panels with `role="tabpanel"`:

- CLI: `npx github:konethegreat/ui-vault search "liquid"` and a second command `... prompt liquid-sculpture-hero`.
- API: `curl -s ${API}/api/entries?tier=reference` and a route list.
- MCP: the JSON config with `"url": "${API}/mcp"`.

Each code block has a copy button built from the vault `Button` (`variant="secondary" size="sm"`), with a live "Copied" label and `aria-live`. Add a "Check the API" button that fetches `/api/health` and shows `ok`, counts or a friendly offline message. Link to `README.md#agent-access` for the full reference.

- [ ] **Step 5: Catalog**

Warm paper section with a `DotPattern` backdrop (`text-stone-900/10`, radial mask). Keep the tier filters and search, but restyle as amber-on-paper. Cards show tier, type, title, author, license, summary, and actions:

- `Copy prompt` (fetch and copy, shows "Copied" or "Copy failed").
- `Entry` (GitHub blob).
- `Source` (only when present).
- `Live demo` anchor or `Original demo` external link.

Show the visible count and `aria-live`. On fetch error, link to the repository.

- [ ] **Step 6: Rights and footer**

Rights: three tiers on paper with amber numbering and a note that the validator rejects unlicensed demos. Footer: dark, owner name and byline links, repository, third-party credits, Magic UI license, sculpture license, MIT license, and "Original work MIT. Third-party work stays with its authors."

- [ ] **Step 7: Metadata**

In `site/index.html`:

- Title: `UI Vault · Kone Tshivhinda`
- Description naming Kone and the provenance index.
- `theme-color` `#0f0f0e`.
- Open Graph and Twitter tags with title, description, type `website`.
- JSON-LD `Person` (`name`, `url`, `sameAs` portfolio, GitHub, LinkedIn) and `WebSite` (`name`, `url`, `author`).

- [ ] **Step 8: Compose the app**

`App.tsx` imports the sections, keeps the skip link, and removes the old inline sections. No dead buttons: every anchor resolves to an id on the page or an external URL.

- [ ] **Step 9: Build and inspect**

Run: `cd site && npm run build`
Expected: build succeeds. Then `npm run dev` and use the browser.

- [ ] **Step 10: Commit**

```bash
git add site/src site/index.html
git commit -m "Redesign site with motion, live stages and clear ownership"
```

---

### Task 8: Documentation, CI and deployment

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `NOTICE.md`
- Modify: `template/entry.md`
- Modify: `.github/workflows/check.yml`
- Modify: `.github/workflows/deploy.yml`
- Modify: `index.md` (generated)
- Modify: `THIRD_PARTY.md` (generated)
- Modify: `catalog.json` (generated)

- [ ] **Step 1: Document agent access**

README gets an `## Agent access` section with the API routes, MCP config, CLI examples, rights behavior and the update procedure. Mention the 3D entry, its unknown license and why it is link-only. Update the counts and demo table. AGENTS gets prompt rules and the new fields. NOTICE gets the 3D entry in the not-hosted list. Template gets the prompt requirement if not already done.

- [ ] **Step 2: Update CI**

`check.yml`: after `npm run check`, run `node --check worker/src/index.js`, `npm run test:worker`, and `git diff --exit-code catalog.json worker/src/data.json` to catch drift (regenerate first). `deploy.yml`: add `worker/src/data.json`, `docs/**` is not needed; keep the build path. The site deploy does not deploy the Worker, which is manual by design.

- [ ] **Step 3: Full local verification**

```bash
npm run check
npm run audit
npm run test:worker
cd site && npm run build
```

Expected: all pass, no broken links, 12 entries with prompts.

- [ ] **Step 4: Browser verification**

Start `npm run dev` in `site`. At 1440px and 390px verify:

- No console errors and no horizontal scroll.
- Hero shader renders, reduced motion stops it.
- All seven demos run; the 3D card links out and is labelled external.
- Catalog filters and search work; Copy prompt works and shows "Copied".
- Use-vault tabs switch, copy works, health check returns ok.
- Mobile menu opens, closes on Escape and link click.
- Owner name is visible at both widths.
- All external links and license links resolve.

- [ ] **Step 5: Deploy and verify live**

Push to `main`. Wait for the Pages workflow, then open `https://konethegreat.github.io/ui-vault/` and repeat the essential checks. Verify `npx --yes github:konethegreat/ui-vault list` against the pushed repository.

- [ ] **Step 6: Final commit**

```bash
git add README.md AGENTS.md NOTICE.md template/entry.md .github catalog.json index.md THIRD_PARTY.md gallery.html worker/src/data.json
git commit -m "Document agent access and wire CI for prompts and Worker"
```

## Self-Review

- Spec coverage: entry (Task 1), prompts (Task 2), Worker and deployment order (Task 3), CLI (Task 4), link audit (Task 5), site foundation and sections (Tasks 6 and 7), documentation and verification (Task 8). All spec sections map to a task.
- Placeholder scan: the only literal placeholder is `API_BASE` in Task 2, which Task 3 replaces with the deployed URL before release; Task 3 Step 6 states the replacement explicitly.
- Type consistency: catalog fields `prompt` and `prompt_url` are defined in Task 2 and consumed by Task 4 and Task 6. Worker helpers in Task 3 use the same names in tests and routes. `fetchPrompt`, `copyText` and `useCatalog` are defined in Task 6 and used in Task 7.
