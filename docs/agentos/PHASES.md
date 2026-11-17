# Working Phases

Ordered phases for maintaining and improving `ui-vault`. Work through tasks in `docs/agentos/TASKS.md` in order, one small reviewed pull request per task.

## Phase 1: Stabilize CI and Deterministic Catalog Builds

Fix the date-stamp CI failure in `.github/workflows/check.yml` where `npm run check` dirtying `catalog.json`, `index.md`, `THIRD_PARTY.md`, `gallery.html`, and `worker/src/data.json` with today's UTC date causes `git diff --exit-code` to fail on any day after the last build commit.

Done when: `npm run check` is idempotent across calendar days when entry content has not changed, and `.github/workflows/check.yml` passes on `main`.

## Phase 2: Add Unit Tests for Scripts, CLI, and Worker HTTP API

Close the test coverage gaps across `scripts/` (`validate.mjs`, `lib.mjs`, `build-catalog.mjs`), `bin/ui-vault.mjs`, and `worker/src/` (`search.js`, `index.js`) using `node --test`, and wire the new test suites into `.github/workflows/check.yml`.

Done when: Core validator, catalog builder, CLI, search, and Worker HTTP route behaviors are covered by automated `node --test` suites that run and pass in CI.

## Phase 3: Site Verification, Bundle Optimization, and Link Hygiene

Add automated route and build output verification for `site/`, address the Vite chunk-size warning on the main bundle, and verify external links and policy page consistency.

Done when: `site/` build output and generated static routes are verified by an automated script, bundle chunking is improved, and `npm run audit` passes.

## Phase 4: Catalog Enrichment and Reference Experiments

Refresh pinned upstream component indexes in `sources/`, audit existing `prompt.md` and `entry.md` files for entry-specific pitfalls and accurate metadata, and experiment with new provenance-first patterns or demos under `AGENTS.md` rights rules.

Done when: Upstream source indexes are refreshed to current commits, all existing entries pass a quality audit, and any new pattern or demo ships with verified attribution and passing checks.

## Phase 5: Continuous Review, Cleanup, and Documentation Sync

Keep `README.md`, `docs/`, CLI help text, and GitHub Actions workflows accurate, clean up any Law 2 violations (such as em dashes in existing CLI output), and audit workflow action pins.

Done when: Documentation matches all scripts and routes, Law 2 text checks pass on maintained files, and CI workflows are audited.
