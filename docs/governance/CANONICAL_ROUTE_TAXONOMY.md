# Canonical Route Taxonomy

**Status:** CANONICAL — governance contract
**Issued:** 2026-05-24
**Authority:** project owner directive
**Supersedes / extends:** `docs/governance/ROUTING_GOVERNANCE.md`, `docs/governance/CANONICAL_ROUTE_OWNERSHIP.md`, `docs/governance/DUPLICATE_ROUTE_FAMILY_RULES.md`, `docs/governance/ROUTE_CONSOLIDATION_DECISION_LEDGER.md` (these remain in force; this document is the canonical taxonomy they reference)
**Companion audit:** `docs/reports/CANONICAL_TAXONOMY_AUDIT.md`

---

## PRIMARY USER DOMAINS

### Emotional Wellness

- `/wellness`
- `/wellness-tools`
- `/mood`
- `/presence`
- `/journal`
- `/reflection`
- `/mindfulness`

### Learning + Growth

- `/learn`
- `/wisdom`
- `/growth`
- `/practices`

### Companion Experience

- `/companion`
- `/buddy`
- `/ai-chat`

### Safety + Trust

- `/safety`
- `/privacy`
- `/legal`
- `/community-guidelines`

### Community

- `/community`
- `/discussion`
- `/social`

---

## ADMIN DOMAIN

ALL admin systems MUST remain under:

```
/admin/*
```

Examples:

- `/admin/analytics`
- `/admin/content`
- `/admin/social`
- `/admin/tools`
- `/admin/security`

---

## DISCOVERABILITY LAW

Canonical discovery route:

```
/discover
```

Canonical destination:

```
/wellness-tools
```

No competing discovery hubs allowed without governance review.

---

## DUPLICATION RULE

No duplicate:

- dashboards
- admin panels
- route registries
- route aliases
- tool hubs
- navigation systems

without canonical registry approval.

---

## INTERPRETIVE NOTES (operational)

The following notes do not modify the contract above; they record how the contract interacts with existing kernels and audits.

1. **MMHB v7.4 BHCE override remains supreme.** The Crisis surface (`/crisis`, 988, 741-741, 911) is not enumerated in this taxonomy because it is a kernel-level guarantee independent of any domain — it must remain globally accessible from every page regardless of taxonomy assignment.
2. **Cross-reference with existing protected-review rules:** the per-family review requirements in `CANONICAL_ROUTE_OWNERSHIP.md` (auth, billing, admin role-scoping, mood/journal privacy, AI/chat non-clinical, privacy/safety/legal trust-surface) still gate any change to those domains. This taxonomy does not loosen those gates.
3. **Auditing this taxonomy is documentation-only by default.** Any consolidation, alias removal, or domain re-assignment requires the canonical-registry approval named in the DUPLICATION RULE — and any change to the `/admin/*`, `/journal`, `/mood`, `/ai-chat`, `/safety`, `/privacy`, `/legal`, or `/community-guidelines` surfaces additionally requires the protected-review gates already in `ROUTE_CONSOLIDATION_DECISION_LEDGER.md`.
4. **Alias paths:** documented alias clusters (e.g. `/login` + `/signin` + `/sign-in`, `/register` + `/signup` + `/sign-up` + `/create-account`, `/wellbeing` + `/well-being`) are intentional UX surfaces. They do not violate the DUPLICATION RULE because each alias group resolves to one canonical component (one "route alias" group, not multiple route registries). Alias *groups themselves* still require canonical-registry approval before adding new members or removing existing ones.

---

*This document is the canonical taxonomy. The verbatim PRIMARY USER DOMAINS, ADMIN DOMAIN, DISCOVERABILITY LAW, and DUPLICATION RULE sections are the contract; the INTERPRETIVE NOTES are operational gloss only and may not be used to weaken the contract.*
