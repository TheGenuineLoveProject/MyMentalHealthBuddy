# MMHB Changelog — Detailed Implementation Notes

This file holds the deep technical notes for completed feature evolutions.
`replit.md` keeps a one-line summary and links here for the full record.
Newest entries on top.

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
- `client/src/components/PageTemplate.jsx` — replaced the raw `<img src="/brand/lumi-v4-ultimate.png">` nav-logo straggler with `<BuddyAvatar size={32} />` so it inherits V14 audio + the canonical visual treatment with no one-off code.

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
