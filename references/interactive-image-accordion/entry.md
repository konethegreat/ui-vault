---
id: interactive-image-accordion
title: Interactive Image Accordion
tier: reference
type: interaction
status: inspiration-only
stack: react, tailwind, typescript
tags: accordion, images, hover, landing, gallery, motion
source_url: https://21st.dev/@minhxthanh/components/interactive-image-accordion
source_author: Le Thanh
retrieved: 2026-10-30
license: unknown
rights: private-reference
published_source: false
demo: link
demo_url: https://21st.dev/@minhxthanh/components/interactive-image-accordion
---

# What it is

A landing section with five tall image panels in a row. The active panel is 400px wide and the rest are 60px spines with rotated titles. Hovering another panel widens it, so the row behaves like an accordion without any vertical collapse.

# Why it is interesting

- The interaction is one state value. Every panel reads whether it is the active index and the widths follow.
- Collapsed panels keep their titles as vertical spines, so the row still reads as navigation when only one image is open.
- A single 700ms width transition carries the whole effect, which keeps the implementation small.
- The composition pairs a quiet text column with a dense visual row, a common landing-page split.

# What to borrow

- Keep one active index and derive every panel's size from it.
- Use vertical labels on collapsed panels so no panel becomes anonymous.
- Pair the row with a short editorial column rather than a full page of copy.
- Keep the transition long enough to read as one movement, not a snap.

# Reuse risks

- The row starts on the last panel (`activeIndex` is 4), not the first. That surprises a reader arriving from the top.
- The panels are `div` elements with `cursor-pointer` but only an `onMouseEnter` handler. There is no click, focus, Enter, Space or arrow-key path, so keyboard and switch users cannot change the active panel.
- Nothing exposes the active state to assistive technology. There is no `aria-expanded`, no tab semantics and no live caption.
- Widths are fixed at 400px and 60px. Five panels plus gaps need about 656px, and the row sits in a half-width column, so it overflows into a horizontal scroll area on tablets and phones.
- Hover is the only trigger. On touch, a tap may fire hover without a deliberate selection, and nothing indicates which panel is open.
- The width transition animates layout on every pointer move between panels. On a large image set this can stutter.
- Images come from a remote CDN, with a remote SVG as the error fallback. There are no width or height attributes, no lazy loading and no offline fallback.
- The image `alt` repeats the visible title, so a screen reader hears each label twice if the card were focusable.
- White captions sit on a flat 40% black overlay. Bright images can push the contrast below 4.5:1.
- Rotated labels use `whitespace-nowrap`, so a long title runs past the top or bottom of a collapsed panel.
- There is no reduced-motion branch. The full 700ms width change runs even when motion is reduced.
- The palette is hardcoded to white and gray, so it does not follow a theme.
- The demo's "Contact Us" link points at `#contact`, but no element with that id exists.

# Provenance

Published by Le Thanh on 21st.dev. Retrieved 2026-10-30. The page's `SoftwareSourceCode` record names the author and records `no-license`, which this vault treats as `unknown`. No code is hosted here. Study the arrangement, then write an original implementation and credit Le Thanh as the inspiration.

# Demo

The original preview lives on the 21st.dev component page. It is not hosted here. The vault's original take is the live [Editorial Image Accordion](https://konethegreat.github.io/ui-vault/demos#demo-editorial-image-accordion).
