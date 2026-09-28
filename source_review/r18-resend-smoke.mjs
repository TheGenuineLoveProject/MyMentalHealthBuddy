import crypto from 'node:crypto';
import vm from 'node:vm';

export const RESEND_CJS_SHA256 = '66659b52d6b3350895d34b8bc290ccf07e4ceb7a0f0625d1a70f3850baf11806';
const RENDER_FAILURE = 'Failed to render React component. Make sure to install `@react-email/render` or `@react-email/components`.';
function demand(ok, code) { if (!ok) throw Object.assign(new Error(code), { code }); }
async function bounded(promise) {
  let timer;
  try {
    return await Promise.race([Promise.resolve(promise), new Promise((_, reject) => {
      timer = setTimeout(() => reject(Object.assign(new Error('RESEND_ASYNC_TIMEOUT'), { code: 'RESEND_ASYNC_TIMEOUT' })), 1500);
    })]);
  } finally { clearTimeout(timer); }
}

// Executes exact reviewed CJS bytes against inert test doubles. This is a
// synthetic SDK branch test, not an ESM/application test or a security sandbox.
export async function runResendSmoke(source) {
  demand(typeof source === 'string' && Buffer.byteLength(source) === 42455 &&
    crypto.createHash('sha256').update(source).digest('hex') === RESEND_CJS_SHA256,
  'RESEND_CJS_REVIEWED_BYTES_REQUIRED');
  demand(typeof vm.SyntheticModule === 'function', 'RESEND_VM_MODULES_FLAG_REQUIRED');
  const importRequests = [], requireRequests = [];
  let forbiddenFetchAttempts = 0, dependencyUseAttempts = 0;
  const denyDependency = () => {
    dependencyUseAttempts++;
    throw Object.assign(new Error('RESEND_SYNTHETIC_DEPENDENCY_USE_FORBIDDEN'), { code: 'RESEND_SYNTHETIC_DEPENDENCY_USE_FORBIDDEN' });
  };
  const context = vm.createContext({
    exports: {},
    require(specifier) {
      requireRequests.push(specifier);
      if (specifier === 'postal-mime') return Object.freeze({ parse: denyDependency });
      if (specifier === 'standardwebhooks') return Object.freeze({ Webhook: class { constructor() { denyDependency(); } } });
      throw Object.assign(new Error('RESEND_UNEXPECTED_REQUIRE'), { code: 'RESEND_UNEXPECTED_REQUIRE' });
    },
    fetch() { forbiddenFetchAttempts++; throw Object.assign(new Error('RESEND_FETCH_FORBIDDEN'), { code: 'RESEND_FETCH_FORBIDDEN' }); },
  }, { codeGeneration: { strings: false, wasm: false }, name: 'MMHB-R18-reviewed-Resend-synthetic' });
  const run = code => new vm.Script(code).runInContext(context, { timeout: 500 });
  run('globalThis.Headers = class { constructor() {} };');
  new vm.Script(source, {
    filename: 'reviewed-resend-6.22.1-index.cjs',
    importModuleDynamically: async specifier => {
      demand(importRequests.length < 30, 'RESEND_IMPORT_COUNT_LIMIT');
      importRequests.push(specifier);
      demand(specifier === '@react-email/render', 'RESEND_UNEXPECTED_DYNAMIC_IMPORT');
      throw Object.assign(new Error('SYNTHETIC_RENDERER_ABSENT'), { code: 'ERR_MODULE_NOT_FOUND' });
    },
  }).runInContext(context, { timeout: 500 });
  demand(JSON.stringify(requireRequests) === JSON.stringify(['postal-mime', 'standardwebhooks']), 'RESEND_REQUIRE_SET');
  run(`
    globalThis.__client = new exports.Resend('re_synthetic_no_credentials', {
      baseUrl: 'https://resend.invalid', userAgent: 'MMHB-R18-synthetic-test'
    });
    globalThis.__calls = [];
    __client.post = async (path, body) => {
      __calls.push({ method: 'post', path, body });
      return { data: { id: 'synthetic-result' }, error: null };
    };
    __client.patch = async (path, body) => {
      __calls.push({ method: 'patch', path, body });
      return { data: { id: 'synthetic-result' }, error: null };
    };
  `);
  const entrypoints = [
    { name: 'emails.send', expression: '__client.emails.send(__payload)', path: '/emails', method: 'post' },
    { name: 'batch.send', expression: '__client.batch.send([__payload])', path: '/emails/batch', method: 'post', batch: true },
    { name: 'broadcasts.create', expression: '__client.broadcasts.create(__payload)', path: '/broadcasts', method: 'post' },
    { name: 'broadcasts.update', expression: "__client.broadcasts.update('synthetic-broadcast', __payload)", path: '/broadcasts/synthetic-broadcast', method: 'patch' },
    { name: 'templates.create', expression: '__client.templates.create(__payload)', path: '/templates', method: 'post' },
  ];
  const cases = [];
  for (const entry of entrypoints) for (const mode of ['html_absent_react', 'text_absent_react', 'html_false_react', 'truthy_react_missing_renderer']) {
    const payload = { name: 'Synthetic template', from: 'sender@example.invalid', to: 'receiver@example.invalid', subject: 'Synthetic SDK test' };
    if (mode === 'text_absent_react') payload.text = 'Synthetic plain text';
    else payload.html = '<p>Synthetic HTML</p>';
    if (mode === 'html_false_react') payload.react = false;
    if (mode === 'truthy_react_missing_renderer') payload.react = { synthetic: true };
    run('globalThis.__calls = []; globalThis.__payload = ' + JSON.stringify(payload) + ';');
    const beforeImports = importRequests.length;
    let rejection = null;
    try { await bounded(run(entry.expression)); } catch (error) { rejection = error; }
    const calls = JSON.parse(run('JSON.stringify(__calls)'));
    const missingRenderer = mode === 'truthy_react_missing_renderer';
    if (missingRenderer) {
      demand(rejection?.message === RENDER_FAILURE, 'RESEND_RENDERER_ERROR_CONTRACT');
      demand(importRequests.length === beforeImports + 1 && calls.length === 0, 'RESEND_RENDERER_MISSING_DID_NOT_BLOCK_TRANSPORT');
    } else {
      demand(!rejection && importRequests.length === beforeImports && calls.length === 1, 'RESEND_NON_REACT_BRANCH_FAILED');
      const call = calls[0], body = entry.batch ? call.body[0] : call.body;
      demand(call.path === entry.path && call.method === entry.method, 'RESEND_SYNTHETIC_TRANSPORT_ROUTE');
      demand(body.html === payload.html && body.text === payload.text && !Object.hasOwn(body, 'react'), 'RESEND_PAYLOAD_CONTRACT');
    }
    demand(forbiddenFetchAttempts === 0 && dependencyUseAttempts === 0, 'RESEND_UNEXPECTED_SIDE_EFFECT_PATH');
    cases.push({ entrypoint: entry.name, mode, passed: true, dynamicRendererRequests: importRequests.length - beforeImports,
      syntheticTransportCalls: calls.length, missingRendererBlocksTransport: missingRenderer ? true : null });
  }
  demand(cases.length === 20 && importRequests.length === 5, 'RESEND_CASE_COMPLETENESS');
  return {
    status: 'RESEND_CJS_SYNTHETIC_BRANCH_SMOKE_PASS', version: '6.22.1', sourceSha256: RESEND_CJS_SHA256,
    cases, caseCount: cases.length, dependencyImportsStubbed: requireRequests,
    dependencyImplementationsExecuted: false, dependencyUseAttempts,
    dynamicImportRequests: importRequests.length, rendererImplementationExecuted: false,
    forbiddenFetchAttempts, networkRequestsPerformedByHarness: 0, emailSent: false,
    applicationImported: false, environmentProvidedToSdk: false, realCredentialsProvided: false,
    scope: 'EXACT_REVIEWED_CJS_WITH_STUBBED_DEPENDENCIES_AND_TRANSPORT_NOT_ESM_BUNDLE_APP_OR_DELIVERY_QUALIFICATION',
    limitations: [
      'The actual ESM entry and application call graph require separate retained-input and runtime qualification.',
      'postal-mime, standardwebhooks, Headers and SDK post/patch transports are test doubles; their implementations are not exercised.',
      'The missing renderer is simulated by the dynamic-import callback; the successful React rendering path is not tested.',
      'Node vm is not a security boundary; execution is restricted by an exact previously reviewed source hash.',
    ],
  };
}
