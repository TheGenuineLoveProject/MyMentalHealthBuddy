# Phase 96 — Duplicate Route Decision Lock

## Purpose
Lock duplicate route handling before any source-code route edits.

## Hard Rule
No duplicate route is removed, merged, redirected, or renamed until its component identity and user journey purpose are verified.

## Priority Review Order
1. Safety / Privacy / Legal routes
2. Auth routes
3. Billing routes
4. Admin routes
5. Wellness routes
6. Discovery / tools routes
7. Content / blog / hub routes

## Current Decision
Audit-only phase. No source files modified.

## Required Before Route Edits
- Confirm duplicate route path
- Confirm both components
- Confirm which one is canonical
- Confirm redirect or removal plan
- Build passes
- Health passes
- Production remains green

## Safety
No source changes.
No route changes.
No auth changes.
No billing changes.
No crisis changes.
No database changes.
No deployment changes.
