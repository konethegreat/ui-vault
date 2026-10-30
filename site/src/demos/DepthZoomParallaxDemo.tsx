import { DepthZoomParallax } from "@/vendor/DepthZoomParallax";
import acrylic from "@/assets/studies/acrylic.webp";
import arches from "@/assets/studies/arches.webp";
import beam from "@/assets/studies/beam.webp";
import foldedLight from "@/assets/studies/folded-light.webp";
import glassPlanes from "@/assets/studies/glass-planes.webp";
import liquidSphere from "@/assets/studies/liquid-sphere.webp";
import ripples from "@/assets/studies/ripples.webp";

const images = [
  glassPlanes,
  foldedLight,
  liquidSphere,
  arches,
  acrylic,
  ripples,
  beam,
].map((src) => ({ src, width: 900, height: 900 }));

export default function DepthZoomParallaxDemo() {
  return (
    <div className="rounded-b-2xl bg-[#0a0a08] text-paper [--dzp-top:61px]">
      <div className="mx-auto max-w-[1000px] px-5 pb-2 pt-12 sm:px-8 sm:pt-16">
        <p className="label text-amber">Original pattern</p>
        <h4 className="mt-3 max-w-xl font-display text-[2rem] leading-[1.05] tracking-tight sm:text-4xl">
          A camera move from seven stills.
        </h4>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/55">
          One sticky stage, one scroll range, no scroll hijacking. Each panel scales on its own
          curve, so flat images read as depth. Reduce motion and it settles into a still grid.
        </p>
      </div>

      <DepthZoomParallax images={images} />

      <div className="mx-auto max-w-[1000px] px-5 pb-12 sm:px-8">
        <p className="border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
          Seven generated stills · scales 4x to 9x · 240vh of scroll
        </p>
      </div>
    </div>
  );
}
