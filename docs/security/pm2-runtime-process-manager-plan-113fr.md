# Phase 113FR — PM2 Runtime Process Manager Security Plan

## Decision

Do not upgrade PM2 blindly.

PM2 is a runtime/process-manager dependency. A major upgrade can change process behavior, daemon behavior, logs, startup behavior, and deployment assumptions.

## Current Governance Rule

No PM2 major upgrade may be applied until there is a dedicated runtime process-manager smoke plan.

## Forbidden Without Explicit Runtime Plan

- Do not run `npm audit fix --force`.
- Do not run `pm2 start`.
- Do not run `pm2 delete`.
- Do not run `pm2 save`.
- Do not run `pm2 startup`.
- Do not mutate live process state during security classification.

## Allowed Next Step

Create an isolated PM2 compatibility smoke script that checks only:

- package version
- package-lock consistency
- CLI help/version availability
- build gate
- route audit gate
- platform evolution audit gate
- no git drift gate

## Required Before Any PM2 Package Change

1. Confirm current runtime health aliases pass.
2. Confirm current page route smoke passes.
3. Confirm current build passes.
4. Confirm route registry audit passes.
5. Confirm Platform Evolution audit passes.
6. Confirm the PM2 package change actually reduces local audit risk.
7. Confirm no runtime process mutation occurred.

## Status

PM2 remediation is deferred until a non-mutating compatibility smoke phase is executed.
