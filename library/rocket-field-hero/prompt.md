# Build a rocket field hero from the published source

Use this prompt with the files in this folder. They are original, MIT licensed work by Kone Tshivhinda. You may copy or adapt them, keep the credit line and the link to the inspiration, and this prompt remains accurate only while the published files stay unchanged.

```
Implement a full-bleed dark hero with a live canvas scene.

Copy RocketFieldHero.tsx and rocket-field-hero.css from ui-vault unchanged, or adapt them with the same structure:
- a section with a minimum height from a CSS variable
- a canvas at z-index 0 with aria-hidden true
- a scrim layer and real HTML content above it
- an h1 or h2 that you choose with the headingLevel prop

Requirements:
1. Draw three depth layers of stars on a 2D canvas. Use per-star depth, size, twinkle phase and a warm tint on a small share of stars.
2. Launch rockets every few seconds from a horizon near the bottom. Each rocket needs an eased rise, a slight sideways arc and a tapering trail that fades toward the tail. Cap the number in flight.
3. Keep the canvas decorative. Put the headline, body, actions and credit in HTML. Give the canvas aria-hidden.
4. With prefers-reduced-motion: reduce, render one still frame with frozen trails and never start the loop. Handle a change to the preference at runtime.
5. Stop the loop when the section is off screen or the tab is hidden. Restart when it returns.
6. Cap the device pixel ratio at 2 and reset the canvas transform and cached gradients inside the resize handler.
7. Clicking the sky may launch an extra rocket, but ignore clicks that land on a link, button or form control.
8. Add a two-axis gradient scrim behind the copy. Check contrast on a narrow viewport.

Do not copy shader code or scene assets from the Animated Rocket Shader Hero or from Star Nest. The visual direction is inspired by those works; reimplement the idea with original code.

Keep this credit in the target project:
Adapted from Rocket Field Hero by Kone Tshivhinda (https://github.com/konethegreat/ui-vault), MIT. Visual direction inspired by the Animated Rocket Shader Hero, shader by Matthias Hurrle (@atzedent), and Star Nest by Pablo Roman Andrioli.

Verify:
- the hero still reads with JavaScript disabled and shows its CSS glow
- no scroll position jumps when rockets launch
- the trail does not leave a smear on resize
- the animation does not run while the hero is off screen
```
