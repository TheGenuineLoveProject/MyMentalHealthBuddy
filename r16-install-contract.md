# R16 private dependency installation contract review

Reviewed 2026-09-08 for MyMentalHealthBuddy only. This is a design review, not a Replit execution result. R15's 625-file candidate and six completed prompt-content repairs are the starting evidence.

## Decision

Reconstruct the dependencies from the unchanged root package manifest and lockfile in a new private directory. Target the root lock's React plugin 6.1.0 and Resend 6.22.1. Do not rewrite the lock to match the existing installation, and do not replace the current workspace dependencies. A successful install creates a separately usable dependency stage; it does not repair the existing workspace, rebuild R15, or qualify runtime behavior.

## Filesystem and process boundary

- Create a fresh mode-0700 `/tmp/mmhb-locked-dependencies-r16-*` directory with separate stage, cache, log and evidence directories. Copy exactly the observed `package.json` and `package-lock.json` into stage and verify their bytes before npm. Use the stage as both child cwd and explicit npm prefix. Do not copy source, credentials, workspace npm configuration, old node_modules, or a shrinkwrap file.
- Resolve the existing npm executable to its CLI JavaScript file, validate the containing package is npm, and record the Node executable, npm package version, CLI file and builtin configuration identities. Invoke that CLI with the observed Node executable and an argument array; avoid shell interpolation and PATH-based second resolution. Tool identities are observations, not a cryptographic trust chain for the npm distribution.
- Build a minimal child environment. Omit inherited NODE_OPTIONS, NODE_PATH, npm configuration variables, proxy variables, tokens and application environment. Do not replace HOME. Route cache, logs and temporary data to the private directories explicitly.
- Retain private npm output and report only bounded sanitized summaries. Record attempts, exit code, signal and timeout. A timeout should terminate only the child owned by this invocation. Do not repeatedly retry installation on failure.
- Preserve source manifest/lock bytes, the R15 candidate manifest and selected current dependency identities before/after. State that selected-file observations do not cover every ignored workspace dependency or lock concurrent editors.

## Dependency preflight

Require a supported modern lockfile with a packages map and matching root name/version/dependency maps. Reject root workspaces, local links, local file/directory dependencies, git dependencies, unsupported direct archive dependencies, or package-manager switching. Check the same dependency-source restrictions in lock package dependency maps and root overrides, not just direct dependencies.

Require each non-root locked package to have a valid exact version, a bounded safe `node_modules/...` path, an explicit HTTPS archive URL whose hostname is exactly `registry.npmjs.org`, no URL credentials/query/fragment/custom port, and a canonical SHA-512 integrity value. Reject links, bundled entries or shrinkwrap-bearing packages unless their behavior has separately been qualified; they can hide a second dependency source or omit per-package archive identity. Nonmatching metadata should fail before npm, without emitting raw sensitive values.

One exact platform exclusion is permitted: `node_modules/@tailwindcss/oxide-wasm32-wasi` may declare bundled dependencies only when `optional` is true, `cpu` is exactly `["wasm32"]`, and this invocation is Linux x64. Its archive and integrity still pass the usual policy, no link/inBundle/shrinkwrap flag is accepted, and the installed inspection requires the entire package directory to be absent. This is a recorded incompatible optional declaration, not permission to install bundled packages. Registry-only peer range metadata such as Tailwind's `>=3.0.0 || insiders || >=4.0.0-alpha.20` is accepted without relaxing source protocols.

The older local remote-lock snapshot contains 994 non-root entries, all with SHA-512 integrity and no link/inBundle/hasShrinkwrap flags. The exact wasm32 optional package declares six bundled dependencies and is covered by the exclusion above. A compatibility run using that snapshot with only the two selected-version fields adjusted to R16's target values passed policy validation. This is synthetic historical context, not proof about the current Replit lock.

## npm configuration

Recommended argument contract, using generated private absolute paths:

```text
ci
--prefix=<stage>
--global=false
--workspaces=false
--ignore-scripts=true
--audit=false
--fund=false
--update-notifier=false
--progress=false
--color=false
--include=dev
--include=optional
--include=peer
--registry=https://registry.npmjs.org/
--userconfig=<empty-user-config>
--globalconfig=<empty-global-config>
--cache=<private-cache>
--logs-dir=<private-logs>
--fetch-retries=1
--fetch-timeout=60000
```

Do not add version-specific new npm flags until the installed CLI supports them. Do not automatically retry with `--force`, `--legacy-peer-deps`, a changed install strategy, or enabled scripts after a failure. The upstream docs say tree-shaping flags used to produce the lock may also be required for `ci`; such a failure is evidence to review, not permission to change the contract. Native install hooks remain disabled: successful package extraction does not prove esbuild, bcrypt, or other native tools load or work.

**Builtin configuration needs separate handling.** npm still reads its distribution's own `npmrc`. Empty user/global files alone do not eliminate builtin scoped registries, auth credentials, proxies, certificate files or alternate prefixes. Inspect that bounded file without printing values and allow only reviewed harmless settings; reject unqualified transport/auth/scoped-registry overrides. In a fresh private stage, the original workspace's project npm configuration does not apply. Fixed CLI options override known scalar settings, but default `--registry` alone does not override every `@scope:registry` entry.

## Post-install acceptance

- Require npm exit zero and unchanged copied package/lock bytes; distinguish the newly generated hidden installation lock from the input root lock.
- Check selected installed React plugin and Resend versions against 6.1.0 and 6.22.1; compare all observed package versions against the lock where practical. Handle npm aliases using locked package identity rather than assuming every directory name equals package.json name.
- Report absent packages with `optional: true` separately. `devOptional` alone does not authorize absence because this install includes development dependencies: such a missing package fails. Do not demand that Linux installation contains every OS/CPU-specific optional archive in a cross-platform lock. Do not convert missing non-optional packages or unexpected versions into a pass.
- Save identities for the installed Resend distribution and pg native source for the subsequent exact-content review. Do not import them merely to inspect metadata.
- Status should explicitly mean private locked dependency stage ready, not complete reproducible build or release. npm may fetch registry metadata as well as locked tarballs; allowlisting input URLs and suppressing lifecycle scripts is not an OS/network sandbox. No network-request count of zero is appropriate.

## Primary references

1. npm ci: https://docs.npmjs.com/cli/v11/commands/npm-ci/. It requires a lock, rejects manifest disagreement, does not rewrite the input manifests, and removes node_modules only in the selected install project. Documents ignore-scripts and workspace behavior. Keep any user-facing summary derived from this page within its 200-word allowance.
2. npm configuration files: https://docs.npmjs.com/cli/v11/configuring-npm/npmrc/. Defines project, user, global and builtin configuration and precedence. Keep derived summary within 200 words.
3. npm config: https://docs.npmjs.com/cli/v11/using-npm/config/. Documents explicit config paths, proxy environment effects, registry replacement and other CLI flags. Keep derived summary within 200 words.
4. Lockfile format: https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/. Defines resolved archives, integrity, link/bundle/shrinkwrap flags, hidden installation lock and optional dependency metadata. Keep derived summary within 200 words.

This review is included in the R16 verification bundle.
