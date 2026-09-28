# R18A verification

This is the diagnostic checker correction for R18's external-specifier failure.
Actual Replit output is pending. No application-source patch is contained here.

Build the standalone Shell command and run local regression fixtures from the
extracted kit root (Node24, Python3 and Git required):

```bash
python3 source_review/build-runtime-contract-r18a.py
node --test source_review/test-runtime-graph-policy-r18a.mjs
python3 source_review/test-r18a-driver.py
bash -n MMHB-RUNTIME-CONTRACT-R18A.txt
node --check source_review/runtime-contract-driver-r18a.mjs
```

Command SHA256: c000a1a062b171b76435c58552b7c986c0781bcd10fca6575f5d6526b90929da
Driver fixture count: 14

The actual-compiler reproduction's script and provenance describe its separate
bounded download of the official esbuild0.28.2 binary into a private scratch
directory. No binary is bundled here; no application build is run by R18A.
See r18a-esbuild-reproduction-results.json and r18a-independent-analysis.md.

Original R18 sources remain for before/after reproduction; the new command uses
only its embedded R18A graph policy and unchanged reviewed helper dependencies.
Fixtures replace environment constants and artifact pins in temporary copies;
the delivered command retains the production expected values and 63 pins.
All tests are scoped evidence. Application runtime and deployment stay UNPROVEN.
