# Phase 70 — Tool Visibility Verification

## Purpose
Verify whether the advertised tool count matches what users can actually see and access.

## Current concern
The platform may advertise “500 tools,” but visible frontend routes, backend health metadata, and actual accessible tool surfaces must be verified before making public claims.

## Rule
Do not advertise 500 tools unless:
1. 500 distinct tools exist,
2. they are user-accessible,
3. they are categorized,
4. they are linked in UI,
5. production confirms the routes/pages are reachable.

## If fewer than 500 are visible
Use accurate language:
- “Growing library of wellness tools”
- “100+ guided wellness resources”
- “Expanding emotional wellness toolkit”
- “500-tool roadmap in progress”

## Next safe step
Build a public Tool Directory audit that maps:
Tool name → category → route → status → visible/invisible → safe claim.
