import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  meta,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="on-dark border-b border-white/10 bg-graphite">
      <div className="mx-auto max-w-[1200px] px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label text-amber">{eyebrow}</p>
          {meta ? <div className="label text-paper/40">{meta}</div> : null}
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:gap-16">
          <h1 className="max-w-3xl font-display text-[2.7rem] leading-[1.02] tracking-tight text-paper sm:text-6xl">
            {title}
          </h1>
          <div className="max-w-xl space-y-5 lg:justify-self-end">
            <p className="text-[15px] leading-relaxed text-paper/60">{description}</p>
            {actions}
          </div>
        </div>
      </div>
    </section>
  );
}
