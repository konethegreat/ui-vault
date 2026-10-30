import { PageHero } from "@/components/PageHero";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { ContactCard } from "@/components/ContactCard";
import { OWNER, REPO } from "@/lib/catalog";
import { route } from "@/lib/router";

const UPDATED = "30 October 2026";
const NOTICE_URL = `${REPO}/issues/new?template=rights-notice.yml`;

const sections: LegalSection[] = [
  {
    id: "position",
    title: "Our position",
    body: (
      <>
        <p>
          <strong>Every third-party design on this site belongs to its author.</strong> UI Vault
          documents the work, names the author and records the license. It does not claim authorship
          and does not grant permission that the author did not grant.
        </p>
        <p>
          If a work is hosted here, it is because the recorded license allows hosting and the credit
          is visible. If the license is unknown, non-commercial or otherwise restrictive, the entry
          links to the original and keeps the code out of this repository.
        </p>
        <p>
          That rule is enforced by the validator before publication, not by a disclaimer added
          afterwards.
        </p>
      </>
    ),
  },
  {
    id: "misuse",
    title: "What counts as misuse",
    body: (
      <>
        <p>The following are not permitted and are not covered by any license on this site:</p>
        <ul>
          <li>Copying restricted, non-commercial or unknown work from an entry.</li>
          <li>Removing an author's name, source link or license from permissive work.</li>
          <li>Re-hosting a vendored component without its copyright and permission notice.</li>
          <li>Presenting an indexed design, or a close copy of it, as original work.</li>
          <li>Using an author's name, portrait or logo to imply endorsement.</li>
          <li>Scraping the catalog or API to rebuild or resell a library of third-party designs.</li>
          <li>Bypassing the rate limit or attempting to disrupt the API.</li>
        </ul>
        <p>
          Reading an entry, learning the technique and writing an original implementation is allowed.
          Copying the expression and deleting the credit is not.
        </p>
      </>
    ),
  },
  {
    id: "before-notice",
    title: "If your work appears here",
    body: (
      <>
        <p>
          Start with the entry itself. It should name you, link to the source and state the license
          you published. If a field is wrong, a link is stale or a summary misrepresents the work,
          that can usually be fixed quickly without removing anything.
        </p>
        <p>
          If the work should not be hosted at all, say so. The entry can be reduced to a link or
          removed while the claim is checked.
        </p>
      </>
    ),
  },
  {
    id: "notice",
    title: "What a notice should include",
    body: (
      <>
        <p>
          A useful notice is specific and verifiable. Please include:
        </p>
        <ol>
          <li>The work you own or represent, with a link to the original publication or repository.</li>
          <li>The exact URL on this site where the disputed material appears.</li>
          <li>Your name, organisation if relevant, and a contact method.</li>
          <li>A short explanation of why the current use is not authorized.</li>
          <li>A statement that you have a good faith belief the use is unauthorized.</li>
          <li>A statement that the information is accurate and that you are authorized to act.</li>
          <li>Your signature, typed or electronic.</li>
        </ol>
        <p>
          This is modeled on common notice-and-takedown practice. It is not a statutory procedure
          under the DMCA, and this project is not a US safe harbor. If you need a formal statutory
          process, use the hosting provider's channel as well.
        </p>
      </>
    ),
  },
  {
    id: "response",
    title: "What happens next",
    body: (
      <>
        <ul>
          <li>The notice is acknowledged within five business days where possible.</li>
          <li>
            If the claim is credible, the entry, source file or live demo is removed or restricted
            while it is reviewed.
          </li>
          <li>The change is recorded in the public repository history.</li>
          <li>
            The material may be restored if the license or authorization is demonstrated, or if a
            counter-notice shows the claim is mistaken.
          </li>
          <li>
            Nothing is restored merely because a counter-notice was sent. The site is not obliged to
            host any particular work.
          </li>
        </ul>
        <p>
          The maintainer may also correct a credit, replace hosted code with a link, or remove an
          entire entry without waiting for a formal process.
        </p>
      </>
    ),
  },
  {
    id: "counter",
    title: "Counter-notice",
    body: (
      <>
        <p>
          If material was removed and you believe that was a mistake, reply to the same thread or
          send a private message with:
        </p>
        <ul>
          <li>The URL or entry that was removed.</li>
          <li>The license or written permission that allows the use.</li>
          <li>Your contact details and a statement of good faith.</li>
        </ul>
        <p>
          A plausible license claim is reviewed promptly. A claim that merely disagrees with the
          removal, without evidence, will not restore the material.
        </p>
      </>
    ),
  },
  {
    id: "send",
    title: "Where to send a notice",
    body: (
      <>
        <p>
          Open a{" "}
          <a href={NOTICE_URL} target="_blank" rel="noopener noreferrer">
            rights notice issue
          </a>{" "}
          using the template. It creates a public, timestamped record and keeps the details in one
          place.
        </p>
        <p>
          If the matter is sensitive, do not post private contact details, identity documents or
          confidential agreements in a public issue. Send a short message through{" "}
          <a href={OWNER.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>{" "}
          asking for a private channel, and include only what is needed to start the conversation.
        </p>
        <p>
          There is no dedicated takedown email address. These two channels are monitored. A notice
          sent to a social media comment or an unrelated repository may be missed.
        </p>
      </>
    ),
  },
  {
    id: "hosts",
    title: "Host-level routes",
    body: (
      <>
        <p>
          The site is hosted by GitHub Pages and the API by Cloudflare. If you need a formal
          provider-level process, or the maintainer cannot be reached, use:
        </p>
        <ul>
          <li>
            <a
              href="https://docs.github.com/en/site-policy/content-removal-policies/dmca-takedown-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub's DMCA takedown policy
            </a>
            .
          </li>
          <li>
            <a href="https://www.cloudflare.com/abuse/" target="_blank" rel="noopener noreferrer">
              Cloudflare's abuse reporting process
            </a>
            .
          </li>
        </ul>
        <p>
          A provider notice does not replace a notice to this project, and the provider may contact
          the maintainer with a copy.
        </p>
      </>
    ),
  },
  {
    id: "abuse",
    title: "False or abusive notices",
    body: (
      <>
        <p>
          Do not use this process to suppress criticism, remove a competitor's work or claim ownership
          of a design you did not make. Knowingly false claims can expose the sender to liability and
          will be refused.
        </p>
        <p>
          Notices are assessed on evidence: the original publication, the license, the dates and the
          relationship between the works. A demand without evidence is not a takedown.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this process",
    body: (
      <p>
        This page is updated when the reporting channels or the review process change. The repository
        history records each revision, and the date at the top shows the last substantive edit.
      </p>
    ),
  },
];

export function TakedownPage() {
  return (
    <>
      <PageHero
        eyebrow="Rights enforcement"
        title={
          <>
            These designs belong{" "}
            <span className="italic text-paper/55">to their authors.</span>
          </>
        }
        description="A public record of authorship, and a clear process for anyone who believes their work has been copied, miscredited or hosted without permission."
        meta={`Last updated ${UPDATED}`}
        actions={
          <a
            href={route("/rights")}
            className="label inline-flex text-paper/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-amber-soft"
          >
            Read the rights policy →
          </a>
        }
      />
      <LegalPage
        updated={UPDATED}
        summary={
          <>
            <p>
              <strong>No license is granted by this index.</strong> Each work stays under the license
              its author published. Removing a credit, republishing restricted code or passing a
              design off as your own is not permitted.
            </p>
            <p>
              A credible rights notice leads to removal or restriction while the claim is reviewed.
            </p>
          </>
        }
        sections={sections}
        contact={
          <ContactCard
            title="Send a rights notice"
            body={
              <p>
                Use the issue template for a public record, or ask for a private channel on LinkedIn
                if the details are sensitive. Include the work, the URL, your authority and the
                license or permission you rely on.
              </p>
            }
          >
            <a
              href={NOTICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
            >
              Open a rights notice ↗
            </a>
            <a
              href={OWNER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
            >
              Private message on LinkedIn ↗
            </a>
            <a
              href={route("/privacy")}
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
            >
              Privacy notice
            </a>
          </ContactCard>
        }
      />
    </>
  );
}
