# Tasks

Execute tasks in order. Each checkbox is sized for a single pull request on its own branch. Tick the completed task and append one line to `docs/agentos/REPORT.md` in each PR.

## Phase 1: Stabilize CI and Deterministic Catalog Builds

- [x] Update `scripts/build-catalog.mjs` and `scripts/build-worker-data.mjs` so `generated` timestamps only update when catalog or worker content changes (or add a `--check` mode), preventing `git diff --exit-code` CI failures on new dates.
- [x] Add a regression test verifying `npm run check` leaves generated files clean when no entries or upstream files changed.
- [x] Audit `.gitattributes` and Windows CRLF behavior for `worker/src/data.json` so local Windows runs of `npm run check` do not introduce line-ending noise.

## Phase 2: Add Unit Tests for Scripts, CLI, and Worker HTTP API

- [x] Add `node --test` unit tests for `scripts/lib.mjs` and `scripts/validate.mjs` covering frontmatter parsing, rights/license rules, and prompt validation.
- [x] Add `node --test` unit tests for `worker/src/search.js` covering `filterEntries`, `filterComponents`, `getEntry`, and `publicEntry`.
- [x] Add `node --test` unit tests for `worker/src/index.js` covering `/api/health`, `/api/entries`, `/api/entries/:id`, `/api/entries/:id/prompt`, `/api/components`, CORS headers, and 404/405 responses.
- [x] Add `node --test` unit tests for `bin/ui-vault.mjs` covering `list`, `search`, `show`, `prompt`, `--json` output, and local `catalog.json` fallback.
- [ ] Update `package.json` and `.github/workflows/check.yml` to run all root `node --test` suites on every PR and push to `main`.

## Phase 3: Site Verification, Bundle Optimization, and Link Hygiene

- [ ] Add a post-build verification script in `site/scripts/` that asserts all expected static route entry points (`demos`, `catalog`, `use`, `rights`, `privacy`, `takedown`, `404.html`), `catalog.json`, `prompts/`, and `licenses/` exist in `site/dist`.
- [ ] Configure `site/vite.config.ts` manual chunks or lazy route/demo splitting to eliminate the >500 kB main bundle chunk warning.
- [ ] Run `npm run audit` (`scripts/audit-links.mjs`) and update `scripts/link-allowlist.txt` or fix any broken external links in catalog entries and docs.

## Phase 4: Catalog Enrichment and Reference Experiments

- [ ] Refresh pinned upstream commits and component indexes in `sources/` (`shadcn-ui`, `magic-ui`, `react-bits`) via `npm run upstream` and `npm run check`.
- [ ] Audit `references/` and `library/` `prompt.md` files to verify every entry names entry-specific pitfalls and follows `AGENTS.md` prompt rules.
- [ ] Experiment with and add one new original `library/` pattern (with `entry.md`, `prompt.md`, and live demo wrapper in `site/src/demos/`) or improve an existing demo's reduced-motion and mobile (390px) behavior.

## Phase 5: Continuous Review, Cleanup, and Documentation Sync

- [ ] Replace the em dash in `bin/ui-vault.mjs` (`USAGE`) with a hyphen or colon and verify CLI help output and tests pass.
- [ ] Audit `README.md`, `docs/delivery.md`, `docs/site-architecture.md`, and `docs/site-policies.md` against actual scripts, routes, and demo counts (18 live demos).
- [ ] Audit `.github/workflows/check.yml` and `.github/workflows/deploy.yml` action versions, permissions, and trigger paths.
