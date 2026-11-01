---
id: portal-carousel
title: Portal Carousel
tier: reference
type: interaction
status: usable
stack: react, gsap, typescript, tailwind
tags: carousel, cursor, gallery, fullscreen, gsap, click
source_url: https://21st.dev/@hyperiux/components/portal-carousel
source_author: Hyperiux
retrieved: 2026-11-02
license: MPL-2.0
license_url: https://mozilla.org/MPL/2.0/
rights: permissive
published_source: true
files: PortalCarousel.tsx, LICENSE.md
demo: live
demo_source: site/src/demos/PortalCarouselDemo.tsx
---

# What it is

A full-stage image carousel where the next image waits as a small square preview near the cursor. A click expands that preview from its parked corner into the whole frame with GSAP, then the following preview appears. Titles and the image count roll over as each image lands.

# Why it exists

Most carousels separate the control from the result: arrows below, dots at the bottom, a slide that moves sideways. This one makes the control itself the transition. The small preview is both the affordance and the thing that grows, so the click feels spatial rather than like a page change.

The component is published as a Free Core effect by Hyperiux and is vendored here under MPL 2.0 with the license notice at the top of the file. That license allows the source to be hosted and reused as long as the notices stay in place. This is not an original implementation by this repository.

# How it works

- The resting frame shows `images[current]`.
- A second `img` inside the moving thumbnail shows `images[current + 1]`, the image a click will reveal.
- `advance` measures the thumbnail and records its rect relative to the stage, then pushes a layer with that origin into state.
- Each `ExpandingLayer` tweens from the recorded thumbnail rect to the full stage on mount. When it finishes, its index becomes `current` and the layer is removed.
- Layers are keyed by an incrementing id, so rapid clicks stack rather than replace each other.
- The preview and its `Next` tag follow the pointer with a lerp on `requestAnimationFrame`. Without a pointer the preview parks in the bottom-right corner.
- `RollingText` masks the count and title so the old value slides out as the new one slides in.
- Reduced motion replaces the expansion with a short fade and places the preview instantly.

# Notes

- Needs at least two images. With one image the preview and the click handling are disabled.
- `gsap` is a real dependency. The expansion, the preview pop and the rolling text all use it.
- The root is `h-screen`. Inside a shorter frame, pass a height class with the important modifier or the stage will take the viewport.
- Any overlay child sits inside a `pointer-events-none` wrapper. A link or button inside it needs `pointer-events-auto` or the click falls through to the stage and advances the carousel.
- The root click handler ignores clicks on `a`, `button`, `input`, `select`, `textarea` and `[role="button"]`, except the thumbnail itself.
- Images are warmed by creating a new `Image` per source. Keep the same array reference or the effect reruns.
- Alt text is optional. When present it feeds the thumbnail label and the polite live region.
- The thumbnail is a real button, so keyboard users can tab to it and press Enter.
- MPL 2.0 is file-level copyleft. If you modify this file, keep the notices and state what changed.
- The original demo points at Hyperiux's R2-hosted photos. Those are not part of the license and are not used here.

# Demo

The live demo runs the vendored component with five original generated landscapes, a fixed stage height, and a credited header. Click the stage or the preview to advance.

# Attribution

Portal Carousel by Hyperiux (https://21st.dev/@hyperiux/components/portal-carousel), Free Core under the Mozilla Public License 2.0. Vendored unchanged apart from the license notice at the top of the file. Built with Hyperiux Vault (https://vault.hyperiux.com). Demo images are original generated work for this repository.
