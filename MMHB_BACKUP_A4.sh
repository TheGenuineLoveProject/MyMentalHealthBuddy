#!/usr/bin/env bash
# Export the recovered A4 commit as a self-contained, restore-tested Git bundle.
# Local only: no network, no checkout, no app execution, no source/branch changes.
# The .bundle includes committed Git history, not databases, secrets from the
# environment, untracked files, Git LFS payloads, or separate submodule histories.
set -euo pipefail
umask 077
ROOT='/home/runner/workspace'
MAIN='66d107eb28be1a3e760749f4dd6ef5614602ff8b'
BASE='df8137696e4c7b0a7c16a08347e1b92f85b85371'
REF='refs/mmhb-recovery/a4-259b8b63f4b38adb'
COMMIT='63ff8372d07368a5434c11ff58bdf87bb468449d'
PATCH='259b8b63f4b38adb24b6185be80f57c2276e09311775b897aa4da56410db436b'
PATHS=75
NAME='MMHB_A4_63ff8372.bundle'
MIN_FREE_KB=3145728
STEP=START
R=''
fail() { printf 'STOP=%s\n' "$1"; exit 1; }
trap 'rc=$?; if [ "$rc" -ne 0 ]; then printf "STATUS=BACKUP_STOPPED\nSTEP=%s\nEXIT_CODE=%s\nLOCAL_AUDIT_DIR=%s\n" "$STEP" "$rc" "$R"; fi' EXIT
sha() { local v; v="$(sha256sum -- "$1")"; printf '%s\n' "${v%% *}"; }
for variable in ${!GIT_@}; do unset "$variable"; done
export GIT_OPTIONAL_LOCKS=0 GIT_NO_LAZY_FETCH=1 GIT_TERMINAL_PROMPT=0
export GIT_ALLOW_PROTOCOL=file
CFG=(-c core.fsmonitor=false -c core.hooksPath=/dev/null -c gc.auto=0 -c maintenance.auto=false)
g() { git "${CFG[@]}" -C "$ROOT" "$@"; }
echo 'COMMAND=MMHB_BACKUP_A4'
STEP=IDENTITY
[ "$(g rev-parse --show-toplevel)" = "$ROOT" ] || fail WRONG_WORKSPACE
[ "$(g symbolic-ref -q HEAD)" = refs/heads/integration ] || fail ORIGINAL_BRANCH_CHANGED
[ "$(g rev-parse HEAD)" = "$MAIN" ] || fail ORIGINAL_HEAD_CHANGED
if g symbolic-ref -q "$REF" >/dev/null; then fail SYMBOLIC_RECOVERY_REF; fi
[ "$(g rev-parse --verify "$REF^{commit}")" = "$COMMIT" ] || fail RECOVERY_COMMIT_DIFFERS
[ "$(g rev-list --parents -n 1 "$COMMIT")" = "$COMMIT $BASE" ] || fail RECOVERY_PARENT_DIFFERS
[ "$(g rev-parse --is-shallow-repository)" = false ] || fail SHALLOW_REPOSITORY
if g config --get-regexp '^(extensions\.partialclone|remote\..*\.promisor)$' >/dev/null; then
  fail PARTIAL_CLONE_NEEDS_REVIEW
else
  rc=$?; [ "$rc" -eq 1 ] || fail CONFIG_READ_FAILED
fi
[ -z "$(g for-each-ref --format='%(refname)' refs/replace/)" ] || fail REPLACE_REFS_NEED_REVIEW
G="$(g rev-parse --path-format=absolute --git-common-dir)"
I="$(g rev-parse --path-format=absolute --git-path index)"
[ ! -e "$I.lock" ] || fail INDEX_OPERATION_IN_PROGRESS
INDEX_BEFORE="$(sha "$I")"
F="$ROOT/$NAME"
S="$F.sha256"
for f in "$F" "$S"; do
  [ ! -L "$f" ] || fail OUTPUT_IS_SYMLINK
  [ ! -e "$f" ] || [ -f "$f" ] || fail OUTPUT_NOT_REGULAR_FILE
  if g ls-files --error-unmatch -- "${f##*/}" >/dev/null 2>&1; then
    fail OUTPUT_ALREADY_TRACKED
  else
    rc=$?; [ "$rc" -eq 1 ] || fail TRACKED_FILE_CHECK_FAILED
  fi
done
[ ! -e "$S" ] || [ -e "$F" ] || fail CHECKSUM_WITHOUT_BUNDLE
FREE_KB="$(df -Pk "$G" | awk 'NR==2 {print $4}')"
[[ "$FREE_KB" =~ ^[0-9]+$ ]] || fail DISK_STATUS_INVALID
[ "$FREE_KB" -ge "$MIN_FREE_KB" ] || fail FREE_SPACE_BELOW_3_GIB_POLICY
R="$(mktemp -d "$G/mmhb-a4-backup-XXXXXX")"
echo "LOCAL_AUDIT_DIR=$R"
STEP=CHECKPOINT_CONTENT
check_content() {
  local repo="$1" hash count
  git "${CFG[@]}" -C "$repo" diff --binary --no-ext-diff --no-textconv "$BASE" "$COMMIT" > "$R/check.patch"
  hash="$(sha "$R/check.patch")"
  [ "$hash" = "$PATCH" ] || fail CHECKPOINT_PATCH_DIFFERS
  count="$(git "${CFG[@]}" -C "$repo" diff --name-only -z "$BASE" "$COMMIT" | tr -cd '\000' | wc -c)"
  [ "$count" -eq "$PATHS" ] || fail CHECKPOINT_PATH_COUNT_DIFFERS
}
check_content "$ROOT"
printf 'RECOVERY_COMMIT=%s\nPATCH_SHA256=%s\nCANDIDATE_PATHS=%s\n' "$COMMIT" "$PATCH" "$PATHS"
STEP=LOCAL_EXCLUSIONS
# Exclude only the two backup outputs, before exposing them in the Files pane.
EXCLUDE="$(g rev-parse --path-format=absolute --git-path info/exclude)"
[ ! -L "$EXCLUDE" ] || fail EXCLUDE_IS_SYMLINK
[ ! -e "$EXCLUDE" ] || [ -f "$EXCLUDE" ] || fail EXCLUDE_NOT_REGULAR_FILE
mkdir -p -- "$(dirname "$EXCLUDE")"
for name in "$NAME" "$NAME.sha256"; do
  if [ -f "$EXCLUDE" ] && grep -Fqx -- "/$name" "$EXCLUDE"; then
    :
  else
    printf '\n/%s\n' "$name" >> "$EXCLUDE"
  fi
