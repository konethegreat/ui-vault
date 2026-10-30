---
id: station-machine
title: Station Machine
tier: pattern
type: interaction
status: usable
stack: react, three, typescript, css
tags: 3d, three.js, orbit, camera, procedural, webgl, reduced-motion
source_author: Kone
retrieved: 2026-10-30
license: MIT
rights: own
published_source: true
files: StationMachine.tsx, station-machine.css
demo: live
demo_source: site/src/demos/StationMachineDemo.tsx
inspired_by: Interactive 3D Machine by Evgeny Shilov
inspired_by_url: https://agentic-factory-3d.vercel.app
---

# What it is

A procedural three.js scene of a five station production line on a metal plate. The stations are built from primitives: a hopper, a press, a pair of rings, a tank and a ramp. Drag to orbit, click a station or use the labelled buttons to move the camera, and the scene explains the selected station in plain text.

This is an original scene, not the Interactive 3D Machine by Evgeny Shilov. That project records no license, so neither its code nor its scene is hosted in this repository.

# Why it exists

The vault pointed at the original machine but could not run it. A 3D scene is also a useful test of how far a demo can go while staying accessible: the canvas is decorative, the station list is real HTML, and reduced motion still produces a complete picture.

# How it works

- `three` is imported dynamically inside the effect, so the site keeps it in a separate chunk and only loads it when the demo mounts.
- Five station groups are placed around a ring. Each group is simple geometry, and the camera, lights and fog do the rest.
- A single `OrbitControls` instance handles mouse, pen and touch. Panning and zoom are off, so a wheel or a vertical touch drag scrolls the page, and the polar angle is limited so the plate stays readable.
- Clicking a station raycasts against the station groups and moves the camera to that station. Clicking empty space returns to the overview.
- The HUD buttons mirror the same selection, so the scene is usable without a pointer and without the canvas.
- The press ram, the two assembly rings and the selected beacon animate. With `prefers-reduced-motion`, the scene renders a still frame, camera changes jump instead of easing, and a render happens on orbit change. A runtime change to the preference is handled.
- The loop pauses when the scene is offscreen or the tab is hidden.
- The device pixel ratio is capped at 2 and reapplied on resize. A lost WebGL context switches to the text fallback.

# Notes

- Every geometry and material is disposed on unmount, the controls are disposed, and the renderer loses its context.
- The canvas is `aria-hidden`. All meaning lives in the heading, the note and the button group. The note is a polite live region, so changing the selection is announced. The heading level is configurable.
- There are no models, textures or image assets. The scene needs nothing beyond the three.js chunk.
- The station names here are deliberately different from the referenced project. The idea of a station ring is shared, the composition and labels are not.
- If WebGL2 or the dynamic import fails, the HUD gives way to a text fallback that lists the stations.

# Demo

The demo runs live. It is the site's own scene, not the author's deployment.

# Attribution

The code and scene are original, MIT. The concept of a five station product machine is inspired by Interactive 3D Machine by Evgeny Shilov (https://agentic-factory-3d.vercel.app), which records no license. No code, geometry or assets were copied.
