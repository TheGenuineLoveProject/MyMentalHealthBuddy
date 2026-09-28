import assert from 'node:assert/strict';
import {test} from 'node:test';
import {analyzeRuntimeGraph, REVIEWED_PRIVATE_INPUTS} from './runtime-graph-policy-r18c.mjs';
import crypto from 'node:crypto';
import fs from 'node:fs';

const compilerWorkingDirectory = '/tmp/mmhb-build-r17b-AbC123';
const reportDirectory = '/home/runner/workspace/.mmhb-release-evidence/r17b-q6rzGy';
const out = `${reportDirectory}/server-build/server.mjs`;
const entry = 'server/app.mjs';
const email = 'node_modules/resend/dist/index.mjs';
const socket = 'node_modules/ws/lib/buffer-util.js';
const clone = value => structuredClone(value);
const make = () => ({inputs: {
  [entry]: {bytes: 120, format: 'esm', imports: [
    {path: email, kind: 'import-statement', original: 'resend'},
    {path: socket, kind: 'import-statement', external: false}
  ]},
  [email]: {bytes: 300, format: 'esm', imports: [{path: '@react-email/render', kind: 'dynamic-import', external: true}]},
  [socket]: {bytes: 240, format: 'cjs', imports: [
    {path: 'bufferutil', kind: 'require-call', external: true},
    {path: 'node:buffer', kind: 'require-call', external: true}
  ]}
}, outputs: {[out]: {bytes: 700, entryPoint: entry, exports: [], imports: [
  {path: '@react-email/render', kind: 'dynamic-import', external: true},
  {path: 'bufferutil', kind: 'require-call', external: true},
  {path: 'node:buffer', kind: 'import-statement', external: true}
], inputs: {[entry]: {bytesInOutput: 100}, [email]: {bytesInOutput: 250}, [socket]: {bytesInOutput: 200}}}}});
const options = () => ({compilerWorkingDirectory, reportDirectory,
  inputRows: Object.entries(make().inputs).map(([file, row]) => ({file, type: 'file', bytes: row.bytes}))});
const fail = (mutate, code, secondOnly = false) => {
  const first = make(), second = make(), opts = options();
  mutate(secondOnly ? second : first, opts);
  assert.throws(() => analyzeRuntimeGraph(first, second, opts), error => error.code === code && error.message === code);
};

function privateFixture() {
  const meta = make(), opts = options();
  const pkg = REVIEWED_PRIVATE_INPUTS[0];
  const packageBytes = fs.readFileSync(new URL('./r18c-es6-symbol-3.1.4/package.json', import.meta.url));
  assert.equal(crypto.createHash('sha256').update(packageBytes).digest('hex'), pkg.packageSha256);
  opts.inputRows.push({file: pkg.packageFile, type: 'file', bytes: packageBytes.length, sha256: pkg.packageSha256});
  for (const reviewed of REVIEWED_PRIVATE_INPUTS) {
    const bytes = fs.readFileSync(new URL('./r18c-es6-symbol-3.1.4/' + reviewed.file.split('es6-symbol/')[1], import.meta.url));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), reviewed.sha256);
    assert.equal(bytes.length, reviewed.bytes);
    opts.inputRows.push({file: reviewed.file, type: 'file', bytes: bytes.length, sha256: reviewed.sha256});
    meta.inputs[reviewed.file] = {bytes: bytes.length, format: 'cjs', imports: []};
    meta.inputs[entry].imports.push({path: reviewed.file, kind: 'require-call'});
    meta.outputs[out].inputs[reviewed.file] = {bytesInOutput: 1};
  }
  return {meta, opts};
}

test('published private modules match exact source/package hashes across keys, edges, and contributions', () => {
  const {meta, opts} = privateFixture();
  const result = analyzeRuntimeGraph(meta, clone(meta), opts);
  assert.equal(result.inputCount, 6);
  assert.equal(result.requiresReview, false);
  assert.deepEqual(result.reviewedPrivateInputs, REVIEWED_PRIVATE_INPUTS);
  assert.ok(Object.isFrozen(REVIEWED_PRIVATE_INPUTS));
  assert.ok(REVIEWED_PRIVATE_INPUTS.every(Object.isFrozen));
});

