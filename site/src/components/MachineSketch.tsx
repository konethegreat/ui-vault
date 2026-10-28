import { useReveal } from "@/hooks/useReveal";
import { REPO } from "@/lib/catalog";

const TOP = { x: 450, y: 36 };
const A = { x: 380, y: 198 };
const B = { x: -380, y: 198 };

function floorPoint(u: number, v: number) {
  return { x: TOP.x + A.x * u + B.x * v, y: TOP.y + A.y * u + B.y * v };
}

const GRID = Array.from({ length: 11 }, (_, i) => i / 10);

const STATIONS = [
  { n: "01", name: "ENGINE", u: 0.151, v: 0.677, h: 58 },
  { n: "02", name: "ADMIN", u: 0.157, v: 0.42, h: 44 },
  { n: "03", name: "STOREFRONT", u: 0.541, v: 0.541, h: 76 },
  { n: "04", name: "CABINET", u: 0.798, v: 0.535, h: 52 },
  { n: "05", name: "CASHDESK", u: 0.627, v: 0.1, h: 38 },
];

const LABELS: Record<string, { x: number; y: number; anchor: "start" | "middle" | "end" }> = {
  "01": { x: 196, y: 250, anchor: "end" },
  "02": { x: 268, y: 88, anchor: "end" },
  "03": { x: 450, y: 350, anchor: "middle" },
  "04": { x: 626, y: 302, anchor: "start" },
  "05": { x: 744, y: 108, anchor: "start" },
};

function Station({ u, v, h }: { u: number; v: number; h: number }) {
  const { x, y } = floorPoint(u, v);
  const w = 38;
  const d = 20;
  return (
    <g>
      <ellipse cx={x} cy={y + d + 6} rx={w + 16} ry={12} fill="#000" opacity="0.35" />
      <polygon
        points={`${x},${y - d} ${x + w},${y + d} ${x},${y + d * 3} ${x - w},${y + d}`}
        fill="#141411"
        stroke="rgba(240,191,116,0.28)"
        strokeWidth="1"
      />
      <polygon
        points={`${x - w},${y + d} ${x},${y + d * 3} ${x},${y + d * 3 - h} ${x - w},${y + d - h}`}
        fill="#1b1a16"
        stroke="rgba(240,191,116,0.22)"
        strokeWidth="1"
      />
      <polygon
        points={`${x + w},${y + d} ${x},${y + d * 3} ${x},${y + d * 3 - h} ${x + w},${y + d - h}`}
        fill="#121210"
        stroke="rgba(240,191,116,0.22)"
        strokeWidth="1"
      />
      <polygon
        points={`${x},${y - d - h} ${x + w},${y + d - h} ${x},${y + d * 3 - h} ${x - w},${y + d - h}`}
        fill="#26241f"
        stroke="rgba(240,191,116,0.55)"
        strokeWidth="1.2"
      />
      <line
        x1={x - w + 8}
        y1={y + d - h}
        x2={x + w - 8}
        y2={y + d - h}
        stroke="#e8a33d"
        strokeWidth="1.4"
        opacity="0.65"
      />
      <line
        x1={x}
        y1={y + d * 3 - h}
        x2={x}
        y2={y + d * 3 - h + 8}
        stroke="#e8a33d"
        strokeWidth="1.4"
        opacity="0.5"
      />
    </g>
  );
}

