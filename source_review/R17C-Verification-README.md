# R17C preservation diagnostic qualification

Command SHA-256: `244214493d285410fbf04c2410a8495b8c961c55634a67b98fc7e3409e2dd214`.

## Reproduction

From the extracted kit root, with Python 3, Node 24 and Git available:

```bash
python source_review/build-preservation-diagnostic-r17c.py
python source_review/test-r17c.py
```

The tests adapt only workspace/runtime identity constants and fixture hashes;
they execute the actual diagnostic. The seed executes real R17B control flow
with synthetic compiler/native packages and the actual prompt loader. Test
fixtures deliberately create exactly 42 historical differences, including two
beyond the prior report's 40-record summary limit. Test mutations are confined
to disposable synthetic fixtures. The diagnostic never restores them.

Qualification result: **22 workflow cases PASS**. Details are in
`r17c-diagnostic-fixture-results.json`. Real Replit R17C has not run here.

Independent review produced and resolved five findings: tolerate a failed current
snapshot without losing historical evidence; enforce exact retained package rows
and stage package identity; reject unknown identity fields; redact unfamiliar
recorded graph/package metadata; repeat observed retained-file identities.

The prior build/runtime source and tests are included for reproducibility. Their
older statuses are historical. Only the root R17C command is the current handoff.
Git enumeration semantics were checked against official documentation:
https://git-scm.com/docs/git-ls-files
https://git-scm.com/docs/git-check-ignore

Scope: metadata diagnostics. No assertion of actor attribution, restored
historical preservation, full ignored-file inventory, independent provenance,
application/database/browser/clinical behavior, backup or deployment success.
