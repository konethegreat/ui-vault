# Agent access and site redesign

Date: 2026-10-28
Status: approved
Owner: Kone Tshivhinda

## Problem

The vault is useful to a human who browses the repository, but an agent that lands on it has to read every entry and infer how to use it. The site also looks plain, hides its ownership below the fold, and gives no machine path to the data. Some catalog links have never been checked.

This phase adds one new reference, makes every entry usable through a copy-paste prompt, exposes the vault through a free read-only API, CLI and MCP server, audits the links, and rebuilds the site around the components already in the vault.

## Goals

1. Add the Interactive 3D Machine as a link-only reference. The source has no license, so its code is never hosted or copied.
2. Give every entry a `prompt.md` that an agent can follow without further reading.
3. Serve the catalog, entries and prompts from a free Cloudflare Worker with a read-only JSON API and a stateless MCP endpoint.
4. Ship a zero-dependency CLI runnable with `npx github:konethegreat/ui-vault`.
5. Audit every URL in the catalog and site, fix real 404s, and report the rest.
6. Redesign the site with purposeful motion, a light and dark hybrid, and Kone Tshivhinda visible as the owner in the header, hero, metadata, footer and JSON-LD.
7. Use the vault's own Button, Nebula Hero, Liquid Sculpture, Marquee, Animated Shiny Text, Number Ticker and Dot Pattern in the site composition, with credits kept.

## Non-goals

- No write API, authentication, accounts or database. Everything is public and read-only.
- The Worker never fetches arbitrary URLs, proxies external sites, or reads secrets.
- No restricted or unknown-license source is vendored, hosted or embedded.
- No framework migration. The site stays React, Vite and Tailwind.
- No paid service. Cloudflare Workers free plan and GitHub Pages only.

## Data model

`prompt.md` sits beside `entry.md` in every entry folder. It is prose written for an agent, not a template render, so each one can describe pitfalls specific to that entry.

The catalog gains `prompt`, the repository-relative path, and `prompt_url`, the Worker URL after deployment. The Worker data file embeds each prompt body so a request never reads the filesystem.

Prompts differ by rights:

| Rights | Prompt stance |
| --- | --- |
| `own` | Copy the published files, keep the MIT attribution line, adapt freely. |
| `permissive` | Copy the published files or install upstream, keep the author, source and license, list local edits. |
| `restricted` | Use inside an application only, never redistribute the component itself. |
| `noncommercial`, `unknown`, `private-reference` | Do not copy the source. Read the notes, then write an original implementation and credit the inspiration. |

Every prompt ends with a verification checklist and an attribution line. The validator requires a prompt of at least 200 characters for every entry, and for `restricted`, `noncommercial`, `unknown` and `private-reference` rights it requires an explicit "do not copy" instruction.

## Interactive 3D Machine

A React and three.js scene of a short-video factory with five stations (engine, admin, storefront, cabinet, cashdesk), four modes, five cameras, hover and click inspection, and a `window.__machine` control API. It is procedural: no models and no images. Built by Evgeny Shilov with OpenAI Codex and ported to React by Claude.

The distribution has no license header, the template repository forbids redistributing the templates, and the 21st.dev page claimed MIT without a record in the source. Stricter reading wins: `rights: private-reference`, `license: unknown`, `published_source: false`, `demo: link` to `https://agentic-factory-3d.vercel.app`. The entry documents the techniques worth reimplementing and the defects, and the prompt forbids copying.

## Worker

One Worker named `ui-vault-api`, plain JavaScript, no runtime dependencies. Data is generated from `catalog.json` and `prompt.md` files by `scripts/build-worker-data.mjs`.

Routes:

| Route | Response |
| --- | --- |
| `GET /` | Service description, counts and links. |
| `GET /api/health` | `{ ok, generated, counts }`. |
| `GET /api/entries` | Filter by `q`, `tier`, `type`, `tag`, `demo`, `limit`. Returns `{ total, count, entries }`. |
| `GET /api/entries/:id` | One entry plus its prompt text. |
| `GET /api/entries/:id/prompt` | `text/markdown` prompt. |
| `GET /api/components` | Filter upstream components by `q` and `library`. |
| `POST /mcp` | Stateless MCP JSON-RPC over Streamable HTTP. |

Behavior:

- CORS `*`, `Access-Control-Allow-Methods: GET, POST, OPTIONS`, JSON-RPC headers allowed.
- `Cache-Control: public, max-age=300, stale-while-revalidate=86400`.
- Best-effort per-IP limit of 120 requests a minute in isolate memory. Over the limit returns 429 with `Retry-After`. This is not a security boundary, only a courtesy limit.
- Unknown ids return 404 JSON. Unknown routes return 404 JSON. Errors never include a stack.
- MCP supports `initialize`, `notifications/initialized`, `ping`, `tools/list`, `tools/call`, and rejects everything else with JSON-RPC `-32601`. It accepts a single message or a batch. Notifications return 202. Tool calls return `content: [{ type: "text", text }]` plus `structuredContent`.
- Tools: `search_entries`, `get_entry`, `get_setup_prompt`, `search_components`. All read-only and annotated `readOnlyHint: true`, `destructiveHint: false`.

## CLI

`bin/ui-vault.mjs`, Node 20+, no dependencies, `fetch` only.