test('reviewed exception normalizes historical absolute and dot-prefix aliases consistently', () => {
  const {meta, opts} = privateFixture(), second = clone(meta);
  for (const reviewed of REVIEWED_PRIVATE_INPUTS) {
    const f = reviewed.file, absolute = `${compilerWorkingDirectory}/${f}`;
    second.inputs[absolute] = second.inputs[f]; delete second.inputs[f];
    second.inputs[entry].imports.find(row => row.path === f).path = './' + f;
    second.outputs[out].inputs[absolute] = second.outputs[out].inputs[f]; delete second.outputs[out].inputs[f];
  }
  assert.equal(analyzeRuntimeGraph(meta, second, opts).reviewedPrivateInputs.length, 3);
});

test('changed recorded module identities cannot grant the private exception', () => {
  for (const change of [r => {r.sha256 = '0'.repeat(64);}, r => {r.bytes++;}, r => {r.type = 'symlink';}]) {
    const {meta, opts} = privateFixture();
    change(opts.inputRows.find(row => row.file === REVIEWED_PRIVATE_INPUTS[0].file));
    assert.throws(() => analyzeRuntimeGraph(meta, clone(meta), opts), {code: 'RUNTIME_REVIEWED_PRIVATE_INPUT_IDENTITY'});
  }
});

test('changed or missing recorded package identities cannot grant the private exception', () => {
  for (const mode of ['hash', 'size', 'symlink', 'missing']) {
    const {meta, opts} = privateFixture(), file = REVIEWED_PRIVATE_INPUTS[0].packageFile;
    const row = opts.inputRows.find(r => r.file === file);
    if (mode === 'hash') row.sha256 = '0'.repeat(64);
    if (mode === 'size') row.bytes++;
    if (mode === 'symlink') row.type = 'symlink';
    if (mode === 'missing') opts.inputRows = opts.inputRows.filter(r => r.file !== file);
    assert.throws(() => analyzeRuntimeGraph(meta, clone(meta), opts), {code: 'RUNTIME_REVIEWED_PRIVATE_PACKAGE_IDENTITY'});
  }
});

test('unreviewed private and sensitive paths still fail without filename disclosure', () => {
  for (const file of ['server/private/PRIVATE_TOKEN.js', 'node_modules/other/lib/private/PRIVATE_TOKEN.js',
    'node_modules/es6-symbol/lib/private/PRIVATE_TOKEN.js', 'node_modules/es6-symbol/lib/private/.env.production',
    'node_modules/es6-symbol/lib/private/.ssh/PRIVATE_TOKEN.js', 'node_modules/es6-symbol/lib/private/.npmrc',
    'node_modules/es6-symbol/lib/private/.netrc', 'node_modules/es6-symbol/lib/private/PRIVATE_TOKEN.key',
    'node_modules/es6-symbol/lib/private/PRIVATE_TOKEN.pem', 'node_modules/es6-symbol/lib/private/PRIVATE_TOKEN.pfx',
    'node_modules/es6-symbol/lib/private/PRIVATE_TOKEN.p12', 'node_modules/es6-symbol/lib/private/.git/PRIVATE_TOKEN.js']) {
    const {meta, opts} = privateFixture();
    meta.inputs[entry].imports.push({path: file, kind: 'require-call'});
    assert.throws(() => analyzeRuntimeGraph(meta, clone(meta), opts), error => {
      assert.equal(error.code, 'RUNTIME_INPUT_PRIVATE_OR_INVALID');
      assert.equal(JSON.stringify(error).includes('PRIVATE_TOKEN'), false);
      assert.equal(error.details.specifierSha256, crypto.createHash('sha256').update(file).digest('hex'));
      return true;
    });
  }
});

test('published private filenames do not weaken output external or package name validation', () => {
  for (const spec of [REVIEWED_PRIVATE_INPUTS[0].file, 'es6-symbol/lib/private/generate-name.js']) {
    const {meta, opts} = privateFixture();
    meta.outputs[out].imports.push({path: spec, kind: 'require-call', external: true});
    assert.throws(() => analyzeRuntimeGraph(meta, clone(meta), opts), {code: 'RUNTIME_EXTERNAL_SPECIFIER'});
  }
});

