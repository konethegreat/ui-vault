---
id: spotlight-card
title: Spotlight Card
tier: reference
type: card
status: inspiration-only
stack: react, typescript, css
tags: card, spotlight, pointer, glow, border, hover
source_url: https://21st.dev/@jahed/components/spotlight-card
source_author: Hossain Jahed
retrieved: 2026-11-02
license: unknown
rights: private-reference
published_source: false
demo: link
demo_url: https://21st.dev/@jahed/components/spotlight-card
---

# What it is

A card whose border and surface light up under the pointer. A soft radial glow follows the cursor across the edge, while the card face picks up a weaker tint in the same place. Several named glow colors and sizes are offered.

# Why it exists

Flat cards give no feedback about where the pointer sits. A spotlight that tracks the pointer turns the whole card into a hover target and gives a dark interface a sense of physical light. The effect is cheap to run because the pointer position only updates a few custom properties and the paint stays in CSS.

The published version records no license on its 21st.dev page, so it is listed here as a link-only reference. The code and demo are not hosted in this repository.

# How it works

At a high level, the component listens for pointer movement, writes the pointer position into custom properties on the card, and paints two radial gradients from those properties: a narrow one on the border and a broader one on the surface. A short transition smooths the entry and exit. Colors and radii come from a small lookup keyed by a tone name.

# Notes

- The original keeps its pointer listener on the document and injects a global style block. Both choices affect pages with many cards.
- A border glow needs a visible border or a masked pseudo-element. A card without one shows only the surface tint.
- Touch devices never hover. Decide what the resting state looks like before shipping.
- Without a keyboard equivalent, the effect is mouse-only. A focus-visible fallback is worth adding.
- Reduced motion should drop the transition, not the light.
- This repository does not host the source. Use the page link for the original.

# Demo

No live demo is hosted. The original preview is at https://21st.dev/@jahed/components/spotlight-card.

For the original implementation in this repository, see `library/spotlight-glow-card/`. It borrows the idea of a pointer-tracked warm light on a card edge and face, with no copied code.

# Attribution

Spotlight Card by Hossain Jahed (https://21st.dev/@jahed/components/spotlight-card). License not stated, so the code is treated as all rights reserved. Inspiration only.
