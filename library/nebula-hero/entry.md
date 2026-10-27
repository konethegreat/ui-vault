---
id: nebula-hero
title: Nebula Hero
tier: pattern
type: hero
status: usable
stack: react, webgl2, glsl, typescript, css
tags: shader, hero, nebula, reduced-motion, pointer
source_author: Kone
retrieved: 2026-10-28
license: MIT
rights: own
published_source: true
files: NebulaHero.tsx, nebula-hero.css
demo: live
demo_source: site/src/demos/NebulaDemo.tsx
inspired_by: Star Nest by Pablo Roman Andrioli, and the adaptation by Matthias Hurrle
inspired_by_url: https://www.shadertoy.com/view/XlfGRj
---

# What it is

A WebGL2 hero background made from layered value noise: a slow nebula with a warm core, faint stars and a vignette. Content sits over it with a readable scrim. All code is original and MIT.

# Why it exists

The vault referenced a rocket shader that is a Star Nest derivative under a non-commercial share-alike license, so it cannot be hosted in an MIT repository. This is a clean-room alternative that keeps the mood without borrowing the code.

# How it works

- One full-screen triangle, one fragment shader, three uniforms.
- Five octaves of value noise with a domain warp, drifting slowly on the GPU.
- A soft golden core from a radial falloff, plus a star layer from a hashed grid.
- Pointer position shifts the noise field by a few percent, smoothed each frame.
- Dithering removes banding on the dark gradient.
- The loop pauses offscreen and when the tab is hidden.
- With `prefers-reduced-motion`, it renders one static frame and never starts the loop.
- Without WebGL2, the CSS radial gradient remains and the content still works.

# Performance notes

- The device pixel ratio is capped at 2.
- The shader has no textures, no loops over particles and no per-frame allocations.
- The canvas is `aria-hidden`; all meaning lives in the HTML content.

# Attribution

The code is original, MIT. Visual direction is inspired by Star Nest by Pablo Roman Andrioli (https://www.shadertoy.com/view/XlfGRj) and the shader adaptation credited to Matthias Hurrle (@atzedent). No shader code was copied from either. Keep this credit if you adapt the look.
