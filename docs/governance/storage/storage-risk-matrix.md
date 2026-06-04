# Storage Risk Matrix — Phase H2.2 (Documentation Only)

> **Status:** Reality-only risk assessment of MMHB's browser-storage usage, compiled 2026-05-30.
> **Primary Law:** Documentation only. No runtime change, no `localStorage` replacement, no IndexedDB, no new library.
> **Companion:** `storage-taxonomy.md` (inventory), `storage-standardization-plan.md` (future, additive plan).
> **Legend (Reversibility):** High = a future fix would be additive/easily revertible · Med = some call-site migration · Low = hard to undo once shipped.

---

## 1. Risk matrix

| # | Risk | Likelihood | Impact | Reversibility | Evidence |
|---|---|---|---|---|---|
| R1 | **Unguarded direct access throws** (private mode, storage disabled, quota) crashes the rendering path | High | Med–High | High | `context/AuthContext.jsx` and `sections/*` read/write without try/catch (`storage-taxonomy.md` §2). |
| R2 | **Inconsistent guarding** — `[storage-safe-write]` idiom applied to some writes but not reads / not uniformly | High | Med | High | `main.jsx`, `EmotionContext.jsx` guard writes; reads often raw. |
| R3 | **No central wrapper** — 191 files each own their own access logic; no single point to harden | High | Med | High | No storage util module (`storage-taxonomy.md` §1). |
| R4 | **SSR / prerender blocker** — direct `localStorage`/`window` access prevents any future server render | Med | Med | High | Pure SPA today; unguarded access is the gating dependency (see platform roadmap §3). |
| R5 | **Sensitive data in `localStorage`** — auth/admin tokens & verification flags persisted in JS-readable storage | Med | High | Low (if changed in-place) | `adminSessionToken`, `mmhb_token`, `adminVerified` (`storage-taxonomy.md` §4.1). **[EXCLUDED DOMAIN — documented only]** |
| R6 | **No schema / versioning** — only `lumi:v9:` is versioned; stale shapes can deserialize incorrectly after format changes | Med | Med | Med | Naming observations (`storage-taxonomy.md` §5). |
| R7 | **Naming collisions / drift** — mixed `glp-`, `glp_`, `mmhb_`, bare keys; risk of accidental key reuse | Low–Med | Med | High | §5 conventions. |
| R8 | **Quota exhaustion** — growing arrays (sync buffer, drafts, histories) without bounds | Low–Med | Med | High | `utils/LocalSync.js` pending queue; `*_history`, `*_drafts` keys. |
| R9 | **Cross-domain contamination of storage concerns** — business/healing data sharing the same flat keyspace without separation | Low | High (governance) | Low if shipped | Flat keyspace mixes wellness, reflection, admin (§4). Kernel Primary Law applies. |
| R10 | **JSON.parse failures** — stored strings parsed without defensive handling corrupt state on read | Med | Med | High | Read sites that `JSON.parse(getItem(...))` without try/catch. |

---

## 2. Highest-priority, lowest-regret observations

- **R1 + R2 + R3 cluster** is the core resilience gap: widespread, unguarded, decentralized access. It is **high likelihood, additive to fix, fully reversible**, and unblocks R4 (SSR). This is the natural focus of any future standardization (kept additive; see plan).
- **R5 and R9** are **governance-sensitive and live in excluded domains** (auth/admin, business↔healing separation). They are recorded here for visibility but are **explicitly out of scope** for H2.2 follow-on work; any change there must be a separately-authorized, governed decision — not bundled into storage hardening.

---

## 3. Non-goals (re-affirmed)

This matrix does **not** authorize or design any code change. It does not move tokens out of `localStorage`, does not re-key anything, does not add IndexedDB, and does not touch auth/journal/crisis/healing/chat/billing/dashboard/admin flows. It is input to the additive plan in `storage-standardization-plan.md`.
