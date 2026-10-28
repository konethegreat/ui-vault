import { REPO } from "@/lib/catalog";
import { useReveal } from "@/hooks/useReveal";

const RIGHTS = [
  {
    label: "Original",
    body: "Written in this repository and licensed MIT. Reuse it, retheme it, ship it, keep the credit.",
  },
  {
    label: "Permissive",
    body: "MIT-licensed third-party work. Hosted with its license and a visible link to the author and source.",
  },
  {
    label: "Restricted",
    body: "Non-commercial, share-alike or unknown terms. Linked and documented, never republished as code.",
  },
];

export function Rights() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} id="rights" className="reveal scroll-mt-20 border-b border-line bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <p className="label text-ink/45">04 / Rights</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="max-w-2xl font-display text-[2.6rem] leading-[1.02] tracking-tight text-ink sm:text-6xl">
            Hosting follows the license,{" "}
            <span className="italic text-ink/55">not convenience.</span>
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-ink/65 lg:justify-self-end">
            The validator rejects any entry that claims a live demo without a verified license and a
            demo source file. That is why some references link out instead of running here.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {RIGHTS.map((item, index) => (
            <div key={item.label} className="bg-[#f8f4ec] p-6 sm:p-7">
              <span className="font-display text-3xl leading-none text-amber">0{index + 1}</span>
              <h3 className="mt-5 text-base font-semibold text-ink">{item.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm italic leading-relaxed text-ink/55">
            Original work is MIT. Third-party work stays with its authors.
          </p>
          <p className="text-xs text-ink/50">
            Read the policy in{" "}
            <a
              href={`${REPO}/blob/main/AGENTS.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-ink/25 underline-offset-2 hover:decoration-ink/60"
            >
              AGENTS.md
            </a>{" "}
            and{" "}
            <a
              href={`${REPO}/blob/main/NOTICE.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-ink/25 underline-offset-2 hover:decoration-ink/60"
            >
              NOTICE.md
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
