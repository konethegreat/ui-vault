import { PageHero } from "@/components/PageHero";
import { route } from "@/lib/router";

const LINKS = [
  { label: "Live demos", href: route("/demos"), note: "Thirteen running components, every one credited." },
  { label: "Catalog", href: route("/catalog"), note: "Every entry with its author, license and prompt." },
  { label: "Rights", href: route("/rights"), note: "What each tier allows and what stays with the author." },
];

export function NotFoundPage() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title={
          <>
            This page is not{" "}
            <span className="italic text-paper/55">in the vault.</span>
          </>
        }
        description="The address may be mistyped, or the page may have moved when the site was reorganized."
        meta="Not found"
      />
      <div className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="label text-ink/40">Try one of these</p>
          <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {LINKS.map((link) => (
              <li key={link.href} className="bg-[#f8f4ec]">
                <a href={link.href} className="group flex h-full flex-col p-6">
                  <span className="flex items-center justify-between gap-3 font-display text-2xl leading-none tracking-tight text-ink">
                    {link.label}
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs text-ink/35 transition-transform group-hover:translate-x-1 group-hover:text-ink"
                    >
                      →
                    </span>
                  </span>
                  <span className="mt-3 text-sm leading-relaxed text-ink/55">{link.note}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={route("/")}
            className="mt-8 inline-flex text-sm font-medium text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
          >
            Back to the home page
          </a>
        </div>
      </div>
    </>
  );
}
