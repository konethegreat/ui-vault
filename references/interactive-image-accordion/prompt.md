# Build an accessible image accordion from scratch

Do not copy the source of Interactive Image Accordion by Le Thanh. The 21st.dev page records `no-license`, so this entry is inspiration only. Write an original component and credit Le Thanh as the inspiration.

## What to build

A row of three to six image panels where one panel is open and the others collapse to labelled spines. Activating a panel expands it, and its caption becomes readable. On small screens the row becomes a vertical stack.

## Requirements

- Render each panel as a real `<button>`, not a `div` with a pointer handler.
- Support click, tap, Enter and Space. Support ArrowLeft, ArrowRight, Home and End for moving between panels, with focus following the selection.
- Use a tab pattern or `aria-expanded` with `aria-controls` so assistive technology knows which panel is open, and keep the caption in real text.
- Use one active index in state. Derive sizes from it; do not store five booleans.
- Size panels with flex-grow or grid tracks that fit the container. Never combine fixed 400px and 60px widths with a half-width column.
- Below roughly 700px, switch to a vertical accordion with a fixed open height. Do not leave a horizontally scrolling row on a phone.
- Add a dark gradient behind the caption, not a flat 40% overlay, and check contrast on the brightest image.
- Give images width and height attributes, load the first eagerly and the rest lazily, and supply a local fallback rather than a remote one.
- Use decorative empty alt text when the visible title already names the panel.
- Detect `prefers-reduced-motion` and remove the size transition.
- Do not change the active panel on hover unless the pointer is fine and hovering is a bonus, not the only path.

## Pitfalls

Animating `flex-grow` or `height` still triggers layout. Keep the panel count low, avoid box shadows on the moving edge and test on a mid-range phone. If you animate transforms instead, the images need to be cropped to a fixed frame or they will distort. Keep collapsed titles short; a long word cannot fit a 60px spine even when rotated.

Credit: inspired by Interactive Image Accordion by Le Thanh, published on 21st.dev. No code or images were copied.
