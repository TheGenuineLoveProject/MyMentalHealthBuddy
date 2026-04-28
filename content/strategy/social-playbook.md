# MyMentalHealthBuddy — Social & Brand Strategy Playbook

> **Status:** Planning reference only. No automation, no UI, no execution
> until the platform is fully built. Saved here per user request so the
> ideas are not lost. **Do not** delete or auto-publish from this file.

---

## Brand System Architecture

```
The Genuine Love Project (Parent)
├── Mandala emblem — spiritual, conscious, wise
├── Tone: "Healing humanity through genuine love"
└── Used in: Footer, about page, corporate contexts
    └── MyMentalHealthBuddy (Product)
        ├── Lumi mascot — friendly, tech, approachable
        ├── Tone: "Your AI-powered mental wellness companion"
        └── Used in: App, landing page, user-facing touchpoints
```

**Co-brand rule:** Product brand always leads. Parent brand appears
subordinate (smaller, below). In tight spaces, product brand only. In
institutional contexts, parent brand leads.

---

## Asset Targets

| Asset                                  | Use                                  |
| -------------------------------------- | ------------------------------------ |
| Lumi full-body                         | Body base layer for hero composites  |
| Lumi hero (1024 × 1024)                | Landing page hero                    |
| Lumi icon (512 × 512)                  | Header, favicon, app icon            |
| MMHB brand lockup (3:2)                | Marketing, social, business cards    |
| TGLP mandala (1:1)                     | Parent brand, merchandise            |

These assets are currently rendered **as pure SVG** by `LumiMascot`,
`LumiBrandLogo`, and `TGLPMandala`. PNG exports are not required for the
product; only social/print contexts need them.

---

## Lumi — Interactive Behavior Reference

| Body part | Interactive behavior                                                                |
| --------- | ----------------------------------------------------------------------------------- |
| Eyes      | Track mouse cursor in real time. Blink every 3–7 s. Pupils dilate by emotion.       |
| Head      | Tilts left/right with empathy. Nods. Bobs with breathing. Droops when sleepy.       |
| Arms      | Left waves hello. Right points or opens for a hug. Both raise in celebration.       |
| Hands     | Wiggle with joy. Open palm in offering. Spread in comfort.                          |
| Heart     | Glows amber — gentle pulse at rest, bright flash on click, intense in celebration.  |
| Body      | Breathing scale animation. Color temperature shifts with emotion.                   |

### 10 Emotion States

`neutral → listening → empathy → joy → concern → reflection → celebration → sleepy → surprise → comfort`

Each state drives a unique combination of head tilt, eye expression, arm
position, hand gesture, heart-glow intensity, and body breathing speed.

---

## Roadmap Snapshot (when these notes were captured)

- ✅ Phase 0: Environment Setup
- ✅ Phase 1: Database Migration + Seed
- ✅ Prompt 3.1: Agent Orchestrator
- ✅ Prompt 3.2: Awareness Detection Pipeline
- ✅ Prompt 3.3: Protocol Execution Engine
- ✅ Prompt 3.4: Biometric Ingestion Pipeline
- ✅ Prompt 3.5: Discernment Tutor
- ✅ Prompt 3.6: Frontend Integration
- ✅ Prompt 3.7: Marketing Pages + Tools
- ✅ Prompt 3.8: Content Generation
- ✅ Design Phase D1–D8: Visual Identity Upgrade (Lumi)
- ✅ Interactive Buddy I1–I3: Living Mascot

Marketing content generation (blogs, carousels, reels) happens **after**
the platform is fully built. The strategy here is saved for later
execution; nothing publishes automatically.

---

## Operating Rules (per user preference)

- DRY-RUN FIRST.
- Non-destructive (never delete without permission).
- Educational only (no diagnosis, no treatment claims).
- Original writing only.
- WCAG AA accessibility.
- Calm, consent-based language.
- Always include `/crisis` routing on wellness content.
- Replit-safe execution only.
- If unsure, ask ONE clarifying question. Never guess.
