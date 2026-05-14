# Phase 16 — Reflective Memory Layer · Spec Checklist

Standalone opt-in module at `client/src/lumi-memory/`. Same shipping pattern
as v5.8.51 / v5.8.52 / v5.8.53 / v5.8.54: zero production wiring, isolated
vitest config, design-system tokens only, single hardened public write path.

## Spec → file map

| Spec file                        | Implementation path                                |
| -------------------------------- | -------------------------------------------------- |
| `allowedMemoryFields.ts`         | `state/allowedMemoryFields.ts`                     |
| `forbiddenMemoryPatterns.ts`     | `safety/forbiddenMemoryPatterns.ts`                |
| `memoryConsentRules.ts`          | `safety/memoryConsentRules.ts`                     |
| `memoryRetentionRules.ts`        | `safety/memoryRetentionRules.ts`                   |
| `memoryStore.ts`                 | `state/memoryStore.ts`                             |
| `continuityEngine.ts`            | `runtime/continuityEngine.ts`                      |
| `memoryRouter.ts`                | `runtime/memoryRouter.ts`                          |
| `MemorySettingsPanel.tsx`        | `components/MemorySettingsPanel.tsx`               |
| `MemoryResetButton.tsx`          | `components/MemoryResetButton.tsx`                 |
| `MemoryTransparencyView.tsx`     | `components/MemoryTransparencyView.tsx`            |

Plus: `index.ts` (barrel) + `tests/{memorySafety.test.ts,vitest.config.mjs}` +
this checklist.

## Allowed-fields contract (10)

| Field                    | Bucket  | Notes                                                |
| ------------------------ | ------- | ---------------------------------------------------- |
| preferredTheme           | 180 d   | UI pref — long-stable                                |
| preferredMotion          | 180 d   | UI pref — long-stable                                |
| preferredFontScale       | 180 d   | UI pref — long-stable                                |
| preferredLanguage        | 180 d   | UI pref — long-stable                                |
| preferredTools           | 90 d    | enum — only 5 wellness tool slugs allowed            |
| preferredPacing          | 90 d    | slow / medium / flexible                             |
| preferredCheckInTime     | 90 d    | morning / midday / evening / any                     |
| preferredGreetingTone    | 90 d    | warm / neutral / minimal                             |
| lastSessionAt            | 30 d    | ISO timestamp — drives gentle "welcome back" hint   |
| ephemeralSessionHint     | 7 d     | ≤120 char category string — never narrative content  |

Module-load guard fires if list ≠ 10.

## Forbidden categories (7)

trauma_narrative · vulnerability_score · attachment_data ·
manipulation_profile · crisis_history · pii · clinical_diagnosis.

Each carries 3–5 conservative regexes. False-positives acceptable;
false-negatives are not. `findForbiddenHits()` walks strings, arrays, and
plain objects (one level deep). Module-load guard fires if total patterns
fall below 25.

## Consent state machine

`unset → granted | declined`
`granted → revoked` (wipes store atomically)
`declined → unset | granted`
`revoked → unset | granted`

Writes only allowed when `state === "granted"` AND
`policyVersion === CONSENT_POLICY_VERSION`. Bumping policy version
invalidates existing consent (`needsReconsent()` returns true).

## Router pipeline (writeMemory)

1. Field allow-list check       → `rejected_unknown_field`
2. Per-field shape validation   → `rejected_invalid_value`
3. Forbidden content scan       → `rejected_forbidden_content`
4. Consent gate                 → `rejected_no_consent`
5. Prune expired (best-effort)
6. Persist + audit              → `accepted`

Every rejection AND every accept logs an audit entry. Audit log capped at
`MAX_AUDIT_ENTRIES = 200` (FIFO trim).

## Continuity engine contract

- `buildGreeting({})` → neutral, `fromMemory: false`. NEVER invents
  "welcome back" when there is no prior session.
- `buildHints({})` → `[]`. Capped at 3 hints when memory present.
- `pickPacing({})` → `"flexible"` (least-committed default).

## Public API surface (barrel)

Read: `useMemoryStore`, `selectConsent`, `selectLiveEntries`, `selectAudit`,
`readMemory`, `RETENTION_DAYS`, `ALLOWED_MEMORY_FIELDS`, etc.

Write (single path): `writeMemory` · `setConsent` · `resetMemory`.

Components: `MemorySettingsPanel` · `MemoryResetButton` · `MemoryTransparencyView`.

Raw store mutators (`_setConsent`/`_putEntry`/`_appendAudit`/`_pruneExpired`)
are intentionally NOT re-exported and are documented INTERNAL on the store
type.

## Test distribution (24 / spec floor 20)

Allow-list shape 2 · Forbidden categories 8 · Consent state machine 4 ·
Retention 4 · Router 3 · Continuity engine 2 · Reset + audit 1.
