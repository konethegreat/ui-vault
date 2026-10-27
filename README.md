# UI Vault

A public, provenance-first index of UI and UX patterns I use across projects. It is a reference library, not a component package. Every entry says where it came from, who made it and what its license allows.

Live site: [konethegreat.github.io/ui-vault](https://konethegreat.github.io/ui-vault/)

Most of the value is in three places: `catalog.json` for tools and agents, `gallery.html` for a quick visual index, and the live site for demos that actually run.

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

## Add an entry

1. Copy `template/entry.md` into a new folder under the right tier, for example `references/my-pattern/entry.md`.
2. Fill in every field. The `id` must match the folder name.
3. If the entry gets a live demo, add the wrapper under `site/src/demos/` and point `demo_source` at it.
4. Run `npm run check`. It validates provenance, license rules and the catalog build.
5. Commit the entry and the regenerated `catalog.json`, `index.md`, `gallery.html` and `THIRD_PARTY.md`.

## Commands

Root, no dependencies:

```bash
npm run validate   # check frontmatter, ids, rights rules and file references
npm run build      # regenerate catalog.json, index.md, gallery.html, THIRD_PARTY.md
npm run check      # validate, then build
npm run upstream   # rebuild source component indexes from local upstream data
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
