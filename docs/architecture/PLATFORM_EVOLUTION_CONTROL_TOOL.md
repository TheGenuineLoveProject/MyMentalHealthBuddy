# Platform Evolution Control Tool

## Purpose

The Platform Evolution Control Tool is the audit and governance layer for continuous MyMentalHealthBuddy platform refinement.

It may audit, scan, classify, score, report, prioritize, and recommend the next safest blocker.

## Non-Negotiable Boundary

The tool must not automatically mutate production code, database schema, authentication, payment logic, crisis resources, clinical or safety copy, user data, provider workflows, environment secrets, or Git state without explicit approval and green verification gates.

## Safe Evolution Loop

1. Audit.
2. Score.
3. Recommend one blocker.
4. Human approves exactly one patch.
5. Apply the smallest safe source change.
6. Verify gates.
7. Commit source-only.
8. Push after clean sync.
9. Stop.

## Permanent Command

node scripts/platform-evolution-audit.mjs

## Completion Standard

A component is complete only when it has canonical ownership, source contract, route/API contract, UI contract, safety boundary, build gate, runtime gate, regression gate, rollback path, completion record, no exposed stubs, no artifact pollution, no unrelated source drift, clean Git state, and remote sync confirmed.

## Governance Interpretation

The tool may surface high-risk platform findings automatically.

The tool must not automatically fix those findings.

Every finding must be handled as one approved component, one source-only patch, one verification cycle, one commit, and one stop point.

## Platform Completion Scope

This tool supports completion of the full MyMentalHealthBuddy route surface, including structural routes, admin routes, healing tools, safety/legal pages, account systems, learning sections, hubs, community routes, AI-facing routes, pathways, blog routes, and production gates.

## Automation Boundary

Automatic evolution is permitted only as audit intelligence.

Automatic mutation is prohibited until a human explicitly approves the exact component, exact file set, exact smallest safe patch, and exact verification gates.
