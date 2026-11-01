# Add a pointer-tracked spotlight card to a project

Source: Spotlight Card by Hossain Jahed (https://21st.dev/@jahed/components/spotlight-card). The page records no license.

Rights: private reference. Do not copy the original component, its demo code or its assets. The source is not hosted in this repository. Write an original implementation that credits Hossain Jahed as the inspiration.

## Goal

Build a card whose edge and face catch a soft light that follows the pointer, without a global listener or an injected style block.

## Use it when

- A dark interface needs a tactile hover state on a small set of important cards.
- The cards have room for a border, so the edge glow has something to sit on.
- The design can answer the touch and keyboard cases, not only the mouse.

## Build steps

1. Decide the resting state. A card that is invisible until hovered is a dead card on touch.
2. Add one pointer listener per card, not one on the document. Update two custom properties, such as `--spot-x` and `--spot-y`, in percentage or pixels.
3. Paint a radial gradient at that position on a pseudo-element or an inset overlay. Keep the paint inside the card so nothing leaks.
4. For the border, use a second gradient on a masked ring or a visible border with `border-image` style masking. The surface gradient alone is not an edge light.
5. Add a `focus-visible` state that places the light at a fixed point, so keyboard users see the same affordance.
6. Remove the transition under `prefers-reduced-motion`. Keep the light itself.
7. Reset the position on pointer leave with a short fade, not an instant cut.
8. Expose a small set of tones through a data attribute or a prop, each with its own color token.

## Requirements

- The listener is attached to the card element and removed on unmount.
- The light is made from CSS gradients, not a canvas or an animated image.
- Contrast of the card text must not depend on the glow. Keep body text readable in the resting state.
- Touch and keyboard must have a usable state.
- Scope the CSS to the component. Do not inject a global style tag.

## Do not

- Do not copy the original component, demo markup or glow map. They are unlicensed.
- Do not put a `pointermove` listener on `document` for a grid of cards.
- Do not animate layout properties. Move custom properties or background positions only.
- Do not hide the card content until hover.
- Do not claim the effect as an original idea. Credit Hossain Jahed.

## Verify

- The glow follows the pointer on the border and the face, at 1440px and at 390px.
- Tab focus shows the light without a pointer.
- Touch shows a stable resting card.
- Reduced motion removes the transition, not the highlight.
- No global style tag and no document-level pointer listener.
- Text contrast passes in both the resting and the lit state.

## Attribution

Inspired by Spotlight Card by Hossain Jahed (https://21st.dev/@jahed/components/spotlight-card). No code or assets copied. This repository's implementation is original and MIT licensed.
