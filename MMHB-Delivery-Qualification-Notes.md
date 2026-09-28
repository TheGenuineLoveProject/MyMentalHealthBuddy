# MMHB — G24 durable notification delivery qualification

Date: 2026-09-24. Project: MyMentalHealthBuddy only.

## Confirmed current state

G23 user-supplied output reports two baseline controls reproduced repeated direct-email invocations, 30/30 candidate HTTP/PostgreSQL checks passed, the disposable database stopped and repository source/package state was preserved. Candidate hash: `071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08`. Evidence is `/home/runner/mmhb-webhook-transaction.9cBDdT`.

The current application still uses the earlier repaired webhook and email service. The new transaction route is a qualified isolated candidate. No production activation, CI or deployment has been established by these results.

## Bounded repair unit

ISSUE_ID: MMHB-BILLING-DURABLE-DELIVERY
Primary domain: data integrity / billing notifications.
Affected domains: database, API, privacy, operations.
Root cause: a provider can accept a notification before the local receipt is saved; retry without a stable provider request identity can repeat the notification. G23 prevents direct email effects in the proposed webhook but leaves a durable intent requiring a delivery consumer.
Authorized scope: prepare and qualify a delivery component and draft delivery-state schema outside authoritative source, using synthetic database and mocked provider traffic.
Forbidden scope for this command: production source activation, live migrations, production database access, real email sends, credential changes, dependency upgrades, commit, push, deployment.

## Candidate behavior

Persist the complete request body, body hash, stable idempotency key and opaque provider binding before any send. Hold short database transactions for claims; perform network work after commit. Fenced leases prevent an obsolete worker from overwriting a newer claim. Preserve the first attempt timestamp through every retry and restart.

Retry transient and ambiguous outcomes with the same saved body and key. Route permanent errors, exhausted attempts and expired retry horizon to manual reconciliation. Resend documents 24-hour idempotency retention; the proposed operational retry cutoff is 23 hours, leaving a margin. This is a bounded duplicate-suppression policy, not an unlimited exactly-once guarantee.

Sources: https://resend.com/docs/dashboard/emails/idempotency-keys and https://www.postgresql.org/docs/16/sql-select.html .

## Evidence limits

The next shell command uses real installed PostgreSQL and pg and the installed Resend SDK with a stateful mocked fetch endpoint. The simulated provider caches request keys and bodies to test the local retry protocol. Provider-side behavior is represented by that fixture, not tested against live Resend.

The scope identifier is synthetic. The eventual production adapter must bind it to the actual account or a credential fingerprint that refuses silent credential rotation. A descriptive account label alone is insufficient.

Timeout means acceptance is uncertain. Abort requests do not prove provider rejection. Real SDK cancellation propagation and production connector timeout handling remain adapter qualification work.

Production templates, verified sender identity, connector binding, runtime scheduling, operational alerts/reconciliation, production migration and combined activation remain pending. Existing email content includes another project's branding; record this for the MMHB template integration gate rather than changing unrelated service functions in this unit.

## Local preparation validation

Node and shell syntax checks passed. Fifteen local scripted-pool control-flow checks passed; these exercise guards, response classification and transaction failure paths with simulated dependencies. Five runner controls passed with mocked PostgreSQL binaries and a mocked child report: success, candidate failure, partial startup cleanup, source drift and prior candidate hash drift. None are real PostgreSQL or SDK integration results.

The Replit command requires one baseline control and 24 candidate checks, including lost provider response after acceptance and database receipt-write failure. The synthetic provider counts exactly one acceptance when the same saved request/key is retried. Database fixtures use a non-superuser role; age/tampering simulations are performed only by the isolated fixture owner. Production grants and migrations are not inferred safe from these fixtures. The production application role must not be able to delete or truncate delivery records and silently restart their retry history.

Candidate component SHA-256: `f57d672bebc870c6f3285e16525a7af64de16304fce6a63d5acc4b76dac30ef1`. Draft schema SHA-256: `49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f`.

## Run and review

Copy the full shell command into the MMHB Replit Shell. It needs the G23 directory already confirmed by your output, not an uploaded helper. Keep the generated evidence directory. Return output from COMMAND_ID through REPORT_END.

A successful command qualifies this component in isolation only. Release remains unqualified until integration, required application regression gates, CI, deployment and production checks pass.

## Readiness and time

Transaction component: QUALIFIED IN ISOLATION (G22, 16/16).
Webhook integration candidate: QUALIFIED IN ISOLATION (G23, 30/30 plus two baseline controls).
Delivery component: PREPARED; Replit qualification pending.
Production billing integration: BLOCKED on delivery adapter, migration and activation gates.
Platform release: PARTIAL; full-app, CI and deployment evidence pending.

The focused command should take minutes under normal conditions. Total platform percentage and remaining hours are unknown from the available scoped evidence; no completion estimate is being presented as measured.
