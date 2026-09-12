# Independent review of the R18 graph failure

The latest user output proves that R18 reached `RETAINED_BUILD_LINKAGE` and
failed at `RUNTIME_EXTERNAL_SPECIFIER`. It does not expose the rejected value
or which of the three call sites rejected it. The initial missing-file command
was an upload/location problem; the second attempt verified the R18 checksum
and executed the command.

All 63 pins matched, 5,192 recorded workspace/retained source files matched,
the retained candidate and server matched, and the observed read set/workspace
was stable. No helper or SDK test result appears; those later checks were not
reached. Runtime and deployment remain unproven.

## Defect reproduced in the checker

`runtime-graph-policy-r18.mjs` applies the same package-or-Node-builtin predicate
to every external input import and every external output import. It also applies
that predicate to each package name inferred from `node_modules` paths. The
reported R17B emitted external names all satisfy the predicate. An input-only
relative external is therefore a plausible cause, but it is not established as
the actual R18 value.

Using the exact official `@esbuild/linux-x64` 0.28.2 binary, four synthetic builds
succeeded. Two contain an unused function that tries to require
`./absent.node` inside `try/catch`. esbuild records that relative import as an
external input edge while its output import array is empty. R18 rejects this
valid metadata with the same `RUNTIME_EXTERNAL_SPECIFIER` code. The variant in
an imported module reproduces the same distinction. The live variant leaves the
relative external in both input and output and must continue to fail the strict
runtime packaging check. An unused ordinary package external succeeds under
R18, showing that the defect concerns input shape, not tree shaking alone.

These are synthetic examples. They do not identify the actual MMHB offender,
prove its runtime safety, or require another MMHB build.

The same actual-compiler fixtures were then checked against R18A graph policy
SHA-256 `d39692c0d37004a921a8496c7b835ed6b31d8997ef875fb2830703412e45c94d`.
The two input-only relative cases return `requiresReview:true` with an opaque
identity and safe owner; the emitted relative case still fails with an `OUTPUT`
diagnostic; the unused ordinary package remains accepted. The reproduction
script asserts these outcomes and asserts that raw opaque IDs do not appear in
the policy result or failure diagnostic. The four fixtures compile without
executing any generated output.

A brief independent review found no emitted-opaque qualification or unsafe
owner disclosure regression. A potential unpaired-UTF-16 identity ambiguity was
raised and the graph-policy author confirmed it is rejected by the final policy
with a focused regression case. No further broad testing was needed for this
bounded correction.

## Smallest supported correction

1. Keep strict validation of the emitted runtime external list and the existing
   exact comparison to the retained R17B receipt.
2. Preserve otherwise structurally valid, unrecognized input external IDs as
   opaque SHA-256/length/shape records with a safe owner label. Include their
   full identities in the repeated-graph comparison. Never resolve or import
   those IDs.
3. Mark opaque input edges for review and report whether their exact identity
   is listed among emitted output imports. Absence from that list is not proof
   of all dynamic runtime behavior.
4. Give failures a safe location (`INPUT_EXTERNAL`, `OUTPUT_EXTERNAL`, or
   `INFERRED_PACKAGE`) and opaque identity so the next returned report is
   actionable without printing private URL credentials or file contents.
5. Continue the already prepared helper/SDK inspection after graph collection
   when only input review records remain. Preserve `releaseReady:false`.

The package-name inference path is a distinct remaining possibility. Do not
silently reinterpret an exotic inferred package path as a validated npm package.

## Reproduction and sources

`r18a-esbuild-reproduction.py` accepts a reviewed binary and policy paths. It
does not fetch or install dependencies. It compiles only the four inline
synthetic sources, records the real compiler metadata, and does not execute any
bundle. The sole adapter replaces the output map key with the synthetic report
path required by the graph policy; import edges and all byte counts are intact.

The adjacent `r18a-esbuild-*-fixture.json` files retain the raw metadata and
adapted metadata. `r18a-esbuild-reproduction-results.json` records original and
updated policy outcomes when both policies are supplied. Provenance records the
download URL, the registry-integrity match, and the binary SHA-256. Registry
self-consistency is not an independent publisher authentication claim.

Primary sources checked on 2026-09-09:

- https://github.com/evanw/esbuild/blob/v0.28.2/internal/bundler/bundler.go
  explains that unresolved imports handled by a catch branch become external
  imports instead of compilation errors.
- https://esbuild.github.io/api/#metafile
  specifies separate input and output import arrays.
- https://registry.npmjs.org/@esbuild/linux-x64/0.28.2
  identifies the exact compiler archive used in the synthetic reproduction.
