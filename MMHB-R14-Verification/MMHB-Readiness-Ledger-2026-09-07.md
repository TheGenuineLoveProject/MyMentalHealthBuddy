# MyMentalHealthBuddy — working first release

Updated September 8, 2026 after the supplied R13 result at 04:46:43.087 UTC. Scope: MyMentalHealthBuddy only; deterministic Shell handoffs; Replit AI last. The current handoff is R14 targeted runtime asset and dependency contract evidence.

## Current decision

**R13 passed the core assembly and real copied-native test.** Report: `/tmp/mmhb-release-assembly-r13-1kpDjX`; status `CORE_CANDIDATE_ASSEMBLED_NATIVE_PASS_NOT_RELEASE`. The candidate has 603 files and 40,479,641 bytes. Retained artifact identities, assembly, server syntax, copied bcrypt compatibility and current observed preservation all passed. No application or database was started, and no deployment occurred.

**The copied bcrypt binary now has actual local compatibility evidence.** On Node v24.13.0, Linux x64, bcrypt 6.0.0 loaded its candidate-local glibc binding. Synthetic hash, correct/incorrect password checks, test rounds and module containment passed. This is stronger than the earlier inert fixtures, but it does not prove login/session/database or deployed-platform behavior.

**The next question is runtime completeness.** R13 reports five unresolved CommonJS package names. Reviewed upstream code shows conditional or optional uses for several of them. Installing every unresolved name would not establish whether the application needs it. R14 compares exact current installed/source hashes with the reviewed implementations, links selected sources to the retained compiler-input manifest, and records current package/lock metadata.

**R14 also checks 31 explicitly named runtime assets.** Selected consumers use working-directory-relative AI, kernel and blog paths; the core package does not yet establish those assets. Remote review found legacy GLP text and an unsupported no-retention assertion in selected assets. These are current-workspace review leads until exact hashes match. The existing MMHB `business` engine is not treated as another platform merely because of its directory name. No other project's repository or deployment is changed.

**R14 is a bounded evidence step, not a release claim.** It preserves the passing R13 candidate, does not rebuild/install/start the app, and prints metadata rather than prompt text or credential values. Replit execution is pending; the tested command and its source are supplied for Shell because no direct Replit Shell session is connected here. Dependency alignment, complete runtime packaging/configuration, exposed-feature acceptance, recovery and deployment verification remain open. No defensible overall completion percentage is available.

## Completed and open gates

| Gate | Status | Evidence boundary |
|---|---|---|
| Auth hash-freeze verifier and wiring | Applied, hashes preserved through R9 | Frozen source contract; no live session proof |
| R3 ownership discriminator | Completed | Source/launcher inspection, not active deployment provenance |
| R4 session persistence | Applied; tests and typecheck PASS | `resave:false`, 604800-second store TTL, seven-day cookie; mocked store lifecycle |
| R5 canonical logging | Applied; tests and typecheck PASS | 12 dynamic payload removals, 13 events preserved; historical/downstream logs uninspected |
| R6 CSRF evidence | COMPLETE | 36 synthetic cases, 1287 client files scanned, 29 selected files, 72 excerpts, 219 imports |
| R6 input/worktree preservation | PASS in supplied output | No source/package edits, network, DB, installation or deployment |
| R7 CORS repair | APPLIED; installed cases/typecheck PASS | Exact app hash `fb7316818f033e5748f7710a8c7c6f01991f03da6aa649a56189fbab71329818`; runtime/deployment unproven |
| R8 local-auth origin boundary | APPLIED; installed cases/typecheck PASS | R8 policy body preserved through the R9 helper export; browser/proxy compatibility pending |
| R9 OIDC logout route | APPLIED; installed cases/typecheck PASS | Two source changes confirmed; real Express/store/browser/provider behavior remains unproven |
| R10 release pipeline | STOPPED after R9 baseline PASS | `OBSERVED_INPUT_DRIFT`; no complete report, build or application mutation |
| R10A release-pipeline evidence | COMPLETE in supplied Replit output | Baseline, collection and preservation PASS; no build or runtime execution |
| R11 temporary server candidate | FIRST COMPILATION COMPLETED; verification STOPPED | Root jsconfig presence triggered overly broad gate; full candidate not qualified; preservation reported PASS |
| R11A server candidate | FIRST COMPILATION COMPLETED; two verification failures | Rejected metafile path, then aggregate Git/worktree mismatch; no complete candidate |
| R11B retained-evidence diagnostic | COMPLETE in supplied Replit output | All 32 pins match; current Git/worktree stable; retained files preserved; no build |
| R11C dependency-path correction and server candidate | FAILED before compilation | ENOENT with unspecified path; zero compiler processes; current preservation PASS |
| R11D first run | Build/copies PASS; final preservation FAILED | One readiness-ledger file changed during execution; editing actor unknown |
| R11D second run | SERVER CANDIDATE PASS in supplied Replit output | Two matching bundles, input/schema/native-copy/preservation PASS; no runtime or frontend qualification |
| R12 private frontend candidate | STOPPED before compilation | Nested nanoid executable link rejected by tool snapshot; pins/source/Git preserved, tools unobserved |
| R12A frontend candidate | PASS in supplied Replit output | 554 files, 2968 local references; selected sources/tools/Git preserved; runtime/configuration/alignment unqualified |
| R13 core assembly and copied bcrypt smoke | PASS in supplied Replit output | 603 files; real copied glibc bcrypt binding and synthetic comparisons pass; application/deployment unproven |
| R14 targeted runtime contract evidence | PREPARED; Replit execution pending | Selected source/dependency/asset metadata; preserves R13 candidate; no runtime or publication claim |
| Remaining CSRF and runtime auth protection | OPEN | R8 protects local-auth origins; R9 protects the canonical logout handler. Other exemptions and actual browser/proxy behavior remain |
| Multi-session isolation and refresh/logout races | OPEN | Real request lifecycle and database semantics not yet qualified |
| Exposed user flows, private-data isolation, AI/crisis handling | CURRENT EVIDENCE INCOMPLETE | Must qualify the features included in the first release |
| Build, schema/restore, runtime and deployed artifact | OPEN | No release qualification or deployment claim |

R10 failed at `2026-09-07T22:19:37.932Z`; no report directory was produced. R9 report: `/tmp/mmhb-oidc-logout-r9-VE6VNs`, observed at `2026-09-07T21:31:18.729Z`. R8 report: `/tmp/mmhb-auth-origin-r8-I0TnRB`, observed at `2026-09-07T21:07:00.146Z`. R7 report: `/tmp/mmhb-cors-origins-r7-HejGOj`, observed at `2026-09-07T20:41:40.110Z`. R6 report: `/tmp/mmhb-csrf-contract-r6-O0Iyw2`. Earlier R4/R5 reports remain `/tmp/mmhb-session-persistence-r4-G9Nb15` and `/tmp/mmhb-oidc-logging-r5-FnXVaS`. Temporary report paths are not durable backups across workspace resets.

## What R6 means

At R6, the global CSRF module skipped `/api/auth/*`, Bearer-prefix requests (including an empty credential), and truthy guest identifiers. Matching a test's expected `NEXT` means that the bypass was observed; it does not mean the request was secure.

Local refresh and logout consume a refresh cookie; the current client does not supply a CSRF token on those calls. `requireAuth` separately verifies a JWT and returns 401 for missing or invalid credentials, so passing the global CSRF middleware is not itself proof of an authentication bypass. Routes using ambient Passport sessions and `optionalAuth` need separate analysis.

At R6, canonical OIDC GET `/api/logout` was registered before global CSRF middleware and changed authentication state. R9 has now replaced that behavior with confirmation plus an origin-checked POST; actual browser/store behavior still needs qualification. Tightening only `/api/auth/` would not have protected that route.

Before R7, the app's credentialed CORS callback accepted arbitrary supplied origins when `CORS_ORIGIN` was empty or contained `*`. R7 removed that behavior. Its output observed one shell allowlist entry and a wildcard; this is shell configuration evidence only. The repaired source grants no origin access from `*`; actual deployed configuration and headers remain unknown.

R6 redaction changed literal strings, regexes and some numbers. Its excerpts are review evidence, not patch input; apparent conditions such as a recovery-code limit shown as zero cannot be treated as actual source defects.

## Completed R7 repair contract

| Item | Definition |
|---|---|
| Issue | `CREDENTIALLED-CORS-ORIGIN-001` |
| Domain and severity | Browser response-access policy; release blocker until qualified, deployment exploitability unknown |
| Causal owner | Canonical CORS registration in `server/app.mjs` before auth/session mounts |
| State before R7 | Empty list or wildcard could reflect arbitrary origins with credentials enabled |
| Expected state | Only exact configured serialized HTTP(S) origins receive credentialed CORS permission |
| Authorized mutation | One existing CORS block in one tracked source file |
| Preservation | Auth routes/services/account, R4/R5 source, cookies, CSRF module, clients, package/lockfiles and index |
| Compatibility | Exact allowed origins retain response/preflight behavior; missing/unlisted origins continue without CORS grant headers |
| Cache behavior | Add `Vary: Origin` on allowed, denied and missing-Origin responses, preserving existing Vary values |
| Rollback | Private original-byte backup; automatic restoration after a failed post-application gate only if target still matches candidate |
| Acceptance | Current pins, dependency code hashes, exact candidate hash, synthetic header cases, direct typecheck, auth verifier and unrelated-state checks pass |
| Exclusions | No installs, environment/credential edits, live requests, DB activity, process restarts/signals, staging, commits, pushes or publication |

Same-origin browser requests do not require CORS grant headers. Cross-origin browser clients need their exact origin listed; R7 deliberately removes wildcard dependence. Denied CORS requests can still reach and change server state. This repair **does not replace CSRF protection**, and it does not qualify downstream/proxy headers or a real browser.

The replacement validates serialized origins using `URL`, exact string equality and an HTTP(S) protocol check. It rejects opaque `null`, wildcard, malformed, userinfo and path-bearing origins. It does not derive trust from Host, forwarding headers or guessed Replit domains. No environment values are changed; the report prints only shell allowlist count/wildcard classification, which is not deployed configuration evidence.

The baseline app bytes were recovered locally from an older remote copy by removing its obsolete logout bridge; the resulting full-file SHA-256 exactly matches R6. That reconstruction is only a preparation step. The delivered command edits the existing Replit file only after its own full-file hash check. It does not download or copy GitHub's app file into Replit. Query/client and cookie helpers used for compatibility inspection also match R6 hashes.

