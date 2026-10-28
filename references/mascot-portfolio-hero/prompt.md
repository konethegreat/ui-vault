# Add Mascot Portfolio Hero to a project

Source: Mascot Portfolio Hero by Kedhareswer Naidu, https://21st.dev/@kedhareswer/components/mascot-portfolio-hero, MIT.
Rights: permissive. You may copy the published file and must keep the visible credit.

## Goal

Build a portfolio hero where a printed poster layout, a generated one-point room and an illustrated character share one screen. The character follows the pointer with layered parallax, blinks, and greets the visitor when clicked.

## Use it when

- A portfolio or studio page can carry a large illustrated character.
- The page has one screen of copy and does not need a scroll to explain itself.
- You can test both a wide desktop frame and a tall phone frame before shipping.

## Build steps

1. Copy `MascotPortfolioHero.tsx` from the vault entry, or install it from the 21st.dev page. Keep the MIT notice and the visible credit.
2. Pass a definite `height` and `minHeight`, for example `height="clamp(560px, 80svh, 780px)"`. Never pass `height="100%"`.
3. Self-host Archivo Black and Inter, or accept the fallback to Arial Black and the system sans. The component names both families in its CSS stacks.
4. Pass `href` on the seeking pill only when it has a real destination. Otherwise leave it out and treat the pill as poster copy.
5. Keep the `aria-label` on the `h1` and the label on the character button. The visible headline letters are decorative and hidden from assistive technology.
6. Test the landscape and portrait layouts at the sizes you will ship. The room and poster depend on container width and height, not on the viewport alone.
7. Keep the pointer loop writing to SVG nodes. Moving the gaze into React state would re-render the poster on every pointer move.

## Requirements

- The hero fits inside its container at both 16:9 and tall portrait shapes.
- The character remains a keyboard-reachable button and the greeting bubble stays polite live text.
- Reduced motion stops the gaze, breathing and blinking while leaving the poster readable.
- The headline is real HTML text, not SVG, and the character illustration has no essential copy inside it.
- The seeking pill is either a real link or non-interactive copy, never a focusable dead control.
- The two display fonts are served from the same origin as the page.

## Do not

- Do not remove the author credit or the MIT notice. The license requires the notice, and this vault requires the credit.
- Do not pass a percentage height. The stage is sized from container height and will collapse.
- Do not put essential copy inside the SVG figure or the decorative room.
- Do not present the component or the character design as your own work.
- Do not add a second copy of the component without checking the duplicated style tag and the global pointer listener.

## Verify

- At a wide desktop size, the headline, services row, seeking pill and character are all visible and do not overlap.
- At a phone size around 390px wide, the portrait layout shows the headline, pill, services and character without horizontal scrolling.
- Moving the pointer turns the head and the eyes follow further than the skull.
- Clicking the character changes the greeting and wiggles the beanie tag.
- Reduced motion leaves a calm poster with no blinking or idle gaze.
- The page has no console errors and the two fonts load from the site origin.

## Attribution

Mascot Portfolio Hero by Kedhareswer Naidu, MIT, published at https://21st.dev/@kedhareswer/components/mascot-portfolio-hero. Keep the credit and the license notice.
