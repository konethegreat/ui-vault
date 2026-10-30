# Site architecture

The site is a static React application in `site/`. It is a multipage experience built with a small
history router, not one long scroll. GitHub Pages serves it; there is no server-side rendering.

## Stack

- React 19, TypeScript, Vite 7, Tailwind CSS 4.
- `lucide-react` for icons.
- Vendored components in `site/src/vendor/`, copied from `references/` and `library/` by
  `site/scripts/sync-data.mjs`. Never edit the generated copies.
- Catalog data is fetched from `catalog.json` at runtime.

## Routes

| Path | Page component | Purpose |
| --- | --- | --- |
| `/` | `site/src/pages/HomePage.tsx` | Hero, three ways in, ownership rule |
| `/demos` | `site/src/pages/DemosPage.tsx` | All live demos and the linked reference |
| `/catalog` | `site/src/pages/CatalogPage.tsx` | Search, tier filters, grouped cards |
| `/use` | `site/src/pages/UsePage.tsx` | CLI, API and MCP access |
| `/rights` | `site/src/pages/RightsPage.tsx` | Ownership, tiers and attribution |
| `/privacy` | `site/src/pages/PrivacyPage.tsx` | Data practices and hosting providers |
| `/takedown` | `site/src/pages/TakedownPage.tsx` | Misuse warning and rights notices |
| anything else | `site/src/pages/NotFoundPage.tsx` | 404 with safe links |

The route list lives in `site/src/lib/router.tsx` (`ROUTES`). Add a route in three places:

1. `ROUTES` and the page map in `site/src/App.tsx`.
2. `site/scripts/copy-routes.mjs` so the build writes a static entry point.
3. `site/src/lib/page-meta.ts` for the title and description.

## Router behavior

`RouterProvider` handles the base path (`/ui-vault/` in production), `history.pushState`, back and
forward, scroll restoration, and focus management.

- Internal anchors are intercepted only when their normalized path is in `ROUTES`. Asset links under
  `/ui-vault/licenses/` and external links keep native behavior.
- `route("/demos")` returns the base-aware href. Use it for every internal link.
- A route with a hash scrolls to the target after render. This is how
  `/demos#demo-glass-folder-cards` works from a catalog card.
- Legacy `/#demo-<id>` links redirect to `/demos#demo-<id>`.
- Navigating without a hash scrolls to the top and focuses `#main`.

## Page shells

- `PageHero` is the dark band on every inner page: eyebrow, serif title, description, optional meta
  and action.
- `LegalPage` renders the sticky table of contents, the "In short" panel, numbered sections and the
  shared "not legal advice" footnote. Legal body copy uses the `.legal-prose` rules in
  `site/src/styles.css`.
- `ContactCard` is the shared contact panel used by the rights, privacy and takedown pages.
- `SiteHeader` and `SiteFooter` own navigation and active states.

## Data flow

1. Markdown entries in `sources/`, `references/` and `library/`.
2. `npm run build` at the repository root generates `catalog.json`, `index.md`, `THIRD_PARTY.md`
   and `gallery.html`.
3. `site/scripts/sync-data.mjs` copies `catalog.json`, prompts, licenses and component sources into
   the site.
4. `vite build` emits the static site.
5. `site/scripts/copy-routes.mjs` copies `index.html` into each route folder and to `404.html`.

The generated route folders make deep links return a normal 200 response on GitHub Pages. The
`404.html` copy keeps unknown paths working as a client-rendered 404.

## Adding or changing a page

- Keep the visual rhythm: dark `PageHero`, light content, maximum width `1200px`.
- Keep one `h1` per page. `PageHero` provides it.
- Use `route()` for internal links. Do not hardcode `/ui-vault/`.
- Use hash-only links (`#section`) only for content on the current page.
- Update the title and description in `page-meta.ts`.
- Add the URL to `site/public/sitemap.xml` when the page is public.

## Verification

```bash
cd site
npm run build
npm run preview -- --port 4173
```

Then check `/ui-vault/`, every route, a deep demo link, the mobile menu at 390px and the browser
console. See `delivery.md`.
