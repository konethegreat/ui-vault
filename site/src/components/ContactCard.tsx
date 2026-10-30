import type { ReactNode } from "react";

export function ContactCard({
  title = "Talk to the maintainer",
  body,
  children,
}: {
  title?: string;
  body: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mt-14 rounded-2xl border border-line bg-paper-2 p-6 sm:p-8">
      <p className="label text-ink/45">Contact</p>
      <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="legal-prose mt-3 max-w-2xl">{body}</div>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">{children}</div>
    </div>
  );
}
