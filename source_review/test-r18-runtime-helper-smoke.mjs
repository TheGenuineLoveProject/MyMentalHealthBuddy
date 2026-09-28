import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import Module from 'node:module';
import { runHelperSmokes, SMOKE_SOURCE_HASHES } from './r18-runtime-helper-smoke.mjs';

const reviewed = JSON.parse(readFileSync(new URL('./r14-external-reviewed-mapping.json', import.meta.url), 'utf8'));
const localSources = {
  'node_modules/ws/lib/buffer-util.js': './r14-external-ws-lib-buffer-util.js',
  'node_modules/ws/lib/validation.js': './r14-external-ws-lib-validation.js',
  'node_modules/pg/lib/stream.js': './r14-external-node-postgres-packages-pg-lib-stream.js'
};
const sources = Object.fromEntries(Object.entries(localSources).map(([path, local]) => [path, readFileSync(new URL(local, import.meta.url), 'utf8')]));
function withoutAnyEvaluation(fn) {
  const original = Script.prototype.runInContext;
  let evaluations = 0;
  Script.prototype.runInContext = function () { evaluations++; throw new Error('TEST_EVALUATION_MUST_NOT_OCCUR'); };
  try { fn(); assert.equal(evaluations, 0); } finally { Script.prototype.runInContext = original; }
}

test('pins equal the three independently reviewed mapping entries', () => {
  for (const [path, hash] of Object.entries(SMOKE_SOURCE_HASHES)) {
    assert.equal(reviewed.sources.find(row => row.workspacePath === path)?.sha256, hash);
  }
  assert.equal(Object.keys(SMOKE_SOURCE_HASHES).length, 3);
});

test('real reviewed source passes synthetic optional-addon and fake transport branches', () => {
  const result = runHelperSmokes(sources);
  assert.equal(result.status, 'SYNTHETIC_REVIEWED_HELPER_SMOKE_ONLY');
  assert.equal(result.checkCount, 11);
  assert.equal(result.assertions, 116);
  assert.ok(result.checks.every(row => row.status === 'PASS'));
  assert.equal(result.applicationStarted, false);
  assert.equal(result.realTransportModulesLoaded, false);
  const rows = Object.fromEntries(result.checks.map(row => [row.name, row]));
  assert.equal(rows.ws_bufferutil_missing_js_roundtrip.optionalRequireAttempts, 1);
  assert.equal(rows.ws_bufferutil_disabled_js_roundtrip.optionalRequireAttempts, 0);
  assert.equal(rows.ws_utf8_node_builtin.optionalRequireAttempts, 0);
  assert.equal(rows.ws_utf8_node_builtin.builtinCalls, 4);
  assert.equal(rows.ws_utf8_missing_addon_js.optionalRequireAttempts, 1);
  assert.equal(rows.ws_utf8_disabled_addon_js.optionalRequireAttempts, 0);
  assert.equal(rows.pg_cloudflare_missing_addon_propagates_on_stream_request.optionalRequireAttempts, 1);
  assert.equal(rows.pg_node_navigator_precedes_response_fake_transports.responseProbes, 0);
  assert.equal(rows.pg_cloudflare_response_fake_transports.responseProbes, 1);
});

test('hash mismatch at every input position prevents all source evaluation', () => {
  for (const file of Object.keys(sources)) {
    withoutAnyEvaluation(() => {
      assert.throws(() => runHelperSmokes({ ...sources, [file]: sources[file] + '\nthrow new Error("UNREVIEWED");\n' }), { code: 'HELPER_SOURCE_HASH_MISMATCH' });
    });
  }
});

test('missing and extra source paths fail before evaluation', () => {
  withoutAnyEvaluation(() => {
    const incomplete = { ...sources };
    delete incomplete['node_modules/pg/lib/stream.js'];
    assert.throws(() => runHelperSmokes(incomplete), { code: 'HELPER_SOURCE_PATH_SET' });
    assert.throws(() => runHelperSmokes({ ...sources, 'node_modules/unreviewed.js': 'throw 1' }), { code: 'HELPER_SOURCE_PATH_SET' });
  });
});

test('source getter and non-string values are rejected without invoking the getter or evaluating source', () => {
  withoutAnyEvaluation(() => {
    let getterCalls = 0;
    const withGetter = { ...sources };
    Object.defineProperty(withGetter, 'node_modules/pg/lib/stream.js', { enumerable: true, get() { getterCalls++; return sources['node_modules/pg/lib/stream.js']; } });
    assert.throws(() => runHelperSmokes(withGetter), { code: 'HELPER_SOURCE_NOT_STRING' });
    assert.equal(getterCalls, 0);
    assert.throws(() => runHelperSmokes({ ...sources, 'node_modules/pg/lib/stream.js': Buffer.from('x') }), { code: 'HELPER_SOURCE_NOT_STRING' });
  });
});

test('every source evaluation and helper invocation uses a finite VM timeout', () => {
  const original = Script.prototype.runInContext;
  let evaluations = 0;
  Script.prototype.runInContext = function (context, options) {
    assert.equal(options.timeout, 1000);
    evaluations++;
    return original.call(this, context, options);
  };
  try {
    runHelperSmokes(sources);
    assert.ok(evaluations > 11, 'both source evaluations and helper invocations were observed');
  } finally { Script.prototype.runInContext = original; }
});

test('no real transport module is required and host optional-addon environment is not forwarded', () => {
  const originalLoad = Module._load;
  const transportLoads = [];
  const beforeBufferFlag = process.env.WS_NO_BUFFER_UTIL;
  const beforeUtf8Flag = process.env.WS_NO_UTF_8_VALIDATE;
  Module._load = function (request, ...args) {
    if (['net', 'node:net', 'tls', 'node:tls', 'pg-cloudflare', 'bufferutil', 'utf-8-validate'].includes(request)) {
      transportLoads.push(request);
      throw new Error('TEST_REAL_TRANSPORT_OR_ADDON_LOAD_FORBIDDEN');
    }
    return originalLoad.call(this, request, ...args);
  };
  process.env.WS_NO_BUFFER_UTIL = 'HOST_FIXTURE_FLAG';
  process.env.WS_NO_UTF_8_VALIDATE = 'HOST_FIXTURE_FLAG';
  try {
    const result = runHelperSmokes(sources);
    assert.deepEqual(transportLoads, []);
    assert.equal(result.checks.find(row => row.name === 'ws_bufferutil_missing_js_roundtrip').optionalRequireAttempts, 1);
    assert.equal(result.checks.find(row => row.name === 'ws_utf8_missing_addon_js').optionalRequireAttempts, 1);
  } finally {
    Module._load = originalLoad;
    if (beforeBufferFlag === undefined) delete process.env.WS_NO_BUFFER_UTIL; else process.env.WS_NO_BUFFER_UTIL = beforeBufferFlag;
    if (beforeUtf8Flag === undefined) delete process.env.WS_NO_UTF_8_VALIDATE; else process.env.WS_NO_UTF_8_VALIDATE = beforeUtf8Flag;
  }
});


test('evaluation uses captured verified strings and never rereads proxy get values', () => {
  let propertyReads = 0;
  const proxy = new Proxy(sources, { get() { propertyReads++; return 'while (true) {}'; } });
  const result = runHelperSmokes(proxy);
  assert.equal(result.checkCount, 11);
  assert.equal(propertyReads, 0);
});