done
STEP=EXPORT_BUNDLE
if [ -f "$F" ]; then
  INPUT="$F"
  echo 'BUNDLE_SOURCE=EXISTING_FILE_RECHECK'
else
  INPUT="$R/candidate.bundle"
  # No exclusions: include the recovery commit and all its Git ancestry.
  g -c pack.threads=2 -c pack.windowMemory=64m bundle create "$INPUT" "$REF" > "$R/create.log" 2>&1
  echo 'BUNDLE_SOURCE=NEW_FULL_HISTORY_EXPORT'
fi
BUNDLE_HASH="$(sha "$INPUT")"
if [ -f "$S" ]; then
  [ "$(cat "$S")" = "$BUNDLE_HASH  $NAME" ] || fail EXISTING_BUNDLE_CHECKSUM_DIFFERS
fi
STEP=INDEPENDENT_LOCAL_RESTORE
mkdir "$R/empty-template"
git "${CFG[@]}" init --quiet --bare --template="$R/empty-template" "$R/restore-check.git"
v() { git "${CFG[@]}" -C "$R/restore-check.git" "$@"; }
# An empty repository has none of the original objects. This rejects a bundle
# that requires missing prerequisites. No alternates or linked worktree are used.
v bundle verify "$INPUT" > "$R/verify.log" 2>&1
[ "$(v bundle list-heads "$INPUT")" = "$COMMIT $REF" ] || fail BUNDLE_REFS_DIFFER
v bundle unbundle "$INPUT" > "$R/unbundle.log" 2>&1
v update-ref refs/heads/restored-a4 "$COMMIT" 0000000000000000000000000000000000000000
v fsck --full --no-reflogs --no-dangling "$COMMIT" > "$R/fsck.log" 2>&1
[ "$(v rev-list --parents -n 1 "$COMMIT")" = "$COMMIT $BASE" ] || fail RESTORED_PARENT_DIFFERS
check_content "$R/restore-check.git"
[ "$(sha "$INPUT")" = "$BUNDLE_HASH" ] || fail BUNDLE_CHANGED_DURING_CHECK
printf 'EMPTY_REPOSITORY_RESTORE=PASS\nRESTORED_PATCH_MATCHES_A4=YES\nGIT_OBJECT_CHECK=PASS\n'
STEP=EXPOSE_DOWNLOAD_FILES
if [ ! -e "$F" ]; then
  # noclobber prevents overwriting an existing output, including a symlink.
  ( set -C; cat -- "$INPUT" > "$F" )
fi
[ ! -L "$F" ] && [ "$(sha "$F")" = "$BUNDLE_HASH" ] || fail DOWNLOAD_COPY_DIFFERS
if [ ! -e "$S" ]; then
  ( set -C; printf '%s  %s\n' "$BUNDLE_HASH" "$NAME" > "$S" )
fi
[ ! -L "$S" ] && [ "$(cat "$S")" = "$BUNDLE_HASH  $NAME" ] || fail DOWNLOAD_CHECKSUM_DIFFERS
STEP=ORIGINAL_STATE_CHECK
[ "$(g symbolic-ref -q HEAD)" = refs/heads/integration ] || fail ORIGINAL_BRANCH_CHANGED_DURING_BACKUP
[ "$(g rev-parse HEAD)" = "$MAIN" ] || fail ORIGINAL_HEAD_CHANGED_DURING_BACKUP
[ "$(sha "$I")" = "$INDEX_BEFORE" ] || fail ORIGINAL_INDEX_CHANGED_DURING_BACKUP
[ "$(g rev-parse "$REF")" = "$COMMIT" ] || fail RECOVERY_REF_CHANGED_DURING_BACKUP
printf 'BUNDLE_FILE=%s\nCHECKSUM_FILE=%s\nBUNDLE_SHA256=%s\n' "$F" "$S" "$BUNDLE_HASH"
printf 'BUNDLE_BYTES=%s\n' "$(wc -c < "$F")"
printf 'ORIGINAL_HEAD_AND_INDEX=UNCHANGED\nAPPLICATION_SOURCE_EDITS=NO\nNETWORK_REQUESTS=NO\nPUSH=NO\nBUILD=NO\nDEPLOY=NO\nOFF_MACHINE_COPY=NOT_YET_CONFIRMED\nSTATUS=A4_PORTABLE_BACKUP_READY\n'
