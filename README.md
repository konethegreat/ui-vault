# UI Vault

A public, provenance-first index of UI and UX patterns I use across projects. It is a reference library, not a component package. Every entry says where it came from, who made it and what its license allows.

Most of the value is in two places: `catalog.json` for tools and agents, and `gallery.html` for eyes.

## The three tiers

| Tier | What lives here | Can it be redistributed? |
| --- | --- | --- |
| `sources/` | External libraries I draw from: install commands, license, pinned commit, component index. | Links and facts only. No third-party code is hosted. |
| `references/` | Specific designs studied in detail: technique notes, authorship, known defects. | Metadata only. Verbatim source stays out of the repo when its license is unclear. |
| `library/` | Patterns I authored. MIT licensed. | Yes. |

## Browse

- [index.md](index.md): every entry in tables, grouped by tier.
- [gallery.html](gallery.html): open in a browser for a visual index with filters.
- [catalog.json](catalog.json): machine-readable index, including component names for each upstream library.
- [THIRD_PARTY.md](THIRD_PARTY.md): attribution for every source and reference.

## Attributions that are not optional

1. Third-party work is credited by name and link in the entry, in `catalog.json` and in `THIRD_PARTY.md`.
2. Code is only hosted when its license permits it. The `published_source` flag and the validator enforce this.
3. When adapting a reference into a project, keep the credit line:

   `Adapted from TITLE by AUTHOR (URL), LICENSE.`

4. Original patterns in `library/` are mine and marked MIT. Nothing else is presented as mine.

## What is indexed today

| Library | License | Components | Consumption |
| --- | --- | --- | --- |
| shadcn/ui | MIT | 61 | `npx shadcn@latest add <name>` |
| Magic UI | MIT | 75, plus 133 examples | `npx shadcn@latest add @magicui/<name>` |
| React Bits | MIT + Commons Clause | 218 | `npx shadcn@latest add @react-bits/<Name>-TS-TW` |

React Bits permits use inside apps and products, including commercial ones, but forbids selling or redistributing the components themselves. That is why this repo links to React Bits instead of copying it.

Two studied hero components from 21st.dev exports are documented in `references/` without hosting their source. One contains a shader by Matthias Hurrle (@atzedent) whose license is unverified and likely non-commercial. The other is by guglielmogiannattasio.it and has no recorded license.

## Add an entry

1. Copy `template/entry.md` into a new folder under the right tier, for example `references/my-pattern/entry.md`.
2. Fill in every field. The `id` must match the folder name.
3. Run `npm run check`. It validates provenance, license rules and the catalog build.
4. Commit the entry and the regenerated `catalog.json`, `index.md`, `gallery.html` and `THIRD_PARTY.md`.

## Commands

```bash
npm run validate   # check frontmatter, ids, rights rules and file references
npm run build      # regenerate catalog.json, index.md, gallery.html, THIRD_PARTY.md
npm run check      # validate, then build
npm run upstream   # rebuild source component indexes from local upstream data
```

No dependencies. Node 20 or newer.

## Refreshing upstream indexes

The component lists are pinned to a commit. To refresh one, download the current list into `_private/upstream/`, update the commit in the matching `sources/<id>/entry.md`, run `npm run upstream`, then `npm run check`. The raw helper files in `_private/` are intentionally not published.

## License

MIT for original work, with a carve-out for third-party material. See [NOTICE.md](NOTICE.md).