test('private exception cannot bypass traversal, root escape, or case-sensitive path identity', () => {
  for (const [file, code] of [
    ['node_modules/es6-symbol/lib/private/../private/generate-name.js', 'RUNTIME_INPUT_PATH'],
    ['/tmp/other/node_modules/es6-symbol/lib/private/generate-name.js', 'RUNTIME_INPUT_BOUNDARY'],
    ['node_modules/es6-symbol/lib/PRIVATE/generate-name.js', 'RUNTIME_INPUT_PRIVATE_OR_INVALID']
  ]) {
    const {meta, opts} = privateFixture();
    meta.inputs[entry].imports.push({path: file, kind: 'require-call'});
    assert.throws(() => analyzeRuntimeGraph(meta, clone(meta), opts), {code});
  }
});

test('an input-only external using a reviewed spelling still requires opaque external review', () => {
  const {meta, opts} = privateFixture();
  meta.inputs[entry].imports.push({path: REVIEWED_PRIVATE_INPUTS[0].file, kind: 'require-call', external: true});
  const result = analyzeRuntimeGraph(meta, clone(meta), opts);
  assert.equal(result.requiresReview, true);
  assert.equal(result.externalInputReview.length, 1);
  assert.equal(result.externalInputReview[0].specifierClass, 'OPAQUE');
});

test('links repeated input bytes, contributions, external owners and package importers', () => {
  const result = analyzeRuntimeGraph(make(), make(), options());
  assert.equal(result.status, 'REPEATED_RECORDED_SERVER_GRAPH_MATCH');
  assert.equal(result.inputCount, 3);
  assert.equal(result.outputBytes, 700);
  assert.equal(result.inputs.find(row => row.file === email).bytesInOutput, 250);
  assert.deepEqual(result.externalOwners.find(row => row.specifier === '@react-email/render'), {
    specifier: '@react-email/render', owner: email, kind: 'dynamic-import', ownerPackage: 'resend', isEmittedSpecifier: true
  });
  assert.deepEqual(result.packages.find(row => row.name === 'ws'), {name: 'ws', inputCount: 1, importedBy: [entry]});
  assert.match(result.scope, /NOT_RUNTIME_REACHABILITY_OR_COMPLETE_DYNAMIC_GRAPH/);
});

test('historical absolute input aliases and relative output normalize without reading former cwd', () => {
  const first = make(), second = make();
  second.inputs[`${compilerWorkingDirectory}/${email}`] = second.inputs[email];
  delete second.inputs[email];
  second.inputs[entry].imports[0].path = `${compilerWorkingDirectory}/${email}`;
  second.outputs[out].inputs[`${compilerWorkingDirectory}/${email}`] = second.outputs[out].inputs[email];
  delete second.outputs[out].inputs[email];
  second.outputs[out].entryPoint = `${compilerWorkingDirectory}/${entry}`;
  second.outputs['../../home/runner/workspace/.mmhb-release-evidence/r17b-q6rzGy/server-build/server.mjs'] = second.outputs[out];
  delete second.outputs[out];
  assert.equal(analyzeRuntimeGraph(first, second, options()).inputCount, 3);
});

test('duplicate input aliases and duplicate contribution aliases are rejected', () => {
  fail(meta => {meta.inputs[`${compilerWorkingDirectory}/${email}`] = clone(meta.inputs[email]);}, 'RUNTIME_INPUT_ALIAS_DUPLICATE');
  fail(meta => {meta.outputs[out].inputs[`${compilerWorkingDirectory}/${email}`] = {bytesInOutput: 1};}, 'RUNTIME_OUTPUT_INPUT_ALIAS_DUPLICATE');
});

test('traversal, escaped absolute internal input and private input remain rejected without echo', () => {
  fail(meta => {meta.inputs[entry].imports[0].path = '../mmhb-build-r17b-AbC123/server/app.mjs';}, 'RUNTIME_INPUT_PATH');
  fail(meta => {meta.inputs[entry].imports[0].path = '/home/runner/workspace/server/app.mjs';}, 'RUNTIME_INPUT_BOUNDARY');
  fail(meta => {meta.inputs[entry].imports[0].path = '.env.production';}, 'RUNTIME_INPUT_PRIVATE_OR_INVALID');
});

