# Build a dark shader hero inspired by Animated Rocket Shader Hero

Source: shader derived from Star Nest by Pablo Roman Andrioli, adapted by Matthias Hurrle (@atzedent). The wrapper author is not recorded. License unknown.
Rights: private-reference. **Do not copy the source.** Write an original shader hero.

## Goal

Build a full-screen dark hero with a slow procedural light field behind the copy. The content must remain readable without WebGL2, and the motion must stop for people who ask for less.

## Use it when

- A landing page needs atmosphere without a hero image.
- The product is technical and a calm, dark first screen fits the tone.
- You can afford a WebGL2 canvas and can keep the copy in HTML.

## Build steps

1. Create a React component with one canvas fixed behind absolutely positioned hero content.
2. Write an original fragment shader. A good starting point is layered value noise or fbm with a slow drift and a soft warm core. Do not derive it from Star Nest or any Shadertoy shader.
3. Add a pointer uniform only if the shader actually uses it. Smoothed pointer influence of a few percent is enough.
4. Compile once, cache the program, and resize to the container with the device pixel ratio capped at 2. Do not multiply the ratio twice.
5. Render one static frame when `prefers-reduced-motion` matches. Pause the loop when the canvas is offscreen or the tab is hidden.
6. Put the copy in real HTML: badge, headline, subtitle, one primary and one secondary action. Keep the canvas `aria-hidden`.
7. Stagger the copy reveal at 0.2, 0.4, 0.6 and 0.8 seconds with opacity and translate, and remove it under reduced motion.
8. Provide a CSS gradient fallback for browsers without WebGL2.

## Requirements

- Text contrast stays above 4.5:1 against the darkest and brightest part of the canvas.
- No textures, no per-frame allocations and no more than one draw call.
- The shader is disposed and listeners removed on unmount.
- The hero does not block scroll or keyboard navigation.
- A visible focus ring on both actions.

## Do not

- Do not copy the source component, its shader, its markup or its class names.
- Do not use a Star Nest or Shadertoy derivative. Those carry their own licenses and this one is unknown.
- Do not ship a continuous animation without reduced-motion handling.
- Do not use dynamic Tailwind class names that the compiler cannot see.
- Do not put two default exports in one module.
- Do not claim the visual direction as entirely your own. Credit the inspiration.

## Verify

- The hero renders with WebGL2 disabled and the copy is still readable.
- Reduced motion produces a still frame and no entrance animation.
- The page does not scroll horizontally at 320px.
- The render loop stops when the hero scrolls out of view.

## Attribution

Inspired by Animated Rocket Shader Hero, whose shader derives from Star Nest by Pablo Roman Andrioli and the adaptation credited to Matthias Hurrle (@atzedent). License unknown. No source code was copied.
