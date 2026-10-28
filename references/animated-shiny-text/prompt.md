# Add Animated Shiny Text to a project

Source: Animated Shiny Text by Magic UI, https://magicui.design/docs/components/animated-shiny-text, MIT.
Rights: permissive. You may copy the published file and keep the credit.

## Goal

Use one line of text with a slow highlight sweep to signal that something is new. The effect should read as an occasional glint, not a loading state.

## Use it when

- A short release note, status line or announcement needs a little life.
- The line is decorative or secondary, not a control label.
- The surface is clearly light or clearly dark, because the gradient uses black and white stops.

## Build steps

1. Install with `npx shadcn@latest add @magicui/animated-shiny-text`, or copy `AnimatedShinyText.tsx` from the vault entry and keep the MIT notice.
2. Render a single `span`. Pass size, weight and color through `className`.
3. Set `shimmerWidth` between 80 and 140 pixels for a short line. Wider values suit longer text.
4. Keep the default keyframes. They rest for most of the cycle, which is what makes the sweep feel occasional.
5. Add the site-level reduced-motion rule that sets `animation: none` on `.animate-shiny-text`.

## Requirements

- The text is readable at the moment the highlight passes underneath it.
- The line does not wrap in the middle of the effect on small screens. Shorten the copy instead.
- The animation is purely decorative. Set `aria-hidden` when the same message already exists in nearby text.

## Do not

- Do not use it for a button label, form label, error message or anything that must be read while moving.
- Do not run several shiny lines at once. One per view is the point.
- Do not rely on the default `max-w-md` or neutral color. Set them for your surface.
- Do not remove the Magic UI credit or the MIT notice.

## Verify

- Reduced motion shows static text.
- The sweep does not cause a layout shift.
- The line is legible at 320px and at 1440px.

## Attribution

Animated Shiny Text by Magic UI (https://magicui.design), MIT. Keep the MIT notice if you copy it.
