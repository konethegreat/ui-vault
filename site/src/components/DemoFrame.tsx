import * as React from "react";
import { useReveal } from "@/hooks/useReveal";

export function DemoFrame({
  id,
  index,
  title,
  credit,
  note,
  bleed = false,
  children,
}: {
  id: string;
  index: string;
  title: string;
  credit: React.ReactNode;
  note?: string;
  bleed?: boolean;
  children: React.ReactNode;
}) {
  const ref = useReveal<HTMLElement>();

  return (
    <figure
      ref={ref}
      id={`demo-${id}`}
      className="reveal scroll-mt-28 overflow-hidden rounded-2xl border border-white/10 bg-graphite shadow-[0_30px_80px_-40px_rgba(14,14,12,0.65)]"
    >
      <figcaption className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex items-start gap-4">
          <a
            href="#demos-index"
            aria-label={`Back to the demo index from ${title}`}
            className="label mt-0.5 text-amber underline-offset-4 hover:underline"
          >
            {index}
          </a>
          <div>
            <h3 className="font-display text-2xl leading-none text-paper">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-paper/55 [&_a]:text-paper/80 [&_a]:underline [&_a]:decoration-paper/25 [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-amber-soft hover:[&_a]:decoration-amber/60">
              {credit}
            </p>
          </div>
        </div>
        {note ? (
          <p className="max-w-sm text-xs leading-relaxed text-paper/45 sm:text-right">{note}</p>
        ) : null}
      </figcaption>
      {bleed ? (
        <div className="bg-graphite">{children}</div>
      ) : (
        <div className="p-2 sm:p-3">
          <div className="overflow-hidden rounded-xl bg-paper">{children}</div>
        </div>
      )}
    </figure>
  );
}
