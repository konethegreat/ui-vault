# Build a zoom parallax scene from scratch

Do not copy the source of Zoom Parallax by Efferd. The 21st.dev page records no license for that component, so this entry is inspiration only. Write an original scene and credit Efferd in a comment or credits line.

## What to build

A sticky full-viewport stage with five to seven image panels. One scroll progress value drives a different scale ceiling for each panel, between roughly 3x and 8x, so the collage appears to move through depth. The stage should hold for at least two viewport heights, then release into the next section.

## Requirements

- Use one scroll listener or one `useScroll` target for the whole scene. Do not attach a listener per panel.
- Keep the stage inside a section that is tall enough to scroll, and make sure no ancestor uses overflow clipping.
- Size the panels in percentages of the stage, not in viewport units alone. Write a small-screen composition that hides two or three panels instead of shrinking all seven into slivers.
- Supply images at least twice the rendered panel size, or reveal them with `clip-path` rather than upscaling raster pixels.
- Add width and height attributes, decode asynchronously, and load the first two panels eagerly and the rest lazily.
- Detect `prefers-reduced-motion` and render a static collage without transforms. Do not leave a tall empty scroll region in that mode.
- Use empty alt text on the panels if the scene is decorative, and mark the stage `aria-hidden`. Keep any real copy in HTML outside the stage.
- Use `svh` or `dvh` for the sticky stage height so mobile browser chrome does not cover it.
- If you add smooth scrolling, stop its animation frame and destroy the instance on unmount.

## Pitfalls

A single scroll progress value works only while the section is on screen. If an anchor link lands in the middle of the section, the progress starts partly through the zoom. Decide whether that is acceptable or reset the progress on entry. Avoid Lenis and similar libraries unless the page already uses them; they can fight the browser's native scrolling and accessibility.

Credit: inspired by Zoom Parallax by Efferd, published on 21st.dev. No code or images were copied.
