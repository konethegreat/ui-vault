# Add Depth Zoom Parallax to a project

Source: Depth Zoom Parallax by Kone Tshivhinda, MIT, `library/depth-zoom-parallax/`.
Rights: own. Copy the files, keep the MIT attribution and the inspiration credit.

## Goal

Add a scroll-driven gallery where framed images fly past the camera at different depths while the stage stays fixed. The effect should stop for reduced motion and stay usable on a small screen.

## Use it when

- A page needs one memorable visual moment between sections.
- You have at least five images of the same square aspect ratio.
- The page can afford a tall scroll section, roughly 2.4 screens.

## Build steps

1. Copy `DepthZoomParallax.tsx` and `depth-zoom-parallax.css`.
2. Install `motion` and import the component with up to seven images:

   ```tsx
   <DepthZoomParallax
     images={[
       { src: hero, width: 900, height: 900 },
       { src: detail, width: 900, height: 900 },
     ]}
   />
   ```

3. Give every image the same aspect ratio. Mixed ratios break the composition.
4. Put the meaningful title and copy before or after the component in normal flow. The stage itself is decorative.
5. Keep the section height at `240vh` desktop and `200vh` under `700px`.
6. Keep the reduced-motion branch that renders the static grid.
7. If the parent frame clips content, it must allow sticky. Use `overflow: visible` on the wrapper, or `overflow: clip` if the browser support is acceptable, and test the scroll.

## Requirements

- `position: sticky` needs an ancestor chain without `overflow: hidden`, `auto` or `scroll`.
- The stage must use `100svh`, not `100vh`.
- The whole stage is `aria-hidden`; no meaning may live only in the images.
- All images are lazy except the first two.
- Scale ceilings stay at or below 9 unless the source images are much larger than 900px.
- Panel positions are percentages. Do not hardcode pixel positions.

## Do not

- Do not add more than seven panels and expect them to fit.
- Do not add scroll hijacking, smooth-scroll libraries or wheel interception.
- Do not remove the reduced-motion branch.
- Do not put `overflow-hidden` on the demo frame around the sticky stage.
- Do not claim the effect as an original idea. Keep the Efferd inspiration credit.

## Verify

- The stage stays pinned while the section scrolls, at 1440px and at 390px.
- Reduced motion shows a still grid and no scroll transforms.
- There is no horizontal overflow at 320px.
- With the tab hidden the transform loop does not keep the page busy.
- Images do not drag or show broken alt text.

## Attribution

Depth Zoom Parallax by Kone Tshivhinda, MIT. Visual direction inspired by Zoom Parallax by Efferd (https://21st.dev/@efferd/components/zoom-parallax). No code or assets were copied.
