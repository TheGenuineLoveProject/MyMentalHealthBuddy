# Low-Risk Route Family Inventory — Phase 67

**Generated:** 2026-05-24 02:22 UTC
**Mode:** documentation / inventory only. No source modification. No route deletion. No refactor.
**Companion report:** `docs/reports/PHASE_67_LOWRISK_ROUTE_FAMILY.md`
**Scope:** Growth / Home / Reflection / Public Content route surfaces in `client/src/App.jsx` only.
**Explicit out-of-scope (untouched, unaudited):** `/crisis`, `/api/auth` + `/login` + `/register` + `/signin` family, `/admin*`, `/billing` + `/checkout` + `/pricing` + `/subscribe`, `/journal`, `/mood`, `/ai-chat` + `/chat`, `/privacy`, `/safety`, `/legal` + `/terms` + `/disclaimer`, `/api/*`, all `2fa` / `password` / `forgot` / `reset` / emergency / 988 / 741741 surfaces.

---

## 1. Method

- Source: `client/src/App.jsx` `<Route path="…">` declarations only.
- Total `<Route>` declarations matched: **250**.
- Excluded by the safety filter above: **23**.
- In-scope candidate routes for this phase: **227**.
- Triage: each candidate placed into exactly one of 5 buckets:
  1. **HOME / MARKETING** — landing pages, brand, "what we are"
  2. **PUBLIC CONTENT — Hubs & Topic Pages** — `/hubs/*` + `/explore/*` + free-standing topic landing pages
  3. **GROWTH TOOLS — Public Educational** — `/tools/*`, breathing/meditation/grounding/affirmations etc. that are public, non-PHI, no auth required
  4. **REFLECTION — Public** — gratitude / reflect / prompts / daily-practice / habits surfaces that do not log PHI
  5. **DEFER (prudent)** — routes that *look* low-risk but touch user state, personalization, PHI-adjacent data, billing, or auth UX surface. **Out of scope this phase.**

No live runtime testing, no functional verification, no PII/PHI tracing in this phase. Categorization is **path-name signal only** — file-by-file behavior verification is a separate future phase.

## 2. Bucket 1 — HOME / MARKETING (14 routes)

| Path | Component (where labeled) | Notes |
|---|---|---|
| `/` | ConfigRoute | Root landing |
| `/landing` | ConfigRoute | Alternate landing alias |
| `/original-home` | ConfigRoute | Pre-refresh home |
| `/healing` | ConfigRoute | Brand surface |
| `/about` | ConfigRoute | About page |
| `/about/approach` | AboutApproachPage | Approach detail |
| `/values` | ValuesPage | Values page |
| `/features` | ConfigRoute | Features page |
| `/testimonials` | ConfigRoute | Testimonials |
| `/canva-landing` | CanvaLanding | Canva-derived landing |
| `/start` | Start | "Start here" funnel |
| `/coming-soon` | ComingSoon | Pre-launch placeholder |
| `/welcome` | (verify) | First-run welcome |
| `/what-you-get` | (verify) | Value-prop page |

**Disposition:** document only. All public, non-PHI, no auth dependency. Future phases may rationalize duplicate landings (`/`, `/landing`, `/original-home`, `/healing`) but **no action this phase**.

## 3. Bucket 2 — PUBLIC CONTENT (Hubs + Explore + Topic pages) (~115 routes)

### 2a. `/hubs/*` namespace — 42 routes (largest single subfamily)

```
/hubs                        (index)
/hubs/sleep                  /hubs/boundaries        /hubs/self-worth
/hubs/resilience             /hubs/anxiety           /hubs/relationships
/hubs/grief                  /hubs/self-compassion   /hubs/mindfulness
/hubs/stress                 /hubs/trauma-healing    /hubs/emotional-intelligence
/hubs/personal-growth        /hubs/inner-peace       /hubs/healing-journey
/hubs/self-care              /hubs/coping-skills     /hubs/inner-work
/hubs/breathwork             /hubs/body-mind         /hubs/daily-practice
/hubs/gratitude              /hubs/thoughtwork       /hubs/life-purpose
/hubs/communication          /hubs/forgiveness       /hubs/energy-management
/hubs/habits                 /hubs/confidence        /hubs/focus
/hubs/spirituality           /hubs/motivation        /hubs/acceptance
/hubs/creativity             /hubs/self-awareness    /hubs/nervous-system
/hubs/presence               /hubs/wisdom            /hubs/self-discovery
/hubs/emotions               /hubs/self-love
```

**Subfamily strength:** strongest naming consistency in the whole frontend. Single `/hubs/[slug]` shape. Candidate for `/hubs/:slug` consolidation in a future phase. **Sensitivity flags (review needed before any rationalization):** `/hubs/trauma-healing`, `/hubs/grief`, `/hubs/anxiety`, `/hubs/stress` — content must continue to carry the `/crisis` routing footer.