test('input absent from retained inventory or wrong bytes cannot qualify', () => {
  fail((meta, opts) => {opts.inputRows = opts.inputRows.filter(row => row.file !== email);}, 'RUNTIME_INPUT_NOT_RECORDED_FILE');
  fail(meta => {meta.inputs[email].bytes++;}, 'RUNTIME_INPUT_BYTE_MISMATCH');
  fail((meta, opts) => {opts.inputRows.find(row => row.file === email).type = 'symlink';}, 'RUNTIME_INPUT_NOT_RECORDED_FILE');
});

test('output must be exactly recorded server bundle and recorded entry point', () => {
  fail(meta => {meta.outputs[`${reportDirectory}/candidate/server.mjs`] = meta.outputs[out]; delete meta.outputs[out];}, 'RUNTIME_OUTPUT_PATH');
  fail(meta => {meta.outputs[out].entryPoint = email;}, 'RUNTIME_ENTRY_POINT');
  fail(meta => {meta.outputs['extra.mjs'] = clone(meta.outputs[out]);}, 'RUNTIME_OUTPUT_COUNT');
});

test('malformed import records, unknown kinds and ambiguous external flag are rejected', () => {
  fail(meta => {meta.inputs[entry].imports.push(null);}, 'RUNTIME_IMPORT_RECORD');
  fail(meta => {meta.inputs[entry].imports[0].kind = 'future-kind';}, 'RUNTIME_IMPORT_KIND');
  fail(meta => {meta.inputs[entry].imports[0].external = 'false';}, 'RUNTIME_IMPORT_EXTERNAL');
  fail(meta => {meta.inputs[entry].imports[0].with = {type: 4};}, 'RUNTIME_IMPORT_ATTRIBUTES');
});

test('internal edge must be represented in the same graph, not merely in inventory', () => {
  fail((meta, opts) => {
    opts.inputRows.push({file: 'server/unused.mjs', bytes: 100});
    meta.inputs[entry].imports[0].path = 'server/unused.mjs';
  }, 'RUNTIME_INTERNAL_IMPORT_NOT_IN_GRAPH');
});

test('repeat graph changes, including contributions and input set, cannot qualify', () => {
  fail(meta => {meta.outputs[out].inputs[email].bytesInOutput--;}, 'RUNTIME_REPEAT_GRAPH_MISMATCH', true);
  fail((meta, opts) => {
    opts.inputRows.push({file: 'server/unused.mjs', bytes: 0});
    meta.inputs['server/unused.mjs'] = {bytes: 0, imports: []};
  }, 'RUNTIME_REPEAT_GRAPH_MISMATCH', true);
});

test('repeat output external sets and kinds must match; static source edges need not survive tree shaking', () => {
  fail(meta => {meta.outputs[out].imports.pop();}, 'RUNTIME_REPEAT_GRAPH_MISMATCH', true);
  const meta = make();
  meta.outputs[out].imports = meta.outputs[out].imports.filter(row => row.path !== 'bufferutil');
  const result = analyzeRuntimeGraph(meta, clone(meta), options());
  assert.equal(result.externalImports.includes('bufferutil'), false);
  assert.equal(result.externalOwners.some(row => row.specifier === 'bufferutil'), true);
});

test('output contributions and inventory duplicates have strict bounds', () => {
  fail(meta => {meta.outputs[out].inputs[email].bytesInOutput = -1;}, 'RUNTIME_OUTPUT_INPUT_SHAPE');
  fail(meta => {meta.outputs[out].inputs[email].bytesInOutput = 650;}, 'RUNTIME_OUTPUT_CONTRIBUTIONS');
  fail((meta, opts) => {opts.inputRows.push(clone(opts.inputRows[0]));}, 'RUNTIME_INVENTORY_ROW');
});

test('context roots are explicit historical R17B roots; module has no fixture-path override', () => {
  fail((meta, opts) => {opts.compilerWorkingDirectory = '/tmp/mmhb-build-r17b-AbC123/..';}, 'RUNTIME_COMPILER_ROOT');
  fail((meta, opts) => {opts.reportDirectory = '/tmp/anything';}, 'RUNTIME_REPORT_ROOT');
});

