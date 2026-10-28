# Add Number Ticker to a project

Source: Number Ticker by Magic UI, https://magicui.design/docs/components/number-ticker, MIT.
Rights: permissive. You may copy the published file and keep the credit.

## Goal

Animate a number from a start value to a real target when it scrolls into view, with locale formatting and a spring that settles.

## Use it when

- A stat is already true and worth emphasizing once.
- The number is short enough to read while it animates.
- The section can reserve its final width to avoid layout shift.

## Build steps

1. Install with `npx shadcn@latest add @magicui/number-ticker`, or copy `NumberTicker.tsx` from the vault entry and keep the MIT notice.
2. Pass the real `value`, a sensible `startValue`, and a `delay` between 0 and 0.3 seconds.
3. Use `decimalPlaces` only when the data has decimals. Do not invent precision.
4. Use `direction="down"` when the story is a reduction, such as cost or latency.
5. Reserve width with `tabular-nums` and a `min-width`, so the count does not push the layout.
6. For reduced motion, pass the final value as both `startValue` and `value`. Motion does not detect the preference for you.
7. Keep the label in HTML next to the number, not inside the animated span.

## Requirements

- The number is true at the time of rendering. Do not animate a placeholder.
- The final value is visible without JavaScript.
- The animation runs once when it enters view.
- The label explains the unit and the period.

## Do not

- Do not use it for prices, dates or identifiers.
- Do not stack five tickers in one view.
- Do not remove the Magic UI credit or the MIT notice.

## Verify

- The final value matches the source data.
- Reduced motion shows the final value immediately.
- No layout shift occurs when the count finishes.

## Attribution

Number Ticker by Magic UI (https://magicui.design), MIT. Keep the MIT notice if you copy it.
