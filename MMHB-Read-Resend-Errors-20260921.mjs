const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUBJECT = 'Reset your MyMentalHealthBuddy password';
const MAX_BYTES = 2 * 1024 * 1024;
const WINDOWS = [
  { label: 'EARLIER_APP_WARNING', start: '2026-09-18T19:00:00Z', end: '2026-09-18T19:05:00Z' },
  { label: 'LATEST_SHARED_TRACE', start: '2026-09-19T02:59:00Z', end: '2026-09-19T03:03:00Z' },
];
const ERROR_NAMES = new Set([
  'invalid_idempotency_key', 'validation_error', 'missing_api_key',
  'restricted_api_key', 'invalid_permission', 'suspended_api_key',
  'not_found', 'method_not_allowed', 'concurrent_idempotent_requests',
  'invalid_idempotent_request', 'resource_locked', 'invalid_attachment',
  'invalid_parameter', 'missing_required_field', 'missing_required_parameter',
  'daily_quota_exceeded', 'monthly_quota_exceeded', 'rate_limit_exceeded',
  'application_error', 'service_unavailable', 'email_above_quota',
]);

function object(value) {
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return {}; }
  }
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function timestamp(value) {
  if (typeof value !== 'string' ||
      !/^\d{4}-\d\d-\d\d[T ]\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d(?::?\d\d)?)$/.test(value)) return null;
  const normalized = value.replace(' ', 'T').replace(/([+-]\d\d)$/, '$1:00');
  const ms = Date.parse(normalized);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function windowFor(utc) {
  if (!utc) return null;
  const ms = Date.parse(utc);
  return WINDOWS.find(w => ms >= Date.parse(w.start) && ms <= Date.parse(w.end))?.label ?? null;
}

export function classifyError(body, status) {
  const error = object(body);
  const name = ERROR_NAMES.has(error.name) ? error.name : 'UNRECOGNIZED_OR_MISSING';
  const message = typeof error.message === 'string' ? error.message.toLowerCase() : '';
  let category = 'PROVIDER_ERROR_DETAILS_REQUIRE_DASHBOARD';
  if (name === 'validation_error' && status === 403 &&
      message.includes('only send testing emails to your own email address')) category = 'TEST_SENDER_RECIPIENT_RESTRICTION';
  else if (name === 'validation_error' && status === 403 &&
      /\bdomain is not verified\b/.test(message)) category = 'SENDER_DOMAIN_NOT_VERIFIED';
  else if (name === 'restricted_api_key' && status === 401 &&
      message.includes('restricted to only send emails')) category = 'LOG_READ_NOT_PERMITTED';
  else if (name === 'restricted_api_key' && status === 403 &&
      message.includes('not active')) category = 'KEY_NOT_ACTIVE_REPORTED';
  else if (name === 'restricted_api_key') category = 'KEY_RESTRICTED_REPORTED';
  else if (name === 'missing_api_key') category = 'MISSING_KEY_REPORTED';
  else if (name === 'invalid_permission') category = 'REQUIRED_SCOPE_MISSING_REPORTED';
  else if (name === 'suspended_api_key') category = 'KEY_SUSPENDED_REPORTED';
  else if (name === 'daily_quota_exceeded') category = 'DAILY_QUOTA_REPORTED';
  else if (name === 'monthly_quota_exceeded') category = 'MONTHLY_QUOTA_REPORTED';
  else if (name === 'rate_limit_exceeded') category = 'RATE_LIMIT_REPORTED';
  else if (['invalid_parameter', 'missing_required_field', 'missing_required_parameter',
            'invalid_attachment', 'validation_error'].includes(name)) category = 'REQUEST_VALIDATION_REPORTED';
  else if (['application_error', 'service_unavailable'].includes(name)) category = 'PROVIDER_SERVICE_ERROR_REPORTED';
  return { errorName: name, category };
}

