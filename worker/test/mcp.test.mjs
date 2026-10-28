import assert from "node:assert/strict";
import { test } from "node:test";
import { handleRpc } from "../src/mcp.js";

const data = {
  entries: [
    {
      id: "liquid-sculpture-hero",
      title: "Liquid Sculpture Hero",
      tier: "reference",
      type: "hero",
      status: "usable",
      tags: ["particles", "gpu", "hero"],
      license: "MIT",
      rights: "permissive",
      source_author: "Guglielmo Giannattasio",
      source_url: "https://21st.dev/@gughigug/components/liquid-sculpture-hero",
      summary: "A hero that rebuilds an image as GPU particles.",
      demo: "live",
      demo_url: "",
      prompt: "# Build Liquid Sculpture Hero\n\nAttribution: Guglielmo Giannattasio, MIT.",
    },
    {
      id: "interactive-3d-machine",
      title: "Interactive 3D Machine",
      tier: "reference",
      type: "interaction",
      status: "inspiration-only",
      tags: ["3d", "three-js"],
      license: "unknown",
      rights: "private-reference",
      source_author: "Evgeny Shilov",
      source_url: "https://agentic-factory-3d.vercel.app",
      summary: "A five-station procedural factory.",
      demo: "link",
      demo_url: "https://agentic-factory-3d.vercel.app",
      prompt: "# Build a 3D machine\n\nDo not copy the source.",
    },
  ],
  upstream: [
    {
      id: "magic-ui",
      library: "Magic UI",
      license: "MIT",
      rights: "permissive",
      repo: "https://github.com/magicuidesign/magicui",
      install: "npx shadcn@latest add @magicui/<name>",
      components: [
        { name: "marquee", category: "ui" },
        { name: "number-ticker", category: "ui" },
      ],
    },
  ],
};

function call(method, params, id = 1) {
  return handleRpc({ jsonrpc: "2.0", id, method, params }, data, "https://api.test");
}

test("initialize echoes a supported protocol version", () => {
  const response = call("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "test", version: "1" },
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.result.protocolVersion, "2025-06-18");
  assert.equal(response.body.result.serverInfo.name, "ui-vault");
});

test("initialize falls back to the latest version", () => {
  const response = call("initialize", { protocolVersion: "1999-01-01" });
  assert.equal(response.body.result.protocolVersion, "2025-06-18");
});

test("tools/list returns four read-only tools", () => {
  const response = call("tools/list", {});
  const tools = response.body.result.tools;
  assert.equal(tools.length, 4);
  assert.ok(tools.every((tool) => tool.annotations.readOnlyHint === true));
});

test("search_entries filters by query", () => {
  const response = call("tools/call", {
    name: "search_entries",
    arguments: { q: "liquid" },
  });
  const structured = response.body.result.structuredContent;
  assert.equal(structured.total, 1);
  assert.equal(structured.entries[0].id, "liquid-sculpture-hero");
  assert.equal(structured.entries[0].prompt, undefined);
  assert.equal(structured.entries[0].prompt_url, "https://api.test/api/entries/liquid-sculpture-hero/prompt");
});

test("search_entries filters by tier and demo", () => {
  const response = call("tools/call", {
    name: "search_entries",
    arguments: { tier: "reference", demo: "link" },
  });
  assert.equal(response.body.result.structuredContent.total, 1);
  assert.equal(response.body.result.structuredContent.entries[0].id, "interactive-3d-machine");
});

test("search_entries matches multiple words across fields", () => {
  const response = call("tools/call", {
    name: "search_entries",
    arguments: { q: "liquid hero" },
  });
  assert.equal(response.body.result.structuredContent.total, 1);
  assert.equal(response.body.result.structuredContent.entries[0].id, "liquid-sculpture-hero");
});

test("search_components matches multiple words across fields", () => {
  const response = call("tools/call", {
    name: "search_components",
    arguments: { q: "magic marquee" },
  });
  assert.equal(response.body.result.structuredContent.total, 1);
  assert.equal(response.body.result.structuredContent.components[0].id, "marquee");
});

test("get_entry for a missing id is a tool error", () => {
  const response = call("tools/call", { name: "get_entry", arguments: { id: "nope" } });
  assert.equal(response.body.result.isError, true);
});

test("get_setup_prompt returns the prompt text", () => {
  const response = call("tools/call", {
    name: "get_setup_prompt",
    arguments: { id: "liquid-sculpture-hero" },
  });
  assert.match(response.body.result.content[0].text, /Attribution/);
  assert.equal(response.body.result.isError, false);
});

test("search_components finds an upstream component", () => {
  const response = call("tools/call", { name: "search_components", arguments: { q: "marquee" } });
  const structured = response.body.result.structuredContent;
  assert.equal(structured.total, 1);
  assert.equal(structured.components[0].install, "npx shadcn@latest add @magicui/<name>");
});

test("unknown method returns -32601", () => {
  const response = call("tools/unknown", {});
  assert.equal(response.body.error.code, -32601);
});

test("notification-only batch returns 202", () => {
  const response = handleRpc(
    [{ jsonrpc: "2.0", method: "notifications/initialized" }],
    data,
    "https://api.test"
  );
  assert.equal(response.status, 202);
  assert.equal(response.body, null);
});

test("invalid tool arguments return -32602", () => {
  const response = call("tools/call", { name: "get_entry", arguments: {} });
  assert.equal(response.body.error.code, -32602);
  assert.equal(response.body.id, 1);
});