## R7 qualification and successful workspace application

| Check | Result and limit |
|---|---|
| Candidate source | Exact app baseline `b52ea98c5d6c159d37d27df01675511dcc964c94cf580ac72963692bf28dcd6d` transforms to `fb7316818f033e5748f7710a8c7c6f01991f03da6aa649a56189fbab71329818` |
| Actual reviewed CORS code | 90 synthetic request cases pass for each of cors 2.8.5 and 2.8.6, with reviewed vary 1.1.2 and object-assign 4.1.1 code |
| Controls | Two baseline reflection controls, two extra cache-header cases, three allowed-origin before/after comparisons per version |
| Negative mutations | Six controls detect reflection, wildcard acceptance, missing origin validation, missing Vary, error instead of continuation, and removed credentials |
| Independent review | Policy, exact diff, response-header tests and mutation driver reviewed; no blocking defect identified |
| Atomic helper | Inert fixtures pass apply/restore, file-mode preservation, unexpected target bytes, failed rename cleanup and concurrent-edit refusal |
| Command syntax | Bash and embedded JavaScript syntax pass; candidate app parses |
| Replit execution | User-supplied output confirms installed dependency matching, pre/post-application cases, direct typecheck, auth-contract and unrelated-state checks PASS |

The test harness evaluates only the reviewed CORS block and reviewed dependency sources against synthetic request/response objects. It never imports or starts the application. The command resolves the installed CORS/dependency files, accepts only reviewed source hashes, then repeats the cases using those bytes before and after application. Unknown dependency bytes produce a stop before source mutation; do not change the pin or install a package to force a pass.

The R7 tests remain in its bounded command rather than the project's CI pipeline. Durable regression integration is still an open work item. Hash checks and atomic replacement reduce overwrite risk but are not a lock against concurrent project editing.

## Completed R8 repair contract

| Item | Definition |
|---|---|
| Issue | `AUTH-ORIGIN-BOUNDARY-001` |
| Causal owner | Global `csrfProtection` in `server/security/csrf.mjs`, mounted before the current local-auth router |
| Defect before R8 | Unsafe `/api/auth/*` requests passed an unconditional exemption before Bearer/guest checks |
| Bounded repair | Replace the auth exemption with browser Fetch Metadata and exact Origin/Referer validation |
| Path matching | Case-insensitive `/api/auth` plus descendants, before the generic non-API early return; neighboring `/api/authentication` is not included |
| Expected legitimate use | Current same-origin web calls for login, register, MFA, refresh and local logout |
| Intentional denial | Cross-origin auth clients, unsafe calls with no accepted origin proof, malformed/contradictory proof and untrusted metadata receive 403 |
| Error response | `AUTH_ORIGIN_REQUIRED`, with `Cache-Control: no-store` |
| Source scope | One tracked file; new helper and narrow auth branch only |
| Preservation | R7 app, R4/R5 OIDC module, local auth/services/account, client files, cookie issuance, non-auth CSRF behavior, package/lockfiles and index |
| Rollback | Original-byte backup; restore after a failed post-application gate only if current target still equals this candidate |
| Exclusions | No application import/start, live requests, DB activity, installs, credential/config edits, process signals, staging, commit, push or deployment |

Policy order for unsafe auth requests:

1. If `Sec-Fetch-Site` is present and is anything other than `same-origin`, reject. Sibling subdomains (`same-site`) are not implicitly trusted. Unknown values and `none` also reject for these sensitive unsafe endpoints.
2. If `Origin` is present, require a single serialized HTTP(S) origin matching the request's effective protocol and Host, including non-default port. A malformed or foreign Origin cannot fall back to metadata or Referer.
3. With Origin absent, browser `Sec-Fetch-Site: same-origin` is accepted without relying on proxy Host reconstruction.
4. With both absent, require a valid absolute HTTP(S) Referer with exactly the same origin as the request target.
5. With no accepted proof, return 403 before the local-auth route and before Bearer/guest exemptions.

The request target uses `req.protocol` and the Host header, not `req.hostname`, suffix matching, `CORS_ORIGIN`, or raw `X-Forwarded-Host`. Express can derive `req.protocol` from proxy headers under the existing trust-proxy setting; this remains a runtime trust/configuration boundary. A proxy that rewrites Host or presents the wrong effective protocol can cause legitimate Origin/Referer requests to fail. That behavior must be checked before publication; synthetic plain request objects do not qualify the Express getter or network topology.

**Compatibility:** the currently reviewed browser clients use relative auth URLs and normally send accepted browser metadata/origin information. No client token-fetch rewrite is required for this bounded approach. Nonbrowser clients and older/privacy-filtered WebViews that supply none of the accepted evidence intentionally receive 403; they are not silently exempted by a Bearer token or guest header. A command-line client can supply the exact Origin when using an authorized account, but this gate does not execute such requests. Browser-origin proof supplements authentication; it does not authenticate arbitrary command-line callers.

Safe methods remain unchanged. Canonical OIDC login/callback GET routes, the separate GET `/api/logout`, pre-CSRF session-boundary routes and other global exemptions are outside this repair. R9 subsequently repaired the canonical logout handler at source level. Existing non-auth path-case gaps are not claimed fixed. Cross-site scripting and same-origin client-side request forgery also remain outside this mechanism's protection.

## R8 qualification and successful workspace application

| Check | Result and scope |
|---|---|
| Exact source | Baseline CSRF SHA `3a53d030dac2a0a57f67754a9798fe3fe5ae03509c8f10f92c2acb33ebf968cb`; candidate `fee930c248dd77dacc90c4ea3ab4b27c9ca8d5b027ada99331d8115cc89088a2` |
| Auth request matrix | 1811 synthetic combinations cover origin/metadata variants, auth paths/casing, credential headers, methods and host/port/protocol handling |
| Additional checks | Metadata without Origin; 26 safe-method/non-auth preservation cases; 3 baseline exemption controls; unchanged cookie issuance/reuse |
| Negative mutations | Eight controls detect unconditional pass, case-sensitive path bypass, same-site trust, omitted origin comparison, invalid-Origin fallback, missing-proof acceptance, forged Bearer bypass and wrong denial status |
| Independent review | Helper, branch ordering, driver and test interpretations reviewed; independent rerun passed the same matrix; no blocking bypass found in the bounded scope |
| Driver | Reuses the R7 preservation and guarded replacement/rollback logic; R7 app hash is a required unchanged input |
| Syntax | Bash, embedded JavaScript and candidate module parse checks PASS |
| Replit execution | User output confirms pre/post installed cases, direct typecheck, exact scope, auth-contract and unrelated-state checks PASS |
| Actual runtime | Browser/proxy request behavior, credential services and full project tests remain unqualified |

The harness evaluates the hash-reviewed CSRF module body with synthetic requests/responses and stubbed cryptography. It does not evaluate application imports, connect to a database or send requests. The matrix count is a count of synthetic combinations, not real user journeys or a percentage of security coverage. The supplied R8 output confirms these checks against the installed candidate, followed by direct typecheck and the preserved auth verifier. If any known input has drifted, it stops before applying source changes.

The existing driver helper was already exercised with inert apply/restore, mode, drift, failed-rename and concurrent-edit controls. R8 does not broaden its write scope. All hash/snapshot comparisons detect drift but do not lock other editors out; pause concurrent project editing during the run.

## Completed R9 source repair contract

| Item | Definition |
|---|---|
| Issue | `OIDC-LOGOUT-BOUNDARY-001` |
| Causal owner | Canonical `setupAuth` in `server/replit_integrations/auth/replitAuth.mjs`, registered before global CSRF |
| Defect before R9 | GET logout mutated authentication state; the callback error was ignored and a provider redirect followed |
| Expected behavior | GET/HEAD handler shows confirmation; only an accepted same-origin POST attempts logout; failures stay visible |
| Authorized source scope | Canonical OIDC module plus an export of the existing helper in `server/security/csrf.mjs` |
| Preservation | R4 session options, R5 static logging events, R7 app/CORS, R8 origin-function body, local JWT auth/refresh/account/client files, package/lockfiles and index |
| User impact | Existing Replit-auth client navigation opens a confirmation page; one explicit Sign out click completes the POST |
| Successful cleanup order | Prepare existing provider URL → Passport logout callback succeeds → destroy remaining request session → clear only `connect.sid` → HTTP 303 provider redirect |
| Failure behavior | Rejected origin evidence returns 403 before provider/Passport work; logout or cleanup failure returns a static 500 page without successful redirect |
| Rollback | Original bytes and modes backed up; reverse applied writes only when current bytes/modes match candidates; preserve unexpected concurrent edits |
| Qualification | Exact hashes, source-only export, handler cases, reviewed Passport code with synthetic sessions, installed-source identity, direct typecheck and unrelated-state checks |
| Exclusions | No app start/import, network requests, real DB writes, package installs, configuration/credential changes, process signals, staging, commits, pushes or deployment |

The current R8 origin function is exported and reused, avoiding two policy implementations. The CSRF export is applied before its OIDC consumer; rollback restores the consumer first. If an unexpected consumer edit prevents its restoration, the script keeps the shared export and reports recovery rather than breaking that consumer. The two writes are not a filesystem transaction. An abrupt process interruption can leave a partial application; private backups and phase information support review. Pause other editing while it runs.

The confirmation page has a fixed same-origin POST form, a visible button and a dashboard return link. It has no scripts, auto-submit, user-derived HTML or remote assets. No-store, a restricted content policy and the existing self/Replit framing allowance are set explicitly. The policy does not constrain `form-action` to self, because the successful form submission redirects to the identity provider. The form's action remains a fixed `/api/logout`; the server validates request-origin evidence. Real browser framing, CSP/redirect compatibility and accessibility still require checks, preferably in a normal browser tab.

The error page avoids raw errors, IDs, tokens and personal data. One new static warning event is added; the existing 13 events remain. Clearing the cookie occurs only after successful server-side cleanup. If a failure occurs after some cleanup, the page deliberately says completion could not be confirmed; it does not claim the entire operation was rolled back.

Reviewed Passport 0.6.0/0.7.0 logout normally saves and regenerates the session. Thus the old successful path is not proven to retain backup `userData`. Its state-changing GET and ignored failure callback are the demonstrated defects. The new final destruction/clear-cookie step improves explicit cleanup but does not prove real multi-session isolation, prevent every concurrent refresh/save race, revoke all previously issued tokens, or end other identity-provider sessions. The local JWT `refresh_token` cookie is deliberately outside this OIDC unit. The existing provider redirect construction from effective protocol/hostname remains subject to proxy and port qualification.

