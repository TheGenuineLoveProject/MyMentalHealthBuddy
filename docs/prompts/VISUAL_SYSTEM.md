# /docs/prompts/VISUAL_SYSTEM.md

- Name: VISUAL SYSTEM — Tokens + 3 Modes + Component Library + Enforcement (Hard Gate)
- Objective (1 sentence):
  Implement and enforce a unified, accessible, neurodivergent-friendly visual design system (tokens → components → templates → assets → effects) and prevent visual drift via automated “Visual Doctor” gates.

- Inputs (explicit fields):
  - styling_stack: "tailwind" | "css-vars" | "tailwind+css-vars" (default: "tailwind+css-vars")
  - token_location:
    - css_vars_file: "/styles/tokens.css" (or "/app/globals.css" if required)
    - ts_tokens_file_optional: "/src/design/tokens.ts"
  - component_location: "/src/components/ui"
  - primitives_location: "/src/components/primitives"
  - gallery_route: "/app/_design/page.tsx" (internal-only)
  - themes: ["default", "low-stim", "reading"]
  - icon_style: "stroke" | "filled" (default: "stroke")
  - icon_dir: "/public/icons"
  - docs_outputs:
    - "/docs/DESIGN_SYSTEM.md"
    - "/docs/COLOR_SYSTEM.md"
    - "/docs/TYPOGRAPHY_GUIDE.md"
    - "/docs/ICONOGRAPHY_GUIDE.md"
    - "/docs/ASSET_PIPELINE.md"
    - "/docs/MOTION_AND_EFFECTS.md"
    - "/docs/ACCESSIBILITY.md"
    - "/docs/VISUAL_QA_CHECKLIST.md"
    - "/docs/VISUAL_DIFF_PLAN.md"
    - "/docs/DESIGN_DECISIONS.md"

- Constraints (security/safety/legal/originality/no deletions):
  - NO DELETIONS unless user explicitly approves.
  - Always runnable: keep app booting + /health passing at every step.
  - Token-driven only: no raw hex outside token files; no non-scale spacing/type in components.
  - Accessibility-first: visible focus, keyboard nav, reduced motion, contrast targets documented.
  - Neurodivergent-friendly: low-stim and reading modes are real (not cosmetic).
  - Performance: no heavy animation libraries by default; optimize images/fonts.

