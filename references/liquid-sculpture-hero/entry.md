---
id: liquid-sculpture-hero
title: Liquid Sculpture Hero
tier: reference
type: hero
status: inspiration-only
stack: react, webgl2, glsl, typescript
tags: particles, gpu, cursor, image, hero, light-mode
source_url: https://guglielmogiannattasio.it
source_author: guglielmogiannattasio.it, via a 21st.dev component export
retrieved: 2026-10-27
license: unknown
rights: private-reference
published_source: false
---

# What it is

A hero that rebuilds an image as roughly one hundred thousand GPU particles. The cursor turns the material liquid and it settles back into the crisp image. Without WebGL2 it falls back to a static image.

# Techniques worth reusing

- The particle field is sampled from the image's own pixels, so any image can become the sculpture without a second asset.
- A flow map stores cursor velocity and energy in an RGBA8 texture, with velocity encoded around 128, which keeps displacement cheap and stable.
- The image and particle passes share one energy function, so the cross-fade between them is complementary and has no seam. This is the best idea in the component.
- The static image renders first and the canvas fades in only after the first frame, so the page never depends on WebGL for content.
- Reduced motion is detected and passed into the engine options.
- The author credit is built into the component behind a `showCredit` prop. That is the right default for a borrowed look.
- The layout function places the artwork in the band between the navigation and the copy, with separate desktop and phone scaling.

# Reuse risks

- The default photographs are hotlinked from `cdn.21st.dev`, so the demo is not self-contained and depends on someone else's CDN.
- The fallback image sets `crossOrigin="anonymous"`, which fails if the CDN does not return permissive CORS headers.
- Geist and Instrument Serif are loaded from Google Fonts at runtime, which adds a third-party request and a layout shift risk.
- One hundred thousand particles is expensive on low-end GPUs. Test on a mid-range phone before shipping.
- The component is large and mixes engine, layout, styles and content in one file. Split it before adapting.
- No license is recorded. Do not republish the source.

# What to borrow for an original implementation

- The image-to-particles sampling pass.
- The encoded flow map for cursor wake.
- The shared energy function for a seamless image and particle cross-fade.
- The progressive enhancement order: static image, then canvas on first frame.

# Provenance

The header comment credits guglielmogiannattasio.it. The default images are hosted on the 21st.dev CDN, which suggests the component was exported from 21st.dev, but the exact item URL was not recorded with the export. No license text was included.

The verbatim source is kept in the local `_private/` archive and is not published in this repository. Build an original implementation from the notes above and keep the author credit in any project that uses the visual idea.
