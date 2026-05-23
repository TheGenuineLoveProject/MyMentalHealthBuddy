# MMHB Domain Separation Audit

**Baseline:** 2026-05-23 (Phase 55)
**Mode:** descriptive audit — no fixes
**Authority:** MMHB v7.4 Governance Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Primary Law:** "Business logic never appears in healing flows; healing responses never contain pricing, conversion, or platform debugging."

---

## 1. Domain definitions (per kernel)

| Domain | What lives there |
|---|---|
| **HEALING** | Therapeutic content, AI chat, journals, mood tracking, crisis routing |
| **BUSINESS** | Subscriptions, pricing, marketing, analytics, conversion dashboards |
| **PLATFORM** | Code, infrastructure, observability, DevOps, admin tooling |

The kernel requires every request and every code surface to be classifiable into exactly one of these three. Cross-contamination is a **critical failure**.

## 2. Audit method

For each domain, the audit identified:
1. The canonical surfaces (pages + components + routes that belong to the domain)
2. Operational enforcement (governance rule files, runtime gates)
3. Contamination — language or behavior from a different domain appearing in this one

## 3. HEALING surfaces — contamination scan

### 3.1 Surfaces audited

`/mood`, `/journal`, `/chat` (and its triplet), `/crisis`, `/today`, `/dashboard`-class wellness pages, all `lumi-*` modules, `checkin-flow/**`, `companion-voice/**`.

### 3.2 Findings

| Severity | Finding | Location |
|---|---|---|
| ✅ CLEAN | No pricing strings (`$`, `USD`, "subscribe", "upgrade", "premium") found in canonical healing flow text | grep across `client/src/pages/{mood,journal,today,dashboard}`, `client/src/lumi-*/` |
| ✅ CLEAN | Defensive blocks present in `client/src/governance/interactions/HealingFlowProtectionRules.ts:26` (`vulnerability_pricing`) and `client/src/lumi-rituals/governance/ritualSafetyRules.ts:71` (explicit forbid: "subscribe", "upgrade") | governance layer actively enforces |
| MED | `client/src/pages/dashboard/Insights.tsx:180` uses `btn-secondary-premium` CSS class on an "Achievements" panel | borderline cross-domain CSS class naming; not user-visible string |
| MED | `client/src/checkin-flow/components/FlowStepCheckout.tsx` uses **"Checkout"** terminology for a non-payment breathing/mood check step | naming collision — "Checkout" connotes commerce; vulnerable user may misread; renaming is a planned-phase concern |
| LOW | `JSON.stringify` in `server/replit_integrations/chat/routes.ts:110` returns error details to client | if a healing UI surfaces raw JSON, that's platform-debug contamination — depends on UI's error handling; observational |

### 3.3 Verdict

**Healing surfaces are predominantly clean.** The two MED-severity items (CSS class + step naming) are user-experience continuity concerns that should be addressed in a dedicated naming-hygiene phase.

## 4. BUSINESS surfaces — contamination scan

### 4.1 Surfaces audited

`/pricing`, `/pricing-page`, `/checkout`-class pages, `/account/billing`, marketing landing variants, `server/routes/billing.mjs`, `server/routes/adminBilling.mjs`, `server/billing/**`.

### 4.2 Findings

| Severity | Finding | Location |
|---|---|---|
| ✅ CLEAN | Clinical disclaimer language ("not medical advice", "no diagnosis or treatment") present in `src/lib/safety.ts:11` and `client/src/policy/platformPolicy.ts:17` | disclaiming, not claiming |
| **HIGH (structural)** | `server/routes/billing.mjs:19-22` lists `"crisis_support"` and `"healing_journeys"` as features of Starter/Pro plans | **the kernel forbids upselling DURING a healing flow; using healing capabilities as conversion drivers in plan-feature lists is a structural boundary risk.** The user may experience "crisis support" being implicitly gated by tier. |
| MED | Multiple landing-page variants exist (marketing tests) | each one must independently maintain tone separation; no systematic enforcement observed |

### 4.3 Verdict

The `billing.mjs` plan-feature list is the **single most significant finding of this entire audit**. It does not violate the runtime Primary Law (no pricing in healing flow), but it does cross the **conceptual boundary** by monetizing the crisis/healing capability. A future planned phase should either:

(a) Rename the plan-feature entries to neutral descriptors (e.g., "guided check-ins", "extended sessions") that do not imply gating of crisis support, **or**
(b) Document explicitly that crisis support is **never** gated and the plan-feature label is descriptive of context, not capability.

Either resolution must be a deliberate, sign-off phase. No edit in this audit.

## 5. PLATFORM surfaces — contamination scan

### 5.1 Surfaces audited

`pages/admin/**`, `server/routes/admin.mjs`, observability middleware, error pages, `/metrics`, `/api/health`.

### 5.2 Findings

