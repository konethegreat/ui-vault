import * as React from "react";
import "./nebula-hero.css";

const STAR_NEST_URL = "https://www.shadertoy.com/view/XlfGRj";
const ATZEDENT_URL = "https://codepen.io/atzedent/pen/mdzwWzy";

const VERTEX = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * valueNoise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
  vec2 drift = vec2(uTime * 0.012, -uTime * 0.008);
  vec2 flow = uv * 1.15 + drift + uPointer * 0.08;

  float warp = fbm(flow * 1.3 + vec2(2.1, -1.7));
  vec2 bent = flow + warp * 0.6;

  float cloud = fbm(bent * 1.7);
  float veil = fbm(bent * 3.2 + vec2(-uTime * 0.02, uTime * 0.015));
  float nebula = smoothstep(0.38, 0.92, cloud * 0.75 + veil * 0.35);

  vec2 coreCenter = vec2(-0.25, 0.05);
  float core = exp(-dot(uv - coreCenter, uv - coreCenter) * 1.4);

  vec3 base = vec3(0.043, 0.039, 0.035);
  vec3 amber = vec3(0.94, 0.53, 0.20);
  vec3 gold = vec3(0.98, 0.82, 0.48);

  vec3 color = base;
  color = mix(color, amber, nebula * 0.38);
  color = mix(color, gold, core * nebula * 0.55);

  vec2 starGrid = uv * 220.0;
  vec2 starCell = floor(starGrid);
  float star = step(0.995, hash21(starCell));
  float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + hash21(starCell) * 20.0);
  color += star * twinkle * 0.35 * vec3(1.0, 0.94, 0.84);

  float vignette = 1.0 - smoothstep(0.25, 1.35, length(uv));
  color *= mix(0.55, 1.0, vignette);

  float dither = (hash21(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color + dither, 1.0);
}`;

export interface NebulaHeroCta {
  label: string;
  href: string;
}

export interface NebulaHeroProps {
  eyebrow?: string;
  headline?: string;
  body?: string;
  primaryCta?: NebulaHeroCta;
  secondaryCta?: NebulaHeroCta;
  height?: string;
  className?: string;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function NebulaHero({
  eyebrow = "Original pattern",
  headline = "Interfaces with gravity.",
  body = "A WebGL background built from layered noise, warm light and restraint. No textures, no animation library, and it holds still when motion is reduced.",
  primaryCta = { label: "View the entry", href: "https://github.com/konethegreat/ui-vault/blob/main/library/nebula-hero/entry.md" },
  secondaryCta = { label: "Read the code", href: "https://github.com/konethegreat/ui-vault/blob/main/library/nebula-hero/NebulaHero.tsx" },
  height = "680px",
  className = "",
}: NebulaHeroProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) return;

    const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const host = canvas.parentElement ?? canvas;
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const started = performance.now();
    let frameHandle = 0;
    let running = false;
    let onScreen = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      if (reducedMotion.matches) render(12);
    };

    const render = (seconds: number) => {
      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, seconds);
      gl.uniform2f(uPointer, smooth.x, smooth.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      if (!running) return;
      smooth.x += (target.x - smooth.x) * 0.05;
      smooth.y += (target.y - smooth.y) * 0.05;
      render((now - started) / 1000);
      frameHandle = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frameHandle);
    };

    const start = () => {
      if (running || reducedMotion.matches || !onScreen || document.hidden) return;
      running = true;
      frameHandle = requestAnimationFrame(frame);
    };

    const update = () => {
      stop();
      if (reducedMotion.matches) render(12);
      else start();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver((entries) => {
      onScreen = entries[0]?.isIntersecting ?? true;
      update();
    });
    intersectionObserver.observe(canvas);

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);

    resize();
    update();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <section className={`nebula-hero ${className}`.trim()} style={{ "--nebula-height": height } as React.CSSProperties}>
      <canvas ref={canvasRef} className="nebula-hero__canvas" aria-hidden="true" />
      <div className="nebula-hero__veil" aria-hidden="true" />
      <div className="nebula-hero__content">
        <p className="nebula-hero__eyebrow">{eyebrow}</p>
        <h1 className="nebula-hero__title">{headline}</h1>
        <p className="nebula-hero__body">{body}</p>
        <div className="nebula-hero__actions">
          <a className="nebula-hero__cta" href={primaryCta.href}>
            {primaryCta.label}
            <span aria-hidden="true">↗</span>
          </a>
          <a className="nebula-hero__cta nebula-hero__cta--quiet" href={secondaryCta.href}>
            {secondaryCta.label}
          </a>
        </div>
        <p className="nebula-hero__credit">
          Original code, MIT. Visual direction inspired by{" "}
          <a href={STAR_NEST_URL} target="_blank" rel="noopener noreferrer">
            Star Nest by Pablo Roman Andrioli
          </a>{" "}
          and{" "}
          <a href={ATZEDENT_URL} target="_blank" rel="noopener noreferrer">
            Matthias Hurrle's shader work
          </a>
          . No shader code was copied.
        </p>
      </div>
    </section>
  );
}
