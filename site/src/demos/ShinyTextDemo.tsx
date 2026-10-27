import { AnimatedShinyText } from "@/vendor/AnimatedShinyText";

export default function ShinyTextDemo() {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
        Registry update
      </span>
      <AnimatedShinyText className="max-w-none text-2xl font-medium tracking-tight text-stone-700 sm:text-3xl">
        Four new components this week
      </AnimatedShinyText>
      <span className="text-sm text-stone-500">
        A moving highlight on a single line of text.
      </span>
    </div>
  );
}
