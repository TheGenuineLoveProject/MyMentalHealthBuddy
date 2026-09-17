# MMHB compiler-only qualification

Target checkpoint: e23ee835f21198157b7aad4c248f768633814903
Parent: cb2e164a8fc19e7fab3a539a9facb4b4b562eaca

This is a candidate compiler check, not an application server, build, npm test,
database migration, or deployment. It introduces no source changes. It uses
the existing TypeScript compiler whose direct version agrees with the committed
lockfile, and requires Node 24 in normal CLI operation. No npm or npx is invoked.

Before and after compilation, it compares every tracked checkpoint entry with
the working file bytes/mode, and records the candidate's marker/HEAD/index/lock,
repository refs/config and available outer HEAD/index/config. It does not claim
that untracked files or the complete dependency tree have been audited.

The configured tsconfig.json controls file coverage, checkJs, strictness and
project references. A pass is only a pass for that configured project. It is
not proof that all .js/.jsx/.mjs files are type-checked.

The compiler is run with --noEmit --pretty false and a fresh, explicitly located
--incremental --tsBuildInfoFile under the audit directory. Those overrides keep
compiler-cache writes away from source; the committed config and npm scripts
are not rewritten. The effective configuration, raw compiler log, cache and
result JSON remain in that directory. Only the first 45 log lines are printed
on failure. No old compiler-cache result is reused.

The runner uses an environment allowlist and does not load MMHB runtime modules
or dotenv configuration. This is not an OS-level sandbox or a dependency
integrity certification. Use only in the existing trusted development workspace.

Local evidence: 10 fixture tests passed, including two actual compilations of
tiny fixture projects (one passes; one returns TS2322 as intended). These ran
on Node 22.16.0 and TypeScript 5.8.3 available in the assistant environment, not
MMHB's Node 24/lockfile compiler. No claim of MMHB compiler success is made.

Reproduce these fixture tests with a local Node/TypeScript already installed:
python3 test_runner.py ./MMHB_TYPECHECK_CANDIDATE.py
The test script expects TypeScript in the Node installation's global library
directory and makes temporary symlinks for its fixture dependency resolution.
It does not install packages.
