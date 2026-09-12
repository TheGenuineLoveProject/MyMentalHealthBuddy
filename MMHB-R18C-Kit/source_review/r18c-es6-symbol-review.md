# R18C published dependency filename review

Issue: `R18C-PUBLISHED-PRIVATE-MODULE-001`. Scope: MyMentalHealthBuddy only.

The user-supplied R18B output identifies `node_modules/es6-symbol/lib/private/generate-name.js` in both saved R17B input graphs. Its recorded SHA256 and 789-byte size match the published es6-symbol 3.1.4 archive. The package.json SHA256 also matches exactly.

Retrieved sources:

- https://registry.npmjs.org/es6-symbol/3.1.4
- https://registry.npmjs.org/es6-symbol/-/es6-symbol-3.1.4.tgz
- https://github.com/medikoo/es6-symbol/blob/v3.1.4/lib/private/generate-name.js
- https://esbuild.github.io/api/#metafile

The archive's SHA512 integrity and SHA1 match the registry response. Registry signatures were not independently verified. `r18c-es6-symbol-provenance.json` records the archive hash and each published member's size/SHA256. Upstream package source, package.json, and ISC license are retained in `r18c-es6-symbol-3.1.4/`. No package manager or install script ran.

Reviewed private-directory files:

| File relative to package | Purpose observed in source | Bytes |
| --- | --- | ---: |
| lib/private/generate-name.js | Produces unique names used by the Symbol polyfill; defines a prototype setter with an IE11 workaround | 789 |
| lib/private/setup/standard-symbols.js | Defines standard Symbol properties, using native symbols when available | 1421 |
| lib/private/setup/symbol-registry.js | Adds the polyfill's for/keyFor registry methods | 556 |

These are ordinary implementation modules. The graph checker's exact `private` path-component prohibition caused the demonstrated rejection. This review does not certify package security, runtime reachability, or suitability in every environment. In particular, R18C reads and hashes these modules; it does not execute their prototype-changing code. The two sibling modules are independently reviewed exact files, not an assumption that they occur in the user's graph.

The correction retains the existing secret-name rule for every other path and for package/external specifiers. Only the three exact normalized module paths can use the internal-input exception. Each must match the fixed published SHA256/size and package.json identity in the retained inventory. The driver then checks current retained bytes, package name/version, and lockfile version before saving an accepted graph, emitting PASS, or attempting existing synthetic helpers. An unreviewed sibling, changed manifest, changed package, changed bytes, or symlink does not gain the exception.

No existing application files, active dependencies, historical reports, auth/prompt repairs, or the original R17B failure receipt are modified by R18C. It writes a new report under the existing evidence root. R18A's input-only external references remain explicit review items; emitted output imports remain strict. All 63 pins and the five non-graph helpers are unchanged.

Acceptance in Replit is pending: the previously rejected module must pass its fixed identity check and the graph must progress. Later review findings or failed gates must be reported faithfully. Even a complete retained-runtime-contract pass leaves application startup, real data and AI flows, browser behavior, and deployment unproven.
