# MMHB R13 verification package

Deliverable: MMHB-RELEASE-ASSEMBLY-R13.txt
Purpose: assemble exact retained R11D/R12A core artifacts and smoke-test copied bcrypt.
Actual Replit execution: PENDING. Not release approval or application runtime proof.

The command is Bash containing the parent module and an exact base64-embedded native runner.
For Replit execution, use the checksum command in the updated readiness ledger.
Upload the TXT unchanged to /home/runner/workspace. Keep the passing retained reports
/tmp/mmhb-server-candidate-r11d-SRSfZ5 and /tmp/mmhb-frontend-candidate-r12a-CaA16N.
Finish editing/uploading before running, and return complete terminal output.

Local verification:
- 42 actual-parent orchestration fixtures with synthetic artifacts and inert native child.
- 28 native-runner control-flow fixtures with a JavaScript substitute for the .node loader.
- Bash/Node syntax, embedded identities, unchanged 41 pins and independent review PASS.
- No actual MMHB app, native binary, database, browser or deployment executed locally.

Tests can be run from the extracted package with Node, Git and Python available:
  python3 test-release-assembly-r13.py
  python3 test-native-candidate-runner-r13.py
The tests create disposable fixture repositories; they do not use MMHB production services.

The parent verifies exact manifests and retained artifact bytes, assembles a private
candidate, checks server syntax, launches the copied-native-only test and compares
observed inputs/artifacts/worktree again. A child failure reports safe phase/code.

Still open: install/lock alignment, required runtime content/configuration and external
package reachability, real application/database/browser acceptance, backup/restore and
MMHB deployment identity. This is not an OS filesystem or network sandbox.

Source-level native runner SHA-256: 0b1ff6782fccbd158cb54c3c88267e7d9035222dc0a6547fac862ef130ce8053
Command SHA-256: e44470397f4ef416c082fe2a30e5ebc7d6a65084e6b61ed2003def3fd6f89345
