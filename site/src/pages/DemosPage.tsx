import { PageHero } from "@/components/PageHero";
import { Demos } from "@/components/Demos";
import { route } from "@/lib/router";

export function DemosPage() {
  return (
    <>
      <PageHero
        eyebrow="Live demos"
        title={
          <>
            Running components,{" "}
            <span className="italic text-paper/55">not screenshots.</span>
          </>
        }
        description="Each stage states who made it and under what license. Third-party demos run only when the author's license allows it, and every one keeps a visible credit."
        meta="13 live · 04 linked in the catalog"
        actions={
          <a
            href={route("/catalog")}
            className="label inline-flex text-paper/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-amber-soft"
          >
            Browse the catalog →
          </a>
        }
      />
      <Demos />
    </>
  );
}
