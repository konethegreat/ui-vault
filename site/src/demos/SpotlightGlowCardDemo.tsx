import { SpotlightGlowCard } from "@/vendor/SpotlightGlowCard";

export default function SpotlightGlowCardDemo() {
  return (
    <div className="bg-[#0a0a08] text-paper">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label text-amber">Original pattern · MIT</p>
            <h4 className="mt-3 max-w-xl font-display text-[2rem] leading-[1.05] tracking-tight sm:text-4xl">
              Light that knows where you are.
            </h4>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-paper/55">
            Move the pointer across the cards, then tab through them. The border and the face use the
            same position, one ring and one wash.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 [--spot-card-title-font:var(--font-display)]">
          <SpotlightGlowCard
            eyebrow="01 / Pointer"
            title="Follow the light"
            description="The edge catches the pointer first, then the face picks up a weaker tint in the same place."
            meta="Per-card listener"
            tone="amber"
          />
          <SpotlightGlowCard
            eyebrow="02 / Focus"
            title="Keyboard parity"
            description="Tab in and the ring appears at a fixed anchor, so the state never depends on a mouse."
            meta="Focus-visible"
            tone="rust"
          />
          <SpotlightGlowCard
            eyebrow="03 / Touch"
            title="Resting warmth"
            description="No hover? Coarse pointers keep a low edge light, so the card never looks inert on a phone."
            meta="Hover: none"
            tone="bone"
          />
        </div>

        <p className="mt-8 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
          Three tones · masked border ring · no global style tag
        </p>
      </div>
    </div>
  );
}
