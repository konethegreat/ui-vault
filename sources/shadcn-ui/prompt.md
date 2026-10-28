# Use shadcn/ui in a project

Source: shadcn/ui, https://ui.shadcn.com, MIT. Pinned upstream commit `96da9cc7f1aa10580a3741664e2a77c721206c00`.
Rights: permissive. Install components as source and keep the MIT notice for substantial portions.

## Goal

Set up shadcn/ui as the primitive layer for a React and Tailwind project, then add only the components the page needs.

## Use it when

- The project is starting and needs accessible primitives with theme tokens.
- The team wants to own and edit component source rather than depend on a runtime library.
- Magic UI or React Bits components will be layered on top.

## Build steps

1. Initialize in a React project with Tailwind and CSS variables:

   ```bash
   npx shadcn@latest init
   ```

2. Add components by name:

   ```bash
   npx shadcn@latest add button dialog card input
   ```

3. Review every generated file like your own code. Replace demo copy, narrow props and match the project tokens.
4. Keep the theme tokens in CSS variables. Do not hard-code colors in component files.
5. Add only the primitives the page uses. Add more when a real screen needs them.
6. Keep the MIT notice for substantial portions copied into the project.

## Requirements

- Focus states, labels, disabled states and keyboard behavior are tested, not assumed.
- Dark and light themes both work through tokens.
- The component files are typechecked and linted like application code.
- Imports use the project alias, not deep relative paths across the app.

## Do not

- Do not treat shadcn/ui as a runtime dependency or a package you upgrade blindly.
- Do not copy every component into the project.
- Do not override accessibility behavior without testing it.
- Do not remove the MIT notice for substantial portions.

## Verify

- `npm run build` passes.
- Keyboard navigation works in dialogs, menus and forms.
- The theme switch changes surfaces through tokens.
- No component file contains hard-coded brand colors.

## Attribution

shadcn/ui, MIT, https://ui.shadcn.com. Keep the MIT notice when copying substantial portions.
