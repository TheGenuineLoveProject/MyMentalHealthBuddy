# Route Ownership Manifest

Generated: 2026-05-26T07:02:48.967Z

## Duplicate Route Groups

| Route | Count | Classification | Protected | Wellness | ConfigRoute | Redirect | Components |
|---|---:|---|---|---|---|---|---|
| /about | 2 | SAFE_ALIAS | no | no | no | no | AboutPage, inline/children |
| /activities | 2 | REVIEW_REQUIRED | no | yes | no | yes | inline/children |
| /activity | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |
| /affirmations | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /balance | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /body | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /cherish | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |
| /counseling | 2 | REVIEW_REQUIRED | no | no | yes | yes | inline/children |
| /embrace | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |
| /energy | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /exercises | 2 | REVIEW_REQUIRED | no | yes | no | yes | inline/children |
| /flourishing | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |
| /mind | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /motivated | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |
| /peace | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /personal-growth | 2 | REVIEW_REQUIRED | no | yes | no | no | inline/children |
| /presence | 2 | REVIEW_REQUIRED | no | yes | no | no | inline/children |
| /privacy | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /program | 3 | CRITICAL_CONFLICT | no | no | no | yes | inline/children |
| /programs | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |
| /ptsd | 2 | REVIEW_REQUIRED | no | yes | no | yes | inline/children |
| /recovery | 2 | REVIEW_REQUIRED | no | yes | no | yes | inline/children |
| /rest | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /serenity | 2 | REVIEW_REQUIRED | no | no | yes | yes | inline/children |
| /sleep | 2 | REVIEW_REQUIRED | no | no | yes | no | inline/children |
| /soul | 2 | REVIEW_REQUIRED | no | yes | yes | no | inline/children |
| /sounds | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |
| /subscribe | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |
| /therapy | 2 | REVIEW_REQUIRED | no | yes | no | yes | inline/children |
| /tools/meditation | 2 | REVIEW_REQUIRED | no | yes | yes | no | inline/children |
| /tranquility | 2 | REVIEW_REQUIRED | no | no | yes | yes | inline/children |
| /webinar | 2 | REVIEW_REQUIRED | no | no | no | yes | inline/children |

## Governance Rules

- This manifest is observational only.
- Do not delete duplicate routes without confirming wrapper ownership.
- ProtectedRoute and WellnessRoute must be preserved.
- ConfigRoute delegation must not be removed unless the replacement page preserves body behavior.
- SEO canonical pages should remain thin wrappers around existing body components.
- Future cleanup must resolve CRITICAL_CONFLICT first, then REVIEW_REQUIRED groups one route at a time.
