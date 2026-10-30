---
id: zoom-parallax
title: Zoom Parallax
tier: reference
type: motion
status: inspiration-only
stack: react, typescript, tailwind, framer-motion
tags: parallax, scroll, zoom, sticky, images, motion
source_url: https://21st.dev/@efferd/components/zoom-parallax
source_author: Efferd
retrieved: 2026-10-30
license: unknown
rights: private-reference
published_source: false
demo: link
demo_url: https://21st.dev/@efferd/components/zoom-parallax
---

# What it is

A scroll scene made of seven images on one sticky stage. The stage holds for three viewport heights while each image scales at a different rate, from 4x to 9x, so the composition appears to pull apart and push through the screen.

# Why it is interesting

- One scroll progress value drives every layer. There is no timeline, no intersection observer and no per-panel listener.
- The images are arranged as a loose collage, not a grid. Fixed offsets and sizes do the composition work.
- Different scale factors per layer create depth from flat images. Faster layers feel closer because they expand sooner.
- The stage sticks while the section scrolls, so the effect needs no scroll hijacking.

# What to borrow

- Drive every layer from one `scrollYProgress` mapped through separate transforms.
- Keep the stage sticky and give the section a fixed height that exceeds the viewport.
- Assign each layer a scale ceiling instead of animating position. The eye reads the speed difference as depth.
- Let the centre image expand least so it anchors the composition while the outer images rush past.

# Reuse risks

- Only seven layout slots exist. An eighth image falls back to the centre slot and the composition breaks.
- Scaling a 25vw image to 9x needs a source much larger than the panel, or it turns to mush. Use high-resolution sources or reveal more of the image instead of upscaling.
- The sticky stage stops working inside an ancestor with `overflow: hidden`, `overflow: clip` or `contain: paint`. The frame around the demo must not clip.
- A 300vh section consumes three screens of scrolling. Anchor links can land halfway through the zoom, and keyboard users must page through it.
- There is no reduced-motion branch. Users who ask for less motion still get the full zoom.
- Positions are fixed in `vw` and `vh`. On a phone the panels shrink to slivers and the collage loses its shape; the code has no small-screen variant.
- The images have no width or height, so the browser cannot reserve space. Every source loads eagerly and competes with the hero.
- The fallback alt text is "Parallax image N". That describes the slot, not the image, and a decorative stage should use empty alt text instead.
- The demo adds Lenis but never stops its animation frame or destroys the instance on unmount. The loop keeps running after the demo leaves the page.
- Tailwind arbitrary selectors with `!important` position the panels. Theming or restyling means editing class strings.
- `h-screen` follows the large mobile viewport, so browser chrome can cover the bottom of the stage. Use `svh` or `dvh`.
- A nine-times transform scales raster pixels. On a low-DPI screen the outer images visibly soften.

# Provenance

Published by Efferd on 21st.dev. Retrieved 2026-10-30. The page's `SoftwareSourceCode` record names the author and carries an empty `license` field. Under this vault's rules that is `unknown`, so no code is hosted here. Study the arrangement, then write an original implementation and credit Efferd as the inspiration.

# Demo

The original preview lives on the 21st.dev component page. It is not hosted here. The vault's original take is the live [Depth Zoom Parallax](https://konethegreat.github.io/ui-vault/demos#demo-depth-zoom-parallax).