GET/HEAD handler tests show no logout, destruction, cookie-clearing or provider work. They do not prove the surrounding real session middleware performs no expiry touch/database write.

## R9 qualification and successful workspace application

| Check | Result and boundary |
|---|---|
| Read-only handlers | 8 GET/HEAD handler cases; static confirmation and no logout-side effects |
| Origin contract | 128 permitted/denied combinations, including forged Bearer/guest headers |
| Failures and ordering | 12 failure scenarios with deferred callbacks; no success redirect on errors |
| Baseline controls | Old GET mutation and ignored logout-error redirect reproduced in 2 synthetic controls |
| Actual Passport functions | Official request/session-manager source bytes evaluated; all session/storage operations synthetic |
| Regression | R4 policy, R5 existing events, login/callback handlers and R8 helper body preserved |
| Negative controls | 9 deliberately broken variants detected by behavioral tests independently of exact-diff checks |
| Independent review | Candidate and full matrix independently rerun; no blocking source issue found |
| Mutation driver | Syntax plus 8 inert atomic-write/rollback scenarios passed, including concurrent consumer edits |
| Replit installed gate | User output confirms installed cases, exact source changes, direct typecheck, auth contract and unrelated-state checks PASS |
| Runtime and deployment | Browser dispatch, real Express/store lifecycle, concurrency, provider logout and deployment are unproven |

Negative controls remove the origin guard, ignore logout/destroy errors, clear the wrong cookie, preserve POST on the redirect, mutate on GET, auto-submit the form, permit caching or skip destruction. They fail the behavior tests. Counts describe tested combinations, not comprehensive security coverage.

The command resolves Passport from the canonical auth module's location, reads its request/session-manager files and verifies their exact reviewed hashes. It does not import Passport or load application dependencies. Unknown installed source bytes stop before mutation; do not install a package or alter the pins to force a pass. Reviewed request hash: `7f7261bc174fe71378971bf5b912db22b312ad2c148ff6200e316afcde797ba3`; manager hash: `9a9959bf0295d3f483f6858484e57223a055d908f81e15bc2fdce8400a9adef0`.

Current source hashes confirmed by R9:

- OIDC: `6235fd16449ca0974cc9d5103c1c3ae42e5ace1b7bbcdb6d3351aa7fbae7f9f2`
- CSRF export: `648e21f3eb89933aeaaad1e967c59640cc52d2f8634002d3abbc6dafe358bce1`

## R10 failure analysis and R10A correction

The delivered R10 file passed its checksum (`4793f29b7b73a8ea860218b25d0a3c7cd14e4cb19aede0fccc2037baee805bd1`) and the current R9 baseline gate. It stopped with `STATUS=RELEASE_PIPELINE_AUDIT_FAILED`. Its output reports zero application/source/package changes, installs, runtime/network/database operations or deployment. No application rollback is needed for this collector failure.

Root cause in the supplied command: `read(file, allowInternalSymlink)` stored `allowInternalSymlink` inside the JSON identity compared on every read. This is a permission passed by a caller, not a property of the file. The R9 pin loop reads `node_modules/typescript/package.json` with `false`; installed-tool inspection later reads that same path with `true`. The comparison fails even when SHA, size, mode and resolved path are identical. The original end-to-end fixture did not include pinned TypeScript metadata and missed this overlap.

The narrow correction:

1. Compare only SHA-256, byte size, mode and resolved path as file identity.
2. Store the read permission separately and retain the most restrictive value across calls. A permissive call cannot relax a prior no-symlink read, including the final reread.
3. Continue failing on actual content/mode/path drift and missing observed files. Emit only the checked file path and changed field names when identity differs.
4. Retain all 18 baseline pins, repository checks, source-selection logic, command discovery, Git-filter avoidance, output limits and zero-application-mutation scope.

The old reader and full collector now reproduce the false failure using unchanged pinned TypeScript metadata. The corrected collector passes the same fixture. Twelve full-collector scenarios pass, covering happy-path collection, baseline drift, disappearing ignored files, unrelated worktree edits, new configs, outside-root symlinks, nonexecution of Git clean/process filters, actual content/mode/resolution changes and strict-policy retention. The independent reviewer also checked mixed read-order and symlink behavior using the exact reader. Those were local synthetic checks. The user subsequently supplied successful R10A Replit collection and preservation results at 22:33:32 UTC.

## R10A release-pipeline contract

| Item | Definition |
|---|---|
| Issue | `RELEASE-PIPELINE-PROVENANCE-001` |
| Domain | Build, testing and deployment readiness |
| Current state | Source fixes pass bounded checks; no current source-to-bundle proof exists |
| Causal owners | Root package scripts and hooks, `.replit`, Vite config/plugins, server bundler and packaging script |
| Read scope | 18 R9 baseline pins; selected pipeline source/configs; package/lockfiles; top-level installed tool metadata; selected existing artifacts |
| Write scope | A unique private report directory under `/tmp/mmhb-release-pipeline-r10a-*` |
| Forbidden operations | Source/package/config edits, installation, script/config imports or execution, app start, HTTP/DB activity, process signals, credentials, staging, commit, push, deployment |
| Acceptance | R9 baseline matches; report is bounded/redacted; inspected files, raw Git index and Git-listed worktree byte identities remain unchanged |
| Rollback | Not applicable to application source: R10 makes no application changes |
| Next decision | Review the report, then prepare an isolated build using current installed tools if its actual inputs permit that |

R10A checks branch `integration` and HEAD `ba56d50f2f86bc9e47f829e9596f0d0b31699ab0`, plus the current R9 CSRF/OIDC hashes and preserved source/package inputs. It does not alter a pin to accommodate drift. Uploading the command adds its own file before preservation snapshots begin.

The connected GitHub repository is `TheGenuineLoveProject/MyMentalHealthBuddy`. Its remote `integration` branch is not interchangeable with the Replit working tree: the fetched remote package does not match the current package pin. The collector never downloads or copies remote source into Replit. For seven build/config/check files already read from that repository, it compares workspace bytes with the reviewed source hashes. A match establishes identical file bytes; otherwise the file stays `UNREVIEWED_BYTES`.

### Why the build needs this inspection

- The already-pinned `.replit` declaration runs `NODE_ENV=production node dist/server.mjs` in production. Its configured build installs packages, recursively removes `dist` and `client/dist`, builds the frontend, then runs `scripts/build-server.mjs`. This is a declaration, not proof of the effective deployment.
- Reviewed remote `vite.config.js` empties `client/dist` and enables a visualizer that writes `bundle-report.html` separately. An isolated build must account for both output locations.
- Reviewed remote `scripts/build-server.mjs` bundles the server, copies canonical SQL, removes/replaces the packaged frontend, and removes/replaces `dist/node_modules` with native dependency trees. The comments describing a self-contained deployment do not prove native ABI, dependency resolution or startup behavior.
- Reviewed remote `scripts/check-contract-routes.sh` makes local HTTP health requests. Reviewed remote `verify-foundation.mjs` makes HTTP requests and writes a verification log and, outside CI, a status document. Their current workspace hashes must match before treating this as current behavior.
- Reviewed remote `verify-safety-guardrails.mjs` uses source/text presence checks. Those checks do not establish behavioral clinical safety.

R10A includes declared npm pre/post hooks and referenced package commands, because default npm behavior invokes matching hooks. It never runs npm. Unknown command text is replaced by size/hash metadata and conservative file candidates. It does not read effective npm configuration, establish every dynamic subprocess or follow the entire runtime application graph. Those are explicit review gaps, not successful execution gates.

Static import/path/effect matches can include comments and unresolved references. They are candidates for review. Installed versions and binary hashes are metadata; no Vite/esbuild/compiler binary is executed. Existing bundle, HTML, SQL and native package metadata do not establish freshness, R9 inclusion or active deployment provenance.

### R10A local qualification

| Check | Result and boundary |
|---|---|
| Pure command helper | 10 fixture groups pass; ASCII command parsing, npm hook chains/cycles, missing edges and opaque-command redaction |
| Inert collector fixture | Success path includes pinned TypeScript metadata, a synthetic package graph and internal npm-bin symlink without executing project/tool code |
| Drift controls | Wrong baseline, disappeared artifact, worktree edit, new config and actual byte/mode/resolved-path changes each stop |
| Path control | A binary symlink resolving outside the workspace stops |
| Git filter controls | Configured clean/process filters do not execute during collection |
| Preservation method | Raw Git-listed file byte/mode hashes plus raw index identity; avoids `git status`/`git diff`, which can invoke content filters |
| Independent review | Original disappeared-file/Git-filter fixes retained; R10A policy separation and drift protections independently checked |
| Syntax and packaging | Bash and the complete embedded JavaScript parse; command contains only built-in module imports |
| Replit run | User output confirms R10A collection and preservation PASS; compilation and runtime remain outside that gate |

The twelve corrected full-collector scenarios use temporary synthetic Git repositories; a separate original-code control reproduces the false drift. They do not import MMHB modules, contact services or build application outputs. Scope limits deliberately stop on unsupported file types, path escapes, unexpected pins or oversized collections. Raw file hashing is bounded to 256 MiB per Git-listed file and 4 GiB total per snapshot; inspected source/artifact reads are limited to 64 MiB per file. A limit failure requires review, not removing the guard blindly.

### R10A completed evidence

- Command SHA-256: `55ed061fc9dedac278995c019e08e26a3d71ecb73f0384ffbc368c83b7e0b497`.
- Actual report: `/tmp/mmhb-release-pipeline-r10a-2ARtTu`.
- Actual UTC: `2026-09-07T22:33:32.430Z`.
- Result: `RELEASE_PIPELINE_EVIDENCE_COMPLETE`; baseline/collection/preservation passed.
- Environment: Node v24.13.0, Linux x64; declared engine >=24 <25.
- Project commands: `build` is `vite build`; server packaging is separately defined by `scripts/build-server.mjs`. The configured deployment runs `dist/server.mjs`.
- Build/config source hashes match the reviewed root Vite config, root TypeScript config, server builder, route pretest and foundation verifier.
- Client PostCSS and TypeScript configs were subsequently fetched read-only from GitHub and match the current R10A hashes. The 92-byte PostCSS config loads `@tailwindcss/postcss` and `autoprefixer`. CSS-level Tailwind plugin/config reachability remains for the frontend build unit.
- Missing unrelated governor scripts and lexical references are backlog findings, not automatically blockers of this backend compilation.

