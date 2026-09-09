import { createHash } from 'node:crypto';
import { Buffer, isUtf8 as nodeIsUtf8 } from 'node:buffer';
import { createContext, Script } from 'node:vm';

// Pins are copied from r14-external-reviewed-mapping.json. All three inputs are
// authenticated against these reviewed bytes before any source is evaluated.
export const SMOKE_SOURCE_HASHES = Object.freeze({
  'node_modules/ws/lib/buffer-util.js': '8b0a45739132f82e25ea13163780abf547ccfe989267f3eb7abb475beec92da3',
  'node_modules/ws/lib/validation.js': '41ce8e83d0d434132e1704895fedb91f6703a701b42d91c80954ab29b2845593',
  'node_modules/pg/lib/stream.js': '0bd4001775301604ddf7c94152e05f6f30a9354876717bdae2ab636d00eb12ba'
});
const TIMEOUT_MS = 1000;
function gate(condition, code) {
  if (!condition) { const error = new Error(code); error.code = code; throw error; }
}
function missingAddon() {
  const error = new Error('SYNTHETIC_MISSING_OPTIONAL_ADDON');
  error.code = 'MODULE_NOT_FOUND';
  throw error;
}
function loadReviewed(source, file, { require: fakeRequire, env = {}, ...globals }) {
  const module = { exports: {} };
  const context = createContext({
    ...globals, Buffer, module, exports: module.exports,
    process: Object.freeze({ env: Object.freeze({ ...env }) }),
    require: fakeRequire
  }, { name: 'MMHB reviewed helper fixture', codeGeneration: { strings: false, wasm: false } });
  new Script(source, { filename: file }).runInContext(context, { timeout: TIMEOUT_MS });
  return {
    context,
    invoke(expression, inputs = {}) {
      Object.assign(context, inputs);
      return new Script(expression, { filename: 'MMHB fixed helper invocation' })
        .runInContext(context, { timeout: TIMEOUT_MS });
    }
  };
}

