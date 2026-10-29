"use client"

import * as React from "react"
import GlassFolder from "@/vendor/GlassFolderCards"

function useContainerWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

/**
 * Three folders on a dotted desk. The stage is measured so the folder width
 * follows the column instead of overflowing a phone.
 */
export default function GlassFolderCardsDemo() {
  const [ref, width] = useContainerWidth<HTMLDivElement>()
  const columns = width >= 1020 ? 3 : width >= 660 ? 2 : 1
  const gap = 32
  const folderWidth = width
    ? Math.min(340, Math.max(230, Math.floor((width - gap * (columns - 1)) / columns)))
    : 260

  return (
    <div className="relative overflow-hidden bg-[#f3efe6]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-ink opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto flex max-w-[1180px] flex-col items-center px-3 py-14 sm:px-6 sm:py-16">
        <div
          ref={ref}
          className="grid w-full items-end justify-items-center gap-y-8"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: gap }}
        >
          <GlassFolder
            label="My Files"
            art="aurora"
            seed={3}
            width={folderWidth}
            appearDelay={0}
            files={[
              { name: "Cover final", meta: "PNG · 4.8 MB", art: "ember" },
              { name: "Moodboard", meta: "24 images", art: "dusk" },
              { name: "Brief.pdf", meta: "PDF · 1.2 MB" },
            ]}
          />
          <GlassFolder
            label="Archives"
            art="none"
            action="more"
            labelPlacement="top-left"
            width={folderWidth}
            appearDelay={140}
            files={[
              { name: "Lookbook 2024", meta: "38 images", art: "dusk" },
              { name: "Invoices", meta: "12 PDFs" },
              { name: "Shoot Lisbon", meta: "RAW · 2.1 GB", art: "ember" },
              { name: "Contract.pdf", meta: "PDF · 320 KB" },
            ]}
            menu={[{ label: "Rename" }, { label: "Share…" }, { label: "Move to Trash", danger: true }]}
          />
          <GlassFolder
            label="Night Shoot"
            meta="Wed 19 Aug"
            tone="dark"
            art="ember"
            seed={11}
            action="none"
            labelPlacement="top-right"
            width={folderWidth}
            appearDelay={280}
            files={[
              { name: "Stills", meta: "64 images", art: "verdant" },
              { name: "Edit notes", meta: "TXT · 4 KB" },
              { name: "Grade v3", meta: "DRX · 18 MB", art: "aurora" },
            ]}
          />
        </div>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
          Hover to lean · Click to open · + to add
        </p>
      </div>
    </div>
  )
}
