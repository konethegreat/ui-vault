---
id: number-ticker
title: Number Ticker
tier: reference
type: data-display
status: usable
stack: react, motion, typescript
tags: numbers, stats, spring, motion
source_url: https://magicui.design/docs/components/number-ticker
source_author: Magic UI (magicuidesign)
retrieved: 2026-10-28
license: MIT
license_url: https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
rights: permissive
published_source: true
files: NumberTicker.tsx
demo: live
demo_source: site/src/demos/NumberTickerDemo.tsx
---

# What it is

A number that springs from a start value to a target when it scrolls into view. Formatting uses `Intl.NumberFormat`, so thousands separators and decimals follow the locale rules of `en-US`.

# Behavior

- `value` is the target. `startValue` is what renders before the count begins.
- `direction="down"` counts from the value to the start value instead.
- `delay` holds the animation in seconds after the element enters the viewport.
- `decimalPlaces` controls the formatted precision.
- `useInView` with `once: true` means the count runs one time and stays put.

# Caveats

- The spring is driven by Motion in JavaScript, so `prefers-reduced-motion` does not stop it. For a reduced-motion build, pass the final value as both `startValue` and `value`.
- The first paint shows the raw `startValue` without separators until the spring emits its first frame.
- Use it for a figure that is already true. Do not animate a number the data cannot support.

# Attribution

Number Ticker by Magic UI (https://magicui.design), MIT. The MIT notice is in [magic-ui-LICENSE.md](../magic-ui-LICENSE.md). Vendored unmodified from `@magicui/number-ticker` on 2026-10-28. Keep the license notice if you copy it.
