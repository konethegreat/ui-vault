import NebulaHero from "@/vendor/NebulaHero";
import { Marquee } from "@/vendor/Marquee";
import { AnimatedShinyText } from "@/vendor/AnimatedShinyText";
import { NumberTicker } from "@/vendor/NumberTicker";
import { useCatalog, OWNER } from "@/lib/catalog";
import { usePrefersReducedMotion } from "@/hooks/useReveal";

const FALLBACK_TITLES = [
  "Liquid Sculpture Hero",
  "Nebula Hero",
  "Marquee",
  "Number Ticker",
  "Animated Shiny Text",
  "Dot Pattern",
  "Button",
  "Interactive 3D Machine",
];

function Stat({ value, label, reduced }: { value: number; label: string; reduced: boolean }) {
  return (
    <div className="bg-graphite px-5 py-6">
      <dd className="font-display text-4xl leading-none tabular-nums text-paper sm:text-5xl">
        {reduced ? value : <NumberTicker value={value} className="text-paper" />}
      </dd>
      <dt className="mt-3 text-[11px] leading-relaxed text-paper/45">{label}</dt>
    </div>
  );
}

export function Hero() {
  const { catalog } = useCatalog();
  const reduced = usePrefersReducedMotion();

  const entries = catalog?.entries ?? [];
  const titles = entries.length ? entries.map((entry) => entry.title) : FALLBACK_TITLES;
  const liveDemos = entries.filter((entry) => entry.demo === "live").length || 7;

  return (
    <section id="top" className="scroll-mt-20">
      <div className="on-dark">
        <NebulaHero
          eyebrow="UI Vault · by Kone Tshivhinda"
          headline="Interfaces, with the credits attached."
          body="A working index of UI patterns, live demos and agent-ready prompts. Every third-party design is named, licensed and linked back to its author."
          primaryCta={{ label: "Browse the catalog", href: "#catalog" }}
          secondaryCta={{ label: "Use the vault", href: "#use" }}
          height="min(88svh, 780px)"
        />
      </div>

      <div className="on-dark border-b border-white/10 bg-graphite">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="border-b border-white/10 py-5">
            <Marquee aria-hidden="true" repeat={2} className="[--duration:64s] [--gap:2rem]">
              {titles.map((title) => (
                <span
                  key={title}
                  className="flex shrink-0 items-center gap-8 pr-8 text-sm tracking-tight text-paper/40"
                >
                  {title}
                  <span aria-hidden="true" className="size-1 rotate-45 bg-amber/70" />
                </span>
              ))}
            </Marquee>
            <ul className="sr-only">
              {titles.map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 py-12 lg:grid-cols-[1.05fr_1.35fr] lg:items-end lg:gap-16">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-paper px-3 py-1.5">
                <AnimatedShinyText className="max-w-none text-[10px] font-medium uppercase tracking-[0.16em] text-ink/75">
                  Open source · read-only API · free to query
                </AnimatedShinyText>
              </span>
              <h2 className="mt-6 max-w-md font-display text-[2rem] leading-[1.08] tracking-tight text-paper sm:text-[2.6rem]">
                Designed and maintained by {OWNER.name}.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/55">
                Original work is MIT. Third-party components stay with their authors, and the rights
                rules that keep this honest are enforced by the validator.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                {[
                  ["Portfolio", OWNER.portfolio],
                  ["GitHub", OWNER.github],
                  ["LinkedIn", OWNER.linkedin],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-paper/65 transition-colors hover:text-amber-soft"
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className="font-mono text-[10px] text-amber/70 transition-transform group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              <Stat value={entries.length || 12} label="entries in the vault" reduced={reduced} />
              <Stat value={liveDemos} label="live demos on this page" reduced={reduced} />
              <Stat
                value={catalog?.counts.upstream_components ?? 354}
                label="upstream components indexed"
                reduced={reduced}
              />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
