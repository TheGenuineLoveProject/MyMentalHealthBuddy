# MMHB R16B archive URL diagnostic

Current handoff: MMHB-ARCHIVE-URL-DIAGNOSTIC-R16B.txt. This gathers missing current evidence; it does not repair or approve a download URL.

## Evidence and cause still to resolve

The supplied R16A screenshots show ARCHIVE_URL_NOT_ALLOWED during LOCK_AND_NPM_PREFLIGHT for node_modules/@alloc/quick-lru. npm attempted=false and started=false. The project evidence directory was created. Prior R15 was recorded absent. The selected current pins, prompt assets and Git observations were unchanged; npm tool and retained candidate were unobserved.

The older locally retained GitHub lock entry and the GitHub integration entry fetched during this turn both show the ordinary public npm tarball URL for quick-lru 5.2.0. That URL passes the actual retained R16 archive checker. The available local lock SHA256 is a2a7ec4d1679f36ab295b241c51d19c6b8cca1f81be34e71aca7c044f0c3238c, which differs from the current Replit pin 648b869facffba16150769018ee062210691bd4ff10819ca379f501bfdb8d287. These copies therefore cannot prove the rejected current URL. No actual URL cause or automatic fix is claimed.

## What R16B does

- Require the known Replit root and Node v24.13.0 on Linux x64.
- Read the exact current package.json and package-lock.json and require their prior hashes.
- Observe the available R16A command and saved policy hashes without executing them.
- Execute a trusted diagnostic helper containing a byte-identical copy of R16's archivePolicy function.
- Classify every lockfile package archive; count all rejections and print a bounded set of examples plus the reported quick-lru entry.
- Report fixed reasons and boolean URL properties, hashes and lengths. Arbitrary raw URLs, usernames, passwords, query values and fragments are never saved or printed. An expected public package/version path is shown only when it matches the actual or decoded path on the public npm host without credential/query/fragment components.
- Save all safe findings in a new .mmhb-release-evidence/r16b-* directory and compare the selected observed files again. Existing reports, application source and active dependencies are untouched by this script.

The existing private evidence directory and exact ignore file are required; no old R15 report is fabricated. This diagnostic never calls npm, imports application code, fetches URLs, connects to a database, changes credentials or modifies Git.

## Verification

23 classifier cases passed, including ordinary scoped/hyphenated tarball paths, encoded slash/at sign, HTTP, alternate hosts, credentials, queries, fragments, explicit/default ports, whitespace, backslashes, controls, invalid URL types, payload redaction, integrity format and collecting multiple failures. Each URL case is compared with the old archivePolicy behavior. The extracted old function is checked byte-for-byte.

8 actual-driver fixture cases passed on local Node v24.19.0: normal collection, encoded paths, secret query redaction, changed manifest pin, symlink rejection, conflicting ignore file, preservation of a concurrent edit with failure reporting, and final evidence-write failure. Fixtures adapt only root/Node/pins and explicit test faults. No real Replit installation, package download or application execution occurred. Shell and Node syntax checks also passed.

## Use

Upload the single TXT command to /home/runner/workspace. Run the SHA256-verified command supplied in the updated readiness ledger. Expected diagnostic completion: ARCHIVE_URL_DIAGNOSTIC_COMPLETE_NOT_INSTALL. This remains a non-release status even if some or all archive fields pass.

Return the complete terminal summary. The result will determine the smallest justified correction to the URL policy or current lockfile. Do not change the lockfile or relax the registry checks based on the package name alone. Estimated operator time: 1–3 minutes including upload; the scan itself has no network dependency.

## Scope limits

Only the package pair, two verifier files when available, and the ignore file are observed before/after. The full worktree, all dependencies, old candidate, application/runtime and deployment are not requalified. The archive checker is deliberately narrower than npm's full accepted package-source formats and does not establish package identity, publisher provenance, vulnerability status or permission to install. The project-local report is not an off-host backup or OS sandbox. Before/after reads do not lock editors.

References checked: https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/ and the project's GitHub integration package-lock entry. npm's resolved field identifies the package's source; it is not by itself a trust guarantee.
