# Add Marquee to a project

Source: Marquee by Magic UI, https://magicui.design/docs/components/marquee, MIT.
Rights: permissive. You may copy the published file and keep the credit.

## Goal

Create a continuous horizontal or vertical strip of cards, labels or logos driven by CSS keyframes, with no JavaScript animation loop.

## Use it when

- A row of principles, logos, testimonials or tags should feel alive.
- The content is decorative or already repeated elsewhere.
- You can keep the motion calm and slow.

## Build steps

1. Install with `npx shadcn@latest add @magicui/marquee`, or copy `Marquee.tsx` from the vault entry and keep the MIT notice.
2. Set `--duration` and `--gap` on the root with arbitrary properties, for example `[--duration:38s] [--gap:1rem]`.
3. Set `repeat` to the number of copies needed to fill the widest viewport. Four is the default.
4. Use `pauseOnHover` for decorative strips, but do not rely on it for keyboard access.
5. Add an edge mask with `[mask-image:linear-gradient(...)]` so items fade rather than cut off.
6. Provide a static, screen-reader-only list of the same content and mark the marquee `aria-hidden`.
7. Keep the Tailwind keyframes for `marquee` and `marquee-vertical` in the theme, and stop them under reduced motion.

## Requirements

- The strip does not cause horizontal page overflow.
- Each item keeps a readable contrast and a consistent width.
- Reduced motion stops the track without hiding the content.
- The strip does not contain a control that keyboard users cannot reach.

## Do not

- Do not put the only copy of meaningful text inside the marquee.
- Do not use hover pause as the only way to stop motion.
- Do not run several marquees in opposite directions in the same view.
- Do not remove the Magic UI credit or the MIT notice.

## Verify

- The page has no horizontal scrollbar.
- Screen readers read the content once.
- Reduced motion shows the items without movement.

## Attribution

Marquee by Magic UI (https://magicui.design), MIT. Keep the MIT notice if you copy it.
