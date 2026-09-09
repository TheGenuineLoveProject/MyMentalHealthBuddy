# Resend 6.22.1 published distribution review

This review supports MyMentalHealthBuddy R18 runtime dependency classification. It does not qualify the application, ESM bundle, email delivery, or deployment.

## Published bytes and provenance

On 2026-09-09, the version metadata and archive were retrieved directly from the official npm registry using bounded HTTPS reads. The archive agreed with the registry metadata's SHA-512 integrity and SHA-1 shasum. Four unique regular files were read from the archive in memory and written to explicitly named review files. No package manager, package installation, archive-wide extraction, or application execution was used.

| Published file | Bytes | SHA-256 |
| --- | ---: | --- |
| `dist/index.mjs` | 41,321 | `3b3514f7301900eb8614b05ef03d563b66e15d0b5b640a179fe8f7879553928c` |
| `dist/index.cjs` | 42,455 | `66659b52d6b3350895d34b8bc290ccf07e4ceb7a0f0625d1a70f3850baf11806` |
| `package.json` | 2,189 | `fe631b2af35f2ff912c6f45af326a05a7484fc03995c562d04bbc95400ef5304` |
| `LICENSE` | 1,076 | `299819a2f2d6ddefaf47dfd684242dd683f9d17c2d29edce08ba777b4c264a65` |

The 50,147-byte archive has SHA-256 `74b9554e2d48c913a79647dbd7661cf45fd88d232c37dc220f4b8c91f776e7b7`. The complete published entries, package metadata, MIT license, raw registry metadata, and a provenance record accompany this review. Registry digest agreement establishes consistency with this registry response; it is not independent publisher authentication or a vulnerability audit. Equality with Replit's retained installed files and linkage to R17B's actual compiler inputs require the separate R18 collector.

The package maps ESM imports to `dist/index.mjs` and CommonJS requires to `dist/index.cjs`. Both depend on `postal-mime` and `standardwebhooks`. The metadata declares `@react-email/render` as an optional peer dependency. Its absence alone does not establish that every email operation will fail.

## Reviewed renderer branches

The shared `render` helper dynamically imports `@react-email/render`. Import failure produces the SDK's missing-renderer error. The following five entry methods have renderer branches in the exact published distribution:

| Entry method | Renderer condition | Result when renderer is unavailable |
| --- | --- | --- |
| `emails.send` via `emails.create` | Truthy `payload.react` | Rejects before SDK POST |
| `batch.send` via `batch.create` | Truthy `email.react` on a batch member | Rejects before SDK POST |
| `broadcasts.create` | Truthy `payload.react` | Rejects before SDK POST |
| `broadcasts.update` | Truthy `payload.react` | Rejects before SDK PATCH |
| `templates.create` | Truthy `payload.react` when the returned thenable is awaited | Rejects before SDK POST |

For the reviewed HTML/text payloads with absent or false `react`, these methods do not call the renderer. No SDK environment flag bypasses a truthy `react` field in these branches. Successful HTML/text SDK transport preparation is narrower than successful API validation or email delivery; fields accepted by the remote API were not tested.

The five source regions for the render helper, batch, broadcasts, emails, and templates are byte-identical between the published ESM and CommonJS entries. Their individual hashes are recorded in `r18-resend-6.22.1-render-regions.json`. This supports comparison of those regions only. Module initialization, import resolution, and complete ESM runtime behavior remain separate concerns.

## Synthetic checks performed

`r18-resend-smoke.mjs` exports `runResendSmoke(source)`. Before evaluation, it requires a UTF-8 string with the exact reviewed CommonJS byte length and SHA-256 above. It runs that reviewed SDK entry in a Node VM context with inert dependency doubles, a minimal Headers double, and stubbed SDK POST/PATCH methods. The context receives no host process, environment, or real credentials. A reject-on-use fetch double detects any attempted fetch path. A dynamic-import callback records and rejects only the renderer import.

All 20 cases passed locally on Node 24.19.0: five entry methods multiplied by HTML without `react`, text without `react`, HTML with `react: false`, and truthy `react` with a simulated missing renderer. The 15 non-React cases reached their expected synthetic transport method with the expected HTML/text payload; five React cases attempted the renderer and rejected before transport. No dependency implementation, renderer implementation, application module, database, HTTP transport, email delivery, or AI service was exercised. The helper recorded zero forbidden fetch or dependency-use attempts.

Three negative input checks refused changed or invalid source before SDK evaluation. A separate run without Node's experimental VM modules flag refused execution with `RESEND_VM_MODULES_FLAG_REQUIRED`. Each synchronous VM invocation has a 500 ms timeout; asynchronous case completion is bounded at 1,500 ms with timer cleanup. The helper can run within R18's diagnostic process using `--experimental-vm-modules`; it does not start or stop the application's process.

Local validation commands:

```sh
node --experimental-vm-modules source_review/test-r18-resend-smoke.mjs
node source_review/test-r18-resend-smoke.mjs --without-vm-flag
```

Results are saved in `r18-resend-smoke-fixture-results.json`. Replit has not executed these new R18 checks yet. The CommonJS synthetic result must remain labeled separately from the collector's ESM source-to-metafile linkage and eventual application runtime qualification.

Node explicitly states that `vm` is not a security mechanism. These controls are for bounded execution of exact previously reviewed bytes with synthetic inputs; they do not make arbitrary package code safe to execute. The successful renderer path, real dependency implementations, API transport, and complete application call graph remain untested.

## Next use in R18

Read retained Resend ESM and CommonJS files without importing the application, require exact byte matches, and link the ESM file to R17B's recorded compiler inputs. Use this helper to recheck the sibling CommonJS conditional branches. Classify selected MMHB HTML/text callers only after matching their retained source identities. Explicitly review any caller that supplies `react`, including broadcasts or templates, before deciding whether renderer packaging is needed. Do not reinterpret a synthetic pass as application or release readiness.

## Primary sources

- [Official npm version metadata](https://registry.npmjs.org/resend/6.22.1)
- [Official npm version archive](https://registry.npmjs.org/resend/-/resend-6.22.1.tgz)
- [Resend Send Email API reference](https://resend.com/docs/api-reference/emails/send-email), including an explicit HTML example. The exact versioned distribution above controls this byte-level review.
- [Node VM documentation](https://nodejs.org/api/vm.html), including the warning that VM contexts are not a security mechanism. Current documentation is supplementary; the local Node version and actual fixture results are recorded separately.

Bounded source discovery also encountered a missing GitHub distribution path and unavailable browser retrievals for registry/CDN pages. No inaccessible mirror was repeatedly retried. Direct HTTPS access to the official npm metadata and archive succeeded through the normal configured route.

## Companion source notices

The R18 review kit also carries the complete MIT notices for the separately reviewed ws and node-postgres source excerpts. These notices were retrieved in two successful read-only GitHub connector requests, and their reconstructed Git blob hashes match the connector metadata. No dependency was installed or executed to obtain them.

| Notice | Official versioned source | Local file |
| --- | --- | --- |
| ws 8.21.0 | [websockets/ws LICENSE](https://github.com/websockets/ws/blob/8.21.0/LICENSE) | `r18-upstream-ws-LICENSE.txt` |
| node-postgres pg 8.23.0 | [brianc/node-postgres LICENSE](https://github.com/brianc/node-postgres/blob/pg@8.23.0/LICENSE) | `r18-upstream-pg-LICENSE.txt` |

Exact file sizes, SHA-256 digests, retrieval time, and Git blob hashes are recorded in `r18-upstream-license-provenance.json`. This notice acquisition does not change the version or scope of the separately reviewed dependency code.
