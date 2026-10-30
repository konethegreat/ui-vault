import * as React from "react";
import "./rocket-field-hero.css";

type Cta = { label: string; href: string };

export interface RocketFieldHeroProps {
  eyebrow?: string;
  headline?: string;
  body?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  credit?: React.ReactNode;
  height?: string;
  headingLevel?: "h1" | "h2";
  className?: string;
}

interface Star {
  x: number;
  y: number;
  depth: number;
  size: number;
  phase: number;
  warm: boolean;
}

interface Rocket {
  startX: number;
  drift: number;
  seed: number;
  age: number;
  life: number;
  speed: number;
}

const STAR_COUNT = 170;

function makeStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    depth: 0.2 + Math.random() * 0.8,
    size: 0.4 + Math.random() * 1.1,
    phase: Math.random() * Math.PI * 2,
    warm: index % 9 === 0,
  }));
}

function makeRocket(startX: number): Rocket {
  return {
    startX,
    drift: (Math.random() - 0.5) * 0.22,
    seed: Math.random() * Math.PI * 2,
    age: Math.random() * 0.2,
    life: 6.5 + Math.random() * 2.5,
    speed: 0.86 + Math.random() * 0.06,
  };
}

function rocketPoint(rocket: Rocket, progress: number) {
  const eased = 1 - Math.pow(1 - progress, 1.35);
  return {
    x: rocket.startX + rocket.drift * eased + Math.sin(progress * 3.4 + rocket.seed) * 0.018,
    y: 0.12 + eased * rocket.speed,
  };
}