- Step Order (numbered, no gaps):
  1) Document the Visual Contract (before coding)
     1.1 Create/Update docs_outputs with concrete rules, not placeholders.
     1.2 Add a “Hard Bans” section: raw hex, non-scale spacing/type, mixed icon styles.
  2) Implement Tokens (Semantic-first)
     2.1 Define core palette tokens (rarely used) and semantic tokens (used everywhere):
         - bg, surface-1/2/3, text-1/2/3, border, ring
         - primary(+contrast), accent(+contrast)
         - success/warn/danger(+contrast)
         - shadow-1/2/3, radius-1/2/3, space-1..n
         - motion-fast/med/slow + easing
     2.2 Implement 3 modes as token sets:
         - default: warm modern baseline
         - low-stim: reduced saturation/effects/chrome
         - reading: constrained width + increased line-height + reduced distractions
     2.3 Ensure SSR-safe theme application strategy documented (no flash of wrong theme).
  3) Implement Typography Scale + Reading Surfaces
     3.1 Define explicit type scale and line-heights:
         - body line-height 1.55–1.75
         - headings 1.1–1.25
         - reading width target 60–75 characters
     3.2 Add reading layout pattern to blog/library/tool content.
  4) Build UI Primitives (Layout Rhythm)
     4.1 Implement primitives: Container, Section, Stack, Grid, Spacer.
     4.2 Enforce spacing tokens only.
  5) Build Component Library (Token-driven)
     5.1 Implement UI components with variants and states:
         - Button, Input/Textarea/Select, Card/Panel, Badge/Tag, Alert/Toast,
           Modal/Drawer, Tabs, Dropdown/Menu, Pagination, Skeleton, EmptyState,
           Avatar, Icon wrapper, Tooltip.
     5.2 Ensure each component covers:
         - default/hover/focus/active
         - loading/empty/error
         - disabled
         - low-stim + reduced-motion variants
  6) Create Component Gallery Route (Internal)
     6.1 Implement gallery_route listing all components + variants + modes toggles.
     6.2 Add “Accessibility quick checks” section on the page (focus visibility, keyboard navigation).
  7) Icon System Standardization
     7.1 Choose one style only (icon_style).
     7.2 Define grid (24x24), stroke width (if stroke), padding rules, naming conventions.
     7.3 Add required icons for nav + core actions to icon_dir.
     7.4 Update nav components to use the icon wrapper consistently.
  8) Images + Asset Pipeline (Performance + Consistency)
     8.1 Define accepted formats: photos WebP/AVIF; vectors SVG.
     8.2 Define consistent treatment rules: radii/shadows via tokens; aspect ratio specs.
     8.3 Document Canva workflow as asset pipeline (no API claims unless configured).
  9) Motion + Visual Effects (Approved set only)
     9.1 Tokenize transitions and easing.
     9.2 Implement reduced motion compliance (disable non-essential motion).
     9.3 Restrict to micro-interactions: subtle ring/border/elevation; no autoplay animation.
  10) Enforcement: RUN VISUAL DOCTOR (Hard Gate)
      10.1 Add script `visual:doctor` that:
           - FAILS if raw hex appears outside token files
           - FAILS if non-scale spacing/type found in component directories
           - FAILS if mixed icon styles detected
           - REPORTS largest images and offenders
      10.2 Output/Update:
           - /docs/VISUAL_DIFF_PLAN.md (page-by-page migration plan)
           - /docs/VISUAL_QA_CHECKLIST.md (manual checks)
           - /docs/ACCESSIBILITY.md (policy + checks)
  11) Migrate Pages in Strict Order (No big bang)
      11.1 Global chrome (header/nav/footer)
      11.2 Home + Auth pages
      11.3 Feed + Post composer + Post detail
      11.4 Library + Blog reading pages
      11.5 Admin dashboards
      11.6 After each page: run visual:doctor + smoke tests + /health.
  12) Verify + Log
      12.1 Run typecheck/lint/tests + visual:doctor + /health.
      12.2 Update CHANGELOG and DESIGN_DECISIONS if any new design choice was made.

- Deliverables (exact artifacts/files/commands):
  - Tokens:
    - /styles/tokens.css (or equivalent)
    - optionally /src/design/tokens.ts
  - Primitives:
    - /src/components/primitives/{Container,Section,Stack,Grid,Spacer}.tsx
  - UI Components:
    - /src/components/ui/* (listed above)
  - Gallery:
    - /app/_design/page.tsx
  - Icons:
    - /public/icons/* + /src/components/ui/Icon.tsx (wrapper)
  - Scripts:
    - /scripts/visual-doctor.(ts|js)
  - package.json:
    - "visual:doctor": "node scripts/visual-doctor.js" (or ts equivalent)
  - Docs:
    - all docs_outputs populated with real content and examples

- Acceptance Criteria (measurable):
  - visual:doctor exits 0 (no policy violations).
  - 3 modes (default/low-stim/reading) demonstrably change tokens and UI behavior.
  - Component gallery renders all components and variants without errors.
  - At least 10 key pages migrated to tokens/components/templates.
  - Focus visibility verified on key pages across modes; reduced motion honored.
  - App boots + /health passes.

- Rollback Plan (no deletions; how to revert safely):
  - Keep old styles behind a feature flag during migration; default to stable mode if regressions occur.
  - If tokens cause regressions, revert token values (not structure) first.
  - If a component migration breaks UI, revert that component usage page-by-page (git revert) and leave the new component in place for later fixes.

- Failure Modes checklist + how to detect:
  - Visual drift (raw hex / ad-hoc spacing) → visual:doctor fails.
  - Theme flash (FOUC) → observe on reload; fix SSR-safe theme strategy.
  - Accessibility regressions (invisible focus) → checklist fails; adjust ring tokens.
  - Too much motion → reduced-motion mode not respected; fix motion toggles.
  - Icon inconsistency → mixed sources; enforce icon wrapper usage.

- “If blocked” fallback (export-first / manual mode):
  - If enforcement is too strict initially, run visual:doctor in “report-only” mode for one iteration, then switch to hard-fail once baseline violations are resolved and documented in VISUAL_DIFF_PLAN.