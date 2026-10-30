# Site policy facts

This file records the facts behind `/rights`, `/privacy` and `/takedown` so future edits do not
invent claims. The pages must stay accurate; if behavior changes, update the page and this file in
the same change.

## Ownership and licensing

- Original code and prose in this repository are MIT. The license file is `LICENSE`.
- Third-party designs remain the property of their authors. The vault claims no ownership and grants
  no sublicense.
- The three tiers are `pattern`, `reference` and `source`.
- Rights values are `own`, `permissive`, `restricted`, `noncommercial`, `unknown` and
  `private-reference`.
- A live demo requires `rights: own` or `permissive`, a verified license and a real `demo_source`.
- Unknown, non-commercial and private references keep `published_source: false`, no code in the
  public entry folder, and "do not copy" in the prompt.
- The attribution format is `Adapted from TITLE by AUTHOR (URL), LICENSE.`

## Privacy facts

Verified against the code and deployment on 30 October 2026:

- The site is static and served by GitHub Pages. There is no project-operated web server and no
  visitor database.
- The API is a Cloudflare Worker at `https://ui-vault-api.erictshivhinda.workers.dev`.
- The Worker reads `CF-Connecting-IP` and keeps a per-IP counter in an in-memory `Map`.
- The limit is 120 requests per 60 seconds, cleaned up when the map exceeds 5000 entries, and lost
  when the isolate restarts.
- The Worker writes no logs, database records or queues. It returns published catalog data only.
- The site sets no cookies and writes no local storage, session storage or service worker data.
- There are no accounts, forms, analytics, ads, heatmaps or tracking pixels.
- Fonts are self-hosted; no font provider is contacted.
- Copy buttons write to the clipboard only after a click.
- External links go to author sites and platforms with their own policies.

## Reporting channels

- Public, timestamped route: the GitHub issue form at
  `https://github.com/konethegreat/ui-vault/issues/new?template=rights-notice.yml`.
- Private first contact: LinkedIn, `https://www.linkedin.com/in/kone-tshivhinda-32a760233/`.
- There is no dedicated takedown email address. Do not invent one.
- Host-level routes: GitHub's DMCA policy and Cloudflare's abuse process.
- Response target: acknowledge within five business days where possible. Remove or restrict
  credible claims while reviewing.

## Editorial rules for the policy pages

- State that the pages are not legal advice.
- Do not claim DMCA safe harbor or a statutory procedure. The takedown page says the process is
  modeled on common notice-and-takedown practice.
- Do not claim ownership of marketplace content.
- Do not promise a response time stronger than "within five business days where possible".
- Keep "no license is granted by this index" visible on the takedown page.
- Update the "Last updated" date on all three legal pages when a substantive fact changes.
- Avoid em dashes in site copy, per the project's copy preference.

## Related files

- `AGENTS.md` for the catalog and rights rules.
- `NOTICE.md` and `THIRD_PARTY.md` for credits.
- `site/src/pages/RightsPage.tsx`, `PrivacyPage.tsx`, `TakedownPage.tsx`.
- `.github/ISSUE_TEMPLATE/rights-notice.yml`.
