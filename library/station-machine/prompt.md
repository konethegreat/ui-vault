# Add Station Machine to a project

Source: Station Machine by Kone Tshivhinda, MIT, `library/station-machine/`.
Rights: own. Copy the files, keep the MIT attribution and the inspiration credit.

## Goal

Add a procedural three.js scene of five stations on a plate, with orbit, click-to-focus, labelled camera buttons, reduced-motion support and clean disposal.

## Use it when

- A page can afford one lazy three.js chunk and about 60svh of height.
- A product story benefits from a physical model rather than an illustration.
- The content can be described in text next to the canvas.

## Build steps

1. Copy `StationMachine.tsx` and `station-machine.css`.
2. Install `three` and `@types/three` (dev).
3. Render the component with a height override if the page needs one:

   ```tsx
   <StationMachine height="clamp(460px, 70vh, 700px)" />
   ```

4. Replace the station names and notes with the project's real content.
5. Keep the dynamic import of `three` inside the effect. A static import puts the whole library in the initial bundle.
6. Keep the HUD buttons. They are the accessible path to every station and camera view.
7. Keep the text fallback for WebGL2 and import failures.

## Requirements

- The canvas is `aria-hidden`; the heading, note and buttons carry all meaning.
- Selecting a station must update the HTML note, not only the camera.
- `OrbitControls` has panning and zoom off and a limited polar angle.
- Reduced motion renders a still frame, changes camera instantly, and renders on orbit change. A runtime change to the preference is handled.
- The loop pauses offscreen and when the tab is hidden.
- The device pixel ratio is capped at 2 and reapplied on resize. A lost WebGL context switches to the text fallback.
- Unmount disposes geometries, materials, controls and the renderer, and removes listeners.

## Do not

- Do not load models, textures or draco files for a scene that can be built from primitives.
- Do not remove the dynamic import without measuring the bundle.
- Do not leave the canvas as the only way to select a station.
- Do not copy the referenced project's code, scene layout or station names.
- Do not animate the camera when reduced motion is on.
- Do not remove the Evgeny Shilov inspiration credit.

## Verify

- three.js arrives as its own chunk after the component mounts.
- Dragging orbits; clicking a station focuses it; clicking empty space returns to the overview.
- Buttons work with keyboard only and `aria-pressed` follows the selection.
- Reduced motion renders one frame and does not run the animation loop.
- Scrolling the scene offscreen stops the loop; returning resumes it.
- Unmounting leaves no canvas, listeners or WebGL context behind.
- The scene has no horizontal overflow at 320px and its text stays readable at 390px.

## Attribution

Station Machine by Kone Tshivhinda, MIT. Inspired by Interactive 3D Machine by Evgeny Shilov (https://agentic-factory-3d.vercel.app), which records no license. No code, geometry or assets were copied.
