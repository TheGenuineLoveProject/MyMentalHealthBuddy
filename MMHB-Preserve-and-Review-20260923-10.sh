#!/usr/bin/env bash
(
set -euo pipefail
umask 077
cd /home/runner/workspace

node --input-type=commonjs <<'NODE'
const fs = require('node:fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (p.name !== 'mymentalhealthbuddy' ||
    (process.env.REPL_ID &&
     process.env.REPL_ID !== '9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4')) {
  console.error('STOP: project identity mismatch.');
  process.exit(2);
}
NODE

mmhb_git() {
  git --no-pager --no-optional-locks \
    -c core.fsmonitor=false -c core.quotePath=true "$@"
}
mmhb_status() {
  mmhb_git status --porcelain=v1 --untracked-files=normal \
    --ignore-submodules=none
}
mmhb_stop() { printf '\nSTOP: %s\n' "$1"; exit 2; }

MMHB_BASE=df8137696e4c7b0a7c16a08347e1b92f85b85371
MMHB_HEAD=$(mmhb_git rev-parse HEAD)
MMHB_BRANCH=$(mmhb_git branch --show-current)
MMHB_ROOT=$(mmhb_git rev-parse --show-toplevel)
MMHB_STATE=$(mmhb_status)
MMHB_EXPECTED=$(printf '%s\n' \
  '?? MMHB-30-Day-Content-Planner.xlsx' '?? MMHB-Next-Checkpoint.sh')
MMHB_FILES=(MMHB-30-Day-Content-Planner.xlsx MMHB-Next-Checkpoint.sh)
MMHB_SAVE=NOT_CREATED
trap 'MMHB_EXIT=$?; if [ "$MMHB_EXIT" -ne 0 ]; then
  printf "\nSTATUS=STOPPED\nCHECKPOINT_DIRECTORY=%s\n" "$MMHB_SAVE"
  printf "PARTIAL_CHECKPOINT=KEEP_IF_PRESENT\nNEXT_ACTION=RETURN_OUTPUT\n"
fi' EXIT

printf 'COMMAND_ID=MMHB-PRESERVE-REVIEW-20260923-10\n'
printf 'HEAD=%s\nBRANCH=%s\n' "$MMHB_HEAD" "$MMHB_BRANCH"
[ "$MMHB_BRANCH" = integration ] || mmhb_stop 'Unexpected branch.'
[ "$MMHB_STATE" = "$MMHB_EXPECTED" ] ||
  mmhb_stop 'File status differs from the two reviewed untracked files.'
mmhb_git merge-base --is-ancestor "$MMHB_BASE" "$MMHB_HEAD" ||
  mmhb_stop 'Reviewed baseline is not an available ancestor.'
for MMHB_FILE in "${MMHB_FILES[@]}"; do
  [ -f "$MMHB_FILE" ] && [ ! -L "$MMHB_FILE" ] ||
    mmhb_stop 'Expected artifact is missing or not a regular file.'
done
MMHB_HASHES=$(sha256sum -- "${MMHB_FILES[@]}")

MMHB_SAVE=$(mktemp -d "$(dirname "$MMHB_ROOT")/mmhb-checkpoint.XXXXXX")
printf 'CHECKPOINT_DIRECTORY=%s\n' "$MMHB_SAVE"
mkdir "$MMHB_SAVE/untracked" "$MMHB_SAVE/review-source"
printf '%s\n' "$MMHB_HASHES" > "$MMHB_SAVE/untracked/SHA256SUMS"
for MMHB_FILE in "${MMHB_FILES[@]}"; do
  cp -- "$MMHB_FILE" "$MMHB_SAVE/untracked/$MMHB_FILE"
  chmod 600 "$MMHB_SAVE/untracked/$MMHB_FILE"
done
(cd "$MMHB_SAVE/untracked"; sha256sum --check SHA256SUMS)

MMHB_BUNDLE="$MMHB_SAVE/mmhb-integration.bundle"
mmhb_git bundle create --quiet "$MMHB_BUNDLE" "$MMHB_BASE..integration"
mmhb_git bundle verify "$MMHB_BUNDLE"
MMHB_BUNDLED=$(mmhb_git bundle list-heads "$MMHB_BUNDLE" \
  refs/heads/integration | cut -d ' ' -f 1)
[ "$MMHB_BUNDLED" = "$MMHB_HEAD" ] ||
  mmhb_stop 'Branch advanced while creating the bundle.'
(cd "$MMHB_SAVE"; sha256sum mmhb-integration.bundle > BUNDLE-SHA256SUMS)

mmhb_git show "$MMHB_HEAD:server/app.mjs" > "$MMHB_SAVE/review-source/app.mjs"
mmhb_git show "$MMHB_HEAD:package.json" > "$MMHB_SAVE/review-source/package.json"
{
  printf 'HEAD=%s\nBASELINE=%s\n' "$MMHB_HEAD" "$MMHB_BASE"
  printf '\nCOUNTS_BASELINE_ONLY_THEN_CURRENT_ONLY:\n'
  mmhb_git rev-list --left-right --count "$MMHB_BASE...$MMHB_HEAD"
  printf '\nWEBHOOK_MODULE_BLOB:\n'
  mmhb_git rev-parse "$MMHB_HEAD:server/routes/webhook.mjs"
  printf '\nCURRENT_WEBHOOK_WIRING:\n'
  if command -v rg >/dev/null 2>&1; then
    rg -n -C 3 'webhook|express\.raw|express\.json' \
      "$MMHB_SAVE/review-source/app.mjs" || {
        MMHB_RG_EXIT=$?
        [ "$MMHB_RG_EXIT" -eq 1 ] || exit "$MMHB_RG_EXIT"
        printf 'NO_MATCH_REVIEW_FULL_APP_SOURCE\n'
      }
  else
    printf 'RG_UNAVAILABLE_REVIEW_FULL_APP_SOURCE\n'
  fi
  printf '\nRELEVANT_PACKAGE_SCRIPTS:\n'
  node --input-type=commonjs - "$MMHB_SAVE/review-source/package.json" <<'NODE'
const fs = require('node:fs');
const scripts = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).scripts || {};
for (const name of Object.keys(scripts).sort()) {
  if (/^(pretest|test|typecheck|lint|build)$|stripe|webhook|journal|refresh/.test(name)) {
    console.log(JSON.stringify({name, command: scripts[name]}));
  }
}
NODE
  printf '\nSECURITY_CHANGES_SINCE_REVIEWED_BASELINE:\n'
  mmhb_git diff --no-ext-diff --no-textconv --no-renames --unified=3 \
    "$MMHB_BASE" "$MMHB_HEAD" -- server/routes/journal.mjs \
    server/routes/auth.mjs server/services/refreshTokens.service.mjs
} > "$MMHB_SAVE/review.txt"

