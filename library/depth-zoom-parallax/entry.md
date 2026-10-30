---
id: depth-zoom-parallax
title: Depth Zoom Parallax
tier: pattern
type: motion
status: usable
stack: react, motion, typescript, css
tags: parallax, scroll, gallery, sticky, images
source_author: Kone
retrieved: 2026-10-30
license: MIT
rights: own
published_source: true
files: DepthZoomParallax.tsx, depth-zoom-parallax.css
demo: live
demo_source: site/src/demos/DepthZoomParallaxDemo.tsx
inspired_by: Zoom Parallax by Efferd
inspired_by_url: https://21st.dev/@efferd/components/zoom-parallax
---

# What it is

A scroll-driven gallery where seven framed images sit on a dark stage and fly past the camera at different depths. A sticky stage holds the composition in place while the page scrolls through a tall section, so the images appear to move toward the viewer rather than with the document.

This is an original implementation, not the Efferd component. The referenced original records no license, so its code and assets are not hosted in this repository.

# Why it exists

The visual idea is strong and simple: place images at different depths, scale them by different amounts over one scroll range, and keep the stage fixed so the whole thing reads as a camera move. Most public versions tie that idea to a fixed seven-slot layout, fixed pixel sizes and no reduced-motion branch. This entry keeps the idea and fixes those issues.

# How it works

- `useScroll` tracks one tall section from `start start` to `end end`.
- Each panel gets its own `useTransform` range, so near panels grow faster than far ones.
- The stage is `position: sticky` at `top: 0` with `height: 100svh`; the section is `240vh` tall, `200vh` on small screens.
- Panel positions are percentages of the stage, so the composition scales with the frame instead of relying on fixed pixel sizes.
- Seven slots at most; extra images are ignored rather than forced into a layout that has no room for them.

# Notes

- The parent must not clip with `overflow: hidden`, or sticky stops working. The site uses a `clip={false}` option on its demo frame for this reason.
- Images are decorative: the whole stage is `aria-hidden`, and the meaningful text sits beside it in normal flow.
- The first two images load eagerly, the rest lazily. All are decoded async and marked non-draggable.
- With `prefers-reduced-motion`, the component renders a static two-column grid of the same images and never starts the scroll tracking.
- Below `700px` two of the outer slots are hidden to avoid crowding, and the section shortens to `200vh`.
- Very high scale ceilings will expose raster softness. Use images at least 900px square and keep the largest ceiling at 9.
- `100svh` avoids the mobile URL-bar jump that `100vh` causes.

# Demo

The demo runs live with seven original generated images.

# Attribution

The code is original, MIT. The visual direction is inspired by Zoom Parallax by Efferd (https://21st.dev/@efferd/components/zoom-parallax), which records no license. No code or assets were copied from it.