test('esbuild 0.28.2 input attributes are validated and compared without printing their values', () => {
  const meta = make();
  meta.inputs[email].with = {type: 'json'};
  const result = analyzeRuntimeGraph(meta, clone(meta), options());
  assert.match(result.inputs.find(row => row.file === email).attributesSha256, /^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(result).includes('"json"'), false);
  const second = clone(meta);
  second.inputs[email].with = {type: 'text'};
  assert.throws(() => analyzeRuntimeGraph(meta, second, options()), {code: 'RUNTIME_REPEAT_GRAPH_MISMATCH'});
  fail(m => {m.inputs[email].with = {type: 4};}, 'RUNTIME_IMPORT_ATTRIBUTES');
});

const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const opaqueMeta = (specifier, ownerBytesInOutput = 250) => {
  const meta = make();
  meta.inputs[email].imports.push({path: specifier, kind: 'require-call', external: true});
  meta.outputs[out].inputs[email].bytesInOutput = ownerBytesInOutput;
  return meta;
};

test('input-only relative, absolute and scheme externals retain only opaque identity and require review', () => {
  for (const [specifier, specifierClass] of [
    ['./absent-PRIVATE_TOKEN.node', 'RELATIVE_PATH'],
    ['../absent-PRIVATE_TOKEN.node', 'RELATIVE_PATH'],
    ['/private/PRIVATE_TOKEN.node', 'ABSOLUTE_PATH'],
    ['https://user:PRIVATE_TOKEN@example.test/pkg.js', 'SCHEME_REFERENCE'],
    ['@bad?PRIVATE_TOKEN', 'OPAQUE']
  ]) {
    const meta = opaqueMeta(specifier);
    const result = analyzeRuntimeGraph(meta, clone(meta), options());
    assert.equal(result.requiresReview, true);
    assert.deepEqual(result.externalInputReview, [{graphSide: 'INPUT', owner: email,
      importIndex: 1, kind: 'require-call', specifierSha256: sha(specifier),
      specifierBytes: Buffer.byteLength(specifier), specifierClass,
      ownerPackage: 'resend', ownerBytesInOutput: 250}]);
    const edge = result.inputs.find(row => row.file === email).imports.find(row => row.opaqueSpecifier);
    assert.equal(edge.path, undefined);
    assert.equal(edge.opaqueSpecifier.specifierSha256, sha(specifier));
    assert.equal(result.externalImports.includes(specifier), false);
    assert.equal(result.externalOwners.some(row => row.specifier === specifier), false);
    assert.equal(JSON.stringify(result).includes('PRIVATE_TOKEN'), false);
  }
});

test('zero owner contribution does not waive review or classify opaque edge unreachable', () => {
  const meta = opaqueMeta('./absent.node', 0);
  const result = analyzeRuntimeGraph(meta, clone(meta), options());
  assert.equal(result.requiresReview, true);
  assert.equal(result.externalInputReview[0].ownerBytesInOutput, 0);
  assert.equal(JSON.stringify(result.externalInputReview).includes('UNREACHABLE'), false);
});

test('input opaque identities take part in repeat comparison, including same shape and byte count', () => {
  const first = opaqueMeta('./PRIVATE_TOKEN_A.node'), second = opaqueMeta('./PRIVATE_TOKEN_B.node');
  assert.throws(() => analyzeRuntimeGraph(first, second, options()), {code: 'RUNTIME_REPEAT_GRAPH_MISMATCH'});
  assert.equal(analyzeRuntimeGraph(first, clone(first), options()).requiresReview, true);
});

test('output externals stay strict with bounded hashed diagnostic and metadata side/index', () => {
  for (const value of ['./PRIVATE_TOKEN.node', '/private/PRIVATE_TOKEN.node',
    'https://user:PRIVATE_TOKEN@example.test/mod.mjs', '@bad?PRIVATE_TOKEN']) {
    for (const metadataIndex of [1, 2]) {
      const first = make(), second = make();
      (metadataIndex === 1 ? first : second).outputs[out].imports.push({path: value, kind: 'require-call', external: true});
      assert.throws(() => analyzeRuntimeGraph(first, second, options()), error => {
        assert.equal(error.code, 'RUNTIME_EXTERNAL_SPECIFIER');
        assert.equal(error.message, error.code);
        assert.deepEqual(error.details, {metadataIndex, graphSide: 'OUTPUT',
          owner: 'server-build/server.mjs', importIndex: 3, kind: 'require-call',
          specifierSha256: sha(value), specifierBytes: Buffer.byteLength(value),
          specifierClass: value.startsWith('./') ? 'RELATIVE_PATH' : value.startsWith('/') ? 'ABSOLUTE_PATH'
            : value.startsWith('https:') ? 'SCHEME_REFERENCE' : 'OPAQUE'});
        assert.equal(JSON.stringify(error).includes('PRIVATE_TOKEN'), false);
        return true;
      });
    }
  }
});

