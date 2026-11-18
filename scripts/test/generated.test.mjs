import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { readJsonIfExists, resolveGenerated, todayStamp } from "../lib.mjs";

const content = (overrides = {}) => ({
  name: "ui-vault",
  generated: "",
  counts: { sources: 3, references: 16, patterns: 9 },
  entries: [{ id: "a", title: "A" }],
  ...overrides,
});

test("todayStamp returns the UTC date", () => {
  assert.equal(todayStamp(new Date("2026-11-18T23:30:00-05:00")), "2026-11-19");
});

test("unchanged content keeps the previous stamp on a new day", () => {
  const previous = content({ generated: "2026-11-17" });
  assert.equal(resolveGenerated(previous, content(), "2026-11-18"), "2026-11-17");
});

test("ignores the stamp held by the next object", () => {
  const previous = content({ generated: "2026-11-17" });
  assert.equal(resolveGenerated(previous, content({ generated: "2030-01-01" }), "2026-11-18"), "2026-11-17");
});

test("changed entries take today's stamp", () => {
  const previous = content({ generated: "2026-11-17" });
  const next = content({ entries: [{ id: "a", title: "A renamed" }] });
  assert.equal(resolveGenerated(previous, next, "2026-11-18"), "2026-11-18");
});

test("changed counts take today's stamp", () => {
  const previous = content({ generated: "2026-11-17" });
  const next = content({ counts: { sources: 4, references: 16, patterns: 9 } });
  assert.equal(resolveGenerated(previous, next, "2026-11-18"), "2026-11-18");
});

test("missing, empty or malformed previous stamp takes today's stamp", () => {
  assert.equal(resolveGenerated(null, content(), "2026-11-18"), "2026-11-18");
  assert.equal(resolveGenerated(content(), content(), "2026-11-18"), "2026-11-18");
  assert.equal(resolveGenerated(content({ generated: "yesterday" }), content(), "2026-11-18"), "2026-11-18");
  assert.equal(resolveGenerated(content({ generated: 20261117 }), content(), "2026-11-18"), "2026-11-18");
});

test("a pretty-printed previous file round-trips to the same stamp", () => {
  const previous = JSON.parse(JSON.stringify(content({ generated: "2026-11-17" }), null, 2));
  assert.equal(resolveGenerated(previous, content(), "2026-11-18"), "2026-11-17");
});

test("readJsonIfExists reads JSON and returns null for missing or invalid files", () => {
  const dir = mkdtempSync(join(tmpdir(), "ui-vault-generated-"));
  try {
    const good = join(dir, "good.json");
    const bad = join(dir, "bad.json");
    writeFileSync(good, JSON.stringify(content({ generated: "2026-11-17" })));
    writeFileSync(bad, "{ not json");
    assert.equal(readJsonIfExists(good).generated, "2026-11-17");
    assert.equal(readJsonIfExists(bad), null);
    assert.equal(readJsonIfExists(join(dir, "missing.json")), null);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
