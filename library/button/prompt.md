# Add the UI Vault Button to a project

Source: UI Vault Button by Kone Tshivhinda, MIT, `library/button/`.
Rights: own. Copy the files, keep the MIT attribution line.

## Goal

Add a small, dependency-free React button with four variants, three sizes, a loading state and a visible focus ring. Styling stays in CSS variables so the project can retheme it without editing the component.

## Use it when

- A project needs one good button without a whole component library.
- The design uses CSS variables or a token layer.
- Forms and mobile actions need a reliable `type="button"` default.

## Build steps

1. Copy `Button.tsx` and `button.css` into the project, for example `src/components/button/`.
2. Import the component and render it:

   ```tsx
   import { Button } from "./button/Button";

   <Button variant="primary" size="lg">Start a project</Button>
   <Button variant="secondary" loading>Saving</Button>
   <Button variant="danger" disabled>Delete</Button>
   ```

3. Retheme on the element or a parent with the documented variables:

   ```css
   .my-form .ui-button {
     --ui-button-radius: 8px;
     --ui-button-bg: #0f766e;
     --ui-button-hover: #115e59;
     --ui-button-focus: #0f766e;
   }
   ```

4. Keep the label visible while loading. The spinner sits beside it and `aria-busy` announces the state.
5. Use `type="submit"` explicitly on forms when the button submits.
6. Keep the reduced-motion block that removes the press transform and spinner rotation.

## Requirements

- Focus is only ringed with `:focus-visible`.
- Disabled and loading buttons use the native disabled attribute.
- The label is never replaced by the spinner.
- Button text meets contrast requirements in every variant.
- The component has no runtime dependencies.

## Do not

- Do not use a `div` with an `onClick` instead of the component.
- Do not remove the focus ring or the reduced-motion rules.
- Do not hard-code a new palette in the component. Add a variant or override tokens.
- Do not remove the MIT attribution line.

## Verify

- Tab reaches the button and the focus ring is visible.
- Loading sets `aria-busy` and prevents a second click.
- The button works at 320px with `fullWidth`.
- Reduced motion removes the press transform and spinner rotation.

## Attribution

UI Vault Button by Kone Tshivhinda, MIT. Source: https://github.com/konethegreat/ui-vault/tree/main/library/button
