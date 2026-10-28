# Index

3 sources, 7 references, 2 original patterns, 354 upstream components. Generated 2026-10-28.

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
| [Animated Shiny Text](references/animated-shiny-text/entry.md) | Magic UI (magicuidesign) | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/#demo-animated-shiny-text) | A single line of text with a light highlight that sweeps across it. The effect is a clipped background gradient animated with a CSS keyframe, so no canvas or JavaScript animation loop is involved. |
| [Dot Pattern](references/dot-pattern/entry.md) | Magic UI (magicuidesign) | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/#demo-dot-pattern) | A dot grid drawn as SVG circles that fill the parent container. With `glow`, each dot pulses on its own delay. Without it, the pattern is static. |
| [Interactive 3D Machine](references/interactive-3d-machine/entry.md) | Evgeny Shilov (eugeneshilow); built with OpenAI Codex, ported to React by Claude | unknown | private-reference | inspiration-only | [original](https://agentic-factory-3d.vercel.app) | A React and three.js scene of a short-video factory as one physical machine. Five stations sit on a metal plate: engine, admin, storefront, cabinet and cashdesk. You can orbit it, hover a station, click to focus, switch between four modes and jump between five camera presets. Everything is procedural. There are no models, images or textures to download. |
| [Liquid Sculpture Hero](references/liquid-sculpture-hero/entry.md) | Guglielmo Giannattasio | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/#demo-liquid-sculpture-hero) | A hero that rebuilds an image as roughly one hundred thousand GPU particles. The cursor turns the material liquid and it settles back into the crisp image. Without WebGL2 it falls back to a static image. |
| [Marquee](references/marquee/entry.md) | Magic UI (magicuidesign) | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/#demo-marquee) | A horizontal or vertical marquee that duplicates its children and scrolls them with CSS keyframes. Duration and gap are CSS variables, and the animation can pause on hover. |
| [Number Ticker](references/number-ticker/entry.md) | Magic UI (magicuidesign) | MIT | permissive | usable | [live](https://konethegreat.github.io/ui-vault/#demo-number-ticker) | A number that springs from a start value to a target when it scrolls into view. Formatting uses `Intl.NumberFormat`, so thousands separators and decimals follow the locale rules of `en-US`. |

## Library

| Pattern | Type | License | Demo | Notes |
| --- | --- | --- | --- | --- |
| [Button](library/button/entry.md) | button | MIT | [live](https://konethegreat.github.io/ui-vault/#demo-button) | A dependency-free React button with four variants, three sizes, a loading state and a visible focus ring. Styling lives in CSS variables, so a project can retheme it without touching the component. |
| [Nebula Hero](library/nebula-hero/entry.md) | hero | MIT | [live](https://konethegreat.github.io/ui-vault/#demo-nebula-hero) | A WebGL2 hero background made from layered value noise: a slow nebula with a warm core, faint stars and a vignette. Content sits over it with a readable scrim. All code is original and MIT. |

## Attribution

Every third-party author, license and source link is listed in [THIRD_PARTY.md](THIRD_PARTY.md). Original work in `library/` is MIT. Nothing else is presented as mine.
