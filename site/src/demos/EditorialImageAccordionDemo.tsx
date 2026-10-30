import { EditorialImageAccordion } from "@/vendor/EditorialImageAccordion";
import acrylic from "@/assets/studies/acrylic.webp";
import arches from "@/assets/studies/arches.webp";
import beam from "@/assets/studies/beam.webp";
import glassPlanes from "@/assets/studies/glass-planes.webp";
import liquidSphere from "@/assets/studies/liquid-sphere.webp";

const items = [
  {
    src: glassPlanes,
    title: "Layering",
    description:
      "Depth comes from overlap before it comes from blur. A few planes at different distances do more than a stack of effects.",
    width: 900,
    height: 900,
  },
  {
    src: beam,
    title: "Light",
    description:
      "One warm beam sets the direction for the whole frame. Everything else stays quiet so the light has somewhere to land.",
    width: 900,
    height: 900,
  },
  {
    src: arches,
    title: "Structure",
    description:
      "Repeating arches give the eye a rhythm and a scale reference. Repetition is what makes the single break feel deliberate.",
    width: 900,
    height: 900,
  },
  {
    src: acrylic,
    title: "Surface",
    description:
      "A translucent surface picks up the color around it. Small differences in finish are enough to separate two neighbouring forms.",
    width: 900,
    height: 900,
  },
  {
    src: liquidSphere,
    title: "Depth",
    description:
      "A soft edge and a slow falloff push a shape back. Sharper edges pull it forward, so the frame reads without any labels.",
    width: 900,
    height: 900,
  },
];

export default function EditorialImageAccordionDemo() {
  return (
    <div className="bg-[#f8f4ec] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <p className="label text-ink/40">Interaction · tab pattern</p>
        <p className="max-w-xs text-left text-[11px] leading-relaxed text-ink/65 sm:text-right">
          Hover with a mouse, click or tap, or use the arrow keys. One caption follows the active
          panel.
        </p>
      </div>

      <EditorialImageAccordion label="Studies in form" items={items} />
    </div>
  );
}
