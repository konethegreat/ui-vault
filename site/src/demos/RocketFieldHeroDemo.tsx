import { RocketFieldHero } from "@/vendor/RocketFieldHero";
import { REPO } from "@/lib/catalog";

const PRIMARY = {
  label: "Read the code",
  href: `${REPO}/blob/main/library/rocket-field-hero/RocketFieldHero.tsx`,
};

const SECONDARY = {
  label: "Open the entry",
  href: `${REPO}/blob/main/library/rocket-field-hero/entry.md`,
};

export default function RocketFieldHeroDemo() {
  return (
    <RocketFieldHero
      height="clamp(540px, 74vh, 720px)"
      headingLevel="h2"
      eyebrow="Original · canvas"
      headline="A field of small launches."
      body="Stars drift in depth while rockets climb from the horizon on their own trails. Click the sky to send one up. It pauses off screen and holds a still frame when motion is reduced."
      primaryCta={PRIMARY}
      secondaryCta={SECONDARY}
      credit={
        <>
          Original canvas scene, MIT. Direction inspired by the Animated Rocket Shader Hero, shader by{" "}
          <a
            href="https://www.shadertoy.com/user/atzedent"
            target="_blank"
            rel="noopener noreferrer"
          >
            Matthias Hurrle
          </a>
          . No shader code or scene asset was copied.
        </>
      }
    />
  );
}
