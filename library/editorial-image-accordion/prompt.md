# Add Editorial Image Accordion to a project

Source: Editorial Image Accordion by Kone Tshivhinda, MIT, `library/editorial-image-accordion/`.
Rights: own. Copy the files, keep the MIT attribution and the inspiration credit.

## Goal

Add a horizontal image accordion that opens one panel at a time, with a readable caption, full keyboard support and a vertical layout on small screens.

## Use it when

- You need to show four to six images without a carousel.
- Each image needs a short title and description.
- The section can give the band about 28rem of height.

## Build steps

1. Copy `EditorialImageAccordion.tsx` and `editorial-image-accordion.css`.
2. Import the component and pass items with 900 square images:

   ```tsx
   <EditorialImageAccordion
     label="Studio work"
     items={[
       { src: one, title: "Layering", description: "Short caption.", width: 900, height: 900 },
       { src: two, title: "Light", description: "Short caption.", width: 900, height: 900 },
     ]}
   />
   ```

3. Keep `label` descriptive. It names the tab list.
4. Keep the caption panel. Without it the accordion has no accessible text for the images.
5. Keep widths as flex-grow ratios. Do not switch back to fixed pixel widths.
6. Keep the `699px` breakpoint vertical stack.

## Requirements

- Every tab is a real `button` with `role="tab"`, `aria-selected` and `aria-controls`.
- Only the active tab is in the tab order; arrow keys move selection and focus.
- Hover activation is gated on `pointerType === "mouse"`.
- The caption is one `role="tabpanel"` linked with `aria-labelledby`.
- Images have empty alt text and reserved dimensions.
- The scrim provides at least 4.5:1 contrast behind the labels.
- Transitions stop under `prefers-reduced-motion`.

## Do not

- Do not build the tabs from divs with `onClick` only.
- Do not activate panels on hover for touch or pen input.
- Do not hardcode panel widths that overflow a narrow column.
- Do not label the images with the same text twice in the alt and the caption.
- Do not remove the reduced-motion branch or the Le Thanh inspiration credit.

## Verify

- Tab to the list, then use Arrow keys, Home and End; focus and panel both move.
- Clicking, tapping and pressing Enter or Space select the panel.
- Hovering with a mouse selects; hovering with touch emulation does not.
- At 390px the panels stack and the active one is clearly taller.
- There is no horizontal overflow at 320px and no layout jump on load.
- The caption text stays readable over every image.

## Attribution

Editorial Image Accordion by Kone Tshivhinda, MIT. Visual direction inspired by Interactive Image Accordion by Le Thanh (https://21st.dev/@minhxthanh/components/interactive-image-accordion). No code or assets were copied.
