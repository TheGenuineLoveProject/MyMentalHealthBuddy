# MMHB G26 — credential-bound email transport

Prepared September 24, 2026. Scope: MyMentalHealthBuddy only.

## Current evidence

The user supplied successful G25 output from `/home/runner/mmhb-delivery-classify.ipBScd`: installed Resend 6.24.0 classification probe 6/6, unchanged PostgreSQL delivery suite 24/24, disposable database stopped PASS, source preservation PASS. The delivery component is qualified in isolation. It has not been integrated into the application or deployed. Overall platform completion and remaining engineering hours cannot be measured from these targeted results.

## Bounded issue

ISSUE_ID: MMHB-BILLING-TRANSPORT-SNAPSHOT

Primary domain: billing notification reliability. Affected domains: privacy, API integration, operations.

The inspected `server/services/email.mjs` stores connector settings in a mutable module-level variable. Its client helper awaits a credential lookup and then reads the sender from that shared variable. Concurrent calls can pair the first request's API key with the second request's sender. The connector also parses responses without first requiring HTTP success. Both behaviors were reproduced locally using synthetic fixtures against the exact inspected email source.

Expected behavior: each delivery transport holds one immutable key/sender snapshot, preserves the queued request and idempotency key, rejects failed or malformed connector responses, and propagates cancellation to the installed SDK request.

The candidate is a separate module in a new evidence directory. No application source, migration, package, credentials, or live worker is changed by G26.

## Candidate

`billingEmailTransport.mjs`

SHA-256: `c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4`

- Uses local credentials and sender, without shared mutable connector state.
- Requires one valid connector record and a successful, nonredirected response.
- Fixes the provider API endpoint to `https://api.resend.com`.
- Binds a private SHA-256 scope to provider endpoint, credential, and sender. Key or sender rotation changes the scope; an existing context does not silently switch identities.
- Preserves the queued body and exact MMHB idempotency key.
- Preserves provider error name/status, and treats missing message IDs as ambiguous failures.
- Bounds connector fetching and JSON reading with a 10-second deadline.
- Propagates the supplied abort signal to the SDK send options.

The hostname argument must eventually come from trusted Replit configuration, never an HTTP/user input. DNS syntax validation alone is not hostname authorization. The sender must separately be verified and approved for MMHB before activation. `send()` relies on G25 to supply the already-frozen request body; G26 does not itself freeze arbitrary objects. Credential fingerprints are internal identifiers, not authentication credentials or proof of provider domain verification.

## Qualification command

Paste the complete `MMHB-Qualify-Credential-Bound-Transport.sh` into Replit Shell. No upload, package installation, or Replit AI is required. The command reuses the successful G25 evidence, checks the installed SDK entry hash, creates a private evidence directory, and runs two baseline controls plus 20 candidate checks.

Checks cover credential snapshots, concurrent resolution, identity fallback, scope stability and rotation, connector failures and malformed input, redirects, immutable retry inputs, sender/key mismatch, provider result mapping, pre-aborted operations, actual SDK abort propagation, connector timeout, and provider endpoint override prevention.

All connector/provider HTTP traffic is intercepted with synthetic fixtures. No live connector is called, no production credentials are obtained, no database is opened, and no real emails are sent.

Expected success:

- Two baseline controls reproduced.
- TRANSPORT_RESULT: tests 20, pass 20, failed [].
- Source and package preservation PASS.
- STATUS=CREDENTIAL_BOUND_TRANSPORT_QUALIFIED_IN_ISOLATION.
- RELEASE_QUALIFIED=false.

Return all output from COMMAND_ID through REPORT_END. Failure preserves evidence and stops the qualification.

## Validation completed here

- Bash and Node syntax checks passed.
- Two baseline controls and 20 candidate checks passed locally with a stand-in SDK. This validates the component and fixture protocol, not the actual Resend 6.24.0 implementation.
- Four wrapper controls passed: success, failed candidate checks, source drift, and G25 artifact hash drift. These used mocked child results.
- Independent source review found no additional blocking defect within this bounded transport scope.

The actual installed-SDK qualification remains for the Replit run. No claim of live provider delivery is made.

## Remaining integration boundaries

MMHB billing templates are next. The existing billing functions use another project's branding and links, interpolate user-provided names without HTML escaping, and make plan/access statements that do not match all prepared transaction behavior. Those functions will not be reused as the durable delivery transport. Content corrections remain a separate bounded unit.

Application wiring, frozen-body construction, worker scheduling, provider identity verification, migration/permissions review, combined webhook/delivery tests, full application testing, CI, rollback qualification, and deployment verification remain pending. G26 is not a release approval.

Reference: [Resend idempotency documentation](https://resend.com/docs/dashboard/emails/idempotency-keys). The request body and key must remain consistent for retries; aborting a client request does not prove the provider rejected it. G25's bounded retry and reconciliation limits still apply.
