import assert from 'node:assert/strict';
import {test} from 'node:test';
import {analyzeRuntimeGraph} from './runtime-graph-policy-r18.mjs';

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

test('links repeated input bytes, contributions, external owners and package importers', () => {
  const result = analyzeRuntimeGraph(make(), make(), options());
  assert.equal(result.status, 'REPEATED_RECORDED_SERVER_GRAPH_MATCH');
  assert.equal(result.inputCount, 3);
  assert.equal(result.outputBytes, 700);
  assert.equal(result.inputs.find(row => row.file === email).bytesInOutput, 250);
  assert.deepEqual(result.externalOwners.find(row => row.specifier === '@react-email/render'), {
    specifier: '@react-email/render', owner: email, kind: 'dynamic-import', ownerPackage: 'resend'
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

test('traversal, escaped absolute input, private input and credential external are rejected without echo', () => {
  fail(meta => {meta.inputs[entry].imports[0].path = '../mmhb-build-r17b-AbC123/server/app.mjs';}, 'RUNTIME_INPUT_PATH');
  fail(meta => {meta.inputs[entry].imports[0].path = '/home/runner/workspace/server/app.mjs';}, 'RUNTIME_INPUT_BOUNDARY');
  fail(meta => {meta.inputs[entry].imports[0].path = '.env.production';}, 'RUNTIME_INPUT_PRIVATE_OR_INVALID');
  fail(meta => {meta.inputs[email].imports[0].path = 'https://secret:token@example.test/index.js';}, 'RUNTIME_EXTERNAL_SPECIFIER');
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
