import { PageHero } from "@/components/PageHero";
import { CatalogSection } from "@/components/CatalogSection";
import { useCatalog } from "@/lib/catalog";

export function CatalogPage() {
  const { catalog } = useCatalog();
  const entries = catalog?.entries.length ?? 15;
  const upstream = catalog?.counts.upstream_components ?? 354;

  return (
    <>
      <PageHero
        eyebrow="The catalog"
        title={
          <>
            Every entry,{" "}
            <span className="italic text-paper/55">with its provenance.</span>
          </>
        }
        description="Generated from the markdown entries in the repository. Each card states the tier, the rights, the author and the license before any design advice."
        meta={`${entries} entries · ${upstream} upstream components`}
      />
      <CatalogSection />
    </>
  );
}
