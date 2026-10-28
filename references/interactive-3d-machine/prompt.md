# Build an interactive 3D product machine inspired by Interactive 3D Machine

Source: Interactive 3D Machine by Evgeny Shilov (https://agentic-factory-3d.vercel.app), license unknown.
Rights: private-reference. **Do not copy the source.** Read the public descriptions and write an original scene.

## Goal

Build a React and three.js section where one product is presented as a physical machine with five named stations. The user can orbit the machine, hover and click a station, switch between four levels of detail, and jump between camera presets. The scene must explain the product, not just decorate the page.

## Use it when

- A product has a sequence of five or fewer stages that people keep confusing.
- A static diagram is not enough and a video would be too passive.
- You can afford the three.js bundle and can keep the rest of the page light.

## Build steps

1. Choose the five station names and the one-sentence job of each. Write them down before touching three.js.
2. Scaffold a React component with `react` and `three`. Keep the scene in one module, the controls in another, and the HTML chrome in the component. Do not put the whole thing in one 2,000 line file.
3. Build the machine from primitives: a base plate, five station bodies, connectors, and a few moving parts. Use one environment map for reflections. No downloaded models or images.
4. Add four modes: assembled, cutaway, stations, one order. Each mode changes what is visible and what the camera emphasizes.
5. Add five camera presets: overview, side, top, station and flight. Animate between them with a damped position and target, not a cut.
6. Add raycasting for hover and click. Change the cursor on hover and focus the clicked station. Show the station name in real HTML next to the canvas.
7. Expose a small control object from the component: `setMode`, `setCamera`, `focusStation`, `play`, `pause`. Return it from a ref or an `onReady` callback. Do not attach it to `window`.
8. Add a reduced-motion path that renders a still frame and disables camera flights.
9. Pause rendering when the canvas leaves the viewport or the tab is hidden. Resume on return.

## Requirements

- Canvas has an `aria-label` naming the five stations and the available interactions.
- Every mode and camera control is a real button with `aria-pressed` and a visible focus ring.
- Station names and descriptions exist in HTML, not only in the canvas texture.
- The scene does not trap page scroll. Wheel zoom is disabled unless the user is interacting with the canvas.
- On coarse pointers, allow orbiting or provide explicit rotate buttons. Do not silently disable all rotation.
- Dispose geometries, materials, textures, the environment, the renderer, controls, listeners and observers on unmount.
- Cap the pixel ratio at 2 and keep the machine under roughly 150k triangles.

## Do not

- Do not copy the source, its geometry, its station names or its layout.
- Do not ship a continuously rendering canvas with no visibility check.
- Do not make the canvas the only place where meaning lives.
- Do not use a global `window` object for control.
- Do not claim the original design as yours.

## Verify

- `prefers-reduced-motion: reduce` shows a still frame and no camera flight.
- Keyboard users can reach every control and read every station name.
- The tab stays near 60fps on a mid-range laptop and does not keep rendering after scrolling away.
- On a phone, the page scrolls normally and the machine remains explorable.

## Attribution

Inspired by Interactive 3D Machine by Evgeny Shilov (https://agentic-factory-3d.vercel.app), license unknown. No source code was copied.