### 2b. `/explore/*` namespace — 3 routes

```
/explore/topics      /explore/pathways      /explore/search
```

### 2c. Free-standing topic landing pages (~70 routes — SEO/topic surfaces)

Single-word/short-phrase URLs that appear to be SEO topic landing pages. Most are public, evergreen wellness content. **Sensitivity-tiered:**

**Tier 1 — fully benign topic terms** (calmness, posture, lifestyle):
```
/calm   /peace   /relax   /serenity   /tranquility   /sleep   /rest
/energy   /balance   /focus   /clarity   /happiness   /joy
/peace-of-mind   /inner-peace   /mind   /body   /soul
/exercise   /movement   /fitness   /nutrition   /yoga
/wellbeing   /well-being   /mental-wellness   /emotional-health
/wellness-tools   /coping   /relaxation   /presence   /awareness
/connection   /relationships   /intimacy   /attachment
/trust   /compassion   /patience   /kindness   /forgiveness
/motivation   /purpose   /acceptance   /strength   /courage
/hope   /love   /mindset   /self-improvement   /personal-growth
/growth   /spiritual   /spiritual-wellness   /mental
/self-help   /self-esteem   /confidence   /empowerment
/peacescape   /habits   /boundaries
```

**Tier 2 — clinical / sensitive topic terms** (must carry `/crisis` routing footer; do not rename or merge without trauma-informed-content review):
```
/anxiety   /depression   /stress   /trauma   /ptsd   /grief
/loss   /sadness   /anger   /fear   /shame   /guilt
/loneliness   /isolation   /addiction   /nervous-system
/triggers   /worry   /overthinking   /emotions   /feelings
/emotional   /counseling   /self-love
```

**Disposition:** keep all. Tier-2 surfaces are EXPLICITLY out of consolidation scope without trauma-informed-content sign-off. **Phase 67 does not edit, rename, merge, or remove any of these.**

## 4. Bucket 3 — GROWTH TOOLS (Public Educational) (~20 routes)

### Calibrated screeners (validated public instruments — DO NOT modify, future-phase clinical review required):
```
/tools/gad7                            (GAD-7 anxiety screener)
/tools/phq9                            (PHQ-9 depression screener)
```
**Sensitivity:** these are validated instruments referenced in mental-health literature. Any modification requires clinical sign-off. **Out of consolidation scope.**

### Public coping/skills tools:
```
/tools/distortion-checker              /tools/breath-pacer
/tools/boundary-builder                /tools/manipulation-detector
/tools/sleep-quality-calculator        /tools/nervous-system-check
/tools/all                             (index)
```

### Alias paths into the same tools (5 alias routes):
```
/tools/breathing       → likely BreathingExercisesPage    (also at /breathing)
/tools/affirmations    → likely Affirmations page         (also at /affirmations)
/tools/meditation      → likely Meditation page           (also at /meditation)
/tools/grounding       → likely Grounding page            (also at /grounding)
/tools/self-care       → likely Self-Care page            (also at /self-care)
```
**Likely alias pairs** (free-standing path + `/tools/*` path → same component). This mirrors the Category-B alias pattern documented in Phase 66 for Register/Login. **Disposition:** KEEP, document.

### Free-standing growth/practice surfaces:
```
/breathing   /grounding   /meditation   /mindfulness
/affirmations   /self-care   /calming-scenes   /sleep-guide
/stress-response   /emotional-intelligence
/wellness   /wellness-tools-hub   /wellness-dashboard
/discernment   /twelve-practices   /paths/12-practices
/exercises   /activities   /routines   /practice   /daily
```

**Likely alias pairs inside this bucket:**
- `/twelve-practices` and `/paths/12-practices` (same content?)
- `/wellness`, `/wellness-tools-hub`, `/wellness-dashboard`, `/wellness-tools` (4 wellness landings — overlap review needed in a future phase)
- `/affirmations` appears twice (duplicate `<Route>` declarations in `App.jsx` — see §6 anomaly).

## 5. Bucket 4 — REFLECTION (Public, non-PHI) (~10 routes)

```
/gratitude            /gratitude/hub
/reflect              /reflection           /reflections
/daily-reflection     /prompts              /daily
/practice
```

**Sensitivity:** these surfaces typically render prompt content. They are **only low-risk if they do not persist user-entered reflection text server-side**. If any of these routes posts to `/api/journal` or similar PHI store, that surface becomes journal-family and is **out of scope** for this phase. **Disposition:** document only, with a "verify no PHI write-path" follow-up flag for a future phase.

## 6. Bucket 5 — DEFER (prudent) — out of scope this phase (~25 routes)

These look low-risk by name but touch user state, personalization, PHI-adjacent data, billing, design-system internals, or premium upsell. **Phase 67 explicitly excludes these from the low-risk family:**

