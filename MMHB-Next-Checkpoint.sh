#!/usr/bin/env bash
# Creates only a local checkpoint and review report outside the source tree.
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'NODE'
const fs = require('node:fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const expected = '9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4';
if (p.name !== 'mymentalhealthbuddy' ||
    (process.env.REPL_ID && process.env.REPL_ID !== expected)) {
  console.error('STOP: project identity mismatch.');
  process.exit(2);
}
NODE
mmhb_git() { git --no-pager --no-optional-locks "$@"; }
MMHB_BASE=df8137696e4c7b0a7c16a08347e1b92f85b85371
MMHB_PREVIOUS=d2c3cf30e1915a4e1259cd72bc48fc8f3e5662fe
MMHB_HEAD=$(mmhb_git rev-parse HEAD)
MMHB_BRANCH=$(mmhb_git branch --show-current)
MMHB_ROOT=$(mmhb_git rev-parse --show-toplevel)
printf 'COMMAND_ID=MMHB-CHECKPOINT-REVIEW-20260923-08\nHEAD=%s\n' "$MMHB_HEAD"
if [ "$MMHB_BRANCH" != integration ] ||
   [ -n "$(mmhb_git status --porcelain=v1 --untracked-files=normal)" ]; then
  printf 'STOP: expected clean integration checkout; preserve current work.\n'
  exit 2
fi
mmhb_git merge-base --is-ancestor "$MMHB_BASE" "$MMHB_HEAD"
mmhb_git merge-base --is-ancestor "$MMHB_PREVIOUS" "$MMHB_HEAD"
MMHB_SAVE=$(mktemp -d "$(dirname "$MMHB_ROOT")/mmhb-checkpoint.XXXXXX")
MMHB_BUNDLE="$MMHB_SAVE/mmhb-integration.bundle"
printf 'CHECKPOINT_DIRECTORY=%s\n' "$MMHB_SAVE"
mmhb_git bundle create --quiet "$MMHB_BUNDLE" "$MMHB_BASE..integration"
mmhb_git bundle verify "$MMHB_BUNDLE"
MMHB_BUNDLED=$(mmhb_git bundle list-heads "$MMHB_BUNDLE" refs/heads/integration | cut -d ' ' -f 1)
if [ "$MMHB_BUNDLED" != "$MMHB_HEAD" ]; then
  printf 'STOP: branch advanced during checkpoint; preserve the bundle.\n'
  exit 2
fi
{
  printf 'HEAD=%s\nBRANCH=%s\n' "$MMHB_HEAD" "$MMHB_BRANCH"
  printf '\nCOMMITS_SINCE_VERIFIED_CHECKPOINT:\n'
  mmhb_git log --reverse --format='%h %cI %s' "$MMHB_PREVIOUS..$MMHB_HEAD"
  printf '\nCOUNTS_BASELINE_ONLY_THEN_CURRENT_ONLY:\n'
  mmhb_git rev-list --left-right --count "$MMHB_BASE...$MMHB_HEAD"
  printf '\nSECURITY_CHANGES_SINCE_CHECKPOINT:\n'
  mmhb_git diff --no-ext-diff --no-textconv --no-renames --unified=3 \
    "$MMHB_PREVIOUS" "$MMHB_HEAD" -- server/routes/journal.mjs \
    server/routes/auth.mjs server/services/refreshTokens.service.mjs
  printf '\nWEBHOOK_MODULE_BLOB:\n'
  mmhb_git rev-parse "$MMHB_HEAD:server/routes/webhook.mjs"
  printf '\nCURRENT_WEBHOOK_WIRING:\n'
  if command -v rg >/dev/null 2>&1; then
    rg -n -C 3 'webhook|express\.raw|express\.json' server/app.mjs ||
      printf 'WIRING_SEARCH_INCOMPLETE_OR_NO_MATCH\n'
  else
    printf 'RG_UNAVAILABLE\n'
  fi
  printf '\nAVAILABLE_RELEVANT_VALIDATION_SCRIPTS:\n'
  node --input-type=commonjs <<'NODE'
const fs = require('node:fs');
const scripts = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts || {};
for (const name of Object.keys(scripts).sort()) {
  if (/^(pretest|test|typecheck|lint|build)$|stripe|journal|refresh/.test(name)) {
    console.log(JSON.stringify({name, command: scripts[name]}));
  }
}
NODE
} > "$MMHB_SAVE/review.txt"
printf '\nBUNDLE_SHA256:\n'
sha256sum "$MMHB_BUNDLE"
printf '\nREVIEW_FIRST_240_LINES:\n'
sed -n '1,240p' "$MMHB_SAVE/review.txt"
printf '\nTOTAL_REVIEW_LINES='
wc -l < "$MMHB_SAVE/review.txt"
if [ "$MMHB_HEAD" != "$(mmhb_git rev-parse HEAD)" ] ||
   [ "$MMHB_BRANCH" != "$(mmhb_git branch --show-current)" ] ||
   [ -n "$(mmhb_git status --porcelain=v1 --untracked-files=normal)" ]; then
  printf 'STOP: observed checkout change; preserve checkpoint and report.\n'
  exit 2
fi
printf '\nSTATUS=CHECKPOINT_CREATED_CURRENT_REVIEW_REQUIRED\nSOURCE_MUTATIONS=0\n'
printf 'APP_TESTS=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false\n'
printf 'CHECKPOINT_DIRECTORY=%s\nNEXT_ACTION=RETURN_OUTPUT\n' "$MMHB_SAVE"
