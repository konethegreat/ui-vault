import * as React from "react";

export const REPO = "https://github.com/konethegreat/ui-vault";
export const API = "https://ui-vault-api.erictshivhinda.workers.dev";

export const OWNER = {
  name: "Kone Tshivhinda",
  portfolio: "https://konethegreat.github.io/#top",
  github: "https://github.com/konethegreat",
  linkedin: "https://www.linkedin.com/in/kone-tshivhinda-32a760233/",
} as const;

export type Tier = "pattern" | "reference" | "source";

export type Entry = {
  id: string;
  title: string;
  tier: Tier;
  type: string;
  status: string;
  stack: string[];
  tags: string[];
  license: string;
  license_url: string;
  rights: string;
  source_url: string;
  source_author: string;
  retrieved: string;
  published_source: boolean;
  demo: "live" | "link" | "none";
  demo_url: string;
  demo_source: string;
  path: string;
  prompt: string;
  prompt_url: string;
  summary: string;
};

export type Catalog = {
  name: string;
  license: string;
  generated: string;
  counts: {
    sources: number;
    references: number;
    patterns: number;
    upstream_components: number;
  };
  entries: Entry[];
};

export function useCatalog() {
  const [catalog, setCatalog] = React.useState<Catalog | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}catalog.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
        return response.json() as Promise<Catalog>;
      })
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setError("The catalog could not be loaded.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { catalog, error };
}

export async function fetchPrompt(entry: Entry): Promise<string> {
  if (entry.prompt_url) {
    try {
      const response = await fetch(entry.prompt_url, { signal: AbortSignal.timeout(4000) });
      if (response.ok) return response.text();
    } catch {
      // fall back to the copy published with the site
    }
  }
  const response = await fetch(`${import.meta.env.BASE_URL}prompts/${entry.id}.md`);
  if (!response.ok) throw new Error(`Prompt request failed: ${response.status}`);
  return response.text();
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    document.body.removeChild(area);
    return copied;
  }
}
