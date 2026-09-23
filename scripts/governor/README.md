# Local platform governor

`npm run governor` runs static registry schema validation, the existing locked API
contract checker, registry semantics (including prompts), runtime entry/purity and
archive boundaries, and the refactoring inventory. A missing checker, unreadable
input, invalid contract, or any failing check returns nonzero. All available
checks run so one failure does not hide other findings. No application modules
are imported, services started, credentials consumed, or network calls made.

`npm run --silent governor:refactor-report` emits deterministic JSON to stdout.
It inventories the actual Vite frontend (`client/src`), `server`, and `shared`.
Duplicate basenames and literal route signatures are advisory, not proof that
files are unused or routes conflict. It emits paths/counts, not source lines or
route literals. Missing roots, unreadable files, and symlinks fail closed.
Redirect stdout to a private location outside the source tree when retaining a
report. Neither command moves, deletes, archives, or rewrites source.

## Historical intent and current mapping

The historical shell governor chained schema, entry, API, prompt, purity,
archive-boundary and refactor checks, followed by archive planning artifacts.
The package's current `governor:schema`, `governor:contract`, and
`governor:prompts` interfaces identify their modern registry/contract successors.
The restored aggregator calls those checker implementations directly (without
npm lifecycle hooks); semantic validation uses `--no-write` to suppress only its
generated JSON artifact, not validation or failure status. Standalone semantic
audit behavior is unchanged.

The runtime entry remains `server/app.mjs`; `exec node server/app.mjs` is accepted
for development because shell `exec` preserves that exact runtime. Server
backups and TypeScript in the historically governed runtime directories still
fail, including `.ts`/`.mjs` twins. Registry manifest validation replaces the
obsolete `shared/schema.mjs` existence test, not the API contract checks.

Archive boundaries cover all Git-tracked files plus nonignored untracked files.
Tracked files are checked even when they match ignore rules. Ignored private
qualification/evidence directories are deliberately not traversed. The server
purity scan separately includes ignored files under `server`. Historical allowed
archive zones remain unchanged. An unavailable Git inventory is an error.

Historical promotion/archive scripts generated executable move manifests and
simulations. This repair instead exposes a read-only inventory: it does not
generate executable archive commands or imply approval to archive anything.
Any cleanup requires separate review of imports and provenance.

## Verification and limits

Run `node --test scripts/governor/*.test.mjs` for credential-free fixture tests.
The full governor may correctly fail on inherited source violations; repairing
the entrypoints does not clear those violations. A passing refactoring report
means inventory succeeded, not that all findings passed a gate.

These local commands do not replace the required GitHub `verify` job or qualify
a release. PR review, strict required verification, and non-fast-forward
protections are unchanged. No push, PR creation, merge, deployment, credential
change, or production operation is authorized by running them.