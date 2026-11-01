import PortalCarousel, { type PortalCarouselImage } from "@/vendor/PortalCarousel";
import amberFold from "@/assets/portal/amber-fold.webp";
import emberRipple from "@/assets/portal/ember-ripple.webp";
import glassPassage from "@/assets/portal/glass-passage.webp";
import ironBloom from "@/assets/portal/iron-bloom.webp";
import lightBeam from "@/assets/portal/light-beam.webp";

const images: PortalCarouselImage[] = [
  {
    src: amberFold,
    title: "Amber Fold",
    alt: "A folded amber paper ribbon lit from the side against a dark wall",
  },
  {
    src: glassPassage,
    title: "Glass Passage",
    alt: "A corridor of amber-lit glass arches receding into shadow",
  },
  {
    src: emberRipple,
    title: "Ember Ripple",
    alt: "Concentric ripples spreading across black water under warm light",
  },
  {
    src: lightBeam,
    title: "Light Beam",
    alt: "A volumetric beam of warm light falling through a narrow slot in a wall",
  },
  {
    src: ironBloom,
    title: "Iron Bloom",
    alt: "A brass bloom sculpture with dark patina and a soft rim light",
  },
];

export default function PortalCarouselDemo() {
  return (
    <div className="bg-[#0a0a08] text-paper">
      <div className="mx-auto max-w-[1000px] px-5 pb-6 pt-12 sm:px-8 sm:pt-16">
        <p className="label text-amber">Third-party · MPL 2.0</p>
        <h4 className="mt-3 max-w-xl font-display text-[2rem] leading-[1.05] tracking-tight sm:text-4xl">
          The next image is the handle.
        </h4>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/55">
          Click the stage and the parked preview becomes the frame. Five stills from the same warm
          study, one GSAP expansion, no arrows and no dots.
        </p>
      </div>

      <PortalCarousel
        images={images}
        label="Next"
        thumbWidth={200}
        className="h-[min(74svh,660px)]! min-h-[420px]"
      />

      <div className="mx-auto max-w-[1000px] px-5 py-8 sm:px-8">
        <p className="border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
          Vendored with its license notice · five generated stills · keyboard reachable preview
        </p>
      </div>
    </div>
  );
}
