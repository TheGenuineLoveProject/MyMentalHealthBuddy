# /docs/prompts/STYLE_OPTIMIZATION.md

- Name: STYLE OPTIMIZATION — Global Styling Cleanup + State Coverage + SSR Theme Strategy (Hard Gate)
- Objective (1 sentence):
  Eliminate styling drift and visual inconsistency by standardizing global styles, enforcing token/component usage, completing UI state coverage, and implementing SSR-safe theming without breaking runtime.

- Inputs (explicit fields):
  - repo_root: (default: ".")
  - styling_stack: "tailwind" | "css-vars" | "tailwind+css-vars" (default: "tailwind+css-vars")
  - token_files:
    - "/styles/tokens.css"
    - "/app/globals.css"
    - "/src/design/tokens.ts"          # optional
    - "/src/design/theme.ts"           # optional
  - globals_entrypoints:
    - "/app/layout.tsx"
    - "/app/globals.css"
  - component_dirs:
    - "/src/components"
    - "/components"
    - "/app"
  - ui_component_dir: "/src/components/ui"
  - primitives_dir: "/src/components/primitives"
  - pages_priority_order:
    - "Global chrome (Header/Nav/Footer)"
    - "Home"
    - "Auth (login/signup)"
    - "Feed"
    - "Post composer"
    - "Post detail"
    - "Library"
    - "Blog reading pages"
    - "Admin/Moderation dashboards"
  - required_modes: ["default", "low-stim", "reading"]
  - required_states:
    - "default"
    - "hover"
    - "focus"
    - "active"
    - "disabled"
    - "loading"
    - "empty"
    - "error"
    - "success"
  - inline_styles_policy: "ban" | "allowlist" (default: "ban")
  - inline_styles_allowlist: [] # exact file paths only if needed
  - raw_color_policy: "ban" (default: "ban")
  - raw_color_allowlist_files: [] # token files only
  - enforcement_outputs:
    - "/docs/STYLE_POLICY.md"
    - "/docs/STYLE_AUDIT_REPORT.md"
    - "/docs/STYLE_MIGRATION_PLAN.md"
  - scripts:
    - style_doctor_script: "/scripts/style-doctor.(ts|js)"
    - package_script_name: "style:doctor"
  - ssr_theme_strategy:
    - "cookie+class"
    - "server-pref+cookie"
    - "client-only-with-no-flash-guard"  # only if forced; document why

- Constraints (security/safety/legal/originality/no deletions):
  - NO DELETIONS unless user explicitly approves.
  - Always runnable: app must boot and /health must pass after every batch.
  - No duplicate styling systems: do not introduce a second CSS framework or component library.
  - Accessibility-first: never remove focus outlines; ensure visible focus in all modes.
  - Performance-first: avoid heavy styling/motion libraries unless justified and optional.
  - No deceptive “SSR-safe” claims; document the exact no-flash mechanism.

- Step Order (numbered, no gaps):
  1) Write the Style Contract (Docs First)
     1.1 Create/Update /docs/STYLE_POLICY.md:
         - token-only colors
         - typography scale rules
         - spacing scale rules
         - state coverage requirements
         - mode requirements (default/low-stim/reading)
         - “hard bans” + exception process
  2) Establish Global Styling Foundation
     2.1 Ensure global CSS imports and token files are loaded from layout.
     2.2 Ensure consistent base styles:
         - body background via semantic token
         - text color via semantic token
         - link styling and focus rings via tokens
         - selection colors (optional) via tokens
  3) Implement SSR Theme Strategy (No Flash)
     3.1 Choose ssr_theme_strategy and document it:
         - cookie key name (e.g., themeMode)
         - server reads cookie and sets html class/data-attr BEFORE paint
         - client hydrates without mismatch
     3.2 Implement:
         - a theme provider/hook that reads initial mode
         - a mode toggle UI that persists preference (cookie and/or DB preference)
     3.3 Validate:
         - no theme flash on hard reload
         - no hydration warnings
  4) Enforce No Inline Styles (or allowlist)
     4.1 If inline_styles_policy=ban:
         - remove/replace inline styles with tokens/classes/variants
     4.2 If allowlist:
         - ensure every allowlisted usage is justified and documented in STYLE_POLICY
  5) Complete UI State Coverage (Component-level)
     5.1 For each core UI component in ui_component_dir:
         - implement variants and required_states
         - ensure disabled and loading states are visually distinct and accessible
         - ensure error/success states use semantic tokens
     5.2 Ensure all components behave correctly in required_modes.
  6) Page Migration (High-impact first; no big bang)
     6.1 Migrate pages in pages_priority_order:
         - replace ad-hoc styling with primitives + UI components
         - ensure consistent spacing rhythm
         - ensure reading pages use reading constraints
     6.2 After each page batch:
         - run style:doctor + smoke + /health
  7) Build STYLE DOCTOR (Hard Gate)
     7.1 Implement /scripts/style-doctor.* that scans:
         - raw hex/rgb/hsl outside token files => FAIL
         - inline styles not allowlisted => FAIL
         - non-scale font sizes/spacing in components => FAIL
         - missing theme mode hooks/docs => FAIL (if required)
     7.2 Produce /docs/STYLE_AUDIT_REPORT.md:
         - summary counts
         - top offenders
         - file paths + recommended fixes
     7.3 Produce /docs/STYLE_MIGRATION_PLAN.md:
         - ordered migration waves + “definition of done” per wave
  8) Verify + Log
     8.1 Add package.json script:
         - "style:doctor": "node scripts/style-doctor.js"
     8.2 Run: typecheck/lint/tests + style:doctor + /health
     8.3 Update CHANGELOG with results and files touched

- Deliverables (exact artifacts/files/commands):
  - Code:
    - theme provider/hook (location consistent with repo conventions)
    - mode toggle component
    - updated global layout to apply theme class/data-attr SSR-safe
    - component updates for state coverage
  - Script:
    - /scripts/style-doctor.(ts|js)
  - package.json:
    - "style:doctor": "node scripts/style-doctor.js"
  - Docs:
    - /docs/STYLE_POLICY.md
    - /docs/STYLE_AUDIT_REPORT.md
    - /docs/STYLE_MIGRATION_PLAN.md

- Acceptance Criteria (measurable):
  - style:doctor exits 0 (hard gate).
  - 0 raw color usages outside token files.
  - 0 unauthorized inline style usages.
  - Core UI components implement required_states across required_modes.
  - No theme flash on hard reload; no hydration warnings.
  - App boots + /health passes.

- Rollback Plan (no deletions; revert safely):
  - Revert theme SSR changes first if hydration issues occur; fall back to simplest strategy and document.
  - Revert per-page migrations independently (git revert) while keeping new components for later.
  - Temporarily set style:doctor to report_only only if progress is blocked; document deadline to re-enable hard gate.

- Failure Modes + Detection:
  - Theme flash persists → manual reload reveals; fix server-applied class or cookie read.
  - Hydration mismatch → console warnings; ensure server and client agree on initial mode.
  - Over-strict scale rules block progress → report-only baseline iteration, then tighten.
  - Accessibility regressions (focus invisible) → Visual QA checklist fails; adjust ring tokens.

- Fallback Mode (export-first/manual):
  - If SSR theming is blocked, implement client-only theme with a no-flash guard:
    - minimal inline script in <head> to set html mode before React mounts
    - document as temporary with a deadline