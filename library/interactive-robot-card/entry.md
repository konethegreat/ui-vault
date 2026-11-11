---
id: interactive-robot-card
title: Interactive Robot Card
tier: pattern
type: hero
status: usable
stack: react, typescript, three.js, css
tags: hero, 3d, robot, three.js, pointer, gaze, webgl, lazy-loading, dark
source_author: Kone
retrieved: 2026-11-07
license: MIT
rights: own
published_source: true
files: InteractiveRobotCard.tsx, interactive-robot-card.css
demo: live
demo_source: site/src/demos/InteractiveRobotCardDemo.tsx
inspired_by: Spline Scene by Serafim
inspired_by_url: https://21st.dev/@serafimcloud/components/splite
---

# What it is

A dark card with a headline on the left and a robot on the right. The robot is a metallic head with a glossy visor, two lit lenses, ear discs, an antenna and a floating shell, hovering over two thin rings. The head turns toward the pointer, the lenses shift inside the visor, and the antenna pulses on its own timer.

# Why it exists

Spline Scene is MIT, but its demo scene is a separate asset with no stated license, and the scene the author used is a robot. This is an original robot for the same card composition, drawn from three.js geometry with no Spline runtime, no model file and no borrowed character. It also shows how to build a pointer-aware 3D subject without a skeleton or animation clip.

# How it works

- `three` is imported with a dynamic `import()` inside the mount effect, so the library sits in its own chunk.
- The head is a scaled `SphereGeometry` shell. The visor is a second sphere segment 0.012 larger, cut to a front band, so it follows the shell instead of sitting on it as a flat plate.
- The two lenses are `CircleGeometry` discs with a larger, dimmer halo behind each. The pupils move across the visor while the head turns, so the gaze leads the motion instead of sliding with it.
- Ear discs are cylinders rotated onto the side axis with thin tori in front. The antenna is a stalk, a glowing tip and a point light whose intensity follows the same sine as the tip scale.
- The body is a `CapsuleGeometry` shell with sphere shoulders, capsule arms and sphere hands. The arms sway on a slow sine with opposite phase.
- The base is two tori with a dark disc under them. The disc is depth-written off, so the rings stay sharp.
- Pointer movement is read on the card, not on `document`. Only mouse pointers update the target. The loop eases the head yaw, the head pitch, the lens offsets and a small camera drift toward that target.
- An `IntersectionObserver` and `visibilitychange` stop the animation loop when the card is offscreen or the tab is hidden.
- `prefers-reduced-motion` renders one still frame, resets the head and lenses, and stops listening for pointer movement.
- A `ResizeObserver` keeps the camera aspect and the canvas size in step with the card.
- Cleanup cancels the loop, removes every listener and observer, disposes every geometry and material, and releases the WebGL context.
- A CSS radial wash sits under the canvas. If WebGL fails, the copy stays readable and the status line explains the still frame.

# Notes

- The copy is the accessible content. The canvas is `aria-hidden` and has `pointer-events: none`, so text selection works while the card listener still reads the pointer.
- The robot is decorative. It carries no information that the copy does not state.
- `three` is heavy. Mount one card, not a grid of them, and keep the dynamic import.
- The card needs height. Above 760px it uses the `height` prop; below that it stacks and uses `--robot-height` as a minimum.
- Touch pointers are ignored for gaze on purpose. A vertical swipe must keep scrolling the page.
- The lens material is basic, so the eyes stay bright when the key light falls off. Do not swap it for a standard material without adding an emissive colour.
- The visor is a sphere segment only 0.012 larger than the head, so it hugs the shell at every pointer angle. If you resize the head, resize the visor radius with it, or the band will clip.
- The head yaw is clamped by the pointer range, not by an angle clamp. If you widen the pointer mapping, add a clamp so the head does not turn past the shoulders.
- WebGL2 is the practical baseline. The CSS wash is the visible fallback, not a full replacement.

# Demo

The demo runs at the frame's full width with a 66vh height. Move the pointer across the card to turn the head and shift the lenses. Leave the card and the robot returns to rest. Scroll it out of view and the loop stops. With reduced motion, the robot is a still image and the pointer does nothing.

# Attribution

Original implementation, MIT. Inspired by Spline Scene by Serafim (https://21st.dev/@serafimcloud/components/splite). No Spline runtime, component code, scene asset or character model was used.
