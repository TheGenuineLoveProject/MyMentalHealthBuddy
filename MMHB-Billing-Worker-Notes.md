# MyMentalHealthBuddy — G29 billing worker and scheduler

Prepared September 24, 2026. The latest user-reported G28 run at `/home/runner/mmhb-pipeline-qualify.zVPMvv` passed all 12 combined pipeline checks and its negative control, stopped its disposable database, and preserved the checkout. That is isolated qualification, not deployed behavior.

## Bounded issue

ISSUE_ID: MMHB-BILLING-WORKER-29

Primary domain: platform/worker. Affected domains: database, billing, privacy, observability, testing.

The pipeline components are qualified, but the application has no integrated worker that periodically prepares and dispatches the candidate notification queue. This step builds and qualifies that worker as a separate candidate. It does not replace the authoritative route or activate a live schedule.

The candidate adds one dependency-injected module, without a new package or schema. Constructor dependencies are the qualified renderer, delivery functions, transport connector and a database pool. Construction is inert. The caller explicitly starts and stops the worker.

## Candidate behavior

- Default polling interval: 15 seconds after the previous cycle finishes.
- Default budgets: scan at most 10 unprepared intents and dispatch at most 5 deliveries per cycle.
- A single worker instance coalesces overlapping calls. The existing delivery component coordinates distinct instances through database claims.
- Only intents without saved delivery rows are rendered and prepared. Saved requests keep their original body, key and provider scope.
- A keyset cursor moves past invalid inputs and wraps. A captured upper key prevents newly arriving higher keys from continually extending the same sweep. It is not a proof of finite completion under unlimited arrival of intermediate keys, and the cursor is process-local.
- Rendering failure reports a partial cycle and does not prevent dispatch of an already prepared delivery. Infrastructure failures report an error stage and can recover on a later cycle.
- Each cycle uses one transport snapshot. Rotation does not silently move old deliveries to a new credential scope.
- Reports contain aggregate counts and fixed stages/statuses, not recipient names, addresses, bodies, credential values, or raw exception strings.
- Stop cancels a queued timer, aborts an outstanding connector request and prevents new operations. An email attempt already in progress is allowed to persist its result before stop resolves.

## Evidence available now

| Check | Result | Scope |
|---|---|---|
| G28 combined pipeline | User reported 12/12 plus one control passed | Real private PostgreSQL, SDKs, mocked external services |
| G29 lifecycle checks | 8/8 passed locally | Injected DB/transport plus an actual Node timer; Node v24.19.0 |
| G29 runner controls | 5/5 passed locally | Mocked child/PG process controls; not database qualification |
| G29 independent source review | Completed | Worker and qualification harness |
| G29 shell and Node syntax | Passed | Final command |
| G29 PostgreSQL worker checks | Awaiting Replit execution | Six checks plus one negative control |
| Application integration / activation | Pending | No authoritative source writes |
| Full application / CI / deployment | Pending | Release remains unqualified |

Eight local lifecycle checks cover inert construction and bounds, concurrent-call coalescing, connector failure recovery, permanent stop while connecting, active dispatch draining, observer-failure containment, default Node timer operation, and scheduling failure.

Five runner controls cover success, rejection of failed tests with cleanup, partial-start cleanup, source-drift detection and prior-artifact hash-drift refusal before database initialization.

## Replit qualification

Paste the complete shell artifact into the existing project's Replit Shell. It reuses five unchanged files from the successful G28 evidence directory. It checks the current project, branch, HEAD, reviewed source, package state and artifact hashes. It writes the candidate and evidence to a new private directory, then starts a private Unix-socket PostgreSQL cluster with synthetic data and a restricted delivery role.

The actual installed `pg` and Resend SDK are used. Connector and provider HTTP calls are mocked. Scheduler callbacks are driven deterministically; they must themselves start the work. No additional manual tick rescues a broken scheduler.

The negative control demonstrates that a deliberately naive re-render of an already-frozen retry is rejected. It is a simulated bad orchestration pattern, not a claim about a historical production worker.

Six candidate checks:

1. Scheduled callbacks deliver a committed intent and rearm without repeating an accepted request.
2. Bounded scans progress past an invalid intent, dispatch existing ready work, and reach a newly inserted earlier key after wrap.
3. Overlapping cycles share one operation.
4. A restarted worker retries the saved request without rendering it again.
5. Credential rotation leaves old-scope work unchanged and reports its backlog without exposing personal or credential data.
6. Stop drains an in-flight send and prevents the next delivery and timer cycle.

Expected passing output:

`WORKER_RESULT={"tests":6,"pass":6,"failed":[]}`

`STATUS=BILLING_WORKER_AND_SCHEDULER_QUALIFIED_IN_ISOLATION`

`DISPOSABLE_DATABASE_STOPPED=PASS`

`TRACKED_SOURCE_AND_PACKAGE_FILES_PRESERVATION=PASS`

`RELEASE_QUALIFIED=false`

Return the full output. Failed assertions and evidence remain intact. Do not bypass a hash or identity mismatch.

## Remaining integration limits

G29 does not create application startup wiring, production process signal handlers, database migrations, production roles, sender verification, a dashboard, or a deployed scheduler. Those remain the next integration work. The database pool must have bounded connection and statement durations; a graceful drain cannot guarantee a wall-clock stop if an injected database operation hangs indefinitely.

Malformed inputs remain unprepared and visible through counts; there is no durable quarantine table in this bounded change. Credential-scope mismatch and manual-review backlog require operational handling during integration. Queue aggregation cost should be measured at representative production volume. Provider acceptance is not inbox delivery, and the unchanged delivery component's retry window does not imply unbounded exactly-once semantics.

Prior core tests are not repeated wholesale: G28 already covers the route-to-intent handoff, and G25–G27 qualify the unchanged delivery, transport and renderer. Frontend, authentication, clinical-content, accessibility and full-app gates are outside this isolated worker step and remain release work where applicable.

Rollback for this qualification is to leave the inactive candidate unused; it changes no application source, live schema or deployment. The disposable database must report stopped. New evidence is retained for review.

No platform-wide completion percentage or reliable remaining-hours estimate is established by this billing subsystem gate.

Worker SHA-256: `daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940`

Shell SHA-256: `e0b2065a401674b80f3e7bbb74297103527eb507f11b84c30c0d252a5416cc10`
