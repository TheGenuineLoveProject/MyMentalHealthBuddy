// Offline route/service fixture. This never imports the application entrypoint,
// a real DAO, environment, credentials, or transport. VM isolates dependencies;
// it is not a security sandbox for hostile source.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
const actualPaths = [
  'server/routes/social-posting.mjs',
  'server/services/social-posting.mjs',
  'server/services/social-platforms.mjs',
  'server/utils/response.mjs',
  'shared/socialPublicationStatus.mjs',
];
const clone = value => JSON.parse(JSON.stringify(value));

export function draftFixture(overrides = {}) {
  return {
    id: '00000000-0000-4000-8000-000000000001',
    userId: '00000000-0000-4000-8000-000000000002',
    platform: 'facebook',
    caption: 'Synthetic isolated publication fixture; never send.',
    status: 'approved',
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function calendarFixture(overrides = {}) {
  return {
    id: '00000000-0000-4000-8000-000000000003',
    draftId: draftFixture().id,
    scheduledDate: '2020-01-01T00:00:00.000Z',
    platform: 'facebook',
    status: 'scheduled',
    createdAt: '2020-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function tableColumns(schemaText, exportName) {
  const block = schemaText.match(new RegExp(`export const ${exportName} = pgTable\\([^\\n]+\\{([\\s\\S]*?)\\n\\}\\);`));
  assert.ok(block, `Missing canonical schema definition: ${exportName}`);
  const keys = [...block[1].matchAll(/^  ([A-Za-z][A-Za-z0-9]*):/gm)].map(match => match[1]);
  assert.ok(keys.includes('id'));
  return keys;
}

export async function createPublicationHarness({
  drafts = [draftFixture()],
  calendar = [],
  providerModes = {},
  configured = true,
  loseScheduledClaim = false,
  loseScheduledFinalization = false,
  loseDraftClaim = false,
  failAfterProviderWrite = null,
  failScheduledClaim = false,
  routeModule = 'social-posting',
} = {}) {
  assert.ok(['social-posting', 'admin-social-studio'].includes(routeModule));
  const sources = new Map();
  const sourceDigests = {};
  for (const relative of actualPaths) {
    const bytes = await readFile(path.join(repositoryRoot, relative));
    sources.set(`/${relative}`, bytes.toString('utf8'));
    sourceDigests[relative] = createHash('sha256').update(bytes).digest('hex');
  }
  if (routeModule === 'admin-social-studio') {
    const relative = 'server/routes/admin-social-studio.mjs';
    const bytes = await readFile(path.join(repositoryRoot, relative));
    sources.set(`/${relative}`, bytes.toString('utf8'));
    sourceDigests[relative] = createHash('sha256').update(bytes).digest('hex');
  }
  const appSource = await readFile(path.join(repositoryRoot, 'server/app.mjs'), 'utf8');
  assert.match(appSource, /app\.use\(["']\/api\/social-posting["'],\s*socialPostingRoutes\)/);
  if (routeModule === 'admin-social-studio') assert.match(appSource, /app\.use\(["']\/api\/admin\/social["'],\s*manualSocialStudioRouter\)/);
  const schemaText = await readFile(path.join(repositoryRoot, 'shared/schema.mjs'), 'utf8');
  const columns = Object.fromEntries(['postDrafts', 'calendarEntries', 'contentTemplates'].map(name => [name, tableColumns(schemaText, name)]));
  const tableNames = new Map();
  const tables = {};
  for (const [name, keys] of Object.entries(columns)) {
    const table = new Proxy(Object.fromEntries(keys.map(column => [column, Object.freeze({ table: name, column })])), {
      get(target, key) {
        if (typeof key === 'symbol') return target[key];
        assert.ok(Object.hasOwn(target, key), `Unknown canonical schema column: ${name}.${key}`);
        return target[key];
      },
    });
    tableNames.set(table, name);
    tables[name] = table;
  }
  const rows = { postDrafts: clone(drafts), calendarEntries: clone(calendar) };
  for (const [name, records] of Object.entries(rows)) {
    for (const row of records) {
      for (const key of Object.keys(row)) assert.ok(columns[name].includes(key), `Invented fixture column: ${name}.${key}`);
    }
  }
  const events = [];
  const reads = [];
  const writes = [];
  const providerRequests = [];
  const logs = [];
  const aiRequests = [];
  let aiConstructors = 0;
  let draftClaimLost = false;
  const externalCalendarStates = new Map();
  let claimedElsewhere = false;
  let finalizedElsewhere = false;
  let injectedWriteFailure = false;
  let adminMiddlewareCalls = 0;

  function matches(row, predicate, tableName) {
    if (!predicate) return true;
    if (predicate.op === 'and') return predicate.conditions.every(condition => matches(row, condition, tableName));
    if (predicate.op === 'or') return predicate.conditions.some(condition => matches(row, condition, tableName));
    assert.ok(predicate.left?.column, 'A canonical column is required in predicates');
    assert.equal(predicate.left.table, tableName, 'Predicate must use a column from its actual target table');
    const value = row[predicate.left.column];
    if (predicate.op === 'eq') return value === predicate.right;
    if (predicate.op === 'ne') return value !== predicate.right;
    if (predicate.op === 'inArray') return predicate.right.includes(value);
    if (predicate.op === 'isNull') return value == null;
    if (predicate.op === 'lte') return new Date(value).getTime() <= new Date(predicate.right).getTime();
    throw new Error(`Unsupported fixture predicate: ${predicate.op}`);
  }
  function project(row, fields) {
    if (!fields) return clone(row);
    return Object.fromEntries(Object.entries(fields).map(([alias, column]) => [alias, row[column.column]]));
  }
  function requiresScheduledClaim(predicate) {
    const conditions = predicate?.op === 'and' ? predicate.conditions : [predicate];
    assert.ok(conditions.some(value => value?.op === 'eq' && value.left === tables.calendarEntries.id));
    assert.ok(conditions.some(value => value?.op === 'eq' && value.left === tables.calendarEntries.status && value.right === 'scheduled'), 'Scheduled claim must condition on scheduled status');
    assert.ok(conditions.some(value => value?.op === 'lte' && value.left === tables.calendarEntries.scheduledDate), 'Scheduled claim must condition on due date');
  }
  function thenable(execute) {
    let result;
    return (resolve, reject) => {
      result ??= Promise.resolve().then(execute);
      return result.then(resolve, reject);
    };
  }
  const db = {
    select(fields) {
      let name;
      let predicate;
      let max = Infinity;
      const query = {
        from(table) { name = tableNames.get(table); assert.ok(name); return query; },
        where(value) { predicate = value; return query; },
        orderBy() { return query; },
        limit(value) { max = value; return query; },
        then: thenable(() => {
          const result = rows[name].filter(row => matches(row, predicate, name)).slice(0, max).map(row => project(row, fields));
          reads.push({ table: name, count: result.length });
          events.push({ type: 'read', table: name });
          return result;
        }),
      };
      return query;
    },
    update(table) {
      const name = tableNames.get(table);
      assert.ok(name);
      let values;
      let predicate;
      let returning = false;
      let fields;
      const query = {
        set(value) {
          for (const key of Object.keys(value)) assert.ok(columns[name].includes(key), `Unknown write column: ${name}.${key}`);
          values = value;
          return query;
        },
        where(value) { predicate = value; return query; },
        returning(value) { returning = true; fields = value; return query; },
        then: thenable(() => {
          assert.ok(values && predicate, 'Updates require values and a matching predicate');
          if (name === 'calendarEntries' && values.status === 'publishing') {
            requiresScheduledClaim(predicate);
            assert.equal(returning, true, 'Provider dispatch requires a returned successful claim');
            if (failScheduledClaim) throw new Error('Synthetic pre-provider claim failure');
          }
          if (name === 'postDrafts' && values.status === 'publishing') {
            const conditions = predicate?.op === 'and' ? predicate.conditions : [predicate];
            assert.ok(conditions.some(value => value?.op === 'eq' && value.left === tables.postDrafts.id));
            assert.ok(conditions.some(value => value?.op === 'eq' && value.left === tables.postDrafts.status), 'Draft claim must compare the saved status');
            assert.equal(returning, true);
          }
          let matched = rows[name].filter(row => matches(row, predicate, name));
          if (loseDraftClaim && !draftClaimLost && name === 'postDrafts' && values.status === 'publishing') {
            draftClaimLost = true;
            for (const row of matched) row.status = 'publishing';
            matched = rows[name].filter(row => matches(row, predicate, name));
          }
          if (loseScheduledClaim && !claimedElsewhere && name === 'calendarEntries' && values.status === 'publishing') {
            claimedElsewhere = true;
            for (const row of matched) row.status = 'publishing'; // Another worker wins the conditional claim.
            matched = rows[name].filter(row => matches(row, predicate, name));
          }
          if (loseScheduledFinalization && !finalizedElsewhere && name === 'calendarEntries' && values.status !== 'publishing' && providerRequests.length > 0) {
            finalizedElsewhere = true;
            for (const row of matched) { row.status = 'cancelled'; externalCalendarStates.set(row.id, 'cancelled'); }
            // Re-evaluate the actual predicate after contention; an unconditional
            // final update would now overwrite the competing state and fail tests.
            matched = rows[name].filter(row => matches(row, predicate, name));
          }
          const write = { table: name, values: clone(values), matched: matched.length, committed: false };
          writes.push(write);
          events.push({ type: 'write', table: name, status: values.status, matched: matched.length });
          if (!injectedWriteFailure && failAfterProviderWrite === name && providerRequests.length > 0 && values.status !== 'publishing') {
            injectedWriteFailure = true;
            throw new Error('Synthetic post-provider persistence failure');
          }
          for (const row of matched) Object.assign(row, clone(values));
          write.committed = true;
          return returning ? matched.map(row => project(row, fields)) : { rowCount: matched.length };
        }),
      };
      return query;
    },
    insert(table) {
      const name = tableNames.get(table);
      let incoming;
      const query = {
        values(value) {
          incoming = Array.isArray(value) ? value : [value];
          for (const row of incoming) for (const key of Object.keys(row)) assert.ok(columns[name].includes(key), `Unknown insert column: ${name}.${key}`);
          return query;
        },
        returning() { return query; },
        then: thenable(() => {
          const inserted = incoming.map((row, index) => ({ id: `00000000-0000-4000-8000-${String(100 + rows[name].length + index).padStart(12, '0')}`, ...clone(row) }));
          rows[name].push(...inserted);
          writes.push({ table: name, values: clone(incoming), matched: inserted.length, committed: true });
          return clone(inserted);
        }),
      };
      return query;
    },
    async transaction(callback) {
      const snapshot = clone(rows);
      const writeStart = writes.length;
      events.push({ type: 'transaction-begin' });
      try {
        const result = await callback(db);
        events.push({ type: 'transaction-commit' });
        return result;
      } catch (error) {
        for (const name of Object.keys(rows)) rows[name].splice(0, rows[name].length, ...snapshot[name]);
        for (const row of rows.calendarEntries) if (externalCalendarStates.has(row.id)) row.status = externalCalendarStates.get(row.id);
        for (const write of writes.slice(writeStart)) { write.committed = false; write.rolledBack = true; }
        events.push({ type: 'transaction-rollback' });
        throw error;
      }
    },
  };
  const routers = [];
  function makeRouter() {
    const layers = [];
    const router = async (req, res, done = () => {}) => {
      let layerIndex = 0;
      async function nextLayer() {
        if (res.body !== null) return;
        const layer = layers[layerIndex++];
        if (!layer) return done();
        if (layer.method) {
          if (req.method !== layer.method) return nextLayer();
          const names = [];
          const regex = new RegExp(`^${layer.path.replace(/:([A-Za-z]+)/g, (_match, name) => { names.push(name); return '([^/]+)'; })}/?$`);
          const match = regex.exec(req.path);
          if (!match) return nextLayer();
          req.params = { ...req.params, ...Object.fromEntries(names.map((name, index) => [name, match[index + 1]])) };
        }
        let handlerIndex = 0;
        async function nextHandler() {
          if (res.body !== null) return;
          const handler = layer.handlers[handlerIndex++];
          return handler ? handler(req, res, nextHandler) : nextLayer();
        }
        return nextHandler();
      }
      return nextLayer();
    };
    for (const method of ['get', 'post', 'delete', 'patch', 'put']) router[method] = (routePath, ...handlers) => {
      layers.push({ method: method.toUpperCase(), path: routePath, handlers }); return router;
    };
    router.use = (...handlers) => { layers.push({ handlers }); return router; };
    routers.push(router);
    return router;
  }
  const requireAdmin = (req, _res, next) => {
    adminMiddlewareCalls += 1;
    assert.equal(req.user.role, 'admin');
    return next();
  };
  const logger = Object.fromEntries(['debug', 'info', 'warn', 'error'].map(level => [level, (message, meta) => logs.push({ level, message, meta })]));
  const env = configured ? Object.fromEntries([
    'YOUTUBE_API_KEY', 'YOUTUBE_CHANNEL_ID', 'YOUTUBE_REFRESH_TOKEN',
    'TIKTOK_ACCESS_TOKEN', 'TIKTOK_OPEN_ID', 'META_ACCESS_TOKEN', 'FACEBOOK_PAGE_ID',
  ].map(key => [key, 'SYNTHETIC-NOT-A-CREDENTIAL'])) : {};
  const context = createContext({
    process: Object.freeze({ env: Object.freeze(env) }),
    AbortSignal: Object.freeze({ timeout: () => Object.freeze({ fixture: 'no-real-timeout-or-network' }) }),
    fetch: async (url, options) => {
      const parsed = new URL(url);
      assert.equal(parsed.protocol, 'https:');
      assert.equal(options?.method, 'POST');
      assert.equal(options?.headers?.['Content-Type'], 'application/json');
      const platform = parsed.hostname === 'graph.facebook.com' && parsed.pathname === '/v21.0/SYNTHETIC-NOT-A-CREDENTIAL/feed' ? 'facebook'
        : parsed.hostname === 'open.tiktokapis.com' && parsed.pathname === '/v2/post/publish/inbox/video/init/' ? 'tiktok' : null;
      assert.ok(platform, `Unallowlisted transport request: ${url}`);
      const payload = JSON.parse(options.body);
      if (platform === 'facebook') assert.ok(typeof payload.message === 'string' && payload.message.length > 0);
      if (platform === 'tiktok') {
        assert.equal(payload.source_info.source, 'PULL_FROM_URL');
        assert.ok(typeof payload.post_info.title === 'string' && payload.post_info.title.length > 0);
      }
      const mode = providerModes[platform] || (platform === 'tiktok' ? 'processing' : 'confirmed');
      providerRequests.push({ platform, mode, method: options?.method });
      events.push({ type: 'provider', platform });
      if (mode === 'throws') throw new Error('Synthetic ambiguous transport failure');
      const body = mode === 'rejected' ? { error: { message: 'Synthetic definitive provider rejection' } }
        : mode === 'no-receipt' ? {}
          : mode === 'null-ack' ? null
            : mode === 'array-ack' ? []
          : platform === 'tiktok' ? { data: { publish_id: 'synthetic-operation-id' }, error: { code: 'ok', message: '' } }
            : { id: 'synthetic-confirmed-provider-post' };
      return {
        ok: !['rejected', 'http-error-with-id'].includes(mode),
        status: mode === 'http-error-with-id' ? 503 : mode === 'rejected' ? 400 : 200,
        json: async () => {
          if (mode === 'body-typeerror') throw new TypeError('Synthetic response stream closed');
          if (mode === 'body-abort') { const error = new Error('Synthetic response aborted'); error.name = 'AbortError'; throw error; }
          return clone(body);
        },
      };
    },
  }, { codeGeneration: { strings: false, wasm: false } });
  const modules = new Map();
  const comparison = op => (left, right) => ({ op, left, right });
  const fixtures = new Map([
    ['express', { default: { Router: makeRouter } }],
    ['drizzle-orm', {
      eq: comparison('eq'), ne: comparison('ne'), lte: comparison('lte'), inArray: comparison('inArray'),
      and: (...conditions) => ({ op: 'and', conditions }), or: (...conditions) => ({ op: 'or', conditions }),
      isNull: left => ({ op: 'isNull', left }), desc: left => ({ op: 'desc', left }),
    }],
    ['/server/db/connection.mjs', { db }],
    ['/shared/schema.mjs', tables],
    ['/server/middleware/auth.mjs', { requireAdmin, requireAuth: (_req, _res, next) => next() }],
    ['/server/utils/logger.mjs', { logger }],
  ]);
  if (routeModule === 'admin-social-studio') {
    // Valid-input handler tests only: validation, JWT and rate limiting are not
    // being verified. Keep these explicit infrastructure seams side-effect-free.
    function schemaBuilder() {
      const schema = { safeParse: value => ({ success: true, data: value }) };
      for (const method of ['trim', 'min', 'max', 'optional']) schema[method] = () => schema;
      return schema;
    }
    const z = Object.fromEntries(['enum', 'string', 'object', 'array', 'any'].map(name => [name, schemaBuilder]));
    const forbiddenAI = async (...args) => {
      aiRequests.push(args);
      throw new Error('AI calls are forbidden in manual-preparation tests');
    };
    class OpenAIFixture {
      constructor() {
        aiConstructors += 1;
        this.chat = { completions: { create: forbiddenAI } };
        this.images = { generate: forbiddenAI };
      }
    }
    const passthrough = (_req, _res, next) => next();
    fixtures.set('zod', { z });
    fixtures.set('openai', { default: OpenAIFixture });
    fixtures.set('/server/middleware/admin-rate-limit.mjs', {
      adminAiLimiter: passthrough, adminImageLimiter: passthrough, adminBulkLimiter: passthrough,
    });
  }
  for (const [identifier, exports] of fixtures) {
    modules.set(identifier, new SyntheticModule(Object.keys(exports), function initialize() {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    }, { context, identifier: `fixture:${identifier}` }));
  }
  for (const [identifier, source] of sources) {
    modules.set(identifier, new SourceTextModule(source, {
      context, identifier,
      importModuleDynamically() { throw new Error('Dynamic imports are forbidden'); },
    }));
  }
  const routerModule = modules.get(`/server/routes/${routeModule}.mjs`);
  await routerModule.link((specifier, referencingModule) => {
    const resolved = specifier.startsWith('.') ? path.posix.resolve(path.posix.dirname(referencingModule.identifier), specifier) : specifier;
    assert.ok(modules.has(resolved), `Unallowlisted source dependency: ${specifier}`);
    return modules.get(resolved);
  });
  await routerModule.evaluate();
  assert.equal(routerModule.namespace.default, routers[0]);
  const entrypoint = routeModule === 'admin-social-studio' ? routerModule.namespace.manualSocialStudioRouter : routerModule.namespace.default;
  assert.equal(typeof entrypoint, 'function');

  async function call(routePath, { body = {}, params = {}, method = 'POST' } = {}) {
    const concretePath = routePath.replace(/:([A-Za-z]+)/g, (_match, name) => params[name]);
    const req = { body, params, method, path: concretePath, query: {}, user: { id: draftFixture().userId, role: 'admin' }, dbUserId: draftFixture().userId };
    const res = {
      statusCode: 200, body: null,
      status(value) { this.statusCode = value; return this; },
      json(value) { assert.equal(this.body, null); this.body = clone(value); return this; },
    };
    await entrypoint(req, res);
    assert.notEqual(res.body, null, `No response from actual ${method} ${concretePath}`);
    return { status: res.statusCode, body: res.body };
  }
  return { call, rows, columns, reads, writes, events, providerRequests, aiRequests, logs, sourceDigests, adminMiddlewareCalls: () => adminMiddlewareCalls, aiConstructors: () => aiConstructors };
}
