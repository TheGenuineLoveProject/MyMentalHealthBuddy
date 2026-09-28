# MMHB — G23 isolated webhook integration qualification

Prepared 2026-09-24 for MyMentalHealthBuddy only.

## Confirmed evidence

The supplied G22 output reports 16/16 transaction-component tests passed against disposable PostgreSQL, the autocommit partial-write control reproduced, the database stopped, and source/package files preserved. This establishes the isolated component result. It does not establish a live route integration or email delivery.

The preceding G21 output reports 22/22 billing-email acceptance tests using the installed Resend SDK with mocked fetch. Earlier historical typecheck, backend syntax and client build passed. Full-app qualification remains pending.

## What this command does

It verifies project identity, branch, reviewed HEAD, source hashes, installed dependency versions and the prior G22 evidence. It permits additional untracked user artifacts while preserving checkout state during the run.

It creates a candidate from the current webhook source in a new evidence directory outside the repository. The exact qualified G22 transaction component and draft intent-table DDL are reused after hash checks. It creates a fresh PostgreSQL cluster accepting connections only through a private Unix socket, with synthetic records and a non-superuser application role.

The candidate places the event marker, user updates and notification intents in a single transaction. Stripe checkout retrieval occurs before the transaction. All five business update sites use the transaction. Checkout and cancellation use UPDATE RETURNING for actual recipient data, removing the old nonexistent username reference. Observations run after commit and cannot turn a committed success into HTTP 500. Existing plan-mapping rules, including their fallback behavior, are preserved.

The HTTP harness uses installed Express, Stripe signature generation/verification, PostgreSQL, Drizzle, and the actual copied schema and mapping modules. Stripe retrieval, email, metrics, logging and alerts are simulated. The HTTP route is hosted on loopback for the test.

## Local command validation

Shell and Node syntax checks passed. Five wrapper controls passed using mocked PostgreSQL binaries and a mocked test worker: success, candidate-test failure cleanup, partial startup cleanup, source-drift rejection, and component-hash rejection before initialization. These are command-orchestration checks, not PostgreSQL integration results. Eight additional VM checks using simulated dependencies passed for the exact candidate: commit-before-response, commit rejection, recipient/name mapping, unmatched user, cancellation payload, historical duplicate, transaction duplicate, and conflicting marker. They also assert zero direct email calls. They do not exercise real Express, Drizzle, PostgreSQL, signature verification or a provider.

## Expected results, not yet obtained in Replit

- Two baseline controls reproduce repeated direct-email invocations after marker-write failure and concurrent delivery.
- Thirty candidate checks exercise signed raw-body requests, successful checkout and cancellation, duplicates, concurrency, permission failures, deferred commit failure, retries, missing or unmatched users, mapping and lifecycle behavior, and observation failure.
- Every candidate check also rejects direct email calls and observations executed inside the transaction.
- Successful cleanup reports DISPOSABLE_DATABASE_STOPPED=PASS.
- Successful qualification reports WEBHOOK_TRANSACTION_CANDIDATE_QUALIFIED_IN_ISOLATION.

Candidate SHA-256: `071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08`.

## Running

Copy the complete contents of MMHB-Qualify-Webhook-Transaction.sh into the Replit Shell for /home/runner/workspace. No upload, package installation, or Replit AI invocation is required. The command reuses files already confirmed by G22 at /home/runner/mmhb-atomic-billing.w5yyxu.

Return the full output from COMMAND_ID through REPORT_END. Keep the new evidence directory. Any failed check stops qualification and retains diagnostics; it does not replace source files.

## Remaining work

This command does not activate the candidate. A delivery worker and a reviewed production migration are still required before replacing the live webhook. Provider request persistence, idempotency, retry bounds, crash recovery and delivery reconciliation require their own qualification. Distinct or out-of-order Stripe events are a separate correctness boundary.

Then qualify the complete app, server packaging, migrations, CI and deployment configuration. A passing isolated test does not set releaseQualified to true. No commit, push, live migration, live database connection, real email or deployment is performed by this command.

Current overall completion percentage and remaining platform hours cannot be measured from these focused logs. The immediate next milestone is a qualified route-to-intent integration, followed by delivery-worker qualification and a reviewed activation change.
