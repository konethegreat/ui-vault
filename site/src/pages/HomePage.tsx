import { Hero } from "@/components/Hero";
import { useCatalog } from "@/lib/catalog";
import { route } from "@/lib/router";

export function HomePage() {
  const { catalog } = useCatalog();
  const entries = catalog?.entries.length ?? 21;
  const live = catalog?.entries.filter((entry) => entry.demo === "live").length ?? 13;
  const linked = catalog?.entries.filter((entry) => entry.demo === "link").length ?? 4;
  const upstream = catalog?.counts.upstream_components ?? 354;

  const ways = [
    {
      href: route("/demos"),
      label: "Watch",
      title: "See it running",
      body: "Real components in real frames. Each stage states who made it, where it came from and what license applies.",
      meta: `${String(live).padStart(2, "0")} live · ${String(linked).padStart(2, "0")} linked`,
    },
    {
      href: route("/catalog"),
      label: "Read",
      title: "Open the catalog",
      body: "Search every entry by tier, tag or author. Each one carries its provenance and an agent-ready setup prompt.",
      meta: `${entries} entries · ${upstream} upstream components`,
    },
    {
      href: route("/use"),
      label: "Build",
      title: "Query it directly",
      body: "A zero-dependency CLI, a read-only JSON API and an MCP server, all reading the same catalog. No key, no account.",
      meta: "CLI · API · MCP",
    },
  ];

  return (
    <>
      <Hero />

      <section id="start" className="border-b border-line bg-paper-2">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label text-ink/45">Start here</p>
              <h2 className="mt-4 max-w-xl font-display text-[2.6rem] leading-[1.02] tracking-tight text-ink sm:text-5xl">
                Three ways into the vault.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink/60">
              The site is organized by what you came to do. Nothing important is buried at the bottom
              of a single page.
            </p>
          </div>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {ways.map((way, index) => (
              <li key={way.href} className="bg-[#f8f4ec]">
                <a href={way.href} className="group flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className="label text-ink/35">{String(index + 1).padStart(2, "0")}</span>
                    <span className="label text-amber">{way.label}</span>
                  </div>
                  <h3 className="mt-8 font-display text-[1.85rem] leading-none tracking-tight text-ink">
                    {way.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">{way.body}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-[11px] text-ink/45">
                    <span>{way.meta}</span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-ink"
                    >
                      →
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-8 border-t border-line pt-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <p className="label text-ink/40">The rule</p>
              <p className="mt-3 max-w-2xl font-display text-[2rem] leading-[1.12] tracking-tight text-ink sm:text-4xl">
                Third-party designs belong to their authors.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
                This site is an index, not a marketplace. Each entry stays under the license its
                author published, and nothing here grants more than that license allows.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm lg:items-end">
              <a
                href={route("/rights")}
                className="font-medium text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
              >
                Read the rights policy
              </a>
              <a
                href={route("/takedown")}
                className="font-medium text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
              >
                Report misuse or an attribution error
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