```
npx github:konethegreat/ui-vault list [--tier reference] [--json]
npx github:konethegreat/ui-vault search <query> [--json]
npx github:konethegreat/ui-vault show <id> [--json]
npx github:konethegreat/ui-vault prompt <id>
npx github:konethegreat/ui-vault api
```

The CLI calls the Worker. If the Worker is unreachable, it falls back to the Pages `catalog.json` for listing and to raw GitHub content for prompts, so it keeps working if the Worker is down. Output is plain text for humans and JSON for `--json`. Unknown commands and missing ids exit non-zero with a short message.

## Link audit

`scripts/audit-links.mjs` collects every `source_url`, `license_url` and `demo_url` from the catalog, plus URLs in `README.md`, `AGENTS.md`, `NOTICE.md`, `THIRD_PARTY.md` and `site/src`. It checks with `HEAD`, falls back to `GET` on 405 or 403, uses a 10 second timeout and concurrency 6. Results are `ok`, `redirect`, `inconclusive` (401/403/429/5xx or network timeout) and `broken` (404/410). Broken links fail the command. A committed `scripts/link-allowlist.txt` lists URLs that are known to block automated checks, with a reason.

## Site

### Visual direction

A light and dark hybrid. The hero and demo stages are graphite and near-black; the catalog and reading sections are warm paper. Amber is the only accent. Instrument Serif for display, Geist for text, Geist Mono for labels and commands. Fonts are self-hosted under `site/public/fonts/` to avoid a third-party request and layout shift.

### Sections

1. Header: compact brand, owner name "Kone Tshivhinda" visible at every width, nav, GitHub link, theme-safe focus rings. Mobile menu is a real disclosure button with `aria-expanded`.
2. Hero: dark stage with the Nebula shader at low opacity, a dot grid, an Animated Shiny Text status line, the headline, two Button-component actions, a byline linking the portfolio, GitHub and LinkedIn, and Number Ticker stats. Staggered reveal, reduced-motion aware.
3. Live demos: a dark stage per component. Liquid Sculpture, Nebula, Button, Marquee, Shiny Text, Number Ticker and Dot Pattern keep their credits and notes. The 3D Machine appears as a linked external reference with an original CSS illustration, clearly marked "not hosted here".
4. Use the vault: three tabs (CLI, API, MCP) with copy buttons, a live health check against the Worker, and the MCP config snippet.
5. Catalog: warm paper, Dot Pattern backdrop, search and tier filters, cards with a working "Copy prompt" button and a link to the entry, source and demo. Prompt text is fetched from the Worker with the local catalog as fallback.
6. Rights and footer: the three rights tiers, owner byline, repository, credits, license links and JSON-LD.

### Motion and accessibility

- Hero reveal and section reveals use CSS transitions driven by an IntersectionObserver hook, not a continuous scroll loop.
- Marquee, Shiny Text and shader motion are the only continuous animations and stop under `prefers-reduced-motion`.
- Copy buttons announce "Copied" and fall back to selecting the text when the clipboard API is unavailable.
- Every interactive control is keyboard reachable, has a visible focus ring and an accessible name.
- No horizontal overflow at 320px. Nav collapses without hiding the owner name.

### Ownership

"Kone Tshivhinda" appears in the document title, meta description, Open Graph tags, JSON-LD `Person` and `WebSite`, header, hero byline and footer. Byline links: portfolio `https://konethegreat.github.io/#top`, GitHub `https://github.com/konethegreat`, LinkedIn `https://www.linkedin.com/in/kone-tshivhinda-32a760233/`. Third-party authors remain credited in their frames and in `THIRD_PARTY.md`.

## Deployment order

1. Validate and commit entries and prompts.
2. Generate worker data, deploy `ui-vault-api` with Wrangler, and verify every route and an MCP handshake.
3. Wire the live Worker URL into the catalog, CLI, site and docs.
4. Run the link audit and fix broken URLs.
5. Rebuild and deploy the site to Pages.
6. Verify desktop and mobile in a browser: demos, catalog filters, prompt copy, API and MCP.

Worker deploys are manual because CI holds no Cloudflare token. CI runs `node --check` on the Worker entry and regenerates the data file to catch drift. The site workflow is unchanged apart from new paths.

## Risks

- Cloudflare free plan limits are generous for reads but the Worker can be cold. The site must render without it, so every Worker call has a local fallback.
- The 3D entry has no license, so the temptation to copy it is highest. The validator, prompt and site label all enforce link-only.
- Self-hosted fonts add repository weight. Only the latin subsets are committed.
- A redesign can break the demo stages. The existing demo wrappers and vendor copies stay unchanged, so only chrome moves.

## Verification

- `npm run check` passes with 12 entries and a prompt on each.
- `npm run audit` reports no broken links or lists only documented allowlisted ones.
- Worker routes return the expected JSON, 404 and 429 behavior; an MCP `initialize` and `tools/list` round-trip succeeds.
- CLI list, search, show, prompt and `--json` work from `npx` against the live Worker.
- `npm run build` in `site/` typechecks and builds.
- Browser checks at 1440px and 390px: no console errors, no horizontal overflow, demos run, copy works, nav works, credits present.
- The live site and Worker are reachable after deploy.
