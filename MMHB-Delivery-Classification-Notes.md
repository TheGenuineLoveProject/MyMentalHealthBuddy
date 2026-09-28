# MMHB G25: delivery classification correction

Prepared 2026-09-24. Scope: MyMentalHealthBuddy only.

## Confirmed result supplied by the user

G24 ran 24 delivery checks and passed 23. Only `provider_422` failed: the component returned `retry` when the test required `manual`. G24 reported its disposable database stopped, source preserved, no real emails sent, and no production activation. This is a failed qualification, not a release approval.

The failed fixture used HTTP 422 and an error body named `validation_error`, without a numeric `statusCode`. The existing classifier explicitly recognized several provider error names but omitted `validation_error`; without a numeric status it fell through to the ambiguous/retry case.

## Exact proposed change

Add only `validation_error` to the existing list of errors requiring manual intervention. Here `manual` means automatic retries stop so the rejected request or configuration can be corrected. It does not mean the email was accepted.

The candidate is written only to a new evidence directory. The authoritative application files remain unchanged. The original 24-test harness and both SQL fixtures are copied byte-for-byte and checked against their prepared SHA-256 hashes. The original failed G24 evidence remains in place.

The candidate SHA-256 is:
`39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25`

## What the shell command will do

1. Check the MMHB project, branch, HEAD, source hashes, prior evidence, dependency versions, and available PostgreSQL binaries.
2. Apply the one-name change to a private copy and syntax-check it.
3. Run six mocked-fetch cases through the installed Resend 6.24.0 SDK, then through the actual baseline and candidate `completeDelivery` functions with a scripted pool. Cases cover statusless validation, validation with numeric status, required-field rejection, rate limiting, service unavailability, and a network exception.
4. Require the observed statusless baseline to retry and the candidate to require manual intervention. If the installed SDK behaves differently, stop before database initialization.
5. Create a new private Unix-socket PostgreSQL cluster using synthetic data and rerun the original, unchanged 24-test delivery harness.
6. Stop and verify the disposable database, check checkout preservation, and save results. No production database is opened and no worker is activated.

The statusless validation case is adversarial. It does not establish that live Resend normally omits numeric status information. The installed SDK's actual behavior remains to be established by this command. The official error reference is https://resend.com/docs/api-reference/errors.

## Validation completed while preparing G25

- Shell and Node syntax checks passed.
- Six local wrapper controls passed: mocked success, candidate test failure, partial database-start cleanup, source drift, prior-artifact hash drift, and SDK-probe failure before database initialization.
- The wrapper tests used mocked child processes; they are not PostgreSQL or installed-SDK qualification results.
- An independent classifier check reported 13/13 cases passing after the one-name change; it did not run the live provider or PostgreSQL.

The Replit SDK probe and PostgreSQL rerun have not been executed by this preparation session.

## Use

Paste the complete contents of `MMHB-Requalify-Delivery-Classification.sh` into Replit Shell. No helper upload or Replit AI is required. Keep the application checkout unchanged while it runs. Return the full output from `COMMAND_ID` through `REPORT_END`, including any failure reason.

Success requires SDK checks 6/6, original delivery checks 24/24, database shutdown PASS, and source-preservation PASS. The success status is `DELIVERY_CLASSIFICATION_REPAIR_QUALIFIED_IN_ISOLATION`.

## Remaining release work

Even a successful G25 leaves template and connector integration, operational worker wiring, migration and permissions review, combined webhook/delivery qualification, full application tests, CI, and deployment validation pending. Earlier isolated transaction and webhook passes do not prove those steps complete. The overall platform completion percentage and remaining hours cannot be established from these targeted logs.

`RELEASE_QUALIFIED=false` remains correct.
