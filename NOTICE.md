# Notice

This repository mixes original work with references to work owned by other people. The boundary matters, so it is written down here and enforced by the validator.

## Scope of the MIT license

The MIT license in [LICENSE](LICENSE) applies to:

- `library/`: patterns and code authored by Kone.
- The original site code in `site/`, excluding generated copies of third-party sources.
- The structure, scripts and generated documentation in this repository.

It does not apply to third-party code named or linked in `sources/` or `references/`. That code stays under its own license, listed in the entry and linked in [THIRD_PARTY.md](THIRD_PARTY.md).

## What is hosted here

- `sources/` contains links, install commands, license facts and component names. It does not host third-party source code.
- `references/` contains written observations and provenance metadata. It hosts third-party source only when the license is verified as permissive, the files are listed in the entry, and the author, source and license are credited. Unknown, non-commercial and share-alike work is never published as code.
- `library/` contains original work only.
- The live site runs the published components and credits each one in its frame. It does not present third-party work as original.

## Third-party code currently hosted

- Liquid Sculpture Hero by Guglielmo Giannattasio, MIT, via 21st.dev.
- Mascot Portfolio Hero by Kedhareswer Naidu, MIT, via 21st.dev.
- Marquee, Animated Shiny Text, Number Ticker and Dot Pattern by Magic UI, MIT.

Each file carries its source and license in the matching entry under `references/`. If you copy one onward, keep that credit and the license notice.

## Referenced but not hosted

- Interactive 3D Machine by Evgeny Shilov (eugeneshilow). No license was found, so the scene, its code and its assets are not hosted here. The reference records observations only, and the site shows an original sketch that links to the author's deployment.
- Animated Rocket Shader Hero. The shader is a Star Nest derivative credited to Matthias Hurrle (@atzedent), the wrapper author is not recorded, and Shadertoy shaders default to CC BY-NC-SA 3.0. The wrapper also does not compile as shipped. It is linked and documented, not hosted, because a non-commercial share-alike work cannot be mixed into an MIT site.
- React Bits. Linked and installable from upstream, never copied into this repository.

## Fonts

The site self-hosts Instrument Serif, Geist, Geist Mono, Archivo Black and Inter. All five are licensed under the SIL Open Font License 1.1. The notice is kept at `references/fonts-LICENSE.txt` and served at `licenses/fonts.txt`.

## Agent surfaces

The hosted API, MCP server and CLI serve the same provenance records as the repository. They return notes, license facts and prompts, not third-party source. Prompts repeat the rights rules of their entry: restricted and unknown work is never offered for copying. The surfaces are original code under the MIT license in this repository.

## Trademarks

shadcn/ui, Magic UI, React Bits, 21st.dev and any other product names are trademarks of their respective owners. Use here is descriptive and does not imply endorsement.

## Corrections

If you own a design referenced here and want an entry corrected or removed, open an issue. Provenance errors are treated as bugs.