| Observed discrepancy | Meaning and next handling |
|---|---|
| React plugin installed 6.1.1 / locked 6.1.0 | Clean release dependency reproduction is not yet demonstrated. Do not silently edit lockfiles or installed packages. R11/R11A did not run this plugin; R11D remains a server-only build and does not resolve frontend dependency drift. |
| Source SQL 41,651 bytes / packaged SQL 43,698 bytes; different hashes | Existing package does not match the current canonical SQL bytes. R11A stopped before the schema copy. A future qualified candidate must package the current canonical SQL; no SQL has been executed in these gates. |
| Both existing frontend indexes 10,568 bytes; different hashes | Same size is not identity. Require a freshly built frontend and verified packaging before release. R11D does not copy either existing frontend. |

## R11A result analysis

| Observation | Meaning |
|---|---|
| R10A baseline PASS | Reported pins, branch/HEAD and installed compiler met R11A's initial checks |
| First compiler invocation completed | One real temporary server bundle was produced; compiler exit alone is not complete provenance |
| Original failure: rejected metafile input label | R11B plus exact public-path SHA matching identifies the literal # in es5-ext/array/#/e-index-of.js as the rejected character |
| Final failure: Git/worktree mismatch | HEAD, branch, raw index identity, observed file set or file identities differed; the report did not identify the component |
| Pinned checks precede final Git/worktree gate | Selected source/lock/compiler/artifact identities passed the final pinned comparison before the broader failure |
| No initial snapshot persisted | Historical attribution is unavailable from the retained report; new stability cannot prove the old run stable |
| One build process started | No completed second build, complete input manifest, schema/native packaging or runtime test |

R11A's earlier root-jsconfig correction remains justified by the reviewed esbuild 0.28.2 resolver: a sibling root jsconfig's presence alone does not override the explicitly selected pinned root tsconfig. Nineteen earlier orchestration fixtures passed that bounded correction. They did not demonstrate that every real metafile input satisfies the path policy, nor that a concurrent real workspace remains unchanged.

The retained directory is `/tmp/mmhb-server-candidate-r11a-fKJShm`. Expected selected files are `server-candidate-evidence.json`, `esbuild-meta.json`, `build-1.log` and `candidate/server.mjs`. The original R11A input snapshots are unavailable. Do not delete the directory, restore files over user edits or weaken the path gate to force another build.

Git's raw index includes filesystem stat information and cache extensions as well as staged entries. A raw index difference can therefore occur without a changed staged file. This is a possible explanation, not an attribution of R11A's failure. R11B observes raw index identity separately from staged-entry and tracked-flag hashes, while retaining the raw-index difference as evidence.

## R11B diagnostic contract

| Item | Bounded action |
|---|---|
| Issue | `RELEASE-PIPELINE-PROVENANCE-001` |
| Purpose | Identify the path-policy rejection from retained metadata and preserve detailed new drift evidence |
| Retained inputs | Four selected files in the exact R11A directory; bounded regular-file reads with symlink checks |
| Metafile treatment | JSON data only; reproduce R11A path normalization and digest labels, including ancestor config candidates |
| Disclosure | Sensitive paths remain labeled; limited ordinary filename punctuation can be displayed for review; no rejected input contents or raw logs are printed |
| Input acceptance | No path-policy relaxation, application patch, compiler namespace acceptance or release approval |
| Current baseline | Recheck the existing pins and expected Git branch/HEAD; report mismatches without accepting them |
| New preservation evidence | Private before/after per-file rows, HEAD/branch/raw index identity, staged-entry and tracked-flag digests; report changed components and fields |
| Report writes | New private `/tmp/mmhb-server-diagnostic-r11b-*` directory only |
| No actions | No compilation, npm/project script, application startup, network request, database connection, package change, Git mutation or publication |
| Historical qualification | Always `UNRESOLVED_R11A_INITIAL_SNAPSHOT_NOT_RETAINED` |
| Missing evidence | Report the failure; do not regenerate it by rebuilding |

Two new snapshots detect differences between current observations. They do not lock concurrent editors, cover ignored files beyond the selected pins, prove every transient mutation absent, or reconstruct the old R11A baseline. R11B began without previously supplied retained-evidence hash pins; it established their current identities and checked them again. R11C attempted to pin that retained metafile, but stopped with ENOENT before compilation. R11D regenerates metadata instead of depending on that old report.

### Local qualification

Fifteen fixture groups PASS using temporary Git repositories and synthetic retained R11A reports. Coverage includes exact normalized-label matching; ordinary punctuation; disabled-namespace candidates; sensitive/control-character paths; importer metadata; malformed-result, missing-file and symlink refusal; current pin mismatch; missing target; configured Git clean-filter non-execution; existing unrelated changes preserved; saved private before/after snapshots; content/addition/deletion/mode changes; and raw index, tracked flags and HEAD differences. Sensitive and absolute disabled-prefix suffixes remain redacted.

Independent review found and corrected the disabled-prefix display edge case and ensured retained-file failures do not prevent the remaining preservation observations. No remaining blocker was identified within this read/hash diagnostic scope. Bash syntax, JavaScript syntax and exact embedded-driver identity PASS. The supplied actual R11B result is recorded below. Its original synthetic tests did not identify the real rejected filename or explain historical drift.

### Actual R11B result

Report: `/tmp/mmhb-server-diagnostic-r11b-fMuTlG`; timestamp `2026-09-07T23:55:58.046Z`; status `R11B_DIAGNOSTIC_EVIDENCE_COMPLETE`.

| Observation | Result |
|---|---|
| Current branch and HEAD | Match R11A |
| Existing pinned identities | 32 checked, zero mismatches |
| Current preservation | Stable during R11B only; no changed components/files; zero unobserved files |
| Retained evidence preservation | No changed files |
| Compiler metadata | 1,279 inputs; zero outside-workspace inputs; 13 old-policy rejected paths |
| Target label match | Exactly one match, three memoizee importers |
| Retained metafile identity | SHA-256 `c1fe73006a3de9380da7b96130bf9fc8dea0619bc2ef251c037dbc71961383a0`; 612,561 bytes |
| Retained first bundle identity | SHA-256 `06f22097601e3bdc695f5dfa07d2f84b72f76a13cd3e8a4e3dc984eb389b79e5`; 5,555,689 bytes |
| Historical R11A preservation | Unresolved; initial snapshot unavailable |
| App/build/deploy work | None during R11B |

## R11C historical contract and actual result

Issue: `RELEASE-PIPELINE-PROVENANCE-001`. Causal owner: the candidate verifier's input path acceptance and incomplete preservation reporting. The product source is not changed.

The exact additional readable source paths are:

- `node_modules/es5-ext/array/#/e-index-of.js`
- `node_modules/es5-ext/string/#/contains/index.js`
- `node_modules/es5-ext/string/#/contains/is-implemented.js`
- `node_modules/es5-ext/string/#/contains/shim.js`

The nine configuration candidates are `package.json`, `tsconfig.json` and `jsconfig.json` under `node_modules/es5-ext/array/#`, `node_modules/es5-ext/string/#` and `node_modules/es5-ext/string/#/contains`. Their presence or absence is observed; they are not executed.

The public upstream files establish legitimate filename conventions and imports, not installed-byte equivalence. R11B printed hashes for two source paths and seven configuration candidates. The remaining four entries were omitted from its bounded output. R11C was designed to check their membership against the retained report before compilation, but its actual run did not reach that gate. This section records the former contract; R11D below supersedes its temporary-report prerequisite.

| Step | Acceptance evidence |
|---|---|
| Existing baseline | Same 32 source/tool/lock/artifact pins, expected Node, branch/HEAD and installed compiler |
| Retained metadata | R11B-reported SHA-256 matches; expected 13 rejected paths accounted for; no outside-workspace input |
| Current input preflight | All retained input files and ancestor package/config identities captured before build; required repaired auth inputs present with exact pins |
| First fresh compilation | Same reviewed esbuild CLI contract; actual output and current input manifest match expectations and preflight |
| Second fresh compilation | Same source/input closure and matching server bundle SHA-256 |
| Packaging | Current canonical SQL copied and verified; bcrypt/node-gyp-build trees copied with hashes and modes checked |
| Final preservation | Current pinned inputs, build inputs, native sources, retained metafile and detailed Git/worktree snapshots preserved |
| Failure | Save available diagnostics and independent preservation results; never restore over user edits |

The compiler contract remains esbuild 0.28.2 native CLI, `server/app.mjs`, Node 24 target, Node platform, ESM format, explicit pinned root tsconfig, minimal production child environment and the existing five externals (`pg-native`, `pg-cloudflare`, `bufferutil`, `utf-8-validate`, `bcrypt`). No JavaScript build plugins, app code, native binding or database code is executed. The compiler reads source; its produced bundle is never started by this command.

The resolved input path policy is checked before content hashing. General redaction remains unchanged. The exact es5-ext exception does not admit arbitrary # filenames, sensitive files, out-of-workspace resolutions or unknown compiler namespaces. Filesystem checks detect observed drift without locking out concurrent edits and do not form an operating-system sandbox.

### R11C local qualification

Twenty-two full-driver fixture cases PASS using temporary repositories and an inert pinned compiler stand-in. They cover successful two-build packaging of the exact reviewed # inputs; missing/drifted retained metadata and unexpected rejected-set refusal before compilation; source/dependency/worktree drift; changed input closure; compiler failure; nonrepeatable output; native symlink refusal; and private symlink refusal before private file contents are opened. Real fixture Git index changes are distinguished from unchanged staged-entry/flag hashes and still refused. Detailed before/after snapshots and comparison files are saved with mode 0600 on successful and failed-preservation cases. Existing unrelated changes, served outputs, packages and secrets remain preserved in the controls.

Independent review found no blocking defect in the bounded correction. Node/Bash syntax, exact embedded-driver identity and unchanged existing pins/compiler arguments/general public-path policy/packaging block all PASS. The nine supplied public path hashes were independently recalculated and matched. These were orchestrator tests and source/path proof at preparation time. The later user-supplied R11C run failed with ENOENT before starting any compiler; its actual preservation check passed.

If an individual final pinned-file read fails, pinned-after.json may be unavailable, but the independent detailed worktree snapshot is still attempted and the specific preservation failure is reported. This limitation does not permit a pass.

### Actual R11C result

