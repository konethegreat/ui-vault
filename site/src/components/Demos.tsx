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
import DepthZoomParallaxDemo from "@/demos/DepthZoomParallaxDemo";
import EditorialImageAccordionDemo from "@/demos/EditorialImageAccordionDemo";
import StationMachineDemo from "@/demos/StationMachineDemo";
import RocketFieldHeroDemo from "@/demos/RocketFieldHeroDemo";
import { DemoFrame } from "@/components/DemoFrame";
import { REPO } from "@/lib/catalog";

const MAGIC_LICENSE = "https://github.com/magicuidesign/magicui/blob/main/LICENSE.md";

const DEMO_INDEX = [
  { id: "liquid-sculpture-hero", title: "Liquid Sculpture Hero", group: "Third-party" },
  { id: "mascot-portfolio-hero", title: "Mascot Portfolio Hero", group: "Third-party" },
  { id: "glass-folder-cards", title: "Glassmorphism Folder Cards", group: "Third-party" },
  { id: "nebula-hero", title: "Nebula Hero", group: "Original" },
  { id: "depth-zoom-parallax", title: "Depth Zoom Parallax", group: "Original" },
  { id: "editorial-image-accordion", title: "Editorial Image Accordion", group: "Original" },
  { id: "button", title: "Button", group: "Original" },
  { id: "marquee", title: "Marquee", group: "Magic UI" },
  { id: "animated-shiny-text", title: "Animated Shiny Text", group: "Magic UI" },
  { id: "number-ticker", title: "Number Ticker", group: "Magic UI" },
  { id: "dot-pattern", title: "Dot Pattern", group: "Magic UI" },
  { id: "station-machine", title: "Station Machine", group: "Original" },
  { id: "rocket-field-hero", title: "Rocket Field Hero", group: "Original" },
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
  return (
    <section id="demos" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-16">
        <nav id="demos-index" aria-label="Demo index" className="scroll-mt-28">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="label text-ink/40">On this page</p>
            <p className="label text-ink/40">13 live</p>
          </div>
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
            id="depth-zoom-parallax"
            index="05"
            title="Depth Zoom Parallax"
            credit={
              <>
                Kone Tshivhinda · MIT ·{" "}
                <Link href={`${REPO}/blob/main/library/depth-zoom-parallax/DepthZoomParallax.tsx`}>
                  read the source
                </Link>
                {" · inspired by "}
                <Link href="https://21st.dev/@efferd/components/zoom-parallax">Efferd</Link>
              </>
            }
            note="Original implementation. The Efferd original records no license, so no code or assets were copied from it."
            bleed
            clip={false}
          >
            <DepthZoomParallaxDemo />
          </DemoFrame>

          <DemoFrame
            id="editorial-image-accordion"
            index="06"
            title="Editorial Image Accordion"
            credit={
              <>
                Kone Tshivhinda · MIT ·{" "}
                <Link
                  href={`${REPO}/blob/main/library/editorial-image-accordion/EditorialImageAccordion.tsx`}
                >
                  read the source
                </Link>
                {" · inspired by "}
                <Link href="https://21st.dev/@minhxthanh/components/interactive-image-accordion">
                  Le Thanh
                </Link>
              </>
            }
            note="Original implementation. Real tabs, keyboard support and a vertical layout under 700px. The Le Thanh original records no license, so no code or assets were copied."
          >
            <EditorialImageAccordionDemo />
          </DemoFrame>

          <DemoFrame
            id="button"
            index="07"
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
              index="08"
              title="Marquee"
              credit={<MagicCredit docs="https://magicui.design/docs/components/marquee" />}
            >
              <MarqueeDemo />
            </DemoFrame>

            <DemoFrame
              id="animated-shiny-text"
              index="09"
              title="Animated Shiny Text"
              credit={<MagicCredit docs="https://magicui.design/docs/components/animated-shiny-text" />}
            >
              <ShinyTextDemo />
            </DemoFrame>

            <DemoFrame
              id="number-ticker"
              index="10"
              title="Number Ticker"
              credit={<MagicCredit docs="https://magicui.design/docs/components/number-ticker" />}
            >
              <NumberTickerDemo />
            </DemoFrame>

            <DemoFrame
              id="dot-pattern"
              index="11"
              title="Dot Pattern"
              credit={<MagicCredit docs="https://magicui.design/docs/components/dot-pattern" />}
            >
              <DotPatternDemo />
            </DemoFrame>
          </div>

          <DemoFrame
            id="station-machine"
            index="12"
            title="Station Machine"
            credit={
              <>
                Kone Tshivhinda · MIT ·{" "}
                <Link href={`${REPO}/blob/main/library/station-machine/StationMachine.tsx`}>
                  read the source
                </Link>
                {" · inspired by "}
                <Link href="https://agentic-factory-3d.vercel.app">Evgeny Shilov</Link>
              </>
            }
            note="Original scene. The Interactive 3D Machine original records no license, so no code or scene was copied. three.js loads as a separate chunk when this demo mounts."
            bleed
          >
            <StationMachineDemo />
          </DemoFrame>

          <DemoFrame
            id="rocket-field-hero"
            index="13"
            title="Rocket Field Hero"
            credit={
              <>
                Kone Tshivhinda · MIT ·{" "}
                <Link href={`${REPO}/blob/main/library/rocket-field-hero/RocketFieldHero.tsx`}>
                  read the source
                </Link>
                {" · inspired by "}
                <Link href="https://www.shadertoy.com/user/atzedent">Matthias Hurrle</Link>
              </>
            }
            note="Original canvas scene. The Animated Rocket Shader Hero original is a Star Nest derivative under non-commercial terms, so no shader code or asset was copied. Move to drift, click the sky to launch."
            bleed
          >
            <RocketFieldHeroDemo />
          </DemoFrame>
        </div>
      </div>
    </section>
  );
}
