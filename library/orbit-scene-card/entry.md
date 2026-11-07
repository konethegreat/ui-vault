---
id: orbit-scene-card
title: Orbit Scene Card
tier: pattern
type: hero
status: usable
stack: react, typescript, three.js, css
tags: hero, 3d, three.js, card, pointer, parallax, lazy-loading, dark, webgl
source_author: Kone
retrieved: 2026-11-07
license: MIT
rights: own
published_source: true
files: OrbitSceneCard.tsx, orbit-scene-card.css
demo: live
demo_source: site/src/demos/OrbitSceneCardDemo.tsx
inspired_by: Spline Scene by Serafim
inspired_by_url: https://21st.dev/@serafimcloud/components/splite
---

# What it is

A dark card with a headline on the left and a generated orbit on the right. A flat-shaded icosahedron sits inside three thin rings and a cloud of points, lit with an amber key and a cool rim. The group leans toward the pointer, the scene pauses when it leaves the viewport, and reduced motion keeps a still frame.

# Why it exists

Spline Scene is MIT, but its demo scene is a separate asset with no stated license. This is an original scene for the same card composition, built from three.js geometry with no Spline runtime, no model file and no borrowed scene. It also shows a practical loading shape for heavy 3D: the library is imported inside an effect, so the first bundle does not carry it.

# How it works

- `three` is imported with a dynamic `import()` inside the mount effect. Vite puts it in its own chunk.
- The renderer uses an alpha canvas, so the CSS wash behind it remains visible. Pixel ratio is capped at two.
- Geometry is a faceted `IcosahedronGeometry` core, a slightly larger wireframe shell, three `TorusGeometry` rings and a 520 point `BufferGeometry` cloud. There are no textures and no model files.
- Lights are a hemisphere fill, an amber directional key, a cool directional rim and a dim point light at the core.
- Pointer movement is read on the card, not on `document`. Only mouse pointers update the target. The loop eases the group and the camera toward that target, so the motion has weight.
- An `IntersectionObserver` and `visibilitychange` stop the animation loop when the card is offscreen or the tab is hidden.
- `prefers-reduced-motion` renders one frame, disables the pointer lean and stops listening for changes.
- A `ResizeObserver` keeps the camera aspect and the canvas size in step with the card.
- Cleanup cancels the loop, removes every listener and observer, disposes every geometry and material, and releases the WebGL context.
- A CSS radial wash sits under the canvas. If WebGL fails, the card keeps its composition and the copy stays readable.

# Notes

- The copy is the accessible content. The canvas is `aria-hidden` and has `pointer-events: none`, so text selection and links in the copy work while the card listener still reads the pointer.
- The scene is decorative. It carries no information that the copy does not state.
- `three` is heavy. Mount one card, not a grid of them, and keep the dynamic import.
- The card needs height. Above 760px it uses the `height` prop; below that it stacks and uses `--orbit-height` as a minimum.
- Touch pointers are ignored for parallax on purpose. A vertical swipe must keep scrolling the page.
- The point light is deliberately weak. Raising it washes out the flat shading that gives the core its edges.
- The title uses a clipped gradient. If you retheme it, check contrast against the dark surface.
- The scene drifts on its own. If it sits next to a text-heavy section, keep the card below the fold or pause it with reduced motion.
- WebGL2 is the practical baseline. The CSS wash is the visible fallback, not a full replacement.

# Demo

The demo runs at the frame's full width with a 64vh height. Move the pointer across the card to lean the scene. Scroll it out of view and the loop stops. With reduced motion, the scene is a still image and the pointer does not move it.

# Attribution

Original implementation, MIT. Inspired by Spline Scene by Serafim (https://21st.dev/@serafimcloud/components/splite). No Spline runtime, component code or scene asset was used.
