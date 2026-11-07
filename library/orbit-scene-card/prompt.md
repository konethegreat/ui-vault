# Add Orbit Scene Card to a project

Source: Orbit Scene Card by Kone Tshivhinda, MIT, `library/orbit-scene-card/`.
Rights: own. Copy the files, keep the MIT attribution and the inspiration credit.

## Goal

Add a dark card with copy on one side and an interactive three.js orbit on the other, without a model file, a borrowed scene or three.js in the first bundle.

## Use it when

- A dark section needs one 3D moment next to a headline.
- The project already uses React and can accept three.js as a separate chunk.
- The card can carry the message in text, because the canvas is decorative.

## Build steps

1. Copy `OrbitSceneCard.tsx` and `orbit-scene-card.css`.
2. Install three.js:

   ```bash
   npm install three
   npm install -D @types/three
   ```

3. Import the component and pass a height:

   ```tsx
   <OrbitSceneCard height="clamp(440px, 64vh, 600px)" headingLevel="h2" />
   ```

4. Put the card on a dark background, or let the card provide its own. The component sets `#0b0b09` and the copy colours.
5. Replace the title, body and the three chips in `orbit-card__meta`.
6. Keep the dynamic `import("three")` inside the effect. A top-level import puts the whole library in the entry bundle.
7. Keep the pointer listener on the card. Do not move it to `document`.
8. Keep the cleanup block. It disposes the geometries, the materials, the observers and the WebGL context.

## Requirements

- The canvas stays `aria-hidden` and the copy stays outside it.
- The canvas keeps `pointer-events: none`; the card is the pointer target.
- `prefers-reduced-motion` renders one frame and stops the loop.
- The loop pauses offscreen and when the tab is hidden.
- WebGL failure shows a readable fallback, not a blank half card.
- Touch does not get pointer parallax, and vertical scrolling still works.
- The card has a height on desktop and a minimum height when it stacks on mobile.

## Do not

- Do not import three.js at the top of the file.
- Do not mount several cards on one page. One scene per page is the budget.
- Do not put essential text inside the canvas or remove the copy.
- Do not attach the pointer listener to `document`, and do not keep it after unmount.
- Do not remove `overflow: hidden`; the rings and the CSS wash will bleed past the radius.
- Do not raise the point light until the flat-shaded core turns into a white blob.
- Do not present the scene as a Spline scene. It is an original three.js scene. Keep the Serafim credit as inspiration.

## Verify

- The card renders at 1440px and 390px with no horizontal overflow.
- Moving the pointer leans the scene, and leaving the card returns it to rest.
- Scrolling the card out of view stops the animation loop.
- Reduced motion shows a still scene and the pointer has no effect.
- Blocking WebGL shows the fallback text and the copy stays readable.
- The three.js chunk loads only when the card mounts.
- Keyboard focus never lands on the canvas.

## Attribution

Orbit Scene Card by Kone Tshivhinda, MIT. Inspired by Spline Scene by Serafim (https://21st.dev/@serafimcloud/components/splite). No Spline runtime, component code or scene asset was used.
