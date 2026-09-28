MyMentalHealthBuddy — G42 results and G43 adapter readiness

Prepared 2026-09-25 UTC. Scope: MyMentalHealthBuddy only.

**G42 result: passed twice on the current Replit host**

Both supplied console logs contain complete successful runs, not an unfinished process. Each run built and checked the baseline and candidate production packages. Each package passed bcrypt hashing/comparison, fixed-time TOTP, and QR SVG generation using its packaged dependencies. The wrong-password control also passed. Source preservation passed in both runs.

| Run | Evidence directory | Detached artifact directory |
| --- | --- | --- |
| Console `g42-console.3Cbr8a.log` | `.git/mmhb-review-evidence/billing-package-VvjR7D` | `/tmp/mmhb-package-4mn2P9` |
| Console `g42-console.CWdQgg.log` | `.git/mmhb-review-evidence/billing-package-hnYvec` | `/tmp/mmhb-package-9j24dx` |

Both report HEAD `0e6c2b2b8d0d484aca1ae3de18a49ed75c9dc681`, branch `integration`, 34 runtime packages, and 3,332,589 copied runtime dependency bytes per package. Each used 826 existing client asset files totaling 38,425,225 bytes. File names alone do not establish which run came first. Neither run needs repeating because its terminal output disappeared.

G42 qualifies packaging and those dependency checks on that host. It does not qualify fresh frontend assets, another deployment host, full server startup, complete application tests, or release readiness. No application source was applied, worker activated, live migration run, or deployment performed.

**Next bounded repair: users prerequisites in billing readiness**

Review of the staged G40 adapter confirms that it calls the billing schema manager before starting the worker. That manager checks the webhook marker and outbox schema, but omits the `users` columns and permissions needed by the webhook. G40 supplied a valid users fixture, so its passing result did not exercise missing users prerequisites. This is a source-confirmed omission; no claim is made that the live database currently lacks these prerequisites.

G43 retains the G40 candidate as a baseline and prepares a two-file staged repair:

| Staged file | Change |
| --- | --- |
| `server/db/billingUsersReadiness.mjs` | Inspect the seven relevant users columns and effective privileges in a bounded read-only catalog transaction. |
| `server/billing/createApplication.mjs` | Require the existing billing schema check and the new users check before creating and starting the worker. |

The columns are `id`, `email`, `name`, `stripe_customer_id`, `subscription_status`, `subscription_expires_at`, and `updated_at`. The helper checks their reviewed types and rejects an incompatible table shape, row-level security, missing columns, or generated columns that billing must update. SELECT is required for the four columns the handler reads; UPDATE is required for the four columns it writes. Effective column permissions recognize both whole-table and column-level grants. The helper does not read user records, grant privileges, install schema, or change data.

These are startup checks. They do not guarantee that privileges or schema cannot change after startup, or that every possible user-table trigger or constraint will permit every future billing operation.

**G43 execution and test scope**

The command verifies project identity, the current relevant source against G40, the candidate module hashes, qualified schema data, and installed dependency versions. It accepts later descendant commits only when the inspected application inputs still match. It stops on source conflicts and preserves existing work.

It copies the candidate into a new private evidence directory and adds the repair only to that copy. It recompiles the original and repaired server dependency graphs, then creates a new PostgreSQL 16.10 cluster with synthetic data. Network listening is disabled; only its private Unix socket is available. The harness verifies database identity and the actual node-postgres connection parser before fixture operations.

Twelve checks cover:

1. Disabled factory opens no active database and starts no worker.
2. Enabled factory remains idle until explicitly started.
3. Production mode rejects disabled TLS.
4. Missing outbox blocks startup without automatic installation.
5. Missing users table blocks readiness.
6. Missing required users column blocks readiness.
7. Missing users SELECT permission blocks readiness.
8. Missing users UPDATE permission blocks readiness.
9. Users row-level security blocks readiness.
10. An incompatible users column type blocks readiness.
11. The actual adapter connects to the private socket with the configured role and query bounds; exact column-level grants support readiness and a real Drizzle update with returned user fields.
12. The actual singleton and scheduler prepare a synthetic notification, wait for an in-flight provider response during shutdown, persist acceptance, leave later work pending, and close runtime database sessions.

