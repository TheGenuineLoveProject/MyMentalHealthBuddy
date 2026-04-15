# B10 — PUBLISHING AUDIT CONTRACT

## Contract ID
PUBLISHING_AUDIT_CONTRACT

## Domain
PLATFORM_DOMAIN

## Purpose
Define the required audit trail fields and logging rules for every publish, update, archive, and distribution action. This contract specifies the shape of the `audit` object referenced in B1 (CONTENT_MODEL_CONTRACT).

## Canonical Audit Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| created_by | string (user ID) | yes | User who created the content |
| created_at | ISO 8601 datetime | yes | Timestamp of creation |
| updated_by | string (user ID) | yes | User who last modified the content |
| updated_at | ISO 8601 datetime | yes | Timestamp of last modification |
| published_by | string (user ID) | conditional | User who published, required when status is published |
| published_at | ISO 8601 datetime | conditional | Timestamp of publish, required when status is published |
| archived_by | string (user ID) | conditional | User who archived, required when status is archived |
| archived_at | ISO 8601 datetime | conditional | Timestamp of archive, required when status is archived |
| version | integer | yes | Content version number, incremented on every save |
| transitions | array | yes | History of state transitions |
| qa_results | array | no | History of QA checklist results |
| distribution_log | array | no | History of distribution events |

## Transition Log Entry

Each entry in the `transitions` array:
```
{
  "from": string (previous state),
  "to": string (new state),
  "by": string (user ID),
  "at": ISO 8601 datetime,
  "reason": string | null
}
```

## QA Results Entry

Each entry in the `qa_results` array:
```
{
  "checked_at": ISO 8601 datetime,
  "checked_by": string (user ID or "system"),
  "result": "pass" | "fail",
  "blocks": string[] (list of failed BLOCK checks),
  "warnings": string[] (list of triggered WARN checks)
}
```

## Distribution Log Entry

Each entry in the `distribution_log` array:
```
{
  "channel": "newsletter" | "twitter" | "instagram" | "linkedin" | "facebook" | "threads",
  "action": "sent" | "scheduled" | "failed" | "cancelled",
  "at": ISO 8601 datetime,
  "by": string (user ID or "system"),
  "details": string | null
}
```

## Audit Rules

1. Every content creation must set created_by and created_at
2. Every content save must update updated_by, updated_at, and increment version
3. Every state transition must append to the transitions array
4. Every QA check must append to the qa_results array
5. Every distribution action must append to the distribution_log array
6. Audit data is append-only — entries must never be modified or deleted
7. Version starts at 1 and increments by 1 on every save

## Retention Rules

1. Audit data is retained for the lifetime of the content item
2. Archived content retains full audit history
3. Audit data is not exposed to public-facing pages
4. Audit data is accessible to admin users only

## Immutability Rules

1. created_by and created_at are set once and never changed
2. Transition entries are append-only
3. QA result entries are append-only
4. Distribution log entries are append-only
5. No audit field may be overwritten or backdated

## Dependencies
- B1 (CONTENT_MODEL_CONTRACT) — audit field definition
- B3 (PUBLICATION_STATE_MACHINE_CONTRACT) — transition events
- B7 (CONTENT_QA_CHECKLIST_CONTRACT) — QA result events
- B8 (NEWSLETTER_DISTRIBUTION_CONTRACT) — newsletter distribution events
- B9 (SOCIAL_DISTRIBUTION_CONTRACT) — social distribution events

## Version
1.0.0

## Status
CANONICAL
