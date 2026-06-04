# Phase 101 — Footer + Sitemap Canonicalization Plan

## Purpose
Create the safe plan before editing footer, sitemap, robots, or legal navigation.

## Canonical Legal Routes
- /privacy
- /terms
- /consent
- /data-policy

## Canonical Discovery Routes
- /discover
- /wellness-tools

## Rules
- No route deletion yet.
- No footer source edits yet.
- No sitemap edits yet.
- No auth, billing, crisis, database, deployment, or runtime edits.
- Only document the canonicalization plan.

## Required Next Phase
Phase 102 may edit only the smallest safe footer/sitemap target after confirming exact file ownership.

## Verification Required Before Any Source Edit
- npm run build
- /healthz
- /readyz
- /api/health
- git status clean except intended files
