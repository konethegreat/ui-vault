import { PageHero } from "@/components/PageHero";
import { UseVault } from "@/components/UseVault";
import { REPO } from "@/lib/catalog";

export function UsePage() {
  return (
    <>
      <PageHero
        eyebrow="Agent access"
        title={
          <>
            Call it from an agent,{" "}
            <span className="italic text-paper/55">a terminal or a browser.</span>
          </>
        }
        description="The same catalog powers a hosted API, a zero-dependency CLI and a read-only MCP server. Free to query, no key and no account."
        meta="Read-only · free · no key"
        actions={
          <a
            href={`${REPO}#agent-access`}
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex text-paper/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-amber-soft"
          >
            Full reference ↗
          </a>
        }
      />
      <UseVault />
    </>
  );
}
