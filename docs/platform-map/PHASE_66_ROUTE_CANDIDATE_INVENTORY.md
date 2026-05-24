# Phase 66 — Route Candidate Inventory

## Purpose
Create a safe inventory of route/page candidates before any route consolidation.

## Rules
- No source code changes.
- No route deletion.
- No refactor.
- No dependency changes.
- No runtime changes.
- Protected families stay protected until reviewed.

## Protected Route Families
| Family | Rule |
|---|---|
| Crisis | DO_NOT_TOUCH |
| Auth/Login/Account | REVIEW_ONLY |
| Billing/Pricing | KEEP_SEPARATE_FROM_HEALING |
| Admin/Dashboard | ROLE_SCOPE_REQUIRED |
| Mood/Journal | PRIVACY_REVIEW_REQUIRED |
| AI/Chat/Companion | CLINICAL_BOUNDARY_REVIEW |
| Privacy/Safety/Legal | TRUST_REVIEW_REQUIRED |
| Breath/Calm | UX_REVIEW_REQUIRED |
| Growth/Home/Reflection | CONTENT_REVIEW_REQUIRED |

## Decision
This phase only inventories. Consolidation must happen later, one family at a time.
