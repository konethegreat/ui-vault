# Add Nebula Hero to a project

Source: Nebula Hero by Kone Tshivhinda, MIT, `library/nebula-hero/`.
Rights: own. Copy the files, keep the MIT attribution and the inspiration credit.

## Goal

Add a WebGL2 hero background made from layered value noise: a slow nebula with a warm core, faint stars and a vignette. Content sits over it with a readable scrim, and the page still works without WebGL2.

## Use it when

- A landing page needs atmosphere without a hero image or video.
- The copy is short and the page can afford one full-screen shader.
- You want a dark hero that stays calm and stops for reduced motion.

## Build steps

1. Copy `NebulaHero.tsx` and `nebula-hero.css` into the project.
2. Render the component with content props:

   ```tsx
   <NebulaHero
     eyebrow="UI Vault"
     headline="Interfaces with gravity."
     body="A short supporting line."
     primaryCta={{ label: "Browse the catalog", href: "#catalog" }}
     secondaryCta={{ label: "Read the code", href: "#source" }}
     height="min(88svh, 780px)"
   />
   ```

3. Replace the default CTAs and credit text with the project's real links.
4. Keep the pointer influence subtle. It shifts the noise field by a few percent.
5. Keep the reduced-motion branch that renders one static frame.
6. Keep the offscreen and visibility checks that pause the loop.
7. Keep the CSS radial gradient so the hero still has depth without WebGL2.

## Requirements

- The canvas is `aria-hidden` and all content lives in HTML.
- Text contrast stays above 4.5:1 over the brightest part of the shader.
- The device pixel ratio is capped at 2.
- There are no textures and no per-frame allocations.
- The shader is deleted and listeners removed on unmount.

## Do not

- Do not remove the reduced-motion branch or the visibility pause.
- Do not put long paragraphs over the busiest part of the shader.
- Do not remove the Star Nest and Matthias Hurrle inspiration credit from the component or the project.
- Do not present the shader as derived from their code. It is a clean-room implementation.

## Verify

- With WebGL2 blocked, the gradient and content still render.
- Reduced motion produces a still frame.
- The loop stops when the hero is offscreen.
- The hero has no horizontal overflow at 320px.

## Attribution

Nebula Hero by Kone Tshivhinda, MIT. Visual direction inspired by Star Nest by Pablo Roman Andrioli (https://www.shadertoy.com/view/XlfGRj) and the shader adaptation credited to Matthias Hurrle (@atzedent). No shader code was copied.
