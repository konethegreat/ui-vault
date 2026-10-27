import { DotPattern } from "@/vendor/DotPattern";

export default function DotPatternDemo() {
  return (
    <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-stone-50 px-6 text-center">
      <DotPattern
        width={18}
        height={18}
        cr={1.2}
        glow
        className="text-stone-400/60 [mask-image:radial-gradient(340px_circle_at_center,black,transparent)]"
      />
      <div className="relative">
        <p className="text-lg font-medium text-stone-800">
          Texture without an image request
        </p>
        <p className="mt-1 text-sm text-stone-500">
          An SVG grid sized to its container, with optional glow.
        </p>
      </div>
    </div>
  );
}
