#!/usr/bin/env bash
# MMHB: recover the missing A4 candidate from its surviving staged index.
# LOCAL ONLY. No fetch/push, checkout, application execution, or source edits.
# Creates a recovery commit/ref only after reproducing the recorded A4 hash.
set -euo pipefail
umask 077
ROOT='/home/runner/workspace'
LOST='/home/runner/mmhb-clean-a3-20260913T050107Z'
BASE='df8137696e4c7b0a7c16a08347e1b92f85b85371'
MAIN='66d107eb28be1a3e760749f4dd6ef5614602ff8b'
EXPECTED='259b8b63f4b38adb24b6185be80f57c2276e09311775b897aa4da56410db436b'
EXPECTED_PATHS=75
REF='refs/mmhb-recovery/a4-259b8b63f4b38adb'
STEP=START
R=''
trap 'rc=$?; if [ "$rc" -ne 0 ]; then printf "STATUS=RECOVERY_STOPPED\nSTEP=%s\nEXIT_CODE=%s\n" "$STEP" "$rc"; fi' EXIT
fail() { printf 'STOP=%s\n' "$1"; exit 1; }
sha() { local v; v="$(sha256sum -- "$1")"; printf '%s\n' "${v%% *}"; }
printf 'COMMAND=MMHB_RECOVER_A4\n'
# Ignore inherited Git routing variables; do not modify the parent shell.
for variable in ${!GIT_@}; do unset "$variable"; done
export GIT_OPTIONAL_LOCKS=0 GIT_NO_LAZY_FETCH=1 GIT_TERMINAL_PROMPT=0
CFG=(-c core.fsmonitor=false -c core.hooksPath=/dev/null -c gc.auto=0 -c maintenance.auto=false)
g() { git "${CFG[@]}" -C "$ROOT" "$@"; }
STEP=IDENTITY
[ -d "$ROOT" ] || fail WORKSPACE_MISSING
[ "$(g rev-parse --show-toplevel)" = "$ROOT" ] || fail WRONG_REPOSITORY_ROOT
[ "$(g branch --show-current)" = integration ] || fail ORIGINAL_BRANCH_CHANGED
[ "$(g rev-parse HEAD)" = "$MAIN" ] || fail ORIGINAL_HEAD_CHANGED
g cat-file -e "$BASE^{commit}"
G="$(g rev-parse --path-format=absolute --git-common-dir)"
MAIN_INDEX="$(g rev-parse --path-format=absolute --git-path index)"
MAIN_INDEX_BEFORE="$(sha "$MAIN_INDEX")"
# Do not allow a recovery read to fetch missing objects in a partial clone.
if g config --get-regexp '^(extensions\.partialclone|remote\..*\.promisor)$' > /dev/null; then
  fail PARTIAL_CLONE_NEEDS_SEPARATE_REVIEW
else
  rc=$?; [ "$rc" -eq 1 ] || fail CONFIG_READ_FAILED
fi
verify_checkpoint() {
  local ref="$1" tree_diff
  [ "$(g rev-parse "$ref^1")" = "$BASE" ] || fail CHECKPOINT_PARENT_DIFFERS
  tree_diff="$(g diff --binary --no-ext-diff --no-textconv "$BASE" "$ref" | sha256sum)"
  [ "${tree_diff%% *}" = "$EXPECTED" ] || fail CHECKPOINT_HASH_DIFFERS
}
finish() {
  [ "$(g rev-parse HEAD)" = "$MAIN" ] || fail ORIGINAL_HEAD_CHANGED_DURING_RECOVERY
  [ "$(g branch --show-current)" = integration ] || fail ORIGINAL_BRANCH_CHANGED_DURING_RECOVERY
  [ "$(sha "$MAIN_INDEX")" = "$MAIN_INDEX_BEFORE" ] || fail ORIGINAL_INDEX_CHANGED_DURING_RECOVERY
  printf 'RECOVERED_PATCH_MATCHES_A4=YES\nLOCAL_RECOVERY_REF=%s\nLOCAL_RECOVERY_COMMIT=%s\n' "$REF" "$(g rev-parse "$REF")"
  printf 'ORIGINAL_HEAD_AND_INDEX=UNCHANGED\nAPPLICATION_SOURCE_EDITS=NO\nNETWORK_REQUESTS=NO\nPUSH=NO\nBUILD=NO\nDEPLOY=NO\nSTATUS=LOCAL_RECOVERY_CHECKPOINT_READY\n'
}
STEP=EXISTING_CHECKPOINT
if g show-ref --verify --quiet "$REF"; then
  # Never replace or follow an unexpected symbolic recovery reference.
  if g symbolic-ref -q "$REF" >/dev/null; then fail SYMBOLIC_RECOVERY_REF; fi
  verify_checkpoint "$REF"
  echo 'CHECKPOINT=ALREADY_PRESENT'
  finish
  exit 0
