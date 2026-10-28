import type { ReactNode } from "react";
import { OWNER, REPO } from "@/lib/catalog";

const BASE = import.meta.env.BASE_URL;

function FooterLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-paper/55 transition-colors hover:text-amber-soft"
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-dark bg-graphite">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="label text-amber">UI Vault</p>
            <p className="mt-5 font-display text-[2.4rem] leading-[1.05] tracking-tight text-paper sm:text-5xl">
              {OWNER.name}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/55">
              A provenance-first index of interface patterns, built and maintained in Johannesburg,
              South Africa.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <FooterLink href={OWNER.portfolio} external>
                Portfolio ↗
              </FooterLink>
              <FooterLink href={OWNER.github} external>
                GitHub ↗
              </FooterLink>
              <FooterLink href={OWNER.linkedin} external>
                LinkedIn ↗
              </FooterLink>
            </div>
          </div>

          <div>
            <p className="label text-paper/35">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <FooterLink href="#demos">Live demos</FooterLink>
              </li>
              <li>
                <FooterLink href="#catalog">Catalog</FooterLink>
              </li>
              <li>
                <FooterLink href="#use">Use the vault</FooterLink>
              </li>
              <li>
                <FooterLink href="#rights">Rights</FooterLink>
              </li>
              <li>
                <FooterLink href={REPO} external>
                  Repository ↗
                </FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="label text-paper/35">Credits and licenses</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <FooterLink href={`${REPO}/blob/main/THIRD_PARTY.md`} external>
                  Third-party credits ↗
                </FooterLink>
              </li>
              <li>
                <FooterLink href={`${BASE}licenses/magic-ui.txt`}>Magic UI license</FooterLink>
              </li>
              <li>
                <FooterLink href={`${BASE}licenses/liquid-sculpture.txt`}>Sculpture license</FooterLink>
              </li>
              <li>
                <FooterLink href={`${REPO}/blob/main/LICENSE`} external>
                  MIT license ↗
                </FooterLink>
              </li>
              <li>
                <FooterLink href={`${REPO}#agent-access`} external>
                  Agent access ↗
                </FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-paper/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kone Tshivhinda. Original work MIT.</p>
          <p>Third-party work stays with its authors.</p>
        </div>
      </div>
    </footer>
  );
}