| Path | Reason for deferral |
|---|---|
| `/dashboard`, `/dashboard/progress`, `/today`, `/overview` | personalized user-state surfaces |
| `/state` | likely state-of-mind capture (PHI-adjacent) |
| `/therapy`, `/therapy-tools`, `/coach`, `/mentor`, `/sessions` | session-based user data |
| `/analytics`, `/settings`, `/reminders`, `/voice-settings` | user preferences / personalization |
| `/library/saved` | user-saved content list (auth-bound) |
| `/biometrics` | PHI-adjacent |
| `/protocols`, `/protocols/session/:id` | session-bound, dynamic id |
| `/presence` | also appears as `/hubs/presence` — duplication noted |
| `/profile`, `/onboarding` | identity / first-run surfaces |
| `/avatar-lab`, `/rig-lab`, `/motion-lab` | premium/admin-adjacent tooling |
| `/premium`, `/upgrade` | billing-adjacent — explicit spec exclusion |
| `/lumi-design-system` | design system internals (not user content) |
| `/recovery` | recovery / addiction-adjacent — sensitive content review needed |

**Why deferred:** the phase spec excludes billing, journal, mood, privacy, safety, and admin surfaces. These paths land in the gray zone between the excluded surfaces and the low-risk public-content family. The conservative call is to leave them for a per-bucket follow-up phase with the appropriate sign-off (auth, billing, or clinical review as applicable).

## 7. Anomalies surfaced (document only)

### A. Duplicate `<Route>` declarations in `App.jsx` (~10 paths)

The prefix-distribution scan showed these paths each appear as `<Route path="X">` **twice** in `client/src/App.jsx`:

```
/peace   /mind   /body   /soul   /sleep   /rest
/energy   /balance   /presence   /affirmations
```

Last declaration wins in `wouter` — earlier declarations are dead code. This is a one-line-per-route cleanup candidate for a future phase. **No action this phase.** (Verification required: confirm the duplicates actually point to the same component, and that wouter ordering is what's making the second declaration the live one.)

### B. Likely alias clusters (single component, multiple paths)

Cross-checking Phase 66 Category B and this phase's findings, additional likely alias clusters:

- **Twelve practices:** `/twelve-practices` + `/paths/12-practices`
- **Wellness landing:** `/wellness` + `/wellness-tools` + `/wellness-tools-hub` + `/wellness-dashboard`
- **Breathing:** `/breathing` + `/tools/breathing`
- **Meditation:** `/meditation` + `/tools/meditation`
- **Grounding:** `/grounding` + `/tools/grounding`
- **Affirmations:** `/affirmations` (×2) + `/tools/affirmations`
- **Self-care:** `/self-care` + `/tools/self-care`
- **Wellbeing spelling:** `/wellbeing` + `/well-being`

**Disposition:** keep all (Phase 66 Category B rule). Catalog only.

### C. Topic-page sensitivity audit deferred

The 24 Tier-2 sensitive topic landing pages (anxiety, depression, ptsd, trauma, etc.) need verification that each renders the canonical `/crisis` routing footer (988 + 741741 + 911 + `/crisis` link), per the v7.4 kernel's BHCE rule. **Verification deferred** to a follow-up phase — this phase does not enter those page components.

## 8. Counts summary

| Bucket | Routes | Action this phase |
|---:|---:|---|
| 1 — Home / Marketing | 14 | document only |
| 2 — Public Content (hubs + explore + topics) | ~115 | document only |
| 3 — Growth Tools (public educational) | ~20 | document only |
| 4 — Reflection (public) | ~10 | document only |
| 5 — DEFER (out of scope) | ~25 | excluded from this phase |
| Skipped by safety filter (auth/billing/admin/etc.) | 23 | excluded by spec |
| **Total `<Route>` declarations triaged** | **250** | **0 routes edited / merged / removed** |

---

## 9. Hard constraints honored

| Rule | Compliance |
|---|---|
| Documentation and inventory only | ✅ 2 doc files |
| No source code changes | ✅ 0 source files touched |
| No route deletion | ✅ 0 routes removed |
| No refactor | ✅ |
| No dependency changes | ✅ |
| Did not touch crisis | ✅ skipped by filter |
| Did not touch auth | ✅ skipped by filter |
| Did not touch billing | ✅ skipped by filter |
| Did not touch admin | ✅ skipped by filter |
| Did not touch journal | ✅ skipped by filter |
| Did not touch mood | ✅ skipped by filter |
| Did not touch AI chat | ✅ skipped by filter |
| Did not touch privacy / safety / legal | ✅ skipped by filter |

---

*End of low-risk route family inventory. Companion: `docs/reports/PHASE_67_LOWRISK_ROUTE_FAMILY.md`.*