| Observation | Result |
|---|---|
| Command file SHA-256 | `8433b365c4c630945ff850d1cd0f5266dbc1db4c73d0594c5fe36bfc8db165e2`; user checksum PASS |
| Report time | `2026-09-08T02:47:24.734Z` |
| Failed gate | `UNEXPECTED_DRIVER_FAILURE`, `ENOENT`; path/syscall omitted |
| Compiler processes | 0 |
| Current preservation | PASS; no changed components/files |
| Retained-input preflight | Not completed in the supplied output |
| Application / install / database / deploy | None reported |
| Candidate qualification | Incomplete |

## R11D fresh candidate contract

Issue: `RELEASE-PIPELINE-PROVENANCE-001`. Bounded repair owner: candidate build orchestration. Confirmed design defect: a new candidate depends on an older temporary report, and unexpected errors omit their operation/path. Exact historical ENOENT path remains unknown. No application source or release dependency is changed.

| Step | Required evidence |
|---|---|
| Existing baseline | Same 32 source/tool/lock/artifact pins, Node version, branch/HEAD and installed compiler |
| Discovery compilation | Pinned native CLI writes a private server bundle and fresh metafile; no old report reads |
| Input review | Current input names and resolved paths accepted; required repaired auth inputs match pins; ancestor package/config metadata observed |
| Second compilation | Same manifest identities and matching server bundle hash; discovery and qualification evidence saved separately |
| Packaging | Current canonical SQL copied with exact hash; bcrypt/node-gyp-build source trees and copies verified |
| Current preservation | Pinned files, observed inputs, copied native sources and detailed Git/worktree snapshots unchanged |
| Failure reporting | Phase, safe path label and allowed syscall/error code retained; attempts distinguished from started processes; final summary-write failure still produces stdout and nonzero exit |

The exact four es5-ext source paths and nine ancestor configuration candidates remain the only extra # paths the reader accepts. R11D does not require all 13 paths to appear: the earlier exact-set comparison described a historical report, not every valid current build. Unexpected # paths are still rejected. The metafile object/count/key-length/depth limits were moved into the current input reader when the historical reader was removed.

The compiler contract, required auth paths, all 32 pins, general private/public path rules and schema/native packaging block were compared byte-for-byte against R11C and remain unchanged. Both compiler passes use the same output path and arguments in a newly created private directory. This demonstrates same-machine repeatability only; it does not demonstrate clean-install reproduction, package integrity for every transitive dependency, runtime behavior or publication readiness.

### Local R11D qualification

All 22 full-driver fixture cases passed using temporary Git repositories and an inert pinned compiler stand-in. Coverage includes fresh two-pass success without any retained report; a valid subset of the exact # paths; unreviewed/private/escaping inputs; private symlink refusal before driver content reads; pinned/source/dependency/native/unrelated worktree drift; changed second-pass closure; compiler failure; bundle mismatch; empty output metadata; configured Git clean-filter non-execution; raw-index-only drift; compiler launch ENOENT with one attempt and zero started processes; and final evidence-write ENOENT/EIO with structured stdout and prior-error preservation.

The fixture suite caught the Node `spawnSync` syscall naming detail and the driver now normalizes it to `spawn`. Independent review caught the previously unhandled final report write; it is now caught and reported. The final independent review approved the bounded candidate workflow. Bash/Node syntax, embedded-driver identity and preserved-contract comparisons pass. These tests do not execute esbuild, the MMHB application or native bindings. The subsequent actual R11D results are recorded below.

Verification source files and a review record are retained in `MMHB-R11D-Verification.zip`. They are preparation evidence; the only file needed for the Replit handoff is the command below.

### Actual R11D results

| Observation | First run, 03:07:14.668 UTC | Second run, 03:13:59.491 UTC |
|---|---|---|
| Report | `/tmp/mmhb-server-candidate-r11d-7GyDAz` | `/tmp/mmhb-server-candidate-r11d-SRSfZ5` |
| Discovery and qualification compilations | Both completed | Both completed |
| Server bundle hash and observed inputs | PASS | PASS |
| Canonical SQL and 47 native file copies | PASS | PASS |
| Final preservation | FAILED: one ledger file changed | PASS: zero changed files/components |
| Final status | `SERVER_CANDIDATE_FAILED` | `SERVER_CANDIDATE_ONLY_NOT_RELEASE` |

Current successful candidate evidence:

- Server bundle: 5,555,689 bytes; SHA-256 `06f22097601e3bdc695f5dfa07d2f84b72f76a13cd3e8a4e3dc984eb389b79e5`.
- Canonical SQL: 41,651 bytes; SHA-256 `e92e18c4d6bbfdf6faef7760e1116aa786b7b9dddc266db37c2f03998913e712`.
- Bundled inputs: 1,279. Observed paths: 2,518. Input-manifest SHA-256 `9f330a1ada87eca0e9872144311b9ea197dc777c81b1cef80539639f486c1c2f`.
- Native-copy manifest: 47 files; SHA-256 `216668ea2ec29526a3515960c9727ecc5d2d46f4796744e5b7b00ad913c74ff0`.
- Native files were copied and hashed, not loaded. No application, database, browser, OIDC or deployment qualification occurred.
- `@react-email/render` appears among external imports. Check its runtime reachability and availability when assembling the release; this listing alone does not prove a startup failure.

Keep the successful R11D report and candidate available for subsequent assembly. R12 does not read it or overwrite it. Do not rerun completed server work simply to repeat a passing result.

## R12 private frontend candidate contract

Issue: `FRONTEND-CANDIDATE-001`. The missing outcome is a current frontend build with its emitted local assets accounted for. The bounded owner is build orchestration. Current application source, dependency versions, lockfile and served files remain unchanged.

| Step | Required evidence |
|---|---|
| Baseline | Current Node/HEAD/branch; all 32 prior pins plus nine reviewed frontend config/tool pins |
| Source observations | Before/after contents for client (excluding existing dist and nested node_modules), shared and attached_assets; private paths and symlinks refused |
| Build-tool observations | Before/after complete trees for eight selected build packages; package metadata recorded separately from full dependency qualification |
| Configuration | Native import of the pinned root Vite JS config; preserve React options/aliases/chunks; identical inline PostCSS plugins; private output, visualizer and cache; environment-file loading disabled |
| Compilation | One Vite build with installed dependencies in a minimal production child environment; output/error logs private; timeout applies to the child |
| Graph observations | Module/watch information recorded; physical paths qualified after compilation; virtual/unresolved identifiers explicitly counted |
| Output checks | Nonempty HTML, JavaScript entry and CSS; all emitted files and listed local chunk/CSS/asset references exist; quoted HTML script/stylesheet/modulepreload references checked |
| Preservation | Pins, completed selected source/tool baselines, post-build physical graph observations and current Git/worktree compared; incomplete baselines report partial scope |
| Reporting | Safe failure phase/module/path labels; raw build messages stay in the private log; final evidence-write failure produces nonzero status and structured stdout |

The command redirects both known output locations, `client/dist` and `bundle-report.html`, plus the build cache. Its reviewed Vite configuration is imported directly with Node; Vite's config-file loader is disabled. PostCSS receives the reviewed Tailwind/autoprefixer options inline, preventing a separate automatic PostCSS config search. Working directory stays at the workspace so source discovery retains its normal context.

R12 executes build-tool and plugin code. Redirecting outputs and passing a minimal environment are not operating-system filesystem/network isolation. Selected source and tool trees are compared before and after; other physical graph inputs are first observed after the build. This is not complete pre-build transitive provenance. No package manager, install hook, MMHB application server, database code, browser, native bcrypt load or publication step is invoked by the command.

Only public VITE variable names found by a lexical source scan are reported; their actual environment values are neither read for reporting nor forwarded. Required deployment-specific public configuration still needs review. CSS diagnostics are lexical observations; nonempty CSS alone cannot prove correct Tailwind utilities, responsive layout, accessibility or browser appearance. External asset references are counted without fetching them. Service-worker cache behavior remains open.

### Local R12 qualification

The parent suite has 32 passing cases using temporary Git repositories and an inert embedded Node child. It covers current metadata with dependency alignment still pending; source/tool/served/unrelated drift; private source, graph and symlink boundaries; missing and empty entry outputs; missing regular/dynamic imports, CSS, non-entry chunks and HTML references; virtual/query graph identifiers; inherited-secret exclusion and private error redaction; final evidence-write failure; and Git clean-filter non-execution.

Independent review demonstrated two defects before delivery: an empty JS entry could be accepted, and incomplete snapshots could still receive a full-scope preservation label. Both are fixed, and the fixtures now assert the corrected outcomes. Bash and Node syntax and both embedded source identities pass. Six child-runner fixtures pass for success, absent CSS, changed resolved environment loading, changed visualizer configuration shape, rejected output traversal and missing module-graph support. They exercise the real child against inert API stubs. The targeted reviewer confirmed both parent corrections after the fixtures passed. These controls do not execute the actual installed MMHB Vite dependency tree and cannot establish real frontend compilation or browser behavior.

### Actual R12 result

Observed at `2026-09-08T03:48:52.677Z` in `/tmp/mmhb-frontend-candidate-r12-uAOF8r`:

| Item | Result |
|---|---|
| Candidate | `FRONTEND_CANDIDATE_FAILED` |
| Causal owner | Parent driver `treeManifest` rejects every symbolic link, including nested dependency bin links |
| Failed path | `node_modules/postcss/node_modules/.bin/nanoid` |
| Phase | `SOURCE_AND_TOOL_SNAPSHOTS` |
| Build attempts / started processes | 0 / 0 |
| Pins, selected sources, current Git/worktree | Preserved; zero changed files/components |
| Tool tree | Incomplete baseline; full scope unobserved |
| Package/source edits, installs, app/DB execution, deployment | None reported |
| Extra observed tool metadata | Autoprefixer installed/locked 10.5.4; package SHA-256 `e25bb75b3d5a4036136d54ab7277ea2908c8334a003a0413240d66b3c289d1b3` |

npm's default executable-link behavior explains why rejecting every dependency symlink is not a suitable general snapshot rule. It does not prove this particular link target is correct, who created it, or the package's provenance. R12A therefore validates the actual current link and target rather than inferring or hardcoding an unobserved target.

## R12A bounded executable-link observations

Same issue: `FRONTEND-CANDIDATE-001`. This changes only candidate orchestration's tool-tree observation and reporting. The application, all 41 pinned identities and embedded frontend build-runner bytes stay unchanged.

