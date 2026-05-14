# HX-OS vNEXT ∞ — Current Platform Analysis Layer

**Path:** `prompt-os/current-platform-analysis-layer.md`
**Owners:** The Genuine Love Project + MyMentalHealthBuddy
**Status:** ACTIVE GOVERNANCE — must run before any platform changes
**Integrated:** 2026-05-15

---

## PURPOSE

Before building, fixing, redesigning, or optimizing — perform a current-state platform analysis across product, UX, content, engineering, deployment, AI, prompts, business, and governance.

> **HX-OS LAW:** Do not fix everything. Analyze everything. Fix only the first verified blocker.

---

## PRIME DIRECTIVE

Do not recommend broad changes until the current state is inspected, classified, and verified.

Identify what exists, what is missing, what is duplicated, what is broken, what is risky, and what should be fixed first.

---

## ANALYSIS DIMENSIONS (10 layers)

### 1. PLATFORM INVENTORY
Inspect and classify every folder and file:
- root files (`.replit`, `package.json`, `replit.nix`)
- `server/` (entrypoint, routes, middleware, lib)
- `client/` (src, components, pages, hooks, data)
- `db`, `drizzle`, `migrations`
- `shared/` types, `scripts/`, `tests/`
- `prompt-os/`, `prompts/`, `automation/`, `agents/`
- public assets, attached assets, backups
- quarantine / rescue folders

For each item classify: **exists / missing · active / inactive · duplicated / unique · working / broken / unknown · safe to modify / do not touch · dependency relationship**.

### 2. RUNTIME ANALYSIS
- active start command
- active server file and port binding
- host binding (must be `0.0.0.0`)
- health endpoints (`/health`, `/ready`, `/api/health`)
- route mounting and API prefixes
- frontend API calls matching backend routes
- server logs, crash points, async failures

**Required checks:** server uses `process.env.PORT || 5000`; listens on `0.0.0.0`; `.replit` matches `package.json`; only one canonical runtime entrypoint; routes do not hang.

### 3. ARCHITECTURE ANALYSIS
Classify by engine layer:

| Engine | Concern |
|---|---|
| DISCOVERY ENGINE | SEO, content, social |
| TRUST ENGINE | safety, privacy, crisis, consent |
| REFLECTION ENGINE | journaling, mood, CBT, prompts |
| CONTINUITY ENGINE | habits, streakGuard, weekly themes |
| COMMUNITY ENGINE | newsletter, sharing, engagement |
| PLATFORM CORE | routing, auth, storage, API |
| PROMPT-OS CORE | governance, analysis, verification |
| DESIGN SYSTEM | colors, typography, spacing, motion |
| BUSINESS ENGINE | pricing, subscriptions, analytics |

For each: current files · current functionality · missing components · duplicate systems · broken connections · smallest safe fix.

### 4. PRODUCT + UX ANALYSIS
Inspect homepage and user flows: brand hierarchy (GLP vs MMHB), homepage intent, first-screen value prop, navigation clarity, emotional safety, cognitive load, mobile usability, trust signals, CTA placement, onboarding, journaling path, mood path, subscription path, accessibility.

**Return:** strongest UX asset · biggest UX blocker · highest-impact fix · lowest-risk improvement.

### 5. CONTENT + SEO ANALYSIS
Inspect: blog structure, pillar pages, topic clusters, metadata, headings, internal links, sitemap, schema markup, search-intent coverage, newsletter capture, social repurposing.

Classify each content item: **DISCOVERY | EDUCATION | REFLECTION | ACTION | CONTINUITY | COMMUNITY | CONVERSION**.

### 6. AI + PROMPT SYSTEM ANALYSIS
Inspect: prompt files & registry, AI agents & routing, journaling/reflection prompts, safety boundaries, duplication, hallucination risk, clinical-risk language, business/healing contamination.

**Required rule:** AI must act as guided reflection infrastructure, not clinical authority.

### 7. BUSINESS / HEALING FIREWALL ANALYSIS
Check business logic inside: journaling, mood tracking, reflection, crisis-safe areas, AI support prompts, onboarding.

**Forbidden inside healing flows:** pricing pressure, emotional upsells, vulnerability targeting, hidden conversion logic, manipulative retention, scarcity pressure.

