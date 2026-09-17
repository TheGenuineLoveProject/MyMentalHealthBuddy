# MMHB refresh-family source integration review

Run only MMHB_REFRESH_FAMILY_INTEGRATE.py --apply in the recorded Replit workspace,
after verifying its SHA-256 from the accompanying response. It requires the actual
SQL and adapter results JSON files already produced there. This package contains
no substitute reports for those real qualification runs.

The helper preserves the qualified SQL and adapter byte-for-byte. It adds a
service facade, committed boundary/wiring tests, a reviewed source-verifier update,
and cutover documentation. It does not run PostgreSQL, install packages, load the
app database client, perform a database migration, push, or deploy.

No live activation is authorized: review proposed/docs/security/refresh-family-cutover.md.
The SQL remains explicitly qualification-only pending a target-specific transition.

Reproduce local helper fixtures with:
    python3 test-integration-helper.py
    python3 test-verifier-mutations.py
These commands make only disposable temporary Git repositories. Synthetic account
and schema-generator sentinels and synthetic proof documents are used solely in
those temporary fixtures. They are NOT MMHB database qualification results.
The test script adjusts only its in-memory test module's expected fixture hashes;
the supplied production helper and embedded production hashes are never rewritten.

For the dedicated source gate, the facade test uses Node VM modules with an
experimental test-process flag. No VM-module flag is required by the application.
Tests recorded here ran under Node 22.16.0; the Replit helper enforces Node 24.
Full npm test, live schema/grant/cutover checks, routing/browser integration and
fresh release builds have not been completed by this source packaging step.
