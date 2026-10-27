---
id: button
title: Button
tier: pattern
type: button
status: usable
stack: react, css, typescript
tags: control, variants, sizes, loading, accessibility
source_author: Kone
retrieved: 2026-10-28
license: MIT
rights: own
published_source: true
files: Button.tsx, button.css
demo: live
demo_source: site/src/demos/ButtonDemo.tsx
---

# What it is

A dependency-free React button with four variants, three sizes, a loading state and a visible focus ring. Styling lives in CSS variables, so a project can retheme it without touching the component.

# Why it exists

Most projects either pull in a component library for one control or hand-roll a button that loses focus styles and disabled semantics. This one is small enough to copy and complete enough to ship.

# Behavior

- Renders a native `button` and defaults `type` to `button`, which avoids accidental form submits.
- `loading` sets `aria-busy`, disables the button and shows a spinner without removing the label.
- `disabled` and `loading` both set the native disabled attribute.
- Focus is only ringed with `:focus-visible`, so mouse clicks stay quiet.
- Reduced motion removes the press transform and the spinner rotation.
- `fullWidth` is available for forms and mobile actions.

# Tokens

Override on the element or a parent:

```css
.my-form .ui-button {
  --ui-button-radius: 8px;
  --ui-button-bg: #0f766e;
  --ui-button-hover: #115e59;
  --ui-button-focus: #0f766e;
}
```

# Usage

```tsx
import { Button } from "./button/Button";

<Button variant="primary" size="lg">Start a project</Button>
<Button variant="secondary" loading>Saving</Button>
<Button variant="danger" disabled>Delete</Button>
```

# Attribution

Original work by Kone, MIT. The approach is conventional and owes no code to any library in this vault.
