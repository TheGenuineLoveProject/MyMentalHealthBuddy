# MMHB: corrected PostgreSQL qualification handoff

The previous inline compressed command was incomplete. The returned terminal output contains no database qualification result. This correction replaces the delivery method with two complete, readable Shell commands; it does not change the prepared qualification code or application source.

## Run in Replit Shell

1. Paste the entire contents of `MMHB-Step-1-Readable-Postgres.sh`. Wait for `TEST_HARNESS_READY` and the Shell prompt.
2. Paste the entire contents of `MMHB-Step-2-Readable-Postgres.sh`. It verifies both files and starts the qualification runner.
3. Return the full output from Step 2. If either command stops, return that output before continuing.

The inline commands are self-contained. No download, upload, Replit AI session, package installation, or production database credential is required. Both commands create their files outside the checkout. Existing files with different contents are preserved and cause a stop. The runner requires the previously reported evidence directories and exact reviewed source and dependency versions.

## Scope and expected evidence

The runner creates a disposable PostgreSQL cluster with synthetic data and a private Unix socket. It tests the original and repaired webhook routes using real PostgreSQL, Drizzle, Express, and Stripe signature verification. Stripe retrieval, email, metrics, and alerts use synthetic fixtures. It tests seven cases and, after all candidate cases pass, a controlled concurrent-delivery experiment.

The baseline must reproduce exactly three expected defects; its expected four passes out of seven are a control result, not a release pass. The candidate must pass all seven targeted cases. Repeated synthetic emails during retry or concurrency are recorded separately as release-blocking findings.

The commands do not start the full application, migrate the production schema, commit, push, or deploy. The runner attempts to stop its disposable database on normal completion and caught errors, verifies shutdown, and retains evidence. An abrupt process or machine termination can require separate cleanup.

## What is verified

The user's earlier reports remain the evidence for the applied webhook repair, 12/12 targeted HTTP fixture checks, TypeScript checking, 351 backend syntax checks, the temporary frontend build, and source preservation. These historical results have not been rerun by this delivery correction.

Locally verified for this correction:

- Both Shell commands pass Bash syntax checking.
- Embedded JavaScript reproduces the prepared qualification files byte for byte.
- Step 1 installs the exact harness.
- An altered paste is rejected without replacing the existing harness.
- Step 2 installs the exact runner and invokes it.
- In this environment, the runner rejects the absent Replit checkout before database startup.

Local delivery controls used redirected staging paths. They are not real database or application test results. Real PostgreSQL qualification remains pending in Replit. `RELEASE_QUALIFIED=false`.

## File integrity

| Prepared file | SHA-256 |
|---|---|
| `webhook-postgres.mjs` | `2517fbed61f585b103412a6a296086b0a2c0864dd6810e1dcd586ab66fa9fcb7` |
| `MMHB-Postgres-Qualification.cjs` | `38fb60319e9b8ec1623c9e660ae902882e976c163a7b6b57b3c73129c6aa5571` |

Both pasted commands check these hashes before installation or execution. Qualification remains command `MMHB-POSTGRES-QUALIFICATION-20260924-16`; this delivery correction is recorded separately as step 17.
