---
id: rocket-field-hero
title: Rocket Field Hero
tier: pattern
type: hero
status: usable
stack: react, canvas, typescript, css
tags: hero, canvas, rocket, stars, pointer, reduced-motion
source_author: Kone
retrieved: 2026-10-30
license: MIT
rights: own
published_source: true
files: RocketFieldHero.tsx, rocket-field-hero.css
demo: live
demo_source: site/src/demos/RocketFieldHeroDemo.tsx
inspired_by: Animated Rocket Shader Hero, shader by Matthias Hurrle
inspired_by_url: https://www.shadertoy.com/user/atzedent
---

# What it is

A full-bleed dark hero drawn on a 2D canvas. Three depths of stars drift behind a low horizon, small rockets climb from the line with tapering amber trails, and the pointer shifts the field by a few pixels. The headline, buttons and launch counter sit in HTML above the canvas.

# Why it exists

The vault references an Animated Rocket Shader Hero whose shader is a Star Nest derivative under non-commercial, share-alike terms. That source cannot be hosted in an MIT repository. This is an original scene that keeps the rocket mood without borrowing the shader, the wrapper or any asset.

# How it works

- One canvas, one animation loop, no images and no WebGL.
- 170 stars with per-star depth, size, twinkle phase and a warm tint on every ninth star.
- Rockets launch every 1.6 to 3.4 seconds, up to five in flight. Each one has an eased vertical path, a small sideways arc and a 16 segment trail with width and alpha falling toward the tail.
- A horizon line at 88 percent height uses a cached linear gradient. A radial glow behind it comes from CSS.
- Pointer movement feeds a smoothed offset that moves stars by depth. The effect is subtle and never moves the content.
- Clicking the sky launches one extra rocket, unless the click lands on a link or button.
- The launch counter is text in HTML, so it is readable and does not depend on canvas pixels.

# Behaviour

- `prefers-reduced-motion: reduce` draws one frame with three frozen trails, counts zero launches and never starts the loop. A runtime change to the preference is handled.
- The loop stops when the hero leaves the viewport and when the tab is hidden, and restarts when it returns.
- The device pixel ratio is capped at 2. Resize is handled with a ResizeObserver and the context transform is reset on every resize.

# Accessibility

- The canvas is `aria-hidden`. All copy, actions and credits are real HTML.
- The click-to-launch gesture is decorative, so no keyboard equivalent is required.
- The content sits over a two-axis scrim, and the veil is stronger under 700px where the headline is larger relative to the frame.
- Heading level is configurable, so the hero can be the page `h1` or an `h2` inside a longer page.

# Attribution

The code and scene are original, MIT. Visual direction is inspired by the Animated Rocket Shader Hero referenced in this vault, whose shader header credits Matthias Hurrle (@atzedent) and derives from Star Nest by Pablo Roman Andrioli. No shader code, wrapper code, scene or preview asset was copied. Keep this credit if you adapt the scene.
