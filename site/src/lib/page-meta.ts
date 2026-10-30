import * as React from "react";
import { useRouter } from "@/lib/router";

const SITE_URL = "https://konethegreat.github.io/ui-vault";

type Meta = { title: string; description: string; noindex?: boolean };

const META: Record<string, Meta> = {
  "/": {
    title: "UI Vault · Kone Tshivhinda",
    description:
      "A provenance-first index of UI patterns, with live demos, agent-ready prompts and attribution for every third-party design.",
  },
  "/demos": {
    title: "Live demos · UI Vault",
    description:
      "Thirteen live UI demos, from shader heroes to a 3D machine. Every stage names its author, source and license.",
  },
  "/catalog": {
    title: "Catalog · UI Vault",
    description:
      "Search UI entries by tier, tag and author. Copy agent-ready prompts with the attribution kept intact.",
  },
  "/use": {
    title: "Agent access · UI Vault",
    description:
      "Query the UI Vault catalog from a zero-dependency CLI, a read-only JSON API or an MCP server. Free, no key.",
  },
  "/rights": {
    title: "Rights and licensing · UI Vault",
    description:
      "How UI Vault handles ownership, licenses and attribution for original and third-party design work.",
  },
  "/privacy": {
    title: "Privacy · UI Vault",
    description:
      "What UI Vault collects, how GitHub Pages and Cloudflare process requests, and how to contact the maintainer.",
  },
  "/takedown": {
    title: "Takedown and reporting · UI Vault",
    description:
      "Report unlicensed use or an attribution error. UI Vault names every author and responds to credible rights notices.",
  },
};

const NOT_FOUND: Meta = {
  title: "Page not found · UI Vault",
  description: "The page could not be found. Browse the demos, the catalog or the rights policy instead.",
  noindex: true,
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function useDocumentMeta() {
  const { path } = useRouter();

  React.useEffect(() => {
    const meta = META[path] ?? NOT_FOUND;
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", `${SITE_URL}${path === "/" ? "/" : path}`);

    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (meta.noindex) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex,follow");
    } else {
      robots?.remove();
    }
  }, [path]);
}
