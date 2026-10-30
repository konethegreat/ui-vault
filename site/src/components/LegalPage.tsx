import type { ReactNode } from "react";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

export function LegalPage({
  updated,
  summary,
  sections,
  contact,
}: {
  updated: string;
  summary: ReactNode;
  sections: LegalSection[];
  contact?: ReactNode;
}) {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="label text-ink/40">On this page</p>
            <nav aria-label="On this page" className="mt-4">
              <ol className="space-y-2.5 border-l border-line pl-4">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex gap-2.5 text-[13px] leading-snug text-ink/55 transition-colors hover:text-ink"
                    >
                      <span className="font-mono text-[10px] text-ink/30 transition-colors group-hover:text-amber">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <p className="mt-8 border-t border-line pt-4 text-xs leading-relaxed text-ink/45">
              Last updated
              <br />
              <span className="text-ink/70">{updated}</span>
            </p>
          </aside>

          <div className="min-w-0">
            <div className="rounded-2xl border border-amber/45 bg-amber/10 p-6 sm:p-7">
              <p className="label text-ink/50">In short</p>
              <div className="legal-prose mt-3">{summary}</div>
            </div>

            <div className="mt-12 space-y-12">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-title`}
                  className="scroll-mt-28 border-t border-line pt-10 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl leading-none text-amber">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2
                      id={`${section.id}-title`}
                      className="font-display text-[1.9rem] leading-[1.1] tracking-tight text-ink sm:text-4xl"
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div className="legal-prose mt-4">{section.body}</div>
                </section>
              ))}
            </div>

            {contact}

            <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-ink/45">
              This page describes how this project operates. It is not legal advice, and it does not
              replace the license or law that applies to a particular work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