| Boundary | R12A behavior |
|---|---|
| Eligible source | A symbolic link directly in `node_modules/.bin` inside one of the eight selected tool trees |
| Link contents | Read as raw bytes; valid UTF-8 round-trip; bounded size; relative `../` plus a nonprivate suffix with no additional dot/traversal or .bin segments |
| Target | Inside the same owning node_modules directory, regular file, no target/ancestor symlinks; checked before reading target contents |
| Consistency | Link literal hash, byte count and mode, plus target identity; link stat/raw bytes rechecked after target observation; complete tool manifests compared before/after build |
| Other links | Source/output links and other tool-tree links remain refused |
| Execution | The link observer executes no linked binary and changes no link or package |
| Qualification limit | Contained file-link observations, not npm-origin authenticity or complete lockfile/transitive qualification |

The change prevents a conventional nested bin link from automatically stopping the build while retaining explicit boundary checks. Absolute targets, inner `..`, private names, .bin targets, dangling targets, directories, malformed encoding and symlink chains are rejected. The before/after checks are observations, not a lock against concurrent editors or operating-system isolation.

### R12A local qualification

All 55 full-parent fixture cases passed: the prior 32 controls plus 23 executable-link cases. Added cases cover a valid nested nanoid link, a scoped package target, target-content/mode changes, literal retargeting and changes during observation, plus absolute/private/escaping/.bin/dangling/directory/chained/ancestor-symlink targets, malformed UTF-8, hidden command names and inner dot/traversal segments. Private-target content reads are intercepted to verify refusal before reading. Source and output link protections remain covered. Exact stdout is retained in the verification kit.

The unchanged child-runner code retains its six previously passing inert API control cases. The new command's embedded parent and child identities, unchanged 41 pins and Bash/Node syntax pass. Independent review of the targeted R12-to-R12A diff found no remaining blocker in this repair. Local tests use synthetic repositories and an inert child, not the actual installed MMHB Vite tree. They cannot establish frontend compilation, native ABI, browser rendering, database recovery or deployed behavior.

### Archived R12A handoff — completed; superseded by R13

1. Download **MMHB-FRONTEND-CANDIDATE-R12A.txt** and upload it unchanged into `/home/runner/workspace`.
2. Let uploads and edits finish. Keep editors, builds and automation from changing files during this run, including the readiness ledger.
3. Run the following command once; no Replit AI is needed.
4. Return the complete terminal output. Keep the private raw build log local and retain the reported candidate directory.

```bash
cd /home/runner/workspace &&
printf '%s\n' '9e8d5547fd375ece98c969c3876d38fccd931e1960cbe726e6b439aa660d5f46  MMHB-FRONTEND-CANDIDATE-R12A.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-FRONTEND-CANDIDATE-R12A.txt
```

Expected success: `STATUS=FRONTEND_CANDIDATE_ONLY_NOT_RELEASE`, one started build process, frontend output/reference checks PASS and full observed preservation PASS. Tool-link observations show the accepted current link/target hashes. A failed gate is returned for analysis, not bypassed. The frontend, visualizer and cache remain directed into a new private report directory; the complete release is not assembled or deployed by this command. R12A needs no older temporary report to start. Keep the passing R11D candidate available for later assembly.

## Actual R12A frontend result

| Observation | Result and limit |
|---|---|
| Time and report | September 8, 2026 04:15:31.807 UTC; `/tmp/mmhb-frontend-candidate-r12a-CaA16N` |
| Build | One Vite build completed; frontend candidate only |
| Output tree | 554 files, 33,761,688 bytes; this is the entire tree, not a visitor's initial download |
| Output manifest | SHA-256 `019aad45ce6bf81dfdc438a9cf870a2e535ae8e19259cfbc39d76760edd9aa05` |
| Index | 10,568 bytes; SHA-256 `957f6d802cda8b8fc0b5b4f0a7ce429a26d6a27638399e787e0de5f368bea393` |
| Emitted references | 2968 local, zero external in the bounded scan; not a browser/network check |
| Inputs | 3142 observed physical, 12 virtual, one unresolved; no complete transitive pre-build provenance claim |
| CSS | Main stylesheet 443,964 bytes; inspected outputs have no directive-residue candidates; visual fidelity/accessibility remain untested |
| Public configuration | Six VITE names observed, no values read or forwarded; actual required values unqualified |
| npm link | Nested PostCSS nanoid link and contained target identities recorded; executable not invoked by the observer |
| Preservation | No observed sources, selected tools, pins or current Git/worktree changes |
| Runtime/deployment | Application, database and browser not started; no deployed-artifact proof |

The accepted nanoid link targets `node_modules/postcss/node_modules/nanoid/bin/nanoid.cjs`. Link SHA-256: `2040ad22e6a1cdc7697237756555725d76688044d1a0efc2fe27436ae2c32cf6`; target SHA-256: `e4eb9be1a3e3feb3f8979ef08c3bf3ef8430f4f22df9c4e427353a1577accbe8`. This resolves R12's concrete snapshot compatibility issue.

The observed public names are `VITE_API_URL`, `VITE_FIGMA_EMBED_URL`, `VITE_GA_MEASUREMENT_ID`, `VITE_OPENWEATHER_API_KEY`, `VITE_SENTRY_DSN` and `VITE_STRIPE_PUBLISHABLE_KEY`. A variable name does not establish that it is required for launch, correctly configured or suitable for exposure. Review actual uses before choosing configuration; do not paste secrets into the report.

## R13 core assembly and native compatibility contract

| Item | Definition |
|---|---|
| Issue | `CORE-CANDIDATE-ASSEMBLY-001` |
| Input server | Passing R11D `/tmp/mmhb-server-candidate-r11d-SRSfZ5/candidate` |
| Input frontend | Passing R12A `/tmp/mmhb-frontend-candidate-r12a-CaA16N/frontend` |
| New output | A new private `/tmp/mmhb-release-assembly-r13-*/candidate` |
| Core layout | `server.mjs`, `schema.canonical.sql`, `client/dist/` and copied `node_modules/bcrypt` / `node_modules/node-gyp-build` |
| Expected files | 603: server + schema + 47 native-package files + 554 frontend files |
| Qualification | Pinned manifests/artifacts, exact copy identities, required index/service-worker layout, server syntax, copied native load and synthetic hash comparisons |
| Child environment | Minimal production environment; no inherited native overrides, NODE_OPTIONS or NODE_PATH |
| Preservation | Current 41 pins and Git/worktree, retained reports/artifacts and assembled files checked before/after |
| External packages | CommonJS resolution inventory only; missing/optional/ESM reachability not qualified |
| Success label | `CORE_CANDIDATE_ASSEMBLED_NATIVE_PASS_NOT_RELEASE` |
| Application boundary | No server import/start, application HTTP, database code, package install, source edits, credential changes, Git mutation or deployment |

The source app hash matches the current pinned `server/app.mjs`. It resolves frontend files relative to the server bundle under `client/dist` and has a legacy service-worker route requiring `serviceWorker.js`. Its startup path also opens a listener and invokes schema initialization. R13 therefore uses Node's syntax-only mode for the server and a separate native dependency runner. A passing syntax check cannot prove module resolution or startup behavior.

The native runner resolves bcrypt and node-gyp-build from the new candidate, selects a `.node` binary inside the copied bcrypt package before importing bcrypt, and guards subsequent native loading against a different selection. It refuses fallback outside that package. A synthetic cost-4 hash, correct-password comparison, incorrect-password denial and rounds check exercise the copied package. Cost 4 is a test setting only; no production password-hashing setting is changed. Runtime version/platform/architecture, selected candidate-relative paths and results are recorded without the sample or hash.

Required runtime content remains open. Additional remote module review identified working-directory references to `ai/{healing,business}`, `prompt-os-kernel` and `content/blog`, plus an opt-in scheduler script. Those module bytes have not yet been matched to the current Replit baseline; these are review leads, not permission to copy another platform's content or proof that every listed path is reachable. R13 explicitly produces a core candidate, not a complete runtime content package.

The driver returns structured native failure phase/code if the child fails, and keeps raw logs private. A failed preservation or evidence-write gate prevents overall success even if a prior subcheck passed. Private directories and minimal environments are not an operating-system filesystem/network sandbox. Current observations do not repair missing historical R11A evidence or lock other editors out.

### R13 local qualification

**42 parent-driver fixtures PASS** using disposable synthetic repositories/artifacts and an inert native child. Cases cover exact layout/hashes/modes, pin and manifest mismatches, unsafe paths/symlinks, missing required assets, syntax/native failures, safe native failure diagnostics, unchanged-file requirements, evidence-write failures and inherited child-environment controls.

**28 native-runner fixtures PASS** using a JavaScript substitute for the native extension. Cases cover package and binding containment, loader host fallback, changed second resolution, synthetic hash/comparison behavior, environment/argument boundaries and safe failures. They verify control flow, not actual native ABI compatibility.

Bash and both Node sources parse. Embedded parent/child identities and unchanged 41 R12A pins pass. Independent review found and resolved missing native failure diagnostics; the final revision passed review. Exact source, fixture scripts/results, command and preparation identities are retained in **MMHB-R13-Verification.zip**. That local preparation preceded the successful Replit R13 execution recorded below.

### Archived R13 handoff — completed; R14 is the current command

1. Download **MMHB-RELEASE-ASSEMBLY-R13.txt** and upload it unchanged into `/home/runner/workspace`.
2. Keep the successful R11D and R12A report directories available. Let file uploads and edits finish, then keep editors/builds/automation from changing the workspace during the check, including this ledger.
3. Run this command once; no Replit AI is needed.
4. Return the full terminal output. Keep raw logs local and retain the new candidate and report directory.

```bash
cd /home/runner/workspace &&
printf '%s\n' 'e44470397f4ef416c082fe2a30e5ebc7d6a65084e6b61ed2003def3fd6f89345  MMHB-RELEASE-ASSEMBLY-R13.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-RELEASE-ASSEMBLY-R13.txt
```

Expected bounded success: `STATUS=CORE_CANDIDATE_ASSEMBLED_NATIVE_PASS_NOT_RELEASE`, 603 assembled files, syntax and copied-native checks PASS, observed inputs/candidates preserved. A changed/missing retained artifact or failed native check is returned for analysis. Do not edit pins, copy old served outputs over the candidate, or suppress a gate to obtain success.

## Actual R13 assembly and native result

