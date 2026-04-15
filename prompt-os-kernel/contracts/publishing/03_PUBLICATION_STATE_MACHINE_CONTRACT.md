# B3 — PUBLICATION STATE MACHINE CONTRACT

## Contract ID
PUBLICATION_STATE_MACHINE_CONTRACT

## Domain
PLATFORM_DOMAIN

## Purpose
Define the legal publication states and allowed transitions for all content entities. No content may transition between states outside this contract.

## States

| State | Description |
|-------|-------------|
| idea | Initial capture, minimal fields required |
| draft | In progress, author is editing |
| review | Submitted for editorial review |
| approved | Passed review, ready for publish or scheduling |
| scheduled | Approved with a future publishAt date |
| published | Live and visible per visibility rules |
| archived | Removed from active display, retained for audit |

## Legal Transitions

| From | To | Condition |
|------|-----|-----------|
| idea | draft | Author begins editing |
| draft | review | Author submits for review |
| draft | idea | Author reverts to idea (voluntary) |
| review | approved | Reviewer approves content |
| review | draft | Reviewer returns with feedback |
| approved | scheduled | publishAt date is set in the future |
| approved | published | Immediate publish, all validation passes |
| approved | draft | Author requests rework |
| scheduled | published | publishAt date is reached |
| scheduled | approved | Author cancels schedule |
| published | archived | Author or admin archives content |
| archived | draft | Author restores for rework |

## Illegal Transitions

The following transitions are explicitly forbidden:
- idea → published (must pass through review)
- idea → approved (must pass through review)
- draft → published (must pass through review)
- draft → approved (must pass through review)
- review → published (must be approved first)
- review → scheduled (must be approved first)
- archived → published (must go through draft → review → approved)
- Any state → idea (except draft → idea)

## Transition Preconditions

### → review
- title, slug, summary, body, author, domain must be non-empty
- body min length: 100 characters

### → approved
- All required fields from B1 must be present
- SEO metadata (B2) must be valid and complete
- Content QA checklist (B7) must pass

### → scheduled
- publishAt must be a valid future ISO 8601 datetime

### → published
- All B7 QA checks must pass
- canonicalUrl must be set
- Slug must be canonicalized per B4
- Audit trail must record published_by and published_at

### → archived
- Audit trail must record archived_by and archived_at
- Content remains in database for audit purposes
- URLs may return 410 Gone or redirect

## Audit Requirements
Every state transition must be recorded in the audit trail (B10) with:
- previous_state
- new_state
- transitioned_by (user ID)
- transitioned_at (ISO 8601)
- reason (optional, required for review → draft)

## Dependencies
- B1 (CONTENT_MODEL_CONTRACT) — status field definition
- B2 (SEO_METADATA_CONTRACT) — required before approved
- B7 (CONTENT_QA_CHECKLIST_CONTRACT) — required before approved/published
- B10 (PUBLISHING_AUDIT_CONTRACT) — transition logging

## Version
1.0.0

## Status
CANONICAL
