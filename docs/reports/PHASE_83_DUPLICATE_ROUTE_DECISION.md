# Phase 83 — Duplicate Route Component Identity Audit

## Purpose
Determine whether duplicate routes are:
1. harmless aliases,
2. duplicate declarations pointing to same component,
3. dangerous conflicts where the same path points to different components.

## Rule
Do not delete or merge routes until component identity is verified.

## Priority
Start with trust and user-facing routes:
- /privacy
- /about
- /therapy
- /presence
- /affirmations
- /tools/meditation
- /sleep
- /recovery
- /program
- /subscribe

## Safety
No source edits.
No route edits.
No auth edits.
No billing edits.
No crisis edits.
