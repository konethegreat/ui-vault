---
id: animated-shiny-text
title: Animated Shiny Text
tier: reference
type: text
status: usable
stack: react, tailwind, css, typescript
tags: text, shimmer, animation, marketing
source_url: https://magicui.design/docs/components/animated-shiny-text
source_author: Magic UI (magicuidesign)
retrieved: 2026-10-28
license: MIT
license_url: https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
rights: permissive
published_source: true
files: AnimatedShinyText.tsx
demo: live
demo_source: site/src/demos/ShinyTextDemo.tsx
---

# What it is

A single line of text with a light highlight that sweeps across it. The effect is a clipped background gradient animated with a CSS keyframe, so no canvas or JavaScript animation loop is involved.

# Behavior

- `shimmerWidth` sets the width of the highlight in pixels.
- Most of the cycle is rest: the keyframes hold the gradient away from the text for the first and last tenth, so the sweep reads as occasional rather than constant.
- The gradient uses `currentColor`-style black and white stops, so the text must stay on a light or dark surface that matches.
- Color and size come from the caller through `className`.

# Caveats

- The component is a `span` with decorative motion. Do not use it for a control label or anything that must be read while moving.
- The sweep is disabled under `prefers-reduced-motion` by the site-level rule in `site/src/styles.css`.
- The default `text-neutral-600/70` and `max-w-md` are opinions, not requirements. Override them.

# Attribution

Animated Shiny Text by Magic UI (https://magicui.design), MIT. The MIT notice is in [magic-ui-LICENSE.md](../magic-ui-LICENSE.md). Vendored unmodified from `@magicui/animated-shiny-text` on 2026-10-28. Keep the license notice if you copy it.
