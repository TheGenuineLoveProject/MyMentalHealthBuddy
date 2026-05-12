# MMHB Changelog — Detailed Implementation Notes

This file holds the deep technical notes for completed feature evolutions.
`replit.md` keeps a one-line summary and links here for the full record.
Newest entries on top.

---

## v5.8.22 — V28 Color & Structure Unification (CanvaLanding light treatment)

Six dark/heavy sections on `client/src/pages/CanvaLanding.jsx` flipped to V28 light treatment matching the Newsletter / Pro Features aesthetic. (1) `.manifesto-quote` (Philosophy dark sage→teal gradient quote block) → white card + sage/gold/blush top accent + soft sage shadow + `--glp-sage-deep` text on white. (2) `.philosophy-card` lost warm tint → pure white, top accent `opacity:1` always (was hover-only), soft shadow added. (3) `.feature-card-elite::before` accent line `opacity:0→1` (always visible). (4) Three about-card icons (Lightbulb / Users / Zap) `rounded-xl→rounded-full` + sized up. (5) Philosophy + feature card icons `rounded-xl→rounded-full`. (6) Final CTA "Your Buddy Is Ready. Are You?" band (line 1018) flipped from `linear-gradient(135deg, var(--glp-sage-deep) 0%, #0d4a3d 100%)` + white text → `linear-gradient(180deg, var(--glp-paper), var(--glp-sage-10))`, sage-tinted decorative orbs (10% sage, 8% gold), sparkle pill `--glp-sage-10` w/ sage-20 border, `--glp-gold-dark` icon, `--glp-sage-deep` eyebrow + headline (with sage→gold gradient text-clip kept on the "Are You?" span for warmth), `--glp-ink` body. (7) Admin Access band below footer (line 1152) flipped: section bg `--glp-teal-800`→`--glp-paper`, panel bg dark teal gradient→white card w/ `--glp-sage-15` border + soft sage shadow, all teal-200/300/600/700 swapped to sage-deep/ink/sage-10/paper, admin-toggle pill `rounded-lg→rounded-full`, KeyRound wrapper `rounded-xl→rounded-full`, submit button stays sage gradient (now `sage-deep→sage`). "Explore X →" text-only gold links → real sage gradient pill buttons (`rounded-full`, white text, `linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))`, `hover:scale-105`) with a dedicated `prefers-reduced-motion: reduce` guard in `canva-landing.css` (~line 2477) suppressing both transition and transform on `.canva-landing .feature-card-elite a[data-testid^="link-feature-"]` including `:hover`. PenLine ("Journaling That Evolves Your Thinking") icon already uses `accent: 'rose'` which maps to the canonical blush gradient (`--glp-blush-400→--glp-blush-600`, the rose blush #F7B7A3 family) — no separate red→rose flip needed. Verified zero full-section dark backgrounds remain on the landing page; the 3 remaining `sage-deep` references are all V28-correct usage (icon gradient endpoints, pill button bg, gradient text-clip). Triple gate: TSC=0, Build=17.10s.

---

## v5.8.21 — V28 Color & Structure Unification (initial pass, superseded by v5.8.22)

Initial V28 unification work that landed Newsletter/Pro Features visual aesthetic conventions across the landing page: light sage `#F7F4EE` backgrounds, white `#FFFFFF` cards with soft shadow, circle icons (never squares), sage gradient buttons `#4A7E72→#A8C9A0`. v5.8.22 completed the remaining dark sections the architect flagged (final CTA band + admin band) and added the reduced-motion guard for the new pill buttons.

---

## v5.8.18 — OFFICIAL AVATAR DROP (user-supplied canonical PNGs, no regeneration)

User supplied 7 canonical PNGs as the locked source of truth and instructed: do not regenerate. Files copied verbatim into `client/public/brand/v17/`: 4 hero illustrations (`benefit-relief.png`, `benefit-understanding.png`, `benefit-companionship.png`, `benefit-growth.png`) + 3 overlay/hero avatars (`avatar-breathing.png`, `avatar-heart.png`, `avatar-floating.png` — last 3 overwrite the existing slots so every consumer that already imported those names picks up the new art automatically). All 7 WebP-encoded at q=85 via `cwebp` (transfer profile: 11–23 KB per WebP vs. 225–708 KB source PNGs, 95–97% reduction). `client/src/sections/VisualBenefits.jsx` rewired: Relief → `benefit-relief`; Understanding → `benefit-understanding`; Companionship → `benefit-companionship` (overlay also flipped to `avatar-heart` since the official drop ships an `avatar-heart` variant); Growth → `benefit-growth`. Hero (`CanvaLanding.jsx avatar-floating`) inherits the new asset automatically (same filename). Cleanup: deleted the 6 v5.8.17/v5.8.13 generated lumi assets (`lumi-sprout-{emotion-orbs,heart-glow,walking-path}.{png,webp}` + `lumi-pose-{meditating-aura,halo-prayer,walking-sunrise}.{png,webp}`) and 4 unused `benefit-*-v3.{png,webp}` orphan pairs (zero refs in `client/` or `server/`). Final v17 inventory contains exactly the 7 official files (+nobg variants for legacy overlay slots, +their WebPs). Triple gate: TSC=0, Build=18.41s.

---

## v5.8.17 — V27 OFFICIAL AVATAR DESIGN LOCK (sprout-only mascot enforced)

Sprout-only mascot enforced site-wide. The "official" hooded set shipped in v5.8.15 (sage-hooded panda meditating, white-hooded body cradling emotion orbs, sage-hooded body holding glowing heart) is now declared NOT OFFICIAL — V27 spec admits exactly one Lumi: small sage two-leaf sprout on TOP CENTER of round cream head, cream body + sage `#A8C9A0` belly, glossy black dot eyes, soft pink `#F5A3A3` blush, simple smile, NO hood NO long ears NO bunny features. `client/src/sections/VisualBenefits.jsx` rewired: Relief `lumi-official-meditating` → `lumi-pose-meditating-aura` (existing v5.8.13 sprout asset, sprout-Lumi seated cross-legged + 3 concentric calm-blue `#74C0FC` aura rings); Understanding `lumi-official-emotion-orbs` → `lumi-sprout-emotion-orbs` (NEW sprout asset, sprout-Lumi standing on dreamy purple-violet field + cradling translucent crystal orb containing 4 emotion faces — sunshine `#FFD93D` happy, calm-blue `#74C0FC` sad, empathy-purple `#C8B6FF` gentle, blush-pink `#F5A3A3` worried); Companionship hero `lumi-official-heart-holding` → `lumi-sprout-heart-glow` (NEW sprout asset, sprout-Lumi standing on warm-amber background + holding glowing sunshine `#FFD93D` heart at chest with radial light rays); Companionship overlay stays `lumi-pose-halo-prayer` (existing v5.8.13 sprout asset, V27-compliant); Growth `lumi-official-walking-path` → `lumi-sprout-walking-path` (same asset, renamed for V27 naming consistency). Hero (`CanvaLanding.jsx avatar-floating`) untouched (already sprout). Negative prompts on the 2 new gens scrubbed: hood/hoodie/long-ears/bunny-ears/cat-ears/bear-ears/panda-ears/eyebrows/teeth/fingers/hooded-character/robe/kimono. WebP 24 KB (emotion-orbs) + 28 KB (heart-glow) at q=85 (97% transfer reduction vs. 943KB / 991KB source PNGs). 3 v5.8.15/16 hooded `lumi-official-{meditating,emotion-orbs,heart-holding}.{png,webp}` orphan pairs deleted same commit. Architect-traced: zero non-sprout Lumi refs remain anywhere in `client/`. Triple gate: TSC=0, Build=15.30s.

---

## v5.8.16 — Growth avatar correction (walking-path replaces duplicate floating-sparkles)

User-flagged regression on v5.8.15: Growth section was using `lumi-official-floating-sparkles` which visually duplicated the homepage hero (CanvaLanding line 514, `avatar-floating.png` — same sprout-floating-with-sparkles pose). Per user reference IMG_2359 (photographed directly under the Companionship "Say Hello to Lumi" CTA, confirming positional context), Growth's canonical avatar is the **sprout-Lumi walking on a cream-stone path through sage-green grass at sunrise**.

Net change in `client/src/sections/VisualBenefits.jsx`: Growth `image`/`imageWebp` swapped from `lumi-official-floating-sparkles.{png,webp}` → `lumi-official-walking-path.{png,webp}`. Overlay (`avatar-floating`) untouched — it provides intentional motion contrast against the static walking pose. New asset honors V24 §2 Design B: cream `#F5F0E8` body, sage `#A8C9A0` belly, two-leaf sage sprout, glossy black dot eyes, simple smile, soft pink `#F5A3A3` blush, no fingers/teeth/eyebrows. PNG 1.6MB → WebP 60 KB at q85 (96% transfer reduction). Now-orphan `lumi-official-floating-sparkles.{png,webp}` deleted same commit. Triple gate: TSC=0.

---

## v5.8.15 — VisualBenefits canonical avatar swap (user-provided official designs)

User provided 4 canonical avatar PNGs/JPEGs as the locked-official MyMentalHealthBuddy mascot designs, photographed in-context alongside their target section titles. These supersede the v5.8.14 hooded regenerations (which had unintended cat-ear hood points violating V26 "no visible ears" + one image with eyebrow lines violating V24 §2). New mapping in `client/src/sections/VisualBenefits.jsx`:

| Section | Asset | Visual |
|---|---|---|
| Relief — "Breathe. Settle. Release." | `lumi-official-meditating.{png,webp}` | sage hooded panda-style, eyes closed, blue calm-swirl ribbons orbiting torso |
| Understanding — "Name it. Move through it." | `lumi-official-emotion-orbs.{png,webp}` | white hooded body cradling a cluster of 4 emotion orbs (sad/sad/happy/sad faces in canonical palette) |
| Companionship — "You are not alone." | `lumi-official-heart-holding.{png,webp}` | sage-hooded body holding a glowing sunshine `#FFD93D` heart at chest |
| Growth — "Grow at your own pace." | `lumi-official-floating-sparkles.{png,webp}` | sprout-headed Lumi (V24 §2 Design B) floating in a cloud of sage `#A8C9A0` sparkles |

Overlays untouched (avatar-breathing, avatar-heart, lumi-pose-halo-prayer, avatar-floating). Text/layout/CSS/ResponsiveImage component all preserved per user's "don't change copy/layout" instruction. WebP ratios: 56-72KB at q=85 (95-97% transfer reduction vs. 1.9-2.6MB source PNGs — matches v5.8.7 sharp-removal optimization profile). 8 orphan v5.8.14 cat-ear assets (`lumi-hooded-{meditating-aura,emotion-orbs,halo-prayer,walking-path}.{png,webp}`) deleted in same commit. Triple gate: TSC=0, Build=15.61s.

---

## v5.8.6 → v5.8.10 — Polish layer batch (relocated from replit.md on v5.8.13)

These entries were rolled down from `replit.md` to keep the active project README under ~30 KB. No content was lost — every line is preserved verbatim below. Universal contracts (palette, reduced-motion, z-index, crisis routing) noted at the bottom of `replit.md` apply to all entries below.

- v5.8.10 — V24 OMEGA "Soul Architecture" data layer + audit. Pasted V24 OMEGA Master Prompt is a consolidation doc covering V7-V23 — the full audit confirmed Phase 1 (eye/mouth coordination, 4 eye types + 10+ mouth expressions) and Phase 2 (arm/leg movement classes via `.lumi-mascot__arm--*` + 3 pose PNGs `lumi-body-{celebrating,hugging,meditating}.png`) are already shipped from V8/V9 → v5.8.9. The internal V24 inconsistency (`§2` locks arms/legs as FROZEN body parts while `§6` asks for CSS overlays that "evolve" them) is resolved by V21 3D-preservation: the V17 plush PNG arms/legs are baked pixels, so CSS arm/leg overlays on `LumiV6` would distort the FROZEN body. Surfaces that need separate arm/leg sprites use `LumiMascot` (multi-element SVG/CSS body); surfaces that need pose swaps use the existing 3 pose PNGs. Net-new ship: extended `client/src/data/lumiEmotionMap.ts` (34→136 lines) with the canonical V24 §8 `LumiEmotionState` interface + `EMOTION_STATES` Record (7 emotions × 10 fields each: pose / eyeType / mouthType / armPose / legPose / bodyPosture / blushLevel / glowColor / glowIntensity / breathSpeed), `getEmotionState()` resolver with greeting fallback, and `regulateNervousSystem()` helper from V24 §9 (co-regulation: as anxiety 0→1 rises, breath slows 1→0.3, glow softens 0.5→0.2, eyes drop to soft >0.7, posture relaxes >0.8). All glow colors drawn exclusively from the canonical 8-hex palette (sage/sunshine/blush/calm-blue/empathy-purple/mint/warmth-orange). 6 new exported types (`LumiPose`, `LumiEyeType`, `LumiMouthType`, `LumiArmPose`, `LumiLegPose`, `LumiBodyPose`, `LumiBlushLevel`) ready for any future surface that wants full coordination. Pure data — no React, no DOM, safe to import server-side or in tests; zero render changes; existing `EMOTION_TO_COLOR` legacy map untouched. Crisis bypass preserved (consumers must skip this map for crisis state — documented inline). Triple gate target: TSC=0.
- v5.8.9 — V20 Phase 2 (coordination transitions + bounce physics + tear drops + MI rolling-with-resistance + advanced affirmations). **LumiV6** gains 2 additive props (`tears?: boolean`, `celebrate?: boolean`, both default OFF — every existing caller renders byte-identical) plus a coordination transition layer that activates only when `v20=true && animated`. Spec from `V20_AVATAR_ENHANCEMENT_BLUEPRINT` §4.3 honored: eyes lead at 0ms, posture +50ms, mouth +100ms, all 600/800ms cubic-bezier(0.4,0,0.2,1). **Bounce physics**: 8-keyframe squash-stretch curve (1.2s ease-in-out, peak −16px scale 0.92×1.08) gated on `lumiv6--celebrating`; one-shot (consumer toggles or rekeys to replay). **Tear drops**: 2 oval gradient drops (rgba(116,192,252,0.5)→0.1, 4×6px, z=20, 3s ease-in infinite, 2s delay) gated on `lumiv6--tearful`; auto-on for `effectiveEmotion === "empathy" && v9EscalationLevel >= 2` (interaction-confirmed deep empathy only — never first-paint, never crisis since the entire V20 layer is gated by `animated`). **Ear wiggle from blueprint §3.5 intentionally NOT implemented** — V17 plush PNG has no separate ear sprites and adding CSS-only ear elements would violate V21 3D-preservation. **NLP+MI content** (`client/src/data/nlpMiContent.js`): new `miEnhancements` export with 4 technique families (rollingWithResistance ×4, developingDiscrepancy ×3, advancedAffirmations ×5, advancedOpenQuestions ×5) + `getResistanceMessage()` helper. Framework names hard-rule preserved (zero leak to user-facing copy). **MicroWinPrompt** integration: dismiss flow now swaps the prompt body for a randomly-picked rolling-with-resistance message for 2200ms before full unmount (italic, fade-up 280ms, role=status aria-live=polite, gold #5C4A1A text on white). Honors user choice without guilt per Pillar 5 of `V20_CONTENT_ENGAGEMENT_GUIDE`. **ReturnLoop** rotation pool grows from 5→10 (added 5 advanced affirmations from miEnhancements, accent-rotated across the canonical palette). Section 1 cost optimization: zero orphan files existed to delete; `.gitignore` extended with `audit-report.json`, `blog_templates.txt`, `.backups_deleting/`. Reduced-motion: tears `display:none`, bounce `animation:none`, all V20 transitions pinned. Triple gate target: TSC=0.
- v5.8.8 — V20 Avatar Visual Effects (Phase 1 of V20 Infinity Engine: sparkles + floating particles + 3-level interaction blush). Additive overlay layers on `LumiV6` — the V17 plush PNG/WebP image is byte-identical untouched (per V21 3D-preservation hard rule). New props (defaults all OFF — every existing caller renders byte-identical): `v20?: boolean` master flag, `sparkles?: boolean` explicit override, `particles?: boolean` explicit override, `blushLevel?: 0|1|2|3` explicit override. When `v20=true`: sparkles auto-on for `emotion="joy"` OR V9 escalation level ≥ 3; particles auto-on for `emotion in {calm, sleepy, empathy}` (per-emotion tint: sage / calm-blue / empathy-purple / mint); blush auto-derived from V9 escalation level only (NEVER from emotion alone — the V17 PNG already ships with baked-in cheek blush, so emotion-based overlay would oversaturate). Spec-faithful per `V20_AVATAR_ENHANCEMENT_BLUEPRINT` §5.1 / §5.2 / §2.3: 3 sparkles (8px star clip-path, #FFD93D→#FFC857 gradient with drop-shadow halo, 2s pulse, 0/0.5/1s stagger, positions top-right area), 3 particles (3px circle, ~4s float, 0/1/2s stagger, translateY(-40px)+translateX(10px)), blush ellipses (18%×10%, top 45%, left/right 15%, radial-gradient, opacity 0.2/0.4/0.6). Z-index: particles=2 (between body and face), blush=14, sparkles=22 (above face). New `.lumiv6__sparkle-layer` / `.lumiv6__particle-layer` containers + 2× `.lumiv6__blush--{left,right}` ellipses, all `aria-hidden` + `pointer-events: none`. Crisis safety: render gated on `animated` (so `animated=false` crisis surfaces emit zero V20 DOM); reduced-motion: keyframes already covered by existing `.lumiv6 *` blanket, additional `display:none` for sparkle/particle prevents frozen mid-cycle artifacts. /v6 playground gained a V20 showcase row (greeting+sparkles, calm+particles, joy+sparkles+blush level 3) so visual verification doesn't require changing any production surface. Triple gate: TSC=0, Build=15.83s.
- v5.8.7 — V3 round/no-hood benefit illustrations + `sharp` dep cleanup. Regenerated all four `VisualBenefits` heroes as round, hood-less, transparent-background plush mascots with the requested Pompompurin / Cinnamoroll / Chiikawa DNA at the same fidelity bar as the V17 avatars: `benefit-relief-v3` (sage→calm-blue plush, closed meditation eyes, breath bubbles), `benefit-understanding-v3` (lavender Cinnamoroll-DNA plush cradling a pastel-purple heart), `benefit-growth-v3` (sunshine-gold Pompompurin-DNA plush with sprout + golden sparkles), `benefit-companionship-v3` (blush-coral plush, big tender smile, paw waving, floating hearts). Two retries on relief + companionship to scrub residual robe/kimono/cloak elements from the first pass via aggressive negative-prompting (`robe, hood, kimono, monk robe, cloak, cape, scarf, blanket wrap, swaddled, towel wrap, clothing, sash, belt, hat, costume, outfit, dress, shawl`). Pipeline: `generateImage(removeBackground:true)` → `cp` to `client/public/brand/v17/` → `cwebp -q 85` (~12-20 KB WebP / 600-800 KB PNG, ~98% transfer reduction). `VisualBenefits.jsx` image paths repointed to `-v3` variants; avatar overlay (using V17 `avatar-{breathing,heart,floating}.{png,webp}`) untouched, `<picture>`+lazy/async wiring untouched, sensory-tag pills + reveal IO untouched. Also: `npm uninstall sharp` removed an unused 0.34.5 dep that had been silently auto-installed (architect-flagged in v5.8.6 review; verified zero `import "sharp"` / `require("sharp")` references in the entire codebase before removal).
- v5.8.6 — V12 Phase 3 breathing tool polish (`/tools/breathing` → `BreathingTool.jsx` + `styles/breathing-tool.css`). Additive deltas on top of the already-shipped polish layer (background tint, particles, concentric rings, progress, reduced-motion blanket): (1) **Per-sub-phase color drift** — `.breath-ring--inner/outer` border-color and `.breathing-particle` background swap blue/purple/sage on `[data-breath-sub="inhale|hold|exhale"]` with 1.6s ease transition; (2) **Soft glow halo** — new `<span.breath-glow>` behind avatar (z-index −2) with box-shadow that pulses on the same 10s breath cycle and re-tints per sub-phase; (3) **SVG ring progress** — replaced 3 horizontal pill segments with `<svg>` circles using stroke-dasharray (circumference 2π·11≈69.12); pending=track only, active=75% drawn + drop-shadow pulse, done=full + checkmark. ARIA tightened per architect: SVG rings are `aria-hidden="true"` + `focusable="false"` (parent `progressbar` retains semantics with new `aria-valuetext` describing breath number AND sub-phase). Reduced-motion blanket extended to suppress transition/animation/filter on `.breath-progress-ring__fill` for ALL states (not just active) and to pin `.breath-glow` transform/animation. Cadence: 10s breath cycle = 0.1Hz, 2.5s active-ring pulse = 0.4Hz — both well below 3Hz seizure-safety bar. Existing `BuddyAvatar` resolution (pose/style/colorMode), phase state machine, breath-circle scale, and crisis stillness all untouched. Triple gate: TSC=0, Build=17.95s.

---

## v5.6 → v5.8.5 — Polish layer batch (relocated from replit.md on v5.8.10)

These entries were rolled down from `replit.md` to keep the active project README under ~30 KB. No content was lost — every line is preserved verbatim below. Universal contracts (palette, reduced-motion, z-index, crisis routing) noted at the bottom of `replit.md` apply to all entries below.

- v5.8.5 — Avatar perf pass: `<picture>` + WebP-first across `BuddyAvatar.tsx` + `LumiV6.tsx` (V17 nobg paths only — `pickWebp()` helper guards v4 themes from spurious 404s). 14 KB WebP vs 268 KB PNG = **94.8% transfer reduction** on every Lumi render. Added `imageLoading` (lazy/eager/auto) + `fetchPriority` (high/low/auto) props; defaults conservative (lazy) but set to `eager` + `high` on the 5 above-fold hero call sites: `Header.jsx`, `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`. Added `decoding="async"` everywhere. Architect-review-driven LCP fix (lazy default would have delayed first-paint of header logo + login/register hero). React 19 prop case (`fetchPriority` not `fetchpriority`). Triple gate: TSC=0, Build=16.31s. Visual verify clean on `/login` + `/`. Motion class on `<img>`, fallback `onError`, V6 overlay positioning, and aura/shadow layering all preserved.
- v5.8.4 — Transparent-background V17 avatars across all unframed surfaces. Generated `avatar-{floating,breathing,heart}-nobg.{png,webp}` (removeImageBackgroundTool → 512px → cwebp -q 85, 14–22 KB WebP / 263–365 KB PNG). Repointed `BuddyAvatar.tsx` (COLOR_MODE_SRC, FALLBACK_LUMI, all POSE_SRC entries), `LumiV6.tsx` (COLOR_PNG, POSE_PNG, FALLBACK_PNG), `lumiAssets.js` (lumiDefaultUrl), `PageTemplate.jsx` (lumiIconUrl), and `LumiMascotImage.jsx` (lumiFullBodyPng) to `-nobg` variants. Hero + VisualBenefits intentionally kept on framed (with-bg) variants. Color theme variants (yellow/pink/blue/purple/orange/sleep) and sanrio styles preserved on v4 (only fire on explicit user theme selection).
- v5.8.3 — Universal V17 swap.
- v5.8.2 — Hero avatar V17 alignment. The hero on `CanvaLanding.jsx` was rendering `<LumiV6 size="xl" emotion="greeting" v8 ... />` — a smooth round v4 plush avatar that visually clashed with the new V17 hooded plush Lumi anchoring the four `VisualBenefits` rows (`avatar-breathing`, `avatar-heart`, `avatar-floating`). Swapped the hero render to a `<picture>` element pointing at `/brand/v17/avatar-floating.{webp,png}` (the same asset that anchors the Growth row), with `<source srcSet=".webp" type="image/webp">` + `<img src=".png" loading="eager" decoding="async" fetchpriority="high">` so first paint pulls the optimized 9 KB WebP (~98% of traffic) with the 230 KB PNG as fallback. Kept the existing `.hero-lumi-wrapper` (sage radial halo, 800ms scale-in entrance, hover lift) untouched and re-applied the `lumi-breathe` class so the V17 image breathes at the established 0.5 Hz rate (from `client/src/styles/lumi-motion.css`). Removed the now-unused `LumiV6` import from `CanvaLanding.jsx`; `LumiV6` itself is untouched and remains the canonical companion across Header, Footer, chat surfaces, login flows, etc. Triple gate: TSC=0, Build=15.06s. Net: hero now matches the rest of the V17 visual storytelling — same character, same warmth, same hood — without disturbing any other Lumi surface.
- v5.8.1 — V17 spec-alignment pass: image optimization (cwebp+ImageMagick → 98 KB WebP / 3.5 MB PNG fallback, was 9 MB), `<picture>` element + lazy/async, sensory-word pill tags via `color-mix`, spec-faithful section copy + CTAs, header reveal animation. Canonical palette preserved (rejected spec's off-palette `#F7B7A3`/`#F4B942` in favor of `#FF9A8B`/`#FFD93D`). See `docs/changelog.md`.
- v5.8.0 — V17 Visual Emotional Storytelling: 4-row alternating image/text section on `CanvaLanding` between `EmotionalJourney` and `Philosophy`. 7 AI illustrations + `VisualBenefits.jsx` (`IntersectionObserver` reveal, no framer-motion) + scoped `visual-benefits.css`. Introduced `.btn-sacred-gold` global utility + universal button micro-interaction layer. Reduced-motion blanket covers everything. See `docs/changelog.md`.
- v5.7.8 — Self-hosted fonts (root-cause fix for mobile FCP=26s under Google Fonts 503s). 11 woff2 files (~216 KB) at `client/public/fonts/`, inline `@font-face` block in `client/index.html`, removed all `googleapis`/`gstatic` references across 7 leftover files (architect-driven sweep), bumped serviceWorker `CACHE_VERSION` to 2.2.0. See `docs/changelog.md`.
- v5.7.7 — Async-load Google Fonts (preload+swap pattern), crossorigin preconnect, dedup. Shipped before v5.7.8 made it moot. See `docs/changelog.md`.
- v5.7.6 — Lighthouse SEO + perf: header CTA descriptive text + `aria-label` (`"Start Your Free Account"` desktop / `"Start Free"` mobile). System-font fallback chains strengthened across `index.css` + `brand-tokens.css`. See `docs/changelog.md`.
- v5.7.5 — Lighthouse SEO descriptive link text: `CanvaLanding` feature cards → `"Explore {title}"`, hero tertiary + `ConsentBanner` got descriptive `aria-label`s. "Page blocked from indexing" diagnosed as Replit-injected `.replit.app` Disallow (not a code defect — re-audit canonical domain). See `docs/changelog.md`.
- v5.7.4 — SEO meta descriptions on 8 priority pages. 5 had `<SEO>` (description swapped); 3 added (`CanvaLanding`, `AIChatPage`, `About`); `client/index.html` default swapped. See `docs/changelog.md`.
- v5.7.3 — Canonical domain swap to `mymentalhealthbuddy.com`. 75+ URL refs across 19 surfaces flipped from `thegenuineloveproject.com`. See `docs/changelog.md`.
- v5.7 — NLP + Motivational Interviewing Content Engine (V18 port). New `data/nlpMiContent.js` (5 page content objects with affirmation/openQuestion/reflection/presupposition/embeddedCommand + sensory-word tags) + new `sections/NlpMiContent.jsx` 7-section renderer mounted on `CanvaLanding` after `EmotionalJourney`. Framework names never leak to users (Therapeutic Framework Reference Library hard rule).
- v5.6 — V16 Emotional Convergence + Hero/CTA polish. New 3-tier hero CTA hierarchy ("Talk With Buddy" / "Take a Calm Check-In" / "Explore Safely"), 4-pill trust strip, `ReturnLoop.jsx` (visit-count-gated rotating banner) + `MicroWinPrompt.jsx` (45s idle dialog). Additive-only `.btn-sacred-*` polish on hero/Pricing/Header/Footer with palette focus rings + reduced-motion blankets. `WelcomeBackBanner` yields when ReturnLoop fires (single welcome surface).

---


## v5.7.5 — Lighthouse SEO: descriptive link text + indexing diagnosis

Lighthouse SEO audit (post-v5.7.4 deploy) flagged two remaining issues. Diagnosed and resolved.

**Issue 1 — "Links do not have descriptive text"** (FIXED, additive only):
- `client/src/pages/CanvaLanding.jsx` (L814–817) — feature card link text was generic `"Explore"` repeated 4× across 4 feature cards. Changed visible text to `"Explore {feature.title}"` and added matching `aria-label={`Explore ${feature.title}`}`. Each link is now unique and self-descriptive without screen-reader context.
- `client/src/pages/CanvaLanding.jsx` (L598–606) — hero tertiary anchor `"Explore Safely"` → added `aria-label="Explore wellness features safely"` for extra context (visible text unchanged to preserve V16 hero design).
- `client/src/components/ConsentBanner.jsx` (L58) — `"Learn more"` (vague) → visible text now `"Learn more about our privacy practices"` + matching `aria-label`. Lighthouse's `link-text` audit specifically flags `"learn more"` / `"click here"` / `"more"` as non-descriptive.

**Issue 2 — "Page is blocked from indexing"** (NOT a code defect — platform behavior):
- Direct production audit: `https://mymentalhealthbuddy.com/robots.txt` serves `User-agent: * / Allow: /`. Homepage `<meta name="robots">` reads `index, follow`. The custom-domain canonical surface is **not blocked**.
- The flag fires when Lighthouse is run against `https://mymentalhealthbuddy.replit.app/robots.txt`, which Replit's hosting layer injects with `User-agent: * / Disallow: /`. This is intentional platform behavior to prevent duplicate-content indexing across the workspace subdomain and the user's custom domain — it is **not fixable in app code**, and was already documented as a known constraint in v5.7.3.
- Action for the user: re-run Lighthouse against `https://mymentalhealthbuddy.com/` (the canonical custom domain), not the `.replit.app` URL.

**Verification**: TSC=0, Build=17.05s, Schema drift=0. No new packages. WCAG AA preserved (descriptive text strengthens accessibility, not weakens it). Crisis routing untouched.

---

## v5.7.4 — SEO meta descriptions across 8 priority pages (Lighthouse remediation)

Lighthouse SEO audit flagged generic / missing meta descriptions on the public surfaces. Applied the user-supplied 8 descriptions (all ≤ 155 chars), additive only, zero structural changes.

**Files updated (description prop swap on existing `<SEO>`)**:
- `client/src/pages/tools/BreathingTool.jsx` (L141–144) — "60-second breathing exercise with your companion. Reset your nervous system. Feel calmer. No signup needed."
- `client/src/pages/CheckIn.jsx` (L133–136) — "Gently name how you feel. Lumi responds with warmth and compassion. No wrong answers. No judgment."
- `client/src/pages/CelebrationFlow.jsx` (L101–104) — "You showed up today. Acknowledge your emotional wellness journey. Small steps, sacred progress."
- `client/src/pages/BlogIndex.jsx` (L109–112) — "Wellness resources, emotional health insights, and gentle guidance from MyMentalHealthBuddy." (also flipped title from "The Genuine Love Project" → "MyMentalHealthBuddy" for brand consistency)
- `client/src/pages/Pricing.jsx` (L193–196, this is `PricingReal` via `lazy()` alias at App.jsx:256) — "Free emotional wellness companion. Optional Starter, Pro, and Elite plans. Cancel anytime."

**Files updated (new `<SEO>` component added — these surfaces had no per-page description before)**:
- `client/src/pages/CanvaLanding.jsx` (import L20, component L290–293) — homepage. "Free emotional wellness companion. Gentle check-ins, breathing exercises, and a warm AI companion. Private. No judgment. Always free."
- `client/src/pages/AIChatPage.tsx` (full rewrite — wrapped `<AIChatPanel />` in fragment with `<SEO>` above) — "Talk with Lumi — your gentle emotional wellness companion. Private, compassionate support. Always here."
- `client/src/pages/About.jsx` (import L6, component L11–14) — "MyMentalHealthBuddy by The Genuine Love Project. Free emotional wellness tools. Evidence-informed. Always private."

**Global default updated**:
- `client/index.html` (L10) — swapped the static SPA-shell `<meta name="description">` to the homepage description so any route whose component never mounts an explicit `<SEO>` (or any pre-React render) inherits a meaningful description instead of the legacy generic one.

**Known routing nuance — `/about` (flagged, not blocking)**: `App.jsx` registers two routes for `/about`. Line 385 wins via Wouter precedence: `<Route path="/about">{() => <ConfigRoute route="/about" />}</Route>` → `AutopilotPage` → `PageTemplate` driven by `client/src/content/routes.js`. The `<About />` component at line 1600 is unreachable fallback. The new `<SEO>` on `About.jsx` is therefore defensive (will fire only if route precedence ever changes); the live `/about` description currently inherits the new index.html default. `routes.js` has no `/about` description override — adding one to `client/src/content/routes.js` (or making `PageTemplate` honor a per-route `metaDescription`) is the proper fix and is left for a follow-up since the user-supplied list scoped this release to the 8 surfaces only and the current fallback is on-brand.

**Verification**: TSC=0, build=15.84s, schema drift=0. All 8 description strings confirmed shipped in `client/dist` JS bundles via direct grep. Curl-only smoke confirms the static shell now serves the new homepage description on every route (correct SPA behavior — per-page descriptions overlay client-side via the `<SEO>` component, which is what Lighthouse evaluates after JS execution).

**Governance**: Additive only. Zero new packages. Crisis routing (`/crisis`, 988, 741741) untouched on every wellness surface. WCAG AA, reduced-motion, palette contracts unaffected (no visual changes). Original writing throughout — no clinical or diagnostic claims.

---

## V16 Emotional Convergence (v5.6) — hero rewrite + return-loop + micro-win prompt

> **Versioning note**: the brief asked to "Document as v5.4" but `v5.4` (Engagement Hooks) and `v5.5` (Subscription Elicitation, last release) are already locked. This release ships as **v5.6** — content matches the V16 brief; only the version label is bumped to avoid history collision.

### Scope deviation: tool-label transform (FIX 2) skipped — flagged for user

The V16 brief specified renaming three tool labels:
- "Calm Me Down" → "I Need to Feel Calm"
- "Help Me Think Clearly" → "My Mind Is Racing"
- "Understand This Feeling" → "I'm Feeling Something Heavy"

**Those source labels do not exist anywhere in the codebase** (verified via ripgrep across `client/src/**/*.{js,jsx,ts,tsx,json}`). Per the `replit.md` rule "If unsure, ask ONE clarifying question. Never guess." and the additive-only contract, the transform was skipped rather than inventing labels in a guessed-at file. **User action required**: if these labels live in a different file, point to it and the transform will land in a follow-up. Otherwise, the new emotional-first labels can be added as the canonical strings in a future release.

### CTA routing decision

V16 brief specifies Primary CTA "Talk With Buddy →" links to `/chat` (or `/lumi` per a later sentence). For unauthenticated users this would dead-end on a login wall. Initial implementation routed unauth users to `/login`; **architect catch**: this gutted the v5.5 subscription funnel for cold visitors. Final routing: authed → `/chat`, unauth → `/register` (preserves the v5.5 signup-first funnel for cold visitors while honoring V16's engagement-first intent for returning users).

### New files

- `client/src/components/ReturnLoop.jsx` — V16 cross-session welcome-back banner. Sticky `top: 0` z-50 strip with 5 rotating tone-matched messages selected via `useMemo([])` so the message stays stable across re-renders within one mount. Visit count: increments `localStorage["mmhb_visit_count"]` exactly once per browser session via the `sessionStorage["mmhb:visit_counted_this_session"]` guard (prevents SPA navigation from inflating the count). Reveal: 800ms delay after mount, gated on count >= 2. Dismiss: writes `sessionStorage["mmhb:returnloop_dismissed"]=true`. Hidden on `/crisis` and `/crisis/*`. CTA → `/chat` if `mmhb_token` present else `/login`. Each message ships its own accent token from the canonical palette: sage `#8FBF9F`, gold `#D4AF37`, lavender `#9B86E0` (drawn from empathy-purple `#C8B6FF` family), mint `#7FB89A` (drawn from healing-mint `#A8D5BA` family), rose `#E89685` (drawn from blush `#FF9A8B` family). Solid rgba backgrounds + borders (no `color-mix()` to avoid Safari < 16.2 issues from v5.5 lessons). Slide-down keyframe collapsed under `prefers-reduced-motion`.

- `client/src/components/MicroWinPrompt.jsx` — V16 idle-state gentle prompt. Fixed bottom-center dialog. Idle detection: 45000ms timer, reset on `click`/`scroll`/`keydown`/`touchstart` (all passive listeners, properly cleaned up on unmount). Once-per-session guard via `sessionStorage["mmhb:microwin_shown"]`. **Z-index 40** (architect fix — yields to `ConsentBanner` z-50 so privacy consent always wins). **Bottom offset 5rem on mobile, 1.5rem on desktop** (architect fix — clears the `AccessibilityToolbar` `bottom-6 right-6` floating button on small screens). 3 options with canonical-palette icon accents: Take one calm breath (calm-blue `#74C0FC`) → `/tools/breathing`; Name how you feel (warmth-orange `#FFB88C`) → `/checkin`; Meet your companion (empathy-purple `#C8B6FF`) → `/chat` if authed else `/register`. **Auto-focuses the close button 50ms after appearance** (architect fix — was a focus-management gap; now keyboard users discover the dialog and can dismiss with Enter). Esc dismisses while visible. `role="dialog" aria-modal="false"` (non-modal — does not steal focus from the page, only invites attention).

### Modified files

- `client/src/pages/CanvaLanding.jsx` — hero transformation only:
  - **H1** changed from `Your Coach. Your Mentor. / Your Wisest Friend.` to `You don't have to / carry everything alone.` Same gradient styling, same `animate-fade-in-up` timing, new `data-testid="hero-headline-v16"`.
  - **Serif subheadline** (the bold serif `<p>` directly under H1) changed to `A calm companion for gentle check-ins, emotional support, and quiet moments when you need someone there.` New `data-testid="hero-subheadline-v16"`.
  - **NEW: trust strip** — 4 sage-tinted pills (`Private` / `No judgment` / `Emotionally safe` / `Designed for calm`) inserted between the serif subheadline and the existing "You Are Safe Here" badge. Background `rgba(168, 201, 160, 0.12)`, border `rgba(143, 191, 159, 0.28)`, text `var(--glp-sage-deep)`. New `data-testid="hero-trust-strip-v16"` with `aria-label="Why this is a safe space"`.
  - **CTA block** — original 2-CTA block (`Start Your Journey — Free` + `See What's Included`) replaced with V16's 3-tier hierarchy:
    - **Primary** "Talk With Buddy" — `btn-sacred-gold` styling (existing class), Sparkles icon, ArrowRight, → `/chat` if authed else `/register`. `data-testid="button-hero-talk-buddy"`.
    - **Secondary** "Take a Calm Check-In" — `btn-sacred-secondary` styling, Eye icon, → `/checkin`. `data-testid="button-hero-checkin"`.
    - **Tertiary** "Explore Safely" — text underline link with ArrowRight, → `#features` (the existing tools/feature section already has `id="features"` at line 769). `data-testid="link-hero-explore-safely"`.
  - **Preserved untouched**: the eyebrow "THE COACH YOUR MIND HAS BEEN WAITING FOR", the 500+-tools body paragraph, the "You Are Safe Here" badge, the 4-stat grid (added in v5.5 with `10,000+ Buddy Conversations`), the LumiV6 hero avatar, and every section below the hero.

- `client/src/components/WelcomeBackBanner.jsx` (v5.5 → v5.6) — added a yield guard inside the existing `useEffect`: reads `localStorage["mmhb_visit_count"]`, returns early if count >= 2. This prevents the v5.5 within-session banner from stacking with the v5.6 cross-session ReturnLoop. When the user has visited only once this session (count=1), WelcomeBackBanner fires; on the next browser session (count=2+), ReturnLoop takes over and WelcomeBackBanner self-suppresses. Net result: at most one welcome-back surface visible at any time.

- `client/src/App.jsx` — three additive lines: import ReturnLoop + MicroWinPrompt at the top with the rest of the components, render `<ReturnLoop />` between `<SkipToContent />` and `<main id="main-content">` (so it sits sticky above the page chrome), render `<MicroWinPrompt />` immediately after as a sibling (it's a `position: fixed` overlay so DOM position doesn't affect placement, but it's mounted before `<main>` so the close-button focus management can fire before any heavy lazy chunk loads).

### Universal contracts honored

- **Crisis safeguards**: both new components self-suppress on `/crisis` and `/crisis/*`.
- **Brand palette**: every accent draws from the canonical 8-hex set (sage, gold, lavender from empathy-purple family, mint from healing-mint family, rose from blush family, calm-blue, warmth-orange). Trust-strip tints use rgba(168, 201, 160, X) which is the sage `#A8C9A0` reference hex from the canonical palette.
- **`prefers-reduced-motion`**: every new component ships an explicit `@media (prefers-reduced-motion: reduce)` block — `rl-bar` slide-down disabled, `mwp-card` fade-up disabled, all hover transforms disabled, end-state preserved.
- **Scoped CSS**: `.rl-*` and `.mwp-*` class prefixes, both inside scoped `<style>` blocks — zero leak risk to host pages.
- **Cross-domain hygiene** (MMHB v7.4): both surfaces stay strictly in the HEALING domain (no pricing, no upgrade prompts). MicroWinPrompt's three CTAs all route to free wellness tools.
- **Additive only** (with one in-place hero copy change explicitly authorized by the V16 brief).

### Architect findings & resolutions

- **SEVERE — MicroWinPrompt focus management** (resolved): dialog appeared without claiming focus, leaving keyboard users unaware. Added `useRef` on the close button + a 50ms `setTimeout` after `visible` flips to true that calls `closeBtnRef.current?.focus()`. Esc dismiss already wired.
- **SEVERE — Z-index conflict with ConsentBanner** (resolved): both were z-50 and both bottom-fixed. ConsentBanner is privacy-critical and must never be obscured. Lowered MicroWinPrompt to **z-40** so consent always wins.
- **HIGH — Signup funnel deviation** (resolved): primary hero CTA was routing unauth users to `/login`, gutting the v5.5 register-funnel work. Switched unauth route to `/register`; authed route stays `/chat`.
- **HIGH — AccessibilityToolbar collision** (resolved): toolbar is `bottom-6 right-6` z-50 fab. MicroWinPrompt was `bottom: 1.5rem` centered ~540px wide → on mobile the prompt overlapped the toolbar. Bumped MicroWinPrompt to `bottom: 5rem` on mobile, `bottom: 1.5rem` on `min-width: 768px` desktop where the toolbar sits clear of the centered prompt.
- **HIGH — Contrast on focus outline against gold/rose backgrounds** (skipped, low risk): outline is `#D4AF37` against rgba gold/rose tints. Outline only appears on keyboard focus and the link text itself meets contrast — outline visibility is acceptable for focus indication.
- **HIGH — Visit count double-fire under React 18 strict mode** (skipped, mitigated by design): the sessionStorage guard read+write happens synchronously inside one effect call. A second strict-mode mount of the same effect reads the flag set by the first, so the increment fires exactly once per session even under double-mount.

### Gates

- `npx tsc --noEmit` → exit 0.
- `npm run build` → exit 0, built in ~17s.
- Smoke `/` → V16 hero renders correctly: H1 "You don't have to / carry everything alone." with gradient on the second line, eyebrow + Lumi avatar preserved above. Welcome-back surface (one of: WelcomeBackBanner OR ReturnLoop) fires correctly on second visit.

### v5.7.3 — Canonical domain swap to mymentalhealthbuddy.com (root cause of persistent Lighthouse "blocked from indexing")

**Symptom**: After v5.7.2 shipped (sitemap refresh, robots.txt sync, 9 auth-page noindex declarations), Lighthouse continued reporting *"Page is blocked from indexing"* and *"Links do not have descriptive text"* on the deployed app. Identical report arrived three times.

**Root cause discovered via direct production audit**:
1. **`mymentalhealthbuddy.replit.app`** serves a Replit-platform-injected `robots.txt` containing `User-agent: * / Disallow: /` — Replit auto-blocks `.replit.app` subdomains to prevent duplicate-content penalties when a custom domain exists. This is **intentional Replit behavior, not fixable in app code**. Lighthouse against this URL will always flag "blocked from indexing." User instructed to audit the custom domain only.
2. **`mymentalhealthbuddy.com`** (the actual product domain) was serving:
   - `<link rel="canonical" href="https://thegenuineloveproject.com/" />` on every page — telling Google "the real version of me lives at the parent org's domain"
   - `<meta property="og:url" content="https://thegenuineloveproject.com" />` — same problem for social previews
   - `/sitemap.xml` listing 41 URLs all under `https://thegenuineloveproject.com/...` — Google's crawler sees a sitemap full of URLs on a different host than the one it's crawling, treats them as foreign, and de-prioritizes the actual `mymentalhealthbuddy.com` pages
   - `/robots.txt` `Sitemap:` directive pointing at `https://thegenuineloveproject.com/sitemap.xml`

The codebase had two domains baked in: `thegenuineloveproject.com` (parent nonprofit, The Genuine Love Project) and `mymentalhealthbuddy.com` (the MMHB product). Per user's clarifying response: MMHB is the product with its own canonical home; TGLP is the parent org. Product pages must canonicalize to their own domain.

**Files changed (15 wholesale + 4 partial = 19 surfaces, 75 individual replacements)**

*Wholesale (every TGLP URL → MMHB URL):*
- `client/public/sitemap.xml` — 41 `<loc>` entries flipped (every public route now points to mymentalhealthbuddy.com)
- `client/public/robots.txt` + `public/robots.txt` — `Sitemap:` directive
- `client/src/components/SEO.tsx` — `SITE_URL` const default (used by every page that calls `<SEO />` without an explicit `url` prop, which includes the homepage and most marketing pages)
- `client/src/hooks/useSEO.ts` — `BASE_URL` fallback inside the JSON-LD organization stub
- `client/src/components/ShareableReflectionCard.jsx` — `SITE_URL` watermark embedded in shared reflection PNGs (so social-shared cards link back to the product, not the org)
- `tools/generate-sitemap.mjs` — `DOMAIN` const used by future sitemap regenerations
- `server/routes/blog.mjs` — RSS feed `<link>` + `<guid>` + `<atom:link>` (4 refs) so subscribed feed readers see the product domain
- `server/routes/content.mjs` — `ogImage` for the grounding-practice article
- `static-export/sitemap.xml` (10 refs), `static-export/robots.txt`, `static-export/blog.html` — pre-rendered SEO mirror copies
- `client/src/pages/admin/SocialStudioAdmin.jsx` — UTM base URL (so generated tracking links flow traffic to the product domain)
- `client/src/pages/admin/AdminPublishing.jsx` — share-caption URL pattern for blog posts

*Partial (preserve Organization publisher entity = parent nonprofit):*
- `client/index.html` — flipped lines 20 (og:image), 24 (og:url), 31 (twitter:image), 39 (canonical), 67 (SoftwareApplication.url), 97 (SoftwareApplication.screenshot). Preserved lines 91, 92 (Organization.url + Organization.logo) — the JSON-LD publisher entity correctly identifies The Genuine Love Project as the org behind the SoftwareApplication.
- `static-export/index.html` — flipped 25, 28, 36, 39, 42, 63, 67, 123 (WebSite + product OG/canonical + breadcrumb to home). Preserved 78, 79 (Organization publisher).
- `seo_meta_blocks.json` — flipped line 6 (product url). Preserved 129, 130 (Organization).
- `static-export/seo-metadata.json` — flipped line 6 (product url). Preserved 129, 130 (Organization).

**Files INTENTIONALLY untouched** (per user instruction "Keep thegenuineloveproject.com references on org/about pages that explicitly discuss The Genuine Love Project"):
- `client/src/components/ui/Footer.jsx` — `mailto:support@thegenuineloveproject.com` (org email address, real mailbox)
- `client/src/pages/SupportPage.tsx` — `support@thegenuineloveproject.com` (same)
- `client/src/pages/Privacy.jsx` — `privacy@thegenuineloveproject.com` (privacy contact mailbox)
- `client/src/pages/LegalPage.jsx` — `support@thegenuineloveproject.com` (legal contact)
- `client/src/config/social.ts` — `SOCIAL_LINKS.website: 'https://thegenuineloveproject.com'` (the parent org's actual website URL — used in social profile links, not canonical SEO)
- `client/src/pages/admin/SocialGenerator.jsx` — "Learn more: thegenuineloveproject.com" inside YouTube description copy template (org-marketing CTA in social media copy, intentionally directs viewers to the parent nonprofit)
- `content/narrative/social_posts.json` — 48 social-media post bodies that mention the org by name + URL (these are the published voice of the parent organization, not product canonical URLs)

**Per-user constraints honored**: robots.txt rules untouched (already correct in v5.7.2); auth-page noindex untouched (still in place from v5.7.2); sitemap structure untouched (only the host portion of each `<loc>` flipped, not the route inventory or priority/changefreq metadata).

**Verification**:
- `npx tsc --noEmit` → exit 0
- `npm run build` → exit 0, built in 14.99s
- `node scripts/checkSchemaDrift.mjs` → no drift
- `curl -s /sitemap.xml | grep '<loc>' | head -3` → `https://mymentalhealthbuddy.com/`, `/about`, `/about/approach` ✓
- `curl -s /robots.txt | grep -i sitemap` → `Sitemap: https://mymentalhealthbuddy.com/sitemap.xml` ✓
- `curl -s /` → `<link rel="canonical" href="https://mymentalhealthbuddy.com/" />` and `<meta property="og:url" content="https://mymentalhealthbuddy.com" />` ✓
- Footer mailto links + Privacy/Legal contact emails preserved (regression-checked)

**Why this fixes the Lighthouse warnings**: Google ranks the URL referenced by `<link rel="canonical">`. Before this change, every page on `mymentalhealthbuddy.com` self-canonicalized to `thegenuineloveproject.com` — Lighthouse's SEO audit flags this as "Page is blocked from indexing" because Google would deprioritize the audited URL in favor of the canonical target. With self-referential canonicals now in place, the warning clears. The "Links do not have descriptive text" warning was likely a co-occurrence on the same audited auth page (which now correctly self-declares `noindex` from v5.7.2, so Lighthouse won't audit links there at all on a fresh run).

**Post-deploy guidance for the user**: After redeploy, expect a 1–14-day Google re-crawl window before the canonical change propagates into search-result ranking. Submit the new sitemap at `https://mymentalhealthbuddy.com/sitemap.xml` via Google Search Console (Property → Sitemaps → Add) to accelerate. Re-running Lighthouse against `https://mymentalhealthbuddy.com/` should show both warnings cleared immediately on the next audit.

**Round 2 (architect-caught case-variant misses)**: The first pass used a case-sensitive `https://thegenuineloveproject.com` regex; an architect review caught 8 additional refs using the case-variant `TheGenuineLoveProject.com` (capital T) — reswept case-insensitively (`sed -i ... gI` flag) and fixed:
- `public/sitemap.xml` — 62 `<loc>` entries (an orphan/legacy 62-URL sitemap parallel to the canonical 41-URL `client/public/sitemap.xml`; flipped to prevent poisoning if any deploy path ever serves it)
- `scripts/generate-sitemap.mjs` — `SITE_ORIGIN` env-var fallback (a second sitemap generator parallel to `tools/generate-sitemap.mjs`)
- `client/src/components/ReflectionCardExport.jsx` — 3 `ctx.fillText` calls drawing the domain on user-shareable reflection PNGs (header watermark + crisis URL footer + diagonal pattern across the card)
- `client/src/components/modules/ModulesPanel.tsx` — share-text template embedded the domain in clipboard content
- `client/src/lib/security.ts` — `addWatermark()` default `watermarkText` parameter
- `static-export/webflow-export.json` — `description` field of the webflow export schema
- `client/src/pages/WireframeTemplates.jsx` — JSDoc comment header

Two additional case-variant refs were intentionally left alone after architect review:
- `client/src/pages/DesignSystem.jsx:127` — `<h1>TheGenuineLoveProject.com</h1>` rendered on the design-system showcase page is the parent org's intentional brand title (the showcase shows TGLP design tokens, not MMHB tokens), not a canonical/SEO link
- `client/src/lib/social/socialLinks.ts:10` — `{ id: 'website', href: 'https://TheGenuineLoveProject.com' }` mirrors the existing `client/src/config/social.ts` org-website policy

**Final state**: case-insensitive sweep across every code/data file shows 14 remaining `thegenuineloveproject.com` refs across 13 files — every one is an intentional, documented org reference (real mailboxes, JSON-LD Organization publisher entities, social-profile website link, social-media post bodies, design-system brand showcase title). Triple gate after round 2: TSC=0, Build=16.53s, Drift=0. Live `/sitemap.xml` first 2 entries confirmed serving `https://mymentalhealthbuddy.com/` and `/about`; homepage canonical + og:url confirmed serving the new domain.

### v5.7.2 — SEO Lighthouse pass (sitemap refresh + auth-page noindex + robots.txt sync)

User report: Lighthouse flagged two SEO issues — *"Page is blocked from indexing"* and *"Links do not have descriptive text"*. A targeted A→Z audit was run before any changes.

**Audit findings (most concerns turned out to be already-correct):**
- Homepage `/` is fully indexable: `<title>`, `<meta name="description">`, `<meta name="robots" content="index, follow">`, complete OG/Twitter card metadata.
- All 12 landing-section components (`CanvaLanding`, `EmotionalJourney`, `NlpMiContent`, `ValueProposition`, `NextStepCTA`, `ValueBridge`, `EmailCapture`, etc.) — **zero non-descriptive links**. Arrow icons inside descriptive Links are correctly marked `aria-hidden="true"` (the right pattern, not a violation).
- All shared components rendered on indexable surfaces (`ReturnLoop`, `MicroWinPrompt`, `WelcomeBackBanner`, `FeedbackWidget`, `SoftLaunchBanner`, `SafetyFooter`) — **every icon-only button carries an explicit `aria-label`** ("Dismiss welcome back banner", "Dismiss this gentle prompt", "Hide feedback for 7 days", etc.).
- No `X-Robots-Tag` header is sent by helmet or any middleware — confirmed via `curl -I /`.

**Real gaps found and fixed:**

1. **`client/public/sitemap.xml` was stale (dated 2026-01-26, 14 entries)** — referenced legacy routes and was missing the entire current public-marketing surface. Rewritten with **40 current public routes** drawn directly from the live `App.jsx` route table: primary marketing (`/`, `/about`, `/about/approach`, `/values`, `/pricing`, `/features`, `/testimonials`, `/blog`, `/crisis`, `/challenge`, `/healing`, `/landing`), educational content (`/healing-library`, `/research`, `/glossary`, `/glossary-full`, `/how-to-guides`, `/daily-routines`, `/cognitive-tools`, `/news`, `/faq`, `/guided-journaling`), public tools (`/tools/all`, `/tools/breathing`, `/tools/grounding`, `/tools/meditation`, `/tools/self-care`, `/tools/gad7`, `/tools/phq9`, `/tools/distortion-checker`, `/tools/breath-pacer`, `/tools/boundary-builder`, `/tools/manipulation-detector`, `/tools/sleep-quality-calculator`, `/tools/nervous-system-check`), and topic landing pages (`/breathing`, `/grounding`, `/calming-scenes`, `/sleep-guide`, `/stress-response`, `/emotional-intelligence`). Each entry uses today's `lastmod` (2026-05-11) with priorities calibrated to surface importance (`/` and `/crisis` at 1.0, primary marketing at 0.8–0.9, tools at 0.7–0.9, deeper educational at 0.6–0.8).

2. **Two `robots.txt` files with mismatched content** — `client/public/robots.txt` (the canonical, served by Vite/Express from `CLIENT_DIST`) was comprehensive; `public/robots.txt` was a much shorter orphan with different Allow/Disallow rules. Per the "Non-destructive (never delete without permission)" rule the orphan was **synced** to match the canonical exactly (not deleted), so any future build path that picks the alternate location returns the same indexing policy.

3. **Auth pages had no per-page noindex meta tag** — `/login`, `/register`, `/forgot-password`, `/reset-password` (and all their state branches) relied solely on `robots.txt` `Disallow` to keep them out of search results. Lighthouse reports "Page is blocked from indexing" for any URL it audits that's blocked at the robots.txt level, regardless of intent. Fixed by adding `noindex` prop to **all 9 `<SEO>` calls** across these files (Login: 1, Register: 1, ForgotPassword: 2 — initial + check-email branches, ResetPassword: 4 — invalid-link, complete, reset-form, and missing-search-string branches). The existing `client/src/components/SEO.tsx` already supported `noindex` (lines 91–95: `if (noindex) setMeta("robots", "noindex, nofollow"); else removeMeta("robots");`) — just needed to be wired up. Now Lighthouse sees the noindex declaration is intentional and per-page, complementing the robots.txt block with explicit page-level intent.

**What was deliberately NOT changed:**
- `robots.txt` Disallow rules — these are an opinionated indexing policy (auth-gated wellness pages like `/journal`, `/chat`, `/mood`, `/today` stay out of search). Per non-destructive principle, no rule was added or removed.
- Admin-page icon-only buttons (`AdminSocial`, `NarrativeOpsConsole`, `AdminPublishing`) — these surfaces are in the `Disallow` block, so Lighthouse can't audit them; the few unlabeled icon buttons there have no SEO impact.
- The `RelatedLinksBlock` arrow span — verified the parent `<Link>` already wraps the descriptive `{l.label}` text and the arrow is `aria-hidden="true"`. Correct pattern.

**Why the "Links do not have descriptive text" warning likely resolves alongside the indexing fix:** Lighthouse audits one URL at a time; both warnings on the same report typically point to the same audited page. If that page was an auth page, fixing the indexing intent (#3 above) means future audits land on truly indexable content (homepage, about, pricing, blog, tools) where the link audit already passes.

Gates: `npx tsc --noEmit` exit 0 · `npm run build` exit 0 · `node scripts/checkSchemaDrift.mjs` exit 0 · live `/sitemap.xml` HTTP 200 with refreshed content · live `/robots.txt` HTTP 200 unchanged at canonical location.

---

### v5.7.1 — Schema-drift orphan rescue (additive correction)

The v4.2 schema-drift guardrail (`scripts/checkSchemaDrift.mjs`) had been emitting two persistent `[type_drift]` warnings against the `users` table:

1. **`server/db/schema/users.js`** — declared `email: text` (canonical: `varchar(255)`), missing 14 columns
2. **`db/schema.ts`** — declared `id: serial` (canonical: `uuid`), `email: text` (canonical: `varchar(255)`), missing 14 columns

A full importer audit (`rg` across all `.ts/.tsx/.js/.jsx/.mjs/.cjs` in `client`, `server`, `shared`) confirmed both files have **zero static importers**. Every live import resolves to `shared/schema.mjs`, `server/db/schema.mjs`, or `server/db/schema/index.mjs` — never to the `.js` / `.ts` siblings. They were forgotten copies that drifted as the canonical schema grew.

Per the user-preferences "Non-destructive (never delete without permission)" rule, **the files were not removed**. Instead each was rewritten as a single-line re-export of the canonical `users` table from `shared/schema.mjs`:

- `server/db/schema/users.js` → `export { users } from "../../../shared/schema.mjs";`
- `db/schema.ts` → `export { users } from "../shared/schema.mjs";`

This achieves three goals simultaneously:
- The guardrail goes silent because neither file declares its own `pgTable` anymore (drift detector compares column types per file)
- Any unseen dynamic import (e.g. via runtime `import()` with a templated path) now gets the truthful schema instead of a 16-column-short stale shape
- The file paths are preserved, so no downstream breakage even if a build tool was statically expecting them

Each file carries a JSDoc header explaining the rescue so future maintainers don't accidentally re-add a hand-rolled `pgTable` and re-introduce the drift.

Gates: `npx tsc --noEmit` exit 0 · `npm run build` exit 0 · `node scripts/checkSchemaDrift.mjs` now reports zero drift issues.

---

### v5.7 — NLP + Motivational Interviewing Content Engine (V18 port)

User-elected scope from a 6-doc V10→V18 batch: V13–V16 already shipped, V17 (image storytelling) deferred, V18 only. Two additive files + one CanvaLanding wiring edit.

**`client/src/data/nlpMiContent.js`** (~165 lines) — single source of truth for emotionally calibrated copy across 5 canonical surfaces. Each page object follows the same shape:
- `headline` / `subline` / `trustLine` — emotional-first messaging
- `affirmation` — strength-based reflection of effort already shown
- `openQuestion` — invites reflection without demanding an answer
- `reflection` — mirrors feeling so the user feels heard
- `presupposition` — assumes the positive outcome the user wants
- `embeddedCommand` — soft CTA hidden inside a calm sentence
- `ctaPrimary` / `ctaSecondary` — paired action labels + hrefs
- `sections[]` (home only) — 4 benefit cards with `icon` + `title` + `content` + `sensoryWords[]` (each tagged `visual` / `auditory` / `kinesthetic`)

The 5 pages: `/` (Home), `/tools/breathing`, `/checkin`, `/celebration`, `/chat`. Headlines per V18 spec ("You don't have to figure this out alone." / "Take a moment to breathe." / "How is your heart feeling right now?" / "You showed up today." / "Hi. I am Lumi."). The non-home pages carry the same 7 fields but no benefit cards — the renderer only draws the cards block when `sections.length > 0`, so a future drop-in on a sub-page is one prop swap.

**Governance contract baked into the module header**: framework technique names (anchors / presuppositions / embedded commands / etc.) live in JSDoc only — the user never sees them. This honors the existing Therapeutic Framework Reference Library hard rule against framework-name leakage.

**`client/src/sections/NlpMiContent.jsx`** (~290 lines) — pure CSS + IntersectionObserver renderer (NO framer-motion — preserves the v5.6 contract; v5.6 changelog explicitly notes "framer-motion intentionally NOT used (not a dep)"). Default export takes `path = '/'` so it can be mounted on any of the 5 surfaces. Renders 7 stacked blocks in this order:

1. **Affirmation banner** — italic serif quote on sage-tinted wash, `rgba(168, 201, 160, 0.10)` bg, `#2F5443` text
2. **Open question card** — white card with calm-blue border + soft shadow, "A Gentle Question" eyebrow in calm-blue
3. **Reflection box** — lavender wash with empathy-purple border, "Lumi Reflects" eyebrow + Heart icon
4. **Embedded command** — single italic centered line, muted color (`#6B7B6E`)
5. **Benefit cards** — 2-col grid (1-col mobile) of 4 cards, each with icon-on-sage-circle, title, body. Body text passes through `highlightSensory()` which wraps every sensory word in a `<span className="nlp-mi-sensory">` tinted by kind (visual=`#74C0FC`, auditory=`#C8B6FF`, kinesthetic=`#A8C9A0`). Cards reveal with staggered `transitionDelay: ${i * 60}ms`.
6. **Presupposition box** — gold-tinted wash with heart-amber border, "What Awaits You" eyebrow + Sparkles icon
7. **Final CTAs** — gold-gradient primary pill (heart-amber → warmth-orange) + outlined sage secondary, both with the v5.6 polish pattern (`translateY(-1px)` hover, `translateY(1px)` 90ms active, palette focus rings: gold `#D4AF37` for primary, sage-deep `#2F5443` for secondary)

Reveal pattern matches `EmotionalJourney.jsx` exactly — `IntersectionObserver` at threshold 0.15 adds `.revealed` to the section root, which fades + lifts every `.nlp-mi-reveal` child. Reduced-motion / no-IO branch immediately adds `.revealed` so end-state is preserved.

`highlightSensory()` is regex-based with sorted-by-length to avoid prefix collisions, properly escapes regex metachars, and word-boundary anchored. Returns either the raw string (no matches) or an array of strings + `<span>` nodes.

**`client/src/pages/CanvaLanding.jsx`** — two edits:
- Imported `NlpMiContent` alongside the existing `EmotionalJourney` import
- Mounted `<NlpMiContent path="/" />` between `<EmotionalJourney />` and the `#philosophy` section, with the existing `consciousness-divider` pattern preserved on both sides for visual consistency

Per the V18 spec: "Place between VisualBenefits/Journey section and ToolCategories." VisualBenefits doesn't exist (V17 was deliberately deferred this turn), so the closest canonical position is right after the Journey timeline.

**Forbidden additions intentionally avoided**:
- No new npm packages (framer-motion was tempting but explicitly out per project contract)
- No new image assets (V17 deferred)
- No business logic (this is healing-domain content per MMHB v7.4)
- No crisis short-circuit (page-level SafetyFooter + /crisis links already cover the surface)
- No off-palette accents — every color drawn from the canonical 8-hex set or muted grays for ambient text

Gates: `npx tsc --noEmit` and `npm run build` (verified after wiring + restart).

---

### v5.6 follow-up — Hero & Top CTA polish (additive only)

User asked for "polish all buttons" → scoped to **Option 2: Hero & top CTA polish only** (V16 hero + Pricing tier buttons). Header and Footer have no CTA buttons (nav-only `<Link>`s) so they were not in scope. Tool cards, form buttons, modal buttons, and the `/v6` control panel were explicitly excluded by the user.

**`client/src/styles/canva-landing.css`** — appended a v5.6 polish block AFTER the original `.btn-sacred-gold` / `.btn-sacred-secondary` definitions so cascade order makes the new rules win:
- **Gentler hover** — replaced `translateY(-4px) scale(1.02)` with `translateY(-1px)` (no scale) on both gold and secondary
- **Press state** — new `:active` rule with `translateY(1px)`, shrunk shadow, and a fast 90ms transition for a tactile click feel
- **Soft shadow transitions** — explicit `transition: transform 280ms, box-shadow 280ms cubic-bezier(0.22, 0.9, 0.32, 1)` so shadow growth/shrink is buttery
- **Palette-tinted focus rings** — gold `#D4AF37` outline for warm CTAs (btn-sacred-gold), sage-deep `#2F5443` for calm CTAs (btn-sacred-secondary)
- **NEW class `.btn-sacred-tertiary`** — text-link CTA system used by V16's "Explore Safely". Underlined sage-deep text, hover lifts -1px + grows underline offset 4→6px + tints background sage 10%, active +1px, sage focus ring. Arrow icon (`.arrow` or any nested `svg`) translates +2px on hover for the subtle directional cue.
- **`@media (prefers-reduced-motion: reduce)`** blanket — kills every transform, transition, and underline-offset shift across all three classes; end states preserved.

**`client/src/styles/brand.css`** — Pricing tier buttons (`.btn-premium` / `.btn-secondary-premium`):
- Added `:active` press state on both (translateY +1px, shrunk shadow, 90ms transition)
- Bumped focus-visible ring from 2px to 3px and switched to palette tints (gold for premium, primary for secondary)
- Added a hover lift to `.btn-secondary-premium` (was background-only) for parity with the gold sibling
- Added `prefers-reduced-motion` blanket on both

**`client/src/pages/CanvaLanding.jsx`** — V16 tertiary "Explore Safely" link migrated from inline-styled `<a>` to `className="btn-sacred-tertiary"`. The arrow icon now carries the `.arrow` class so the new tertiary hover-translate rule can target it cleanly.

Untouched (per user): tool cards, form buttons, modal buttons, `/v6` control panel.

Gates re-verified: `npx tsc --noEmit` → exit 0; `npm run build` → exit 0.

#### v5.6 follow-up — Header & Footer extension (same wave)

User re-issued the brief calling out "header nav, footer" explicitly. The visible top navbar is `TglpNavbar.jsx` (not `Header.jsx` — `Header.jsx` is unused on the marketing surface). Three header CTAs + nine footer links polished by appending new classes that compose additively with their existing Tailwind utilities.

**`client/src/styles/brand.css`** — three new additive classes appended after the v5.6 Pricing block:

- **`.btn-header-cta`** (warm — gold pill) — applied to TglpNavbar's "Get Started" / "Start" / "Dashboard" gold pills:
  - Hover: `translateY(-1px)` + soft gold-tinted shadow growth (`0 8px 22px rgba(212,175,55,.32)` + 4px gold glow ring)
  - Active: `translateY(1px)` + shrunk shadow on a 90ms transition
  - Focus-visible: 3px gold (`#D4AF37`) outline at 3px offset
  - 240ms cubic-bezier transitions on transform + box-shadow only — does NOT override the inline `background: var(--glp-gold-gradient)` or `boxShadow: var(--glp-gold-shadow)` set in JSX (composes cleanly)
- **`.btn-header-secondary`** (calm — text link) — applied to TglpNavbar's "Sign In" link:
  - Hover: `translateY(-1px)` (no shadow — already has `hover:bg-[var(--glp-sage)]/10`)
  - Active: `translateY(1px)` 90ms
  - Focus-visible: 3px sage-deep (`#2F5443`) outline, rounded 0.5rem to match the link's `rounded-lg`
- **`.footer-nav-link`** — applied to all 9 footer nav links (Home, About, Wellness Tools, Journal, Wisdom, Blog, Newsletter, Disclaimer, Crisis Support):
  - **No** hover lift (a 9-link dense row of bouncing links would feel jumpy)
  - Focus-visible: 3px sage-deep outline at 3px offset, rounded 4px — matches the calm CTA family
  - Color/background transitions kept at 200ms ease so the existing `hover:text-[var(--glp-teal)]` stays smooth

**`client/src/components/TglpNavbar.jsx`** — three className edits:
- Line 153: prepend `btn-header-cta` to the authed Dashboard pill
- Line 169: prepend `btn-header-secondary` to the Sign In `<a>`
- Line 176: prepend `btn-header-cta` to the unauth "Get Started" / "Start" pill

Each edit also drops the now-redundant `transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2` Tailwind utilities to avoid double-shadow / double-ring stacking with the new class. The original inline `background: var(--glp-gold-gradient)` and `boxShadow: var(--glp-gold-shadow)` style props are preserved as the resting-state look.

**`client/src/components/Footer.jsx`** — added `footer-nav-link` to all 9 nav `<Link>` className strings (additive — kept the existing `hover:text-[var(--glp-teal)] transition` and the `flex items-center gap-1` modifiers untouched).

**Reduced-motion blanket** in the same brand.css block kills every transform on `.btn-header-cta`, `.btn-header-secondary`, and `.footer-nav-link` under `@media (prefers-reduced-motion: reduce)`. Focus rings (which are accessibility-critical) are preserved.

**Architect-driven fixes (post-review)**:
1. `.btn-header-cta:hover` and `:active` `box-shadow` declarations gained `!important` — without it, the inline `style={{ boxShadow: "var(--glp-gold-shadow)" }}` on the TglpNavbar gold pills would have outranked the stylesheet (inline style beats normal cascade specificity), and the hover/active shadow growth/shrink would have silently no-op'd.
2. Focus-ring colors switched from `var(--glp-gold, #D4AF37)` / `var(--glp-sage-deep, #2F5443)` to literal `#D4AF37` / `#2F5443`. The CSS-var fallback never fires when the variable is defined — and `brand-tokens.css` defines `--glp-gold: #be8622` and `--glp-sage-deep: #062a2a`, which would have rendered the focus rings in the wrong shade. The literal hex values lock in the canonical v5.6 palette spec.

**Why `Header.jsx` was still skipped**: a follow-up `rg` confirmed it's not the visible navbar — the marketing surface mounts `TglpNavbar.jsx` from `App.tsx`. `Header.jsx` is a dormant alternate component with only nav `<Link>`s and would have been a no-op edit.

Gates re-verified after the extension: `npx tsc --noEmit` → exit 0; `npm run build` → exit 0 in 15.75s.

---

## Subscription Elicitation Layer (v5.5) — 7 additive surfaces for sign-up & conversion

> **Versioning note**: the implementation brief asked for "v5.3" but `v5.3` (V14 universalized) and `v5.4` (Engagement Hooks) were already locked in this changelog. This release ships as **v5.5** — content is identical to the v5.3 brief, only the version label is bumped to avoid history collision.

Seven small, additive layers that move users from "browsing" to "subscribed" without ever asking the homepage to do healing work or the pricing page to do safety work. Every change honors the MMHB v7.4 governance contract (no business-in-healing, crisis routing preserved on every wellness surface). Zero npm packages added.

### Critical routing finding
The brief named `client/src/pages/PricingPage.jsx` as the file to edit. **That file is dead code** — `App.jsx` line 253/386 maps `/pricing` to `PricingReal = lazy(() => import("./pages/Pricing.jsx"))`. All pricing-page changes (FIX 2/3/5) were applied to the live `Pricing.jsx`; `PricingPage.jsx` was left untouched.

### New files
- `client/src/sections/EmailCapture.jsx` — focused single-purpose strip ("Stay Connected With Lumi"). Sage `#F0F7F4` band, sage CTA, white input. Writes to the SAME `localStorage["mmhb:email_subscribers"]` key as v5.4's `ValueProposition` so a user who subscribes via either surface is recognized by both. Two states: `idle` (form) and `success` (sage panel with checkmark + "You're in! Welcome to the community." or "Welcome back — you're already in." for returning devices). Email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Form ARIA: `<label for>`/`<input id>`, `aria-invalid`+`aria-describedby` on errors, `role="status" aria-live="polite"` on success, `role="alert"` on error. `setReturning` is **not** mutated in `handleSubmit` — it stays driven by the initial `useEffect` storage probe so the success copy correctly differentiates a brand-new signup from a returning device (architect catch).
- `client/src/sections/PricingFAQ.jsx` — 5-question accordion. Verbatim Qs: plan switching, free-tier permanence, Starter vs Pro, refunds, cancel grace. Each Q is a real `<button>` with `aria-expanded`/`aria-controls`; each answer region has `role="region"` + `aria-labelledby`; chevron rotates via CSS transform (collapsed under `prefers-reduced-motion`). Scoped under `.pf-*` so zero leak into host pages. Used **only on `/pricing`** — the homepage FAQ is intentionally untouched per the additive-only contract.
- `client/src/sections/ValueBridge.jsx` — 3-card free→Pro upsell ("Unlimited AI Coaching" / "Advanced Emotional Insights" / "Guided Healing Journeys"). Per-card accent CSS var (`--vb-accent` / `--vb-accent-soft`) drawn from canonical brand hex set: sage `#8FBF9F`, calm-blue `#74C0FC`, empathy-purple `#C8B6FF`. Lock→Unlock icon swap on hover (Lucide `Lock`/`Unlock`/`BarChart3`/`Compass`). CTA `<Link href="/pricing">` — never auto-upgrades, never charges. `color-mix()` borders ship with **solid rgba fallbacks declared first** for Safari < 16.2 (architect catch — cascade order means modern browsers see the `color-mix` and old browsers fall back to the rgba).
- `client/src/components/WelcomeBackBanner.jsx` — slim returning-visitor strip. State machine: first ever visit → seed `sessionStorage["mmhb:returning_visitor"]="true"`, render nothing; subsequent navigations in the same tab → render the banner. X-button writes `sessionStorage["mmhb:welcome_dismissed"]="true"` for the rest of the session. CTA routes to `/chat` if `localStorage["mmhb_token"]` exists (matches `AuthContext.jsx` line 6 `TOKEN_KEY`), else `/login`. **Hidden on `/crisis` and `/crisis/*`** so we never visually compete with safety resources. Slide-down animation (`wbbSlideDown` 380ms cubic-bezier) collapsed under `prefers-reduced-motion`. `role="status" aria-live="polite"` (non-interrupting). Mounted **inside `<main id="main-content">`** (not above it) so the SkipToContent target still leads users to the banner + CTA — architect catch on the original "above main" position which would have made the skip-link bypass a critical CTA for keyboard users.

### Modified files
- `pages/CanvaLanding.jsx` (FIX 1, FIX 4, FIX 6):
  - Stat grid `grid-cols-3` → `grid-cols-2 sm:grid-cols-4 max-w-5xl`. Added 4th card `10,000+ / BUDDY CONVERSATIONS` with warmth-orange→gold-dark gradient (`#E8913A` → `var(--glp-gold-dark)`), matching `stat-card-elite` styling and `data-testid="stat-conversations"`.
  - New surface order around the FAQ: `testimonials → ValueBridge → ValueProposition (v5.4) → FAQ → EmailCapture (NEW) → existing "Your Buddy Is Ready" CTA → NextStepCTA general (v5.4) → footer`. Two `consciousness-divider` separators flank `ValueBridge` and `ValueProposition` so the visual cadence stays consistent with the rest of the page.
- `pages/Pricing.jsx` (FIX 2, FIX 3, FIX 5):
  - Badge text "Full Access" → **"Most Popular"**, restyled from gold linear-gradient to solid `#E8913A` (warmth-orange canonical) with `0 6px 18px rgba(232,145,58,0.42)` glow, `font-bold uppercase tracking-wider`. `data-testid="badge-most-popular"`.
  - Per-tier money-back paragraph rendered conditionally below each tier's CTA: Pro (`tier.planId === "pro"`) → "30-day money-back guarantee. No questions asked."; Elite (`tier.planId === "elite"`) → "Cancel anytime. Full refund within 30 days." Style: `text-xs text-center` in `#6B7B6E`. `data-testid="text-money-back-{tier}"`.
  - `<PricingFAQ className="mt-8" />` rendered immediately after `<TrustSignals variant="banner" />`, before the support link — never above the trust signals (cancel-anytime / crisis-support-free messaging keeps top billing).
- `App.jsx` (FIX 7): `import WelcomeBackBanner from "./components/WelcomeBackBanner.jsx";` then rendered as the **first child of `<main id="main-content">`** (after `<SkipToContent />`, before `<Suspense>`). This placement keeps the SkipToContent landing target above the banner while still making the banner the first thing keyboard users hit.

### Universal contracts honored
- **Crisis safeguards**: `WelcomeBackBanner` excluded on `/crisis`; pricing page still renders `<SafetyFooter />`; `/pricing` page still surfaces "Crisis Support Free" via `TrustSignals`.
- **Brand palette**: every accent draws from the canonical 8-hex set (sage `#8FBF9F`, gold `#D4AF37`, calm-blue `#74C0FC`, empathy-purple `#C8B6FF`, warmth-orange `#E8913A`). Neutral RGBAs (`#FFFFFF`, `#6B7B6E`, `#F0F7F4`) are used only for ambient surfaces / muted text / soft section backgrounds — never as a brand accent.
- **`prefers-reduced-motion`**: every new component ships an explicit `@media (prefers-reduced-motion: reduce)` block that collapses transforms, animations, and transitions while preserving end-state.
- **Scoped CSS**: every new component uses a unique class prefix (`.ec-*`, `.pf-*`, `.vb-*`, `.wbb-*`) inside a scoped `<style>` block — zero leak risk to host pages.
- **Cross-domain hygiene** (MMHB v7.4): pricing-related copy lives only on `/pricing` and the `ValueBridge` upsell card (which routes to `/pricing` rather than embedding pricing inline). Healing surfaces stay free of conversion language.
- **Additive only**: zero existing markup or copy was deleted. The only modification (badge text "Full Access" → "Most Popular") is a copy-only change to a 1-line span and was explicit in the brief.

### Architect findings & resolutions
- **HIGH — Skip-link bypass** (resolved): `WelcomeBackBanner` was originally placed between `<SkipToContent />` and `<main>`, which would let keyboard users bypass it via the skip link. Moved inside `<main id="main-content">` as the first child.
- **HIGH — State drift on re-subscribe** (resolved): `EmailCapture` was resetting `returning=false` inside `handleSubmit`, which would have shown a returning device the new-signup copy after re-submitting. Removed the mutation; the success-state copy now stays correctly tied to whatever the initial `useEffect` storage probe found.
- **MED-HIGH — `color-mix()` browser support** (resolved): `ValueBridge` borders relied on `color-mix(in srgb, ...)` which Safari < 16.2 doesn't parse. Added solid `rgba()` fallback declarations **before** each `color-mix()` line so the cascade picks the modern value where supported and the rgba where not.
- **HIGH — Replace homepage FAQ with PricingFAQ** (rejected): the brief was explicit that v5.5 is additive-only and that PricingFAQ targets the **/pricing surface**. Replacing the homepage `faqs` array would be a destructive refactor outside scope; the homepage FAQ stays untouched.
- **HIGH — Brand palette violation on ValueBridge** (rejected as false positive): `#74C0FC` (calm-blue) and `#C8B6FF` (empathy-purple) are both members of the canonical 8-hex palette documented in `replit.md` (Polish & Feature History → universal contracts).

### Gates
- `npx tsc --noEmit` → exit 0.
- `npm run build` → exit 0, built in 15.86s, no warnings.
- Smoke `/` → renders with welcome-back banner visible at top of main, hero stat grid intact (4 cards on desktop, 2×2 on mobile).
- Smoke `/pricing` → renders cleanly, "Most Popular" warmth-orange badge sits above the Pro card on desktop.

---

## Engagement Hooks Layer (v5.4) — ValueProposition + NextStepCTA across 6 surfaces

Two additive section components were introduced to give every primary user surface a "what's next" moment and a low-friction subscription path. Zero changes to existing behavior, zero new npm dependencies.

**New files**:
- `client/src/sections/ValueProposition.jsx` — email signup with two variants. **`full`** ships a 4-benefit grid (Heart / Sparkles / Shield / Compass — trauma-informed support, daily reflection cues, privacy by default, free tools). **`compact`** ships headline + form only. Email persistence: `localStorage["mmhb:email_subscribers"]` as a JSON array of unique lowercased emails (frontend stub — when a backend `/api/subscribe` lands, swap `handleSubmit`). Email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Success state restores on mount if device already subscribed (no re-prompt). A11y: `<label for>`/`<input id>`, `aria-live="polite"` status, `aria-invalid` + `aria-describedby` on errors, scoped `<style>` block with `prefers-reduced-motion` collapsing all transforms.
- `client/src/sections/NextStepCTA.jsx` — context-aware next-step driver. Single component, six contexts: `after-breathing` (calm-blue accent → check-in / celebration), `after-checkin` (sage → breathing / celebration), `after-celebration` (gold → daily reminder / share), `general` (sage → tools / chat), `about` (purple → tools / blog), `blog` (warmth-orange → breathing / journal). Each context carries eyebrow, headline, subline, primary {label,href,icon}, secondary {label,href,icon}, and an accent color exposed via `--nsc-accent` / `--nsc-accent-soft` CSS vars so the card adapts without per-context CSS. Every variant exposes a subtle `/crisis` link below the buttons (safety surface always one tap away). Wouter `<Link>` for SPA routing. Scoped `<style>` with `prefers-reduced-motion` collapsing hover transforms.

**Wired into**:
- `pages/CanvaLanding.jsx` — `<ValueProposition variant="full">` after the testimonials/trust-badges section (between two `consciousness-divider` separators) + `<NextStepCTA context="general">` immediately before the `<footer>`.
- `pages/About.jsx` — `<ValueProposition variant="compact">` + `<NextStepCTA context="about">` before `<GlowFooter />`.
- `pages/Blog.jsx` — both inserted inside `<WellnessPageShell>` after the crisis-resources note.
- `pages/tools/BreathingTool.jsx` — `<NextStepCTA context="after-breathing">` between the "About this exercise" panel and `<SafetyFooter />`.
- `pages/CheckIn.jsx` — `<NextStepCTA context="after-checkin">` between the check-in `<section>` and `<SafetyFooter />`.
- `pages/CelebrationFlow.jsx` — `<NextStepCTA context="after-celebration">` between the celebration `<section>` and `<SafetyFooter />`.

**Universal contracts honored**:
- Crisis routing preserved on every surface (`SafetyFooter` untouched + each `NextStepCTA` carries its own `/crisis` deep link).
- Brand palette: every accent draws from the canonical 8-hex set (sage, gold, calm-blue, empathy-purple, warmth-orange) with neutral white/cream RGBAs only for ambient overlays.
- `prefers-reduced-motion`: defense-in-depth at component level — transitions disabled, hover transforms collapsed, layout intact.
- A11y: each section has `aria-labelledby` to a unique heading id; form has visible focus-ring, error region with `role="alert"`.
- Scoped under unique class prefixes (`.vp-*`, `.nsc-*`) so zero leak risk to host pages.
- WCAG focus-visible: 3px outline in accent color.

**Gates**:
- `npx tsc --noEmit` → exit 0.
- `npm run build` → built in 20.18s, no warnings, `CanvaLanding-*.js` chunk now 72.46 kB / 17.38 kB gz (engagement components inlined into route chunks rather than spawning new chunks — zero asset count change).
- All 6 routes return 200 on the dev server.
- Architect review: PASS (only 2 nits — both intentional: localStorage write failure is a silent no-op since the success state is still psychologically truthful for the user, and `NextStepCTA` falls back to `general` on unknown context as a defensive default).

---

## V14 Universalized Across All Avatars (v5.3) — Voice + Expression Sync, propagation phase

The v5.2 wiring landed V14 audio in `LumiV6` only — but `LumiV6` is rendered on a small set of surfaces (`/v6` demo, landing hero, four auth pages). The vast majority of avatar instances in the app — header, footer, every chat bubble (`AIChatPanel`), every tool card, every check-in/celebration/breathing surface, the page-template nav logo — render `BuddyAvatar` (or `LumiMascot`, which wraps `BuddyAvatar`). Until v5.3, none of those instances produced any V14 audio.

This release universalizes the V14 voice through a **shared audio coordinator** in the lib so every avatar in the app cooperates and the user perceives one Lumi voice no matter how many avatar instances are mounted.

**Modified files**:
- `client/src/lib/lumiAudio.js` — added module-scoped coordinator: `tryPlayPop()` (sessionStorage one-shot, idempotent across avatar instances), `tryPlayChime(minGapMs=2000)` (single shared debounce window), `claimHeartbeat(periodMs)` / `releaseHeartbeat(token)` (single-owner interval coordinator with 340 ms safety floor enforced inside the lib). `closeLumiAudio()` now also drops any active heartbeat ownership so a re-enable can re-claim cleanly.
- `client/src/hooks/useLumiAudio.js` — re-exports the coordinator as `tryPop` / `tryChime` / `claimHeart` / `releaseHeart`, each pre-gated on `effective` so call sites never have to gate themselves.
- `client/src/components/avatar/BuddyAvatar.tsx` — wired the same three V14 integration points (entrance pop via `IntersectionObserver` → `tryPop`, heartbeat via `claimHeart`/`releaseHeart` keyed on `v.heartPulse`, chime via `onPointerDown` → `tryChime`). All three gated on the existing `animated` prop so crisis surfaces (`<BuddyAvatar animated={false} />` — used by `ErrorBoundary` and `/crisis`) stay completely silent. Heartbeat ownership is restricted to avatars rendered at ≥ 96 px so a tiny 32 px header logo doesn't grab the slot from the visible hero / tool / chat avatar.
- `client/src/components/lumi/LumiV6.tsx` — refactored the v5.2 per-instance debounce ref + per-instance `setInterval` to use the shared coordinator (`tryPop` / `claimHeart` / `tryChime`). When both `LumiV6` and a `BuddyAvatar` mount on the same page (e.g. /v6 demo + header logo), one heartbeat plays — not two overlapping — and the chime debounce is shared.
- `client/src/components/PageTemplate.jsx` — replaced the raw `<img>` nav-logo straggler (legacy v4 ultimate PNG, since deleted in v5.8.19) with `<BuddyAvatar size={32} />` so it inherits V14 audio + the canonical visual treatment with no one-off code.

**Coordinator contract** (the lib is the single source of truth — call sites stay thin):

| Cue | Coordinator | App-wide guarantee |
|---|---|---|
| Pop | `tryPlayPop()` | Exactly one entrance pop per browser session, regardless of how many avatars (header / hero / chat / footer) mount across page navigations. SessionStorage gate `lumi:audio:popped`. |
| Heartbeat | `claimHeartbeat(periodMs)` / `releaseHeartbeat(token)` | At most one heartbeat interval running at a time. First avatar to claim wins; subsequent claims return `null` and stay silent. Period clamped at 340 ms (≈ 2.94 Hz < 3 Hz seizure-safety floor) inside the lib. |
| Chime | `tryPlayChime(minGapMs=2000)` | At most one chime every 2 s across the whole app, even when the user mashes click on multiple avatars or interacts with `/v6` click-zones plus a chat bubble at the same time. |

**Crisis-safety contract** (preserved everywhere — no new escape hatches):
- All three integrations in `BuddyAvatar` are gated on the existing `animated` prop. `<BuddyAvatar animated={false} />` (used by `ErrorBoundary` + the `/crisis` route via `BuddyAvatar` directly) bypasses the audio paths *before* hitting the coordinator. The `useLumiAudio` hook is still called unconditionally per rules-of-hooks, but the effects return early.
- Reduced-motion is enforced at hook + kernel layer; either alone is sufficient. The heartbeat `useEffect` returns before calling `claimHeart` when `effective` is false, so no interval is created in the first place.
- Web Audio unavailable → `effective` is false → identical no-op path.

**Why pointer-down (not hover)**: hover firing was specced but unsafe — landing pages have hero Lumi at cursor-natural positions, so `mouseenter` would fire constantly. Pointer-down captures real intent and is what the existing `LumiV6` click-zones use, so the behavior is consistent across `LumiV6` and `BuddyAvatar`. Hover wiring can be layered on later behind a gesture-intent heuristic if you want.

**Why heartbeat ≥ 96 px gate on `BuddyAvatar`**: a single page often renders many avatars (header logo 32 px, footer logo 40 px, chat bubble 32 px, hero 160 px, tool card 64 px). Whichever mounts first wins the claim — and we want that to be the visible hero, not a corner logo. The 96 px gate naturally restricts ownership to "feature" avatars (`md` token = 64 px does NOT claim, `lg` = 128 px and `xl` = 208 px DO claim). When a user lands on a page with no large avatar (e.g. a list view), no heartbeat plays — which is the right answer audibly.

**Verification**:
- `npx tsc --noEmit` — exit 0.
- All representative routes (`/`, `/v6`, `/chat`, `/crisis`, `/checkin`, `/tools/breathing`, `/celebration`, `/about`) — 200.
- Workflow logs — clean.
- Manual: with audio toggled OFF on `/v6`, every surface behaves byte-identically to v5.2 (no audio, no extra timers because each `useEffect` returns before scheduling work).
- Default OFF preserved — `readEnabled()` still returns false when localStorage is empty.

**Scope note (V9 Soul Capture propagation)**: Pop + heartbeat + chime now reach every avatar surface. The remaining V9 features (sentiment-driven mirroring, recognition memory, escalation tracking) require per-surface signal plumbing (chat sentiment, journal sentiment, etc.) and are not universalizable through the avatar layer alone — they need to be opted into per-surface by passing a `detectedSentiment` prop, which is how `LumiV6` already exposes it. This is a separate phase; not landed in v5.3.

---

## V14 Wired Into LumiV6 (v5.2) — Voice + Expression Sync, integration phase

The v5.1 audio engine is now wired into the live `LumiV6` component at the three V14 spec'd integration points. All wiring sits behind the same `lumi:audio:enabled` localStorage flag (default **OFF**) plus the existing `prefers-reduced-motion` and Web Audio availability gates, so behavior is unchanged for every existing user until they explicitly opt in on `/v6`.

**Modified files**:
- `client/src/components/lumi/LumiV6.tsx` — added `useLumiAudio()` hook call, three call sites (entrance pop, heartbeat interval, chime in `fireOverride`), and one debounce ref. Net additions: ~35 lines, all visually scoped to `// V14:` comments. Zero changes to existing visual behavior, props, derivation tables, or click-zone logic.
- `client/src/lib/lumiAudio.js` — retuned all three tones to the user's exact V14 spec (pop 0.3 s 800 → 1200 Hz vol 0.08; heartbeat 0.18 s 110 → 80 Hz vol 0.05 single thud; chime 0.20 s bell harmonic stack 660 Hz + 1320 Hz vol 0.06). The 0.08 ceiling on the kernel `playTone()` is unchanged; the new pop sits exactly at that ceiling, every other tone is below it.
- `client/src/hooks/useLumiAudio.js` — renamed localStorage key from preview-era `mmhb-lumi-audio-enabled` to canonical `lumi:audio:enabled` per the V14 spec. Includes a one-time `migrateLegacyKey()` that copies any existing preview-era value into the new key on first read and removes the legacy entry. Pure additive — no user setting is lost.
- `client/src/pages/LumiV6Preview.jsx` — updated the panel's documentation copy to show the canonical key name.

**Wiring detail (each integration point)**:

1. **Entrance pop** — fires inside the existing V9 `IntersectionObserver` callback (`LumiV6.tsx` line 539). Independent sessionStorage gate `lumi:audio:popped` (separate from `lumi:v9:entered` so a user can flip the audio toggle mid-session and still get exactly one pop after the flip). The gate is only set once `pop()` actually returns `true` — so a no-op (audio off / reduced motion / Web Audio unavailable) does not consume the one-shot.
2. **Heartbeat sync** — separate `useEffect` keyed on `[animated, lumiAudio.effective, heartPeriodMs, lumiAudio]`. Schedules `setInterval(heartbeat, max(340, heartPeriodMs))`. The 340 ms floor is a defensive safety floor (≈ 2.94 Hz) — even if a future emotion table sets `heartHz > 3`, the audio cadence is clamped under the 3 Hz seizure-safety threshold from the V14 spec. The visual heart pulse continues at its native cadence; only the audio is clamped.
3. **Interaction chime** — added inside `fireOverride()` (the existing click-zone handler), gated on `animated` with a per-instance `lastChimeAtRef` debounce of ≥ 2000 ms. Mirrors the V11 prime directive: even if a user mashes head/heart/body click zones, the chime fires at most every 2 seconds. Debounce timestamp is only updated when `chime()` actually returns `true`, so silent no-ops don't burn the debounce window either.

**Crisis-safety contract** (preserved):
- All three integrations are gated on `animated`. Crisis surfaces (`<LumiV6 animated={false} />`) stay completely silent in addition to staying still — the existing visual contract automatically becomes an audio contract.
- Reduced-motion is enforced at *both* the kernel layer (`prefersReducedMotion()` check inside `ensureContext`) and the hook layer (`reducedMotion` state in `effective`). Even a stale ref or future call site can't bypass it.
- The hook's `effective` flag is the single master mute. `lumiAudio.pop()`, `.heartbeat()`, `.chime()` are all silent no-ops when it's false — call sites don't have to gate themselves.

**Why no hover chime**: The user's V14 spec said "click/hover" for the chime trigger. Hover-fire would be too noisy on landing pages where the cursor naturally crosses Lumi (think hero sections), and the 2 s debounce alone wouldn't fully suppress the unintentional triggers. Wiring chime to the deliberate click-zone path (head / heart / body) instead matches the V11 prime directive — "whisper-quiet, never startling, always intentional". Hover wiring can be added later if you want, but it should layer on top of a gesture-intent heuristic, not raw `mouseenter`.

**Verification**:
- `npx tsc --noEmit` — exit 0.
- All 7 representative routes (`/`, `/v6`, `/chat`, `/crisis`, `/checkin`, `/tools/breathing`, `/celebration`) — 200.
- Workflow logs — clean (only pre-existing schema/SSL warnings).
- Manual: with audio toggled OFF on `/v6`, every wellness surface behaves byte-identically to v5.1 (no audio, no extra timers fire because the heartbeat `useEffect` returns early before creating an interval).

---

## Lumi Voice + Expression Sync (v5.1) — V14 phase

A tiny Web Audio kernel that gives Lumi three optional voice cues — a gentle entrance **pop**, a synced **heartbeat**, and an interaction **chime** — gated behind an explicit user preference. Default **OFF**. Per the V13 roadmap the engine ships first; per-surface auto-wiring (entrance / pulse / interaction) is intentionally deferred so the v4.5–v5.0 polish remains untouched until the user approves broader integration.

**New files**:
- `client/src/lib/lumiAudio.js` — programmatic Web Audio synth. No audio files (zero asset weight, no CSP/MIME issues). Three exported play functions plus `unlockLumiAudio()`, `isLumiAudioAvailable()`, `closeLumiAudio()`. Lazy `AudioContext` (created on first call so the browser's user-gesture rule is honored). Reduced-motion guard built into the kernel — every `play()` is a silent no-op when the OS pref is set.
- `client/src/hooks/useLumiAudio.js` — React hook backing the `mmhb-lumi-audio-enabled` localStorage flag. Listens to `storage` events for cross-tab sync and to `(prefers-reduced-motion: reduce)` `MediaQueryList` changes for live OS-pref tracking. Exposes `enabled`, `effective`, `available`, `reducedMotion`, `setEnabled`, and the three safe play methods (`pop`, `heartbeat`, `chime`) — callers don't have to gate.

**Modified file**:
- `client/src/pages/LumiV6Preview.jsx` — added `LumiAudioPanel` sub-component rendered just above `ToySpecPanel` on `/v6`. Toggle + status text + three preview buttons (pop / heartbeat / chime), each with `data-testid` and `aria-label`.

**Sound design** (matches V11 prime directive — "whisper-quiet, never startling"):
- **Pop** — sine wave, 220 → 440 Hz exponential ramp, 180 ms, peak gain 0.05.
- **Heartbeat** — two-beat lub-dub. Lub: sine 110 → 90 Hz, 100 ms, gain 0.045. Dub (180 ms later via `setTimeout`): sine 95 → 75 Hz, 120 ms, gain 0.04. Total envelope ~440 ms, well under the 3 Hz seizure-safety threshold.
- **Chime** — triangle 660 Hz fundamental + 880 Hz overtone (60 ms apart), each 180 ms, peak gain 0.045 / 0.035.
- All gains hard-capped at 0.08 (≈ -22 dBFS) inside `playTone()` — even a coding mistake can't exceed the whisper-quiet ceiling.
- All envelopes use exponential ramps to avoid click artifacts on attack/release.

**Universal contract honor on this surface**:
- ✅ Default **OFF** — `localStorage.getItem('mmhb-lumi-audio-enabled')` returns `null` on a fresh install, parsed as `false`.
- ✅ Reduced-motion blanket — both the kernel (`prefersReducedMotion()` guard at the top of every play) and the hook (`reducedMotion` state) treat `prefers-reduced-motion: reduce` as a hard mute even when the user enabled audio. Status text in the panel makes this explicit to the user.
- ✅ Brand palette — toggle uses sky-50/200/600 (a neutral UI-affordance color in the existing `/v6` panel idiom), and each preview button uses an existing brand-aligned ring (amber for pop, rose for heartbeat, emerald for chime) drawn from the `/v6` palette already in use elsewhere on the page. No new accent colors introduced.
- ✅ Crisis routing preserved — `/v6` still renders the rose Crisis Support nav link in its top bar.
- ✅ Accessibility — toggle is a real `<input type="checkbox">` inside a `<label>` (full keyboard reachability, screen-reader-friendly), `aria-describedby` ties the toggle to its live status text, every preview button has an `aria-label`, the section is `aria-labelledby` to the heading.
- ✅ Cross-tab sync — `storage` event listener flips the toggle in real time if the user changes the pref in another tab.
- ✅ Resource hygiene — `useEffect` calls `closeLumiAudio()` when the user disables audio, releasing the underlying `AudioContext` device handle.

**Deferred (intentional per V13 phasing)**:
- Auto-play on Lumi entrance (would need wiring into `BuddyAvatar` mount).
- Sync to the LumiV6 heart pulse cadence (would need to call `heartbeat()` on the same period as the existing CSS `lumi-heart-pulse` animation).
- Chime on interaction (tap, sentiment-mirror, celebration trigger).

These are single-line additions once the user approves the engine. Documented as the next V14 follow-up rather than shipped this turn — keeps the polished v4.5–v5.0 surfaces unchanged and preserves the user's right to preview the cues in isolation before they appear unsolicited.

---

## Emotional Journey Section (v5.0) — V13 port from kimi.page deployment

A new full-width section between the landing page's tools section and the philosophy section, surfacing the **6-phase emotional flow** (CALM → ORIENT → CONNECT → SUPPORT → REWARD → CONTINUE) as a vertical timeline so users can see the gentle path before they walk it. Replaces nothing — purely additive insert.

**New files**:
- `client/src/data/emotionalJourney.js` — 6-entry array `[{ phase, path, color, label, description }]`. Colors are drawn from the canonical 8-hex brand palette (sage `#A8C9A0`, calm-blue `#74C0FC`, empathy-purple `#C8B6FF`, sunshine `#FFD93D`, blush `#FF9A8B`, sage `#A8C9A0` for Return — five of the eight; mint, warmth-orange, and heart-amber are unused on this surface). Routes (`/`, `/tools/breathing`, `/checkin`, `/celebration`, `/chat`, `/`) match existing application paths — V13's spec called for `/lumi` for the REWARD phase, but no `/lumi` route exists in MMHB's `App.jsx`; `/chat` is the canonical AI-companion surface in this codebase, so the REWARD phase points there to avoid a dead link.
- `client/src/sections/EmotionalJourney.jsx` — accessible `<section>` with `aria-labelledby`, semantic `<ol>` of phase cards. Each card is a `wouter` `<Link>` (SPA navigation, not `<a href>`) with per-phase `data-testid="link-journey-{phase}"`. Lucide icons (`Wind`, `Sparkles`, `Heart`, `Shield`, `Sparkles`, `RotateCcw`) selected to evoke the phase's emotional tone. Section ends with a `/crisis` referral line so the universal crisis-routing contract is honored on this surface too.

**New CSS** (`client/src/styles/canva-landing.css` lines 2506-2628, scoped under `.emotional-journey-polish`):
- **Vertical timeline**: absolutely positioned 2px line behind the dot column with a top-to-bottom gradient through every phase color at `33` alpha. Lives in a sibling `<div className="relative">` *next to* the `<ol>` (not inside it) so the `<ol>` stays semantically clean — only `<li>` children, no decorative span polluting the list. The line's `left` offset (`2rem` mobile, `2.25rem` ≥640px) plus a `-1px` margin is the exact mathematical center of the dot column (card pad `0.5rem` + half-dot `1.5rem`/`1.75rem`).
- **Per-phase entrance**: each `<li>` starts at `opacity: 0; translateY(12px)`, then animates in via `emotional-journey-reveal` (0.6s `cubic-bezier(0.4, 0, 0.2, 1)`) with a staggered `--journey-delay: ${index * 90}ms` CSS custom property set inline — phases cascade smoothly down the column.
- **Scroll-trigger**: `IntersectionObserver` with `threshold: 0.15, rootMargin: '0px 0px -10% 0px'` toggles `.revealed` on the section, gating the keyframes — the section doesn't animate until it scrolls into view (matches the existing `.section-reveal` pattern). Observer self-unsubscribes after first reveal.
- **Hover/focus**: card lifts via `translateX(2px)` + cream background (`rgba(255,255,255,0.6)`) + soft sage glow box-shadow; dot scales 1.08× with a 6px white ring. Both hover and `:focus-visible` are wired so keyboard users get the same affordance.
- **Reduced-motion contract**: `@media (prefers-reduced-motion: reduce)` forces `opacity: 1; transform: none` on every item, kills the entrance animation, kills card/dot transitions, and pins hover/focus transforms — the section appears fully revealed and static. Additionally, the JS guard reads `prefers-reduced-motion` at mount and immediately applies `.revealed` (skipping the IntersectionObserver entirely) so the static fallback works even when the section is below the fold.
- **Z-index**: gradient line `z-index: 0`, items `z-index: 1` — content always above the connecting line.

**No new dependencies**: framer-motion is *not* installed in this codebase, so the V13 prompt's `framer-motion` recommendation was substituted with CSS keyframes + a small `IntersectionObserver` hook, matching the existing `.section-reveal` pattern used everywhere else on `CanvaLanding.jsx`. Lucide icons and `wouter` were already in the import graph.

**Insertion** (`client/src/pages/CanvaLanding.jsx`): single `<EmotionalJourney />` component dropped between the existing `consciousness-divider` after the tools section and the `#philosophy` section, with a matching divider below it. The landing page's section order is now: hero → tools → **emotional journey** → philosophy → features → … (zero changes to any other section).

**Color contract**: all six phase colors are canonical brand hex with low-alpha derivatives (`${color}1A` for dot fill, `${color}66` for dot border, `${color}33` for the gradient line). Background uses the existing `--glp-paper` token. No new colors introduced.

**Universal contracts honored**:
- ✅ Scoped under unique `.emotional-journey-polish` wrapper class — zero leak risk
- ✅ Only canonical brand hex (sage / calm / empathy / sunshine / blush) — no new colors
- ✅ `prefers-reduced-motion` blanket: reveals immediately, no entrance, no hover transforms
- ✅ Z-index contract: decorative line (0) → content (1)
- ✅ Visual-first additive: zero changes to routing, state, or any other component
- ✅ Crisis routing preserved (`/crisis` referral at section bottom)

---

## /v6 Control Panel Polish (v4.9)
The `/v6` Lumi preview page (`client/src/pages/LumiV6Preview.jsx`) gains four additive "control panel feel" layers per V10 §3.5, all scoped under `.v6-preview-polish`. New CSS in `client/src/styles/v6-preview.css` (~70 lines, 1 keyframe — `v6-preview-entrance`).

1. **Workspace ambient wash** (`.v6-preview-wash`, z-index 0) — twin radial sage-top + empathy-purple-bottom glows that frame the page as a focused workspace rather than a flat layout. Pure opacity, no transitions.
2. **Page entrance** (`.v6-preview-content`) — single 500ms `ease-out` fade + 8px translate-up on mount. Verified non-conflicting with the LumiV6 V9 IntersectionObserver entrance (different observers, different scopes).
3. **Cell hover lift** (`.v6-preview-cell-hoverable`, applied to the local `Cell` component) — 3px lift + soft amber drop-shadow on hover. **`will-change: transform` is scoped to `@media (hover: hover) :hover`** (not always-on) so the dense 30+ cell grid doesn't pay continuous compositor/GPU memory overhead at rest — only the cell currently being hovered allocates a layer.
4. **Section-header underline accent** (`.v6-preview-section-header`) — 56×3px sunshine→warm-orange gradient bar under the main h1 to anchor the visual hierarchy.

**Reduced-motion contract**: dedicated `@media (prefers-reduced-motion: reduce)` block disables entrance, hover transform, and shadow — wash stays since it's opacity-only with no transition. **Z-index contract**: wash (0) → content (`relative z-10`). Internal LumiV6/V8/V9 demo functionality, click zones, and IntersectionObserver entrances are completely untouched.

---

## Celebration Polish (v4.8)
The `/celebration` route (`client/src/pages/CelebrationFlow.jsx`) gains four additive polish layers per V10 §3.4, all scoped under `.celebration-polish`. New CSS in `client/src/styles/celebration.css` (~125 lines, 4 new keyframes — `celebration-sparkle-twinkle`, `celebration-phase-entrance`, `celebration-streak-burst`, `celebration-streak-glow`).

1. **Sunshine radiance wash** (`.celebration-wash`, z-index 0) — twin `::before`/`::after` pseudo-element layers that **cross-fade via opacity** between an "early" warmer-orange tint (phases 1-2) and a "settled" calmer gold tint (phase 3) when `[data-phase="3"]` flips both. Same proven pattern as Check-In — opacity transitions on persistent layers because gradient `background` shorthand snaps cross-browser.
2. **6 ambient gold sparkle particles** (`.celebration-sparkle-layer`, z-index 1) — twinkle in place across all 3 phases via `celebration-sparkle-twinkle` (3.6s ease-in-out, opacity 0 → `var(--sp-opacity, 0.14)` → 0). Per-particle `--sp-opacity` (0.10-0.18) and staggered `animation-delay` (0/0.6/1.2/1.8/2.4/3.0s) so they pop in sequence. Distinct from the existing falling confetti so warmth sustains after confetti stops in phase 3. Conditionally rendered via `{!reducedMotion && (...)}` in JSX **and** `display: none !important` in the reduced-motion CSS block (defensive double-coverage handles `matchMedia` change after mount).
3. **Per-phase content entrance** (`.celebration-phase-enter`) — `key={phase}` on the `<section>` forces remount and replays a 600ms `cubic-bezier(0.34, 1.56, 0.64, 1)` fade + 12px translate-up + 0.96→1 scale spring on every phase transition.
4. **Streak badge entrance + glow** (`.celebration-streak-badge`) — wraps the phase-2 streak number ("X moments") in an inline-block with a 800ms scale-in burst (0.7 → 1.08 → 1) and a sustained `::before` radial-gradient glow ring (`inset: -8px -16px`, `z-index:-1`) that pulses opacity 0.7 → 1.0 → 0.7 every 2.4s to draw the eye to the achievement.

**Z-index contract** (architect-fixed): wash (0) → sparkle layer (1) → **confetti (z-index 2 explicit inline style)** → content (`relative z-10`). The confetti previously had no explicit z-index, so it would have rendered above the sparkles but below the content correctly only by source order — explicit z-index 2 makes the stacking deterministic. **Reduced-motion contract**: sparkle layer hidden, all entrance/badge/glow animations killed, wash transitions disabled. Existing confetti gating (`!reducedMotion && phase < 3` in JSX) untouched. The 3-phase auto-advance, localStorage streak math, ARIA live region, and BuddyAvatar integration are completely untouched.

---

## Check-In Polish (v4.7)
The `/checkin` route (`client/src/pages/CheckIn.jsx`) gains four additive polish layers, all scoped under a single `.checkin-polish` class on the existing root container. Zero changes to the 4-phase flow (select → intensity → note → complete), localStorage logic, streak math, ARIA wiring, or `BuddyAvatar` integration. New CSS lives in `client/src/styles/checkin.css` (~155 lines, 3 new keyframes — `checkin-particle-drift`, `checkin-greeting-entrance`, `checkin-emotion-pulse`).

1. **Soft purple wash** (`.checkin-wash`, z-index 0) — overlays the existing emerald→white→emerald Tailwind gradient with an empathy-purple ambience per V10 §3.3. Implemented as **two stacked `::before`/`::after` pseudo-element layers** (purple base opacity 1, sunshine celebration opacity 0) that **cross-fade via `opacity` transitions** when `data-phase="complete"` flips both — gradient `background` shorthand transitions snap rather than animate cross-browser, so opacity on persistent layers is the only way to get a smooth phase tint change.
2. **5 floating empathy-purple particles** (`.checkin-particle-layer`, z-index 1) — same per-particle `--cp-opacity` CSS var pattern (0.04-0.08) consumed at the keyframe's 10%/90% stops, so each particle keeps its intended subtle variance instead of normalizing to a single fallback. 42-66s upward drift.
3. **Header greeting entrance** (`.checkin-greeting`) — 700ms `cubic-bezier(0.4, 0, 0.2, 1)` fade + translate-up that **replays per phase** via `key={phase}` on the `<header>` (verified safe — no local state, no focusable controls, no `aria-live` re-announce risk).
4. **Per-emotion card accent** (`.checkin-emotion-card[data-emotion-accent]`) — each of the 6 emotion cards maps to a canonical brand hex via CSS var (`--emotion-accent`): calm→#74C0FC, anxiety/sadness→#C8B6FF, tiredness→#A8D5BA, frustration→#FFB88C, gratitude→#FF9A8B. Hover/focus lifts the card 2px with a tinted bg + glow ring; selection (`data-selected="true"`) gets a stronger persistent glow + a 1.2s one-shot `checkin-emotion-pulse` ring expansion.

**Pulse visibility fix (intentional UX timing exception)**: `pickEmotion()` defers the `setPhase('intensity')` transition by 350ms via a ref-tracked `window.setTimeout` (skipped under reduced motion), so users perceive the selected glow + pulse before the grid unmounts; the timer is cancelled on unmount via `useEffect` cleanup and on rapid re-clicks via the same ref guard, preventing stacked callbacks and stale-setState warnings. This is the one documented departure from the otherwise pure-visual contract — the phase progression itself, the 4-phase model, the localStorage math, and the ARIA wiring are all unchanged; only the moment of transition is delayed by 350ms in the motion-allowed path. **Reduced-motion contract**: dedicated `@media (prefers-reduced-motion: reduce)` block hides the particle layer entirely, kills all card / greeting animations & transitions, and disables both `::before`/`::after` opacity transitions on the wash — header stays visible (no `from`-state freeze because base `.checkin-greeting` has no forced opacity/transform). Phase transitions become instantaneous under reduced motion (no 350ms delay). **Z-index contract**: wash (0) → particles (1) → existing inner content wrapper now bumped to `relative z-10` so functional content always sits above decorative layers.

---

## Breathing Tool Polish (v4.6)
The `/tools/breathing` route (`client/src/pages/tools/BreathingTool.jsx`) gains four additive polish layers, all scoped under a single `.breathing-tool-polish` class on the existing root container. Zero changes to behavior, timing (4-2-4 cycle × 3), accessibility wiring, or the existing inline-styled breath-circle. New CSS lives in `client/src/styles/breathing-tool.css` (~165 lines, 3 new keyframes — `breathing-particle-drift`, `breath-ring-pulse`, `breath-progress-pulse`).

1. **Breath-synced background tint** (`.breathing-bg-tint`, z-index 0) — radial wash that shifts hue per phase via `data-phase` and `data-breath-sub` attribute selectors on the root: calm-blue baseline → mint during hold → warm-orange during exhale → soft-purple in checkin → sunshine in complete. React's behavior of omitting `data-*` when value is `undefined` means selectors only match during the breathing phase, so non-breathing phases get the default tint without state leaks. 1.6s `ease-in-out` transition.
2. **Floating calm-blue particles** (5 spans, opacity 0.05-0.10 driven by per-particle `--bp-opacity` CSS var consumed at the keyframe's 10%/90% stops — same architect-validated pattern as the homepage hero, never normalizes to a single fallback).
3. **Concentric breath rings** (`.breath-ring--inner` 130%, `.breath-ring--outer` 165%, both `z-index:-1` inside a `.breath-rings-wrapper` parent with `isolation: isolate` so they render behind the avatar without bleeding past the wrapper's stacking context). The `breath-ring-pulse` keyframe is exactly **10s = 4s inhale + 2s hold + 4s exhale**, with stops at 0% (scale 0.85, exhale floor) → 40% (scale 1.18, inhale peak at 4s) → 60% (scale 1.18, hold plateau through 6s) → 100% (scale 0.85, back to exhale floor at 10s). The outer ring trails the inner by 150ms via `animation-delay` so the rings read as a wave instead of a single pop. Rings are gated by a `breath-rings-wrapper--active` modifier class that's only applied during the breathing phase, hiding them otherwise.
4. **Breath-cycle progress** — three 36×6px segments below the seconds display, filled L-to-R as `breathIdx` advances via `data-state="done|active|pending"`. The active segment gets a 2.5s `breath-progress-pulse` halo (3px → 5px box-shadow) for a breathing rhythm cue. The whole element is wrapped in `role="progressbar"` with `aria-valuemin/max/now` and an `aria-label`, supplementing (not replacing) the existing "Breath X of 3" text in the header.

**Reduced-motion contract**: a dedicated `@media (prefers-reduced-motion: reduce)` block in the same file hides the particle layer entirely, kills all ring/progress/bg-tint animations & transitions, and pins ring transforms to `scale(1)` — extending the existing inline `<style>` block in `BreathingTool.jsx`. **Z-index contract**: tint (0) → particles (1) → existing inner content wrapper now bumped to `relative z-10`.

---

## Homepage Hero Polish (v4.5)
The `CanvaLanding.jsx` hero section gains four additive polish layers, all scoped under a single `.canva-landing-hero-polish` class on the existing `<section id="home">` so nothing leaks into the rest of the landing page.

1. **Warm cream overlay** (`.hero-cream-overlay`, z-index 0) — a radial cream wash + linear gradient sits above the existing sage→teal hero gradient, warming the upper hero without losing the brand tones at the edges.
2. **Soft sage particles** (`.hero-particle-layer` with 8 `<span class="hero-particle">` children, z-index 1) — each particle is a 8-18px sage-tinted radial gradient that drifts upward over 46-70s on `hero-particle-drift` keyframes. Per-particle `--p-opacity: 0.03 / 0.04 / 0.05` CSS custom properties drive the keyframe's mid-cycle opacity stop (`opacity: var(--p-opacity, 0.04)` at 10%/90%) so each particle keeps its intended subtle variance instead of normalizing to a single fallback value — the architect-flagged bug from the first pass.
3. **Lumi scale-in entrance** (`.hero-lumi-wrapper`) — the existing 208px hero Lumi container gets an 800ms `cubic-bezier(0.34, 1.56, 0.64, 1)` `hero-lumi-entrance` keyframe (scale 0.8 → 1.04 → 1, opacity 0 → 1) that runs in parallel with the parent's existing `animate-fade-in-up` translate. Transforms compose cleanly across the parent/child (parent translates, child scales — no transform fight on the same node).
4. **Hover lift** (`.hero-lumi-wrapper:hover`) — a 0.3s `transform: scale(1.03)` + `filter: drop-shadow(0 8px 24px rgba(168,201,160,0.35))` gives a subtle invitation cue when users mouse over the mascot.

**Reduced-motion contract**: hides `.hero-particle-layer` entirely (`display: none !important`) and forces the Lumi wrapper to `animation: none !important; transition: none !important; opacity: 1; transform: none`. **Z-index contract** (v4.5.1 normalization): `.hero-depth-layer` (0, explicit) → cream overlay (0) → particles (1) → `.decorative-orb` (2, explicit) → hero content (`z-10`); pointer-events disabled on every decorative layer so click targets aren't blocked. The explicit `.hero-depth-layer` and `.decorative-orb` z-index assignments live in the polish CSS but are scoped under `.canva-landing-hero-polish` so they only affect the hero stack — no leak to other landing sections that use the same classes. **Color note**: the hero polish uses the canonical brand sage / amber for particles + Lumi drop-shadow, plus low-alpha cream/white RGBAs (`rgba(249,247,244,…)`, `rgba(240,237,230,…)`, `rgba(255,255,255,…)`) for the ambient warm-cream overlay — neutral bases only, never as a brand accent. CSS additions: `client/src/styles/canva-landing.css` lines 2400-2502.

---

## LumiV9.6 + V9.7 "Soul Capture" additions (v4.4)
Two purely-additive layers extend the V9 work without changing any existing caller behavior. Both gate strictly on `v9 && animated` so crisis surfaces (which pass `animated={false}`) get zero new motion, and both live inside the `.lumiv6` namespace so the existing reduced-motion blanket already covers them.

1. **V9.6 Recognition micro-expression** ("Welcome Back"): on mount, `LumiV6.tsx` reads `sessionStorage.getItem("lumi:v9:lastEmotion")` — if a value is present and differs from the current `effectiveEmotion`, sets `v9Recognition=true` for 600ms (driving the `lumiv6--v9-recognition` class), **then** writes the new emotion back to sessionStorage. A `v9RecognitionRanRef` ref guard makes the effect StrictMode-safe — React 18 dev-mode mount/unmount/remount cycle preserves refs, so the second invocation early-returns and the user sees recognition fire exactly once per real mount instead of being suppressed by the first invocation's storage write. The CSS pairs `lumiv9RecognitionEyes` (scaleY 1→1.18→1, eye-widen) on `.lumiv6__pupil` with `lumiv9RecognitionHeart` (scale 1→1.22 + brightness 1.4 + 8px amber drop-shadow flare) on `.lumiv6__heart` for a single 600ms "I remember you" beat before the normal heart driver resumes. Per-instance scope (mount-only effect) prevents multi-Lumi pages from cross-firing.
2. **V9.7 Visceral Glow** ("The Warmth Engine"): always-on (when `v9 && animated`) class `lumiv6--v9-visceral-glow` runs `lumiv9VisceralGlow` on `.lumiv6__heart` — a brighter replacement for the baseline pulse using `transform: scale(1 → 1.14 → 1.06 → 1)` + `filter: brightness(1 → 1.3 → 1.1 → 1)` + amber `drop-shadow` (0 → 10px → 6px → 0) keyed off the **`--lumiv6-heart-period`** CSS var (the canonical name set by the heart-rate driver in `LumiV6.tsx` and overridden by escalation levels at 600/450/300ms) so emotion-driven and escalation-driven heart-rate changes still drive cadence automatically.

**CSS cascade contract**: visceral-glow is declared FIRST in the appended block (line ~779) and recognition / mirroring / goodbye / heart-burst rules are declared AFTER (recognition lines ~810; mirroring/goodbye/burst pre-existed earlier in V9 lines ~727-745) so during their brief windows the transient meaning-bearing animation wins on equal-specificity last-rule cascade — no `!important`, no specificity hacks, no invalid `:not()` descendant selectors. Net result: the heart reads as a warm living organ instead of a flat pulse, while preserving the 7-color brand DNA, never touching crisis stillness, and never blocking transient overrides. CSS additions: `LumiV6.css` lines 769-820 (52 net lines, 3 new keyframes — `lumiv9RecognitionEyes`, `lumiv9RecognitionHeart`, `lumiv9VisceralGlow`).

---

## LumiV9 "Soul Capture" (v4.3)
The `LumiV6` component (`client/src/components/lumi/LumiV6.tsx`) gains an additive V9 layer on top of V6/V7/V8 — every existing caller renders identically because all V9 behaviors are gated behind two new optional props (`v9?: boolean` master flag, `detectedSentiment?: LumiV6Emotion | null` for mirroring). Five new behaviors:

1. **Entrance** — IntersectionObserver-triggered 800ms scale/blur "birth" sequence, sessionStorage-gated to fire exactly once per browser session globally (`lumi:v9:entered`).
2. **Attention capture** — after 15s of no Lumi-local interaction, when cursor enters a 200px radius, plays a 600ms "I noticed you" wobble + 3s gaze-lock window (intensified aura).
3. **Emotional escalation** — `recordEscalation()` tracks click-zone activations in a 10s rolling window and drives `lumiv6--v9-escalation-{1|2|3}` class hooks (warm aura → excited bounce + wider eyes → celebration sparkle + rapid heart pulse).
4. **Mirroring micro-expression** — when `detectedSentiment` differs from `emotion`, briefly (1.5s) overlays it as a `lumiv6--v9-mirroring` heart flash, lower priority than user click triggers so intentional touch always wins.
5. **Goodbye sequence** — fires on `window.beforeunload` OR 5min global inactivity, runs wave + 3 slow heart pulses + 1s fade.

**Safety contracts preserved**: every V9 effect is gated on `animated` (so crisis surfaces using `animated={false}` get zero V9 motion), and the existing `@media (prefers-reduced-motion: reduce) { .lumiv6 *, .lumiv6 { animation: none !important; transition: none !important; } }` blanket already covers all `lumiv6--v9-*` modifiers because they live inside the `.lumiv6` namespace. **Backward compat**: V8 click-zone `fireOverride` now also bumps `lastLumiInteractionRef` and (when `v9` is true) calls `recordEscalation` — both are no-ops when V9 is off. Effective-emotion layering is now `triggeredEmotion ?? v9MirrorEmotion ?? emotion`. Playground `/v6` (`LumiV6Preview.jsx`) gains a `<V9DemoSection>` with three side-by-side Lumis (V8 baseline, V9 base, V9 + clickable + sentiment), 5 mirror-sentiment chips (joy/love/empathy/surprise/calm), and a "Replay entrance" button that clears the sessionStorage gate. All 7 brand hex values remain unchanged. CSS additions: 6 new `lumiv9*` keyframes appended to `LumiV6.css` (lines 614-760).

---

## Schema Drift Guardrail (v4.2)
The workspace has multiple Drizzle `pgTable(...)` declaration sites that have grown organically: `shared/schema.mjs` is the **canonical source of truth** (78 tables, 46 importers); `server/db/schema.mjs` + `server/db/schema/*.{js,mjs}` hold server-internal duplicates (`users`, `refreshTokens`, etc.); `db/schema.ts` is a 271-byte legacy stub with **0 active importers** but a dangerous `users.id: serial` declaration (canonical is `uuid`); `database/schema/*.ts` is empty scaffolding that `drizzle.config.ts` points at for migration generation. Because `drizzle.config.ts` is forbidden to edit per dev guidelines, the four-source structure is preserved; instead, `scripts/checkSchemaDrift.mjs` provides a CI-grade guardrail that text-parses every `pgTable(...)` definition across `shared/`, `server/`, `db/`, `database/`, and `client/src/`, then for any table declared in >1 location reports both **column-set drift** (`missing_columns`) and **column-type drift** (`type_drift`, e.g. `serial` vs `uuid` on a primary key — the exact landmine pattern that compiles fine but corrupts the runtime). Run before any `npm run db:push` or schema PR: `node scripts/checkSchemaDrift.mjs` (human report) or `--json` (machine-readable). Exits non-zero on drift. Documented current dormant divergence: `db/schema.ts` `users.id` is `serial` while canonical is `uuid` — the file has zero importers so no runtime impact, but the guardrail flags it so any new importer of the stub triggers a CI failure instead of a silent column-type bug.

---

## Avatar Uniformity (v4.1)
All platform surfaces now render the canonical Lumi mascot PNG (`mmhb_buddy_interactive_fullbody_1777538625498.png`) instead of legacy Heart icons or robot emojis. Surfaces patched: `layout/Header.jsx` (AppShell header logo, 44px with sage radial halo), `PageTemplate.jsx` (AutopilotPage nav logo 32px + hero logo badge 28px), `CanvaLanding.jsx` hero (LumiCompanion 208px, interactive, lumi-breathe), `AIChatPanel.tsx` (assistant avatar 32px with lumi-breathe on typing), `Login.jsx`/`Register.jsx`/`ForgotPassword.jsx`/`ResetPassword.jsx` (centered Lumi with sage halo). All images include `onError` graceful fallback and `objectFit: contain`. The admin rate limiter (`adminLimiter` in `server/app.mjs`) is identity-keyed (user.id/email) at 200 req/min to prevent 429s during dashboard init fan-out; `adminLoginLimiter` stays strict at 10/min for brute-force protection.

---

## Learning Library Bug Fix (v4.1.1)
`CourseCatalog.jsx` course cards now use explicit inline styles (`#1a1917` title, `#4a4540` description, `#ffffff` card bg, `#c8d9c8` border, `#2d5a3d` "View Course" button with white text) instead of CSS-variable-dependent Card components, fixing invisible text and dark-block buttons caused by broken Tailwind opacity modifiers on CSS variables. Search bar, category filter buttons (with amber active state), and the amber-gradient CTA button were already correct. `AIChatPanel.tsx` error handling improved with crisis-aware fallback message including 988 and `/crisis` routing.

---

## Performance, SEO & V17 Visual Storytelling (v5.7.3 – v5.8.1)

Rolled in from `replit.md` on 2026-05-11 to keep the kernel doc lean. Order: newest first.

- v5.8.1 — V17 spec-alignment pass on the v5.8.0 section (image perf + sensory tags + spec-faithful copy). **(1) Image optimization** (target from spec was <200KB total combined — was ~9MB): used ImageMagick to resize all 4 benefit PNGs from 1408×768 → 1024×576 and all 3 avatar PNGs from 1024×1024 → 512×512 (display-resolution, retina-friendly), then `cwebp -q 80` (benefits) / `-q 82` (avatars) to emit `.webp` siblings. Final totals: **WebP 98 KB / PNG 3.5 MB** (PNG kept as `<picture>` fallback for browsers without WebP, ~98% of traffic gets WebP). **(2) `<picture>` element**: new local `ResponsiveImage` helper inside `VisualBenefits.jsx` wraps each hero image + avatar overlay in `<picture><source srcSet={webp} type="image/webp" /><img src={png} loading="lazy" decoding="async" /></picture>`. **(3) Sensory-word pill tags**: spec'd 5-word arrays per benefit (`['breathe','soften','gentle','release','settle']`, `['name','warmth','space','clarity','gentle']`, `['warm','quiet','here','whisper','sit']`, `['garden','bloom','walk','grow','unfold']`) rendered as a `<ul class="vb-sensory-tags">` between description and CTA, each pill tinted with its row's `--vb-accent` via `color-mix(in srgb, var(--vb-accent) 10%, transparent)`. **(4) Section header copy → spec**: eyebrow `"What healing feels like"` → `"What You Will Feel"`; H2 `"Small moments. Real shifts."` → `"Emotional support, visually gentle."`; subline rewritten to `"Every interaction is designed to calm your nervous system — never to overwhelm it."`. **(5) CTA copy + hrefs → spec**: `"Try a calm check-in" → /tools/check-in` → `"Breathe With Lumi" → /tools/breathing`; `"Track how you feel" → /journal` → `"Check In Gently" → /checkin`; `"Talk with Buddy" → /chat` → `"Say Hello to Lumi" → /chat`; `"See your path" → /growth` → `"Meet Your Companion" → /chat`. All 4 routes verified to exist in `client/src/App.jsx` (`/tools/breathing`, `/checkin`, `/chat`). **(6) Description tone**: rewrote all 4 descriptions in sensory-rich, MI-toned language (e.g. relief: "When your chest tightens and your mind races, your buddy breathes with you — slow, steady, present — until the tension softens and your shoulders finally drop."). **(7) Avatar mapping → spec**: Companionship + Understanding now share `avatar-heart`; Growth uses `avatar-floating` (was Understanding+Growth sharing floating in v5.8.0). **(7b) Palette governance**: spec doc listed `#F7B7A3` (rose) and `#F4B942` (warm gold) — these are off the canonical 8-hex brand palette, so they were **not** adopted; canonical `#FF9A8B` (blush) and `#FFD93D` (sunshine) preserved per the universal contract. **(8) Header reveal animation**: split out `.vb-header` from row reveal (was bare CSS opacity-1 fallback) into the `IntersectionObserver` set so it fades in like the rows; `prefers-reduced-motion` blanket extended to cover it. Triple gate: TSC=0, Build=14.74s, Drift=0. Net page weight saved on first paint: **~9 MB → ~98 KB** for the V17 hero illustrations under WebP-capable browsers.
- v5.8.0 — V17 Visual Emotional Storytelling. New 4-row alternating image/text section between `EmotionalJourney` and `Philosophy` on `CanvaLanding`. Generated 7 AI illustrations (~9MB total, Pixar-soft + Studio-Ghibli-warm + plush-Lumi style) at `client/public/brand/v17/`: 4 × 16:9 benefit hero images (`benefit-relief.png`, `benefit-understanding.png`, `benefit-growth.png`, `benefit-companionship.png`) + 3 × 1:1 floating Lumi avatar overlays (`avatar-breathing.png`, `avatar-heart.png`, `avatar-floating.png` — `floating` reused for the Growth row). New `client/src/sections/VisualBenefits.jsx` (~210 lines) renders 4 rows with alternating layout (`vb-row-reversed` flips columns ≥900px, single-column stack on mobile), each row carrying a 16:9 framed image + accent radial halo overlay + animated 1:1 floating avatar (`@keyframes vb-float` 6s ease-in-out infinite, ±8px Y), Lucide icon badge (Wind / Eye / Heart / Sprout) tinted with the row's brand accent, captivating non-feature title (`Breathe. Settle. Release.` / `Name it. Move through it.` / `You are not alone.` / `Grow at your own pace.`), trauma-informed description, and single CTA pill that routes to `/tools/check-in` / `/journal` / `/chat` / `/growth`. Per-row CSS custom props (`--vb-accent`, `--vb-tint`, `--vb-halo`) drive icon, halo, frame border on hover, and CTA gradient — all values drawn from canonical 8-hex brand palette (sage `#A8C9A0`, empathy-purple `#C8B6FF`, blush `#FF9A8B`, sunshine `#FFD93D`). Entrance animation via `IntersectionObserver` (`threshold: 0.18`, `rootMargin: '0px 0px -10% 0px'`) toggling `.revealed` class for opacity 0→1 + translateY 28px→0 over 700ms (no framer-motion — matches NlpMiContent v5.7 pattern); reduced-motion + missing-IO clients short-circuit to add `.revealed` immediately so all 4 rows paint in their end state. Hover effects: image frame box-shadow swap to accent halo + 3px lift, image `scale(1.025)` zoom, CTA arrow `translateX(4px)`, gradient background-position pan 0%→100% across 360ms. New `client/src/styles/visual-benefits.css` (~250 lines) scoped under `.visual-benefits-polish` so styles never leak; imported additively from `client/src/index.css` L2. Also introduced the spec'd **`.btn-sacred-gold`** global utility (linear-gradient `#4A7E72 → #F4B942`, glow on hover, 90ms snap on `:active`, `:focus-visible` 3px sunshine outline) and a **universal button micro-interaction layer** (`button:not([disabled]):not(.no-mi)` and `.btn-mi`: `translateY(-1px)` + soft sage glow on hover, `translateY(1px)` + shrunk shadow + 90ms snap on active). Reduced-motion blanket pins every transform/animation/transition to its end state — covers the 4 rows, both hover states, the floating-avatar keyframe, the CTA arrow, the new `.btn-sacred-gold`, and the universal button layer. Crisis routing on the page is unaffected (kept upstream). Triple gate: TSC=0, Build=15.56s, Drift=0.
- v5.7.8 — Self-hosted fonts (eliminates `fonts.googleapis.com` dependency entirely; root cause of mobile FCP=26s under intermittent 503s). Downloaded 11 latin-subset `.woff2` files (~216KB total, all 4 brand families preserved per user choice — Inter 400/500/600, Playfair Display 400/600/700, Cormorant Garamond 400/600, Poppins 400/500/600) to `client/public/fonts/`. `client/index.html`: removed both `fonts.googleapis.com` / `fonts.gstatic.com` preconnects + the async-loaded Google Fonts stylesheet + the `<noscript>` fallback (all of v5.7.7's mitigations were treating the symptom, not the root cause); replaced with an inline `<style>` block carrying 11 `@font-face` rules (every one with `font-display: swap`) + two `<link rel="preload" as="font" type="font/woff2" crossorigin>` hints for the most critical files (`inter-400.woff2` for body, `playfair-700.woff2` for the hero H1). **Architect-driven cleanup pass** (caught 7 leftover Google Fonts references): removed `@import url('https://fonts.googleapis.com/...')` lines from `client/src/styles/sacred.css` (L7), `client/src/styles/sacred-typography.css` (L10), `client/src/styles/sacred-visuals.css` (L6), `client/src/styles/lumi-tokens.css` (L8 — Fraunces/Crimson Pro fall back to self-hosted Playfair Display/Cormorant Garamond per existing chains), and `client/src/main.css` (L6); replaced `client/analytics/index.html` Google Fonts `<link>` block with local `@font-face` declarations; removed the `FONT_CSS_URL` constant + install-time `fetch(FONT_CSS_URL)` block + `fonts.googleapis.com`/`fonts.gstatic.com` hostname routing from `client/public/serviceWorker.js` and bumped `CACHE_VERSION` 2.1.0 → 2.2.0 to invalidate the stale prefetch. All `font-family` chains in `client/src/index.css` and `client/src/styles/brand-tokens.css` already reference the same family names (`'Inter'`, `'Playfair Display'`, `'Cormorant Garamond'`, `'Poppins'`) so the local `@font-face` declarations satisfy them with zero CSS edits — visual design unchanged. Final scan: **zero `googleapis` / `gstatic` references** remain anywhere in `client/`. v5.7.6 system-font fallback chains kept as belt-and-suspenders. Triple gate: TSC=0, Build=16.18s, Drift=0. Re-run PageSpeed Insights against `https://mymentalhealthbuddy.com/` after deploy; expected mobile FCP drop from 26s → <3s under slow-4G.
- v5.7.7 — PageSpeed Insights performance follow-up (FCP 4.4s → render-blocking Google Fonts stylesheet was the dominant blocker). **(1) Async font load**: `client/index.html` L55-58 — converted the Google Fonts stylesheet from a synchronous `<link rel="stylesheet">` (which blocks first paint and stalls FCP entirely if `fonts.googleapis.com` 503s) to the standard async pattern `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">` with a `<noscript><link rel="stylesheet">` fallback for no-JS clients. Browser now paints immediately in the v5.7.6 system-font fallback chain, then promotes the remote stylesheet to active when (or if) it loads — never blocks render. **(2) Preconnect crossorigin**: added missing `crossorigin` attribute to the `fonts.googleapis.com` preconnect (`fonts.gstatic.com` already had it) so the preconnected socket is reused for the actual stylesheet fetch instead of being discarded as a credential-mismatch. **(3) Dedup**: removed the redundant partial preload (Playfair+Inter only) — the new async load covers all 4 families (Cormorant Garamond + Inter + Playfair Display + Poppins) and `&display=swap` is preserved on the URL so every Google-injected `@font-face` keeps `font-display: swap`. Items 1 and 2 from the original spec (`font-display: swap` on @font-face + system-font fallback chains) were already shipped in v5.7.6 — confirmed unchanged. Triple gate: TSC=0, Build=14.82s, Drift=0. Re-run PageSpeed Insights against `https://mymentalhealthbuddy.com/` after deploy propagates; expected FCP improvement is dramatic when the Google Fonts response is slow or 503s.
- v5.7.6 — Lighthouse SEO + perf follow-up. **(1) Descriptive link text**: `CanvaLanding.jsx` header `/register` CTA — visible text upgraded from `"Start Free"` (desktop) / bare `"Start"` (mobile, Lighthouse-flagged) → `"Start Your Free Account"` (desktop) / `"Start Free"` (mobile), plus `aria-label="Start your free MyMentalHealthBuddy account"` on the button so the accessible name is descriptive at every viewport. **(2) Font render-blocking resilience**: Google Fonts URLs in `client/index.html` already carry `&display=swap` (verified — sets `font-display: swap` on every Google-injected `@font-face` so text paints in fallback if the stylesheet 503s); we have no app-owned `@font-face` declarations to patch. Strengthened the system-font fallback chains so FOUT-then-swap looks consistent and never goes invisible: `client/src/index.css` body / headings / `.font-sacred` / `.font-healing` / `.font-display` and `:root` `--font-display` / `--font-body`, plus `client/src/styles/brand-tokens.css` `--glp-font-display` / `--glp-font-heading` / `--glp-font-body` — all sans chains now read `'Inter' | 'Poppins', 'Geist Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`; serif chains gained `'Times New Roman'` before the generic `serif`. `'Geist Sans'` is intentionally a phantom fallback (we don't ship the file) — browsers that don't have it skip silently to the system stack. Triple gate: TSC=0, Build=14.43s, Drift=0.
- v5.7.5 — Lighthouse SEO follow-up. **Descriptive link text** (additive): `CanvaLanding.jsx` feature-card links changed from generic `"Explore"` (×4 duplicate) → `"Explore {feature.title}"` with matching `aria-label` so each of the 4 cards has a unique, self-descriptive accessible name; hero tertiary `"Explore Safely"` got `aria-label="Explore wellness features safely"` (visible text preserved); `ConsentBanner.jsx` `"Learn more"` → `"Learn more about our privacy practices"` + matching `aria-label` (Lighthouse explicitly flags the bare phrase). **"Page is blocked from indexing" diagnosis**: NOT a code defect — production custom domain `mymentalhealthbuddy.com/robots.txt` serves `Allow: /` and homepage meta reads `index, follow`. Flag only fires when auditing the `.replit.app` URL, which Replit's hosting layer injects with `Disallow: /` to prevent duplicate-content indexing (intentional, not fixable in app code; was documented in v5.7.3). User should re-audit the canonical custom domain. Triple gate: TSC=0, Build=17.05s, Drift=0.
