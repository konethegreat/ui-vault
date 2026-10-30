# Index

3 sources, 12 references, 4 original patterns, 354 upstream components. Generated 2026-10-30.

Definitions live in [README.md](README.md). Machine-readable data lives in [catalog.json](catalog.json).

## Sources

| Library | Author | License | Components | Install |
| --- | --- | --- | --- | --- |
| [Magic UI](sources/magic-ui/entry.md) | Magic UI (magicuidesign) | MIT | [75](sources/magic-ui/components.md) | `npx shadcn@latest add @magicui/<name>` |
| [React Bits](sources/react-bits/entry.md) | David Haz (React Bits) | MIT + Commons Clause | [218](sources/react-bits/components.md) | `npx shadcn@latest add @react-bits/<Name>-TS-TW` |
| [shadcn/ui](sources/shadcn-ui/entry.md) | shadcn | MIT | [61](sources/shadcn-ui/components.md) | `npx shadcn@latest add <name>` |

## References

| Design | Author | License | Rights | Status | Demo | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| [Animated Rocket Shader Hero](references/animated-rocket-hero/entry.md) | Matthias Hurrle (@atzedent) for the shader; component author not recorded | unknown | private-reference | needs-fix |  | A full-screen dark hero. A WebGL2 fragment shader paints a drifting cloud and light field, and the marketing content sits above it with staggered fade-ins and warm gradient headings. |
| [Animated Shiny Text](references/animated-shiny-text/entry.md) | Magic UI (magicuidesign) | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/demos#demo-animated-shiny-text) | A single line of text with a light highlight that sweeps across it. The effect is a clipped background gradient animated with a CSS keyframe, so no canvas or JavaScript animation loop is involved. |
| [Circular Navigation Bar](references/circular-navigation-bar/entry.md) | Kaif UI | unknown | private-reference | inspiration-only | [original](https://21st.dev/@kaif-ui/components/cicular-navigation-bar) | A full-screen navigation overlay that replaces a list with a circular dial. Up to seven destinations sit evenly around a translucent disc, each one an icon and a label inside a round target. A white circular button in the middle closes the overlay. The disc scales in from nothing while a dimmed backdrop covers the page. Hovering a destination fills it white and flips its icon and text to black. |
| [Dot Pattern](references/dot-pattern/entry.md) | Magic UI (magicuidesign) | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/demos#demo-dot-pattern) | A dot grid drawn as SVG circles that fill the parent container. With `glow`, each dot pulses on its own delay. Without it, the pattern is static. |
| [Glassmorphism Folder Cards](references/glass-folder-cards/entry.md) | Kedhareswer Naidu | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/demos#demo-glass-folder-cards) | A folder you can open, drawn as three real layers instead of a picture of a folder. A back panel holds generated artwork, the files sit between the panels, and a frosted front panel blurs whatever is behind it. Hovering leans the glass toward the pointer, clicking drops the panel and fans the files out as labelled buttons, and the plus key drops a new file into the pocket. |
| [Interactive 3D Machine](references/interactive-3d-machine/entry.md) | Evgeny Shilov (eugeneshilow); built with OpenAI Codex, ported to React by Claude | unknown | private-reference | inspiration-only | [original](https://agentic-factory-3d.vercel.app) | A React and three.js scene of a short-video factory as one physical machine. Five stations sit on a metal plate: engine, admin, storefront, cabinet and cashdesk. You can orbit it, hover a station, click to focus, switch between four modes and jump between five camera presets. Everything is procedural. There are no models, images or textures to download. |
| [Interactive Image Accordion](references/interactive-image-accordion/entry.md) | Le Thanh | unknown | private-reference | inspiration-only | [original](https://21st.dev/@minhxthanh/components/interactive-image-accordion) | A landing section with five tall image panels in a row. The active panel is 400px wide and the rest are 60px spines with rotated titles. Hovering another panel widens it, so the row behaves like an accordion without any vertical collapse. |
| [Liquid Sculpture Hero](references/liquid-sculpture-hero/entry.md) | Guglielmo Giannattasio | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/demos#demo-liquid-sculpture-hero) | A hero that rebuilds an image as roughly one hundred thousand GPU particles. The cursor turns the material liquid and it settles back into the crisp image. Without WebGL2 it falls back to a static image. |
| [Marquee](references/marquee/entry.md) | Magic UI (magicuidesign) | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/demos#demo-marquee) | A horizontal or vertical marquee that duplicates its children and scrolls them with CSS keyframes. Duration and gap are CSS variables, and the animation can pause on hover. |
| [Mascot Portfolio Hero](references/mascot-portfolio-hero/entry.md) | Kedhareswer Naidu | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/demos#demo-mascot-portfolio-hero) | A one-screen portfolio hero built as a printed poster for the screen. A one-point-perspective room is generated in SVG, a four-line display headline fills the left, and an illustrated character stands at the right. The head follows the pointer with layered parallax, blinks on its own, and greets the visitor when clicked. |
| [Number Ticker](references/number-ticker/entry.md) | Magic UI (magicuidesign) | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/demos#demo-number-ticker) | A number that springs from a start value to a target when it scrolls into view. Formatting uses `Intl.NumberFormat`, so thousands separators and decimals follow the locale rules of `en-US`. |
| [Zoom Parallax](references/zoom-parallax/entry.md) | Efferd | unknown | private-reference | inspiration-only | [original](https://21st.dev/@efferd/components/zoom-parallax) | A scroll scene made of seven images on one sticky stage. The stage holds for three viewport heights while each image scales at a different rate, from 4x to 9x, so the composition appears to pull apart and push through the screen. |

## Library

| Pattern | Type | License | Demo | Notes |
| --- | --- | --- | --- | --- |
| [Button](library/button/entry.md) | button | MIT | [live](https://konethegreat.github.io/ui-vault/demos#demo-button) | A dependency-free React button with four variants, three sizes, a loading state and a visible focus ring. Styling lives in CSS variables, so a project can retheme it without touching the component. |
| [Depth Zoom Parallax](library/depth-zoom-parallax/entry.md) | motion | MIT | [live](https://konethegreat.github.io/ui-vault/demos#demo-depth-zoom-parallax) | A scroll-driven gallery where seven framed images sit on a dark stage and fly past the camera at different depths. A sticky stage holds the composition in place while the page scrolls through a tall section, so the images appear to move toward the viewer rather than with the document. |
| [Editorial Image Accordion](library/editorial-image-accordion/entry.md) | interaction | MIT | [live](https://konethegreat.github.io/ui-vault/demos#demo-editorial-image-accordion) | A horizontal band of images where one panel holds the width and the rest collapse to slim spines with vertical labels. Hovering a spine on a mouse, or clicking, tapping or arrowing to one, expands it. A caption under the band names the active image and describes it. |
| [Nebula Hero](library/nebula-hero/entry.md) | hero | MIT | [live](https://konethegreat.github.io/ui-vault/demos#demo-nebula-hero) | A WebGL2 hero background made from layered value noise: a slow nebula with a warm core, faint stars and a vignette. Content sits over it with a readable scrim. All code is original and MIT. |

## Attribution

Every third-party author, license and source link is listed in [THIRD_PARTY.md](THIRD_PARTY.md). Original work in `library/` is MIT. Nothing else is presented as mine.
