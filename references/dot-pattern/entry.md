---
id: dot-pattern
title: Dot Pattern
tier: reference
type: background
status: usable
stack: react, motion, svg, typescript
tags: background, svg, pattern, glow
source_url: https://magicui.design/docs/components/dot-pattern
source_author: Magic UI (magicuidesign)
retrieved: 2026-10-28
license: MIT
license_url: https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
rights: permissive
published_source: true
files: DotPattern.tsx
demo: live
demo_source: site/src/demos/DotPatternDemo.tsx
---

# What it is

A dot grid drawn as SVG circles that fill the parent container. With `glow`, each dot pulses on its own delay. Without it, the pattern is static.

# Behavior

- `width` and `height` set the spacing. `cx`, `cy` and `cr` tune dot offset and radius.
- The pattern measures its own bounding box and rebuilds the grid when the window resizes.
- The SVG is `aria-hidden` and `pointer-events-none`, which is the right default for a texture.
- Dot color comes from the text color utility, so `text-stone-400/60` works.
- Mask the edges with a `mask-image` utility to stop the grid at a rectangle.

# Caveats

- It listens to window resize only, not to container resize. A layout change that resizes the parent without resizing the window leaves the grid at its old size.
- Glow delays are generated with `Math.random` during render, so a remount reshuffles the rhythm.
- The prop type allows arbitrary keys, which hides typos. Pass known props.
- On a very large surface the dot count grows with area. Cap the container or increase spacing.

# Attribution

Dot Pattern by Magic UI (https://magicui.design), MIT. The MIT notice is in [magic-ui-LICENSE.md](../magic-ui-LICENSE.md). Vendored unmodified from `@magicui/dot-pattern` on 2026-10-28. Keep the license notice if you copy it.
