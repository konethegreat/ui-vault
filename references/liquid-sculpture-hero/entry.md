---
id: liquid-sculpture-hero
title: Liquid Sculpture Hero
tier: reference
type: hero
status: usable
stack: react, webgl2, glsl, typescript
tags: particles, gpu, cursor, image, hero, light-mode
source_url: https://21st.dev/@gughigug/components/liquid-sculpture-hero
source_author: Guglielmo Giannattasio
retrieved: 2026-10-28
license: MIT
license_url: https://21st.dev/@gughigug/components/liquid-sculpture-hero
rights: permissive
published_source: true
files: SculptureHero.tsx, LICENSE.md
demo: live
demo_source: site/src/demos/LiquidSculptureDemo.tsx
---

# What it is

A hero that rebuilds an image as roughly one hundred thousand GPU particles. The cursor turns the material liquid and it settles back into the crisp image. Without WebGL2 it falls back to a static image.

# Why it is in the vault

It is the best example I have found of a hero that treats an image as a physical material. The code is MIT, the author is known, and the component page is public, so it can run here without guessing at rights.

# Techniques worth reusing

- The particle field is sampled from the image's own pixels, so any image can become the sculpture without a second asset.
- A flow map stores cursor velocity and energy in an RGBA8 texture, with velocity encoded around 128, which keeps displacement cheap and stable.
- The image and particle passes share one energy function, so the cross-fade between them is complementary and has no seam. This is the best idea in the component.
- The static image renders first and the canvas fades in only after the first frame, so the page never depends on WebGL for content.
- Reduced motion is detected and passed into the engine options.
- The layout function places the artwork in the band between the navigation and the copy, with separate desktop and phone scaling.

# What was changed for this repository

Three small edits:

- The built-in credit link now points to the 21st.dev component page and names the author, which also satisfies the 21st.dev link-back requirement.
- The demo passes a locally hosted image instead of a CDN asset, so the vault does not depend on someone else's storage or CORS headers. The original defaults remain in the file.
- One write-only private field (`lastInput`) and its dead assignment were removed so the file passes strict TypeScript with `noUnusedLocals`. Nothing read the value, so behavior is unchanged.

# Reuse risks

- The default photographs are hotlinked from `cdn.21st.dev`, so pass your own `src` and `mobileSrc` if you copy the component.
- The fallback image sets `crossOrigin="anonymous"`, which fails if a remote host does not return permissive CORS headers. A same-origin image avoids the problem.
- Geist and Instrument Serif load from Google Fonts by default, which adds a third-party request and a layout shift risk. Set `loadFonts` to false to use local fonts.
- One hundred thousand particles is expensive on low-end GPUs. Test on a mid-range phone before shipping.
- The component is large and mixes engine, layout, styles and content in one file. Split it before adapting.
- The 21st.dev component page is the license record. Keep the visible credit if you reuse it.

# Attribution

Liquid Sculpture Hero by Guglielmo Giannattasio, licensed MIT, published on 21st.dev at https://21st.dev/@gughigug/components/liquid-sculpture-hero. The source and the MIT notice are vendored in this folder. The site serves the notice at `licenses/liquid-sculpture.txt`. If you copy it onward, keep the credit and the license notice.
