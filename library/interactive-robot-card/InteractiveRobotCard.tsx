import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./interactive-robot-card.css";

type Status = "loading" | "ready" | "failed";

export function InteractiveRobotCard({
  height = "clamp(460px, 66vh, 620px)",
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
        canvas.className = "robot-card__gl";
        canvas.setAttribute("aria-hidden", "true");
        mount.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          36,
          Math.max(mount.clientWidth, 1) / Math.max(mount.clientHeight, 1),
          0.1,
          60
        );
        camera.position.set(0, 0.2, 6);

        scene.add(new THREE.HemisphereLight(0xfff1d8, 0x0a0a08, 0.6));

        const key = new THREE.DirectionalLight(0xffd7a0, 2.2);
        key.position.set(3.6, 5, 4.8);
        scene.add(key);

        const rim = new THREE.DirectionalLight(0x7fa7ff, 1.8);
        rim.position.set(-4.8, 1.2, -3.6);
        scene.add(rim);

        const faceLight = new THREE.PointLight(0xffb45e, 6, 5.5, 2);
        faceLight.position.set(0, 0.9, 1.6);
        scene.add(faceLight);

        const robot = new THREE.Group();
        robot.position.y = -0.12;
        robot.scale.setScalar(0.92);
        scene.add(robot);

        const shell = new THREE.MeshStandardMaterial({
          color: 0x1b1915,
          metalness: 0.55,
          roughness: 0.42,
        });
        const shellDark = new THREE.MeshStandardMaterial({
          color: 0x12110e,
          metalness: 0.5,
          roughness: 0.42,
        });
        const visorMaterial = new THREE.MeshStandardMaterial({
          color: 0x11100d,
          metalness: 0.8,
          roughness: 0.26,
          emissive: 0x2a1c0c,
          emissiveIntensity: 0.35,
          side: THREE.DoubleSide,
        });
        const amberGlow = new THREE.MeshBasicMaterial({ color: 0xffc46b });
        const amberSoft = new THREE.MeshBasicMaterial({
          color: 0xe8a33d,
          transparent: true,
          opacity: 0.55,
        });
        const coolSoft = new THREE.MeshBasicMaterial({
          color: 0x8fb4ff,
          transparent: true,
          opacity: 0.25,
        });

        const HEAD_Y = 0.74;
        const headGroup = new THREE.Group();
        headGroup.position.y = HEAD_Y;
        headGroup.rotation.y = -0.12;
        headGroup.scale.setScalar(0.9);
        robot.add(headGroup);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.82, 48, 32), shell);
        head.scale.set(1.05, 0.92, 0.94);
        headGroup.add(head);

        // A curved visor band that follows the shell, so no flat plate can poke
        // past the silhouette when the head turns.
        const visor = new THREE.Mesh(
          new THREE.SphereGeometry(0.832, 48, 24, Math.PI / 2 - 1.05, 2.1, 1.08, 0.76),
          visorMaterial
        );
        visor.scale.set(1.05, 0.92, 0.94);
        headGroup.add(visor);

        const eyeGeometry = new THREE.CircleGeometry(0.09, 32);
        const haloGeometry = new THREE.CircleGeometry(0.155, 32);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0xffb45e,
          transparent: true,
          opacity: 0.16,
        });
        const eyeLeft = new THREE.Mesh(eyeGeometry, amberGlow);
        const eyeRight = new THREE.Mesh(eyeGeometry, amberGlow);
        const haloLeft = new THREE.Mesh(haloGeometry, haloMaterial);
        const haloRight = new THREE.Mesh(haloGeometry, haloMaterial);
        const eyeBaseX = 0.26;
        const eyeBaseY = 0.05;
        for (const [eye, halo, side] of [
          [eyeLeft, haloLeft, -1],
          [eyeRight, haloRight, 1],
        ] as const) {
          eye.position.set(side * eyeBaseX, eyeBaseY, 0.775);
          halo.position.set(side * eyeBaseX, eyeBaseY, 0.767);
          headGroup.add(halo, eye);
        }

        const earGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24);
        const earRingGeometry = new THREE.TorusGeometry(0.12, 0.012, 8, 48);
        for (const side of [-1, 1]) {
          const ear = new THREE.Mesh(earGeometry, shellDark);
          ear.rotation.z = Math.PI / 2;
          ear.position.set(side * 0.86, 0, 0);
          headGroup.add(ear);

          const earRing = new THREE.Mesh(earRingGeometry, amberSoft);
          earRing.rotation.y = Math.PI / 2;
          earRing.position.set(side * 0.925, 0, 0);
          headGroup.add(earRing);
        }

        const antenna = new THREE.Group();
        antenna.position.set(0.32, 0.66, -0.05);
        headGroup.add(antenna);

        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.46, 12), shell);
        stalk.position.y = 0.23;
        antenna.add(stalk);

        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 16), amberGlow);
        tip.position.y = 0.49;
        antenna.add(tip);

        const tipLight = new THREE.PointLight(0xffb45e, 1.4, 2.2, 2);
        tipLight.position.y = 0.52;
        antenna.add(tipLight);

        const torso = new THREE.Group();
        torso.position.y = -0.52;
        robot.add(torso);

        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.3, 8, 24), shell);
        torso.add(body);

        const chest = new THREE.Mesh(new THREE.CircleGeometry(0.1, 32), amberGlow);
        chest.position.set(0, 0.1, 0.403);
        torso.add(chest);

        const chestRing = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.011, 8, 48), amberSoft);
        chestRing.position.set(0, 0.1, 0.4);
        torso.add(chestRing);

        const arms: { mesh: InstanceType<typeof THREE.Mesh>; base: number }[] = [];
        for (const side of [-1, 1]) {
          const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 18), shellDark);
          shoulder.position.set(side * 0.42, 0.28, 0);
          torso.add(shoulder);

          const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.34, 6, 16), shell);
          arm.position.set(side * 0.58, -0.02, 0.02);
          arm.rotation.z = side * 0.42;
          torso.add(arm);

          const hand = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 16), shellDark);
          hand.position.set(side * 0.73, -0.34, 0.03);
          torso.add(hand);

          arms.push({ mesh: arm, base: side * 0.42 });
        }

        const base = new THREE.Group();
        base.position.y = -1.62;
        robot.add(base);

        const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.012, 8, 160), amberSoft);
        ringA.rotation.x = Math.PI / 2;
        base.add(ringA);

        const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.01, 8, 180), coolSoft);
        ringB.rotation.x = Math.PI / 2;
        base.add(ringB);

        const shadow = new THREE.Mesh(
          new THREE.CircleGeometry(1.1, 64),
          new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
          })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -0.01;
        base.add(shadow);

        const COUNT = 300;
        const positions = new Float32Array(COUNT * 3);
        for (let index = 0; index < COUNT; index += 1) {
          const radius = 1.6 + Math.random() * 1.4;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[index * 3 + 1] = radius * Math.cos(phi) * 0.55;
          positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        const cloudGeometry = new THREE.BufferGeometry();
        cloudGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const cloudMaterial = new THREE.PointsMaterial({
          color: 0xf0bf74,
          size: 0.02,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
          sizeAttenuation: true,
        });
        const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
        scene.add(cloud);

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

        function resize() {
          const width = Math.max(mount.clientWidth, 1);
          const height = Math.max(mount.clientHeight, 1);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          renderer.setSize(width, height, false);
          renderer.render(scene, camera);
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        let elapsed = 0;
        let last = 0;

        function loop(time: number) {
          elapsed += last ? Math.min((time - last) / 1000, 0.1) : 0;
          last = time;

          const ease = pointerActive ? 0.08 : 0.05;
          current.x += (target.x - current.x) * ease;
          current.y += (target.y - current.y) * ease;

          headGroup.rotation.y = -0.12 + current.x * 0.38;
          headGroup.rotation.x = current.y * 0.24;
          headGroup.position.y = HEAD_Y + Math.sin(elapsed * 1.1) * 0.035;

          eyeLeft.position.x = -eyeBaseX + current.x * 0.05;
          eyeLeft.position.y = eyeBaseY - current.y * 0.035;
          eyeRight.position.x = eyeBaseX + current.x * 0.05;
          eyeRight.position.y = eyeBaseY - current.y * 0.035;
          haloLeft.position.copy(eyeLeft.position);
          haloRight.position.copy(eyeRight.position);

          robot.rotation.y = Math.sin(elapsed * 0.32) * 0.045;
          arms[0].mesh.rotation.z = arms[0].base + Math.sin(elapsed * 0.9) * 0.05;
          arms[1].mesh.rotation.z = arms[1].base - Math.sin(elapsed * 0.9 + 0.6) * 0.05;

          const pulse = Math.sin(elapsed * 2.4) * 0.5 + 0.5;
          tip.scale.setScalar(0.88 + pulse * 0.28);
          tipLight.intensity = 1 + pulse * 1.4;

          ringA.rotation.z = elapsed * 0.12;
          ringB.rotation.z = -elapsed * 0.09;
          cloud.rotation.y = elapsed * 0.03;

          camera.position.x = current.x * 0.22;
          camera.position.y = 0.2 - current.y * 0.12;
          camera.lookAt(0, -0.05, 0);

          renderer.render(scene, camera);
        }

        let visible = true;
        const intersection = new IntersectionObserver(
          (records) => {
            const entry = records[0];
            if (!entry) return;
            visible = entry.isIntersecting;
            if (reduced) {
              if (visible) renderer.render(scene, camera);
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

        function resetPose() {
          headGroup.rotation.set(0, -0.12, 0);
          headGroup.position.y = HEAD_Y;
          eyeLeft.position.set(-eyeBaseX, eyeBaseY, 0.775);
          eyeRight.position.set(eyeBaseX, eyeBaseY, 0.775);
          haloLeft.position.set(-eyeBaseX, eyeBaseY, 0.767);
          haloRight.position.set(eyeBaseX, eyeBaseY, 0.767);
          camera.position.set(0, 0.2, 6);
          camera.lookAt(0, -0.05, 0);
          renderer.render(scene, camera);
        }

        function onMotionChange() {
          reduced = motionQuery.matches;
          if (reduced) {
            renderer.setAnimationLoop(null);
            resetPose();
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
          resetPose();
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
      className="robot-card"
      style={{ "--robot-height": height } as CSSProperties}
    >
      <div className="robot-card__copy">
        <p className="robot-card__eyebrow">Original 3D · no model files</p>
        <Heading className="robot-card__title">A small robot that follows you.</Heading>
        <p className="robot-card__body">
          A visor, two lit lenses and a hovering shell, built from primitives. The head turns with
          your pointer, the eyes lead the turn, and the antenna keeps a slow pulse.
        </p>
        <ul className="robot-card__meta" aria-label="Scene details">
          <li>three.js</li>
          <li>gaze tracking</li>
          <li>lazy chunk</li>
        </ul>
      </div>

      <div className="robot-card__stage">
        <div className="robot-card__wash" aria-hidden="true" />
        <div ref={host} className="robot-card__canvas" />
        {status === "loading" ? (
          <p className="robot-card__status" role="status">
            Waking the robot
          </p>
        ) : null}
        {status === "failed" ? (
          <p className="robot-card__status robot-card__status--failed" role="status">
            WebGL is unavailable, so the robot stays asleep. The copy still describes the scene.
          </p>
        ) : null}
      </div>
    </div>
  );
}
