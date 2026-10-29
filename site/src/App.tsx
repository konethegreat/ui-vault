import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Demos } from "@/components/Demos";
import { UseVault } from "@/components/UseVault";
import { CatalogSection } from "@/components/CatalogSection";
import { Rights } from "@/components/Rights";
import { SiteFooter } from "@/components/SiteFooter";

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-amber focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-graphite"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />
        <Demos />
        <CatalogSection />
        <UseVault />
        <Rights />
      </main>

      <SiteFooter />
    </div>
  );
}
