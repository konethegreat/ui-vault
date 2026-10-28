# Use React Bits in a project

Source: React Bits by David Haz, https://reactbits.dev, MIT plus the Commons Clause. Pinned upstream commit `e12c22192ac7b4b452c5e2feb9b586d74765d696`.
Rights: restricted. **Do not copy or redistribute the components.** Install them from upstream into the target application only.

## Goal

Use one React Bits component inside an application or product, including a commercial one, without violating the Commons Clause.

## Use it when

- A specific component, such as SplitText, BlurText or a background effect, fits the design.
- The component will live inside your application and will not be sold, sublicensed or redistributed as a component.
- The project can carry the component's dependencies.

## Build steps

1. Choose the language and styling suffix: `JS` or `TS`, then `CSS` or `TW`. For example, `SplitText-TS-TW`.
2. Install from upstream into the target project:

   ```bash
   npx shadcn@latest add @react-bits/SplitText-TS-TW
   ```

   Or:

   ```bash
   npx jsrepo@latest add https://reactbits.dev/r/SplitText-TS-TW
   ```

3. Read the generated file and its dependencies before using it.
4. Adapt it to the project tokens and remove unused options.
5. Keep the React Bits license notice and attribution in the project.
6. Add reduced-motion handling if the component animates continuously.

## Requirements

- The component is used inside an application, website or product.
- The application is not primarily a component library, template marketplace or port collection.
- The component is not resold, sublicensed, bundled as a component pack or republished as a port.
- Accessibility basics are checked: focus, labels, reduced motion, keyboard access.

## Do not

- Do not copy React Bits source out of a public repository and redistribute it.
- Do not include React Bits components in a starter kit, template pack, UI library or npm package that others install.
- Do not sell the components on their own or in a bundle.
- Do not remove the license notice.
- Do not present the components as original work.

## Verify

- The component runs inside the target application.
- The license notice is present.
- Reduced motion stops continuous animation.
- The component works at 320px and 1440px.

## Attribution

React Bits by David Haz, MIT plus the Commons Clause, https://reactbits.dev. Full license: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
