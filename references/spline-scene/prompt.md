# Add Spline Scene to a project

Source: Spline Scene by Serafim (https://21st.dev/@serafimcloud/components/splite), MIT. The published wrapper is `references/spline-scene/SplineScene.tsx`.

Rights: permissive. Copy the wrapper, keep the MIT notice and the Serafim credit, and state any changes you make. The demo scene on the author's page is a separate asset and is not part of the license.

## Goal

Mount a Spline scene in React without putting the Spline runtime in the first bundle, and with a usable loading and failure state.

## Use it when

- The page needs one strong 3D moment, not a field of scenes.
- You have a scene you made in Spline and can use its public scene URL.
- The card around the scene can carry the copy, because the canvas is not accessible content.

## Build steps

1. Copy `SplineScene.tsx` and `LICENSE.md` into the project.
2. Install the runtime and the React binding:

   ```bash
   npm install @splinetool/react-spline @splinetool/runtime
   ```

3. Make or open your own scene in Spline, export it, and copy the public scene URL.
4. Give the wrapper a parent with a real height, then pass the URL:

   ```tsx
   <div className="relative h-[420px] w-full">
     <SplineScene scene={YOUR_SCENE_URL} className="h-full w-full" />
   </div>
   ```

5. Replace the `loader` span with your spinner and add its CSS. The published file assumes the class already has a style.
6. Wrap the scene in an error boundary. Suspense handles the lazy import, not a scene that fails to download.
7. If the card is below the fold, mount it when it scrolls into view. The runtime and the scene file are a heavy download.
8. Keep the headline and body copy outside the canvas so the section still reads without WebGL.

## Requirements

- The scene URL must be one you own or have written permission to embed.
- The host element must have a height at every breakpoint.
- The fallback must be visible and must not collapse the layout.
- The surrounding card must keep its text and links usable while the scene loads.
- On touch, a vertical swipe must still scroll the page.
- Next.js must render the wrapper on the client only.

## Do not

- Do not use the scene URL from the author's demo. It is not covered by the MIT component license.
- Do not hotlink a scene from another project without permission.
- Do not render the Spline canvas as the only content of a section. It has no accessible text.
- Do not mount several heavy scenes on one page.
- Do not remove the MIT notice or the Serafim credit.
- Do not rely on `Suspense` as an error boundary.

## Verify

- The card renders at 1440px and 390px with no layout shift when the canvas appears.
- The fallback shows on a throttled connection and the card keeps its height.
- Blocking the scene request shows the error state, not a blank card.
- A vertical swipe on a phone scrolls the page.
- Keyboard focus reaches every link and button around the scene.
- The Spline runtime is in a separate chunk, not the entry bundle.

## Attribution

Spline Scene by Serafim (https://21st.dev/@serafimcloud/components/splite), MIT. Copied with the notice kept. The scene used in the host project stays under its own terms.
