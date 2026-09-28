# MMHB R12 verification kit

Use only MMHB-FRONTEND-CANDIDATE-R12.txt for the actual Replit Shell handoff.
The parent and child source files make its embedded code reviewable. The command
must pass its published SHA-256 check before execution.

Local qualification: 32 parent-driver fixtures and six child-runner fixtures
passed. Parent fixtures replace the embedded child with an inert Node stand-in.
Child fixtures replace Vite and related dependencies with inert API stubs.
These controls do not prove actual installed Vite compilation or browser behavior.
Independent review found and confirmed correction of empty-entry acceptance and
preservation-scope overstatement after incomplete baseline construction.

To reproduce the local controls, extract the complete kit and run these commands
from its directory in a disposable local Linux environment with Node, Python and
Git available:

    python3 source_review/test-frontend-candidate-r12.py
    python3 source_review/test-frontend-runner-r12.py

The fixtures use temporary repositories, fixture-only hashes and synthetic data.
They do not connect to MMHB or any database. The production handoff retains the
current Replit hashes and is not fixture-adapted. No test script belongs in the
production startup path.

R12 uses installed dependencies without modifying package.json, package-lock.json
or node_modules. React plugin 6.1.1 installed versus 6.1.0 locked remains pending.
Outputs, bundle report and cache are directed to a private temporary candidate.
The command runs build tools/plugins but does not start the MMHB application.
It is not an OS filesystem or network sandbox. Full dependency provenance,
public configuration, browser layout, private flows, native ABI, database recovery
and actual deployment are not qualified by this command.

The successful R11D server candidate is recorded as supplied by the user. R12
neither reads nor copies it. Keep that candidate available for later assembly.
