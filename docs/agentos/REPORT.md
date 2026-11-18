# Report

One-line summary per merged pull request, newest last.

- 2026-11-17: Initialized `docs/agentos/PHASES.md`, `docs/agentos/TASKS.md`, and `docs/agentos/REPORT.md` after researching `ui-vault` CI, scripts, worker, CLI, and site.
- 2026-11-18: Phase 1 task 1, deterministic `generated` stamps. `build-catalog.mjs` and `build-worker-data.mjs` now keep the committed date unless their content changed, through `resolveGenerated` in `scripts/lib.mjs`. Verified by new unit tests in `scripts/test/generated.test.mjs` (`npm run test:scripts`) and by the check workflow running `npm run check` and `git diff --exit-code` on a day after the committed 2026-11-17 stamp.
