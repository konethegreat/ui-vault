---
id: spline-scene
title: Spline Scene
tier: reference
type: hero
status: usable
stack: react, typescript, tailwind, spline
tags: hero, 3d, spline, lazy-loading, suspense, scene, pointer
source_url: https://21st.dev/@serafimcloud/components/splite
source_author: Serafim
retrieved: 2026-11-07
license: MIT
license_url: https://21st.dev/@serafimcloud/components/splite
rights: permissive
published_source: true
files: SplineScene.tsx, LICENSE.md
demo: link
demo_url: https://21st.dev/@serafimcloud/components/splite
---

# What it is

A wrapper that mounts a Spline scene in React. The Spline runtime is imported on demand, a Suspense fallback covers the module load, and the scene itself is a URL that Spline hosts. The published file is about twenty lines.

# Why it is in the vault

It is an MIT component by Serafim, published on 21st.dev, and it draws a clean line between the code and the scene asset. The wrapper is generic: point it at any scene you own and it works. The author's page pairs it with a dark card that has copy on the left and the scene on the right.

The demo scene on the author's page is not part of the MIT component and records no separate license, so this entry links to the original demo instead of embedding that scene. The site's live counterpart is `library/orbit-scene-card/`, an original three.js scene that keeps the same card composition with no Spline runtime and no borrowed asset.

# How it works

- `lazy(() => import("@splinetool/react-spline"))` keeps the runtime out of the initial bundle.
- `Suspense` shows a centered `loader` span while the module downloads.
- The `scene` prop is a public Spline scene URL. The runtime downloads the scene file and draws it into a canvas that fills the component.
- `className` is forwarded to the Spline canvas, so height and pointer rules belong to the parent.
- The wrapper holds no state. Animation and pointer interaction inside the canvas are owned by the scene.

# Reuse notes

- Install both packages: `@splinetool/react-spline` and `@splinetool/runtime`.
- The published `loader` class has no styles. Give it a spinner, or pass a different fallback.
- Give the host a height. The canvas fills its parent, it does not set one.
- Suspense covers the lazy module, not a failed scene download. Add an error boundary.
- Scene URLs point at binary assets. They are not covered by the component license. Use a scene you made or have written permission to embed.
- The canvas captures pointer gestures. On a phone, check that a vertical swipe still scrolls the page.
- Reduced motion is decided inside the scene, not by this wrapper. Set the scene's own motion settings.
- Defer the card if it sits below the fold. The runtime plus a scene is a heavy download.
- In Next.js, mount the wrapper with `ssr: false` or from a client component.

# Demo

No demo is hosted here. The original is at https://21st.dev/@serafimcloud/components/splite.

The live demo on this site is Orbit Scene Card, an original three.js scene in the same card layout. It does not use Spline or the author's scene.

# Attribution

Spline Scene by Serafim (https://21st.dev/@serafimcloud/components/splite), MIT. The wrapper and its notice are vendored in this folder. No scene asset is hosted here.
