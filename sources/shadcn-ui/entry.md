---
id: shadcn-ui
title: shadcn/ui
tier: source
type: library
status: usable
stack: react, tailwind, typescript
tags: primitives, copy-in, registry, accessibility
source_url: https://ui.shadcn.com
source_author: shadcn
retrieved: 2026-10-27
license: MIT
rights: permissive
upstream_repo: https://github.com/shadcn-ui/ui
upstream_commit: 96da9cc7f1aa10580a3741664e2a77c721206c00
published_source: false
---

# What it is

The base layer for most of the stack indexed here. Components are copied into your project as source, so you own and edit the files. It is not a runtime dependency.

# Use it

```bash
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add dialog card input
```

Requires Tailwind and CSS variables. The same registry mechanism powers the Magic UI and React Bits install commands.

# Why it matters

Predictable primitives, accessible defaults and theme tokens that other components can build on. Every other source in this vault assumes these exist.

# Notes

61 components at the pinned commit, listed in [components.md](components.md). Components arrive as source, so review them like your own code.

# Attribution

shadcn/ui, MIT, https://ui.shadcn.com. Keep the MIT notice when copying substantial portions into a project.