// Emit only fixed categories and selected metadata. Never emit raw messages,
// headers, request bodies, addresses, reset tokens or transport exception text.
export async function inspectResendLogs({
  apiKey = process.env.RESEND_API_KEY,
  fetchImpl = globalThis.fetch,
  clock = () => Date.now(),
  pause = ms => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  const report = {
    status: 'NOT_STARTED', context: 'WORKSPACE_KEY_PROVIDER_LOGS',
    windows: WINDOWS, listPagesRead: 0, logRowsScanned: 0,
    matchingMetadataRows: 0, matchingDetailsNotRead: 0,
    unconfirmedSubjectOrRecordCount: 0, availableListExhausted: false,
    requestsAttempted: 0, requestMethods: ['GET'], candidates: [],
    correlation: 'TIME_WINDOW_AND_EXACT_SUBJECT_ONLY_NOT_APPLICATION_REQUEST_ID',
    productionConfigurationVerified: false, accountExistenceVerified: false,
    emailDeliveryVerified: false, sourceFilesChanged: 0, databaseConnections: 0,
    emailsSent: 0, deploymentRuns: 0,
  };
  if (typeof apiKey !== 'string' || !apiKey.trim()) {
    report.status = 'WORKSPACE_RESEND_KEY_MISSING'; return report;
  }
  if (apiKey !== apiKey.trim() || /[\r\n]/.test(apiKey)) {
    report.status = 'WORKSPACE_RESEND_KEY_WHITESPACE_REQUIRES_REVIEW'; return report;
  }
  if (typeof fetchImpl !== 'function') { report.status = 'NODE_FETCH_UNAVAILABLE'; return report; }
  const deadline = clock() + 45000;
  let stage = 'LIST_LOGS';
  let currentHttpStatus = null;
  const failures = new WeakMap();
  const fail = (code, extra = {}) => {
    const error = new Error('Diagnostic stopped');
    failures.set(error, { code, ...extra });
    throw error;
  };
  async function getJson(path) {
    if (!/^\/logs(?:\?limit=100(?:&after=[0-9a-f-]{36})?|\/[0-9a-f-]{36})$/i.test(path)) fail('PATH_VALIDATION_STOP');
    if (report.requestsAttempted) await pause(650);
    const remaining = deadline - clock();
    if (remaining <= 0) fail('TIME_BUDGET_REACHED');
    currentHttpStatus = null;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(10000, remaining));
    try {
      report.requestsAttempted++;
      const response = await fetchImpl('https://api.resend.com' + path, {
        method: 'GET', redirect: 'error', signal: controller.signal,
        headers: { Authorization: 'Bearer ' + apiKey, Accept: 'application/json' },
      });
      currentHttpStatus = Number.isInteger(response.status) ? response.status : null;
      if (!response.body) fail('EMPTY_PROVIDER_RESPONSE');
      const reader = response.body.getReader();
      const chunks = [];
      let bytes = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_BYTES) { controller.abort(); fail('PROVIDER_RESPONSE_SIZE_LIMIT'); }
        chunks.push(value);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { fail('NON_JSON_PROVIDER_RESPONSE'); }
      if (response.status < 200 || response.status >= 300) {
        fail([401, 403].includes(response.status) ? 'LOG_ACCESS_DENIED' : 'LOG_API_REQUEST_FAILED',
          classifyError(body, response.status));
      }
      return object(body);
    } finally { clearTimeout(timer); }
  }
  try {
    let cursor = null;
    const seenCursors = new Set();
    const matching = new Map();
    for (let page = 0; page < 5; page++) {
      const body = await getJson('/logs?limit=100' + (cursor ? '&after=' + cursor : ''));
      if (!Array.isArray(body.data) || body.data.length > 100 || typeof body.has_more !== 'boolean') fail('UNEXPECTED_LIST_SHAPE');
      report.listPagesRead++;
      report.logRowsScanned += body.data.length;
      for (const row of body.data) {
        const utc = timestamp(row?.created_at);
        const window = windowFor(utc);
        if (window && row.method === 'POST' && row.endpoint === '/emails' && UUID.test(row.id ?? '')) {
          matching.set(row.id, { id: row.id, utc, window });
        }
      }
      if (!body.has_more) { report.availableListExhausted = true; break; }
      cursor = body.data.at(-1)?.id;
      if (!UUID.test(cursor ?? '') || seenCursors.has(cursor)) fail('INVALID_OR_REPEATED_PAGINATION_CURSOR');
      seenCursors.add(cursor);
    }
    report.matchingMetadataRows = matching.size;
    const entries = [...matching.values()].sort((a, b) => a.utc.localeCompare(b.utc));
    report.matchingDetailsNotRead = Math.max(0, entries.length - 4);
    stage = 'RETRIEVE_CANDIDATE_LOG';
    for (const entry of entries.slice(0, 4)) {
      const detail = await getJson('/logs/' + entry.id);
      const utc = timestamp(detail.created_at);
      const request = object(detail.request_body);
      if (detail.id !== entry.id || detail.method !== 'POST' || detail.endpoint !== '/emails' ||
          windowFor(utc) !== entry.window || request.subject !== SUBJECT ||
          !Number.isInteger(detail.response_status) || detail.response_status < 100 || detail.response_status > 599) {
        report.unconfirmedSubjectOrRecordCount++; continue;
      }
      const original = object(detail.response_body);
      const candidate = { window: entry.window, providerLogId: entry.id,
        occurredAtUtc: utc, emailApiHttpStatus: detail.response_status, exactMmhbResetSubjectMatched: true };
      if (detail.response_status >= 200 && detail.response_status < 300) {
        candidate.category = UUID.test(original.id ?? '') && !original.error
          ? 'PROVIDER_ACCEPTANCE_RECORDED_DELIVERY_UNVERIFIED'
          : 'SUCCESS_STATUS_ACCEPTANCE_DETAILS_UNCONFIRMED';
      } else Object.assign(candidate, classifyError(original, detail.response_status));
      report.candidates.push(candidate);
    }
    report.status = report.candidates.length ? 'MMHB_RESET_LOG_CANDIDATES_REPORTED' : 'NO_MMHB_RESET_MATCH_IN_SCANNED_LOGS';
  } catch (error) {
    const info = failures.get(error);
    report.status = info?.code ?? 'LOG_LOOKUP_TRANSPORT_OR_RUNTIME_ERROR';
    report.stoppedAt = stage;
    report.logReadHttpStatus = currentHttpStatus;
    if (info?.category) report.logReadError = { errorName: info.errorName, category: info.category };
  }
  report.nextAction = report.status === 'LOG_ACCESS_DENIED'
    ? 'USE_EXISTING_RESEND_DASHBOARD_DO_NOT_EXPAND_SENDING_KEY_PERMISSIONS'
    : 'SHARE_THIS_METADATA_REPORT_FOR_REVIEW';
  return report;
}

console.log(JSON.stringify(await inspectResendLogs(), null, 2));
