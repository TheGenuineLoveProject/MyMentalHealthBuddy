# R16 independent release handoff review

Reviewed 2026-09-08. Scope: private npm installation from the unchanged root manifest/lock, lifecycle scripts disabled, preservation of the workspace and R15 candidate. This is a code review, not evidence of a Replit installation or release.

## Actionable finding

**P1 — `devOptional` alone must not permit absence in the all-development-dependencies install.** `inspectInstalled` currently accepts a missing package when either `optional` or `devOptional` is true. The runner explicitly includes development dependencies. npm defines `devOptional` as a package that is both a development dependency and an optional dependency of a non-development dependency. It is therefore insufficient to classify that package as optional for this invocation. A missing development requirement such as `eslint` or `@types/react` could pass the current metadata gate.

Minimal repair: for this fixed `--include=dev` contract, accept absent packages only when `optional === true`; use the same meaning for `optionalCount`. Add a fixture where a missing `devOptional: true, optional: false` package fails with `REQUIRED_LOCKED_PACKAGE_MISSING`. The older local remote lock contains 63 `devOptional` entries without `optional`; that snapshot is contextual evidence, not the current Replit lock.

Primary reference: https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/ (package descriptor definition).

## Other reviewed behavior

- Install cwd and explicit prefix both point into the newly created private report stage. Only the exact manifest pair is copied. No workspace installation, application import, root package rewrite, R15 rewrite, or Git mutation path was found.
- npm lifecycle execution is disabled explicitly. User/global npm configuration files and cache/log/temp paths are private; the child environment excludes inherited application credentials and npm configuration. Raw npm output remains in the bounded private log; only selected error codes enter the printed summary.
- R15's supplied manifest digest, 625 files and 40,501,647 bytes are checked against the retained tree. Current R15 asset pins include the six completed content edits.
- Failure in install, metadata inspection, final preservation, or evidence writing keeps the overall status failed. The final scope distinguishes a private dependency stage from a runnable application or release.
- Installed file identities are observed after installation. The current report does not claim that the entire new tree was locked against concurrent editors or independently authenticated against publisher provenance.
- Nix wrappers whose real target resolves to the standard npm CLI path are supported. Physically renamed JavaScript wrapper targets are rejected rather than executed; no current Replit npm layout evidence is available, so this is an explicit discovery limitation, not a confirmed environment defect.

The separate contract review identified the optional wasm32 Tailwind package's bundled-dependency declaration as a portability case and is preparing a narrow platform-excluded declaration exception. This review does not recommend broader dependency-policy relaxation.

## Final closure

The P1 finding is **resolved** in the final policy helper, SHA-256 `0d32a375e7f43b58a809f5f902e971d6030512729927b4f4f19668610c0f7404`. Reinspection confirms that only `optional === true` permits a missing package or contributes to the optional count. A missing `devOptional`-only package fails with `REQUIRED_LOCKED_PACKAGE_MISSING`.

The Tailwind exception is limited to the exact `node_modules/@tailwindcss/oxide-wasm32-wasi` path, `optional: true`, CPU metadata exactly `["wasm32"]`, on Linux x64. Inspection requires that package directory to be absent; even an empty directory fails. General bundled entries, links and shrinkwrap features retain their rejection gates.

Reviewed final fixture evidence: **49 policy fixtures passed, zero failed**, including missing-devOptional rejection and both sides of the WASI-directory rule. The assembled driver SHA-256 is `7a5140968c6f9d34ca5c0078c78ac5de5f611515fcb44eb6b8a7ce14130046df`; its **12 workflow fixtures passed** using an inert npm CLI, including preservation failures, dependency mismatches and final evidence-write failure. These are local fixture results; the actual Replit npm installation remains unexecuted by this reviewer.

No unresolved blocking code-review finding remains within this bounded handoff scope.
