---
id: animated-hero
title: Animated Hero
tier: reference
type: hero
status: usable
stack: react, typescript, tailwind, motion
tags: hero, rotating-text, spring, animation, cta, marketing, smb
source_url: https://21st.dev/@tommyjepsen/components/animated-hero
source_author: Tommy Jepsen
retrieved: 2026-11-07
license: MIT
license_url: https://21st.dev/@tommyjepsen/components/animated-hero
rights: permissive
published_source: true
files: AnimatedHero.tsx, LICENSE.md
demo: live
demo_source: site/src/demos/AnimatedHeroDemo.tsx
---

# What it is

A centered marketing hero with one rotating word. "This is something" stays put while amazing, new, wonderful, beautiful and smart swap on a two second timer. Each word enters on a spring, the previous word leaves in the opposite direction, and a row of buttons sits under the copy.

# Why it is in the vault

It is an MIT component by Tommy Jepsen, recorded on 21st.dev and first published as a block on twblocks.com. The swap is a small, readable use of Motion: the list is static, one index moves, and each title reads its position from that index. The copy is a real small business example rather than lorem ipsum, so the layout can be judged with the text it was designed for.

# How it works

- `titles` is a memoized array of five words and `titleNumber` is the active index.
- A timeout advances the index every 2000ms and wraps at the end. The effect clears the timeout on every change, so only one timer exists.
- Each title is an absolutely positioned `motion.span`. The active title sits at `y: 0` and `opacity: 1`. A title before the active one leaves at `y: -150`, a title after it waits at `y: 150`.
- The spring uses `stiffness: 50` and no damping override, so the words settle with a visible overshoot.
- The non-breaking space before the absolute titles gives the line its height. Without it the heading collapses.
- The buttons use the shadcn Button with lucide icons. The launch article button is `secondary` and `sm`, the two calls to action are `lg`.

# What was changed for this repository

- `framer-motion` is imported from `motion/react`, because this site already ships the `motion` package.
- The shadcn Button import points at this repository's `library/button/Button.tsx`. Copy that file with the hero, or change the import to your own Button.
- The original `outline` button uses this Button's `ghost` variant, because the local Button has no outline variant.
- `text-spektr-cyan-50` is replaced with `text-foreground`, a token this site defines. The original class came from the block's own theme.
- The rotation stops under `prefers-reduced-motion`. The first title renders in normal flow instead of the absolute stack.
- Inactive titles are marked `aria-hidden`, so assistive technology reads one title rather than five.
- The container gets `px-5`, the heading starts at `text-4xl` and the call to action row wraps, so the hero does not touch the frame at 390px. The desktop sizes are unchanged.

The copy and the spring values are unchanged. The site serves the MIT notice at `licenses/animated-hero.txt`.

# Reuse risks

- The timer restarts on every index change. That is fine for five marketing words. Do not reuse it for a clock.
- The absolute titles depend on the non-breaking space to hold the line height. If you replace the placeholder with a fixed height, test the descenders.
- Long words can overflow the clipped title box at 390px. Check the longest word at your font size before shipping.
- There is no pause on hover or focus. A visitor who needs more time should get it from reduced motion or a static headline.
- The buttons are inert in the demo. Point them at real destinations, and make the launch article an anchor if it navigates.
- The hero is tall by design, `py-20 lg:py-40`. Reduce the padding when it sits inside a section that already has space.
- `text-foreground` and `text-muted-foreground` need theme tokens. If your project has no shadcn theme, replace them with your own colours.
- The spring animates transform and opacity only, so it does not trigger layout.

# Demo

The live demo runs the vendored hero on a plain paper background. The buttons are present but inert, and the word swaps every two seconds. With reduced motion the first word stays and the timer does not start.

# Attribution

Animated Hero by Tommy Jepsen (https://21st.dev/@tommyjepsen/components/animated-hero), MIT, first published at https://twblocks.com/blocks/heroes/hero5. The component and its notice are vendored in this folder. Keep the credit and the notice when you reuse it.
