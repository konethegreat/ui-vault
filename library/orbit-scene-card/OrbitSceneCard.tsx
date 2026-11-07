import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./orbit-scene-card.css";

type Status = "loading" | "ready" | "failed";

export function OrbitSceneCard({
  height = "clamp(440px, 64vh, 600px)",
  headingLevel = "h2",
}: {
  height?: string;
  headingLevel?: "h1" | "h2" | "h3";
}) {
  const card = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        const THREE = await import("three");
        if (cancelled || !host.current || !card.current) return;

        const frame = card.current;
        const mount = host.current;
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let reduced = motionQuery.matches;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(Math.max(mount.clientWidth, 1), Math.max(mount.clientHeight, 1), false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const canvas = renderer.domElement;
        canvas.className = "orbit-card__gl";
        canvas.setAttribute("aria-hidden", "true");
        mount.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          38,
          Math.max(mount.clientWidth, 1) / Math.max(mount.clientHeight, 1),
          0.1,
          60
        );
        camera.position.set(0, 0, 7.6);

        const group = new THREE.Group();
        scene.add(group);

        scene.add(new THREE.HemisphereLight(0xfff1d8, 0x0a0a08, 0.55));

        const key = new THREE.DirectionalLight(0xffd7a0, 2.3);
        key.position.set(4.5, 6, 5.5);
        scene.add(key);

        const rim = new THREE.DirectionalLight(0x7fa7ff, 1.6);
        rim.position.set(-5.5, -1.5, -4.5);
        scene.add(rim);

        const coreLight = new THREE.PointLight(0xe8a33d, 12, 12, 2);
        coreLight.position.set(0, 0, 0);
        scene.add(coreLight);

        const coreMaterial = new THREE.MeshStandardMaterial({
          color: 0x16140f,
          metalness: 0.86,
          roughness: 0.24,
          flatShading: true,
        });
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.28, 1), coreMaterial);
        group.add(core);

        const facetMaterial = new THREE.MeshBasicMaterial({
          color: 0xe8a33d,
          wireframe: true,
          transparent: true,
          opacity: 0.2,
        });
        const facets = new THREE.Mesh(new THREE.IcosahedronGeometry(1.36, 1), facetMaterial);
        group.add(facets);

        const amberMaterial = new THREE.MeshBasicMaterial({
          color: 0xe8a33d,
          transparent: true,
          opacity: 0.55,
        });
        const coolMaterial = new THREE.MeshBasicMaterial({
          color: 0x8fb4ff,
          transparent: true,
          opacity: 0.28,
        });

        const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.016, 8, 180), amberMaterial);
        ringA.rotation.set(Math.PI / 2.2, 0.2, 0);
        const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.012, 8, 180), coolMaterial);
        ringB.rotation.set(0.4, Math.PI / 2.6, 0.3);
        const ringC = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.01, 8, 200), amberMaterial);
        ringC.rotation.set(1.1, -0.4, 0.9);
        group.add(ringA, ringB, ringC);

        const COUNT = 520;
        const positions = new Float32Array(COUNT * 3);
        for (let index = 0; index < COUNT; index += 1) {
          const radius = 2.4 + Math.random() * 2.1;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[index * 3 + 1] = radius * Math.cos(phi) * 0.7;
          positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        const cloudGeometry = new THREE.BufferGeometry();
        cloudGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const cloudMaterial = new THREE.PointsMaterial({
          color: 0xf0bf74,
          size: 0.022,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          sizeAttenuation: true,
        });
        const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
        group.add(cloud);

        const target = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };
        let pointerActive = false;

        function onPointerMove(event: PointerEvent) {
          if (event.pointerType !== "mouse" || reduced) return;
          const rect = frame.getBoundingClientRect();
          target.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
          target.y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
          pointerActive = true;
        }

        function onPointerLeave() {
          target.x = 0;
          target.y = 0;
          pointerActive = false;
        }

        frame.addEventListener("pointermove", onPointerMove);
        frame.addEventListener("pointerleave", onPointerLeave);

        function render() {
          renderer.render(scene, camera);
        }

        function resize() {
          const width = Math.max(mount.clientWidth, 1);
          const height = Math.max(mount.clientHeight, 1);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          renderer.setSize(width, height, false);
          render();
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        let elapsed = 0;
        let last = 0;

        function loop(time: number) {
          elapsed += last ? Math.min((time - last) / 1000, 0.1) : 0;
          last = time;

          const ease = pointerActive ? 0.065 : 0.04;
          current.x += (target.x - current.x) * ease;
          current.y += (target.y - current.y) * ease;

          group.rotation.x = -current.y * 0.36;
          group.rotation.y = elapsed * 0.16 + current.x * 0.5;
          core.rotation.x = elapsed * 0.24;
          core.rotation.y = elapsed * 0.18;
          facets.rotation.copy(core.rotation);
          ringA.rotation.z = elapsed * 0.2;
          ringB.rotation.x = 0.4 + elapsed * 0.16;
          ringC.rotation.y = -0.4 - elapsed * 0.12;
          cloud.rotation.y = -elapsed * 0.04;

          camera.position.x = current.x * 0.35;
          camera.position.y = -current.y * 0.25;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        }

        let visible = true;
        const intersection = new IntersectionObserver(
          (records) => {
            const entry = records[0];
            if (!entry) return;
            visible = entry.isIntersecting;
            if (reduced) {
              if (visible) render();
              return;
            }
            last = 0;
            renderer.setAnimationLoop(visible && !document.hidden ? loop : null);
          },
          { rootMargin: "100px" }
        );
        intersection.observe(mount);

        function onVisibility() {
          if (reduced) return;
          last = 0;
          renderer.setAnimationLoop(visible && !document.hidden ? loop : null);
        }

        function onMotionChange() {
          reduced = motionQuery.matches;
          if (reduced) {
            renderer.setAnimationLoop(null);
            group.rotation.set(0, 0, 0);
            camera.position.set(0, 0, 7.6);
            camera.lookAt(0, 0, 0);
            render();
          } else if (visible && !document.hidden) {
            last = 0;
            renderer.setAnimationLoop(loop);
          }
        }

        function onContextLost(event: Event) {
          event.preventDefault();
          renderer.setAnimationLoop(null);
          if (!cancelled) setStatus("failed");
        }

        document.addEventListener("visibilitychange", onVisibility);
        motionQuery.addEventListener("change", onMotionChange);
        canvas.addEventListener("webglcontextlost", onContextLost);

        if (reduced) {
          render();
        } else {
          renderer.setAnimationLoop(loop);
        }

        setStatus("ready");

        cleanup = () => {
          renderer.setAnimationLoop(null);
          document.removeEventListener("visibilitychange", onVisibility);
          motionQuery.removeEventListener("change", onMotionChange);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          frame.removeEventListener("pointermove", onPointerMove);
          frame.removeEventListener("pointerleave", onPointerLeave);
          resizeObserver.disconnect();
          intersection.disconnect();
          scene.traverse((object) => {
            const mesh = object as InstanceType<typeof THREE.Mesh>;
            mesh.geometry?.dispose?.();
            const material = mesh.material;
            if (Array.isArray(material)) {
              material.forEach((item) => item.dispose());
            } else {
              material?.dispose?.();
            }
          });
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        };
      } catch {
        if (!cancelled) setStatus("failed");
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const Heading = headingLevel;

  return (
    <div
      ref={card}
      className="orbit-card"
      style={{ "--orbit-height": height } as CSSProperties}
    >
      <div className="orbit-card__copy">
        <p className="orbit-card__eyebrow">Procedural 3D · no model files</p>
        <Heading className="orbit-card__title">A scene that answers the pointer.</Heading>
        <p className="orbit-card__body">
          A faceted core sits inside three thin orbits, lit by an amber key and a cool rim.
          Every shape and point is drawn at runtime, so there is no model or texture to download.
        </p>
        <ul className="orbit-card__meta" aria-label="Scene details">
          <li>three.js</li>
          <li>lazy chunk</li>
          <li>pointer parallax</li>
        </ul>
      </div>

      <div className="orbit-card__stage">
        <div className="orbit-card__orb" aria-hidden="true" />
        <div ref={host} className="orbit-card__canvas" />
        {status === "loading" ? (
          <p className="orbit-card__status" role="status">
            Preparing the scene
          </p>
        ) : null}
        {status === "failed" ? (
          <p className="orbit-card__status orbit-card__status--failed" role="status">
            WebGL is unavailable, so the scene stays as a still light.
          </p>
        ) : null}
      </div>
    </div>
  );
}
