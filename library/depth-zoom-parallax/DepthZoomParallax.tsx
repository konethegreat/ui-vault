import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import "./depth-zoom-parallax.css";

export type DepthZoomImage = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

const SCALE_CEILINGS = [4, 5, 6, 5, 6, 8, 9];

export function DepthZoomParallax({ images }: { images: DepthZoomImage[] }) {
  const section = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];
  const panels = images.slice(0, SCALE_CEILINGS.length);

  if (reduced) {
    return (
      <div className="dzp dzp--static" aria-hidden="true">
        <div className="dzp__grid">
          {panels.map((image, index) => (
            <figure key={`${image.src}-${index}`} className="dzp__still">
              <img
                src={image.src}
                alt=""
                width={image.width ?? 900}
                height={image.height ?? 900}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
            </figure>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={section} className="dzp" aria-hidden="true">
      <div className="dzp__stage">
        <div className="dzp__field">
          {panels.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              className="dzp__panel"
              data-slot={index}
              style={{ scale: scales[index] }}
            >
              <div className="dzp__frame">
                <img
                  src={image.src}
                  alt=""
                  width={image.width ?? 900}
                  height={image.height ?? 900}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <p className="dzp__hint">
          Scroll <span aria-hidden="true">↓</span>
        </p>
      </div>
    </div>
  );
}
