# MMHB R17 verification kit

Current Replit evidence: R16E passed (user-supplied screenshots), report
/home/runner/workspace/.mmhb-release-evidence/r16e-rHi4aw, start
2026-09-09T01:20:00.612Z. Private locked dependencies were installed with scripts
disabled; no application build/start/deployment was performed by that command.

Upload only MMHB-FRESH-CANDIDATE-R17.txt to the existing Replit workspace and
follow MMHB-R17-Start.txt. MMHB-Ledger.txt is the full ledger, not executable code.
R17 is locally qualified; actual Replit execution is PENDING.

The command embeds seven exact helper modules and preserves the existing 41
baseline pins, 22 post-R15 asset pins, integration branch/HEAD and Node/Linux
identity. It reconstructs the expected normalized lock in memory, checks saved
registry receipts and the full installed R16E file manifest, copies source and
dependencies into a fresh owned temporary build root, builds and packages a new
project-local candidate, and performs selected syntax/native/prompt tests.

The source copy is outside the project evidence directory so inherited Git
ignore rules do not hide all source from CSS scanning. The final candidate and
reports are kept under the project evidence directory. No source/dependency
hard links, active node_modules replacement, root lock change, npm installation,
application start, database operation, AI request, commit or publication occurs.

The fresh candidate is not certified as a complete runtime filesystem or release.
Runtime external imports, public configuration, remaining kernel/RSS content,
application/browser/auth/data/AI-safety behavior, recovery and deployment remain.
Minimal environments and observations are not an OS filesystem/network sandbox.
Build dependencies' internal network behavior is not measured. Compiler and
native package execution are explicitly part of the Replit handoff.

Local qualification: 18 full workflow fixtures plus 11 filesystem/contract checks
PASS. The workflow uses synthetic installed packages, esbuild/Vite responses and
native output. The production R17 server/frontend orchestration and exact MMHB
prompt loader execute in the fixtures. No real native ABI, actual MMHB compilation,
application, browser, database, registry or AI service is tested locally.

Reproduce the local controls from this extracted kit (Node, Git, Python required):

    python3 source_review/build-fresh-candidate-command-r17.py
    python3 source_review/test-fresh-candidate-r17.py
    node source_review/test-fresh-build-policy-r17.mjs
    bash -n MMHB-FRESH-CANDIDATE-R17.txt
    node --check source_review/fresh-candidate-driver-r17.mjs

Fixture files and repositories are temporary. Fixture-only substitutions include
ROOT/HEAD/Node and input pins, synthetic dependencies/compiler output and a native
result stub. A secret canary checks that child environment values are not passed
through. Negative cases deliberately inject failures and preserve unknown edits.
The production command has none of those test substitutions.

The retained native runner differs from R13 only in its accepted R17 report path.
The frontend runner reuses the reviewed R12 build API/configuration checks with
an explicit fresh build-root argument and R17 report path. The R16E dependency
policy, R16D archive normalization and R15 prompt runner remain byte-identical.

Preparation record: source_review/r17-preparation-record.json.
Fixture results: source_review/r17-driver-fixture-results.json and
source_review/r17-policy-fixture-results.json.
MMHB-Ledger.txt contains complete history, estimates, later release requirements,
three reusable engineering/content prompts and the expansion backlog.
