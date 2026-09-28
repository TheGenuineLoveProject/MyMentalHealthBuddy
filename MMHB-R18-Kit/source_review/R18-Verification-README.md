# R18 verification archive

Prepared for MyMentalHealthBuddy only. The executable handoff has SHA256 `c7d1a439e6ffb436877f0081ad376d947d057de25fe515912771667c4110eb7a`.
Upload only the standalone command TXT to Replit; this archive is for review and reproduction.

Driver integration cases: 11. Supporting checks:13 graph tests,8 helper tests,
11 helper behavior cases/116 assertions,20 SDK branch cases plus hash/type/flag refusals.
All are local fixtures. Real Replit runtime is not qualified.

To reproduce from the extracted kit root with Node24/Python3/Git available:

```bash
python3 source_review/build-runtime-contract-r18.py
node --test source_review/test-runtime-graph-policy-r18.mjs
node --test source_review/test-r18-runtime-helper-smoke.mjs
node --experimental-vm-modules source_review/test-r18-resend-smoke.mjs
node source_review/test-r18-resend-smoke.mjs --without-vm-flag
python3 source_review/test-r18-driver.py
bash -n MMHB-RUNTIME-CONTRACT-R18.txt
node --check source_review/runtime-contract-driver-r18.mjs
```

Fixtures replace environment-specific constants only inside temporary generated
copies. Production command pins remain unchanged. Third-party reviewed files
carry MIT notices and provenance in the archive. The R17C classification JSON
uses user-pasted observations, not a locally retrieved raw Replit report.
