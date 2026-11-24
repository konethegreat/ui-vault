import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import data from "../src/data.json" with { type: "json" };

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".json")) {
      return nextLoad(url, {
        ...context,
        importAttributes: { ...context.importAttributes, type: "json" },
      });
    }
    return nextLoad(url, context);
  },
});

const { default: worker } = await import("../src/index.js");

const ORIGIN = "https://api.test";
const sampleEntry = data.entries[0];
const sampleLibrary = data.upstream[0];

function callWorker(path, init = {}) {
  const request = new Request(`${ORIGIN}${path}`, init);
  return worker.fetch(request);
}

function assertCorsHeaders(response) {
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "*");
  assert.equal(response.headers.get("Access-Control-Allow-Methods"), "GET, POST, OPTIONS");
  assert.match(
    response.headers.get("Access-Control-Allow-Headers") || "",
    /Content-Type.*MCP-Protocol-Version/
  );
  assert.equal(
    response.headers.get("Access-Control-Expose-Headers"),
    "MCP-Protocol-Version, Retry-After"
  );
  assert.equal(response.headers.get("Access-Control-Max-Age"), "86400");
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
}

test("GET / returns API metadata and endpoints", async () => {
  const response = await callWorker("/");
  assert.equal(response.status, 200);
  assertCorsHeaders(response);
  const body = await response.json();
  assert.equal(body.name, "ui-vault");
  assert.equal(body.generated, data.generated);
  assert.deepEqual(body.counts, data.counts);
  assert.equal(body.endpoints.health, "/api/health");
});

test("GET /api/health returns ok, generated timestamp, and counts", async () => {
  const response = await callWorker("/api/health");
  assert.equal(response.status, 200);
  assertCorsHeaders(response);
  assert.match(response.headers.get("Content-Type") || "", /application\/json/);
  assert.equal(
    response.headers.get("Cache-Control"),
    "public, max-age=60, stale-while-revalidate=300"
  );
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.generated, data.generated);
  assert.deepEqual(body.counts, data.counts);
});

test("GET /api/entries returns public entries and supports query filters", async () => {
  const response = await callWorker("/api/entries?limit=1");
  assert.equal(response.status, 200);
  assertCorsHeaders(response);
  const body = await response.json();
  assert.equal(body.total, data.entries.length);
  assert.equal(body.count, 1);
  assert.equal(body.entries.length, 1);
  assert.equal(body.entries[0].prompt, undefined);
  assert.equal(
    body.entries[0].prompt_url,
    `${ORIGIN}/api/entries/${body.entries[0].id}/prompt`
  );

  const params = new URLSearchParams({
    q: sampleEntry.id,
    tier: sampleEntry.tier,
    type: sampleEntry.type,
  });
  const filteredResponse = await callWorker(`/api/entries?${params.toString()}`);
  assert.equal(filteredResponse.status, 200);
  const filtered = await filteredResponse.json();
  assert.ok(filtered.entries.some((entry) => entry.id === sampleEntry.id));
});

test("GET /api/entries/:id returns a single public entry or 404", async () => {
  const response = await callWorker(`/api/entries/${encodeURIComponent(sampleEntry.id)}`);
  assert.equal(response.status, 200);
  assertCorsHeaders(response);
  const body = await response.json();
  assert.equal(body.id, sampleEntry.id);
  assert.equal(body.prompt, undefined);
  assert.equal(body.prompt_url, `${ORIGIN}/api/entries/${sampleEntry.id}/prompt`);

  const missing = await callWorker("/api/entries/does-not-exist");
  assert.equal(missing.status, 404);
  assertCorsHeaders(missing);
  assert.equal(missing.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await missing.json(), {
    error: "Entry not found",
    id: "does-not-exist",
  });
});

test("GET /api/entries/:id/prompt returns markdown prompt or 404", async () => {
  const response = await callWorker(`/api/entries/${encodeURIComponent(sampleEntry.id)}/prompt`);
  assert.equal(response.status, 200);
  assertCorsHeaders(response);
  assert.match(response.headers.get("Content-Type") || "", /text\/markdown/);
  assert.equal(
    response.headers.get("Cache-Control"),
    "public, max-age=600, stale-while-revalidate=86400"
  );
  assert.equal(await response.text(), sampleEntry.prompt);

  const missing = await callWorker("/api/entries/does-not-exist/prompt");
  assert.equal(missing.status, 404);
  assertCorsHeaders(missing);
  assert.deepEqual(await missing.json(), {
    error: "Entry not found",
    id: "does-not-exist",
  });
});

test("GET /api/components returns upstream components and filters by library and limit", async () => {
  const params = new URLSearchParams({
    library: sampleLibrary.id,
    q: sampleLibrary.components[0].name,
    limit: "1",
  });
  const response = await callWorker(`/api/components?${params.toString()}`);
  assert.equal(response.status, 200);
  assertCorsHeaders(response);
  const body = await response.json();
  assert.ok(body.total >= 1);
  assert.equal(body.components.length, 1);
  assert.equal(body.components[0].library_id, sampleLibrary.id);
  assert.equal(body.components[0].id, sampleLibrary.components[0].name);
});

test("OPTIONS preflight returns 204 with CORS headers", async () => {
  const response = await callWorker("/api/entries", { method: "OPTIONS" });
  assert.equal(response.status, 204);
  assertCorsHeaders(response);
  assert.equal(await response.text(), "");
});

test("unknown routes return 404 and disallowed methods return 405", async () => {
  const notFound = await callWorker("/api/unknown-route");
  assert.equal(notFound.status, 404);
  assertCorsHeaders(notFound);
  assert.equal(notFound.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await notFound.json(), { error: "Not found", docs: ORIGIN });

  const nestedNotFound = await callWorker("/api/entries/one/two");
  assert.equal(nestedNotFound.status, 404);

  const postHealth = await callWorker("/api/health", { method: "POST" });
  assert.equal(postHealth.status, 405);
  assertCorsHeaders(postHealth);
  assert.equal(postHealth.headers.get("Allow"), "GET");
  assert.deepEqual(await postHealth.json(), { error: "Method not allowed", allow: "GET" });

  const getMcp = await callWorker("/mcp", { method: "GET" });
  assert.equal(getMcp.status, 405);
  assertCorsHeaders(getMcp);
  assert.equal(getMcp.headers.get("Allow"), "POST");
  assert.deepEqual(await getMcp.json(), { error: "Method not allowed", allow: "POST" });
});

test("POST /mcp handles invalid JSON and initialize requests", async () => {
  const badJson = await callWorker("/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not-json",
  });
  assert.equal(badJson.status, 400);
  assertCorsHeaders(badJson);
  assert.ok(badJson.headers.get("MCP-Protocol-Version"));
  const errBody = await badJson.json();
  assert.equal(errBody.error.code, -32700);

  const init = await callWorker("/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18" },
    }),
  });
  assert.equal(init.status, 200);
  assertCorsHeaders(init);
  assert.equal(init.headers.get("Cache-Control"), "no-store");
  const initBody = await init.json();
  assert.equal(initBody.result.serverInfo.name, "ui-vault");
});
