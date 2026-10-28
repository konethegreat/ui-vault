# UI Vault

A public, provenance-first index of UI and UX patterns I use across projects. It is a reference library, not a component package. Every entry says where it came from, who made it and what its license allows.

Live site: [konethegreat.github.io/ui-vault](https://konethegreat.github.io/ui-vault/)

Most of the value is in three places: `catalog.json` for tools and agents, `gallery.html` for a quick visual index, and the live site for demos that actually run.

Agents can also read the same catalog from a free hosted [API](#api), a zero-dependency [CLI](#cli) or a read-only [MCP server](#mcp). Every entry ships a copy-paste prompt at `prompt.md`.

## The three tiers

| Tier | What lives here | Can it be redistributed? |
| --- | --- | --- |
| `sources/` | External libraries I draw from: install commands, license, pinned commit, component index. | Links and facts only. No third-party code is hosted. |
| `references/` | Specific designs studied in detail: technique notes, authorship, known defects. | Only when the entry is `permissive` with a verified license, a `files` list and a visible credit. Otherwise metadata only. |
| `library/` | Patterns I authored. MIT licensed. | Yes. |

## Browse

- [index.md](index.md): every entry in tables, grouped by tier.
- [gallery.html](gallery.html): open in a browser for a visual index with filters.
- [catalog.json](catalog.json): machine-readable index, including component names for each upstream library.
- [THIRD_PARTY.md](THIRD_PARTY.md): attribution and license links for every source and reference.
- [Live site](https://konethegreat.github.io/ui-vault/): seven running demos, a searchable catalog and the rights policy.

## Agent access

All three surfaces are free, read-only and need no key or account. The API is rate limited to 120 requests per minute per IP.

### API

Base URL: `https://ui-vault-api.erictshivhinda.workers.dev`

| Route | Returns |
| --- | --- |
| `GET /api/health` | Status, generation date and entry counts. |
| `GET /api/entries` | Entries. Filter with `q`, `tier`, `type`, `tag`, `demo` and `limit`. |
| `GET /api/entries/{id}` | One entry with its `prompt_path` and `prompt_url`. |
| `GET /api/entries/{id}/prompt` | The entry's agent prompt as `text/markdown`. |
| `GET /api/components` | Upstream component names. Filter with `q` and `library`. |
| `POST /mcp` | Streamable HTTP MCP endpoint. |

```bash
curl -s "https://ui-vault-api.erictshivhinda.workers.dev/api/entries?tier=reference&q=liquid"
curl -s "https://ui-vault-api.erictshivhinda.workers.dev/api/entries/liquid-sculpture-hero/prompt"
```

Responses carry permissive CORS headers and edge caching. The API never returns third-party source code. It returns provenance, notes and the prompt that follows the entry's rights rules.

### CLI

The CLI runs on Node 20 or newer with no dependencies. It reads the hosted catalog and falls back to the copy published in this repository when the API is unavailable.

```bash
npx github:konethegreat/ui-vault list --demo live
npx github:konethegreat/ui-vault search liquid
npx github:konethegreat/ui-vault show liquid-sculpture-hero
npx github:konethegreat/ui-vault prompt liquid-sculpture-hero
```

Every command accepts `--json`. `prompt` prints markdown only, so it pipes into an agent or a file.

### MCP

Add the server to any MCP client that supports Streamable HTTP:

```json
{
  "mcpServers": {
    "ui-vault": {
      "url": "https://ui-vault-api.erictshivhinda.workers.dev/mcp"
    }
  }
}
```

The server is stateless and exposes four read-only tools: `search_entries`, `get_entry`, `get_setup_prompt` and `search_components`. It speaks protocol `2025-06-18` and keeps compatibility with `2025-03-26` and `2024-11-05`.

### Rights behaviour

The agent surfaces do not loosen the rights rules. Each prompt states what may be copied:

- `own` and `permissive` entries may be copied or installed with the attribution kept.
- `restricted` entries, including React Bits, may be used inside an application but never redistributed as components.
- `unknown`, `noncommercial` and `private-reference` entries are inspiration only. The prompt says "do not copy" and asks for an original implementation.

### Updating the hosted copy

Run `npm run check` to regenerate `catalog.json` and `worker/src/data.json`, then `npm run worker:deploy` to publish them. The site deploy does not touch the Worker; publishing the API is a deliberate separate step.


## Attributions that are not optional

1. Third-party work is credited by name and link in the entry, in `catalog.json` and in `THIRD_PARTY.md`.
2. Code is only hosted when its license permits it. The `published_source` flag, the `demo` rules and the validator enforce this.
3. When adapting a reference into a project, keep the credit line:

   `Adapted from TITLE by AUTHOR (URL), LICENSE.`

4. Original patterns in `library/` are mine and marked MIT. Nothing else is presented as mine.

## Live demo rules

An entry may set `demo: live` only when all of these are true:

- `rights` is `own` or `permissive`.
- `license` is known and not `unknown`.
- `demo_source` points to a real wrapper file in `site/src/demos/`.
- The demo shows the actual component, not a screenshot.

`demo: link` is for work that can be seen elsewhere but not hosted here, and it requires `demo_url`. `demo: none` or an omitted field means no demo.

The site imports generated, byte-for-byte copies of the published source from `references/` and `library/`. It never invents a component or hides a credit.

## What is indexed today

| Library | License | Components | Consumption |
| --- | --- | --- | --- |
| shadcn/ui | MIT | 61 | `npx shadcn@latest add <name>` |
| Magic UI | MIT | 75, plus 133 examples | `npx shadcn@latest add @magicui/<name>` |
| React Bits | MIT + Commons Clause | 218 | `npx shadcn@latest add @react-bits/<Name>-TS-TW` |

React Bits permits use inside apps and products, including commercial ones, but forbids selling or redistributing the components themselves. That is why this repo links to React Bits instead of copying it.

The live site runs seven components:

| Component | Author | License | Source |
| --- | --- | --- | --- |
| Liquid Sculpture Hero | Guglielmo Giannattasio | MIT | [21st.dev](https://21st.dev/@gughigug/components/liquid-sculpture-hero) |
| Nebula Hero | Kone | MIT | Original |
| Button | Kone | MIT | Original |
| Marquee | Magic UI | MIT | [magicui.design](https://magicui.design/docs/components/marquee) |
| Animated Shiny Text | Magic UI | MIT | [magicui.design](https://magicui.design/docs/components/animated-shiny-text) |
| Number Ticker | Magic UI | MIT | [magicui.design](https://magicui.design/docs/components/number-ticker) |
| Dot Pattern | Magic UI | MIT | [magicui.design](https://magicui.design/docs/components/dot-pattern) |

The Animated Rocket Shader Hero remains documented in `references/` without hosted source. Its shader is a Star Nest derivative credited to Matthias Hurrle (@atzedent), and Shadertoy shaders default to CC BY-NC-SA 3.0 unless the author says otherwise. The site uses the original Nebula Hero instead.

The [Interactive 3D Machine](https://agentic-factory-3d.vercel.app) by Evgeny Shilov is `demo: link`. No license was found, so neither its code nor the scene is hosted here. The site draws an original isometric sketch and links to the author's deployment.

The live site also includes an agent-access panel where the CLI, API and MCP examples can be copied directly.

## Add an entry

1. Copy `template/entry.md` into a new folder under the right tier, for example `references/my-pattern/entry.md`.
2. Fill in every field. The `id` must match the folder name.
3. Write `prompt.md` beside the entry. It is the agent-facing setup prompt and must name the entry's specific pitfalls.
4. If the entry gets a live demo, add the wrapper under `site/src/demos/` and point `demo_source` at it.
5. Run `npm run check`. It validates provenance, prompt rules, license rules and the catalog build.
6. Commit the entry and the regenerated `catalog.json`, `index.md`, `gallery.html`, `THIRD_PARTY.md` and `worker/src/data.json`.

## Commands

Root, no dependencies:

```bash
npm run validate     # check frontmatter, ids, rights rules, prompts and file references
npm run build        # regenerate catalog.json, index.md, gallery.html, THIRD_PARTY.md
npm run check        # validate, then build the catalog and Worker data
npm run upstream     # rebuild source component indexes from local upstream data
npm run audit        # check every external link in the catalog, docs and site
npm run test:worker  # run the MCP and API unit tests
npm run worker:dev   # build data, then run the Worker locally
npm run worker:deploy # build data, then deploy the Worker
```

Site, React and Vite dependencies:

```bash
cd site
npm install
npm run dev        # sync catalog and sources, then start Vite
npm run build      # sync, typecheck, build to site/dist
npm run preview    # serve the production build
```

Node 20 or newer.

## Refreshing upstream indexes

The component lists are pinned to a commit. To refresh one, download the current list into `_private/upstream/`, update the commit in the matching `sources/<id>/entry.md`, run `npm run upstream`, then `npm run check`. The raw helper files in `_private/` are intentionally not published.

## License

MIT for original work, with a carve-out for third-party material. See [NOTICE.md](NOTICE.md).