else
  rc=$?; [ "$rc" -eq 1 ] || fail REF_LOOKUP_FAILED
fi
STEP=LOCATE_LINKED_INDEX
D=''
for f in "$G"/worktrees/*/gitdir; do
  if [ -f "$f" ] && [ "$(cat -- "$f")" = "$LOST/.git" ]; then
    [ -z "$D" ] || fail AMBIGUOUS_WORKTREE_METADATA
    D="${f%/gitdir}"
  fi
done
[ -n "$D" ] || fail WORKTREE_METADATA_NOT_FOUND
[ ! -d "$LOST" ] || fail CANDIDATE_DIRECTORY_REAPPEARED
[ "$(git "${CFG[@]}" --git-dir="$D" rev-parse HEAD)" = "$BASE" ] || fail CANDIDATE_BASE_CHANGED
STEP=PRESERVE_METADATA
[ -f "$D/locked" ] || g worktree lock --reason 'Preserve MMHB A4 staged recovery' "$LOST"
[ ! -e "$D/index.lock" ] || fail INDEX_OPERATION_IN_PROGRESS
R="$(mktemp -d "$G/mmhb-recovery-XXXXXX")"
printf 'RECOVERY_DIR=%s\n' "$R"
cp -a -- "$D" "$R/admin-copy"
[ -s "$R/admin-copy/index" ] || fail INDEX_MISSING
[ "$(sha "$R/admin-copy/index")" = "$(sha "$D/index")" ] || fail INDEX_CHANGED_DURING_COPY
# Keep original Git directory context for split-index sharedindex references.
# All commands below that can update the index use the COPIED index only.
ig() { GIT_INDEX_FILE="$R/admin-copy/index" git "${CFG[@]}" --git-dir="$D" --work-tree="$ROOT" "$@"; }
STEP=EXPORT_AND_VERIFY
ig ls-files --unmerged -z > "$R/unmerged-paths.bin"
[ ! -s "$R/unmerged-paths.bin" ] || fail UNMERGED_INDEX
ig diff --cached --binary --no-ext-diff --no-textconv "$BASE" > "$R/candidate.patch"
H="$(sha "$R/candidate.patch")"
printf 'PATCH_SHA256=%s\n' "$H"
[ "$H" = "$EXPECTED" ] || fail PATCH_HASH_DIFFERS
COUNT="$(ig diff --cached --name-only -z "$BASE" | tr -cd '\000' | wc -c)"
printf 'CANDIDATE_PATHS=%s\n' "$COUNT"
[ "$COUNT" -eq "$EXPECTED_PATHS" ] || fail CANDIDATE_PATH_COUNT_DIFFERS
STEP=CREATE_LOCAL_CHECKPOINT
TREE="$(ig write-tree)"
CHECK="$(g diff --binary --no-ext-diff --no-textconv "$BASE" "$TREE" | sha256sum)"
[ "${CHECK%% *}" = "$EXPECTED" ] || fail TREE_HASH_DIFFERS
COMMIT="$(g -c user.name='MMHB local recovery' -c user.email='recovery@mmhb.invalid' commit-tree --no-gpg-sign "$TREE" -p "$BASE" -m 'Local recovery: exact A4 staged snapshot; NOT release-qualified')"
verify_checkpoint "$COMMIT"
ZERO=0000000000000000000000000000000000000000
g update-ref --no-deref --create-reflog -m 'Preserve exact MMHB A4 candidate locally' "$REF" "$COMMIT" "$ZERO"
printf '%s\n' "$REF $COMMIT" > "$R/checkpoint.txt"
verify_checkpoint "$REF"
finish
