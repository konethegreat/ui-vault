# Add Dot Pattern to a project

Source: Dot Pattern by Magic UI, https://magicui.design/docs/components/dot-pattern, MIT.
Rights: permissive. You may copy the published file and keep the credit.

## Goal

Add a quiet dot grid behind a section without an image request. The pattern should support the content and never compete with it.

## Use it when

- A section needs texture but not a full background illustration.
- A card or stage needs depth behind a headline or a code sample.
- You want a static texture with an optional glow.

## Build steps

1. Install with `npx shadcn@latest add @magicui/dot-pattern`, or copy `DotPattern.tsx` from the vault entry and keep the MIT notice.
2. Place it inside a positioned container with `relative` and `overflow-hidden`. The SVG is absolute and fills the container.
3. Set spacing with `width` and `height` between 16 and 24. Use `cr` around 1 for a fine grid.
4. Color it with a text utility such as `text-stone-900/10` or `text-white/10`.
5. Mask it with `[mask-image:radial-gradient(...)]` so the grid fades instead of ending at a hard edge.
6. Leave `glow` off for reading sections. Turn it on only for a small, focused panel.

## Requirements

- The SVG stays `aria-hidden` and `pointer-events-none`.
- The dot count stays reasonable. Increase spacing or cap the height on very large sections.
- Glow does not run under `prefers-reduced-motion`.
- Text over the pattern keeps at least 4.5:1 contrast.

## Do not

- Do not put text directly on an unmasked, full-opacity grid.
- Do not use glow behind long paragraphs.
- Do not rely on container resizes. The component listens to window resize only, so remount it or update spacing when a layout change resizes the parent.
- Do not remove the Magic UI credit or the MIT notice.

## Verify

- The pattern does not intercept clicks or focus.
- The section has no horizontal overflow at 320px.
- Reduced motion removes the glow animation.

## Attribution

Dot Pattern by Magic UI (https://magicui.design), MIT. Keep the MIT notice if you copy it.
