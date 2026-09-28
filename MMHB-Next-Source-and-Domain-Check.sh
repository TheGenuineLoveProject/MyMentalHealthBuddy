#!/usr/bin/env bash
# Run from the existing MMHB Replit Shell. Read-only; no packages or AI calls.
(
set -eu
mmhb_git() { git --no-optional-locks "$@"; }
MMHB_EXPECTED=2a1608fe0aa1def1443d89b707e918231be8717e
MMHB_REMOTE=df8137696e4c7b0a7c16a08347e1b92f85b85371
MMHB_HEAD=$(mmhb_git rev-parse HEAD)
MMHB_BRANCH=$(mmhb_git branch --show-current)
printf 'COMMAND_ID=MMHB-SOURCE-DOMAIN-20260923-04\nHEAD=%s\nBRANCH=%s\n' "$MMHB_HEAD" "$MMHB_BRANCH"
if [ "$MMHB_HEAD" != "$MMHB_EXPECTED" ] || [ "$MMHB_BRANCH" != integration ]; then
  printf 'STOP: branch or commit changed; return this output.\n'
  exit 2
fi
MMHB_BEFORE=$(mmhb_git status --porcelain=v1 --untracked-files=normal)
printf '\nWORKTREE_FIRST_40_ENTRIES:\n%s\n' "$MMHB_BEFORE" | sed -n '1,43p'
printf '\nSHALLOW_REPOSITORY='
mmhb_git rev-parse --is-shallow-repository
if mmhb_git cat-file -e "${MMHB_REMOTE}^{commit}" 2>/dev/null; then
  printf '\nCOMMIT_COUNTS: GitHub-only, then Replit-only\n'
  mmhb_git rev-list --left-right --count "$MMHB_REMOTE...HEAD"
  printf '\nRELEVANT_FILES_DIFFERING_FROM_GITHUB:\n'
  mmhb_git diff --no-ext-diff --no-textconv --name-only "$MMHB_REMOTE" HEAD -- \
    .replit package.json package-lock.json server/app.mjs server/routes/health.mjs
else
  printf '\nGITHUB_BASE_NOT_PRESENT_LOCALLY; relationship remains unknown.\n'
fi
for MMHB_HOST in mymentalhealthbuddy.com www.mymentalhealthbuddy.com; do
  printf '\nHOST=%s\n' "$MMHB_HOST"
  if command -v dig >/dev/null 2>&1; then
    dig +time=2 +tries=1 +noall +answer "$MMHB_HOST" A || printf 'DNS_QUERY_FAILED\n'
  fi
  curl --silent --show-error --output /dev/null --connect-timeout 5 --max-time 12 \
    --proto '=https' --write-out 'PUBLIC HTTP=%{http_code} TYPE=%{content_type} TLS=%{ssl_verify_result}\n' \
    "https://$MMHB_HOST/" || printf 'PUBLIC_REQUEST_FAILED\n'
  curl --silent --show-error --output /dev/null --noproxy 127.0.0.1 \
    --connect-timeout 2 --max-time 6 --header "Host: $MMHB_HOST" \
    --write-out 'LOCAL_PORT_5000 HTTP=%{http_code} TYPE=%{content_type}\n' \
    http://127.0.0.1:5000/ || printf 'LOCAL_PROBE_UNAVAILABLE\n'
done
printf '\nCANONICAL_READINESS:\n'
curl --silent --show-error --output /dev/null --connect-timeout 5 --max-time 12 \
  --proto '=https' --write-out 'HTTP=%{http_code} TYPE=%{content_type} SECONDS=%{time_total}\n' \
  https://www.mymentalhealthbuddy.com/api/health/ready || printf 'READINESS_REQUEST_FAILED\n'
MMHB_AFTER=$(mmhb_git status --porcelain=v1 --untracked-files=normal)
if [ "$MMHB_HEAD" != "$(mmhb_git rev-parse HEAD)" ] || [ "$MMHB_BEFORE" != "$MMHB_AFTER" ]; then
  printf '\nSTOP: HEAD or working-tree status changed during inspection.\n'
  exit 2
fi
printf '\nHEAD_AND_STATUS_UNCHANGED=true\nSOURCE_MUTATIONS=0\nRELEASE_QUALIFIED=false\n'
)
