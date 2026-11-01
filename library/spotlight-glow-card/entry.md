---
id: spotlight-glow-card
title: Spotlight Glow Card
tier: pattern
type: card
status: usable
stack: react, typescript, css
tags: card, spotlight, pointer, glow, border, focus, keyboard
source_author: Kone
retrieved: 2026-11-02
license: MIT
rights: own
published_source: true
files: SpotlightGlowCard.tsx, spotlight-glow-card.css
demo: live
demo_source: site/src/demos/SpotlightGlowCardDemo.tsx
inspired_by: Spotlight Card by Hossain Jahed
inspired_by_url: https://21st.dev/@jahed/components/spotlight-card
---

# What it is

A dark card with a warm light on its edge and face that follows the pointer. The border ring catches the light first, the surface takes a wider and weaker version of it, and the light fades out when the pointer leaves. Keyboard focus shows the same light at a fixed anchor.

# Why it exists

The Spotlight Card reference records no license, so its code cannot be hosted. This is an original implementation of the effect with three changes that matter in a real grid: one listener per card instead of one on the document, scoped CSS instead of an injected global style, and a visible resting state for touch and keyboard users.

# How it works

- The card writes the pointer position into `--spot-x` and `--spot-y` on pointer move. No React state changes, so the glow does not re-render.
- A `::before` pseudo-element paints a radial gradient clipped to a one pixel ring with `mask-composite: exclude`. That ring is the border light.
- A `::after` pseudo-element paints the same gradient wider and weaker across the face.
- `--spot-on` drives both opacities. Hover turns it on for fine pointers; focus-visible turns it on for the keyboard; coarse pointers get a low resting value.
- Tone is a data attribute that swaps `--spot-color`. Three tones ship: amber, rust and bone.
- `--spot-card-title-font` lets the host page decide the title face without the component importing a font.

# Notes

- The card is a focusable `article` with `aria-labelledby`, so the focus demo is reachable by tab. If your card is a link, render an anchor and keep the `:focus-visible` rules.
- `overflow: hidden` is required for the face light. The focus outline is drawn outside the border, so it is not clipped.
- The border ring relies on `mask-composite: exclude` and `-webkit-mask-composite: xor`. Test Safari before changing the mask layers.
- `--spot-x` and `--spot-y` are set inline by JS. A stylesheet rule cannot override them for the focus state after a mouse visit; the light still shows, just at the last pointer position.
- The glow carries no meaning. Text contrast must hold with the light off.
- Touch devices get a resting light because `hover: none` matches. Do not remove that branch, or the card looks inert on a phone.
- Reduced motion drops the fade, not the light.

# Demo

Three cards on a dark stage, one per tone. Move the pointer across them, then tab through them. The third card shows the bone tone and the touch resting state.

# Attribution

Original implementation, MIT. Inspired by Spotlight Card by Hossain Jahed (https://21st.dev/@jahed/components/spotlight-card), which records no license. No code or assets were copied.
