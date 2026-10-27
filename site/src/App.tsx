import * as React from "react";
import ButtonDemo from "./demos/ButtonDemo";
import NebulaDemo from "./demos/NebulaDemo";
import LiquidSculptureDemo from "./demos/LiquidSculptureDemo";
import MarqueeDemo from "./demos/MarqueeDemo";
import ShinyTextDemo from "./demos/ShinyTextDemo";
import NumberTickerDemo from "./demos/NumberTickerDemo";
import DotPatternDemo from "./demos/DotPatternDemo";

const REPO = "https://github.com/konethegreat/ui-vault";
const MAGIC_LICENSE = "https://github.com/magicuidesign/magicui/blob/main/LICENSE.md";

type Entry = {
  id: string;
  title: string;
  tier: "pattern" | "reference" | "source";
  type: string;
  status: string;
  tags: string[];
  license: string;
  rights: string;
  source_url: string;
  source_author: string;
  published_source: boolean;
  path: string;
  summary: string;
  demo?: string;
  demo_url?: string;
};

type Catalog = {
  counts: { sources: number; references: number; patterns: number; upstream_components: number };
  entries: Entry[];
};

function CreditLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-stone-300 underline-offset-2 transition-colors hover:text-stone-900 hover:decoration-stone-500"
    >
      {children}
    </a>
  );
}

function DemoFrame({
  id,
  index,
  title,
  credit,
  note,
  bleed = false,
  children,
}: {
  id: string;
  index: string;
  title: string;
  credit: React.ReactNode;
  note?: string;
  bleed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure
      id={`demo-${id}`}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04)]"
    >
      <figcaption className="flex flex-col gap-2 border-b border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] tracking-[0.12em] text-stone-400">{index}</span>
          <div>
            <h3 className="text-[15px] font-medium text-stone-900">{title}</h3>
            <p className="mt-0.5 text-xs text-stone-500">{credit}</p>
          </div>
        </div>
        {note ? <p className="max-w-sm text-xs leading-relaxed text-stone-500">{note}</p> : null}
      </figcaption>
      <div className={bleed ? "" : "bg-white"}>{children}</div>
    </figure>
  );
}

function TierBadge({ tier }: { tier: Entry["tier"] }) {
  const styles =
    tier === "pattern"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tier === "reference"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-stone-200 bg-stone-100 text-stone-600";
  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${styles}`}>
      {tier}
    </span>
  );
}

function CatalogSection() {
  const [catalog, setCatalog] = React.useState<Catalog | null>(null);
  const [error, setError] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [tier, setTier] = React.useState<"all" | Entry["tier"]>("all");

  React.useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}catalog.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
        return response.json() as Promise<Catalog>;
      })
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setError("The catalog could not be loaded. Browse it on GitHub instead.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const entries = catalog?.entries ?? [];
  const filtered = entries.filter((entry) => {
    if (tier !== "all" && entry.tier !== tier) return false;
    const haystack = [entry.title, entry.summary, entry.source_author, entry.type, ...entry.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <section id="catalog" className="scroll-mt-20 border-t border-stone-200 bg-stone-50/60">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-stone-400">02 / Catalog</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
              Every entry, with its provenance
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              Generated from the markdown entries in the repository. Each card states the tier, the rights,
              the author and the license before any design advice.
            </p>
          </div>
          <p className="shrink-0 text-sm text-stone-500">
            <span className="tabular-nums text-stone-900">{catalog?.counts.upstream_components ?? 354}</span>{" "}
            upstream components indexed
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(["all", "pattern", "reference", "source"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTier(value)}
                aria-pressed={tier === value}
                className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition-colors ${
                  tier === value
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
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
              className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-900"
            />
          </div>
        </div>

        <p className="mt-5 text-xs text-stone-500" aria-live="polite">
          {catalog ? `${filtered.length} of ${entries.length} entries` : error ? "" : "Loading the catalog"}
        </p>

        {error ? (
          <p className="mt-6 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
            {error}{" "}
            <CreditLink href={`${REPO}#readme`}>Open the repository</CreditLink>.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {filtered.map((entry) => (
              <li
                key={entry.path}
                className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <TierBadge tier={entry.tier} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-stone-400">
                    {entry.type}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-stone-900">{entry.title}</h3>
                <p className="mt-1 text-xs text-stone-500">
                  {entry.source_author} · {entry.license}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">{entry.summary}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs">
                  <a href={`${REPO}/blob/main/${entry.path}`} className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-600">
                    Entry
                  </a>
                  {entry.source_url ? (
                    <a href={entry.source_url} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-900">
                      Source
                    </a>
                  ) : null}
                  {entry.demo === "live" ? (
                    <a href={`#demo-${entry.id}`} className="text-stone-500 hover:text-stone-900">
                      Live demo
                    </a>
                  ) : null}
                  {entry.demo === "link" && entry.demo_url ? (
                    <a href={entry.demo_url} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-900">
                      Original demo
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}

        {catalog && filtered.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
            Nothing matches that search.
          </p>
        ) : null}
      </div>
    </section>
  );
}

