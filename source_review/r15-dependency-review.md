# MMHB R15 dependency follow-up

Prepared from the user-supplied R14 output and retrieved primary source files on 2026-09-08. No project or dependency code was executed. No packages were installed or changed. This review is independent of the runtime asset repair.

## Findings

1. **The previously unmatched pg native-client file is now reviewed against exact current bytes.** The official `pg@8.23.0` file is 11,086 bytes and has SHA-256 `9fe2f45918152531b1e76ff4cf54ff754fcd9651d85cfb997efd450a97d55917`, matching the R14 observed installed file and the R11D compiler-input identity reported in R14. It directly requires `pg-native` at module initialization and rethrows a missing-module error. This dependency is required if that native client module is loaded. The separate `pg/lib/index.js` file already matched by R14 governs default JavaScript versus forced/lazy native selection. This closes the specific current-byte review gap; it does not prove the native branch is unreachable throughout the application or deployed environment.

2. **Resend has a real version mismatch and an open installed-distribution review.** R14 reports installed `6.24.0`, root lock `6.22.1`, hidden install lock `6.24.0`. Official `v6.24.0` TypeScript source was retrieved for email creation, batch creation and rendering. Email creation invokes rendering only for truthy `payload.react`; batch creation invokes rendering only for truthy `email.react`. Rendering dynamically imports `@react-email/render` and throws if the renderer cannot be loaded. These are upstream-source findings, not proof about the installed bundled distribution. The reported installed ESM and CJS hashes remain unreviewed:
   - `node_modules/resend/dist/index.mjs`: `d1a986c08db90acb12f6b8bd210ba216ddc079aa2d9f1605c33598bbc28c8a77`, 42,278 bytes.
   - `node_modules/resend/dist/index.cjs`: `d039295b7d3a9db5dfeb1dfb723f622c6fff7f75c7435d2b1fd91edd6c674fce`, 43,412 bytes.

3. **The repeated `devDependencies: false` comparisons are not themselves dependency failures.** npm's official Arborist serializer copies normal package metadata from `pkgMetaKeys`, which does not include `devDependencies`. It copies that field separately only when `node.isTop && node.package.devDependencies`. Thus an installed dependency's own package.json can contain development dependencies that its root-lock package entry intentionally omits. The R14 boolean is a literal metadata comparison, not an install-health diagnosis. It does not justify installing the dependencies' own development toolchains. The separate React-plugin and Resend version mismatches remain genuine differences.

4. **Hidden install-lock agreement does not resolve root-lock disagreement.** npm documents the hidden lockfile as an optimization for inspecting the installed tree, subject to freshness conditions. Its matching versions are useful evidence about that tree; they do not establish that a root-lock clean install will reproduce it, nor do they establish registry integrity.

## Bounded retrieval outcomes

- Official GitHub `resend/resend-node`, `v6.24.0`, `dist/index.mjs`: 404.
- `https://unpkg.com/resend@6.24.0/dist/index.mjs`: web safe-open non-retryable failure.
- `https://cdn.jsdelivr.net/npm/resend@6.24.0/dist/index.cjs`: web safe-open non-retryable failure.
- These URLs were not retried. No distribution was fabricated from TypeScript source, and no dependency installation or execution was used to recover it.

## Retained source identities

Every retrieved source file below was checked against its GitHub Git blob SHA-1, including byte length and the Git blob header. SHA-256 values are also retained for handoff.

| Local review file | Bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| r15-pg-8.23.0-native-client.js | 11086 | 9fe2f45918152531b1e76ff4cf54ff754fcd9651d85cfb997efd450a97d55917 | d305713d64fdc197575ab1811cea7333fa35567b |
| r15-resend-6.24.0-render.ts | 363 | 9b1f660e960c30c4e7b9ce669fbaa4d5fcb963c429368bc4fd944eca67834655 | 424025e333aae2f04c00b9b1ea2a12a31222b726 |
| r15-resend-6.24.0-emails.ts | 4324 | f34e652ed9158d7790d60e4924e9a57b8f1f13707127182763e7fac976e79e53 | ad6141cc08263d45028479d538a6186d1ad2855f |
| r15-resend-6.24.0-batch.ts | 1425 | 917bcd37eb10367fa0b34f392b16211afdef58132a61246e4081d55d38380356 | 777f328c55f935a8e3e764f9ad18d62fe9efe1f3 |
| r15-npm-shrinkwrap.js | 42153 | 569835213919b111b06505b4eee8f208dd30b7a4e2eede327d60b71ffcb63b51 | 19c2c952dc7f7ee94540af8c4149923eaf719433 |

All files are under `source_review/`. The machine-readable summary and retrieval URLs are in `r15-dependency-review.json`.

## Primary sources

- [node-postgres native client, pg@8.23.0](https://github.com/brianc/node-postgres/blob/pg@8.23.0/packages/pg/lib/native/client.js)
- [Resend renderer, v6.24.0](https://github.com/resend/resend-node/blob/v6.24.0/src/render.ts)
- [Resend email creation, v6.24.0](https://github.com/resend/resend-node/blob/v6.24.0/src/emails/emails.ts)
- [Resend batch creation, v6.24.0](https://github.com/resend/resend-node/blob/v6.24.0/src/batch/batch.ts)
- [npm Arborist lockfile serializer](https://github.com/npm/cli/blob/latest/workspaces/arborist/lib/shrinkwrap.js), retrieved bytes identified above. This is upstream implementation context, not the Replit-installed npm implementation.
- [npm package-lock documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/), sections Packages and Hidden Lockfiles.

## Remaining dependency qualification

Review the installed Resend distribution or obtain verifiably matching published distribution bytes, align both actual version differences through the chosen release dependency policy, then qualify the rebuilt candidate and its real runtime paths. Do not treat optional helper absence, upstream package development-dependency omission, or source-only review as full release acceptance.