Two baseline controls must reproduce the original omission: readiness succeeds without the users table or required UPDATE permission, followed by actual database rejection. A control failure prevents qualification.

The adapter, singleton, PostgreSQL driver, Drizzle, schema manager, template, worker, and Resend SDK are imported normally. No pool factory or scheduler is substituted. Only external connector and email HTTP responses are mocked; unexpected external fetch requests are rejected. No real email is sent.

The positive database path uses `NODE_ENV=test` and the private Unix socket with TLS disabled. It does not establish production TLS connectivity. The production-mode disabled-TLS rejection is a separate check. The full application is not started because its legacy initialization has broader effects.

**Local preparation evidence**

- Shell and Node syntax checks passed.
- Four helper catalog/transaction controls passed using mocked catalog results. These cover the required column privileges, incompatible metadata, read-only completion, repeated verification, and rollback/client cleanup.
- Three synthetic runner controls passed: success, adapter-test failure, and database-start failure after PID creation. They verified source, HEAD and index preservation, database cleanup, and retained release-pending status.
- Those runner controls substitute PostgreSQL binaries, the bundler, and harness output. They are not actual PostgreSQL or adapter qualification.
- Real G43 database and dependency results remain pending your Replit execution. No PostgreSQL server is available in this preparation environment.

**Run once with saved output**

Upload `MMHB-Qualify-Billing-Adapter.sh` unchanged to `/home/runner/workspace`, then use the checksum-verified launcher supplied in the chat.

SHA-256:

```text
c2350e8c3e3e0ebb523cd8e194572d2fd404381f36fccf191911b85ba8e72073
```

The command needs approximately 1 GiB free disk space as a conservative preflight requirement. Source copying is bounded at 256 MiB. It performs no dependency installation.

Expected successful end state:

```text
STATUS=BILLING_ADAPTER_AND_USERS_READINESS_QUALIFIED_IN_ISOLATION
DISPOSABLE_DATABASE_STOPPED=PASS
OBSERVED_SOURCE_AND_INPUT_PRESERVATION=PASS
RELEASE_QUALIFIED=false
REPORT_END=MMHB-BILLING-ADAPTER-QUALIFICATION-20260925-43
```

The result must also show 12/12 checks and both baseline controls passing. Return the complete output through REPORT_END and the launcher exit code. A STOPPED result requires inspection of the saved evidence, not automatic rerunning or removing guards.

Console output is saved as `.git/mmhb-review-evidence/g43-console.*.log`. Detailed results, source copies, manifests and logs are retained under `.git/mmhb-review-evidence/billing-adapter-*`. These local Git metadata files are not an off-project backup. Existing G40/G42 evidence is retained.

**Release work still outstanding**

Application source remains unapplied. The candidate is disabled by default; applying it without the coordinated schema/configuration activation plan would leave billing unavailable with retryable responses. Full application regression, a fresh client build, isolated full-server startup, target deployment/runtime compatibility, and the apply/migrate/activate/rollback plan remain open. G43 changes two staged modules, so G42's artifact hashes do not qualify the later repaired release artifact automatically.

The evidence does not support a whole-platform completion percentage or reliable remaining-hours estimate. Content libraries, calendars, and broader integrations remain queued behind release readiness.

Technical references used for the permission and TLS review:

- PostgreSQL 16 permission inquiry functions: https://www.postgresql.org/docs/16/functions-info.html#FUNCTIONS-INFO-ACCESS-TABLE
- node-postgres SSL configuration: https://node-postgres.com/features/ssl

