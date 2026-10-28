import * as React from "react";
import { DotPattern } from "@/vendor/DotPattern";
import { Button } from "@/vendor/Button";
import {
  REPO,
  copyText,
  fetchPrompt,
  useCatalog,
  type Entry,
  type Tier,
} from "@/lib/catalog";
import { useReveal } from "@/hooks/useReveal";

const TIER_LABEL: Record<Tier, string> = {
  pattern: "Library",
  reference: "Reference",
  source: "Source",
};

function CatalogCard({ entry, index }: { entry: Entry; index: number }) {
  const ref = useReveal<HTMLLIElement>();
  const [status, setStatus] = React.useState<"idle" | "loading" | "copied" | "failed">("idle");
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopyPrompt() {
    setStatus("loading");
    try {
      const text = await fetchPrompt(entry);
      const copied = await copyText(text);
      setStatus(copied ? "copied" : "failed");
    } catch {
      setStatus("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2600);
  }

  return (
    <li
      ref={ref}
      className="reveal lift flex flex-col rounded-2xl border border-line bg-[#f8f4ec] p-5"
      style={{ transitionDelay: `${Math.min(index, 5) * 45}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-amber/50 bg-amber/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/70">
          {TIER_LABEL[entry.tier]}
        </span>
        <span className="label text-ink/30">{entry.type}</span>
      </div>

      <h3 className="mt-4 font-display text-[1.7rem] leading-[1.05] tracking-tight text-ink">
        {entry.title}
      </h3>
      <p className="mt-1.5 text-[11.5px] text-ink/50">
        {entry.source_author} · {entry.license}
      </p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">{entry.summary}</p>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs">
        <Button variant="secondary" size="sm" onClick={onCopyPrompt} loading={status === "loading"}>
          {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy prompt"}
        </Button>
        <a
          href={`${REPO}/blob/main/${entry.path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink/75 underline decoration-ink/20 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink/50"
        >
          Entry
        </a>
        {entry.source_url ? (
          <a
            href={entry.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/50 transition-colors hover:text-ink"
          >
            Source
          </a>
        ) : null}
        {entry.demo === "live" ? (
          <a href={`#demo-${entry.id}`} className="text-ink/50 transition-colors hover:text-ink">
            Live demo
          </a>
        ) : null}
        {entry.demo === "link" && entry.demo_url ? (
          <a
            href={entry.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/50 transition-colors hover:text-ink"
          >
            Original demo
          </a>
        ) : null}
        <span aria-live="polite" className="sr-only">
          {status === "copied" ? `Prompt copied for ${entry.title}` : ""}
          {status === "failed" ? `Prompt copy failed for ${entry.title}` : ""}
        </span>
      </div>
    </li>
  );
}

export function CatalogSection() {
  const { catalog, error } = useCatalog();
  const [query, setQuery] = React.useState("");
  const [tier, setTier] = React.useState<"all" | Tier>("all");
  const headRef = useReveal<HTMLDivElement>();

  const entries = catalog?.entries ?? [];
  const filtered = entries.filter((entry) => {
    if (tier !== "all" && entry.tier !== tier) return false;
    const haystack = [entry.title, entry.summary, entry.source_author, entry.type, ...entry.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <section id="catalog" className="relative scroll-mt-20 overflow-hidden border-b border-line bg-paper-2">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px]">
        <DotPattern
          width={28}
          height={28}
          cr={1}
          className="text-ink/20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_74%)]"
        />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <div ref={headRef} className="reveal flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-ink/45">03 / Catalog</p>
            <h2 className="mt-4 max-w-2xl font-display text-[2.6rem] leading-[1.02] tracking-tight text-ink sm:text-6xl">
              Every entry,{" "}
              <span className="italic text-ink/55">with its provenance.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
              Generated from the markdown entries in the repository. Each card states the tier, the
              rights, the author and the license before any design advice.
            </p>
          </div>
          <p className="label shrink-0 text-ink/40">
            {catalog?.counts.upstream_components ?? 354} upstream components indexed
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by tier">
            {(["all", "pattern", "reference", "source"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTier(value)}
                aria-pressed={tier === value}
                className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition-colors ${
                  tier === value
                    ? "border-amber bg-amber text-graphite"
                    : "border-ink/15 bg-[#f8f4ec] text-ink/60 hover:border-ink/40 hover:text-ink"
                }`}
              >
                {value === "all" ? "All" : `${value}s`}
              </button>
            ))}
          </div>
          <div className="w-full md:max-w-xs">
            <label htmlFor="catalog-search" className="sr-only">
              Search entries
            </label>
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, tag, author"
              className="w-full rounded-xl border border-ink/15 bg-[#f8f4ec] px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-amber"
            />
          </div>
        </div>

        <p className="mt-5 text-xs text-ink/50" aria-live="polite">
          {catalog ? `${filtered.length} of ${entries.length} entries` : error ? "" : "Loading the catalog"}
        </p>

        {error ? (
          <p className="mt-6 rounded-xl border border-line bg-[#f8f4ec] p-5 text-sm text-ink/65">
            {error}{" "}
            <a
              href={`${REPO}#readme`}
              className="font-medium text-ink underline decoration-ink/25 underline-offset-2"
            >
              Open the repository
            </a>
            .
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {filtered.map((entry, index) => (
              <CatalogCard key={entry.id} entry={entry} index={index} />
            ))}
          </ul>
        )}

        {catalog && filtered.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-ink/25 p-6 text-center text-sm text-ink/55">
            Nothing matches that search.
          </p>
        ) : null}
      </div>
    </section>
  );
}
