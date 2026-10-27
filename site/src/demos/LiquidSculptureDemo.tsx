import SculptureHero from "@/vendor/SculptureHero";
import sculpture from "../assets/liquid-sculpture.webp";

export default function LiquidSculptureDemo() {
  return (
    <SculptureHero
      src={sculpture}
      mobileSrc={sculpture}
      imageAlt="Abstract sculpture of interwoven metallic filaments and suspended particles"
      imageBackground="#EAE9E7"
      height="clamp(600px, 86svh, 860px)"
    />
  );
}
