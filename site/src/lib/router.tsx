import * as React from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

export const ROUTES = ["/", "/demos", "/catalog", "/use", "/rights", "/privacy", "/takedown"] as const;

export type RoutePath = (typeof ROUTES)[number];

export function route(path: string): string {
  return path.startsWith("/") ? `${BASE}${path}` : path;
}

function normalize(path: string): string {
  if (!path) return "/";
  const trimmed = path.replace(/\/+$/, "");
  return trimmed || "/";
}

function readPath(): string {
  let path = window.location.pathname;
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) {
    path = path.slice(BASE.length);
  }
  return normalize(path);
}

function isKnownRoute(path: string): boolean {
  return (ROUTES as readonly string[]).includes(normalize(path));
}

type Location = { path: string; key: number };

type RouterValue = Location & {
  navigate: (to: string, options?: { replace?: boolean }) => void;
};

const RouterContext = React.createContext<RouterValue | null>(null);

function scrollToHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  window.requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  });
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = React.useState<Location>(() => ({ path: readPath(), key: 0 }));
  const firstScroll = React.useRef(true);
  const firstFocus = React.useRef(true);

  const navigate = React.useCallback((to: string, options?: { replace?: boolean }) => {
    const [withoutHash, hash = ""] = to.split("#");
    const [pathname, search = ""] = withoutHash.split("?");
    const nextPath = normalize(pathname || "/");
    const target = `${BASE}${nextPath}${search ? `?${search}` : ""}${hash ? `#${hash}` : ""}`;
    if (options?.replace) window.history.replaceState(null, "", target);
    else window.history.pushState(null, "", target);
    setLocation((current) => ({ path: readPath(), key: current.key + 1 }));
  }, []);

  React.useEffect(() => {
    const sync = () =>
      setLocation((current) => ({ path: readPath(), key: current.key + 1 }));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      let path = url.pathname;
      if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) path = path.slice(BASE.length);
      path = normalize(path);
      if (!isKnownRoute(path)) return;

      event.preventDefault();
      navigate(`${path}${url.search}${url.hash}`);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  React.useLayoutEffect(() => {
    const hasHash = Boolean(window.location.hash);
    if (firstScroll.current) {
      firstScroll.current = false;
      if (!hasHash) return;
    }
    if (hasHash) {
      scrollToHash();
      return;
    }
    window.scrollTo(0, 0);
  }, [location.key]);

  React.useEffect(() => {
    if (firstFocus.current) {
      firstFocus.current = false;
      return;
    }
    if (window.location.hash) return;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [location.key]);

  const value = React.useMemo(
    () => ({ path: location.path, key: location.key, navigate }),
    [location.path, location.key, navigate]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const value = React.useContext(RouterContext);
  if (!value) throw new Error("useRouter must be used inside RouterProvider");
  return value;
}
