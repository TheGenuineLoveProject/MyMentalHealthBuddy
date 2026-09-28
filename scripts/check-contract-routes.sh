#!/usr/bin/env bash
set -euo pipefail

MMHB_BASE=${VERIFY_BASE_URL:-http://localhost:5000}
if [[ ! "$MMHB_BASE" =~ ^http://(localhost|127\.0\.0\.1|\[::1\]):([0-9]{1,5})/?$ ]]; then
  printf 'STOP: VERIFY_BASE_URL must be an HTTP loopback URL with an explicit port.\n' >&2
  exit 2
fi
MMHB_PORT=${BASH_REMATCH[2]}
if (( 10#$MMHB_PORT < 1 || 10#$MMHB_PORT > 65535 )); then
  printf 'STOP: invalid test port.\n' >&2
  exit 2
fi
MMHB_BASE=${MMHB_BASE%/}
MMHB_FAILED=0
for MMHB_ROUTE in /api/health /ready; do
  MMHB_STATUS=''
  if MMHB_STATUS=$(curl --disable --silent --show-error --noproxy '*' \
      --connect-timeout 2 --max-time 5 --output /dev/null \
      --write-out '%{http_code}' "$MMHB_BASE$MMHB_ROUTE"); then
    printf 'ROUTE=%s HTTP_STATUS=%s\n' "$MMHB_ROUTE" "$MMHB_STATUS"
    if [ "$MMHB_STATUS" != 200 ]; then MMHB_FAILED=1; fi
  else
    printf 'ROUTE=%s REQUEST_FAILED=true\n' "$MMHB_ROUTE"
    MMHB_FAILED=1
  fi
done
if [ "$MMHB_FAILED" -ne 0 ]; then
  printf 'ROUTE_VERIFICATION=FAIL\n'
  exit 1
fi
printf 'ROUTE_VERIFICATION=PASS\n'
