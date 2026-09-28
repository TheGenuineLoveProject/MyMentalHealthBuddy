# R14 external dependency review

R13's missing CommonJS resolutions do not by themselves prove startup failure. This review identifies conditional paths in official tagged source and selected MMHB consumers. No application, package, email, network client, or database code was executed.

## Evidence bounds

- Version clues from the locally retained remote lock: ws 8.21.0, pg 8.21.0, Resend 6.12.4. That lock is stale relative to the Replit lock pin and cannot establish actual installed versions.
- Official dependency files were fetched at explicit version tags. Exact downloaded UTF-8 bytes are saved; SHA256s are indexed.
- Selected MMHB files were fetched at remote commit df8137696e4c7b0a7c16a08347e1b92f85b85371. The current Replit worktree is not assumed equal. R14 must compare each source hash before applying its classification.
- Installed Resend distribution files are not present at the official GitHub tag. The TypeScript source is contextual evidence, not a valid hash pin for transpiled files.
- Source matching alone is not a complete application caller graph, ESM resolution proof, compiled-bundle path proof, or deployed-runtime test.

## Findings

| Missing specifier | Reviewed source behavior | Required qualification |
| --- | --- | --- |
| bufferutil | ws assigns JavaScript masking first, tries the addon, and catches failure. | Compare installed ws buffer-util.js; check that the candidate uses that implementation. |
| utf-8-validate | ws uses buffer.isUtf8 when available. Otherwise it tries the addon with a catch and retains JavaScript validation on failure. | Compare installed validation.js; exercise Node builtin/JS branch in later bounded dependency tests. |
| pg-native | pg defaults to JavaScript Client; truthy NODE_PG_FORCE_NATIVE changes that. The pg.native getter catches MODULE_NOT_FOUND and returns null. The native child itself rethrows addon load failure. | Match pg entry and wrapper; confirm runtime configuration does not force native and inspect actual consumers. Do not call native client absence harmless in every mode. |
| pg-cloudflare | pg's stream factory requests it only on its Cloudflare runtime branch. Default Node branch uses net/tls. | Match stream source; later verify actual runtime selection, including any navigator/Response overrides. |
| @react-email/render | Upstream Resend email and batch creation render only a truthy react payload. render dynamically imports this package and throws if unavailable. | Review installed transpiled distribution and actual email payload call sites; do not install merely due to CJS resolution absence. |

Selected remote MMHB consumers:
- server/utils/email.mjs: one explicit html payload call.
- server/services/email.mjs: six explicit html payload calls.
- server/services/newsletterSend.mjs: two explicit html/text payload calls.
- server/routes/blog.mjs: one explicit html payload call in the test-send route.
- server/db/connection.mjs: default pg import, Pool destructuring, no pg.native access in the selected file.

These selected email calls use no react field or payload spread, but absence elsewhere is not proven. Some selected email source still names The Genuine Love Project and uses its domain; if exact current hashes match, retain that as an MMHB-only content/domain launch issue.

## Next bounded qualification

1. Read only the needed installed package metadata and reviewed files. Report installed versions and source identities without executing package code.
2. Apply a reviewed-source classification only on exact byte hash equality; preserve every nonmatching source as REVIEW_REQUIRED.
3. Check matching sources against the retained server input manifest to connect current source bytes with the compiled candidate. A hash match without candidate membership is only a source review.
4. For all five missing externals, inspect actual candidate import edges/current source consumers. Do not manufacture a complete reachability claim from substring absence.
5. Collect and review Resend's installed dist entry; compare its conditional render code with the upstream TypeScript behavior. Both ESM and CJS entries may be relevant.
6. Later, with runtime scope separately prepared, exercise pure helper/transport-selection paths without opening sockets or sending mail. Full account, email delivery and database journeys remain later release tests.
7. Keep the React plugin 6.1.1 installed / 6.1.0 locked mismatch open. None of the optional dependency findings fixes that mismatch.

The machine-readable allowlist is r14-external-reviewed-mapping.json. The source index records local files, full hashes, tags/commit and primary URLs.

## Published distribution follow-up

Two additional read-only attempts were made for the versioned published distribution: https://unpkg.com/resend@6.12.4/dist/index.mjs and https://cdn.jsdelivr.net/npm/resend@6.12.4/dist/index.cjs. Both returned non-retryable safe-open errors from the web tool; no distribution bytes or valid hashes were obtained. The installed distribution remains REVIEW_REQUIRED.
