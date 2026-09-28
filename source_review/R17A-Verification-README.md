# MMHB R17A handoff verification

R17A repairs graph interpretation in a new continuation script. It reads the retained R17 report and copied inputs; it never runs R17 again, edits the workspace source, or invokes a compiler/npm. The successful build outputs can be reused only after the current source, retained dependency manifest, server checksum, metadata, frontend references and graph classifications verify.

The supplied screenshots establish both R17 child exit codes as zero and the parent failure as GRAPH_NONPHYSICAL_ID. They do not identify the rejected ID. Primary source review establishes that generated Vite browser/optional-peer IDs and relative watched paths are legitimate contracts the original verifier did not fully handle. Exact unknown IDs remain review failures; no blanket acceptance is added.

R17A records missing watch-file API coverage. Generated-module consumers remain a browser/runtime acceptance item. The R17 server checksum is checked against the screenshot. Full frontend hashes were not saved by R17; current frontend hashes are recorded here with retained output sizes and references rechecked. That is a present observation, not a retroactive historical integrity claim.

Run locally from this kit's root, with existing Python 3 and Node:

```bash
python source_review/build-resumed-candidate-command-r17a.py
node source_review/test-frontend-graph-r17a.mjs
python source_review/test-resumed-candidate-r17a.py
bash -n MMHB-RESUME-CANDIDATE-R17A.txt
node --check source_review/resumed-candidate-driver-r17a.mjs
```

The first script regenerates the self-contained handoff from included source/helpers. Tests use only standard libraries and temporary fixtures. They do not install packages, access a network, import the application, connect to a database or deploy.

Qualification: **18 graph/filesystem/contract checks plus 16 workflow scenarios pass (34 total)**. Workflow scenarios execute the original R17 driver to reproduce its graph-gate failure and then execute the actual R17A driver. Compiler/native package responses are synthetic; the reviewed prompt loader actually loads all 18 retained prompts. The original Vite stub is extended to cover bare generated IDs and unavailable watch-file collection. This is not real Vite compilation or native ABI qualification on Replit.

Coverage includes known generated IDs, their consumers, relative watched paths/directories, unavailable watch coverage, namespace lookalikes, unknown module IDs, path escapes, symlinks, source/output/dependency drift, missing prior copy, helper tampering, native failure and concurrent edits. Concurrent changes are preserved and reported; they are not overwritten. The native child change from R17 is solely the accepted R17A report-directory name.

All 41 source/tool pins and 22 repaired asset pins are unchanged. All eight embedded helper hashes match their included bytes. Bash and Node syntax checks pass. The command's success result remains RETAINED_CANDIDATE_BUILD_AND_SMOKE_PASS_NOT_RELEASE, with releaseReady false.

The included third-party source snapshots are review evidence, not installed code. Their source URLs/refs/hashes are in r17a-upstream-source-manifest.json. Vite and Rolldown MIT notices accompany the snapshots. Existing R14/R15 prompt files are test fixtures for this MMHB project; the R15 repair policy supplies the six already-authorized corrected contents during fixture construction.

Use MMHB-R17A-Start.txt for the actual Replit action. Do not run local fixture tests in the live workspace as a substitute for the checksum-verified handoff.
