# MMHB atomic billing qualification — step 22

## Confirmed handoff

The user's completed step 21 reports the billing-email response repair applied to `server/services/email.mjs`, 22/22 acceptance tests passing with installed Resend 6.24.0 and Node v24.13.0, mocked HTTP transport, preserved request payloads and preserved webhook source. The recorded evidence directory is `/home/runner/mmhb-billing-acceptance.wm2hKv`. No real email, database connection, commit, push or deployment was performed by that command.

This closes the local application/targeted qualification portion of the acceptance-reporting repair. It does not establish provider delivery, full application qualification, CI or deployed behavior. The current webhook still initiates email independently of its final event marker and does not act on the returned failure object. Its duplicate-delivery findings remain open.

## Bounded next unit

Issue: MMHB-BILLING-ATOMICITY-22. Domains: billing reliability and database integrity. Expected behavior: one transaction commits the event marker, associated entitlement update and durable notification intent; a failure rolls them all back. Concurrent deliveries of the same event must produce one committed business operation and one duplicate response. A waiting retry must become the winner if the first transaction rolls back.

The attached Shell command creates a **candidate component and qualification harness outside the repository**, then initializes a new disposable PostgreSQL cluster on a private Unix socket with synthetic credentials and records. It does not apply a live migration or replace the webhook. All application database writes remain zero. It preserves the two existing source repairs.

The candidate exposes `processBillingEvent(database,event,apply)`. It claims an event using `INSERT ... ON CONFLICT (id) DO NOTHING RETURNING id`. A losing claim performs a separate SELECT and requires the same event type and a processed marker. The separate statement is necessary for a fresh READ COMMITTED snapshot after a concurrent conflict. Historical processed markers stay duplicates and do not retroactively create notification intents.

Only the winning transaction calls `apply(tx,enqueue)`. Callers must use the supplied transaction for all associated database writes and await every enqueue operation. The helper cannot prevent a caller from incorrectly writing through a different database object or starting detached promises; later route integration must prove those properties.

The candidate intent table has a unique `(event_id,kind,user_id)` identity, an event foreign key with ON DELETE RESTRICT, a versioned semantic payload and a creation timestamp. It stores necessary recipient/template variables, not complete raw Stripe events. This is an isolated draft schema, not a reviewed production migration. Retention, account deletion and canonical schema generation must be settled before application. The recipient user identifier intentionally has no user foreign key pending that deletion-policy review.

The component SHA-256 is `f8a9fce70124b55d5197cdfed53be393cbd098b80cafb607b352c4a101f9db60`.

## Qualification design

The harness uses the installed pg and Drizzle packages plus an exact, reviewed copy of the existing shared schema. It connects only to the fresh private cluster and validates the cluster's data directory, local-only listener and owner before creating fixture tables. Tests run through a nonsuperuser application role. A negative control demonstrates an observable partial update under autocommit; it is a deliberately constructed control, not a rerun of the actual webhook baseline.

The existing real-webhook baseline evidence remains the earlier seven-case PostgreSQL qualification and its recorded duplicate-attempt observations. This command tests the new component in isolation and does not replace those route tests.

Sixteen candidate tests:

1. Atomic success with exact persisted payload.
2. Sequential replay without another business callback.
3. Independent event IDs remain independent.
4. Duplicate intent insertion raises a uniqueness error and rolls back every write.
5. Cancellation intent retains its kind and period end.
6. Event-claim INSERT permission failure.
7. Event-claim SELECT permission failure.
8. Entitlement UPDATE permission failure.
9. Notification-intent INSERT permission failure.
10. Callback throws after writing entitlement and intent.
11. Deferred constraint failure during COMMIT.
12. Historical processed marker creates no new intent.
13. Existing marker has a different event type.
14. Existing marker is not processed.
15. Concurrent loser waits for winner commit and becomes a duplicate.
16. Concurrent loser waits for winner rollback and then commits the complete operation.

The race tests observe PostgreSQL lock waits and check committed state from another connection while the first transaction is held. They do not require both callbacks to cross a barrier after the unique claim, which would deadlock the intended serialization.

## What has been checked here

JavaScript and Shell syntax passed. An independent review found no blocking transaction/Drizzle semantic issue. Local wrapper fixtures passed for normal completion, candidate failure, failed database startup with cleanup, and source drift detection. Those wrapper fixtures simulate PostgreSQL commands and test results; **they are not evidence that the sixteen database tests passed**. This environment does not contain PostgreSQL or Replit's application dependencies. Real PostgreSQL qualification awaits the user's command output.

## How to run

Paste the entire command into the same MMHB Replit Shell. It includes the candidate and harness, so there is no separate file to upload. It checks project identity, branch, HEAD, both applied repair hashes, shared-schema hash and reviewed database dependency versions first. It keeps the Git index, tracked diff, package/lockfile and untracked filename list under before/after checks.

Successful output must include all of:

- `CONTROL=AUTOCOMMIT_PARTIAL_WRITE_REPRODUCED`
- `TRANSACTION_RESULT` with sixteen tests, sixteen passes and no failures
- `DISPOSABLE_DATABASE_STOPPED=PASS`
- `TRACKED_SOURCE_AND_PACKAGE_FILES_PRESERVATION=PASS`
- `STATUS=TRANSACTION_COMPONENT_QUALIFIED_IN_ISOLATION`

Return the complete output from COMMAND_ID to REPORT_END, including any STOP or diagnostic lines. Keep the generated evidence directory. Do not infer a pass from syntax checks alone.

## Gates still open

Even a 16/16 result is **not a complete duplicate-email repair**. Remaining work includes:

- Integrate the component into every relevant webhook branch, with Stripe retrieval outside the transaction and no direct email delivery from the callback.
- Use actual updated user rows to create notification intent; resolve the current cancellation `users.username` reference and no-matched-user notification behavior in that integration.
- Freeze the complete provider payload, verified sender/account binding and stable idempotency key before the first possible send.
- Implement dispatch leases, recovery after process termination, bounded retries, ambiguous-result reconciliation, and safe handling beyond Resend's 24-hour deduplication window.
- Qualify the actual route, migration, dispatcher, rollback, runtime and full application. Same-event deduplication does not solve different Stripe events arriving out of order.
- Complete CI, deployment and production verification.

No overall completion percentage or total remaining-hour estimate is established by this evidence. The content library, calendar assistant and broader feature requests remain queued behind the release baseline.

Primary references: https://orm.drizzle.team/docs/transactions ; https://www.postgresql.org/docs/16/sql-insert.html ; https://resend.com/docs/dashboard/emails/idempotency-keys
