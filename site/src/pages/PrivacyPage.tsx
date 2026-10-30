import { PageHero } from "@/components/PageHero";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { ContactCard } from "@/components/ContactCard";
import { API, OWNER, REPO } from "@/lib/catalog";

const UPDATED = "30 October 2026";

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who runs this site",
    body: (
      <>
        <p>
          UI Vault is a personal, non-commercial project maintained by {OWNER.name} in Johannesburg,
          South Africa. It is not a company, a marketplace or a data broker.
        </p>
        <p>
          The source is public at{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            github.com/konethegreat/ui-vault
          </a>
          . The site is a static build served by GitHub Pages, with a small read-only API on
          Cloudflare Workers.
        </p>
      </>
    ),
  },
  {
    id: "not-collected",
    title: "What this site does not collect",
    body: (
      <>
        <ul>
          <li>No accounts, sign-ups or contact forms.</li>
          <li>No cookies, tracking pixels or advertising identifiers.</li>
          <li>No third-party analytics, heatmaps or session recording.</li>
          <li>No newsletter, profiling or marketing lists.</li>
          <li>No uploaded files or user-generated content.</li>
        </ul>
        <p>
          The site does not ask for a name, email address or any other personal detail. Fonts are
          self-hosted, so loading a page does not contact a font provider.
        </p>
      </>
    ),
  },
  {
    id: "hosting",
    title: "Hosting and request logs",
    body: (
      <>
        <p>
          The pages are served by GitHub Pages. Like any web host, GitHub processes the technical data
          needed to deliver a request and keep the service secure, which can include an IP address,
          browser headers, the requested URL and a timestamp.
        </p>
        <p>
          That processing is governed by the{" "}
          <a
            href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Privacy Statement
          </a>
          . This project does not operate its own web server and does not receive visitor-level access
          logs from GitHub.
        </p>
      </>
    ),
  },
  {
    id: "api",
    title: "The API and rate limiting",
    body: (
      <>
        <p>
          Requests to{" "}
          <a href={API} target="_blank" rel="noopener noreferrer">
            {API.replace("https://", "")}
          </a>{" "}
          are handled by Cloudflare Workers. Cloudflare processes request metadata at its edge to
          route the request, apply security controls and return a response, under the{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
            Cloudflare Privacy Policy
          </a>
          .
        </p>
        <p>
          To keep the free API available, the Worker applies a best-effort limit of about 120 requests
          per minute per IP address. The IP address is read from the{" "}
          <code>CF-Connecting-IP</code> header and held in a short-lived in-memory counter. The counter
          expires after 60 seconds, is cleaned up when the table grows, and disappears when the Worker
          instance restarts. It is not written to a database, a queue or a log.
        </p>
        <p>
          The API is read-only. It does not set cookies, does not identify users and does not accept
          personal information.
        </p>
      </>
    ),
  },
  {
    id: "browser-storage",
    title: "Cookies and browser storage",
    body: (
      <>
        <p>
          The site sets no cookies and writes nothing to local storage or session storage. It does not
          use a service worker to cache personal data.
        </p>
        <p>
          When you press a copy button, the page writes the selected prompt or command to your
          clipboard. That happens only after your click, stays on your device and is not sent to the
          project.
        </p>
        <p>
          Hosting providers may use strictly necessary security mechanisms at the network edge. Those
          are controlled by the provider, not by this site's code.
        </p>
      </>
    ),
  },
  {
    id: "external",
    title: "External links",
    body: (
      <>
        <p>
          Entries link to authors, documentation and source platforms, including 21st.dev, Magic UI,
          shadcn/ui, React Bits, GitHub, LinkedIn and Shadertoy. Opening one of those links takes you
          to another service with its own cookies and privacy policy.
        </p>
        <p>
          This site does not embed third-party trackers, videos or comment widgets. A link is not an
          endorsement, and the project does not control what an external site collects.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Retention and security",
    body: (
      <>
        <p>
          The project keeps no visitor database, so there is no project-held visitor record to retain.
          The only transient value is the rate-limit counter described above, which is discarded
          quickly by design.
        </p>
        <p>
          Hosting providers retain their own technical logs for their own periods. Consult their
          policies for details.
        </p>
        <p>
          The site is served over HTTPS and has no login, payment or upload surface. The API exposes
          published catalog data only. No system is perfectly secure, so do not send sensitive
          information through a public GitHub issue.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your choices and rights",
    body: (
      <>
        <p>
          Because the project does not hold personal information about visitors, there is usually
          nothing to access, correct or delete. If you believe the project holds something about you,
          ask, and the request will be assessed.
        </p>
        <p>
          Where the Protection of Personal Information Act (POPIA) or a similar law applies, the
          project relies on the legitimate interest of operating the site and preventing abuse. You
          may object to that processing or ask what is held by contacting the maintainer.
        </p>
        <p>
          If a request is not resolved, you can contact the relevant supervisory authority, such as
          the South African Information Regulator at{" "}
          <a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer">
            inforegulator.org.za
          </a>
          , or your local data protection authority.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        The site is a design reference for developers and is not directed at children. It has no
        accounts and does not knowingly collect information from anyone, including children.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this notice",
    body: (
      <>
        <p>
          This notice is updated when the hosting, API behavior or data practices change. The date at
          the top records the last substantive revision.
        </p>
        <p>
          The site does not use dark patterns to obtain consent, because it does not ask for consent
          to collect anything.
        </p>
      </>
    ),
  },
];

export function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title={
          <>
            Nothing to opt out of,{" "}
            <span className="italic text-paper/55">because nothing is collected.</span>
          </>
        }
        description="No accounts, no cookies, no analytics and no ads. This page explains the small amount of technical data that the hosting providers process to serve requests."
        meta={`Last updated ${UPDATED}`}
      />
      <LegalPage
        updated={UPDATED}
        summary={
          <>
            <p>
              The short version: this site does not collect personal information. GitHub Pages and
              Cloudflare process ordinary request data to deliver pages and keep the API available,
              under their own privacy policies.
            </p>
          </>
        }
        sections={sections}
        contact={
          <ContactCard
            title="Privacy questions"
            body={
              <p>
                Ask about anything on this page, or report a concern about how the site or API
                handles data. For public questions, open an issue. For a private message, use
                LinkedIn.
              </p>
            }
          >
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
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
            >
              GitHub privacy ↗
            </a>
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-amber"
            >
              Cloudflare privacy ↗
            </a>
          </ContactCard>
        }
      />
    </>
  );
}
