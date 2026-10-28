# Use Magic UI in a project

Source: Magic UI, https://magicui.design, MIT. Pinned upstream commit `efe76fc5755eca1142dd4f74c1d6f0ace2887e3c`.
Rights: permissive. Install components from upstream and keep the MIT notice.

## Goal

Add one or two animated marketing components to an existing shadcn/ui project without turning the page into a demo reel.

## Use it when

- The page already has shadcn/ui and Tailwind CSS variables.
- One section needs a marquee, a text effect, a beam, a globe or a small interaction.
- The team accepts the motion dependency that some components bring.

## Build steps

1. Confirm the project has shadcn/ui initialized and a working Tailwind theme.
2. Pick a component from the vault entry or the component index at `sources/magic-ui/components.md`.
3. Read the component page for its dependencies. Several use Motion or a canvas library.
4. Install one component at a time:

   ```bash
   npx shadcn@latest add @magicui/marquee
   npx shadcn@latest add @magicui/number-ticker
   ```

5. Review the generated file as your own code. Change the defaults, remove unused props, and match the project tokens.
6. Add reduced-motion handling for any continuous animation. The registry does not always include it.
7. Keep the MIT notice in the project. Magic UI is MIT, and the components are copied into your source tree.

## Requirements

- Install only what the page uses. Do not bulk-add the registry.
- Check the bundle impact of canvas and motion dependencies.
- Every component keeps a visible focus state and a reduced-motion path.
- Text effects stay off controls and body copy.
- Components match the project palette instead of shipping the demo colors.

## Do not

- Do not copy the whole registry into the project.
- Do not use the components as the only copy of meaningful content.
- Do not remove the MIT notice.
- Do not present Magic UI components as original work.

## Verify

- `npm run build` passes with no unused dependency warnings.
- Reduced motion stops continuous animations.
- The new section works at 320px and 1440px.
- The license notice is present.

## Attribution

Magic UI, MIT, https://magicui.design. Keep the MIT notice when copying components.
