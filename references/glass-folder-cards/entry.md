---
id: glass-folder-cards
title: Glassmorphism Folder Cards
tier: reference
type: card
status: usable
stack: react, typescript, css, canvas, svg
tags: glassmorphism, glass, folder, card, canvas, generative, pointer, keyboard, file-manager
source_url: https://21st.dev/@kedhareswer/components/glass-folder-cards
source_author: Kedhareswer Naidu
retrieved: 2026-10-29
license: MIT
license_url: https://21st.dev/@kedhareswer/components/glass-folder-cards
rights: permissive
published_source: true
files: GlassFolderCards.tsx, LICENSE.md
demo: live
demo_source: site/src/demos/GlassFolderCardsDemo.tsx
---

# What it is

A folder you can open, drawn as three real layers instead of a picture of a folder. A back panel holds generated artwork, the files sit between the panels, and a frosted front panel blurs whatever is behind it. Hovering leans the glass toward the pointer, clicking drops the panel and fans the files out as labelled buttons, and the plus key drops a new file into the pocket.

# Why it is in the vault

It is an MIT-licensed component by Kedhareswer Naidu on 21st.dev, the author of Mascot Portfolio Hero. It turns ordinary DOM layers into a tactile object: `clip-path` cuts the folder silhouette, a real backdrop blur makes the front panel glass, and a shared canvas painter supplies the artwork. The published component is vendored unchanged, so the live demo is the real file and not a reconstruction.

# Techniques worth reusing

- The folder is three layers back to front: a back panel with art, a stack of file sheets, and a frosted front panel hinged on its bottom edge. The files are real elements between real panels, so `backdrop-filter` frosts them as they move instead of faking the blur on a still image.
- The front panel is a `<button>` with `aria-expanded` and a spoken label. The file list follows it in the DOM and is marked `inert` while closed, so the tab order matches what is visible.
- Geometry is a fixed 340 by 272 stage, scaled by `width / 340`. The two folder shapes are constant SVG paths used as `clip-path` values, which keeps the silhouette crisp at any scale.
- The artwork is generated, not fetched. A domain-warped noise field is shaded as a liquid surface and painted into a canvas over several frames. `streak` squeezes the sampling coordinates to make a long exposure, `marble` folds the colours through each other.
- Every folder on the page shares one painter queue with a time budget per frame. Work is cached by recipe, seed and pixel size, so a row of folders loads without a frame drop.
- Pointer parallax writes `--gf-px` and `--gf-py` straight to the root element inside `requestAnimationFrame`; React state does not change on pointer move. The tilt, highlight and shadow read those variables in CSS.
- The `more` menu is a real `role="menu"` with roving focus, Home and End support, Escape to close and a click outside to dismiss. The `+` key adds a file and rolls the count.
- The entrance is an `IntersectionObserver` per folder, and `appearDelay` staggers a row without any global timeline.
- Gradient ids come from `useId`, so several folders with different tones do not collide.

# What was changed for this repository

The component file is the published file unchanged. The demo that shipped beside it was adapted into `site/src/demos/GlassFolderCardsDemo.tsx`: the full-viewport stage became a contained desk, the folder width is measured against its column so it cannot overflow a phone, and the third folder uses a distinct label. The component draws with system font stacks, so there are no extra fonts to self-host. The MIT notice is served at `licenses/glass-folder-cards.txt`.

# Reuse risks

- Width scales the whole stage, it does not reflow it. Text, controls and radii all scale with `width / 340`. Below about 260px the labels crowd; above about 420px the title and key get oversized. Choose the width you will ship and test the label line at that size.
- The root height is 0.96 times its width and includes 54 units of headroom above the folder. Reserve that space: open files rise into it and can overlap content above.
- `files` is read once into state. Later changes to the prop are ignored, so reset by remounting. `onAdd` only changes the internal list; persist it through `onFilesChange` if the list matters.
- Each instance injects the same `<style>` block with global `.gf-*` class names. Three folders mean three copies of the CSS. Do not put a modified fork beside the original, and scope the class names if you do fork it.
- `backdrop-filter` is doing the glass. On a flat background with nothing behind the folder the frost is almost invisible, and the blur is expensive on low-end phones. Put the card over an image or a pattern and avoid a screen full of folders.
- The generated artwork is painted on the main thread in small slices. Reusing presets and seeds keeps the cache warm; many unique recipes and sizes still queue.
- Hover is pointer-only. On touch the lift appears on tap. Opening still works with click, Enter and Space, and Escape closes.
- `clip-path: path()` needs path clipping support. Without it the folder falls back to a rectangle, so check the silhouette in the browsers you support.
- Closed files rely on `inert`. A browser without it can still tab into sheets that are behind the glass.
- Reduced motion removes the transitions but not the state changes, so the folder can still jump between poses. Pass `appear={false}` inside a tab or carousel where the entrance observer may never fire.
- The count roll is visual only. If the count is important, add a live region; the component does not announce it.
- The controls are real, so keep the folder label and file names as the accessible text. Do not hide the whole component from assistive technology.

# Attribution

Glassmorphism Folder Cards by Kedhareswer Naidu, licensed MIT, published on 21st.dev at https://21st.dev/@kedhareswer/components/glass-folder-cards. The component source and the MIT notice are vendored in this folder. The site serves the notice at `licenses/glass-folder-cards.txt`. Keep the credit and the license notice when you reuse it.
