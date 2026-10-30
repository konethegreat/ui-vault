---
id: editorial-image-accordion
title: Editorial Image Accordion
tier: pattern
type: interaction
status: usable
stack: react, typescript, css
tags: accordion, gallery, tabs, keyboard, touch
source_author: Kone
retrieved: 2026-10-30
license: MIT
rights: own
published_source: true
files: EditorialImageAccordion.tsx, editorial-image-accordion.css
demo: live
demo_source: site/src/demos/EditorialImageAccordionDemo.tsx
inspired_by: Interactive Image Accordion by Le Thanh
inspired_by_url: https://21st.dev/@minhxthanh/components/interactive-image-accordion
---

# What it is

A horizontal band of images where one panel holds the width and the rest collapse to slim spines with vertical labels. Hovering a spine on a mouse, or clicking, tapping or arrowing to one, expands it. A caption under the band names the active image and describes it.

This is an original implementation, not the Le Thanh component. The referenced original records no license, so its code and assets are not hosted in this repository.

# Why it exists

The pattern is a good way to show a small set of images without a carousel, but the common public version is built from plain divs with hover-only activation, fixed pixel widths and a rotated label that is hard to read. This entry keeps the visual idea and replaces the interaction with a real tab pattern.

# How it works

- The band is a `role="tablist"` of `button` elements, one `role="tab"` each, with `aria-selected` and roving `tabIndex`.
- One shared `role="tabpanel"` shows the active image's title and description.
- Click, tap, Enter and Space select a panel. Arrow keys wrap, Home and End jump to the ends, and focus follows selection.
- Hover only activates for a mouse pointer, so a tap does not fire twice and a touch scroll does not change the panel.
- Active and inactive widths are flex-grow ratios, not fixed pixels, so the band fits any column.
- Under `700px` the band stacks vertically with the active image taller than the rest.

# Notes

- The first item is the initial active panel; `initialIndex` is clamped to the real range.
- Every image keeps its intrinsic `width` and `height` at 900 square to reserve space before load.
- Images are decorative inside the tabs; the panel text carries the meaning.
- The gradient scrim under the labels guarantees contrast without dimming the whole image.
- Labels rotate only on the collapsed spines; the active label returns to horizontal.
- Reduced motion removes the width and image transitions.
- Use `aria-controls` only when the panel id is stable. The component derives the id from `useId` and strips the colons React adds.

# Demo

The demo runs live with five original generated images.

# Attribution

The code is original, MIT. The visual direction is inspired by Interactive Image Accordion by Le Thanh (https://21st.dev/@minhxthanh/components/interactive-image-accordion), which records no license. No code or assets were copied from it.
