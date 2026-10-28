---
id: interactive-3d-machine
title: Interactive 3D Machine
tier: reference
type: interaction
status: inspiration-only
stack: react, three.js, webgl, typescript
tags: 3d, three-js, product-tour, stations, camera, procedural
source_url: https://agentic-factory-3d.vercel.app
source_author: Evgeny Shilov (eugeneshilow); built with OpenAI Codex, ported to React by Claude
retrieved: 2026-10-28
license: unknown
rights: private-reference
published_source: false
demo: link
demo_url: https://agentic-factory-3d.vercel.app
---

# What it is

A React and three.js scene of a short-video factory as one physical machine. Five stations sit on a metal plate: engine, admin, storefront, cabinet and cashdesk. You can orbit it, hover a station, click to focus, switch between four modes and jump between five camera presets. Everything is procedural. There are no models, images or textures to download.

# Why it is interesting

- It turns a product explanation into a place. Order, script, video, post and payment become stations you can point at.
- The four modes tell the same story at different depths: assembled, cutaway, stations and one order.
- Camera presets do the narrative work. Overview, side, top, station and flight each answer a different question.
- The geometry is boxes, cylinders, rounded boxes and merged meshes with one room environment map, so the whole scene ships without assets.
- A small global API (`window.__machine` with `setMode`, `setCamera`, `focusStation`, `play`, `pause`) makes the scene scriptable and testable.
- The accessibility scaffolding is better than most 3D demos: an `aria-label` on the canvas, `aria-pressed` on controls, a play/pause label that updates, reduced-motion detection, and a coarse-pointer branch that avoids trapping touch scroll.
- Cleanup is thorough. Controls, listeners, observers, geometries, materials, textures, the environment, the renderer and the global API are all disposed.

# What to borrow

- The station metaphor and the five camera presets. This is the reusable idea, not the machine itself.
- Modes as progressive disclosure: shell first, then cutaway, then stations, then a single order in motion.
- One environment map plus simple materials. It looks expensive without an asset pipeline.
- Hover raycasting with a cursor change, and click to focus a station.
- An imperative control object for demos, tests and autoplay, scoped to a ref instead of a global.
- Dispose everything on unmount and pause rendering when the canvas leaves the viewport.

# Reuse risks

- There is no license header in the source, and the template repository forbids redistributing its templates. The 21st.dev page claimed MIT, but the file itself carries no such record. Treat it as all rights reserved, link only, and write an original scene.
- The component is one file of about 2,650 lines mixing scene graph, UI, CSS and content. Split it into scene, controls and chrome before adapting the approach.
- three.js is a large dependency. Budget for it and consider a static image or a short video on low-end devices.
- The scene renders continuously. Pause when offscreen and when the document is hidden.
- Rotation is disabled on coarse pointers, so phone users can inspect stations but cannot orbit. Decide whether that trade is right for your content.
- Station screens are painted into the canvas, so their text is not selectable, searchable or readable by assistive technology. Keep every meaningful label in real HTML next to the canvas.
- `window.__machine` is global. Two instances collide. Use a ref or scope the API.
- Initialization waits for `document.fonts.ready`, so a font failure can delay the first frame.

# Provenance

Built by Evgeny Shilov (eugeneshilow) with OpenAI Codex and ported to React by Claude. The live demo is at https://agentic-factory-3d.vercel.app and the Next.js template is at https://github.com/eugeneshilow/agentic-3d-templates.

The distribution has no license header. The 21st.dev component page reportedly listed MIT at retrieval time, but that claim is not recorded in the source and the template repository explicitly forbids redistributing the templates. The stricter reading wins. The verbatim source stays in the local `_private/` archive, the entry has `published_source: false`, and no code is hosted in this repository. Do not copy it into a project. Reimplement the ideas above with your own scene and credit the original as inspiration.

# Demo

The original runs at https://agentic-factory-3d.vercel.app. It is not hosted here and has no local wrapper.
