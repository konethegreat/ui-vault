---
id: magic-ui
title: Magic UI
tier: source
type: library
status: usable
stack: react, tailwind, typescript
tags: animated, marketing, motion, shadcn
source_url: https://magicui.design
source_author: Magic UI (magicuidesign)
retrieved: 2026-10-27
license: MIT
rights: permissive
upstream_repo: https://github.com/magicuidesign/magicui
upstream_commit: efe76fc5755eca1142dd4f74c1d6f0ace2887e3c
published_source: false
---

# What it is

Animated components built on top of shadcn/ui, aimed at marketing pages and landing experiences. Installed from the `@magicui` registry with the shadcn CLI.

# Use it

```bash
npx shadcn@latest add @magicui/globe
npx shadcn@latest add @magicui/marquee
```

Each component lists its own dependencies. Several use a motion library, so check the item page before installing a large set.

# What it is good for

Hero backgrounds, text effects, marquees, animated counters and small interactions that would otherwise be hand-built for every landing page.

# Notes

75 UI components and 133 examples at the pinned commit. The component index in [components.md](components.md) covers the UI registry only. Examples are worth browsing upstream for composition ideas.

# Attribution

Magic UI, MIT, https://magicui.design. The install document kept from the original vault copy is archived locally and is not part of this repository.
