---
id: mascot-portfolio-hero
title: Mascot Portfolio Hero
tier: reference
type: hero
status: usable
stack: react, typescript, svg, css, container-queries
tags: hero, mascot, svg, pointer, portfolio, light-mode, character
source_url: https://21st.dev/@kedhareswer/components/mascot-portfolio-hero
source_author: Kedhareswer Naidu
retrieved: 2026-10-28
license: MIT
license_url: https://21st.dev/@kedhareswer/components/mascot-portfolio-hero
rights: permissive
published_source: true
files: MascotPortfolioHero.tsx, LICENSE.md
demo: live
demo_source: site/src/demos/MascotPortfolioDemo.tsx
---

# What it is

A one-screen portfolio hero built as a printed poster for the screen. A one-point-perspective room is generated in SVG, a four-line display headline fills the left, and an illustrated character stands at the right. The head follows the pointer with layered parallax, blinks on its own, and greets the visitor when clicked.

# Why it is in the vault

It is a complete MIT-licensed hero from 21st.dev by Kedhareswer Naidu, and it does something the other heroes here do not: it turns a static portfolio layout into a small performance without a canvas or a 3D engine. The published source is vendored unchanged, so the live demo is the real component and not a reconstruction.

# Techniques worth reusing

- The gaze is fake 3D. Every layer carries a different offset: body 4 units, head 10, beanie 13, blush 20, face 28, with the nose a further 10 inside the face. Features therefore travel further than the skull and the head reads as turning. The ears move the other way and foreshorten.
- The pointer loop writes transforms straight to SVG nodes with `setAttribute`. React state changes only on click, so the poster does not re-render at 60fps.
- `approach(cur, target, dt, rate)` eases with `exp(-rate * dt)`, which makes the motion frame-rate independent. The raw pointer direction is soft-saturated with `v / sqrt(1 + v * v)`, so the head slows near the edge instead of hitting a stop.
- Blinking is an envelope, not a timer. `blink(since)` dips the eye scale for 150ms, and a 20% chance schedules a double blink.
- The room is generated, not drawn. One function derives the back-wall grid, the rays out to the frame and five scaled depth rectangles, so the scene stretches to any hero size for free.
- The stage uses container queries (`cqw`, `cqh`, `container: mph / size`), so labels, rules and the illustration scale from one width instead of a stack of breakpoints.
- The `h1` keeps a readable `aria-label` while the decorative letters are `aria-hidden`. The character is a real `<button>` with a label, and the greeting bubble is `aria-live="polite"`.

# What was changed for this repository

Nothing inside the component. `MascotPortfolioHero.tsx` is the published file with the attachment section markers and the upstream `Demo` export removed. The demo wrapper only passes a definite height and minimum height, because the default `100svh` is meant for a full page.

The site self-hosts Archivo Black and Inter, the two families named in the component's display and sans stacks, so the poster renders as designed instead of falling back to Arial Black. Their OFL notices are served at `licenses/fonts.txt`.

# Reuse risks

- `height` must be a definite length. The stage is sized from `cqh`, so `height="100%"` collapses to zero unless every ancestor has a real height.
- The poster is designed for a 16:9 stage in landscape and for a tall portrait stage. Test the exact width and height you will ship, because extreme aspect ratios crowd the services row and the character.
- The seeking pill is inert unless you pass `href`, but it is still focusable. Treat it as a link only when it has a real destination.
- The component injects a `<style>` element per instance. Multiple posters duplicate the CSS; the SVG gradient and filter ids are scoped with `useId`, so they do not collide.
- The pointer listeners are global and the animation loop stays alive offscreen. An `IntersectionObserver` only skips the work, so a page with many copies still pays for the observers.
- The figure is decorative SVG. Keep essential copy in HTML, as the component does, and do not move the headline into the illustration.
- The file is about 830 lines of component, CSS and SVG. Split it into figure, room, poster and styles before adapting it to a larger system.
- Reduced motion stops the gaze, breathing and blinking, but the poster still needs to read as a static layout. Check that the resting pose holds the composition.

# Attribution

Mascot Portfolio Hero by Kedhareswer Naidu, licensed MIT, published on 21st.dev at https://21st.dev/@kedhareswer/components/mascot-portfolio-hero. The source and the MIT notice are vendored in this folder. The site serves the notice at `licenses/mascot-portfolio.txt`. If you copy it onward, keep the credit and the license notice.
