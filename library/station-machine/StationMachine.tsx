import { useEffect, useRef, useState } from "react";
import "./station-machine.css";

const STATIONS = [
  {
    id: "intake",
    name: "Intake",
    note: "Raw stock enters through the hopper and settles into the first bay. The chute is a cone over a short cylinder, lit from inside.",
  },
  {
    id: "press",
    name: "Press",
    note: "A two-post frame drives a ram down on every cycle. The gap between the posts is the only place the amber light reaches.",
  },
  {
    id: "assembly",
    name: "Assembly",
    note: "Two rings sit at right angles and turn around a shared core. The shape reads as a joint without any labels.",
  },
  {
    id: "finish",
    name: "Finish",
    note: "A sealed tank with a single band around it. The surface is metal, so the colour comes from the lights, not the material.",
  },
  {
    id: "dispatch",
    name: "Dispatch",
    note: "Finished parts leave down a short ramp and stack at the edge of the plate. This is the last stop on the ring.",
  },
] as const;

type Status = "loading" | "ready" | "failed";

export function StationMachine({
  height = "clamp(440px, 64vh, 640px)",
  headingLevel = "h2",
}: {
  height?: string;
  headingLevel?: "h1" | "h2" | "h3";
}) {
  const host = useRef<HTMLDivElement>(null);
  const applySelection = useRef<((index: number | null) => void) | null>(null);
  const selectedRef = useRef<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  selectedRef.current = selected;

  useEffect(() => {
    applySelection.current?.(selected);
  }, [selected]);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        if (cancelled || !host.current) return;

        const mount = host.current;
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let reduced = motionQuery.matches;
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.classList.add("station-machine__gl");
        renderer.domElement.setAttribute("aria-hidden", "true");
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a08);
        scene.fog = new THREE.Fog(0x0a0a08, 13, 28);

        const camera = new THREE.PerspectiveCamera(
          42,
          Math.max(mount.clientWidth, 1) / Math.max(mount.clientHeight, 1),
          0.1,
          60
        );
        camera.position.set(0, 9.2, 13.4);

        const controls = new OrbitControls(camera, renderer.domElement);
        renderer.domElement.style.touchAction = "pan-y";
        controls.target.set(0, 0.4, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.07;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.minPolarAngle = 0.35;
        controls.maxPolarAngle = 1.36;
        controls.autoRotate = false;

        scene.add(new THREE.HemisphereLight(0xfff1d8, 0x0a0a08, 0.55));

        const key = new THREE.DirectionalLight(0xffd7a0, 2.4);
        key.position.set(6, 11, 7);
        scene.add(key);

        const rim = new THREE.DirectionalLight(0x7fa7ff, 1.1);
        rim.position.set(-7, 5, -6);
        scene.add(rim);

        const core = new THREE.PointLight(0xe8a33d, 26, 18, 2);
        core.position.set(0, 2.2, 0);
        scene.add(core);

        const metal = new THREE.MeshStandardMaterial({
          color: 0x1b1b18,
          metalness: 0.82,
          roughness: 0.38,
        });
        const dark = new THREE.MeshStandardMaterial({
          color: 0x11110f,
          metalness: 0.55,
          roughness: 0.6,
        });
        const brass = new THREE.MeshStandardMaterial({
          color: 0x8a6428,
          metalness: 0.9,
          roughness: 0.32,
          emissive: 0xe8a33d,
          emissiveIntensity: 0.35,
        });

        const plate = new THREE.Mesh(new THREE.CylinderGeometry(7.3, 7.6, 0.6, 72), metal);
        plate.position.y = -0.3;
        scene.add(plate);

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(6.55, 0.025, 8, 128),
          new THREE.MeshBasicMaterial({ color: 0xe8a33d, transparent: true, opacity: 0.45 })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.02;
        scene.add(ring);

        const stations: Array<{
          group: InstanceType<typeof THREE.Group>;
          position: InstanceType<typeof THREE.Vector3>;
          beacon: InstanceType<typeof THREE.MeshStandardMaterial>;
        }> = [];
        const pickRoots: InstanceType<typeof THREE.Group>[] = [];
        const radius = 4.55;
        let ramMesh: InstanceType<typeof THREE.Mesh> | null = null;
        let assemblyRings: InstanceType<typeof THREE.Group> | null = null;

        STATIONS.forEach((_, index) => {
          const angle = (index / STATIONS.length) * Math.PI * 2 - Math.PI / 2;
          const group = new THREE.Group();
          group.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
          group.rotation.y = -angle + Math.PI / 2;

          const base = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 0.34, 40), metal);
          base.position.y = 0.17;
          group.add(base);

          const beacon = new THREE.MeshStandardMaterial({
            color: 0xe8a33d,
            emissive: 0xe8a33d,
            emissiveIntensity: 0.7,
            roughness: 0.3,
          });
          const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 12), beacon);
          lamp.position.set(0.72, 1.3, 0.52);
          group.add(lamp);

          if (index === 0) {
            const hopper = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.25, 32, 1, true), brass);
            hopper.position.y = 1.1;
            group.add(hopper);
            const chute = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 24), dark);
            chute.position.y = 0.48;
            group.add(chute);
          } else if (index === 1) {
            const post = new THREE.BoxGeometry(0.22, 1.5, 0.22);
            for (const x of [-0.62, 0.62]) {
              const column = new THREE.Mesh(post, brass);
              column.position.set(x, 1.02, 0);
              group.add(column);
            }
            const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.24, 0.5), metal);
            top.position.y = 1.78;
            group.add(top);
            const ram = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.34, 0.5), dark);
            ram.position.y = 0.92;
            ramMesh = ram;
            group.add(ram);
          } else if (index === 2) {
            const rings = new THREE.Group();
            rings.position.y = 1.2;
            rings.rotation.z = 0.35;
            const hoop = new THREE.TorusGeometry(0.58, 0.075, 14, 64);
            const first = new THREE.Mesh(hoop, brass);
            const second = new THREE.Mesh(hoop, brass);
            second.rotation.y = Math.PI / 2;
            const hub = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), dark);
            rings.add(first, second, hub);
            group.add(rings);
            assemblyRings = rings;
            const anchor = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.8, 20), dark);
            anchor.position.y = 0.56;
            group.add(anchor);
          } else if (index === 3) {
            const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.72, 1.5, 36), metal);
            tank.position.y = 1.0;
            group.add(tank);
            const band = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.05, 10, 48), brass);
            band.rotation.x = Math.PI / 2;
            band.position.y = 1.28;
            group.add(band);
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.66, 0.28, 32), dark);
            cap.position.y = 1.88;
            group.add(cap);
          } else {
            const ramp = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.7), brass);
            ramp.position.set(0.15, 0.5, 0.1);
            ramp.rotation.z = -0.28;
            group.add(ramp);
            for (let stack = 0; stack < 3; stack += 1) {
              const crate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.24, 0.5), dark);
              crate.position.set(-0.55 + stack * 0.1, 0.85 + stack * 0.24, 0.1);
              group.add(crate);
            }
          }

          group.userData.station = index;
          scene.add(group);
          stations.push({
            group,
            position: new THREE.Vector3(group.position.x, 0.7, group.position.z),
            beacon,
          });
          pickRoots.push(group);
        });

        const pathPoints = stations.map(
          (station) => new THREE.Vector3(station.position.x, 0.05, station.position.z)
        );
        const path = new THREE.CatmullRomCurve3(pathPoints, true);
        const track = new THREE.Mesh(
          new THREE.TubeGeometry(path, 128, 0.035, 6, true),
          new THREE.MeshBasicMaterial({ color: 0xe8a33d, transparent: true, opacity: 0.22 })
        );
        scene.add(track);

        const overviewPosition = new THREE.Vector3(0, 9.2, 13.4);
        const overviewTarget = new THREE.Vector3(0, 0.4, 0);
        let focusPosition: InstanceType<typeof THREE.Vector3> | null = null;
        let focusTarget: InstanceType<typeof THREE.Vector3> | null = null;
        let selectionIndex: number | null = null;

        function render() {
          renderer.render(scene, camera);
        }

        function selection(index: number | null) {
          selectionIndex = index;
          stations.forEach((station, stationIndex) => {
            station.beacon.emissiveIntensity = stationIndex === index ? 2.4 : 0.7;
          });

          if (index === null) {
            focusPosition = overviewPosition.clone();
            focusTarget = overviewTarget.clone();
          } else {
            const station = stations[index];
            const outward = station.position.clone().setY(0).normalize();
            focusPosition = station.position.clone().add(outward.multiplyScalar(7.2)).setY(3.8);
            focusTarget = station.position.clone().setY(1);
          }

          if (reduced) {
            camera.position.copy(focusPosition);
            controls.target.copy(focusTarget);
            controls.update();
            render();
          }
        }

        applySelection.current = selection;

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let downX = 0;
        let downY = 0;

        function onPointerDown(event: PointerEvent) {
          downX = event.clientX;
          downY = event.clientY;
          focusPosition = null;
          focusTarget = null;
        }

        function onPointerUp(event: PointerEvent) {
          if (Math.hypot(event.clientX - downX, event.clientY - downY) > 6) return;
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
          );
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(pickRoots, true)[0];
          if (!hit) {
            setSelected(null);
            selection(null);
            return;
          }

          let current: InstanceType<typeof THREE.Object3D> | null = hit.object;
          let stationIndex: number | undefined;
          while (current && stationIndex === undefined) {
            if (typeof current.userData.station === "number") {
              stationIndex = current.userData.station;
            } else {
              current = current.parent;
            }
          }
          if (stationIndex === undefined) return;
          setSelected(stationIndex);
          selection(stationIndex);
        }

        renderer.domElement.addEventListener("pointerdown", onPointerDown);
        renderer.domElement.addEventListener("pointerup", onPointerUp);

        const onControlsChange = () => {
          if (reduced) render();
        };
        controls.addEventListener("change", onControlsChange);

        const resize = new ResizeObserver(() => {
          const width = Math.max(mount.clientWidth, 1);
          const height = Math.max(mount.clientHeight, 1);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          renderer.setSize(width, height, false);
          render();
        });
        resize.observe(mount);

        let visible = true;
        const intersection = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            if (visible && !reduced) {
              renderer.setAnimationLoop(loop);
            } else if (!visible && !reduced) {
              renderer.setAnimationLoop(null);
            }
          },
          { rootMargin: "120px" }
        );
        intersection.observe(mount);

        let elapsed = 0;
        let lastFrame = 0;

        function loop(time: number) {
          if (!visible) return;
          elapsed += lastFrame ? Math.min((time - lastFrame) / 1000, 0.1) : 0;
          lastFrame = time;

          if (ramMesh) {
            ramMesh.position.y = 0.92 + Math.sin(elapsed * 1.6) * 0.18;
          }

          if (assemblyRings) {
            assemblyRings.rotation.y = elapsed * 0.6;
          }

          const pulse = 0.7 + Math.sin(elapsed * 2.2) * 0.35;
          stations.forEach((station, index) => {
            if (index === selectionIndex) {
              station.beacon.emissiveIntensity = 2.1 + pulse * 0.4;
            }
          });

          if (focusPosition && focusTarget) {
            camera.position.lerp(focusPosition, 0.075);
            controls.target.lerp(focusTarget, 0.075);
            if (camera.position.distanceTo(focusPosition) < 0.02) {
              focusPosition = null;
              focusTarget = null;
            }
          }

          controls.update();
          renderer.render(scene, camera);
        }

        selection(selectedRef.current);

        if (reduced) {
          render();
        } else {
          renderer.setAnimationLoop(loop);
        }

        const onVisibility = () => {
          if (reduced) return;
          if (document.hidden) {
            renderer.setAnimationLoop(null);
          } else if (visible) {
            renderer.setAnimationLoop(loop);
          }
        };
        document.addEventListener("visibilitychange", onVisibility);

        const onMotionChange = () => {
          reduced = motionQuery.matches;
          if (reduced) {
            renderer.setAnimationLoop(null);
            if (focusPosition) camera.position.copy(focusPosition);
            if (focusTarget) controls.target.copy(focusTarget);
            focusPosition = null;
            focusTarget = null;
            controls.update();
            render();
          } else if (visible && !document.hidden) {
            lastFrame = 0;
            renderer.setAnimationLoop(loop);
          }
        };
        motionQuery.addEventListener("change", onMotionChange);

        const onContextLost = (event: Event) => {
          event.preventDefault();
          renderer.setAnimationLoop(null);
          if (!cancelled) setStatus("failed");
        };
        renderer.domElement.addEventListener("webglcontextlost", onContextLost);

        cleanup = () => {
          applySelection.current = null;
          renderer.setAnimationLoop(null);
          document.removeEventListener("visibilitychange", onVisibility);
          motionQuery.removeEventListener("change", onMotionChange);
          renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
          renderer.domElement.removeEventListener("pointerdown", onPointerDown);
          renderer.domElement.removeEventListener("pointerup", onPointerUp);
          controls.removeEventListener("change", onControlsChange);
          resize.disconnect();
          intersection.disconnect();
          controls.dispose();
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
          renderer.domElement.remove();
        };

        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("failed");
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const active = selected === null ? null : STATIONS[selected];
  const Heading = headingLevel;

  return (
    <div className="station-machine" style={{ height }}>
      <div ref={host} className="station-machine__canvas" aria-hidden="true" />

      {status !== "failed" ? (
        <div className="station-machine__hud">
          <div className="station-machine__top">
            <div className="station-machine__copy">
              <p className="station-machine__eyebrow">Procedural scene · five stations</p>
              <Heading className="station-machine__title">
                {active ? active.name : "The line at rest"}
              </Heading>
              <p className="station-machine__note" aria-live="polite">
                {active
                  ? active.note
                  : "Drag to orbit and click a station to move the camera. Every shape is geometry and light, with no models or textures."}
              </p>
            </div>
            <p className="station-machine__hint">Drag · click · orbit</p>
          </div>

          <div className="station-machine__controls" role="group" aria-label="Camera and station views">
            <button
              type="button"
              className="station-machine__button"
              aria-pressed={selected === null}
              onClick={() => setSelected(null)}
            >
              Overview
            </button>
            {STATIONS.map((station, index) => (
              <button
                key={station.id}
                type="button"
                className="station-machine__button"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                {station.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {status === "loading" ? (
        <p className="station-machine__status" role="status">
          Building the line
        </p>
      ) : null}
      {status === "failed" ? (
        <div className="station-machine__fallback" role="status">
          <p>This scene needs WebGL2. The five stations are still listed here.</p>
          <p>{STATIONS.map((station) => station.name).join(" · ")}</p>
        </div>
      ) : null}
    </div>
  );
}
