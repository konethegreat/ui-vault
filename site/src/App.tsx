import * as React from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HomePage } from "@/pages/HomePage";
import { DemosPage } from "@/pages/DemosPage";
import { CatalogPage } from "@/pages/CatalogPage";
import { UsePage } from "@/pages/UsePage";
import { RightsPage } from "@/pages/RightsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TakedownPage } from "@/pages/TakedownPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RouterProvider, useRouter } from "@/lib/router";
import { useDocumentMeta } from "@/lib/page-meta";

function CurrentPage() {
  const { path, navigate } = useRouter();

  React.useEffect(() => {
    if (path === "/" && window.location.hash.startsWith("#demo-")) {
      navigate(`/demos${window.location.hash}`, { replace: true });
    }
  }, [path, navigate]);

  switch (path) {
    case "/":
      return <HomePage />;
    case "/demos":
      return <DemosPage />;
    case "/catalog":
      return <CatalogPage />;
    case "/use":
      return <UsePage />;
    case "/rights":
      return <RightsPage />;
    case "/privacy":
      return <PrivacyPage />;
    case "/takedown":
      return <TakedownPage />;
    default:
      return <NotFoundPage />;
  }
}

function Shell() {
  useDocumentMeta();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-amber focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-graphite"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" tabIndex={-1} className="outline-none">
        <CurrentPage />
      </main>

      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  );
}
