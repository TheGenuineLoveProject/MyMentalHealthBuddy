# MMHB R12A verification kit

Upload only MMHB-FRONTEND-CANDIDATE-R12A.txt to the Replit workspace for the real
handoff. Verify its published SHA-256 before running. The parent driver and its
unchanged embedded child are included as plain source for review.

The actual R12 run stopped before build on a nested nanoid executable symlink.
R12A records and validates a narrow npm-style link form inside selected tool trees.
It does not remove, replace, execute or broadly ignore those links. All 41 pins,
source/output link restrictions and embedded build-runner bytes remain unchanged.

55 parent cases passed, including 23 link-specific cases. Captured stdout is in
source_review/r12a-parent-fixture-results.txt. The parent fixture replaces only
temporary ROOT/HEAD/Node/pin digests and embedded child bytes in disposable copies.
It runs no actual Vite, application, native binding or database. The unchanged
child retains six prior passing inert API fixtures, included for reproduction.

To reproduce controls after extracting the complete kit in a disposable Linux
local environment with Python, Node and Git:

    python3 source_review/test-frontend-candidate-r12a.py
    python3 source_review/test-frontend-runner-r12.py

These are local review controls, not production startup commands. Candidate
qualification does not imply real frontend compilation, correct browser CSS,
complete dependency provenance, native ABI, database recovery or deployment.

The child uses installed dependencies, with React plugin 6.1.1 installed versus
6.1.0 locked still pending alignment. Frontend output, visualizer report and cache
are directed to a fresh private temporary directory. No package manager, MMHB
server or database startup is invoked. This is not OS filesystem/network isolation.

The successful second R11D server candidate remains recorded from user-supplied
output. R12A does not copy or depend on that report. Keep it for later assembly.
