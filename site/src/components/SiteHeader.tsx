import * as React from "react";
import { Menu, X } from "lucide-react";
import { OWNER, REPO } from "@/lib/catalog";

const LINKS = [
  { label: "Demos", href: "#demos" },
  { label: "Catalog", href: "#catalog" },
  { label: "Use", href: "#use" },
  { label: "Rights", href: "#rights" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("");
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  React.useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (section): section is HTMLElement => section !== null
    );
    if (!sections.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top + window.scrollY <= line) current = section.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="on-dark sticky top-0 z-50 border-b border-white/10 bg-graphite/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <div className="flex min-w-0 items-center gap-x-3">
          <a href="#top" className="group flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-md bg-amber font-mono text-[11px] font-semibold tracking-[0.06em] text-graphite transition-transform duration-300 group-hover:-rotate-3"
            >
              UV
            </span>
            <span className="font-display text-[22px] leading-none text-paper">UI Vault</span>
          </a>
          <span aria-hidden="true" className="hidden h-4 w-px bg-white/15 sm:block" />
          <a
            href={OWNER.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden whitespace-nowrap text-[11px] font-medium tracking-[0.02em] text-paper/55 transition-colors hover:text-amber-soft sm:inline"
          >
            {OWNER.name}
          </a>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const current = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={current ? "location" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                  current
                    ? "bg-white/10 text-paper"
                    : "text-paper/65 hover:bg-white/5 hover:text-paper"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-paper transition-colors hover:border-amber hover:bg-amber hover:text-graphite"
          >
            GitHub
          </a>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="grid size-10 place-items-center rounded-full border border-white/15 text-paper md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X aria-hidden="true" size={17} /> : <Menu aria-hidden="true" size={17} />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-white/10 bg-graphite px-5 pb-5 pt-2 md:hidden"
        >
          <ul className="divide-y divide-white/8">
            {LINKS.map((link) => {
              const current = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? "location" : undefined}
                    className={`flex items-center justify-between py-3.5 text-[15px] ${
                      current ? "text-paper" : "text-paper/80"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`font-mono text-[10px] ${current ? "text-amber" : "text-amber/70"}`}
                    >
                      →
                    </span>
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3.5 text-[15px] text-paper/80"
              >
                GitHub
                <span aria-hidden="true" className="font-mono text-[10px] text-amber/70">
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
