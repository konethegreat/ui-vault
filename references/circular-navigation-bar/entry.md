---
id: circular-navigation-bar
title: Circular Navigation Bar
tier: reference
type: nav
status: inspiration-only
stack: react, tailwind, framer-motion, lucide-react, typescript
tags: navigation, menu, radial, overlay, glassmorphism, motion, keyboard
source_url: https://21st.dev/@kaif-ui/components/cicular-navigation-bar
source_author: Kaif UI
retrieved: 2026-10-29
license: unknown
rights: private-reference
published_source: false
demo: link
demo_url: https://21st.dev/@kaif-ui/components/cicular-navigation-bar
---

# What it is

A full-screen navigation overlay that replaces a list with a circular dial. Up to seven destinations sit evenly around a translucent disc, each one an icon and a label inside a round target. A white circular button in the middle closes the overlay. The disc scales in from nothing while a dimmed backdrop covers the page. Hovering a destination fills it white and flips its icon and text to black.

# Why it is interesting

- A radial arrangement gives every destination equal weight and fits five to eight top-level areas without a hierarchy.
- Each slot is rotated into position and its content rotated back, so labels stay upright while the positions come from one angle.
- The glass rim is a single disc with an inset highlight instead of layered images, so it stays sharp at any size.
- The close control sits at the center, which is where the eye already is.
- The backdrop and every link close the menu, while the disc stops propagation so a click inside does not dismiss it.

# What to borrow

- Compute the angle as 360 divided by the item count, rotate the slot into place, then counter-rotate the content.
- Give every destination a round target with an icon above a short label, around 80px across.
- Use one translucent disc as the entire menu surface and let a dim backdrop carry the contrast.
- Keep a center close control that never moves, whatever the item count.
- Keep the entrance short: opacity plus a small scale, then stop.

# Reuse risks

- The dial is fixed at 420px with a 150px orbit radius and 80px targets. On a 320px screen the disc shrinks below the orbit and targets leave the viewport. Measure the disc and derive the radius, or switch to a list at small widths.
- The wrapper caps with `max-w-screen`, a breakpoint token rather than a width limit. It does not guarantee the disc fits the viewport.
- There are no dialog semantics. The overlay has no `role="dialog"`, no `aria-modal`, no accessible name and no focus trap. Focus is neither moved into the menu nor restored to the trigger.
- The trigger does not expose `aria-expanded`, `aria-controls` or `aria-haspopup`, so assistive technology cannot tell that a menu opened.
- The close button is icon only and has no accessible name.
- Escape does not close the overlay. Only pointer clicks and link activation do.
- The page behind the overlay keeps scrolling and stays in the tab order. Keyboard users can tab past the menu into obscured content.
- Hover is the only highlight state. Keyboard focus has no visible treatment, and the label resets text decoration inline.
- The exit transition is declared but the overlay is conditionally rendered without `AnimatePresence`, so it never plays.
- The overlay is 100vh tall. Mobile browser chrome can cover the lower part of the dial. Use 100dvh with a vh fallback and respect safe-area insets.
- There is no reduced-motion branch, so the scale entrance runs even when the user asks for less motion.
- The source assumes `next/link` and a design-system Button. In a Vite app, swap in anchors or the router link and a plain button.
- `framer-motion` is pulled in for one transform. A CSS transition can do the same work.
- Long labels wrap badly inside 80px circles. Keep names to one or two short words.
- Nothing marks the current destination as active.
- The z-index values of 9000 and 10000 are arbitrary and can collide with other overlays.
- The source page records no license. The original code is not in this repository. Do not copy it.

# Provenance

Published by Kaif UI on 21st.dev as "Cicular Navigation Bar", the page's own spelling. Retrieved 2026-10-29. The page's `SoftwareSourceCode` record names the author but carries no license field, and the 21st.dev terms forbid redistributing marketplace content. The stricter reading wins: `published_source` is false, no code is hosted here, and the entry links to the original. Study the arrangement, then write an original implementation and credit Kaif UI as the inspiration.

# Demo

The original preview lives on the 21st.dev component page. It is not hosted here.
