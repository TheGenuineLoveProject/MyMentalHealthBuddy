# MyMentalHealthBuddy — G30 application integration source inspection

September 24, 2026. Scope is MyMentalHealthBuddy only.

## Current evidence

The user reported G29 at `/home/runner/mmhb-worker-qualify.RLr1dH`: six worker checks and one negative control passed, disposable PostgreSQL stopped, and checkout preservation passed. Worker hash: `daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940`.

| Area | State |
|---|---|
| Combined billing pipeline | Qualified in isolation by G28 |
| Worker and scheduler candidate | Qualified in isolation by G29 |
| Application integration | Pending |
| Full application, CI and deployment | Not established by these component gates |
| Release | Unqualified |

## Why this inspection is necessary

Historical source captures show application shutdown calling `process.exit()` when the HTTP listener closes and forcing exit after five seconds. The worker needs its active email attempt and database completion to drain before process exit. The database client capture also lacks a statement timeout. Schema startup imports `connection.mjs`, while ordinary app code imports `client.mjs`; the current connection module, deployment configuration and migration entry points are not available in this environment.

These are integration seams to inspect, not assertions that the current deployed application has been tested or that a new repair has already been applied. A fresh read establishes the exact source and configuration for the integration patch.

## Command scope

The command checks the same project identity, branch, HEAD, tracked changes and package state as the successful G29 run. It verifies the qualified worker hash. It reads selected startup, shutdown, database, migration and deployment source, records hashes, and verifies that the inspected source and checkout remain unchanged.

It uses Node built-ins and read-only Git commands. It does not import app/database modules, execute package scripts, start a server, connect to a database, migrate a live schema, activate a worker, commit, push or deploy.

Captured material includes:

- Relevant package scripts and their referenced migration runners.
- App imports, webhook mounting, shutdown and listening sections.
- Database client, connection and TLS configuration.
- Replit startup/deployment/workflow configuration, excluding environment tables.
- Drizzle configuration and relevant canonical SQL excerpts.
- Migration/schema-runner inventory and canonical-schema generation source.

Where a file hash matches a complete source capture already available for review, the command records the match instead of printing that source again. Different files are printed as bounded excerpts. A truncation flag means the excerpt is incomplete, not that the remaining source was approved.

## Data handling and output limits

Environment files and database contents are not read. Common literal API credentials, database URLs, private keys, bearer tokens and credential query parameters are redacted before output. This is best-effort literal matching, not a proof that arbitrary source text contains no sensitive information. Redacted-view line numbers can differ from original source line numbers when multiline material was removed; hashes refer to original bytes.

Source output is limited to 900 lines, 60,000 characters overall and 1,000 characters per source line. Other output lines are capped at 8,192 characters and marked when clipped. Inspection reads individual files up to 4 MiB and refuses nonregular files or source paths resolving outside the project.

Evidence is retained under a new `/home/runner/mmhb-integration-source.*` directory: before/after state, inspected-file manifest and the redacted report. Application files are retained in place.

## Local validation

Final Node and shell syntax checks passed. Independent review found no application/database execution path. Three focused redaction cases passed. A real-Git synthetic fixture preserved tracked and untracked bytes, left app/migration execution sentinels absent, excluded environment tables, removed seeded credential literals and explicitly truncated an oversized source line. These tests validate the collector only; actual Replit inspection remains to be run.

## Next action

Paste the full shell artifact into the existing project's Replit Shell and return the full output. Expected completion markers:

`STATUS=INTEGRATION_SOURCE_CAPTURED_REVIEW_REQUIRED`

`SOURCE_PRESERVATION=PASS`

`RELEASE_QUALIFIED=false`

Use the resulting source and hashes to prepare the bounded application integration patch, including migration ownership, worker database configuration, startup and graceful shutdown. Do not infer deployment readiness from the successful component tests.

Shell SHA-256: `0618112c52d100f65d9e0848d3fdd9358b7f69efa9db556ce78d4b649f442831`
