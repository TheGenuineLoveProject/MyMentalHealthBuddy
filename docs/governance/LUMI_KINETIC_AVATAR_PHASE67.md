# Phase 67 — Lumi Kinetic Avatar System

## Purpose
Upgrade Lumi from a static mascot/presence badge into a living companion with CSS-driven body motion, facial motion, limb motion, route-aware emotional states, and accessibility guardrails.

## Implemented
- Moving facial features:
  - blinking eyes
  - pupil tracking
  - shine pulse
  - eyebrow micro-movement
  - mouth expression animation
  - cheek glow
- Moving body:
  - whole-body float
  - body sway
  - breathing expansion/contraction
  - belly breathing
- Moving limbs:
  - left arm wave
  - right arm wave
  - left leg wiggle
  - right leg wiggle
  - ears and leaf sway
- Emotional route modes:
  - calm
  - breathe
  - support
  - celebrate
  - reflect
  - concerned
  - guide
- Emotional environment:
  - aura
  - sparkles
  - halo
  - heart pulse
  - emotion orb
  - adaptive route captions

## Safety and Accessibility
- Non-blocking fixed companion layer.
- Pointer events disabled.
- Mobile size reduced.
- Captions hidden on small screens.
- Honors `prefers-reduced-motion`.
- Does not collect user data.
- Does not interfere with crisis, privacy, billing, or admin surfaces.

## Next Step
Perform browser visual review and then integrate full-page Lumi scene variants using actual generated Lumi assets where available.
