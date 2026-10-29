# Add Glassmorphism Folder Cards to a project

Source: Glassmorphism Folder Cards by Kedhareswer Naidu, https://21st.dev/@kedhareswer/components/glass-folder-cards, MIT.
Rights: permissive. You may copy `GlassFolderCards.tsx` from the vault entry or install it from 21st.dev, and you must keep the visible credit and the MIT notice.

## Goal

Place a folder object on the page that behaves like a folder. The front panel is frosted glass over generated artwork and a stack of files. Hovering leans the glass toward the pointer, clicking opens the folder and fans the files out as buttons, and the plus key adds a file.

## Use it when

- The page has a real background or pattern for the glass to blur. On a flat fill the frost is invisible.
- A card can be the main focus of a section, with room above it for the open files.
- The content behind the folder can be generated art or your own image.
- You can test a phone width and a desktop width before shipping.

## Build steps

1. Copy `GlassFolderCards.tsx` into `components/ui/` or install it from its 21st.dev page. It needs React and TypeScript only. Keep the `"use client"` directive if the host uses the Next.js app router.
2. Pass `files` with real names and optional `meta`, `art` or `image`. Without `files` it shows the sample set, which is demo content.
3. Choose `width`. Everything is drawn at 340 by 272 and scaled by `width / 340`, so 260 to 340 is the practical range for a card. Measure the container and cap the width instead of hard-coding 340 in a narrow column.
4. Reserve the root height of 0.96 times the width. The stage leaves 54 units of headroom above the folder for open files, and the visible folder sits below that space.
5. Put a real image or the generated art behind the glass. `art` accepts `aurora`, `ember`, `dusk`, `glacier`, `verdant`, a custom recipe, or `none`; `image` takes your own picture.
6. Wire `onFilesChange` if the added files must survive a reload. `onAdd` only changes the component's internal list.
7. Use `appearDelay` to stagger a row of folders. Set `appear={false}` if the folder starts inside a hidden tab or carousel where it may never intersect the viewport.
8. Add a live region of your own if the file count is important. The roll animation is visual and the component does not announce the new count.

## Requirements

- The folder remains usable by keyboard: Enter or Space opens and closes it, Escape closes it, and the `more` menu supports arrow keys, Home and End.
- Closed files are out of the tab order. The component uses `inert`; keep a modern browser target or add a fallback.
- The label, file names and menu labels remain the accessible text. Do not wrap the whole component in `aria-hidden`.
- The glass has a background to blur and the page still holds 60fps on the phones you support.
- Reduced motion leaves a readable folder even if the entrance and hinge transitions are removed.

## Do not

- Do not remove the author credit or the MIT notice. The license requires the notice, and this vault requires the credit.
- Do not place a modified fork beside the original. Every instance injects the same global `.gf-*` styles, so two versions collide.
- Do not set `files` from a prop you expect to update later. It is read once into state; remount to reset.
- Do not put the folder on a flat background and expect the glass to read. The frost needs something behind it.
- Do not mount many folders with unique recipes and sizes in one viewport. The canvas painter is budgeted but not free.
- Do not assume hover works on touch. Check the tap state and the open state separately.
- Do not present the folder design as your own work.

## Verify

- At the width you ship, the title, count and key do not overlap and the folder silhouette is intact.
- Opening the folder fans the files out, each file is a focusable button, and closing it removes them from the tab order.
- Hovering leans the glass and moves the highlight; opening with the keyboard matches opening with the pointer.
- The plus key drops a file, the count rolls, and `onFilesChange` receives the new list.
- Escape and a click outside close the open folder and the menu.
- On a phone, the folder fits its column with no horizontal scrolling and no clipped fan.
- Reduced motion still shows a legible closed folder and a usable open folder.
- The page has no console errors and the artwork appears after the queue finishes.

## Attribution

Glassmorphism Folder Cards by Kedhareswer Naidu, MIT, published at https://21st.dev/@kedhareswer/components/glass-folder-cards. Keep the credit and the license notice.
