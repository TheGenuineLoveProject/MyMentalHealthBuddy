#!/usr/bin/env bash
# One real reset request to the public MMHB app. May create a reset token and email.
# No application imports, direct database access, retries, builds or deployment.
set +x
set -euo pipefail
unset NODE_OPTIONS NODE_PATH
trap 'unset MMHB_RECOVERY_EMAIL' EXIT
IFS= read -r -s -p 'Existing MMHB account email (hidden): ' MMHB_RECOVERY_EMAIL </dev/tty
printf '\n'
MMHB_RECOVERY_EMAIL="$MMHB_RECOVERY_EMAIL" NODE_TLS_REJECT_UNAUTHORIZED=1 node --input-type=module <<'MMHB_TRACE_JS'
import { randomUUID } from 'node:crypto';

async function main() {
  const email = (process.env.MMHB_RECOVERY_EMAIL || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log(JSON.stringify({ status: 'EMAIL_INPUT_INVALID', requestsAttempted: 0 }));
    process.exitCode = 2;
    return;
  }
  const requestId = randomUUID();
  const result = {
    startedAtUtc: new Date().toISOString(),
    endpoint: 'https://www.mymentalhealthbuddy.com/api/account/password-reset/request',
    clientRequestId: requestId,
    responseRequestId: null,
    requestsAttempted: 1,
    httpStatus: null,
    responseType: null,
    status: 'NETWORK_OR_TIMEOUT',
    accountExistenceVerified: false,
    emailDeliveryVerified: false
  };
  try {
    const response = await fetch(result.endpoint, {
      method: 'POST',
      redirect: 'manual',
      signal: AbortSignal.timeout(20000),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Request-ID': requestId,
        Origin: 'https://www.mymentalhealthbuddy.com'
      },
      body: JSON.stringify({ email })
    });
    result.httpStatus = response.status;
    const returnedId = response.headers.get('x-request-id') || '';
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(returnedId)) {
      result.responseRequestId = returnedId;
    }
    const contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    result.responseType = contentType === 'application/json' ? 'JSON' : contentType === 'text/html' ? 'HTML' : 'OTHER';
    const body = await response.text();
    let payload;
    try { payload = JSON.parse(body); } catch {}
    result.status =
      response.status >= 300 && response.status < 400 ? 'REDIRECT_NOT_FOLLOWED' :
      response.status === 429 ? 'RATE_LIMITED' :
      response.status >= 500 ? 'SERVER_ERROR' :
      response.status === 404 ? 'RESET_ROUTE_NOT_FOUND' :
      response.status === 401 || response.status === 403 ? 'REQUEST_ACCESS_REJECTED' :
      response.status === 400 || response.status === 422 ? 'REQUEST_REJECTED' :
      response.status === 200 && result.responseType === 'JSON' && payload?.ok === true && payload?.success !== false && !payload?.error
        ? 'REQUEST_ACKNOWLEDGED_DELIVERY_UNVERIFIED' : 'UNEXPECTED_RESPONSE';
  } catch {
    // Never print exception text, response bodies, addresses or reset tokens.
    result.status = result.httpStatus === null ? 'NETWORK_OR_TIMEOUT' : 'RESPONSE_READ_FAILED';
  }
  result.finishedAtUtc = new Date().toISOString();
  console.log(JSON.stringify(result, null, 2));
}
await main();
MMHB_TRACE_JS
