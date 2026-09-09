# MMHB R11D verification record

The production handoff is MMHB-SERVER-CANDIDATE-R11D.txt. Use the checksum and instructions in the readiness ledger. The Python fixture file is maintainer evidence and is not needed to run the Replit handoff.

R11D replaces a mandatory older temporary metafile with fresh discovery and qualification compilations. It preserves the existing pins, compiler contract, input boundaries, SQL/native packaging and current Git/worktree comparison. Failure reports now preserve phase and sanitized filesystem/launch context, count attempts separately from started processes, and remain visible on stdout if the final report file write fails.

Verification used 22 temporary-repository fixtures and an inert pinned compiler stand-in. The fixture harness adapts only its temporary driver copy to synthetic roots, commits, tool versions and content hashes. This does not qualify actual esbuild, application runtime, native bindings, a database or deployment. No MMHB repository was mutated by this local preparation.

Independent review accepted the final bounded workflow. It identified the final-report write gap, which was fixed and tested. The launch fixture identified spawnSync syscall normalization, also fixed and tested. Existing pins, compiler arguments, general path rules and packaging were compared with R11C and remain unchanged.

The historical R11A preservation failure remains unresolved. R11C reported ENOENT before launching the compiler; the exact missing path is still unknown. A missing retained report is plausible, not proven. Actual R11D must be run in the user's Replit workspace.

To maintain the fixtures, use Python 3, Node and Git in a disposable development environment. The fixture harness creates temporary repositories and inert data; it never invokes the MMHB application. Run test-server-candidate-r11d.py from the extracted folder only if repeating this orchestration verification is needed.
