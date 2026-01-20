# /docs/prompts/ICON_REFINEMENT.md

- Name: ICON REFINEMENT — Icon Grid Rules + SVG Validation + Favicon/OG Checklist
- Objective (1 sentence):
  Standardize and upgrade the platform’s iconography system (grid, stroke/fill rules, naming, accessibility) and ensure consistent favicon/app icons/OG images across the platform with automated validation.

- Inputs (explicit fields):
  - repo_root: (default: ".")
  - icon_style_mode: "stroke" | "filled" (default: "stroke")
  - icon_grid_px: 24
  - icon_dir: "/public/icons"
  - icon_wrapper_component: "/src/components/ui/Icon.tsx"
  - required_icon_set:
    - "home"
    - "feed"
    - "library"
    - "blog"
    - "community"
    - "create"
    - "search"
    - "settings"
    - "profile"
    - "moderation"
    - "admin"
    - "help"
    - "externalLink"
  - stroke_rules (if stroke):
    - allowed_stroke_widths: [1.5, 1.75, 2]
    - require_round_caps: true
    - require_round_joins: true
    - prefer_2px_padding: true
  - filled_rules (if filled):
    - consistent_corner_radius: true
    - consistent_optical_padding: true
  - naming_convention:
    - "kebab-case"   # e.g., external-link.svg
  - docs_outputs:
    - "/docs/ICONOGRAPHY_GUIDE.md"
    - "/docs/ASSET_PIPELINE.md"
    - "/docs/DESIGN_SYSTEM.md"
  - favicon_outputs:
    - "/public/favicon.ico"
    - "/public/favicon-16x16.png"
    - "/public/favicon-32x32.png"
    - "/public/apple-touch-icon.png"
    - "/public/android-chrome-192x192.png"
    - "/public/android-chrome-512x512.png"
  - og_image_outputs:
    - "/public/og-default.png"
    - "/public/og-blog.png"
    - "/public/og-library.png"
  - validation_script:
    - "/scripts/icon-doctor.(ts|js)"
  - package_script_name: "icon:doctor"

- Constraints (security/safety/legal/originality/no deletions):
  - NO DELETIONS unless user explicitly approves.
  - Use original icon assets or appropriately licensed assets; prefer custom SVGs.
  - No mixed icon styles.
  - Accessibility: icons must have labels (aria-label) when icon-only.
  - Performance: SVG optimized (no unnecessary metadata).

- Step Order (numbered, no gaps):
  1) Document Icon System Rules
     1.1 Update /docs/ICONOGRAPHY_GUIDE.md with:
         - style mode (stroke or filled)
         - grid size, padding rules, naming rules
         - do/don’t examples
         - accessibility rules (icon-only buttons require aria-label)
         - sourcing/licensing notes
  2) Implement/Refine Icon Wrapper Component
     2.1 Ensure icon_wrapper_component:
         - loads SVGs consistently
         - supports size variants
         - supports decorative vs informative icons
         - enforces aria-hidden when decorative
  3) Curate/Build Required Icon Set
     3.1 Ensure each required_icon_set exists in icon_dir.
     3.2 Enforce naming_convention.
     3.3 Remove mixed sources by refactoring usage to wrapper (no deletions; replace references).
  4) SVG Validation Rules
     4.1 Implement /scripts/icon-doctor.* to validate:
         - all icons are within icon_dir
         - filenames follow naming_convention
         - SVG viewBox matches icon_grid_px
         - if stroke mode:
           - stroke-width in allowed range (best-effort parse)
           - stroke-linecap and stroke-linejoin are round when required
         - no inline fill/stroke colors unless tokenized strategy documented
         - no embedded raster images
  5) Favicon/App Icon Generation Checklist
     5.1 Ensure a single source master mark exists (SVG preferred).
     5.2 Generate favicon_outputs per standard sizes.
     5.3 Verify app manifest references (if present).
     5.4 Ensure icons match the chosen style and brand tokens.
  6) OG Image System Checklist
     6.1 Define OG templates:
         - default site OG
         - blog OG
         - library OG
     6.2 Ensure OG images have:
         - correct dimensions (typically 1200x630)
         - high contrast text
         - consistent typography
         - safe margins
  7) Wire Metadata
     7.1 Ensure Next.js metadata uses OG images and icons correctly:
         - site-wide default
         - per-route overrides for blog/library if applicable
  8) Add Hard Gate Command
     8.1 Add package.json script:
         - "icon:doctor": "node scripts/icon-doctor.js"
     8.2 Run icon:doctor and fail if violations exist.
  9) Verify + Log
     9.1 Run: typecheck/lint/tests + icon:doctor + /health
     9.2 Update CHANGELOG and ICONOGRAPHY_GUIDE updates.

- Deliverables (exact artifacts/files/commands):
  - /public/icons/*.svg (required_icon_set)
  - /src/components/ui/Icon.tsx
  - /scripts/icon-doctor.(ts|js)
  - package.json:
    - "icon:doctor": "node scripts/icon-doctor.js"
  - Favicons/app icons in /public (favicon_outputs)
  - OG images (og_image_outputs)
  - Docs updated:
    - /docs/ICONOGRAPHY_GUIDE.md
    - /docs/ASSET_PIPELINE.md
    - /docs/DESIGN_SYSTEM.md

- Acceptance Criteria (measurable):
  - icon:doctor exits 0.
  - 100% of icon usages go through icon wrapper (no mixed icon libraries for core UI).
  - Required icon set exists and matches style rules.
  - Favicons render correctly in browser tab; apple-touch and android icons present.
  - OG images render correctly and are referenced in metadata.
  - App boots + /health passes.

- Rollback Plan (no deletions; revert safely):
  - Revert icon usage refactors page-by-page if regressions occur.
  - Keep new icons in place; revert wrapper changes if they break rendering.
  - If icon-doctor is too strict initially, run in report-only for one iteration, then re-enable hard gate.

- Failure Modes + Detection:
  - SVG parse fails on some icons → mark as “unparseable” and enforce wrapper/source while adding parser support.
  - Mixed icon libraries persist → grep usage; refactor to wrapper.
  - OG images referenced incorrectly → validate metadata and file paths.

- Fallback Mode (export-first/manual):
  - If automated favicon/OG generation is blocked, use a manual checklist:
    - confirm each output exists, dimensions correct, referenced in metadata
    - document all steps in ASSET_PIPELINE