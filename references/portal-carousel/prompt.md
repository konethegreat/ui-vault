# Add Portal Carousel to a project

Source: Portal Carousel by Hyperiux (https://21st.dev/@hyperiux/components/portal-carousel), Free Core under MPL 2.0. The published source is `references/portal-carousel/PortalCarousel.tsx`.

Rights: permissive. You may copy or install this file, keep the MPL 2.0 notice and the Hyperiux credit, and state any changes you make to it. MPL 2.0 is file-level copyleft: your other files do not become MPL, but this file and its modifications stay MPL.

## Goal

Add a full-stage image carousel where a small preview follows the pointer and expands into the next image on click.

## Build steps

1. Copy `PortalCarousel.tsx` into the project and keep the notice at the top of the file.
2. Install GSAP: `npm install gsap`.
3. Render the component with at least two images:

   ```tsx
   <PortalCarousel
     images={[
       { src: first, alt: "First image", title: "First" },
       { src: second, alt: "Second image", title: "Second" },
     ]}
     label="Next"
   />
   ```

4. Give the stage a height. The component defaults to `h-screen`; inside a card or a section, pass an important height class such as `h-[min(70svh,640px)]!`.
5. Use images with the same aspect ratio. The stage crops with `object-cover`, so mixed ratios will crop differently at each step.
6. If you pass overlay children, remember the wrapper is `pointer-events-none`. Add `pointer-events-auto` to any link or button that must be clickable.
7. Keep the MPL notice and add a visible credit near the component: Portal Carousel by Hyperiux, MPL 2.0.

## Requirements

- At least two images or the control disappears.
- GSAP must be installed. There is no CSS-only fallback for the expansion.
- Alt text is optional but should be supplied for meaningful images; it reaches the live region.
- The preview is a real button. Do not replace it with a div, or keyboard access is lost.
- Reduced motion must stay supported: the source already fades instead of expanding.

## Do not

- Do not hotlink Hyperiux's demo photos from the R2 bucket. They are not covered by the component license.
- Do not remove the license header or the credit.
- Do not put interactive overlay content inside the stage without `pointer-events-auto`.
- Do not rely on the default `h-screen` inside a scrolled page section.
- Do not describe this as an original design. It is Hyperiux's component, hosted under MPL 2.0.

## Verify

- A click anywhere on the stage advances once. Clicking overlay links does not advance.
- Rapid clicks stack expansions without breaking the current index.
- Tab reaches the preview button and Enter advances.
- With reduced motion, the image cross-fades and the preview does not trail.
- On a touch device, the preview parks and tapping the stage advances.
- No layout shift when the images preload, and no horizontal overflow at 320px.

## Attribution

Portal Carousel by Hyperiux (https://21st.dev/@hyperiux/components/portal-carousel), MPL 2.0 (https://mozilla.org/MPL/2.0/). Built with Hyperiux Vault.