const RIGHTS = [
  {
    label: "Original",
    body: "Written in this repository and licensed MIT. Reuse it, retheme it, ship it.",
  },
  {
    label: "Permissive",
    body: "MIT-licensed third-party work. Hosted with its license and a visible link to the author and source.",
  },
  {
    label: "Restricted",
    body: "Non-commercial, share-alike or unknown terms. Linked and documented, never republished as code.",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-stone-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#faf9f7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <a href="#top" className="flex items-center gap-2.5">
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-md bg-stone-900 font-mono text-[11px] text-white">
              UV
            </span>
            <span className="text-sm font-medium tracking-tight">UI Vault</span>
          </a>
          <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
            <a href="#demos" className="hidden text-stone-600 transition-colors hover:text-stone-900 sm:inline">
              Live demos
            </a>
            <a href="#catalog" className="hidden text-stone-600 transition-colors hover:text-stone-900 sm:inline">
              Catalog
            </a>
            <a href="#rights" className="hidden text-stone-600 transition-colors hover:text-stone-900 md:inline">
              Rights
            </a>
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-stone-300 px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section id="top" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pb-20 sm:pt-24">
            <div className="grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-stone-400">
                  Design references for my projects
                </p>
                <h1 className="mt-5 max-w-3xl font-serif text-[2.6rem] leading-[1.06] tracking-tight text-stone-900 sm:text-6xl">
                  A working vault of interface patterns, with the credits attached.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-600">
                  Live demos of what I build, and a provenance-first index of components from shadcn/ui,
                  Magic UI and React Bits. Third-party work stays named and licensed. Where the license
                  allows it, the original component runs here unmodified.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#demos"
                    className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700"
                  >
                    See the demos
                  </a>
                  <a
                    href="#catalog"
                    className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
                  >
                    Browse the catalog
                  </a>
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 lg:grid-cols-1">
                {[
                  ["354", "upstream components"],
                  ["3", "pinned libraries"],
                  ["2", "hosting paths"],
                ].map(([value, label]) => (
                  <div key={label} className="bg-white px-5 py-5">
                    <dt className="text-xs text-stone-500">{label}</dt>
                    <dd className="mt-1 font-serif text-2xl tabular-nums text-stone-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-12 border-t border-stone-200 pt-5 text-xs leading-relaxed text-stone-500">
              Original work is MIT. Every third-party entry names its author, license and source before
              any design notes. Nothing in this vault is presented as mine unless the entry says so.
            </p>
          </div>
        </section>

        <section id="demos" className="scroll-mt-20 border-t border-stone-200">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-stone-400">01 / Live demos</p>
                <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
                  Running components, not screenshots
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-600">
                  Each frame states who made it and under what license. The first demo is the original
                  third-party component; the rest are patterns built for this vault or MIT components
                  installed through the Magic UI registry.
                </p>
              </div>
              <p className="shrink-0 text-sm text-stone-500">7 demos</p>
            </div>

            <div className="mt-10 space-y-10">
              <DemoFrame
                id="liquid-sculpture-hero"
                index="01"
                title="Liquid Sculpture Hero"
                credit={
                  <>
                    <CreditLink href="https://guglielmogiannattasio.it">Guglielmo Giannattasio</CreditLink>
                    {" · "}
                    <CreditLink href="https://21st.dev/@gughigug/components/liquid-sculpture-hero">
                      via 21st.dev, MIT
                    </CreditLink>
                  </>
                }
                note="Third-party. Runs the vendored component with a local image. Edits: the credit link, a local image source, and one dead field removed."
              >
                <LiquidSculptureDemo />
              </DemoFrame>

              <DemoFrame
                id="nebula-hero"
                index="02"
                title="Nebula Hero"
                credit={
                  <>
                    Kone · MIT ·{" "}
                    <CreditLink href={`${REPO}/blob/main/library/nebula-hero/NebulaHero.tsx`}>
                      read the source
                    </CreditLink>
                  </>
                }
                note="Original clean-room shader. Inspired by Star Nest and its adaptation by Matthias Hurrle, with no copied code."
              >
                <NebulaDemo />
              </DemoFrame>

              <DemoFrame
                id="button"
                index="03"
                title="Button"
                credit={
                  <>
                    Kone · MIT ·{" "}
                    <CreditLink href={`${REPO}/blob/main/library/button/Button.tsx`}>read the source</CreditLink>
                  </>
                }
                note="Four variants, three sizes, loading and focus states. Retheme with CSS variables."
              >
                <ButtonDemo />
              </DemoFrame>

              <div className="grid gap-6 lg:grid-cols-2">
                <DemoFrame
                  id="marquee"
                  index="04"
                  title="Marquee"
                  credit={
                    <>
                      Magic UI ·{" "}
                      <CreditLink href="https://magicui.design/docs/components/marquee">docs</CreditLink>
                      {" · "}
                      <CreditLink href={MAGIC_LICENSE}>MIT</CreditLink>
                    </>
                  }
                >
                  <MarqueeDemo />
                </DemoFrame>

                <DemoFrame
                  id="animated-shiny-text"
                  index="05"
                  title="Animated Shiny Text"
                  credit={
                    <>
                      Magic UI ·{" "}
                      <CreditLink href="https://magicui.design/docs/components/animated-shiny-text">docs</CreditLink>
                      {" · "}
                      <CreditLink href={MAGIC_LICENSE}>MIT</CreditLink>
                    </>
                  }
                >
                  <ShinyTextDemo />
                </DemoFrame>

                <DemoFrame
                  id="number-ticker"
                  index="06"
                  title="Number Ticker"
                  credit={
                    <>
                      Magic UI ·{" "}
                      <CreditLink href="https://magicui.design/docs/components/number-ticker">docs</CreditLink>
                      {" · "}
                      <CreditLink href={MAGIC_LICENSE}>MIT</CreditLink>
                    </>
                  }
                >
                  <NumberTickerDemo />
                </DemoFrame>

                <DemoFrame
                  id="dot-pattern"
                  index="07"
                  title="Dot Pattern"
                  credit={
                    <>
                      Magic UI ·{" "}
                      <CreditLink href="https://magicui.design/docs/components/dot-pattern">docs</CreditLink>
                      {" · "}
                      <CreditLink href={MAGIC_LICENSE}>MIT</CreditLink>
                    </>
                  }
                >
                  <DotPatternDemo />
                </DemoFrame>
              </div>
            </div>
          </div>
        </section>

        <CatalogSection />

        <section id="rights" className="scroll-mt-20 border-t border-stone-200">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-stone-400">03 / Rights</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
              Hosting follows the license, not convenience
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              The validator rejects any entry that claims a live demo without a verified license and a
              demo source file. That is why some references link out instead of running here.
            </p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 md:grid-cols-3">
              {RIGHTS.map((item, i) => (
                <div key={item.label} className="bg-white p-6">
                  <span className="font-mono text-xs text-stone-400">0{i + 1}</span>
                  <h3 className="mt-4 text-base font-medium text-stone-900">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-stone-500">
              Read the full policy in{" "}
              <CreditLink href={`${REPO}/blob/main/AGENTS.md`}>AGENTS.md</CreditLink> and{" "}
              <CreditLink href={`${REPO}/blob/main/NOTICE.md`}>NOTICE.md</CreditLink>.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Built by Kone. Original work MIT; third-party work stays with its authors.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={REPO} className="hover:text-stone-900">Repository</a>
            <a href={`${REPO}/blob/main/THIRD_PARTY.md`} className="hover:text-stone-900">Third-party credits</a>
            <a href={`${import.meta.env.BASE_URL}licenses/magic-ui.txt`} className="hover:text-stone-900">Magic UI license</a>
            <a href={`${import.meta.env.BASE_URL}licenses/liquid-sculpture.txt`} className="hover:text-stone-900">Sculpture license</a>
            <a href={`${REPO}/blob/main/LICENSE`} className="hover:text-stone-900">MIT license</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
