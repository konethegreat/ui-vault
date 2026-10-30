import * as React from "react";
import { Button } from "@/vendor/Button";
import { API, REPO, copyText } from "@/lib/catalog";
import { useReveal } from "@/hooks/useReveal";

type TabId = "cli" | "api" | "mcp";

const TABS: { id: TabId; label: string }[] = [
  { id: "cli", label: "CLI" },
  { id: "api", label: "API" },
  { id: "mcp", label: "MCP" },
];

const CLI_CODE = `npx github:konethegreat/ui-vault search "liquid"
npx github:konethegreat/ui-vault prompt liquid-sculpture-hero`;

const API_CODE = `curl -s ${API}/api/entries?tier=reference`;

const MCP_CODE = `{
  "mcpServers": {
    "ui-vault": {
      "url": "${API}/mcp"
    }
  }
}`;

function CodeBlock({
  label,
  code,
  note,
}: {
  label: string;
  code: string;
  note?: React.ReactNode;
}) {
  const [status, setStatus] = React.useState<"idle" | "copied" | "failed">("idle");
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopy() {
    const copied = await copyText(code);
    setStatus(copied ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2200);
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a08]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="label text-paper/40">{label}</span>
        <Button variant="secondary" size="sm" onClick={onCopy}>
          {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-[1.7] text-paper/85">
        <code>{code}</code>
      </pre>
      <p aria-live="polite" className="sr-only">
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? "Copy failed" : ""}
      </p>
      {note ? <div className="border-t border-white/10 px-4 py-3 text-xs text-paper/45">{note}</div> : null}
    </div>
  );
}

function CheckApi() {
  const [state, setState] = React.useState<"idle" | "checking" | "ok" | "down">("idle");
  const [detail, setDetail] = React.useState("");

  async function check() {
    setState("checking");
    try {
      const response = await fetch(`${API}/api/health`, { signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const data = (await response.json()) as {
        counts: { sources: number; references: number; patterns: number; upstream_components: number };
      };
      const entries = data.counts.sources + data.counts.references + data.counts.patterns;
      setDetail(`${entries} entries · ${data.counts.upstream_components} upstream components`);
      setState("ok");
    } catch {
      setDetail("The static catalog and prompts still work.");
      setState("down");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" size="sm" onClick={check} loading={state === "checking"}>
        {state === "checking" ? "Checking" : "Check the API"}
      </Button>
      <p aria-live="polite" className="text-xs text-paper/55">
        {state === "ok"
          ? `API ok · ${detail}`
          : state === "down"
            ? `API is offline right now. ${detail}`
            : "Live health check against the Worker."}
      </p>
    </div>
  );
}

export function UseVault() {
  const [active, setActive] = React.useState<TabId>("cli");
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const ref = useReveal<HTMLElement>();

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    const id = TABS[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  }

  return (
    <section ref={ref} id="use" className="reveal on-dark border-b border-white/10 bg-graphite">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16">
        <div role="tablist" aria-label="Ways to use the vault" className="flex gap-1 border-b border-white/10">
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`-mb-px border-b-2 px-5 py-3 text-sm transition-colors ${
                active === tab.id
                  ? "border-amber text-paper"
                  : "border-transparent text-paper/45 hover:text-paper/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 min-h-[18rem]">
          <div
            role="tabpanel"
            id="panel-cli"
            aria-labelledby="tab-cli"
            hidden={active !== "cli"}
            className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <CodeBlock
              label="Terminal"
              code={CLI_CODE}
              note="Commands: list, search, show, prompt, api. Add --json for raw output."
            />
            <div className="min-w-0 space-y-4 text-sm leading-relaxed text-paper/60">
              <p>
                The CLI runs on Node 20 with no dependencies. It reads the hosted catalog and falls
                back to the published copy when the API is unavailable.
              </p>
              <p>
                <code className="font-mono text-xs text-amber-soft">prompt</code> prints markdown only,
                so it pipes straight into an agent or a file.
              </p>
              <a
                href={`${REPO}/blob/main/bin/ui-vault.mjs`}
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-block text-paper/45 underline decoration-white/20 underline-offset-4 transition-colors hover:text-amber-soft"
              >
                Read the CLI source ↗
              </a>
            </div>
          </div>

          <div
            role="tabpanel"
            id="panel-api"
            aria-labelledby="tab-api"
            hidden={active !== "api"}
            className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <div className="min-w-0 space-y-4">
              <CodeBlock label="Request" code={API_CODE} />
              <div className="rounded-xl border border-white/10 px-4 py-3">
                <p className="label mb-2 text-paper/35">Routes</p>
                <ul className="grid gap-1.5 font-mono text-[11.5px] text-paper/55 sm:grid-cols-2">
                  <li>/api/health</li>
                  <li>/api/entries</li>
                  <li>/api/entries/:id</li>
                  <li>/api/entries/:id/prompt</li>
                  <li>/api/components</li>
                  <li>/mcp</li>
                </ul>
              </div>
            </div>
            <div className="min-w-0 space-y-5 text-sm leading-relaxed text-paper/60">
              <p>
                Read-only JSON with permissive CORS and edge caching. Filter entries by{" "}
                <code className="font-mono text-xs text-paper/80">q</code>,{" "}
                <code className="font-mono text-xs text-paper/80">tier</code>,{" "}
                <code className="font-mono text-xs text-paper/80">type</code>,{" "}
                <code className="font-mono text-xs text-paper/80">tag</code> and{" "}
                <code className="font-mono text-xs text-paper/80">demo</code>.
              </p>
              <CheckApi />
            </div>
          </div>

          <div
            role="tabpanel"
            id="panel-mcp"
            aria-labelledby="tab-mcp"
            hidden={active !== "mcp"}
            className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <CodeBlock label="MCP client config" code={MCP_CODE} />
            <div className="min-w-0 space-y-4 text-sm leading-relaxed text-paper/60">
              <p>
                Streamable HTTP with JSON responses, served at{" "}
                <code className="font-mono text-xs text-paper/80">/mcp</code>. No session state, no
                write tools.
              </p>
              <ul className="space-y-2 font-mono text-[11.5px] text-paper/50">
                <li>search_entries</li>
                <li>get_entry</li>
                <li>get_setup_prompt</li>
                <li>search_components</li>
              </ul>
              <p className="text-xs text-paper/40">
                Every tool is annotated read-only. The server speaks protocol 2025-06-18.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