export function RocketFieldHero({
  eyebrow = "Original pattern",
  headline = "A field of small launches.",
  body = "A canvas hero with layered stars and drifting launch trails. No images, no animation library, and it holds one still frame when motion is reduced.",
  primaryCta,
  secondaryCta,
  credit,
  height = "clamp(540px, 74vh, 720px)",
  headingLevel = "h1",
  className = "",
}: RocketFieldHeroProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [launches, setLaunches] = React.useState(0);
  const Heading = headingLevel;

  React.useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = context;
    const stars = makeStars();
    const rockets: Rocket[] = [];
    const stillRockets: Array<{ rocket: Rocket; progress: number }> = [
      { rocket: makeRocket(0.26), progress: 0.3 },
      { rocket: makeRocket(0.58), progress: 0.52 },
      { rocket: makeRocket(0.78), progress: 0.68 },
    ];
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let horizon: CanvasGradient | null = null;
    let running = false;
    let frameHandle = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let spawnIn = 1200;
    let onScreen = true;
    let visible = !document.hidden;
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      const pixelWidth = Math.max(1, Math.round(width * dpr));
      const pixelHeight = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      horizon = ctx.createLinearGradient(0, 0, width, 0);
      horizon.addColorStop(0, "rgba(232, 163, 61, 0)");
      horizon.addColorStop(0.5, "rgba(232, 163, 61, 0.5)");
      horizon.addColorStop(1, "rgba(232, 163, 61, 0)");
      if (query.matches) draw();
    };

    const drawStars = (time: number) => {
      for (const star of stars) {
        const drift = (time * 0.004 + star.y) % 1;
        const x = (((star.x + smooth.x * 0.018 * star.depth) % 1) + 1) % 1;
        const y = 1 - drift;
        const alpha =
          (0.18 + star.depth * 0.55) * (0.62 + 0.38 * Math.sin(time * 1.4 + star.phase));
        ctx.beginPath();
        ctx.fillStyle = star.warm
          ? `rgba(240, 190, 120, ${alpha})`
          : `rgba(240, 238, 230, ${alpha})`;
        ctx.arc(x * width, (y + smooth.y * 0.006 * star.depth) * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawRocket = (rocket: Rocket, progress: number) => {
      const head = rocketPoint(rocket, progress);
      const tailProgress = Math.max(0, progress - 0.3);
      const steps = 16;

      const points: Array<[number, number]> = [];
      for (let step = 0; step <= steps; step++) {
        const point = rocketPoint(rocket, tailProgress + ((progress - tailProgress) * step) / steps);
        points.push([point.x * width, (1 - point.y) * height]);
      }

      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let step = 1; step < points.length; step++) {
        ctx.lineTo(points[step][0], points[step][1]);
      }
      ctx.strokeStyle = "rgba(236, 158, 62, 0.08)";
      ctx.lineWidth = 7;
      ctx.stroke();

      for (let step = 1; step < points.length; step++) {
        const weight = step / steps;
        ctx.strokeStyle = `rgba(236, 158, 62, ${0.08 + weight * weight * 0.6})`;
        ctx.lineWidth = 0.6 + weight * weight * 2.8;
        ctx.beginPath();
        ctx.moveTo(points[step - 1][0], points[step - 1][1]);
        ctx.lineTo(points[step][0], points[step][1]);
        ctx.stroke();
      }

      const hx = head.x * width;
      const hy = (1 - head.y) * height;
      const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 22);
      glow.addColorStop(0, "rgba(255, 238, 205, 0.6)");
      glow.addColorStop(0.35, "rgba(240, 170, 80, 0.3)");
      glow.addColorStop(1, "rgba(240, 170, 80, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(hx, hy, 22, 0, Math.PI * 2);
      ctx.fill();

      const behind = rocketPoint(rocket, Math.max(0, progress - 0.02));
      const angle = Math.atan2(hy - (1 - behind.y) * height, hx - behind.x * width);
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = "rgba(255, 246, 226, 0.96)";
      ctx.beginPath();
      ctx.moveTo(0, -6.5);
      ctx.lineTo(2.1, -0.5);
      ctx.lineTo(1.3, 3.2);
      ctx.lineTo(-1.3, 3.2);
      ctx.lineTo(-2.1, -0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(240, 170, 80, 0.9)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.fillStyle = "rgba(232, 163, 61, 0.95)";
      ctx.beginPath();
      ctx.moveTo(-2.4, 1.4);
      ctx.lineTo(-3.4, 4.2);
      ctx.lineTo(-1.2, 3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(2.4, 1.4);
      ctx.lineTo(3.4, 4.2);
      ctx.lineTo(1.2, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawHorizon = () => {
      ctx.strokeStyle = horizon ?? "rgba(232, 163, 61, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.88);
      ctx.lineTo(width, height * 0.88);
      ctx.stroke();
    };

    const draw = () => {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      drawStars(query.matches ? 9 : elapsed);
      drawHorizon();
      if (query.matches) {
        for (const { rocket, progress } of stillRockets) {
          drawRocket(rocket, progress);
        }
        return;
      }
      for (const rocket of rockets) {
        drawRocket(rocket, Math.min(rocket.age / rocket.life, 1));
      }
    };

    const spawn = (startX: number) => {
      if (rockets.length >= 5) return;
      rockets.push(makeRocket(Math.min(Math.max(startX, 0.12), 0.88)));
      setLaunches((count) => count + 1);
    };

    const update = (delta: number) => {
      smooth.x += (pointer.x - smooth.x) * 0.06;
      smooth.y += (pointer.y - smooth.y) * 0.06;
      spawnIn -= delta * 1000;
      if (spawnIn <= 0) {
        spawn(0.16 + Math.random() * 0.68);
        spawnIn = 1600 + Math.random() * 1800;
      }
      for (let index = rockets.length - 1; index >= 0; index--) {
        rockets[index].age += delta;
        if (rockets[index].age >= rockets[index].life) rockets.splice(index, 1);
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
      lastFrame = now;
      elapsed += delta;
      update(delta);
      draw();
      frameHandle = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frameHandle);
    };

    const start = () => {
      if (running || query.matches || !onScreen || !visible) return;
      running = true;
      lastFrame = 0;
      frameHandle = requestAnimationFrame(frame);
    };

    const applyMotion = () => {
      stop();
      if (query.matches) {
        rockets.length = 0;
        setLaunches(0);
        draw();
      } else {
        start();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
    };

    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (query.matches) return;
      const target = event.target as Element | null;
      if (target?.closest("a, button, input, select, textarea")) return;
      const rect = canvas.getBoundingClientRect();
      spawn((event.clientX - rect.left) / rect.width);
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "120px" }
    );
    intersection.observe(canvas);

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("visibilitychange", onVisibility);
    query.addEventListener("change", applyMotion);

    resize();
    if (query.matches) {
      draw();
    } else {
      rockets.push(makeRocket(0.24), makeRocket(0.5), makeRocket(0.76));
      rockets[0].age = 0.8;
      rockets[1].age = 2.4;
      rockets[2].age = 4.2;
      setLaunches(3);
      start();
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      query.removeEventListener("change", applyMotion);
    };
  }, []);

  return (
    <section
      ref={hostRef}
      className={`rocket-field ${className}`.trim()}
      style={{ "--rocket-height": height } as React.CSSProperties}
    >
      <canvas ref={canvasRef} className="rocket-field__canvas" aria-hidden="true" />
      <div className="rocket-field__veil" aria-hidden="true" />

      <div className="rocket-field__content">
        <div className="rocket-field__top">
          <p className="rocket-field__eyebrow">{eyebrow}</p>
          <p className="rocket-field__telemetry">
            <span className="rocket-field__dot" aria-hidden="true" />
            Launches <span>{String(launches).padStart(2, "0")}</span>
          </p>
        </div>

        <div className="rocket-field__foot">
          <Heading className="rocket-field__title">{headline}</Heading>
          <p className="rocket-field__body">{body}</p>
          {primaryCta || secondaryCta ? (
            <div className="rocket-field__actions">
              {primaryCta ? (
                <a className="rocket-field__cta" href={primaryCta.href}>
                  {primaryCta.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {secondaryCta ? (
                <a className="rocket-field__cta rocket-field__cta--quiet" href={secondaryCta.href}>
                  {secondaryCta.label}
                </a>
              ) : null}
            </div>
          ) : null}
          {credit ? <p className="rocket-field__credit">{credit}</p> : null}
        </div>

        <p className="rocket-field__hint" aria-hidden="true">
          Move to drift · click to launch
        </p>
      </div>
    </section>
  );
}
