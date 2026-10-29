# Build a circular navigation overlay

Build an original circular navigation overlay for a React and Tailwind project. Use this entry as a design brief, not as code: do not copy the Kaif UI source or any file from 21st.dev. The component documented in `references/circular-navigation-bar/entry.md` has no recorded license, so the implementation has to be yours. Credit Kaif UI as the inspiration.

## Use it when

- There are three to eight top-level destinations and a full-screen menu is acceptable.
- The menu is opened deliberately and closed after one choice.
- You can add a focus trap, scroll lock and Escape handling, or the surrounding framework already provides a dialog primitive.

Do not use it for a persistent header with dropdowns, for more than eight destinations, or for a menu that has to sit alongside page content.

## Build steps

1. Make the trigger a real button with `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. Keep the label visible.
2. Render the overlay in a portal at the end of `body`. Give it `role="dialog"`, `aria-modal="true"` and an accessible name such as "Main navigation".
3. On open, move focus to the close button. Trap Tab inside the dialog, close on Escape, and return focus to the trigger on close.
4. Lock page scroll while the overlay is open. Use `overflow: hidden` on the root and restore the previous value on close.
5. Size the disc from the viewport with a maximum around 420px. Measure it with `ResizeObserver`.
6. Derive the orbit radius instead of hardcoding it: half the disc minus half a target minus padding. Clamp the target to at least 44px and around 80px when there is room.
7. Place each destination with one angle: `360 / count * index`, starting at the top. Rotate the slot by the angle, translate by the radius, then rotate the content back by the same angle.
8. Fall back to a vertical list when the computed radius is too small, when there is one or two destinations, or when there are more than eight.
9. Give every target a visible `focus-visible` ring, an `aria-current="page"` state for the active destination, and a close button with an accessible name.
10. Animate opacity and a small scale over roughly 250ms. Skip the animation under `prefers-reduced-motion: reduce`.
11. Use `min-height: 100dvh` with a `100vh` fallback, plus safe-area padding.
12. Close on backdrop click, on Escape and on link activation. Stop propagation inside the disc so a click there does not dismiss the menu.

## Requirements

- Keyboard: Tab reaches every destination and the close button; Shift+Tab wraps; Escape closes; focus returns to the trigger.
- Screen readers: the dialog is announced, the trigger reports its expanded state, and the close button has a name.
- Motion: no scale or fade when reduced motion is requested.
- Layout: no target leaves the viewport at 320px, 390px, 768px or 1440px.
- Dependencies: Tailwind plus the project's existing icon set. Do not add `framer-motion` for this alone.

## Do not

- Do not copy the original component, its file names, class strings or markup. Write your own structure.
- Do not hardcode a 150px radius or a fixed 420px disc.
- Do not ship an icon-only close button without a label.
- Do not rely on hover for the only highlight state.
- Do not use `100vh` alone, leave the page scrollable behind the overlay, or omit the focus trap.
- Do not animate when the user prefers reduced motion.

## Verify

- Open with keyboard and pointer, tab through every item, close with Escape, and confirm focus returns to the trigger.
- Test at 320px, 390px, 768px and 1440px with five, seven and nine destinations.
- Check that the disc and every target stay inside the viewport and that the page cannot scroll behind it.
- Turn on reduced motion and confirm the menu appears without a scale transition.

## Attribution

Inspired by Circular Navigation Bar by Kaif UI (https://21st.dev/@kaif-ui/components/cicular-navigation-bar). No license was recorded, so this is an original implementation, not a port. Keep the credit line in the target project.
