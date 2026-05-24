# Route Consolidation Decision Ledger

## Purpose
Prevent unsafe route deletion, route merging, or UX collapse by requiring every route family to receive a decision before code changes.

## Rules
1. Crisis routes are protected: never merge casually.
2. Auth/account routes require authentication review.
3. Billing/pricing routes must stay separated from healing flows.
4. Admin routes must remain role-scoped.
5. Mood/journal routes require privacy review.
6. AI/chat routes must remain non-clinical and human-supervised.
7. Privacy/safety/legal routes are trust-critical and protected.
8. Breath/calm routes may consolidate only after UX review.
9. Growth/home/reflection routes may consolidate only after content review.
10. No source file deletion until owner + action + rollback path are documented.

## Decision States
- KEEP
- PROTECT
- REVIEW
- CONSOLIDATE_LATER
- ARCHIVE_CANDIDATE
- DO_NOT_TOUCH
