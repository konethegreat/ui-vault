---
id: marquee
title: Marquee
tier: reference
type: motion
status: usable
stack: react, tailwind, css, typescript
tags: marquee, motion, layout, pause-on-hover
source_url: https://magicui.design/docs/components/marquee
source_author: Magic UI (magicuidesign)
retrieved: 2026-10-28
license: MIT
license_url: https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
rights: permissive
published_source: true
files: Marquee.tsx
demo: live
demo_source: site/src/demos/MarqueeDemo.tsx
---

# What it is

A horizontal or vertical marquee that duplicates its children and scrolls them with CSS keyframes. Duration and gap are CSS variables, and the animation can pause on hover.

# Behavior

- `repeat` controls how many copies of the children render. Four is the default.
- `reverse` flips direction. `vertical` stacks the copies instead of laying them in a row.
- `pauseOnHover` adds a group-hover rule that pauses the animation.
- Set `--duration` and `--gap` on the root to change speed and spacing.
- The keyframes live in the Tailwind theme, so the component needs no external stylesheet.

# Caveats

- Every copy is real DOM, so assistive technology reads the content once per copy. If the content carries meaning, hide the marquee with `aria-hidden="true"` and provide one static list for screen readers. The demo does this.
- The track is transformed, not scrolled, so keyboard users cannot pause it. Pause on hover is not a keyboard affordance. Keep decorative.
- Add a mask gradient at the edges if the track should fade out instead of cutting off.

# Attribution

Marquee by Magic UI (https://magicui.design), MIT. The MIT notice is in [magic-ui-LICENSE.md](../magic-ui-LICENSE.md). Vendored unmodified from `@magicui/marquee` on 2026-10-28. Keep the license notice if you copy it.
