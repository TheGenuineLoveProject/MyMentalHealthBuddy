---
name: BHCE crisis-scan on wellness string fields
description: Any string field reaching a wellness/AI endpoint must be crisis-scanned + sanitized server-side, even on "counts-only" summaries.
---

# BHCE: every untrusted string on a healing surface is a crisis vector

Rule: an endpoint that looks "counts-only" / "no free-text" is still a free-text
crisis vector if ANY field is a client-supplied string (e.g. a `dominantEmotion`
label inside a summary object). Before that string reaches an AI prompt, an AI
output, or a deterministic template, you MUST:
1. Sanitize it to a safe shape (length-cap, strip to a word-like label).
2. Crisis-scan the RAW value with `detectCrisis(...)` (from `server/ai/safety/crisis.mjs`)
   and, on a signal, return supportive text carrying the canonical resources
   (988 + text HOME to 741741 + 911 + `/crisis`) instead of a generic reflection.

**Why:** MMHB BHCE asymmetric-risk contract — err toward resource provision. A
reviewer flagged that an unvalidated `dominantEmotion` let a client inject
"I want to kill myself" through a counts-only endpoint, bypassing crisis routing.
The "no free-text so no crisis routing needed" assumption is FALSE whenever a
string field exists.

**How to apply:** when adding/auditing any `/api/ai/*` or wellness endpoint, list
every string field in the body. If one exists, it gets sanitize + `detectCrisis`
before use. Numeric fields get clamped (non-negative, bounded). Note CSRF bypasses
on Bearer/x-guest-id, so these endpoints are reachable by any authed user or guest.
Also: deterministic fallbacks must end with the EXACT governance line
"Take what serves you. You know yourself best." (no paraphrase).
