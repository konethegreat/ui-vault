import data from "./data.json";
import { LATEST_PROTOCOL_VERSION, handleRpc } from "./mcp.js";
import { filterComponents, filterEntries, getEntry, publicEntry } from "./search.js";

const SITE = "https://konethegreat.github.io/ui-vault";
const REPO = "https://github.com/konethegreat/ui-vault";
const RATE_LIMIT = 120;
const RATE_WINDOW = 60_000;
const buckets = new Map();

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, Retry-After",
  "Access-Control-Max-Age": "86400",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

function overLimit(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.start > RATE_WINDOW) {
    buckets.set(ip, { start: now, count: 1 });
    if (buckets.size > 5000) {
      for (const [key, value] of buckets) {
        if (now - value.start > RATE_WINDOW) buckets.delete(key);
      }
    }
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

function json(value, status = 200, extra = {}) {
  return new Response(JSON.stringify(value, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS, ...extra },
  });
}

function text(value, status = 200, extra = {}) {
  return new Response(value, {
    status,
    headers: { "Content-Type": "text/markdown; charset=utf-8", ...CORS, ...extra },
  });
}

function methodNotAllowed(allow) {
  return json({ error: "Method not allowed", allow }, 405, { Allow: allow });
}

function protocolHeader(request) {
  const requested = request.headers.get("MCP-Protocol-Version");
  return requested === LATEST_PROTOCOL_VERSION ? requested : LATEST_PROTOCOL_VERSION;
}

async function handleMcp(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      400,
      { "MCP-Protocol-Version": protocolHeader(request) }
    );
  }

  const response = handleRpc(payload, data, new URL(request.url).origin);
  const headers = {
    "MCP-Protocol-Version": protocolHeader(request),
    "Cache-Control": "no-store",
  };

  if (response.status === 202) return new Response(null, { status: 202, headers: { ...CORS, ...headers } });
  return json(response.body, response.status, headers);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (overLimit(ip)) {
      return json(
        { error: "Too many requests", retry_after_seconds: 60 },
        429,
        { "Retry-After": "60", "Cache-Control": "no-store" }
      );
    }

    if (path === "/mcp") {
      if (request.method === "POST") return handleMcp(request);
      return methodNotAllowed("POST");
    }

    if (request.method !== "GET") return methodNotAllowed("GET");

    if (path === "/") {
      return json(
        {
          name: "ui-vault",
          owner: "Kone Tshivhinda",
          description:
            "Read-only UI reference catalog with provenance, license and rights for every entry. Prompts are ready for coding agents.",
          site: SITE,
          repo: REPO,
          generated: data.generated,
          counts: data.counts,
          endpoints: {
            health: "/api/health",
            entries: "/api/entries?q=&tier=&type=&tag=&demo=&limit=",
            entry: "/api/entries/{id}",
            prompt: "/api/entries/{id}/prompt",
            components: "/api/components?q=&library=",
            mcp: "/mcp",
          },
        },
        200,
        { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" }
      );
    }

    if (path === "/api/health") {
      return json(
        { ok: true, generated: data.generated, counts: data.counts },
        200,
        { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" }
      );
    }

    const segments = path.split("/").filter(Boolean);

    if (segments[0] === "api" && segments[1] === "entries") {
      if (segments.length === 2) {
        const found = filterEntries(data.entries, Object.fromEntries(url.searchParams));
        const entries = found.entries.map((entry) => publicEntry(entry, url.origin));
        return json(
          { total: found.total, count: entries.length, entries },
          200,
          { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" }
        );
      }

      if (segments.length === 3 || (segments.length === 4 && segments[3] === "prompt")) {
        const id = decodeURIComponent(segments[2]);
        const entry = getEntry(data.entries, id);
        if (!entry) {
          return json({ error: "Entry not found", id }, 404, { "Cache-Control": "no-store" });
        }
        if (segments.length === 4) {
          return text(entry.prompt, 200, {
            "Cache-Control": "public, max-age=600, stale-while-revalidate=86400",
          });
        }
        return json(publicEntry(entry, url.origin), 200, {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
        });
      }
    }

    if (segments[0] === "api" && segments[1] === "components" && segments.length === 2) {
      const found = filterComponents(data.upstream, Object.fromEntries(url.searchParams));
      return json(found, 200, {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      });
    }

    return json({ error: "Not found", docs: url.origin }, 404, { "Cache-Control": "no-store" });
  },
};
