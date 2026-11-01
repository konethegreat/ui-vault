import { useId, useRef, type PointerEvent } from "react";
import "./spotlight-glow-card.css";

export type SpotlightTone = "amber" | "rust" | "bone";

export interface SpotlightGlowCardProps {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  tone?: SpotlightTone;
  className?: string;
}

export function SpotlightGlowCard({
  eyebrow,
  title,
  description,
  meta,
  tone = "amber",
  className = "",
}: SpotlightGlowCardProps) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();

  const track = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <article
      ref={ref}
      tabIndex={0}
      aria-labelledby={titleId}
      data-tone={tone}
      className={`spotlight-card ${className}`.trim()}
      onPointerMove={track}
    >
      <div className="spotlight-card__top">
        <span className="spotlight-card__eyebrow">{eyebrow}</span>
        <span className="spotlight-card__dot" aria-hidden="true" />
      </div>
      <h5 id={titleId} className="spotlight-card__title">
        {title}
      </h5>
      <p className="spotlight-card__description">{description}</p>
      {meta ? <p className="spotlight-card__meta">{meta}</p> : null}
    </article>
  );
}
