# Add Spotlight Glow Card to a project

Source: Spotlight Glow Card by Kone Tshivhinda, MIT, `library/spotlight-glow-card/`.
Rights: own. Copy the files, keep the MIT attribution and the inspiration credit.

## Goal

Add a dark card whose border and face catch a pointer-tracked light, with a keyboard focus state and a usable resting state on touch.

## Use it when

- The interface is dark or has a dark section where a warm light reads well.
- The cards are important enough to deserve a hover detail, but not so many that a pointer listener per card is a cost.
- You can support a focus state for keyboard users.

## Build steps

1. Copy `SpotlightGlowCard.tsx` and `spotlight-glow-card.css`.
2. Import the component and give each card a tone:

   ```tsx
   <SpotlightGlowCard
     eyebrow="01 / Pointer"
     title="Follow the light"
     description="The edge catches the pointer first, then the face."
     tone="amber"
     meta="CSS only"
   />
   ```

3. Keep the import of the CSS file beside the component. The class names are scoped with `spotlight-`.
4. Set `--spot-card-title-font` on a parent if the host has a display face, for example with a CSS variable. Leave it unset to inherit.
5. Pick tones by setting `data-tone`, or add your own block that only changes `--spot-color`.
6. If the card becomes a link, render an `a` instead of the article and keep the focus-visible rules. Do not nest a link inside the focusable article.
7. Keep the coarse-pointer branch that gives touch a resting light.

## Requirements

- The pointer listener stays on the card element and is removed with the component.
- The surface color and text color are component variables, so the card can move between sections.
- The border light uses the masked ring, not a box shadow, so it can follow the pointer around the edge.
- Focus-visible must show the light without a pointer.
- The glow is decorative. Text must be readable with it off.
- Do not animate layout. Only custom properties and opacity change.

## Do not

- Do not attach a `pointermove` listener to `document`.
- Do not inject a `<style>` tag from the component.
- Do not put the light behind the text without a solid surface under the text.
- Do not remove `overflow: hidden`; the face light will bleed past the radius.
- Do not rely on hover alone. Touch and keyboard must both show a state.
- Do not present the effect as an original idea. Keep the Hossain Jahed inspiration credit.

## Verify

- The border and face light follow the pointer at 1440px and 390px.
- Tab shows the outline and the light on every card.
- A touch emulation shows the resting light.
- Reduced motion removes the fade, not the highlight.
- No document-level pointer listener and no global style tag.
- Text contrast holds with the light off and on.

## Attribution

Spotlight Glow Card by Kone Tshivhinda, MIT. Inspired by Spotlight Card by Hossain Jahed (https://21st.dev/@jahed/components/spotlight-card). No code or assets were copied.
