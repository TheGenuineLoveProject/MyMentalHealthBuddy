# MMHB R16C — registry-verified private dependency installation

## Actual evidence

The supplied R16B screenshots show ARCHIVE_URL_DIAGNOSTIC_COMPLETE_NOT_INSTALL, five selected observed files unchanged, and no npm/network/application activity. Visible AWS SDK entries fail scheme, registry-host and archive-path requirements. Raw URLs and aggregate totals are not available in the screenshots. R16A had previously stopped at the same archive policy for quick-lru. R15's old candidate is absent; this command does not need to reconstruct it.

## Repair contract

- Issue: REGISTRY-ARCHIVE-RELOCATION-001; release dependency preparation only.
- Causal owner: archive source addresses in the pinned current root lock.
- Require the same Replit root, integration HEAD, Node/platform, 41 selected pins and 22 post-R15 prompt asset pins used by R16A.
- Construct a private lock with changed resolved fields only. Preserve names, versions, integrity values, dependency maps and all other parsed lock data. Root package files remain byte-for-byte unchanged. Private formatting is serialized JSON, so the staged lock receives its own new hash.
- Validate the entire proposed tree using the unchanged R16 policy before network access. Preserve existing native/WASM/optional rules.
- Reject original credential-bearing, query/fragment-bearing, file, Git and malformed sources. Old HTTP(S) mirror addresses are observed only as hashes and never requested.
- Fetch exact public npm version metadata using built-in HTTPS. Fixed registry host, certificate verification, no credentials, no redirects, identity encoding. Compare package name, exact version, expected tarball and original SHA-512.
- If metadata lacks SHA-512 (or only has SHA-1), stream archive bytes and compare the unchanged locked SHA-512. Never replace or downgrade the locked digest. A mismatching SHA-512, wrong package or unavailable version prevents npm.
- Verify all changed sources, with at most four active requests, one retry on selected transient errors, 30-second request limits, ten-minute overall verification limit, two-MiB metadata/64-MiB archive bounds and a 512-MiB combined response limit. Progress is printed every 30 seconds. Completed safe receipts are retained; raw metadata bodies and arbitrary old URLs are not saved.
- Run the unchanged npm runner in a fresh private stage, using empty private npm configs, a minimal child environment and lifecycle scripts disabled. It has a fifteen-minute npm limit and a private bounded log.
- Inspect the installed names/versions, hidden lock and file tree against the normalized lock. Observe selected workspace inputs and Git state before/after. Do not replace active node_modules or rebuild/start/deploy the application.

## Qualification

47 tests exercise the actual archive helper, including whole-lock structure, URL-only changes, aliases/deduplication, integrity checks, wrong packages/digests, legacy archive hashing, fixed TLS host, redirect rejection, retries, stream bounds, malformed/incomplete responses, cancellation and both time limits. Transport responses are synthetic; timers are shortened only in the timeout fixtures.

26 workflow tests exercise the actual assembled driver with an inert npm CLI and synthetic HTTPS transport. They verify private-copy success, root-lock/source preservation, stopped installs for identity/integrity/404 errors, concurrent edit detection, preserved user edits, missing prior evidence, retained-candidate changes, installed-version mismatches, symlinks, Git ignore boundaries and report-write failure. The fixtures adapt root/Node/head/hash constants to disposable files and replace the external network/npm seams; production source invariants remain in the delivered command.

The original R16 policy and runner bytes are unchanged; their historical 49 policy and 15 runner fixture results are included for reference. No new run of those unchanged suites is claimed. Bash/Node syntax passes. Local Node v24.19.0 is not the Replit v24.13.0 qualification environment.

**No actual public registry lookup, Replit npm installation, application build, native tool execution, database/AI call or deployed acceptance occurred during preparation.** Those cannot be claimed from fixture passes.

## Run in Replit

Upload the TXT command without editing it. Finish active edits while preservation is observed. Paste:

```bash
cd /home/runner/workspace &&
printf '%s\n' '9248295ac4f8adb7b7393497970a19027722c45e92f66a9f0289e047340d183b  MMHB-REGISTRY-LOCKED-DEPENDENCIES-R16C.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-REGISTRY-LOCKED-DEPENDENCIES-R16C.txt
```

Expected success: REGISTRY_LOCKED_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE. Return the entire shortened terminal summary, or upload the full locked-dependencies-evidence.json at the printed path. Keep the private report/stage. Do not paste raw npm logs or manually replace active node_modules. Replit AI is not needed.

Allocate roughly 5–30 operator minutes, depending on the registry and project size. This is not a guaranteed duration. The first-release estimate remains 27–61 engineering hours, low confidence, excluding the larger feature/content expansion and external waiting.

## Limits and follow-up

Root-lock normalization is deliberately not applied to the project yet; a later reviewed build/deployment procedure must adopt a reproducible source contract. Before/after observations are neither a filesystem/network sandbox nor an editor lock. The private report is not an off-host backup. Metadata/hash matching does not prove publisher provenance or absence of vulnerabilities. Optional packages and tools installed with lifecycle scripts disabled still need functional qualification. First release additionally needs full assets/configuration, real app/browser/account isolation/AI acceptance, recovery and deployed artifact identity.

The current root lock is required to match 648b869facffba16150769018ee062210691bd4ff10819ca379f501bfdb8d287; package.json must match 0f7ef43511c004e3d268a2e2840d46a264453892937f5a2eb6a680b01481c1e0. Earlier GitHub/remote copies are not substituted for those bytes. The broad feature backlog and three reusable prompts remain in the readiness ledger.

References checked September 9, 2026:
- https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/
- https://docs.npmjs.com/cli/v11/commands/npm-ci/
- https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md
