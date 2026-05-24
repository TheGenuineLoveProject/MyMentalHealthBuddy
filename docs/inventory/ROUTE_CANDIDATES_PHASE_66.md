ROUTE CANDIDATE INVENTORY — Phase 66
====================================

Generated: 2026-05-24 02:16 UTC
Mode: documentation/inventory only. No source modification. No route deletion.
Companion: docs/reports/PHASE_66_ROUTE_CONSOLIDATION_CANDIDATES.md
Predecessors:
  - docs/inventory/route-inventory.md       (2026-04-28, 141 files / 895 endpoints — canonical)
  - docs/inventory/ROUTE_SCAN.txt           (2026-05-23, 1869-line grep dump; note: scans
                                             .local/snapshots/ stale copies in addition to
                                             live source — see anomaly §6)
Live runtime confirmation (api/health):
  routes        = 127  (Express handlers mounted on app)
  adminPages    = 27   (frontend admin pages)


==========================================================================
1. INPUT SUMMARY (live counts at probe time)
==========================================================================

  Backend (server/routes/*.mjs):
    Files in directory:                  143
    Excluding .bak files:                141
    Total route-method declarations:     929
      GET:        707  (76.1%)
      POST:       180  (19.4%)
      DELETE:      22  (2.4%)
      PATCH:       11  (1.2%)
      PUT:          9  (1.0%)
    Live mounted route count:            127  (per api/health.platform.totalRoutes)

  Frontend (client/src/App.jsx):
    <Route path="…"> declarations:       ~200  (in App.jsx router block)
    All `path=` occurrences (incl. Link/nav): 1033 (informational)
    Pages on disk (client/src/pages/):    186 files


==========================================================================
2. CANDIDATE CATEGORY A — BACKUP / SUPERSEDED ROUTE FILES
==========================================================================

These are .bak-suffixed files left in the routes directory. They are not
imported by app.mjs but live in the tracked tree. Safe consolidation
candidate: move out of git, preserve on disk (Phase 59 pattern).

  server/routes/billing.mjs.bak       — superseded billing module backup
  server/routes/billing.mjs.p29d.bak  — Phase 29-day billing backup

Live billing route file:  server/routes/billing.mjs  (~live)
Disposition: candidate for off-repo archive in a future phase. No deletion
in this phase. No runtime impact (files never imported).


==========================================================================
3. CANDIDATE CATEGORY B — FRONTEND ALIAS ROUTES (intentional UX, document)
==========================================================================

Multiple URL paths that resolve to the same React component. These are
INTENTIONAL UX (common URL guessing patterns) and should NOT be deleted
without product review. Documenting them so future consolidation work
treats them as one "logical surface".

  Register (4 aliases → same component):
    /register              → Register
    /signup                → Register
    /sign-up               → Register
    /create-account        → Register

  Login (3-4 aliases → same component):
    /login                 → Login
    /signin                → Login
    /sign-in               → Login

  AdminLogin (2 aliases):
    /admin-login           → AdminLogin
    /admin/login           → AdminLogin

  LearnGuides (4 aliases — needs product check whether 4 aliases is right):
    (paths registered via component={LearnGuides})

  LearnHub (3 aliases):
    (paths registered via component={LearnHub})

  LearnArticles (2 aliases):
    (paths registered via component={LearnArticles})

Disposition: KEEP all alias paths. Annotate canonicality in a future
Phase: pick one "canonical" path per component, mark others as redirects
or document as alias-on-purpose. No action this phase.


==========================================================================
4. CANDIDATE CATEGORY C — INTENTIONALLY-NOT-MOUNTED ROUTE FILES
==========================================================================

From the April canonical inventory (route-inventory.md Finding 2):
  "13 router files in server/routes/ are NEVER mounted"

The file count has since grown to 143 (incl 2 .bak) — the orphan list
should be re-verified in a future phase. Files flagged by marker scan
(NOT MOUNTED / DEPRECATED / disabled / legacy / TODO remove) include:

  server/routes/account.mjs            (markers present — likely
                                        legacy/comment, not orphan; live
                                        accountActions.mjs handles modern)
  server/routes/accountActions.mjs     (live)
  server/routes/mfa.mjs                (marker — needs verification)
  server/routes/health.mjs             (likely live — health subsystem)
  server/routes/meaning-future.mjs     (marker — needs verification)
  server/routes/admin.mjs              (live — mounted)
  server/routes/purpose-compass.mjs    (marker — needs verification)
  server/routes/biometrics.mjs         (live — mounted)
  server/routes/protocols.mjs          (marker — needs verification)
  server/routes/personal-growth.mjs    (marker — needs verification)
  server/routes/awareness.mjs          (marker — needs verification)
  (plus others — full audit in a future phase)

Disposition: do NOT remove without per-file verification against
the live ADMIN_SUB_ROUTERS / EXTENDED_ROUTES arrays in app.mjs. Many
"markers" are inline TODO/legacy comments, not actual orphans.


==========================================================================
5. CANDIDATE CATEGORY D — DUAL ENTRYPOINT HAZARD (carryover)
==========================================================================

From April canonical inventory (Finding 1):
  "server/index.mjs is a parallel/legacy entrypoint (745 lines)"
  "The production entrypoint per .replit is server/app.mjs."

This is NOT a route consolidation per se but every route surface in
server/index.mjs is a candidate for deletion or re-pointing to
server/app.mjs's mount table. Touching it requires explicit sign-off
because of the dual-entry risk.

Live entrypoint (per .replit): server/app.mjs   (kernel-locked)
Legacy entrypoint:              server/index.mjs (745 lines, not booted)


==========================================================================
6. CANDIDATE CATEGORY E — /api/auth MULTI-SOURCE MOUNT (document, don't change)
==========================================================================

From April canonical inventory (Finding 4):
  "/api/auth is mounted by THREE sources (intentional, but should be
   documented)"

  1. authRoutes (./routes/auth.mjs)
       → /register, /login, /me, /refresh, /logout
  2. githubAuthRoutes (./routes/github-auth.mjs)
       → /github, /github/callback
  3. registerAuthRoutes(app) (./replit_integrations/auth/index.mjs)
       → GET /user (consumed by AuthContext.jsx cold-reload hydration)

Disposition: KEEP three-source mount; add an inline contract comment
in app.mjs in a future phase. Do NOT consolidate without an auth
sign-off — three sources means three change-control surfaces.


==========================================================================
7. CANDIDATE CATEGORY F — LARGE ROUTE FILES (split candidates)
==========================================================================

Largest route files by byte size (consolidation = split, not merge):

  Bytes   File
  -----   ----------------------------------------------
  39726   server/routes/admin.mjs                     — admin god-router
  37425   server/routes/admin-social-studio.mjs       — admin subset
  35382   server/routes/health.mjs                    — health/observability
  30222   server/routes/sop.mjs                       — standard ops
  25238   server/routes/social-enterprise.mjs         — enterprise routes
  24124   server/routes/blog.mjs                      — blog CMS surface
  22315   server/routes/dialectics.mjs                — therapeutic content
  20808   server/routes/wisdom.mjs                    — therapeutic content
  20701   server/routes/account.mjs                   — account surface
  19980   server/routes/consciousness.mjs             — therapeutic content
  19723   server/routes/cognitive-mastery.mjs         — therapeutic content
  17754   server/routes/trauma-healing-protocols.mjs  — therapeutic content
  17684   server/routes/biometrics.mjs                — PHI-adjacent
  17384   server/routes/user.mjs                      — user surface

Disposition: candidates for Strangler-Fig decomposition. Specifically:
  - admin.mjs (39 KB)  → split by admin sub-surface
  - health.mjs (35 KB) → maybe extract /metrics, /readyz adjuncts
  - therapeutic content files (dialectics, wisdom, consciousness,
    cognitive-mastery, trauma-healing-protocols) share a content
    shape → potential common-router extraction

No action this phase.


==========================================================================
8. ANOMALY — ROUTE_SCAN.txt scans stale snapshot data
==========================================================================

docs/inventory/ROUTE_SCAN.txt (198 KB, 1869 lines) was generated by a
recursive scan that descended into .local/snapshots/phase49-*/runtime/
copies of server/app.mjs and server/routes/*. Those are stale snapshots
of the live source, gitignored, and not part of runtime.

Effect: the file double- and triple-counts every route declaration that
exists in both live source and snapshot copies. Consumers of
ROUTE_SCAN.txt should de-duplicate by extracting only "server/" prefixed
lines, not ".local/snapshots/...".

Disposition: regenerate ROUTE_SCAN.txt in a future phase with a path
filter excluding .local/. No change to the file this phase.


==========================================================================
9. CANDIDATES SUMMARY TABLE
==========================================================================

  Category  Description                       Count   Action this phase
  --------  --------------------------------  -----   -----------------
  A         .bak superseded route files          2   document; no edit
  B         Frontend alias paths              ≥14   document; no edit
  C         Orphan/legacy-marker route files  ~11   document; no edit
  D         Dual entrypoint hazard               1   document; no edit
  E         /api/auth multi-source mount         1   document; no edit
  F         Large route files (split)         14+   document; no edit


==========================================================================
END OF ROUTE CANDIDATE INVENTORY
==========================================================================
