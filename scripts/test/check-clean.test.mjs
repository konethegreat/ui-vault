// Regression test: `npm run check` must leave the committed generated files unchanged when no
// entries or upstream files changed, including on a later calendar day. Each case runs the check
// steps from package.json in a temporary copy of the repository, so the working tree is never touched.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { appendFileSync, cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));

// Must match the paths in the "Check generated files are committed" step of .github/workflows/check.yml.
const GENERATED = ["catalog.json", "index.md", "THIRD_PARTY.md", "gallery.html", "worker/src/data.json"];

// Not read by the check scripts, and large or private. Paths are relative to the repository root.
const SKIP = new Set([".git", ".worktrees", ".agentos", "_private", "node_modules", "site/node_modules", "site/dist"]);

const LATER_DAY = "2099-01-02T12:00:00.000Z";

// A git checkout with core.autocrlf writes CRLF to the working tree while the index holds LF, and
// git diff ignores that difference. Compare the same way so only real content changes fail.
const normalize = (text) => text.replace(/\r\n/g, "\n");

function checkSteps() {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const steps = pkg.scripts.check.split("&&").map((step) => step.trim().split(/\s+/));
  for (const step of steps) {
    assert.equal(step[0], "node", `unexpected check step: ${step.join(" ")}`);
  }
  return steps.map((step) => step.slice(1));
}

function copyRepo() {
  const dir = mkdtempSync(join(tmpdir(), "ui-vault-check-"));
  const copy = join(dir, "repo");
  cpSync(root, copy, {
    recursive: true,
    filter: (src) => !SKIP.has(relative(root, src).split(sep).join("/")),
  });
  return { dir, copy };
}

// Freezes `new Date()` and `Date.now()` at the given instant for a child process.
function writeClockShim(dir, iso) {
  const path = join(dir, "clock.mjs");
  writeFileSync(
    path,
    [
      `const fixed = Date.parse(${JSON.stringify(iso)});`,
      "const RealDate = Date;",
      "globalThis.Date = class extends RealDate {",
      "  constructor(...args) { super(...(args.length ? args : [fixed])); }",
      "  static now() { return fixed; }",
      "};",
      "",
    ].join("\n"),
  );
  return path;
}

function runCheck(copy, clockShim) {
  const preload = clockShim ? ["--import", pathToFileURL(clockShim).href] : [];
  for (const args of checkSteps()) {
    execFileSync(process.execPath, [...preload, ...args], { cwd: copy, stdio: "pipe" });
  }
}

function changedFiles(copy) {
  return GENERATED.filter((file) => {
    const committed = normalize(readFileSync(join(root, file), "utf8"));
    const rebuilt = normalize(readFileSync(join(copy, file), "utf8"));
    return committed !== rebuilt;
  });
}

function withCopy(fn) {
  const { dir, copy } = copyRepo();
  try {
    fn(dir, copy);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("npm run check leaves generated files clean today", () => {
  withCopy((_dir, copy) => {
    runCheck(copy);
    assert.deepEqual(changedFiles(copy), []);
  });
});

test("npm run check leaves generated files clean on a later day", () => {
  withCopy((dir, copy) => {
    runCheck(copy, writeClockShim(dir, LATER_DAY));
    assert.deepEqual(changedFiles(copy), []);
  });
});

test("a changed prompt dirties worker data with the new date, so the check above can fail", () => {
  withCopy((dir, copy) => {
    const catalog = JSON.parse(readFileSync(join(copy, "catalog.json"), "utf8"));
    const entry = catalog.entries.find((item) => item.prompt);
    assert.ok(entry, "catalog has no entry with a prompt");
    appendFileSync(join(copy, entry.prompt), "\nRegression test edit.\n");

    runCheck(copy, writeClockShim(dir, LATER_DAY));

    assert.ok(changedFiles(copy).includes("worker/src/data.json"));
    const data = JSON.parse(readFileSync(join(copy, "worker", "src", "data.json"), "utf8"));
    assert.equal(data.generated, LATER_DAY.slice(0, 10));
  });
});
