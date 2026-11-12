# Dependency audit report validation

Run the dependency-free CLI regressions with Node 24:

```sh
node --test scripts/security/ci-production-audit-gate.test.mjs
```

CI runs these regressions before dependency installation. The production audit
gate still runs after `npm ci`:

```sh
node scripts/security/ci-production-audit-gate.mjs
```

For an already captured npm audit report:

```sh
node scripts/security/ci-production-audit-gate.mjs --audit-json /path/to/audit.json
```

The gate requires npm's version 2 JSON report, a findings object, valid severity
and causal-entry fields, and metadata counts consistent with those findings.
Reports containing an npm error, unknown format, missing data, or contradictory
counts are denied. Each finding must be at least as severe as its direct
advisories. Referenced packages may carry additional unrelated advisories, so
their aggregate severities are not required to match their dependents.

The existing high/critical threshold and narrowly scoped router advisory
exception remain unchanged. `ALLOW` means this audit policy passed; it does not
mean there are no lower-severity findings, prove the report is fresh, or qualify
the application for production. Fixture tests exercise the report parser and
policy, not a live registry, installation, full application, or deployment.

Report format references: [npm audit serialization](https://github.com/npm/cli/blob/latest/workspaces/arborist/lib/audit-report.js)
and [per-package advisory aggregation](https://github.com/npm/cli/blob/latest/workspaces/arborist/lib/vuln.js).
