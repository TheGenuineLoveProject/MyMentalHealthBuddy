# Zero Duplicate Shell Command Ledger

Purpose:
Prevent repeated, blind, or drifting shell-command execution.

Rules:
1. Every command phase must have a unique phase number.
2. Every phase must create diagnostics/phaseXX evidence.
3. Every phase must preserve a starting git status.
4. Every phase must run verification before commit.
5. Every phase must stage only safe, small, intentional files.
6. Every phase must reject oversized generated artifacts.
7. Every phase must stop after one verified objective.
8. No command should be repeated unless the prior run failed and the reason is documented.
9. Do not combine unrelated domains in one phase.
10. Do not proceed blindly after disappearing shell input; verify git status, log, diagnostics, and pushed HEAD first.
