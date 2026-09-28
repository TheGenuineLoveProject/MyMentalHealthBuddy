# MyMentalHealthBuddy R16D verification

Prepared September 9, 2026. The Replit command has not yet run. This kit is a reproducible local verification record, not a release certificate.

The supplied R16C screenshot reports `ARCHIVE_INTEGRITY_INVALID` for the nested Tailwind `@emnapi/core` entry before npm started. The screenshot does not display the entry itself. The R16C helper rejects a synthetic valid bundled entry with the same path because it demands an independent SHA-512 digest. npm represents bundled contents using `inBundle:true`; they can be carried inside the parent archive without a separate resolved/integrity pair.

R16D corrects that assumption for one bounded case: the exact optional Tailwind wasm32 package excluded on the observed Linux x64 platform. Bundled members must be physically contained, marked, named correctly and reachable from declared bundled roots. Their archive fields must be absent. Versions, dependency maps, flags, link/shrinkwrap rules and the parent archive's SHA-512 remain checked. The parent and all contents must be absent from the resulting install. Independent packages retain their archive requirements. The original root lock is unchanged; only verified archive addresses change in the private copy.

Local results: 72 policy/filesystem cases, 52 registry/HTTPS cases and 32 complete-command cases passed (156 total). Node and Bash syntax also passed. The npm runner, 41 source/tool pins and 22 prompt-asset pins were preserved. Local Node was v24.19.0; Replit's required v24.13.0 is intentionally not substituted in the delivered command.

The tests use synthetic files, archive identities, metadata and HTTPS streams. The full-command suite adapts only known fixture identities/fault-injection seams and substitutes an inert npm CLI. It checks current-source preservation, staged lock immutability, retained/absent candidate handling, safe failure reporting and required bundle absence. No actual registry install, package code, application server, AI or database is exercised.

To reproduce after extracting the kit, from the extracted directory:

```bash
python source_review/build-locked-dependencies-command-r16d.py
node source_review/test-locked-dependency-policy-r16d.mjs
node source_review/test-registry-archive-repair-r16d.mjs
python source_review/test-locked-dependencies-r16d.py
bash -n MMHB-BUNDLE-AWARE-DEPENDENCIES-R16D.txt
node --check source_review/locked-dependencies-driver-r16d.mjs
```

These tests create disposable local fixtures. The actual Replit command requires its pinned project root, branch, HEAD, source bytes and runtime. Upload only the one-file command to Replit and use the SHA-256 invocation in the readiness ledger. A passing command creates a new private dependency stage; it does not replace active dependencies or build/deploy the platform.

On an unexpected current lock representation, the command stops with a structured gate and a bounded list of entries lacking integrity, including their bundled/optional/resolved-presence flags. No raw private URL or environment value is printed. Invalid independent archive integrity still fails. Unknown existing edits are preserved and reported.

The old R16C normalizer is included only to reproduce its failure. The old R16 policy is included for reviewing the bounded policy delta. R16C prefix/body files are generator inputs; their source/runtime identity requirements are retained. The current command, helper files and test results have hashes in `r16d-preparation-record.json` and `SHA256SUMS.txt`.

Primary references:

- https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/
- https://github.com/npm/cli/blob/latest/workspaces/arborist/lib/shrinkwrap.js
- https://github.com/tailwindlabs/tailwindcss/blob/main/crates/node/npm/wasm32-wasi/package.json

The upstream sources establish npm representation and Tailwind's bundle declarations. They do not establish the exact unseen Replit lock fields or production runtime behavior. The command checks its current pinned inputs on execution.