test('malformed input externals still fail with input-side diagnostics without leaking value', () => {
  for (const value of ['PRIVATE_TOKEN\n', 'PRIVATE_TOKEN\\path', '', 'x'.repeat(4097), '\ud800', null]) {
    const first = make();
    first.inputs[email].imports.push({path: value, kind: 'dynamic-import', external: true});
    assert.throws(() => analyzeRuntimeGraph(first, make(), options()), error => {
      assert.equal(error.code, 'RUNTIME_EXTERNAL_SPECIFIER');
      assert.equal(error.details.graphSide, 'INPUT');
      assert.equal(error.details.metadataIndex, 1);
      assert.equal(error.details.owner, email);
      assert.equal(error.details.importIndex, 1);
      if (typeof value === 'string') {
        assert.equal(error.details.specifierClass, 'MALFORMED_STRING');
        assert.equal(error.details.specifierSha256, sha(value));
      } else assert.equal(error.details.specifierType, 'null');
      assert.equal(JSON.stringify(error).includes('PRIVATE_TOKEN'), false);
      return true;
    });
  }
});

test('malformed internal import paths have safe location and hashed-value metadata', () => {
  const first = make();
  first.inputs[entry].imports[0].path = 'server/PRIVATE_TOKEN\n.mjs';
  assert.throws(() => analyzeRuntimeGraph(first, make(), options()), error => {
    assert.equal(error.code, 'RUNTIME_INPUT_PATH');
    assert.equal(error.details.graphSide, 'INPUT');
    assert.equal(error.details.owner, entry);
    assert.equal(error.details.importIndex, 0);
    assert.equal(error.details.specifierClass, 'MALFORMED_STRING');
    assert.equal(JSON.stringify(error).includes('PRIVATE_TOKEN'), false);
    return true;
  });
});

test('inferred invalid package name fails its own gate without echoing package or owner path', () => {
  const first = make(), invalidFile = 'node_modules/@PRIVATE_TOKEN/file.mjs';
  first.inputs[invalidFile] = {bytes: 1, imports: []};
  const opts = options();
  opts.inputRows.push({file: invalidFile, bytes: 1});
  // A scoped name requires a second valid name segment. This one has a query marker.
  const queryFile = invalidFile.replace('file.mjs', '?credential');
  first.inputs[queryFile] = first.inputs[invalidFile];
  delete first.inputs[invalidFile];
  opts.inputRows.at(-1).file = queryFile;
  assert.throws(() => analyzeRuntimeGraph(first, clone(first), opts), error => {
    assert.equal(error.code, 'RUNTIME_PACKAGE_NAME');
    assert.equal(error.details.graphSide, 'PACKAGE');
    assert.equal(error.details.metadataIndex, 1);
    assert.equal(error.details.owner, undefined);
    assert.equal(error.details.ownerSha256, sha(queryFile));
    assert.equal(error.details.specifierSha256, sha('@PRIVATE_TOKEN/?credential'));
    assert.equal(JSON.stringify(error).includes('PRIVATE_TOKEN'), false);
    assert.equal(JSON.stringify(error).includes('credential'), false);
    return true;
  });
});

test('ordinary input external owners state emitted-specifier membership without claiming callsite mapping', () => {
  const first = make();
  first.outputs[out].imports = first.outputs[out].imports.filter(row => row.path !== 'bufferutil');
  const result = analyzeRuntimeGraph(first, clone(first), options());
  assert.equal(result.requiresReview, false);
  assert.deepEqual(result.externalInputReview, []);
  assert.equal(result.externalOwners.find(row => row.specifier === 'bufferutil').isEmittedSpecifier, false);
  assert.equal(result.externalOwners.find(row => row.specifier === 'node:buffer').isEmittedSpecifier, true);
});