export function runHelperSmokes(sources) {
  gate(sources !== null && typeof sources === 'object' && !Array.isArray(sources), 'HELPER_SOURCES_SCHEMA');
  const keys = Object.keys(SMOKE_SOURCE_HASHES).sort();
  gate(JSON.stringify(Object.keys(sources).sort()) === JSON.stringify(keys), 'HELPER_SOURCE_PATH_SET');
  const verifiedSources = Object.create(null);
  for (const file of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(sources, file);
    gate(descriptor && Object.hasOwn(descriptor, 'value') && typeof descriptor.value === 'string', 'HELPER_SOURCE_NOT_STRING');
    gate(createHash('sha256').update(descriptor.value).digest('hex') === SMOKE_SOURCE_HASHES[file], 'HELPER_SOURCE_HASH_MISMATCH');
    verifiedSources[file] = descriptor.value;
  }
  gate(typeof nodeIsUtf8 === 'function', 'HELPER_NODE_UTF8_BUILTIN_UNAVAILABLE');
  const checks = [];

  for (const disabled of [false, true]) {
    let attempts = 0;
    const file = 'node_modules/ws/lib/buffer-util.js';
    const helper = loadReviewed(verifiedSources[file], file, {
      env: disabled ? { WS_NO_BUFFER_UTIL: '1' } : {},
      require(specifier) {
        if (specifier === './constants') return { EMPTY_BUFFER: Buffer.alloc(0) };
        if (specifier === 'bufferutil') { attempts++; return missingAddon(); }
        throw new Error('HELPER_UNEXPECTED_REQUIRE');
      }
    });
    let assertions = 0;
    for (const length of [0, 1, 31, 32, 47, 48, 96]) {
      const input = Buffer.from(Array.from({ length }, (_, index) => (index * 37 + 19) & 255));
      const mask = Buffer.from([0x51, 0x02, 0x93, 0xe4]);
      const offset = 7;
      const output = Buffer.alloc(length + offset + 3, 0xaa);
      helper.invoke('module.exports.mask(input, mask, output, offset, input.length)', { input, mask, output, offset });
      gate(output.subarray(0, offset).every(value => value === 0xaa) && output.subarray(offset + length).every(value => value === 0xaa), 'HELPER_MASK_OFFSET_SENTINELS'); assertions++;
      gate(output.subarray(offset, offset + length).every((value, index) => value === (input[index] ^ mask[index & 3])), 'HELPER_MASK_EXPECTED_XOR'); assertions++;
      const masked = output.subarray(offset, offset + length);
      helper.invoke('module.exports.unmask(masked, mask)', { masked });
      gate(masked.equals(input), 'HELPER_MASK_ROUND_TRIP'); assertions++;
    }
    gate(attempts === (disabled ? 0 : 1), 'HELPER_BUFFERUTIL_REQUIRE_BRANCH'); assertions++;
    checks.push({ name: disabled ? 'ws_bufferutil_disabled_js_roundtrip' : 'ws_bufferutil_missing_js_roundtrip', status: 'PASS', assertions, optionalRequireAttempts: attempts });
  }

  const utf8Cases = [
    [Buffer.alloc(0), true], [Buffer.from('plain ASCII'), true],
    [Buffer.from('mañana ☀'), true], [Buffer.from([0xf0, 0x9f, 0x8c, 0x8e]), true],
    [Buffer.from([0xc0, 0xaf]), false], [Buffer.from([0xed, 0xa0, 0x80]), false],
    [Buffer.from([0xe2, 0x82]), false], [Buffer.from([0xf4, 0x90, 0x80, 0x80]), false],
    [Buffer.from([0xe2, 0x28, 0xa1]), false],
    [Buffer.from('a'.repeat(24)), true], [Buffer.from('🙂'.repeat(16)), true],
    [Buffer.concat([Buffer.alloc(48, 0x61), Buffer.from([0xc0, 0xaf])]), false],
    [Buffer.concat([Buffer.alloc(48, 0x61), Buffer.from([0xf0, 0x9f])]), false]
  ];
  for (const variant of ['node_builtin', 'missing_addon_js', 'disabled_addon_js']) {
    let optionalAttempts = 0, builtinCalls = 0;
    const file = 'node_modules/ws/lib/validation.js';
    const helper = loadReviewed(verifiedSources[file], file, {
      env: variant === 'disabled_addon_js' ? { WS_NO_UTF_8_VALIDATE: '1' } : {},
      require(specifier) {
        if (specifier === './constants') return { hasBlob: false };
        if (specifier === 'buffer') return { isUtf8: variant === 'node_builtin' ? input => { builtinCalls++; return nodeIsUtf8(input); } : undefined };
        if (specifier === 'utf-8-validate') { optionalAttempts++; return missingAddon(); }
        throw new Error('HELPER_UNEXPECTED_REQUIRE');
      }
    });
    for (const [input, expected] of utf8Cases) {
      gate(helper.invoke('module.exports.isValidUTF8(input)', { input }) === expected, 'HELPER_UTF8_CASE_FAILED');
    }
    const expectedBuiltinCalls = variant === 'node_builtin' ? utf8Cases.filter(([input]) => input.length >= 24).length : 0;
    gate(builtinCalls === expectedBuiltinCalls, 'HELPER_UTF8_BUILTIN_BRANCH');
    gate(optionalAttempts === (variant === 'missing_addon_js' ? 1 : 0), 'HELPER_UTF8_OPTIONAL_BRANCH');
    checks.push({ name: `ws_utf8_${variant}`, status: 'PASS', assertions: utf8Cases.length + 2, builtinCalls, optionalRequireAttempts: optionalAttempts });
  }

  for (const variant of ['node_no_browser_globals', 'node_navigator_precedes_response', 'cloudflare_navigator', 'cloudflare_response', 'node_response_without_cf']) {
    const calls = [];
    let responseProbes = 0;
    const cloudflare = variant.startsWith('cloudflare_');
    const globals = {};
    class ProbeResponse {
      constructor(_body, options) {
        responseProbes++;
        if (variant !== 'node_response_without_cf') this.cf = options.cf;
      }
    }
    if (variant === 'node_navigator_precedes_response') { globals.navigator = { userAgent: 'Node.js/24' }; globals.Response = ProbeResponse; }
    if (variant === 'cloudflare_navigator') globals.navigator = { userAgent: 'Cloudflare-Workers' };
    if (variant === 'cloudflare_response' || variant === 'node_response_without_cf') globals.Response = ProbeResponse;
    const file = 'node_modules/pg/lib/stream.js';
    const helper = loadReviewed(verifiedSources[file], file, {
      ...globals,
      require(specifier) {
        calls.push(`require:${specifier}`);
        if (specifier === 'net') return { Socket: class FakeNodeSocket { constructor() { calls.push('fake:node_socket'); this.fixtureKind = 'node'; } } };
        if (specifier === 'tls') return { connect(options) { calls.push('fake:tls_connect'); return { fixtureKind: 'tls', options }; } };
        if (specifier === 'pg-cloudflare') return { CloudflareSocket: class FakeCloudflareSocket {
          constructor(ssl) { calls.push('fake:cloudflare_socket'); this.fixtureKind = 'cloudflare'; this.ssl = ssl; }
          startTls(options) { calls.push('fake:cloudflare_start_tls'); this.options = options; }
        } };
        throw new Error('HELPER_UNEXPECTED_REQUIRE');
      }
    });
    gate(calls.length === 0, 'HELPER_PG_TRANSPORT_LOADED_DURING_INIT');
    helper.invoke('stream = module.exports.getStream(true)');
    gate(helper.context.stream.fixtureKind === (cloudflare ? 'cloudflare' : 'node'), 'HELPER_PG_STREAM_BRANCH');
    helper.invoke('options = {socket: stream, servername: "fixture.invalid"}; secure = module.exports.getSecureStream(options)');
    if (cloudflare) {
      gate(helper.context.secure === helper.context.stream && helper.context.stream.options === helper.context.options && helper.context.stream.ssl === true, 'HELPER_PG_CLOUDFLARE_TLS');
      gate(JSON.stringify(calls) === JSON.stringify(['require:pg-cloudflare', 'fake:cloudflare_socket', 'fake:cloudflare_start_tls']), 'HELPER_PG_CLOUDFLARE_CALLS');
    } else {
      gate(helper.context.secure.fixtureKind === 'tls' && helper.context.secure.options === helper.context.options, 'HELPER_PG_NODE_TLS');
      gate(JSON.stringify(calls) === JSON.stringify(['require:net', 'fake:node_socket', 'require:tls', 'fake:tls_connect']), 'HELPER_PG_NODE_CALLS');
    }
    gate(responseProbes === (variant === 'cloudflare_response' || variant === 'node_response_without_cf' ? 1 : 0), 'HELPER_PG_RESPONSE_PROBE_BRANCH');
    checks.push({ name: `pg_${variant}_fake_transports`, status: 'PASS', assertions: 5, responseProbes, calls });
  }

  // A Cloudflare selection with the addon absent propagates failure when the
  // stream is requested. It must not be mislabeled an unconditional fallback.
  {
    const file = 'node_modules/pg/lib/stream.js';
    const calls = [];
    const helper = loadReviewed(verifiedSources[file], file, {
      navigator: { userAgent: 'Cloudflare-Workers' },
      require(specifier) { calls.push(specifier); if (specifier === 'pg-cloudflare') return missingAddon(); throw new Error('HELPER_UNEXPECTED_REQUIRE'); }
    });
    gate(calls.length === 0, 'HELPER_PG_MISSING_ADDON_INIT');
    let observed;
    try { helper.invoke('module.exports.getStream(true)'); } catch (error) { observed = error.code; }
    gate(observed === 'MODULE_NOT_FOUND' && JSON.stringify(calls) === '["pg-cloudflare"]', 'HELPER_PG_MISSING_CLOUDFLARE_PROPAGATION');
    checks.push({ name: 'pg_cloudflare_missing_addon_propagates_on_stream_request', status: 'PASS', assertions: 2, optionalRequireAttempts: calls.length });
  }
  return {
    status: 'SYNTHETIC_REVIEWED_HELPER_SMOKE_ONLY',
    sourceCount: keys.length,
    sourceHashes: { ...SMOKE_SOURCE_HASHES },
    checkCount: checks.length,
    assertions: checks.reduce((sum, row) => sum + row.assertions, 0),
    checks,
    evaluationTimeoutMs: TIMEOUT_MS,
    invocationTimeoutMs: TIMEOUT_MS,
    realTransportModulesLoaded: false,
    applicationStarted: false,
    limitations: [
      'Only the exact reviewed helper sources execute under fixed synthetic CommonJS and environment fixtures.',
      'No installed package or application is imported; no real net/tls/socket/Cloudflare transport is used.',
      'The Node UTF-8 builtin is exercised; its use by the actual deployment is not established.',
      'These cases do not establish bundle reachability, application startup, database connectivity or production environment behavior.',
      'node:vm is not a security sandbox. Source hashes are checked before evaluation; timeouts bound each evaluation and invocation.'
    ]
  };
}
