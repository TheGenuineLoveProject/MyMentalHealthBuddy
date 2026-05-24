# Canonical Route Ownership

## Purpose
Define which route/page owns each major user journey before any consolidation.

## Ownership Rules
1. Crisis routes are protected and must not be merged casually.
2. Auth/account routes require authenticated flow review.
3. Billing/pricing routes must stay separated from healing flows.
4. Admin routes must remain role-scoped.
5. Mood/journal routes must preserve privacy boundaries.
6. AI/chat/companion routes must remain non-clinical and human-supervised.
7. Privacy/safety/legal routes are protected trust surfaces.
8. Breath/calm routes can be consolidated only after UX review.
9. Growth/home/reflection routes may be consolidated after content review.

## Canonical Families

| Family | Canonical Owner | Status | Action |
|---|---|---|---|
| Crisis | Current production /crisis route | Protected | Keep |
| Auth/Login/Account | TBD after auth audit | Review needed | Hold |
| Billing/Pricing | Billing domain only | Protected separation | Hold |
| Admin/Dashboard | Admin domain only | Review needed | Hold |
| Mood/Journal | Healing domain | Privacy protected | Hold |
| AI/Chat/Companion | AI support domain | Boundary protected | Hold |
| Privacy/Safety/Legal | Trust domain | Protected | Keep |
| Breath/Calm | Wellness tools domain | Candidate for later consolidation | Hold |
| Growth/Home/Reflection | Public content domain | Candidate for later consolidation | Hold |

## Rule
No source deletion until ownership is verified.
