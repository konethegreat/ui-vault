import { NumberTicker } from "@/vendor/NumberTicker";

const stats = [
  { value: 354, label: "upstream components indexed", suffix: "" },
  { value: 7, label: "live demos on this page", suffix: "" },
  { value: 3, label: "libraries with pinned commits", suffix: "" },
];

export default function NumberTickerDemo() {
  return (
    <div className="grid grid-cols-1 divide-y divide-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {stats.map((stat) => (
        <div key={stat.label} className="px-6 py-10 text-center">
          <p className="text-4xl font-medium tracking-tight text-stone-900 tabular-nums">
            <NumberTicker value={stat.value} className="text-stone-900" />
            {stat.suffix}
          </p>
          <p className="mt-2 text-sm text-stone-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