export function MachineSketch() {
  const ref = useReveal<HTMLElement>();

  return (
    <article
      ref={ref}
      id="machine"
      className="reveal on-dark relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-graphite"
    >
      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
        <div className="p-6 sm:p-9">
          <p className="label text-amber">External reference · not hosted here</p>
          <h3 className="mt-4 font-display text-[2.2rem] leading-none tracking-tight text-paper">
            Interactive 3D Machine
          </h3>
          <p className="mt-3 text-xs text-paper/50">
            Evgeny Shilov (eugeneshilow) · no license found · inspiration only
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/60">
            A five station product tour rendered with procedural geometry, four interface modes and
            five camera presets. The reference is documented here; the scene itself stays on its
            author's deployment.
          </p>
          <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-5">
            {[
              ["05", "stations"],
              ["04", "modes"],
              ["05", "cameras"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="label text-paper/40">{label}</dt>
                <dd className="mt-1 font-display text-2xl leading-none text-paper">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <a
              href="https://agentic-factory-3d.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2.5 text-xs font-semibold text-graphite transition-colors hover:bg-amber-soft"
            >
              Open the original demo
              <span aria-hidden="true" className="font-mono">
                ↗
              </span>
            </a>
            <a
              href={`${REPO}/blob/main/references/interactive-3d-machine/entry.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-medium text-paper/80 transition-colors hover:border-amber/60 hover:text-amber-soft"
            >
              Read the entry
            </a>
            <a
              href={`${REPO}/blob/main/references/interactive-3d-machine/prompt.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-medium text-paper/80 transition-colors hover:border-amber/60 hover:text-amber-soft"
            >
              Build your own
            </a>
          </div>
        </div>

        <div className="relative flex min-h-[320px] flex-col overflow-hidden border-t border-white/10 bg-[#0a0a08] lg:border-l lg:border-t-0">
          <div
            aria-hidden="true"
            className="machine-scan pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-transparent via-amber/10 to-transparent"
          />
          <svg
            viewBox="0 0 900 480"
            role="img"
            aria-label="Original isometric sketch of five stations connected by a tour path"
            className="w-full flex-1"
          >
            <defs>
              <radialGradient id="machine-glow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#e8a33d" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#e8a33d" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="900" height="480" fill="#0a0a08" />
            <circle cx="450" cy="240" r="260" fill="url(#machine-glow)" />
            <g stroke="rgba(250,248,242,0.09)" strokeWidth="1">
              {GRID.map((t) => {
                const a = floorPoint(t, 0);
                const b = floorPoint(t, 1);
                const c = floorPoint(0, t);
                const d = floorPoint(1, t);
                return (
                  <g key={t}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                    <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} />
                  </g>
                );
              })}
            </g>
            <polygon
              points={`${TOP.x},${TOP.y} ${TOP.x + A.x},${TOP.y + A.y} ${TOP.x + A.x + B.x},${TOP.y + A.y + B.y} ${TOP.x + B.x},${TOP.y + B.y}`}
              fill="none"
              stroke="rgba(240,191,116,0.3)"
              strokeWidth="1.4"
            />
            <polyline
              className="machine-dash"
              fill="none"
              stroke="rgba(232,163,61,0.7)"
              strokeWidth="1.6"
              strokeDasharray="5 7"
              points={STATIONS.map((station) => {
                const point = floorPoint(station.u, station.v);
                return `${point.x},${point.y - station.h - 20}`;
              }).join(" ")}
            />
            {STATIONS.map((station) => (
              <Station key={station.n} u={station.u} v={station.v} h={station.h} />
            ))}
            {STATIONS.map((station) => {
              const point = floorPoint(station.u, station.v);
              const label = LABELS[station.n];
              const from =
                label.anchor === "end"
                  ? { x: point.x - 26, y: point.y + 28 }
                  : label.anchor === "start"
                    ? { x: point.x + 26, y: point.y + 28 }
                    : { x: point.x, y: point.y + 68 };
              const to =
                label.anchor === "middle"
                  ? { x: label.x, y: label.y - 10 }
                  : { x: label.x + (label.anchor === "end" ? 6 : -6), y: label.y - 4 };
              return (
                <g key={`${station.n}-label`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="rgba(232,163,61,0.28)"
                    strokeWidth="0.9"
                  />
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor={label.anchor}
                    fill="#e8a33d"
                    fillOpacity="0.9"
                    fontFamily="Geist Mono, monospace"
                    fontSize="10"
                    letterSpacing="1.5"
                  >
                    {station.n}
                  </text>
                  <text
                    x={label.x}
                    y={label.y + 13}
                    textAnchor={label.anchor}
                    fill="#f2eee6"
                    fillOpacity="0.45"
                    fontFamily="Geist Mono, monospace"
                    fontSize="8"
                    letterSpacing="1.5"
                  >
                    {station.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <ul
            aria-label="Stations in the sketch"
            className="grid grid-cols-2 gap-x-4 gap-y-2 px-5 pb-6 pt-1 sm:hidden"
          >
            {STATIONS.map((station) => (
              <li
                key={station.n}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45"
              >
                <span className="text-amber">{station.n}</span> {station.name}
              </li>
            ))}
          </ul>
          <p className="absolute bottom-4 right-5 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-paper/30 sm:block">
            Original illustration, not a screenshot
          </p>
        </div>
      </div>
    </article>
  );
}
