# Phase 75 — Visible Discovery Navigation

## Purpose
Make the new `/discover` tool directory easy for users to find.

## Required Link
Label: Discover Tools  
Route: /discover

## Safety Rules
- Do not touch auth.
- Do not touch billing.
- Do not touch crisis flows.
- Do not touch database.
- Do not delete routes.
- Do not refactor App.jsx globally.
- Add only one visible navigation link after identifying the canonical nav component.

## Verification
- /discover route exists
- DiscoveryPage exists
- navigation candidate files identified
- production health unchanged

## Next Step
Phase 76 should add the link only to the canonical active nav/header/sidebar component.
