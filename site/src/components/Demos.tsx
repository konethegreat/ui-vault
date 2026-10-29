import * as React from "react";
import LiquidSculptureDemo from "@/demos/LiquidSculptureDemo";
import MascotPortfolioDemo from "@/demos/MascotPortfolioDemo";
import GlassFolderCardsDemo from "@/demos/GlassFolderCardsDemo";
import NebulaDemo from "@/demos/NebulaDemo";
import ButtonDemo from "@/demos/ButtonDemo";
import MarqueeDemo from "@/demos/MarqueeDemo";
import ShinyTextDemo from "@/demos/ShinyTextDemo";
import NumberTickerDemo from "@/demos/NumberTickerDemo";
import DotPatternDemo from "@/demos/DotPatternDemo";
import { DemoFrame } from "@/components/DemoFrame";
import { MachineSketch } from "@/components/MachineSketch";
import { REPO } from "@/lib/catalog";
import { useReveal } from "@/hooks/useReveal";

const MAGIC_LICENSE = "https://github.com/magicuidesign/magicui/blob/main/LICENSE.md";

const DEMO_INDEX = [
  { id: "liquid-sculpture-hero", title: "Liquid Sculpture Hero", group: "Third-party" },
  { id: "mascot-portfolio-hero", title: "Mascot Portfolio Hero", group: "Third-party" },
  { id: "glass-folder-cards", title: "Glassmorphism Folder Cards", group: "Third-party" },
  { id: "nebula-hero", title: "Nebula Hero", group: "Original" },
  { id: "button", title: "Button", group: "Original" },
  { id: "marquee", title: "Marquee", group: "Magic UI" },
  { id: "animated-shiny-text", title: "Animated Shiny Text", group: "Magic UI" },
  { id: "number-ticker", title: "Number Ticker", group: "Magic UI" },
  { id: "dot-pattern", title: "Dot Pattern", group: "Magic UI" },
  { id: "machine", title: "Interactive 3D Machine", group: "Linked" },
];

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function MagicCredit({ docs }: { docs: string }) {
  return (
    <>
      Magic UI · <Link href={docs}>docs</Link> · <Link href={MAGIC_LICENSE}>MIT</Link>
    </>
  );
}

export function Demos() {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="demos" className="scroll-mt-20 border-b border-line bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <div ref={headRef} className="reveal flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-ink/45">01 / Live demos</p>
            <h2 className="mt-4 max-w-2xl font-display text-[2.6rem] leading-[1.02] tracking-tight text-ink sm:text-6xl">
              Running components,{" "}
              <span className="italic text-ink/60">not screenshots.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
              Each stage states who made it and under what license. The first three demos are
              third-party components with a verified MIT license. The rest are patterns built for
              this vault or MIT components installed through the Magic UI registry.
            </p>
          </div>
          <p className="label shrink-0 text-ink/40">09 live · 01 linked</p>
        </div>

        <nav id="demos-index" aria-label="Demo index" className="mt-10 scroll-mt-28">
          <p className="label text-ink/40">On this page</p>
          <ul className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {DEMO_INDEX.map((demo, index) => (
              <li key={demo.id}>
                <a
                  href={`#demo-${demo.id}`}
                  className="group flex items-baseline gap-3 rounded-md border-b border-line/70 py-2 text-sm text-ink/70 transition-colors hover:text-ink"
                >
                  <span className="font-mono text-[10px] text-ink/35 transition-colors group-hover:text-ink/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{demo.title}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/30">
                    {demo.group}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 space-y-8">
          <DemoFrame
            id="liquid-sculpture-hero"
            index="01"
            title="Liquid Sculpture Hero"
            credit={
              <>
                <Link href="https://guglielmogiannattasio.it">Guglielmo Giannattasio</Link>
                {" · "}
                <Link href="https://21st.dev/@gughigug/components/liquid-sculpture-hero">
                  via 21st.dev, MIT
                </Link>
              </>
            }
            note="Third-party. Runs the vendored component with a local image. Edits: the credit link, a local image source, and one dead field removed."
            bleed
          >
            <LiquidSculptureDemo />
          </DemoFrame>

          <DemoFrame
            id="mascot-portfolio-hero"
            index="02"
            title="Mascot Portfolio Hero"
            credit={
              <>
                <Link href="https://21st.dev/@kedhareswer">Kedhareswer Naidu</Link>
                {" · "}
                <Link href="https://21st.dev/@kedhareswer/components/mascot-portfolio-hero">
                  via 21st.dev, MIT
                </Link>
              </>
            }
            note="Third-party. Runs the vendored component unchanged, with both of its fonts self-hosted."
            bleed
          >
            <MascotPortfolioDemo />
          </DemoFrame>

          <DemoFrame
            id="glass-folder-cards"
            index="03"
            title="Glassmorphism Folder Cards"
            credit={
              <>
                <Link href="https://21st.dev/@kedhareswer">Kedhareswer Naidu</Link>
                {" · "}
                <Link href="https://21st.dev/@kedhareswer/components/glass-folder-cards">
                  via 21st.dev, MIT
                </Link>
              </>
            }
            note="Third-party. Runs the vendored component unchanged. The demo stage is measured so the folders fit their column."
          >
            <GlassFolderCardsDemo />
          </DemoFrame>

          <DemoFrame
            id="nebula-hero"
            index="04"
            title="Nebula Hero"
            credit={
              <>
                Kone Tshivhinda · MIT ·{" "}
                <Link href={`${REPO}/blob/main/library/nebula-hero/NebulaHero.tsx`}>read the source</Link>
              </>
            }
            note="Original clean-room shader. Inspired by Star Nest and its adaptation by Matthias Hurrle, with no copied code."
            bleed
          >
            <NebulaDemo />
          </DemoFrame>

          <DemoFrame
            id="button"
            index="05"
            title="Button"
            credit={
              <>
                Kone Tshivhinda · MIT ·{" "}
                <Link href={`${REPO}/blob/main/library/button/Button.tsx`}>read the source</Link>
              </>
            }
            note="Four variants, three sizes, loading and focus states. Retheme with CSS variables."
          >
            <ButtonDemo />
          </DemoFrame>

          <div className="grid gap-8 md:grid-cols-2">
            <DemoFrame
              id="marquee"
              index="06"
              title="Marquee"
              credit={<MagicCredit docs="https://magicui.design/docs/components/marquee" />}
            >
              <MarqueeDemo />
            </DemoFrame>

            <DemoFrame
              id="animated-shiny-text"
              index="07"
              title="Animated Shiny Text"
              credit={<MagicCredit docs="https://magicui.design/docs/components/animated-shiny-text" />}
            >
              <ShinyTextDemo />
            </DemoFrame>

            <DemoFrame
              id="number-ticker"
              index="08"
              title="Number Ticker"
              credit={<MagicCredit docs="https://magicui.design/docs/components/number-ticker" />}
            >
              <NumberTickerDemo />
            </DemoFrame>

            <DemoFrame
              id="dot-pattern"
              index="09"
              title="Dot Pattern"
              credit={<MagicCredit docs="https://magicui.design/docs/components/dot-pattern" />}
            >
              <DotPatternDemo />
            </DemoFrame>
          </div>

          <MachineSketch />
        </div>
      </div>
    </section>
  );
}
