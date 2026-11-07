# Add Animated Hero to a project

Source: Animated Hero by Tommy Jepsen (https://21st.dev/@tommyjepsen/components/animated-hero), MIT. First published at https://twblocks.com/blocks/heroes/hero5. The published source is `references/animated-hero/AnimatedHero.tsx`.

Rights: permissive. Copy the component, keep the MIT notice and the Tommy Jepsen credit, and state any changes you make.

## Goal

Add a centered hero whose headline swaps one word on a spring, with a launch link and two calls to action under it.

## Use it when

- The page needs a short marketing hero with one moving word, not a full animation system.
- You can supply a list of five to seven short words that fit on one line.
- You have a Button component or can copy the one in `library/button/`.

## Build steps

1. Copy `AnimatedHero.tsx` and `LICENSE.md`.
2. Install the runtime pieces:

   ```bash
   npm install motion lucide-react
   ```

3. Copy `library/button/Button.tsx` and `Button.tsx`'s CSS, or change the `./Button` import to your own button and map `secondary` and `ghost` to your variants.
4. Replace the `titles` array with your words. Keep them short and keep the array stable with `useMemo`.
5. Replace the headline prefix, the paragraph and the three button labels with your copy.
6. Point the buttons at real destinations. Use an anchor for the launch article if it navigates.
7. Confirm `text-foreground` and `text-muted-foreground` exist in your theme, or replace them.
8. Keep the `prefers-reduced-motion` branch. It stops the timer and renders one title in normal flow.
9. Reduce `py-20 lg:py-40` if the hero sits inside a section that already has padding.

## Requirements

- Only one timeout exists at a time, and it is cleared on unmount.
- The active title is the only one exposed to assistive technology.
- The non-breaking space or an equivalent fixed height holds the title line.
- The spring animates transform and opacity only.
- The heading, the paragraph and the buttons remain readable at 390px.
- The buttons are real buttons or links, not divs.

## Do not

- Do not add more than about seven titles. The spring needs time to settle between swaps.
- Do not use long words that pass the width of the heading box. The container clips them.
- Do not remove the placeholder height. The absolute titles will collapse the line.
- Do not run the timer when reduced motion is set.
- Do not keep the upstream `framer-motion` import if your project already ships `motion`. Use one animation library.
- Do not remove the MIT notice or the Tommy Jepsen credit.

## Verify

- The word changes every two seconds and wraps from the last word to the first.
- Unmounting the hero leaves no timer running.
- At 390px the longest word stays inside the heading box.
- With reduced motion, the first word is visible and never swaps.
- Screen readers read one title, not all five.
- Tab reaches the three buttons and the focus ring is visible.
- No layout shift when a longer word replaces a shorter one.

## Attribution

Animated Hero by Tommy Jepsen (https://21st.dev/@tommyjepsen/components/animated-hero), MIT. Copied with the notice kept. Changes are listed in the entry.