| Severity | Finding | Location |
|---|---|---|
| ✅ CLEAN | Admin pages guarded by `<AdminGuard>` in `App.jsx` | no user-facing leak |
| ✅ CLEAN | `/api/health` does not surface user data; only environment + service health | per Phase 49 snapshot |
| ✅ CLEAN | Crisis literals (988, 741741) are static in `client/src/lumi-crisis/resources/crisisResources.ts` — not gated, not personalized, not behind any platform flag | static availability |
| LOW | `bundle-report.html` is in the repo root (1.4 MB) — vite-bundle-analyzer artifact | dev artifact; doesn't ship; observational |

### 5.3 Verdict

Platform surfaces are clean and well-isolated.

## 6. Crisis routing presence (cross-domain rule)

The kernel mandates **every wellness surface** to surface `/crisis` routing.

### 6.1 Verified presence

| Surface | Link / mechanism | Source |
|---|---|---|
| Global footer | `<Link to="/crisis">` | `client/src/components/layout/Footer.tsx:78` |
| Wisdom practices page | `<Link to="/crisis">` | `client/src/pages/WisdomPracticesPage.tsx:231` |
| Check-in flow | `<Link to="/crisis">` | `client/src/checkin-flow/components/FlowStepCheckout.tsx:133` |
| AI companion (Lumi) | instructed by system prompt | `client/src/lumi-agent/prompts/lumiSystemPrompt.ts:29` |
| `/crisis` page itself | self-referential + 988 + 741741 + 911 literals | `client/src/pages/CrisisResources.jsx` lines 12, 19, 22, 31, 138 |

### 6.2 Footer dependency risk (cross-reference duplication scan §2.2)

There are **5 footer components** in the codebase. Only `client/src/components/layout/Footer.tsx` is confirmed to carry the `/crisis` link. Pages that mount a different footer (SacredFooter, GlowFooter, ReflectionFooter, the legacy Footer.jsx, etc.) may **not** surface the `/crisis` CTA in their visible footer.

**The `/crisis` route still resolves** (it's a top-level route; F-33.6 5/5 live in production); only the **visible footer CTA** depends on which footer renders. This means users on those pages can still reach `/crisis` via direct navigation or the navbar — but the BHCE "asymmetric risk" principle says: do not depend on a non-redundant CTA path.

**Recommendation:** in the duplication-cleanup phase, audit each non-canonical footer for `/crisis` link presence; either add it or migrate the page to `layout/Footer.tsx`.

## 7. Operational enforcement layer

The codebase has **active governance code** (not just docs) enforcing domain separation:

| File | What it enforces |
|---|---|
| `client/src/governance/interactions/HealingFlowProtectionRules.ts` | blocks pricing patterns in healing flow contexts |
| `client/src/governance/interactions/CrisisLanguagePattern.ts` | regex for crisis-keyword detection → BHCE escalation |
| `client/src/lumi-agent/governance/agentGovernanceRules.ts:58` | hardcoded resource-dump fallback if AI output fails safety |
| `client/src/lumi-rituals/governance/ritualSafetyRules.ts:71` | explicit forbidden-word list for ritual content |
| `ai/healing/prompts/h08_safety_check.md:19-20` | explicit "never ask why", "never offer techniques first" |
| `client/src/lumi-agent/prompts/lumiSystemPrompt.ts:13` | "you do not diagnose, prescribe, treat, or evaluate" |
| `ai/core/redact.ts` + `ai/core/risk.ts` | server-side sanitization |

**Operational enforcement is robust.** The findings above are about residual structural/naming concerns, not about missing enforcement.

## 8. Findings summary

| # | Severity | Domain pair | Item | Recommended action |
|---|---|---|---|---|
| 1 | HIGH (structural) | BUSINESS ↔ HEALING | `billing.mjs` plan-feature list includes `crisis_support` + `healing_journeys` | rename or document non-gating in planned phase |
| 2 | MED | HEALING UX | `FlowStepCheckout` step name connotes commerce | rename in naming-hygiene phase |
| 3 | MED | HEALING (visual) | `btn-secondary-premium` CSS class on Achievements panel | rename CSS class |
| 4 | MED | HEALING (BHCE) | Footer fivelet — `/crisis` link only confirmed on `layout/Footer.tsx` | consolidate or add link to all footers |
| 5 | LOW | PLATFORM ↔ HEALING | `JSON.stringify` error path in `server/replit_integrations/chat/routes.ts:110` | depends on UI handling; verify no raw JSON surfaces |

## 9. Net domain separation posture

**Healthy with named structural risks.** No live Primary Law violation observed; runtime governance code is robust; the structural concerns (especially #1, the plan-feature labeling) need deliberate resolution but do not block production operation today.

---

*This domain separation audit is descriptive. The HIGH-severity structural finding around `billing.mjs` plan features (§4.2) is the single most kernel-relevant observation in this entire phase and should be the first subject of a future planned phase. Zero source modifications in this audit.*
