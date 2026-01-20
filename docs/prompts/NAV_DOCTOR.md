# /docs/prompts/NAV_DOCTOR.md

- Name: NAV DOCTOR — Route Map + Navigation Link Audit (Hard Gate)
- Objective (1 sentence):
  Guarantee navigation integrity A→Z by generating a canonical route map, auditing all internal links, fixing broken routes/links, and failing the build if any broken internal link remains.

- Inputs (explicit fields):
  - repo_root: (default: ".")
  - next_app_dir: (default: "app")  # Next.js App Router
  - allowed_internal_prefixes: ["/"]  # internal hrefs start with /
  - ignore_href_prefixes: ["#", "mailto:", "tel:", "http://", "https://"]  # not internal
  - link_sources_globs:
    - "app/**/*.{ts,tsx,js,jsx,mdx}"
    - "components/**/*.{ts,tsx,js,jsx,mdx}"
    - "src/**/*.{ts,tsx,js,jsx,mdx}"
  - nav_config_sources_globs:
    - "app/**/*.{ts,tsx,js,jsx}"
    - "components/**/*.{ts,tsx,js,jsx}"
    - "src/**/*.{ts,tsx,js,jsx}"
  - role_tags: ["public", "authed", "admin", "moderator"]  # annotation only
  - output_docs:
    - "/docs/ROUTE_MAP.md"
    - "/docs/NAVIGATION_MAP.md"
    - "/docs/NAV_LINK_AUDIT.md"
    - "/docs/NAVIGATION_QA_CHECKLIST.md"

- Constraints (security/safety/legal/originality/no deletions):
  - NO DELETIONS unless user explicitly approves.
  - Always runnable: app must boot + /health must pass after changes.
  - No duplicate navigation systems: extend/refactor existing nav data.
  - No false claims: only report what is verified in repo.
  - External links must use rel="noopener noreferrer" when target="_blank".
  - Internal links must use Next.js `<Link>` (unless unavoidable; document exceptions).

- Step Order (numbered, no gaps):
  1) Create/Update Docs Skeletons
     1.1 Ensure output_docs exist with headers and acceptance criteria sections.
  2) Generate Route Map (App Router)
     2.1 Traverse `next_app_dir` for `**/page.(ts|tsx|js|jsx|mdx)`.
     2.2 Convert filesystem paths → route paths:
         - `app/page.tsx` → `/`
         - `app/about/page.tsx` → `/about`
         - `app/blog/[slug]/page.tsx` → `/blog/[slug]`
         - `(...)/layout.*` ignored
         - `(...)/route.*` treated as API, not navigation route (list separately)
     2.3 Output `/docs/ROUTE_MAP.md`:
         - Table: Route | File | Type (page/api) | Notes (dynamic, segment groups)
         - Include counts: total pages, total api routes, dynamic routes.
  3) Discover Navigation Targets (Canonical Nav Map)
     3.1 Locate candidate nav sources:
         - files containing keywords: "NAV", "navigation", "menu", "footerLinks", "headerLinks", "routes"
         - common components: Header, Navbar, Footer, Sidebar.
     3.2 Extract all internal href strings:
         - `<Link href="...">`, `href: "..."`, `to: "..."`, `router.push("...")`
     3.3 Build `/docs/NAVIGATION_MAP.md`:
         - Primary nav + destinations
         - Footer nav + destinations
         - Role-based nav (public/authed/admin/mod) if present
         - If nav is generated dynamically: document where and how.
  4) Audit All Internal Links (Repo-wide)
     4.1 Scan `link_sources_globs` for internal hrefs and router navigations:
         - `<Link href=...>`
         - `router.push(...)`, `router.replace(...)`
         - `href="..."`
     4.2 Normalize hrefs:
         - strip query `?` and hash `#...`
         - ensure leading `/`
     4.3 Resolve each href against route map:
         - Exact match for static routes.
         - Dynamic match allowed when href contains bracket segments (e.g., `/blog/[slug]`) OR when href is a template with params; otherwise mark as “requires runtime param” and verify pattern exists.
     4.4 Produce `/docs/NAV_LINK_AUDIT.md`:
         - Summary counts: total internal links found, valid, invalid, dynamic, ignored.
         - Broken links list: href | file | line (if detectable) | suggested fix.
  5) Fix Navigation Links A→Z (No deletions)
     5.1 For each broken link:
         - Prefer fixing href to existing route.
         - If route truly missing: add route only if it’s clearly required by IA; otherwise update nav to correct destination.
         - If destination is planned: keep link behind feature flag and label “Coming soon” (non-clickable) + document.
     5.2 Ensure internal navigation uses `<Link>` and correct `aria-current`.
     5.3 Add/Update a calm 404 confirmation:
         - Ensure `app/not-found.tsx` exists (or equivalent) with key destinations.
  6) Create Manual Navigation QA Checklist
     6.1 `/docs/NAVIGATION_QA_CHECKLIST.md` includes click-through flows:
         - Public: Home → About/Library/Blog → Sign up/login → Back
         - Authed: Feed → Post → Profile → Settings → Log out
         - Admin/Mod: Dashboard → Reports → Action → Audit log
  7) Add Hard Gate Command
     7.1 Add script entry (package.json) `nav:doctor` that runs the audit and exits non-zero if broken internal links exist.
  8) Verify
     8.1 Run: typecheck/lint/tests + nav:doctor + /health.
     8.2 Update CHANGELOG with results.

- Deliverables (exact artifacts/files/commands):
  - Docs:
    - /docs/ROUTE_MAP.md
    - /docs/NAVIGATION_MAP.md
    - /docs/NAV_LINK_AUDIT.md
    - /docs/NAVIGATION_QA_CHECKLIST.md
  - Script:
    - /scripts/nav-doctor.(ts|js) OR /tools/nav-doctor.(ts|js)
  - package.json:
    - "nav:doctor": "node scripts/nav-doctor.js" (or ts-node equivalent)
  - Optional:
    - app/not-found.tsx (if missing)
    - small refactors in nav components to use `<Link>` correctly

- Acceptance Criteria (measurable):
  - nav:doctor exits 0 (no broken internal links).
  - /docs/ROUTE_MAP.md lists all page routes with correct paths.
  - /docs/NAV_LINK_AUDIT.md contains “Broken internal links: 0”.
  - Primary nav + footer links in /docs/NAVIGATION_MAP.md all resolve to routes.
  - app boots + /health passes.

- Rollback Plan (no deletions; how to revert safely):
  - Revert nav link changes by restoring prior href values (git revert).
  - Keep any newly added routes behind feature flags (default OFF) rather than removing.
  - If nav:doctor blocks release due to edge-case false positives, add an allowlist in the script and document it in /docs/NAV_LINK_AUDIT.md.

- Failure Modes checklist + how to detect:
  - False positives from dynamic routes → audit shows “invalid” where route exists; update resolver to match patterns.
  - Routes in grouped segments `(group)` mis-resolved → route map mismatch; fix parser.
  - Links constructed at runtime not detected → manual QA catches; add patterns to scanner.
  - Mixed `<a>` internal links causing full reload → grep for `<a href="/...">` and refactor to `<Link>`.

- “If blocked” fallback (export-first / manual mode):
  - If automated audit can’t reliably parse some link patterns, require those links to be listed in /docs/NAVIGATION_MAP.md explicitly and manually verified via QA checklist until parser supports them.