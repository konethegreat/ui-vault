# Add Interactive Robot Card to a project

Source: Interactive Robot Card by Kone Tshivhinda, MIT, `library/interactive-robot-card/`.
Rights: own. Copy the files, keep the MIT attribution and the inspiration credit.

## Goal

Add a dark card with copy on one side and an original three.js robot on the other. The robot turns toward the pointer, without a model file, a skeleton or three.js in the first bundle.

## Use it when

- A dark section needs one 3D character next to a headline.
- You want pointer-aware motion without animation clips or a Spline dependency.
- The card can carry the message in text, because the canvas is decorative.

## Build steps

1. Copy `InteractiveRobotCard.tsx` and `interactive-robot-card.css`.
2. Install three.js:

   ```bash
   npm install three
   npm install -D @types/three
   ```

3. Import the component and pass a height:

   ```tsx
   <InteractiveRobotCard height="clamp(460px, 66vh, 620px)" headingLevel="h2" />
   ```

4. Put the card on a dark background, or let the card provide its own. The component sets `#0b0b09` and the copy colours.
5. Replace the title, body and the three chips in `robot-card__meta`.
6. Keep the dynamic `import("three")` inside the effect. A top-level import puts the whole library in the entry bundle.
7. Keep the pointer listener on the card. Do not move it to `document`.
8. Keep the cleanup block. It disposes the geometries, the materials, the observers and the WebGL context.

## Requirements

- The canvas stays `aria-hidden` and the copy stays outside it.
- The canvas keeps `pointer-events: none`; the card is the pointer target.
- The head yaw and pitch stay within the pointer range, and the lenses move inside the visor.
- `prefers-reduced-motion` renders one frame, resets the pose and stops the loop.
- The loop pauses offscreen and when the tab is hidden.
- WebGL failure shows a readable status line and the copy stays readable.
- Touch does not get gaze tracking, and vertical scrolling still works.
- The card has a height on desktop and a minimum height when it stacks on mobile.

## Do not

- Do not import three.js at the top of the file.
- Do not mount several cards on one page. One scene per page is the budget.
- Do not put essential text inside the canvas or remove the copy.
- Do not attach the pointer listener to `document`, and do not keep it after unmount.
- Do not swap the lens material for a lit one without an emissive colour; the eyes will go dark.
- Do not widen the pointer mapping without clamping the head angles.
- Do not present the robot as the Spline demo character. It is an original three.js model. Keep the Serafim credit as inspiration.

## Verify

- The card renders at 1440px and 390px with no horizontal overflow.
- Moving the pointer turns the head and shifts both lenses, and leaving the card returns the robot to rest.
- Scrolling the card out of view stops the animation loop.
- Reduced motion shows a still robot and the pointer has no effect.
- Blocking WebGL shows the fallback line and the copy stays readable.
- The three.js chunk loads only when the card mounts.
- Keyboard focus never lands on the canvas.

## Attribution

Interactive Robot Card by Kone Tshivhinda, MIT. Inspired by Spline Scene by Serafim (https://21st.dev/@serafimcloud/components/splite). No Spline runtime, component code, scene asset or character model was used.
