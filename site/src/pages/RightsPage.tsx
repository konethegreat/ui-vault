import { PageHero } from "@/components/PageHero";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { ContactCard } from "@/components/ContactCard";
import { OWNER, REPO } from "@/lib/catalog";
import { route } from "@/lib/router";

const UPDATED = "30 October 2026";

const sections: LegalSection[] = [
  {
    id: "ownership",
    title: "Who owns what",
    body: (
      <>
        <p>
          UI Vault is an index. It does not claim ownership of the third-party designs it documents,
          hosts or links to. Copyright in each third-party work stays with its author or the rights
          holder named on the entry.
        </p>
        <p>
          Code and prose written specifically for this repository are released under the MIT license
          in the repository root. That license covers the original work only. It does not extend to a
          third-party component, font, image, shader or demo that carries its own terms.
        </p>
        <p>
          A catalog entry is a record of provenance. It is not a sale, a sublicense or a statement
          that the work is free to use in every context.
        </p>
      </>
    ),
  },
  {
    id: "tiers",
    title: "How entries are classified",
    body: (
      <>
        <p>
          Every entry declares a tier and a rights value. The validator rejects entries that mix
          them up, and the site uses the same fields to decide what may run live.
        </p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>What it contains</th>
                <th>Rights values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Tier">
                  <code>pattern</code>
                </td>
                <td data-label="Contains">Original code written for this vault.</td>
                <td data-label="Rights">
                  <code>own</code>
                </td>
              </tr>
              <tr>
                <td data-label="Tier">
                  <code>reference</code>
                </td>
                <td data-label="Contains">
                  Notes on a specific design, plus source only when the license allows it.
                </td>
                <td data-label="Rights">
                  <code>permissive</code>, <code>restricted</code>, <code>noncommercial</code>,{" "}
                  <code>unknown</code>, <code>private-reference</code>
                </td>
              </tr>
              <tr>
                <td data-label="Tier">
                  <code>source</code>
                </td>
                <td data-label="Contains">
                  An upstream library index. No component files are copied into this repository.
                </td>
                <td data-label="Rights">
                  <code>permissive</code>, <code>restricted</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The full field-by-field rules are in{" "}
          <a href={`${REPO}/blob/main/AGENTS.md`} target="_blank" rel="noopener noreferrer">
            AGENTS.md
          </a>
          . The credits are listed in{" "}
          <a href={`${REPO}/blob/main/THIRD_PARTY.md`} target="_blank" rel="noopener noreferrer">
            THIRD_PARTY.md
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "permissions",
    title: "What you may do",
    body: (
      <>
        <p>
          The entry is the source of truth. If this summary and an entry ever disagree, the stricter
          reading wins.
        </p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Work</th>
                <th>Allowed</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Work">Original patterns and site code</td>
                <td data-label="Allowed">Use, modify and redistribute, including commercially.</td>
                <td data-label="Condition">Keep the MIT copyright and permission notice.</td>
              </tr>
              <tr>
                <td data-label="Work">Permissive reference</td>
                <td data-label="Allowed">Use under the license named on the entry.</td>
                <td data-label="Condition">
                  Keep the author, source and license links, and any required visible credit.
                </td>
              </tr>
              <tr>
                <td data-label="Work">Restricted upstream library</td>
                <td data-label="Allowed">Use inside an application, including a commercial one.</td>
                <td data-label="Condition">
                  Do not redistribute the component itself or sell it as a component.
                </td>
              </tr>
              <tr>
                <td data-label="Work">Non-commercial, unknown or private reference</td>
                <td data-label="Allowed">
                  Read it as inspiration and write an original implementation.
                </td>
                <td data-label="Condition">
                  Do not copy, host or republish the source or its preview assets.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Preview images, GIFs and metadata from a marketplace such as 21st.dev are not covered by a
          component's MIT license. This site does not copy them.
        </p>
      </>
    ),
  },
  {
    id: "attribution",
    title: "Attribution is part of the deal",
    body: (
      <>
        <p>
          When you adapt a work, keep a visible credit in the target project. A comment near the
          component is enough:
        </p>
        <p>
          <code>Adapted from TITLE by AUTHOR (URL), LICENSE.</code>
        </p>
        <p>
          A credit is not a formality. Removing an author's name or presenting their design as your
          own misrepresents who did the work, and it can breach the license even when the rest of the
          code is unchanged.
        </p>
        <p>
          The catalog and every agent prompt repeat this requirement, because a generated
          implementation is still an adaptation when it follows someone else's design.
        </p>
      </>
    ),
  },
  {
    id: "platforms",
    title: "Platform terms are not a license",
    body: (
      <>
        <p>
          shadcn/ui and Magic UI publish MIT-licensed components. React Bits adds a Commons Clause
          that permits use inside applications but forbids selling or redistributing the components
          themselves. 21st.dev is a marketplace: permission depends on the license recorded on each
          component page, not on the platform's existence.
        </p>
        <p>
          Where a page records no license, this site treats the component as unknown and links to it
          without hosting its code. Where the author records a permissive license, the source may be
          vendored and run with a credit.
        </p>
        <p>
          Marketplace terms can be broader than a component license, but they never make a
          non-commercial or unknown work free to reuse.
        </p>
      </>
    ),
  },
  {
    id: "not-granted",
    title: "What this site does not grant",
    body: (
      <>
        <ul>
          <li>No ownership of any third-party design, name or mark.</li>
          <li>No sublicense to use a work beyond the license recorded on its entry.</li>
          <li>No trademark or endorsement rights in an author's name or brand.</li>
          <li>No warranty that a work is fit for a particular purpose or free of third-party claims.</li>
          <li>No permission to scrape, rebrand or republish restricted material from this site.</li>
        </ul>
        <p>
          A link back to an author is a credit, not a permission slip. If an entry points to a
          restricted or unknown work, treat it as reading material and build your own version.
        </p>
      </>
    ),
  },
  {
    id: "reporting",
    title: "Reporting a rights problem",
    body: (
      <>
        <p>
          If you believe an entry misstates a license, misses a credit or hosts work it should not,
          use the{" "}
          <a href={route("/takedown")}>takedown and reporting process</a>. It explains what to send
          and what happens next.
        </p>
        <p>
          Credible notices are handled before new work. Entries that cannot be verified are removed
          or reduced to a link while the claim is reviewed.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          This page is updated when the catalog rules or the site's structure change. The date at the
          top records the last substantive revision, and the repository history records every edit.
        </p>
        <p>
          If a change would narrow a permission that already applied to your use of the site, it does
          not apply retroactively to work you did under the earlier terms.
        </p>
      </>
    ),
  },
];

export function RightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Rights and licensing"
        title={
          <>
            Every design belongs{" "}
            <span className="italic text-paper/55">to someone.</span>
          </>
        }
        description="UI Vault records who made each work and what its license allows. It does not buy, sell or relicense third-party design."
        meta={`Last updated ${UPDATED}`}
      />
      <LegalPage
        updated={UPDATED}
        summary={
          <>
            <p>
              Original code and prose in this repository are MIT. Third-party designs stay with their
              authors, and each entry is governed only by the license recorded on it. Nothing on this
              site grants rights beyond that license.
            </p>
          </>
        }
        sections={sections}
        contact={
          <ContactCard
            title="Questions about a license"
            body={
              <p>
                For an attribution correction, a licensing question or a takedown, use the reporting
                process. It keeps a written record and reaches the maintainer directly.
              </p>
            }
          >
            <a
              href={route("/takedown")}
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
            >
              Reporting process
            </a>
            <a
              href={`${REPO}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
            >
              GitHub issues ↗
            </a>
            <a
              href={OWNER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
            >
              LinkedIn ↗
            </a>
          </ContactCard>
        }
      />
    </>
  );
}
