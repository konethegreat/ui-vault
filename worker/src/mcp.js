import { filterComponents, filterEntries, getEntry, publicEntry } from "./search.js";

const VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];
const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

export const TOOLS = [
  {
    name: "search_entries",
    title: "Search UI Vault entries",
    description:
      "Search the UI Vault catalog of patterns, references and source libraries. Returns provenance, license, rights and demo fields.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Free text across title, summary, author, type and tags." },
        tier: { type: "string", enum: ["pattern", "reference", "source"] },
        type: { type: "string", description: "Entry type such as hero, text, button or interaction." },
        tag: { type: "string", description: "Exact tag match." },
        demo: { type: "string", enum: ["live", "link", "none"] },
        limit: { type: "integer", minimum: 1, maximum: 500 },
      },
      additionalProperties: false,
    },
    annotations: READ_ONLY,
  },
  {
    name: "get_entry",
    title: "Get a UI Vault entry",
    description: "Fetch one entry by id with its summary, rights, license, source and demo links.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Entry id, for example liquid-sculpture-hero." } },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
  },
  {
    name: "get_setup_prompt",
    title: "Get an agent setup prompt",
    description:
      "Return the copy-paste prompt for an entry. Prompts respect the entry rights and include attribution and verification steps.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Entry id." } },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
  },
  {
    name: "search_components",
    title: "Search upstream components",
    description:
      "Search the pinned component index for shadcn/ui, Magic UI and React Bits. Returns install commands and rights reminders.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Component, library or category name." },
        library: { type: "string", enum: ["shadcn-ui", "magic-ui", "react-bits"] },
        limit: { type: "integer", minimum: 1, maximum: 500 },
      },
      additionalProperties: false,
    },
    annotations: READ_ONLY,
  },
];

function result(id, value) {
  return { jsonrpc: "2.0", id, result: value };
}

function error(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function textResult(structured, text) {
  return {
    content: [{ type: "text", text: text ?? JSON.stringify(structured, null, 2) }],
    structuredContent: structured,
    isError: false,
  };
}

function toolError(message) {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}

function callTool(name, args, data, origin) {
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    return { rpc: error(null, -32602, "Tool arguments must be an object") };
  }

  if (name === "search_entries") {
    const found = filterEntries(data.entries, args);
    const entries = found.entries.map((entry) => publicEntry(entry, origin));
    return { rpc: textResult({ total: found.total, count: entries.length, entries }) };
  }

  if (name === "search_components") {
    const found = filterComponents(data.upstream, args);
    return { rpc: textResult(found) };
  }

  if (name === "get_entry" || name === "get_setup_prompt") {
    if (typeof args.id !== "string" || !args.id.trim()) {
      return { rpc: error(null, -32602, "A string id is required") };
    }
    const entry = getEntry(data.entries, args.id.trim());
    if (!entry) return { rpc: toolError(`No entry with id "${args.id}". Use search_entries to find one.`) };

    if (name === "get_entry") {
      return { rpc: textResult({ ...publicEntry(entry, origin), has_prompt: true }) };
    }

    return {
      rpc: textResult(
        { id: entry.id, title: entry.title, rights: entry.rights, license: entry.license, prompt: entry.prompt },
        entry.prompt
      ),
    };
  }

  return { rpc: error(null, -32602, `Unknown tool: ${name}`) };
}

function handleOne(message, data, origin) {
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return error(null, -32600, "Invalid Request");
  }
  if (message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return error(message.id, -32600, "Invalid Request");
  }

  const hasId = Object.prototype.hasOwnProperty.call(message, "id");

  if (["notifications/initialized", "notifications/cancelled"].includes(message.method)) {
    return null;
  }

  if (!hasId) return null;

  switch (message.method) {
    case "initialize": {
      const requested = message.params?.protocolVersion;
      const protocolVersion = VERSIONS.includes(requested) ? requested : VERSIONS[0];
      return result(message.id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "ui-vault", title: "UI Vault", version: "1.0.0" },
        instructions:
          "Read-only UI reference catalog by Kone Tshivhinda. Use search_entries, get_entry, get_setup_prompt and search_components. Every entry states its rights; never copy source for unknown or private-reference entries.",
      });
    }
    case "ping":
      return result(message.id, {});
    case "tools/list":
      return result(message.id, { tools: TOOLS });
    case "tools/call": {
      const name = message.params?.name;
      if (typeof name !== "string") return error(message.id, -32602, "Tool name is required");
      const call = callTool(name, message.params?.arguments ?? {}, data, origin);
      if (call.rpc.error) {
        call.rpc.id = message.id;
        return call.rpc;
      }
      return result(message.id, call.rpc);
    }
    default:
      return error(message.id, -32601, `Method not found: ${message.method}`);
  }
}

export function handleRpc(payload, data, origin = "") {
  const messages = Array.isArray(payload) ? payload : [payload];
  const responses = [];

  for (const message of messages) {
    const response = handleOne(message, data, origin);
    if (response) responses.push(response);
  }

  if (!responses.length) return { status: 202, body: null };
  return { status: 200, body: Array.isArray(payload) ? responses : responses[0] };
}

export const LATEST_PROTOCOL_VERSION = VERSIONS[0];
