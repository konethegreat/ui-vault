import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import "./editorial-image-accordion.css";

export type AccordionImage = {
  src: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
};

function clampIndex(index: number, length: number) {
  if (!Number.isFinite(index) || length === 0) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), length - 1);
}

export function EditorialImageAccordion({
  items,
  initialIndex = 0,
  label = "Image accordion",
}: {
  items: AccordionImage[];
  initialIndex?: number;
  label?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState(() => clampIndex(initialIndex, items.length));
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  if (items.length === 0) return null;

  const current = items[clampIndex(active, items.length)];

  function select(index: number, moveFocus = false) {
    const next = clampIndex(index, items.length);
    setActive(next);
    if (moveFocus) tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = index === items.length - 1 ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = index === 0 ? items.length - 1 : index - 1;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = items.length - 1;
    }
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }

  return (
    <div className="eia">
      <div role="tablist" aria-label={label} className="eia__list">
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.title}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              className="eia__tab"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(index);
              }}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <img
                className="eia__image"
                src={item.src}
                alt=""
                width={item.width ?? 900}
                height={item.height ?? 900}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
              <span className="eia__scrim" aria-hidden="true" />
              <span className="eia__label">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${active}`}
        tabIndex={0}
        className="eia__caption"
      >
        <span className="eia__index">
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <h4 className="eia__title">{current.title}</h4>
        <p className="eia__text">{current.description}</p>
      </div>
    </div>
  );
}