### 8. DESIGN SYSTEM ANALYSIS
Colors, typography, spacing, buttons, cards, shadows, radius, motion, icons, layout, contrast, mobile responsiveness.

**Direction:** calm, clear, warm, accessible, trust-preserving, low cognitive load, nervous-system-aware.

### 9. DEPLOYMENT + OBSERVABILITY ANALYSIS
Deployment scripts, build scripts, logs, health checks, readiness checks, error handling, monitoring, test commands, rollback path.

**Required gates:** `BUILD_GATE`, `ROUTE_GATE`, `SCHEMA_GATE`, `SAFETY_GATE`, `DOMAIN_SEPARATION_GATE`, `DEPLOYMENT_GATE`, `OBSERVABILITY_GATE`, `ROLLBACK_GATE`, `DUPLICATION_GATE`.

### 10. AVATAR + IDENTITY ANALYSIS
Canonical Lumi spec compliance, drift detection, image inventory, motion system, brand consistency.

---

## FINAL REPORT FORMAT (23 sections)

1. Hard Truth — what is actually happening
2. Current Platform Summary — one-paragraph state
3. Active Runtime Path — how the app starts and runs
4. Folder + File Inventory — what exists, what is missing
5. Existing Systems — what works
6. Missing Systems — gaps
7. Duplicate / Conflicting Systems — redundancy
8. Broken or High-Risk Areas — danger zones
9. Homepage + UX Findings — user experience gaps
10. SEO + Content Findings — discoverability issues
11. AI + Prompt Findings — prompt system state
12. Business/Healing Firewall Findings — contamination check
13. Deployment Findings — build and deploy status
14. Avatar + Identity Findings — drift analysis
15. First Highest-Impact Blocker — the one thing to fix first
16. Root Cause — why it is broken
17. Smallest Safe Fix — minimal patch
18. Exact Files to Modify — specific paths
19. Exact Commands to Run — build, verify, deploy
20. Verification Gates — how to confirm the fix
21. Failure Conditions — when to rollback
22. Rollback Plan — how to undo
23. Next Safe Step — what to do after this fix is green

---

## DIAGNOSTIC COMMANDS

See `docs/diagnostics/` for outputs. Refresh with:

```bash
mkdir -p docs/diagnostics

find . -maxdepth 3 \
  -not -path "./node_modules/*" -not -path "./.git/*" \
  -not -path "./dist/*" -not -path "./build/*" \
  | sort > docs/diagnostics/platform-tree.txt

cat .replit       > docs/diagnostics/replit.txt        2>/dev/null || true
cat package.json  > docs/diagnostics/package.json.txt  2>/dev/null || true
cat replit.nix    > docs/diagnostics/replit-nix.txt    2>/dev/null || true

find . -type f \( -name "*.js" -o -name "*.mjs" -o -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" -not -path "./dist/*" -not -path "./build/*" \
  | sort > docs/diagnostics/code-files.txt

grep -R "app.listen\|server.listen\|process.env.PORT\|0.0.0.0\|localhost\|127.0.0.1" . \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build \
  > docs/diagnostics/runtime-scan.txt || true

grep -R "/api/\|fetch(\|axios" client src pages components apps \
  > docs/diagnostics/frontend-api-scan.txt 2>/dev/null || true

grep -R "health\|ready\|journal\|mood\|reflection\|subscription\|stripe\|pricing" . \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build \
  > docs/diagnostics/domain-scan.txt || true
```

---

## INTEGRATION WITH HX-OS

This layer sits between **HX-OS LAW 1 (Stability)** and **LAW 2 (One Kernel)**.

**Execution flow:**
1. HX-OS LAW 1: Assess stability → is the system stable enough to modify?
2. **THIS LAYER: Run platform analysis → what is the current state?**
3. HX-OS LAW 2: Identify first blocker → fix only that
4. Verification gate → green? proceed. red? rollback.
5. Return to step 2 for next iteration.

This layer prevents: blind fixes, scope creep, drift, over-engineering, fix-everything syndrome.
This layer ensures: every change is grounded in verified current state.

---

## FINAL RULE

> Do not fix everything.
> Analyze everything.
> Fix only the first verified blocker.
