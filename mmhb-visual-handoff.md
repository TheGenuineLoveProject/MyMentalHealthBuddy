# MyMentalHealthBuddy visual consistency work

The next repair covers the selected botanical colors, typography, and shared visuals across MyMentalHealthBuddy. The current deliverable is a source collector; the site-wide styling patch has not been applied.

## Current evidence

| Area | Evidence available | Limit |
|---|---|---|
| Botanical palette | User's Replit output reports a successful preview update and 38 UI fixture cases | This covered two CSS files, not all pages |
| Gratitude save repair | User's screenshot reports a successful preview update and 48 UI fixture cases; repeat execution reported the repair already present | Browser-local gratitude storage is separate from account journal persistence |
| Anonymous API access | User's screenshot shows 401 JSON from `/api/journal` and `/api/auth/user` | Does not establish valid-session logout, account separation, or persistence |
| All-page styling | Source inspection finds multiple global and scoped theme systems, hardcoded colors, and different font stacks | Current Replit source snapshot and rendered route checks are still needed |
| Production | Repair output explicitly says public deployment was not run | Current preview changes have not been verified on the public domain |

These are distinct checks. Forty-eight UI fixture cases do not mean forty-eight pages were verified.

## Selected visual direction

| Role | Color |
|---|---|
| Light background | `#FAF8F2` |
| Light cards | `#FFFDF8` |
| Primary buttons and links | `#3F6249` |
| Main text and headings | `#293329` |
| Soft panels | `#EAF0E6` |
| Decorative green | `#78977B` |
| Small peach accents | `#F2D8CB` |
| Dark background | `#20271F` |
| Dark cards | `#2B3428` |
| Dark text | `#EAF0E6` |
| Dark headings | `#FAF8F2` |
| Dark actions | `#BCD3BE` |
| Text on dark-mode action buttons | `#293329` |

Use Inter for body copy and controls and Playfair Display for headings, with local fallbacks. Keep accessibility font preferences effective. Use the existing Lumi artwork. Decorative pastels are not substitutes for readable text or visible control boundaries.

Normal text should meet at least 4.5:1 contrast; large text has a 3:1 minimum under WCAG 2.2 SC 1.4.3. Evaluate the actual rendered foreground and background, including gradients and hover/focus states. This is a design criterion, not a claim of full WCAG conformance.

Reference: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

## Why a fresh source snapshot is needed

The last verified source for `client/src/index.css` has 8,809 lines. It imports many theme files and also contains later color, font, and component overrides. The inspected repository has additional overrides in `brand.css`, `brand-tokens.css`, `tokens.css`, `hxos-vnext.css`, and `SEOContentDiscoveryRail.css`. Several repository files differ from the tested Replit versions.

A root color replacement alone cannot establish that each page uses the chosen colors. The current sources will establish the import order, inline styles, remaining Tailwind color utilities, scoped tokens, accessibility modes, and route inventory. Names of CSS variables must retain the formats their consumers expect: raw colors, RGB components, and HSL components are not interchangeable.

## Run the collector

1. Upload `mmhb-theme-audit.sh` to the top level of the existing Replit workspace for MyMentalHealthBuddy.
2. Run the checksum and shell command provided in the accompanying chat response.
3. Attach the generated `mmhb-theme-audit-<identifier>.json` file to the conversation.

The script reads styling source, copies CSS and selected UI owner files, and inventories literal visual tokens and route candidates in other frontend modules. It writes one new JSON report. It does not execute application modules, install dependencies, build, change source, request APIs, or deploy. Its source list excludes environment files, server data, uploads, and test fixtures. Source files matching possible embedded credential patterns are withheld and identified by filename. The report contains private application source and is intended for this project conversation.

`SOURCE_AUDIT_READY_WITH_NOTICES` means a report was produced with explicit exclusions to review. Route candidates are statically discovered strings; they have not been visited or qualified. The recorded preview index hash is a disk hash, not a fresh HTTP verification.

## Implementation and acceptance after source inspection

1. Establish one semantic botanical palette with separate light/dark values and a consistent font stack. Update existing owners and their aliases rather than accumulating unrestricted overrides.
2. Correct shared navigation, page shells, library rail, gratitude widget, and floating controls. Handle individual page exceptions from the inventory. Preserve meaningful success, warning, error, crisis, and chart distinctions.
3. Use the existing guarded build, backup, preview qualification, and rollback workflow against the new source baseline. Keep current auth and storage repairs intact.
4. Verify the route inventory and explicitly report visited, redirected, unavailable, authenticated, and unverified routes. Test mobile and desktop, light and dark, selected accessibility modes, keyboard focus, reduced motion, and visible text/control contrast. Use synthetic fixture data for stateful UI.
5. Report actual source changes and rendered results before calling the visual work complete. Follow with real test-account sign-out and journal persistence verification, then deployment verification.

Planning allowance: 8–16 engineering hours for shared-theme consolidation and representative route qualification after receipt of current sources. This is a conditional estimate, not a measured remaining duration. The route count and number of exceptions may increase it. Total platform completion cannot be estimated reliably from these UI reports alone.

## Prompt for the next implementation pass

> Continue MyMentalHealthBuddy only. Inspect the attached MMHB_THEME_SOURCE_AUDIT_V1 report and its notices. Use its exact source hashes and the selected botanical palette. Trace stylesheet import order, scoped variables, inline styles, and font ownership before changing code. Preserve authentication, gratitude error handling, journal data, crisis semantics, and accessibility preferences. Prepare a bounded source patch with backup and rollback using the existing preview runner. Extend qualification to affected routes and shared components. Do not weaken a test to accept a regression or replace a baseline hash without inspecting its source. Report which routes and states were actually checked and which remain unverified. Use shell tools and installed dependencies first; use Replit AI only if a specific blocker requires it.
