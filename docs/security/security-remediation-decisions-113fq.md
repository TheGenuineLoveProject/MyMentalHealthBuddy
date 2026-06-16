# Security Remediation Decision Record — Phase 113FQ

## Status

This platform is operationally advanced, but security blocker reduction remains active.

Current verified snapshot:

- Build gate: PASS
- Route audit gate: PASS
- Platform Evolution audit gate: PASS
- Git drift gate before this record: PASS
- Security total: 23
- Critical: 0
- High: 2
- Moderate: 21
- Low: 0
- Direct security items: 3
- Direct item names: drizzle-kit,lighthouse,pm2
- High item names: drizzle-kit,esbuild

## Governing Rule

Do not use `npm audit fix --force`.

Do not accept npm audit recommendations when the recommendation:
- downgrades a currently installed package,
- mutates runtime process manager behavior without an explicit runtime plan,
- changes observability instrumentation without an isolated smoke plan,
- creates no measurable security reduction,
- causes route, build, runtime, or platform audit regression.

## Direct Item Decisions

### drizzle-kit

Decision: defer package change.

Reason:
- The audit recommendation points to an older drizzle-kit line than the installed version.
- A downgrade could destabilize schema, Drizzle tooling, migrations, and build assumptions.
- Prior verification showed no safe forward package change from the audit data.

Allowed next action:
- Monitor for a newer safe drizzle-kit release.
- Re-test only when the fix version is newer than the installed version and gates remain clean.

### lighthouse

Decision: defer package change.

Reason:
- Phase 113FP verified that the audit fix was not newer than the installed version.
- No package change was applied.
- Security total delta was zero.
- Build, route audit, platform audit, and no-drift gates passed.

Allowed next action:
- Recheck Lighthouse only after npm audit reports a newer safe fix version.
- Avoid forcing downgrade or major upgrade unless isolated and measurable.

### pm2

Decision: defer runtime process manager major upgrade until explicit PM2 runtime plan exists.

Reason:
- PM2 is a runtime/process-manager dependency.
- Major PM2 upgrade must not be tested by starting, deleting, saving, or mutating live process state.
- Any PM2 remediation must use a separate plan with controlled non-mutating checks first.

Allowed next action:
- Create PM2 runtime-process-manager plan.
- Test only package metadata and non-mutating CLI checks before any runtime process interaction.

### OpenTelemetry / observability chain

Decision: isolate before mutation.

Reason:
- OpenTelemetry packages are observability infrastructure.
- Major upgrades must not be bundled with unrelated security fixes.
- Changes must be tested through observability-only smoke checks after runtime health is stable.

Allowed next action:
- Create isolated OpenTelemetry remediation plan.
- Verify server boot, health endpoints, logs, tracing imports, and no route regressions.

## Platform Rule Moving Forward

Security remediation must proceed in this order:

1. Preserve current operational runtime.
2. Keep build and route gates passing.
3. Avoid forced package downgrades.
4. Avoid broad dependency mutation.
5. Remediate one owner chain at a time.
6. Commit only after build, route audit, platform audit, and no-drift gates pass.

## Next Recommended Action

Create the PM2 runtime-process-manager major-upgrade decision plan without mutating runtime processes.

