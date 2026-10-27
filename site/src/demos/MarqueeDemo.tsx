import { Marquee } from "@/vendor/Marquee";

const principles = [
  { n: "01", title: "Readable type", note: "Contrast before decoration" },
  { n: "02", title: "Honest credits", note: "Every source named" },
  { n: "03", title: "Real states", note: "Focus, loading, disabled" },
  { n: "04", title: "Reduced motion", note: "Calm by default" },
  { n: "05", title: "Tokenized color", note: "Retheme without edits" },
  { n: "06", title: "Light first", note: "Paper before neon" },
];

export default function MarqueeDemo() {
  return (
    <div className="relative overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <Marquee aria-hidden="true" pauseOnHover className="[--duration:38s] [--gap:1rem]">
        {principles.map((item) => (
          <article
            key={item.n}
            className="w-60 shrink-0 rounded-lg border border-stone-200 bg-white p-5"
          >
            <span className="text-xs tabular-nums text-stone-400">{item.n}</span>
            <h3 className="mt-6 text-base font-medium text-stone-900">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-stone-500">{item.note}</p>
          </article>
        ))}
      </Marquee>
      <ul className="sr-only">
        {principles.map((item) => (
          <li key={item.n}>
            {item.title}: {item.note}
          </li>
        ))}
      </ul>
    </div>
  );
}
