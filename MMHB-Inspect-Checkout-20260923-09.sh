#!/usr/bin/env bash
(
set -eu
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

MMHB_HEAD=$(mmhb_git rev-parse HEAD)
MMHB_BRANCH=$(mmhb_git branch --show-current)
MMHB_STATE=$(mmhb_status)

printf 'COMMAND_ID=MMHB-CHECKOUT-TRIAGE-20260923-09\n'
printf 'HEAD=%s\nBRANCH=%s\n' "$MMHB_HEAD" "${MMHB_BRANCH:-DETACHED}"

if [ "$MMHB_BRANCH" = integration ]; then
  printf 'BRANCH_GATE=PASS\n'
else
  printf 'BRANCH_GATE=UNEXPECTED_BRANCH_OR_DETACHED_HEAD\n'
fi

if [ -z "$MMHB_STATE" ]; then
  printf 'WORKTREE_GATE=CLEAN_FOR_GIT_STATUS\n'
else
  printf 'WORKTREE_GATE=HAS_CHANGES_PRESERVED\n'
  printf '\nSTATUS_ENTRIES_FIRST_80:\n'
  printf '%s\n' "$MMHB_STATE" | sed -n '1,80p'
  printf '\nTOTAL_STATUS_ENTRIES='
  printf '%s\n' "$MMHB_STATE" | wc -l
fi

MMHB_END_HEAD=$(mmhb_git rev-parse HEAD)
MMHB_END_BRANCH=$(mmhb_git branch --show-current)
MMHB_END_STATE=$(mmhb_status)

if [ "$MMHB_HEAD" != "$MMHB_END_HEAD" ] ||
   [ "$MMHB_BRANCH" != "$MMHB_END_BRANCH" ] ||
   [ "$MMHB_STATE" != "$MMHB_END_STATE" ]; then
  printf '\nSTATUS=METADATA_CHANGED_DURING_INSPECTION\n'
  printf 'NEXT_REQUIRED_ACTION=RETURN_OUTPUT_WITHOUT_REPAIR\n'
else
  printf '\nSTATUS=CHECKOUT_TRIAGE_COMPLETE\n'
  printf 'NEXT_REQUIRED_ACTION=RETURN_OUTPUT_FOR_REVIEW\n'
fi

printf 'SOURCE_MUTATIONS=0\nCHECKPOINT=NOT_CREATED_BY_THIS_COMMAND\n'
printf 'APP_TESTS=NOT_RUN:CHECKOUT_TRIAGE_ONLY\n'
printf 'PUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false\n'
)