| Observation | Result and limit |
|---|---|
| Time | September 8, 2026 04:46:43.087 UTC |
| Candidate | `/tmp/mmhb-release-assembly-r13-1kpDjX/candidate` |
| Artifact tree | 603 files, 40,479,641 bytes; total tree size, not page payload |
| Assembly manifest | SHA-256 `1095b15223d1fa650535017c44c24ecc2a2018c018759026e3a29dbf42820dd2` |
| Native runtime | Node v24.13.0, Linux x64; module ABI 137, N-API 10 |
| Packages | bcrypt 6.0.0; node-gyp-build 4.8.4 |
| Actual loaded binding | `node_modules/bcrypt/prebuilds/linux-x64/bcrypt.glibc.node` inside the new candidate |
| Native checks | Selected binary loaded; synthetic hash, correct password, wrong-password denial, cost-4 test rounds and require-cache containment all PASS |
| Loaded files | Six candidate-local modules including the native binary |
| Syntax/native processes | Each started once and exited 0; no signal/timeout |
| Preservation | Zero observed changes; sources, selected pins, retained candidates and assembled files preserved |
| Exclusions | No build repeated, package installed, app imported, HTTP request, DB connection/write, source edit, Git mutation or publication |

The five unresolved CommonJS names were `@react-email/render`, `bufferutil`, `pg-cloudflare`, `pg-native` and `utf-8-validate`. `bcrypt` resolved inside the candidate and worked. CommonJS absence alone does not prove that a package is required in the selected Node runtime, used by an enabled feature, or unavailable through a different resolution condition.

## R14 targeted runtime contract

| Item | Definition |
|---|---|
| Issue | `RUNTIME-ASSET-AND-DEPENDENCY-CONTRACT-001` |
| Preserved candidate | Passing R13 603-file artifact tree and exact manifest |
| Retained compiler evidence | Passing R11D input manifest SHA-256 `9f330a1ada87eca0e9872144311b9ea197dc777c81b1cef80539639f486c1c2f` |
| Source checks | Four runtime asset consumers, six selected ws/pg sources and five selected MMHB email/database consumers |
| Package metadata | Nine selected packages; installed versus root lock and optional hidden installation-lock metadata |
| Asset checks | 31 explicit paths: 22 AI files, eight kernel references and one blog index; no recursive copy |
| Registries | Healing/business JSON structure, safe approved IDs, duplicates, risk/audience labels and required-file availability |
| Shell flags | Presence/nonempty/exact-lowercase-true booleans for four named nonsecret flags; no raw values |
| Writes | Only a new private `/tmp/mmhb-runtime-contract-r14-*` report directory |
| Success | `RUNTIME_CONTRACT_EVIDENCE_COMPLETE`; releaseReady remains false |
| Failure | Changed/missing pinned candidate or failed read/preservation/evidence gate yields `RUNTIME_CONTRACT_EVIDENCE_FAILED` |

Unknown source hashes and absent selected runtime assets are reported as review findings. They do not inherit the reviewed behavior classification. File presence in the retained compiler input list means it was listed as a build input; it does not prove retained code contribution, runtime reachability or that every caller is covered. An asset containing legacy branding is reported as such only when current bytes match the exact reviewed remote asset.

At reviewed upstream versions, ws catches missing optional binary helpers and retains its JavaScript/builtin paths. pg normally uses its JavaScript implementation, but explicit native selection or a Cloudflare runtime branch changes the requirement. Selected remote MMHB email callers use HTML/text payloads. Resend's upstream TypeScript conditionally imports its renderer for React payloads; its installed distribution has not been retrieved and reviewed. R14 keeps that distinction explicit instead of using TypeScript-source hashes for installed JavaScript.

The flags inspected are `NODE_PG_FORCE_NATIVE`, `WS_NO_BUFFER_UTIL`, `WS_NO_UTF_8_VALIDATE` and `HEAL_AUTO_ENABLED`. A nonempty value such as the string `false` is truthy for code using a truthiness check. R14 records booleans without changing values, and does not equate the current Shell environment with deployment configuration.

Registry checks are structural. They do not validate clinical claims, guarantee effective crisis handling, enforce roles or prove privacy boundaries. Remote kernel code contains fixed passing health entries; those must not be used as operational enforcement evidence. Self-heal scripts remain unexecuted and unqualified.

### R14 local qualification

**37 pure-helper fixtures and 29 orchestration fixtures PASS.** Cases cover source/current/compiler-input distinctions, installed/root/hidden-lock metadata, malformed JSON, registry traversal/redaction, missing assets, candidate and selected-file symlinks, source/pin/report/candidate/worktree drift, and final evidence-write failures. Orchestration fixtures use inert disposable repositories; application/dependency/native/database/network code is not executed.

Node and Bash syntax, exact embedded driver/helper identities and unchanged 41 baseline pins PASS. Independent integration review passed. The complete source, tests, results and preparation identities are included in **MMHB-R14-Verification.zip**. Actual R14 execution in Replit is pending.

Terminal output is a compact summary. The detailed metadata remains in `runtime-contract-evidence.json` inside the private report directory; the terminal includes its SHA-256 and size. Neither output includes raw prompt/source text or credential values.

### Run R14 in Replit Shell

1. Download **MMHB-RUNTIME-CONTRACT-R14.txt** and upload it unchanged into `/home/runner/workspace`.
2. Keep `/tmp/mmhb-release-assembly-r13-1kpDjX` and `/tmp/mmhb-server-candidate-r11d-SRSfZ5` available. Finish uploads/edits before execution; avoid concurrent workspace changes during the check.
3. Run this command once. No Replit AI is needed.
4. Return the full terminal output; retain the report directory. No raw source/prompt text or credentials are requested.

```bash
cd /home/runner/workspace &&
printf '%s\n' 'ceac8223c082d12e95f1290f0fe790e720af5aa0e77912ea0c67e99f654ddb40  MMHB-RUNTIME-CONTRACT-R14.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-RUNTIME-CONTRACT-R14.txt
```

Expected evidence success: `STATUS=RUNTIME_CONTRACT_EVIDENCE_COMPLETE` and observed-input/R13-candidate preservation PASS. Source mismatches, registry problems, missing assets and package differences remain visible as findings. Do not suppress a gate, alter the lockfile manually, or install missing external packages merely to hide those findings.

### Subsequent release order

1. Run R14 once to establish the current runtime asset/dependency contract and choose a repair from the actual findings.
2. Complete the selected runtime assets and MMHB-only content/brand correction; qualify external dependency reachability and a reproducible package-install/build procedure resolving the React-plugin mismatch.
3. Qualify startup with an isolated test database and candidate working directory, then browser/account/private-feature and relevant AI/safety acceptance.
4. Prove backup/restore, effective deployment configuration and rollback; publish the qualified MMHB artifact and verify its version/behavior on the MMHB domain.
5. Expand the evidence library, calendar assistant, teaching content/presentations, books/affiliates, trend analysis and provider integrations.

## Evidence sources

