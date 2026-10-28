# Add Liquid Sculpture Hero to a project

Source: Liquid Sculpture Hero by Guglielmo Giannattasio, https://21st.dev/@gughigug/components/liquid-sculpture-hero, MIT.
Rights: permissive. You may copy the published file and must keep the visible credit.

## Goal

Build a hero where a single image breaks into roughly one hundred thousand GPU particles and turns liquid under the cursor, then settles back into the image. Without WebGL2 it must show the still image and keep the page usable.

## Use it when

- A portfolio or product hero has one strong image.
- The image can carry the page and the copy is short.
- You can test on a mid-range phone before shipping.

## Build steps

1. Copy `SculptureHero.tsx` from the vault entry, or take it from the 21st.dev component page. Keep the MIT notice and the visible credit link.
2. Pass a local `src` and `mobileSrc`. Do not hotlink the default `cdn.21st.dev` photographs.
3. Set `imageBackground` to the dominant color of your image so the fallback blends in.
4. Leave `height` fluid, for example `clamp(600px, 86svh, 860px)`.
5. Set `loadFonts` to false when your site already loads its own fonts, or self-host the two fonts the component expects.
6. Keep the static image visible until the first canvas frame is ready. Do not hide the fallback on mount.
7. If your host sends no permissive CORS headers, use a same-origin image so `crossOrigin="anonymous"` does not fail.

## Requirements

- The component detects reduced motion and passes it into the engine. Keep that path.
- The canvas is decorative. The image has alt text and the headline is real HTML.
- The layout leaves room between the navigation and the copy at desktop and phone widths.
- Performance is checked on a mid-range phone. Reduce the particle count or use the still image on low-end devices if needed.
- Bundle size is accounted for. Split the component if the rest of the page does not need it.

## Do not

- Do not remove the author credit or the link back to the 21st.dev page. The license and the platform both require it.
- Do not hotlink the sample images.
- Do not ship it without a WebGL2 fallback.
- Do not present the component as your own work.

## Verify

- With WebGL2 blocked, the still image appears and the copy is readable.
- The cursor turns the image liquid and it settles back.
- Reduced motion keeps the image stable.
- The page holds 60fps on a mid-range laptop.

## Attribution

Liquid Sculpture Hero by Guglielmo Giannattasio, MIT, published at https://21st.dev/@gughigug/components/liquid-sculpture-hero. Keep the credit and the license notice.
