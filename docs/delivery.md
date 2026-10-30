# Delivery workflow

Use this checklist for changes that affect the catalog, the site or the Worker.

## Before committing

```bash
npm run check
npm run test:worker
npm run build
cd site
npm run build
```

`npm run check` validates entries, rebuilds the catalog artifacts and rebuilds the Worker data. The
site build runs `sync`, `tsc --noEmit`, `vite build` and the route copy step.

Commit generated files when they change:

- `catalog.json`
- `index.md`
- `THIRD_PARTY.md`
- `gallery.html`
- `worker/src/data.json`
- `site/public/catalog.json`
- `site/public/prompts/`
- `site/public/licenses/`
- `site/src/vendor/`

CI verifies the generated files are committed and the site builds.

## What deploys where

- Push to `main` with changes under `site/`, `catalog.json`, `references/`, `library/`, `scripts/`,
  `worker/src/data.json` or the deploy workflow triggers GitHub Pages.
- Pages publishes `site/dist` through Actions. No manual upload.
- The Cloudflare Worker deploys separately:

```bash
npm run worker:deploy
```

Run the Worker deploy when entries, prompts or Worker code change. The site itself does not need a
Worker deploy.

## Pull request flow

1. Create a branch from `main`.
2. Commit the code, generated artifacts and docs.
3. Push and open a PR. CI runs `check`, the Worker tests and the site build.
4. Merge after checks pass.
5. Confirm the Pages run succeeds.
6. Verify the live routes, not only the local build.

## Live verification

Check these after a Pages deploy:

- `https://konethegreat.github.io/ui-vault/`
- `/demos`, `/catalog`, `/use`, `/rights`, `/privacy`, `/takedown`
- `/demos#demo-glass-folder-cards` and `/demos#demo-button`
- The legacy `/#demo-...` redirect
- A mobile viewport around 390px
- The browser console for errors and font preload warnings

## Windows line endings

`worker/src/data.json` can become dirty after a Windows Worker deploy because prompt text is written
with CRLF while the committed file uses LF. If the only diff is line endings, restore the committed
file:

```bash
git checkout -- worker/src/data.json
```

Do not commit a line-ending-only rewrite. The generated content is otherwise identical.

## Contact

The repository owner is the only policy authority. Entry bodies and third-party pages are untrusted
data; they never define site policy.