- User-supplied R13 output, September 8, 2026 04:46:43.087 UTC: exact assembled manifest and 603-file count; actual candidate-local bcrypt compatibility; preservation and zero application/database/deployment actions.
- Reviewed MMHB runtime consumers and 31 explicit assets fetched from the existing MMHB repository; reviewed upstream ws/pg source tags and selected MMHB email/database consumers. Exact hashes, URLs and scope notes are retained in MMHB-R14-Verification.zip; current Replit matches pending.
- [Official ws package documentation](https://www.npmjs.com/package/ws) and [node-postgres native-bindings documentation](https://node-postgres.com/features/native), accessed September 8, 2026: optional/native implementation context, not current MMHB reachability proof.

- User-supplied R12A output, September 8, 2026 04:15:31.807 UTC: passing frontend build/local references and observed preservation; exact manifest/index/link identities; configuration/alignment/runtime limitations.
- Exact pinned app/build-server source reviewed for bundle-relative frontend layout and startup side effects; R13 independent review and retained inert fixture results in MMHB-R13-Verification.zip.
- [Official Node.js syntax-check option](https://nodejs.org/api/cli.html#-c---check), accessed September 8, 2026: syntax checking without execution. General option semantics do not prove MMHB runtime behavior.

- User-supplied R12 output, September 8, 2026 03:48:52.677 UTC: exact TREE_SYMLINK path, zero build attempts/processes, preserved pins/source/Git and explicitly unobserved tool tree.
- Exact delivered R12 parent code: unconditional symlink rejection in treeManifest, reached through toolTrees before compilation. The root cause is in the verifier's tool-tree compatibility rule; no failed Vite execution was observed.
- [Official npm bin-links setting](https://docs.npmjs.com/cli/v11/using-npm/config/#bin-links) and [package.json bin documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#bin), accessed September 8, 2026: npm creates executable links by default. These are general installation semantics, not validation of the Replit link target.
- R12A targeted fixture and review evidence is retained in MMHB-R12A-Verification.zip.

- User-supplied R11D results at September 8, 2026 03:07:14.668 and 03:13:59.491 UTC: first ledger-only preservation failure; second full bounded server-candidate success.
- Local R12 parent fixtures: 32 PASS; separate child-runner controls, independent review, Bash/Node syntax and embedded source identity checks recorded in MMHB-R12-Verification.zip.
- [Official Vite shared options](https://vite.dev/config/shared-options), [configuration documentation](https://vite.dev/config/), and [Vite 8.0.0 config source](https://github.com/vitejs/vite/blob/v8.0.0/packages/vite/src/node/config.ts), accessed September 8, 2026: environment-file loading controls, inline PostCSS and config/cache behavior. Actual installed Vite 8.0.16 execution is now reported successful by R12A within its documented scope.
- [Official npm ci documentation](https://docs.npmjs.com/cli/v11/commands/npm-ci/), accessed September 8, 2026: clean installation replaces node_modules. R12 does not invoke it against the working workspace.

- User-supplied R11C output at September 8, 2026 02:47:24.734 UTC: ENOENT before compiler launch, current preservation PASS, no candidate qualification.
- Exact delivered R11C driver: mandatory retained R11A metafile read before compilation; generic catch did not retain filesystem syscall/path.
- [Official Node.js error codes](https://nodejs.org/api/errors.html#enoent-no-such-file-or-directory) and [official esbuild metafile documentation](https://esbuild.github.io/api/#metafile), accessed September 8, 2026. These explain error semantics and current build metadata, not the missing path or runtime state in MMHB.
- Local R11D full-driver fixture suite: 22 PASS with inert compiler; independent source review; syntax and preserved-contract comparisons PASS. Actual Replit R11D results are now recorded above.

- User-supplied R11B output, September 7, 2026 23:55:58 UTC: all 32 pins matched, current Git/worktree stable, retained identities recorded, 13 rejected paths.
- Exact local SHA-256 calculations match the supplied path hashes for es5-ext array/#/e-index-of.js, string/#/contains/index.js and seven printed configuration candidates.
- Official [memoizee get-1](https://github.com/medikoo/memoizee/blob/main/normalizers/get-1.js), [get-fixed](https://github.com/medikoo/memoizee/blob/main/normalizers/get-fixed.js) and [get](https://github.com/medikoo/memoizee/blob/main/normalizers/get.js), fetched through GitHub: direct import of es5-ext/array/#/e-index-of.
- Official [es5-ext e-index-of](https://github.com/medikoo/es5-ext/blob/main/array/%23/e-index-of.js) and [contains entry](https://github.com/medikoo/es5-ext/blob/main/string/%23/contains/index.js), plus its is-implemented.js and shim.js dependencies and README, fetched through GitHub September 8, 2026. Path legitimacy only; remote bytes are not installed-byte pins.

- User-supplied R11A output, September 7, 2026 23:10:02 UTC: one compilation; original path rejection and final Git/worktree mismatch.
- Exact local delivered R11A driver: initial snapshot held in memory; final pinned comparisons before the aggregate snapshot comparison; no initial snapshot written.
- [Official Git index format](https://git-scm.com/docs/gitformat-index), accessed September 7, 2026: stat fields and cache extensions.
- [Official Git ls-files](https://git-scm.com/docs/git-ls-files) and [esbuild metafile option](https://esbuild.github.io/api/#metafile), accessed September 7, 2026: current index projections and static build metadata.

- User-supplied R11 output, September 7, 2026 22:58:35 UTC: first real compiler completed before root-jsconfig gate; preservation reported PASS.
- [Official esbuild v0.28.2 resolver source](https://github.com/evanw/esbuild/blob/v0.28.2/internal/resolver/resolver.go), fetched through GitHub; explicit config selection and sibling precedence inspected.
- [Official esbuild tsconfig option](https://esbuild.github.io/api/#tsconfig), accessed September 7, 2026: explicitly selecting the build configuration.

- User-supplied successful R2, R4, R5, R6, R7, R8 and R9 terminal outputs; latest R9 observed September 7, 2026 21:31:18 UTC.
- Current source bytes matched against the supplied SHA-256 pins, plus exact official dependency code used for the synthetic header tests.
- [Express CORS middleware documentation](https://expressjs.com/en/resources/middleware/cors/), accessed September 7, 2026: CORS controls browser response access; `origin:false` disables CORS permission without blocking application requests.
- [OWASP CSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) and [HTML5 security guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html), accessed September 7, 2026: use selected trusted origins and retain separate CSRF protection.

- [Passport logout documentation](https://www.passportjs.org/concepts/authentication/logout/), accessed September 7, 2026: POST/DELETE logout and callback error handling.
- [Official Passport request source](https://github.com/jaredhanson/passport/blob/v0.7.0/lib/http/request.js) and [session-manager source](https://github.com/jaredhanson/passport/blob/v0.7.0/lib/sessionmanager.js), retrieved September 7, 2026; matching 0.6.0 sources also reviewed.
- [Express session documentation](https://expressjs.com/en/resources/middleware/session/), accessed September 7, 2026, for session destruction, regeneration and cookie semantics. General documentation does not prove installed behavior.

- [npm Scripts documentation](https://docs.npmjs.com/cli/v11/using-npm/scripts/), accessed September 7, 2026: npm run pre/post hooks and lifecycle behavior.
- [Vite build options](https://vite.dev/config/build-options) and [esbuild API](https://esbuild.github.io/api/), accessed September 7, 2026: output configuration and build metadata facilities.
- Exact remote build/config source fetched from `TheGenuineLoveProject/MyMentalHealthBuddy`, branch `integration`, September 7, 2026; R10A confirms exact current hashes for the selected reviewed build/config sources; other remote bytes are not treated as the Replit source.

## Minimum working release

Complete the required evidence for the features actually exposed. Preserve a small coherent release rather than treating every future idea as a launch prerequisite.

| Release area | Required outcome | Evidence still needed |
|---|---|---|
| Public entry and help | Clear home/navigation, help/crisis access and accurate service limitations | Current route/content and accessibility checks |
| Account journey | Registration, sign-in, recovery, refresh and logout work without unexpected session loss | Current client/server contract and authorized behavior tests |
| Private features | Dashboard and advertised journal/mood/settings actions work with correct ownership | Cross-account read/write denial and core-path tests |
| AI interaction | Advertised chat works with privacy, crisis/safety handling, failures and cost limits | Relevant evals and integration tests |
| Operations and data | Qualified schemas, backup/restore, readiness/error visibility and recovery plan | Approved test-environment evidence |
| Build and publication | Exact source-to-artifact provenance, correct app/domain, qualified runtime and rollback | Build/deployment procedure and final release evidence |

If a feature is unfinished, qualify a deliberate release restriction at both the UI and server entry points. A hidden button does not remove an exposed API risk. Billing, publishing and integrations need launch gates if enabled; otherwise retain them in the governed backlog.

Early health/readiness aliases in the reviewed app return fixed success responses. Those responses alone cannot prove database, authentication or AI readiness; qualify dependent services separately before launch.

Known remaining concerns include R9 browser/store/provider qualification, remaining header/exemption behavior, two-session logout isolation, refresh-generation races, alternate session-store fallback/reachability, privacy beyond this module, and data/operational readiness.

The Replit deployment declaration uses `NODE_ENV=production node dist/server.mjs`; development uses `server/app.mjs`. Effective deployed configuration and bundle identity remain unproven. Its configured build includes package installation and recursive removal of build outputs, so this command does not run it. Prepare a reviewed candidate/build path before publication.

## Completion and effort

**Reported source-level completed:** the static auth guard, R4 persistence, R5 canonical logging, R6 evidence collection, R7 CORS, R8 local-auth origin protection and R9 OIDC logout. **R10A:** collection and preservation complete. **R11/R11A:** each produced a first server compilation; neither produced a qualified complete candidate. **R11B:** current baseline and preservation PASS; exact path-policy cause identified from public path hashes. **R11C:** zero compiler processes, ENOENT, current preservation PASS. **R11D:** second actual run passes compilation, input/copy and current preservation checks; server candidate only. **R12:** stopped before compilation on a nested executable link; selected source/pin/Git preservation PASS, tool tree incomplete. **R12A:** actual frontend compilation, emitted local-reference checks and observed source/tool/Git preservation PASS. **R13:** actual 603-file assembly, server syntax, copied bcrypt native smoke and preservation PASS. **Prepared here:** R14 targeted runtime asset/dependency contract evidence; actual execution pending. Historical R11A drift remains unresolved. **Still incomplete:** complete packaging, runtime acceptance, data recovery and deployed verification.

There is no defensible updated overall completion percentage. The earlier roughly 75% figure lacked a complete acceptance denominator and should not be used as a launch metric.

Provisional remaining engineering estimate after the successful R13 assembly/native test: **approximately 27–61 hours**, excluding the larger content/integration expansion and external waiting time.

| Workstream | Planning range |
|---|---:|
| Remaining session/privacy work and durable regression coverage | 1.5–4 hours |
| CORS/CSRF policy and negative tests | 2–5 hours |
| Multi-session logout tests | 2–4 hours |
| Refresh-family/race work, if required | 6–12 hours |
| Artifact/configuration and authorized runtime qualification | 3–7 hours |
| Remaining exposed-feature release matrix and fixes | 12–29 hours |

The sum is 26.5–61 hours, rounded. The planning range is retained because the completed source units do not resolve the larger release-surface and runtime uncertainty. No measured hours were subtracted merely because another bounded gate passed. This is a low-confidence planning range, not a promise. Re-estimate when the exposed release surface and integration-test results are known; newly found blockers can move the range upward.

## Three reusable development prompts

### 1. Working-release engineer

Work on MyMentalHealthBuddy only. Use the latest verified source hashes and successful gate output as the baseline. Maintain an explicit list of features exposed in the first release and their acceptance evidence. Select one release blocker or one clearly bounded repair unit. State the causal owner, affected behavior, exact allowed files, tests, rollback and remaining uncertainty. Prefer deterministic Replit Shell work; use Replit AI only for a concrete blocker that cannot be addressed economically otherwise. Provide at most one transparent command, preserve user changes, and stop after its result. Never mark source, runtime and deployed qualification as interchangeable. Do not perform restricted operations without specific authorization. Queue unrelated feature expansion until the working release is qualified.

### 2. Independent security and reliability reviewer

Review the proposed MMHB change as an independent adversarial reviewer. Work from the supplied current source and test evidence. Check unauthenticated access, wrong account/role, ambient-cookie authentication with forged headers, missing/invalid CSRF, stale/replayed tokens, refresh/logout ordering, sensitive logging and failure recovery where relevant to this bounded change. Use synthetic data and approved isolated test seams; do not contact production services or write to real accounts/databases. Try to demonstrate a counterexample rather than declaring safety from a regex match. Report confirmed defects separately from plausible risks and missing evidence. Require preserved legitimate user flows, useful error handling and rollback. Approve only the tested scope; do not approve publication from source tests alone.

### 3. Governed content and trend builder — after release

Extend the existing MMHB content system after the release gates pass. Start with one bounded topic and existing CMS capabilities. Produce a source-backed educational draft, a plain-language explanation, a concrete example, a metaphor with its limits, an optional exercise, a teach-back question and a presentation outline. Distinguish established clinical evidence, emerging findings and optional philosophical/spiritual reflection; do not invent mechanisms or promise healing. Use supportive, autonomy-respecting language. For trend analysis, use only permitted public data or explicitly authorized exports; record source, date, platform, observation window, denominator and missing data. Treat engagement as a distribution signal, not proof of clinical benefit or causation. Create drafts for review before scheduling or posting, separate book/affiliate disclosures from educational claims, and apply cost limits. Do not install providers, expose personal health data, publish, send messages or change credentials without the relevant authorization.

## Boundaries retained

Keep MMHB separate from the other projects. Larger evidence libraries, calendar assistants, daily posting, presentations, books/affiliates and analytics remain planned work, not implemented integrations. Connected plugins do not establish functionality inside MMHB. No Replit AI, email sending, calendar writing, social posting or deployment occurred during preparation of this gate. The requested welcome illustration was generated as a separate draft; it has not been integrated into the site. `app_block` is not exposed here.

This ledger supersedes the R13 handoff. R14 is the current action. The completed builds, assembly and local native compatibility are recorded without a deployed-runtime claim. R9 source qualification, R10A evidence and R11B current preservation remain recorded; historical R11A drift remains unresolved. Publication and broader feature expansion remain pending. The entire platform is not claimed complete or working.