[ "$MMHB_HEAD" = "$(mmhb_git rev-parse HEAD)" ] &&
[ "$MMHB_BRANCH" = "$(mmhb_git branch --show-current)" ] &&
[ "$MMHB_STATE" = "$(mmhb_status)" ] ||
  mmhb_stop 'Checkout metadata changed during preservation.'
[ "$MMHB_HASHES" = "$(sha256sum -- "${MMHB_FILES[@]}")" ] ||
  mmhb_stop 'An original artifact changed during preservation.'
(cd "$MMHB_SAVE/untracked"; sha256sum --check SHA256SUMS)

printf '\nBUNDLE_SHA256:\n'
cat "$MMHB_SAVE/BUNDLE-SHA256SUMS"
printf '\nREVIEW_FIRST_240_LINES:\n'
sed -n '1,240p' "$MMHB_SAVE/review.txt"
printf '\nTOTAL_REVIEW_LINES='
wc -l < "$MMHB_SAVE/review.txt"
printf '\nSTATUS=CHECKPOINT_AND_ARTIFACT_COPIES_VERIFIED\n'
printf 'SOURCE_MUTATIONS=0\nORIGINAL_ARTIFACTS=RETAINED_IN_PLACE\n'
printf 'APP_TESTS=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\n'
printf 'RELEASE_QUALIFIED=false\nCHECKPOINT_DIRECTORY=%s\n' "$MMHB_SAVE"
printf 'NEXT_ACTION=RETURN_OUTPUT\n'
)
