# MyMentalHealthBuddy: G43 results and G44 fresh build

Prepared September 25, 2026. Scope: MyMentalHealthBuddy only.

G43 passed all 12 adapter tests and both negative controls in the supplied Replit log. It qualifies the staged billing adapter and its users-table readiness checks against a disposable PostgreSQL database. The database stopped, and source preservation passed. The candidate is still staged; these results do not establish a deployed, working full platform.

## Evidence and remaining gaps

| Area | Evidence | Limit |
| --- | --- | --- |
| G40 application integration | 10/10 scoped HTTP/PostgreSQL tests; server bundle graph passed | Staged billing application only; full server boot not run |
| G42 packaging | Baseline and candidate packaged successfully; each passed three detached native-runtime checks and the wrong-password control | Existing frontend assets; compatibility checked on the current host |
| G43 adapter | 12/12 tests, two negative controls; bundle included 13 required candidate modules | Private database, mocked external delivery; production TLS not qualified |
| Application source | Preservation passed in the reported runs | Candidate source has not been applied |
| Deployment | None reported in this sequence | Release qualification remains false |

The G43 negative controls reproduced two important baseline defects: readiness could pass without the users table, and without the user-update permission needed by billing. The staged repair checks those prerequisites before starting the worker. This is a concrete improvement in readiness detection, not evidence that all application workflows have been tested.

G43 evidence: `.git/mmhb-review-evidence/billing-adapter-ca5T49` at reported HEAD `0e6c2b2b8d0d484aca1ae3de18a49ed75c9dc681`, branch `integration`.

## Run G44 next

File: `MMHB-Qualify-Fresh-Release-Build.sh`

SHA-256: `fcf1351a92bdf19ce99ad2b9ced25d6434bfe8547a1dcab1899f3e547a754b3a`

Upload that file unchanged to `/home/runner/workspace`, then use the checksum-and-log launcher supplied with it. There is no need to rerun G43.

G44 performs these tasks in a private candidate directory:

1. Verifies project identity, recorded G40/G43 evidence, source hashes, dependency versions, and the exact staged repair. It accepts descendant commits only when the inspected application inputs still match; it does not reset the checkout.
2. Copies tracked application inputs and complete public asset folders, including fonts, images, and icons. It excludes previous client build output and builds into a new empty output directory.
3. Runs TypeScript with its cache in the private directory, followed by four already-reviewed source contract checkers: authentication/session, safety, Stripe, and rate limiting.
4. Builds fresh frontend assets using the installed Vite and the pinned project configuration. Build children receive an explicit environment without deployment credentials or inherited `VITE_*` values. Public assets must match the fresh output by path, size, and hash.
5. Runs the reviewed production server builder against the G43 candidate. The packaged frontend must exactly match the fresh frontend manifest.
6. Copies the package into a detached directory and checks packaged bcrypt, fixed-time TOTP, and QR generation, including a wrong-password control. It verifies that package resolution stays inside the detached artifact.
7. Rechecks observed source, candidate input, dependency, and asset preservation, and saves a summary and logs.

The command uses existing installed dependencies. It does not install packages, run npm lifecycle hooks, connect to a database, send email, apply candidate source, activate the worker, or deploy. It requires at least 2 GiB of free space before staging.

## Why full npm test is not included yet

The remaining pretest, HealthKit, foundation, and PostgreSQL TLS scripts have not all been reviewed in their current form here. G44 captures their source and the actual package test chain for that review; it does not execute them. The four checks it does run are source-contract checks, not complete behavioral coverage or a security certification.

The full captured review is saved as `test-source-review.txt` in the new evidence directory. Console output may include only a bounded portion. The capture does not read environment files and applies best-effort redaction to source text; keep unredacted configuration and credentials private.

## Reading the result

Expected success status:

```text
STATUS=FRESH_CLIENT_AND_G43_PACKAGE_QUALIFIED_ON_CURRENT_HOST
OBSERVED_SOURCE_AND_INPUT_PRESERVATION=PASS
CLIENT_BUILD_FRESHNESS=QUALIFIED_FOR_ISOLATED_BUILD
RELEASE_QUALIFIED=false
```

Return the complete console output, including any captured test source. A successful G44 establishes a fresh isolated build and package with the updated adapter. It still does not qualify deployment-specific frontend values, production TLS, full server startup, browser journeys, or worker activation.

If output disappears, recover the saved log instead of rerunning the gate:

```bash
(
cd /home/runner/workspace || exit 2
shopt -s nullglob
MMHB_LOGS=(.git/mmhb-review-evidence/g44-console.*.log)
if [ "${#MMHB_LOGS[@]}" -eq 0 ]; then
  printf 'NO_G44_CONSOLE_LOG_FOUND\n'
else
  tail -n 500 -- "${MMHB_LOGS[@]}"
fi
)
```

If the gate stops, return its reason and saved output. Preserve the evidence and current checkout. A missing result is not proof that a command never ran.

## Validation performed before delivery

The generated Bash and embedded Node runner passed syntax checks. Five synthetic frontend guard tests passed: success, alias escape rejection, public-directory escape rejection, pre-existing output rejection, and build failure. Three synthetic orchestration tests passed: success, frontend failure, and packaging failure. Each orchestration path preserved fixture source, HEAD, index, and checkout status; failure paths stayed stopped with release qualification false.

Those local controls use substitute compilers and runtime implementations. They test the runner's control flow and guards, not your actual TypeScript, Vite, native libraries, or application. Actual G44 qualification requires the Replit run.

## Completion state and subsequent work

Billing integration has progressed through component, schema, application, adapter, and packaging checks, but remains unapplied. The next evidence needed after G44 is review and execution of the remaining app tests in isolation, deployment configuration and TLS checks, full server startup and browser journeys, and a coordinated schema/source/worker rollout with rollback. The default-disabled billing runtime means source application and activation must be handled together deliberately.

The wider library, calendar, content creation, social scheduling, commerce, accessibility, and mental-health content work is not measured by these billing logs. An overall completion percentage or reliable remaining-hours estimate cannot be derived from them. Those features need an inventory and acceptance checks after the release path is established.

Technical references used for build behavior: [Vite JavaScript API](https://vite.dev/guide/api-javascript.html), [Vite shared options](https://vite.dev/config/shared-options.html), and [TypeScript build-information path](https://www.typescriptlang.org/tsconfig/tsBuildInfoFile.html).
