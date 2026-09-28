#!/usr/bin/env python3
"""Verify the existing A4 bundle; never rewrite source or re-export history.

The source patch must still match the recorded A4 SHA256. Restored content is
checked using raw commit objects, complete tree inventories, and full git fsck;
rendered diff text is recorded separately because attributes/config affect it.
Only stdlib Python and installed Git are used. No checkout, app execution,
package install, remote fetch/push, or changes to original refs/index/config.
"""
from __future__ import annotations
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys
import tempfile

ROOT = Path('/home/runner/workspace')
MAIN = '66d107eb28be1a3e760749f4dd6ef5614602ff8b'
BASE = 'df8137696e4c7b0a7c16a08347e1b92f85b85371'
REF = 'refs/mmhb-recovery/a4-259b8b63f4b38adb'
COMMIT = '63ff8372d07368a5434c11ff58bdf87bb468449d'
EXPECTED_PATCH = '259b8b63f4b38adb24b6185be80f57c2276e09311775b897aa4da56410db436b'
EXPECTED_PATHS = 75
AUDIT_NAME = 'mmhb-a4-backup-lcyKVK'
NAME = 'MMHB_A4_63ff8372.bundle'
MIN_FREE_BYTES = 3 * 1024**3
CFG = ['-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null',
       '-c', 'gc.auto=0', '-c', 'maintenance.auto=false',
       '-c', 'core.commitGraph=false', '-c', 'core.pager=cat']
STEP = 'IDENTITY'
OUT: Path | None = None
GIT = ''
SOURCE_ENV: dict[str, str] = {}
VERIFY_ENV: dict[str, str] = {}

class Stop(Exception):
    pass

def require(ok: bool, reason: str) -> None:
    if not ok:
        raise Stop(reason)

def checked(path: Path, kind: str = 'file', optional: bool = False) -> bool:
    """Reject symlink paths rather than following one into an unexpected place."""
    require(path.is_absolute(), 'PATH_NOT_ABSOLUTE')
    current = Path(path.anchor)
    for part in path.parts[1:]:
        current /= part
        try:
            info = current.lstat()
        except FileNotFoundError:
            if optional:
                return False
            raise Stop('REQUIRED_PATH_MISSING:' + path.name)
        require(not stat.S_ISLNK(info.st_mode), 'SYMLINK_PATH:' + current.name)
    info = path.stat()
    require(stat.S_ISDIR(info.st_mode) if kind == 'dir' else stat.S_ISREG(info.st_mode),
            'PATH_TYPE_INVALID:' + path.name)
    return True

def digest(path: Path) -> str:
    checked(path)
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()

def git(repo: Path, *args: str, independent: bool = False,
        allowed: tuple[int, ...] = (0,), log: str | None = None) -> tuple[int, bytes]:
    env = VERIFY_ENV if independent else SOURCE_ENV
    result = subprocess.run([GIT, '--no-replace-objects', *CFG, '-C', str(repo), *args],
                            env=env, stdin=subprocess.DEVNULL,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                            timeout=900, check=False)
    if log is not None and OUT is not None:
        (OUT / (log + '.log')).write_bytes(result.stdout + b'\n--- stderr ---\n' + result.stderr)
    if result.returncode not in allowed:
        if OUT is not None:
            (OUT / 'last-git-error.log').write_bytes(result.stderr)
        raise Stop('GIT_COMMAND_FAILED:' + args[0] + ':EXIT_' + str(result.returncode))
    return result.returncode, result.stdout

def output(repo: Path, *args: str, independent: bool = False) -> bytes:
    return git(repo, *args, independent=independent)[1]

def text(repo: Path, *args: str, independent: bool = False) -> str:
    return output(repo, *args, independent=independent).decode('utf-8').strip()

def protected_state(common: Path, index: Path) -> dict[str, object]:
    controls = [common / 'config', common / 'info' / 'exclude',
                common / 'config.worktree']
    return {
        'branch': text(ROOT, 'symbolic-ref', '-q', 'HEAD'),
        'head': text(ROOT, 'rev-parse', 'HEAD'),
        'refs': output(ROOT, 'for-each-ref', '--format=%(refname) %(objectname) %(symref)').hex(),
        'index_sha256': digest(index),
        'control_files': {str(p): digest(p) if checked(p, optional=True) else None for p in controls},
    }

def check_bundle_header(bundle: Path) -> None:
    """A full bundle has no prerequisite revisions and no object filter."""
    refs: list[str] = []
    total = 0
    with bundle.open('rb') as stream:
        first = stream.readline(256)
        require(first in (b'# v2 git bundle\n', b'# v3 git bundle\n'), 'BUNDLE_HEADER_INVALID')
        while True:
            line = stream.readline(65537)
            total += len(line)
            require(line != b'' and total <= 65536, 'BUNDLE_HEADER_INVALID')
            if line == b'\n':
                break
            require(not line.startswith(b'-'), 'BUNDLE_HAS_PREREQUISITES')
            if line.startswith(b'@'):
                require(line == b'@object-format=sha1\n', 'BUNDLE_CAPABILITY_NOT_ALLOWED')
            else:
                try:
                    refs.append(line.decode('ascii').strip())
                except UnicodeDecodeError:
                    raise Stop('BUNDLE_HEADER_INVALID')
        require(stream.read(4) == b'PACK', 'BUNDLE_PACK_HEADER_MISSING')
    require(refs == [COMMIT + ' ' + REF], 'BUNDLE_REFERENCES_DIFFER')

def main() -> None:
    global STEP, OUT, GIT, SOURCE_ENV, VERIFY_ENV
    os.umask(0o077)
    print('COMMAND=MMHB_BACKUP_A4_RESUME', flush=True)
    checked(ROOT, 'dir')
    GIT = shutil.which('git') or ''
    require(bool(GIT), 'GIT_NOT_FOUND')
    # Keep the original user's HOME for the source's original diff presentation.
    # Remove inherited Git routing and all unrelated application credentials.
    SOURCE_ENV = {k: os.environ[k] for k in ('PATH', 'HOME', 'LANG', 'LC_ALL', 'XDG_CONFIG_HOME')
                  if k in os.environ}
    SOURCE_ENV.update(GIT_OPTIONAL_LOCKS='0', GIT_NO_LAZY_FETCH='1',
                      GIT_TERMINAL_PROMPT='0', GIT_ALLOW_PROTOCOL='file',
                      GIT_NO_REPLACE_OBJECTS='1', GIT_PAGER='cat')
    require(text(ROOT, 'rev-parse', '--show-toplevel') == str(ROOT), 'WRONG_WORKSPACE')
    require(text(ROOT, 'symbolic-ref', '-q', 'HEAD') == 'refs/heads/integration', 'ORIGINAL_BRANCH_CHANGED')
    require(text(ROOT, 'rev-parse', 'HEAD') == MAIN, 'ORIGINAL_HEAD_CHANGED')
    require(git(ROOT, 'symbolic-ref', '-q', REF, allowed=(0, 1))[0] == 1, 'SYMBOLIC_RECOVERY_REFERENCE')
    require(text(ROOT, 'rev-parse', '--verify', REF + '^{commit}') == COMMIT, 'RECOVERY_COMMIT_DIFFERS')
    require(text(ROOT, 'rev-list', '--parents', '-n', '1', COMMIT) == COMMIT + ' ' + BASE,
            'RECOVERY_PARENT_DIFFERS')
    require(text(ROOT, 'rev-parse', '--is-shallow-repository') == 'false', 'SHALLOW_SOURCE')
    require(not output(ROOT, 'for-each-ref', '--format=%(refname)', 'refs/replace/').strip(),
            'REPLACE_REFS_NEED_REVIEW')
    rc, _ = git(ROOT, 'config', '--get-regexp', r'^(extensions\.partialclone|remote\..*\.promisor)$',
                allowed=(0, 1))
    require(rc == 1, 'PARTIAL_CLONE_NEEDS_REVIEW')
    common = Path(text(ROOT, 'rev-parse', '--path-format=absolute', '--git-common-dir'))
    index = Path(text(ROOT, 'rev-parse', '--path-format=absolute', '--git-path', 'index'))
    checked(common, 'dir'); checked(index)
    require(not (common / 'info' / 'grafts').exists(), 'GRAFTS_NEED_REVIEW')
    require(not Path(str(index) + '.lock').exists(), 'INDEX_OPERATION_IN_PROGRESS')
    before = protected_state(common, index)
    previous = common / AUDIT_NAME
    checked(previous, 'dir')
    bundle = previous / 'candidate.bundle'
    checked(bundle)
    require(bundle.stat().st_size > 0, 'BUNDLE_EMPTY')
    require(shutil.disk_usage(common).free >= MIN_FREE_BYTES, 'FREE_SPACE_BELOW_3_GIB_POLICY')
    targets = [ROOT / NAME, ROOT / (NAME + '.sha256')]
    for target in targets:
        checked(target, optional=True)
        rc, _ = git(ROOT, 'ls-files', '--error-unmatch', '--', target.name, allowed=(0, 1))
        require(rc == 1, 'BACKUP_TARGET_TRACKED')
        rc, _ = git(ROOT, 'check-ignore', '--no-index', '-q', '--', target.name, allowed=(0, 1))
        require(rc == 0, 'BACKUP_TARGET_NOT_IGNORED')
    OUT = Path(tempfile.mkdtemp(prefix='recheck-', dir=previous))
    print('VERIFICATION_DIR=' + str(OUT), flush=True)
    STEP = 'SOURCE_ANCHOR'
    source_patch = output(ROOT, 'diff', '--binary', '--no-ext-diff', '--no-textconv', BASE, COMMIT)
    (OUT / 'source.patch').write_bytes(source_patch)
    source_hash = hashlib.sha256(source_patch).hexdigest()
    require(source_hash == EXPECTED_PATCH, 'SOURCE_A4_PATCH_DIFFERS')
    paths = output(ROOT, 'diff-tree', '-r', '--no-commit-id', '--no-renames',
                   '--ignore-submodules=none', '--name-only', '-z', BASE, COMMIT)
    require(paths.count(b'\0') == EXPECTED_PATHS, 'CANDIDATE_PATH_COUNT_DIFFERS')
    print('SOURCE_PATCH_MATCHES_A4=YES\nCANDIDATE_PATHS=' + str(EXPECTED_PATHS), flush=True)
    STEP = 'EXISTING_BUNDLE'
    check_bundle_header(bundle)
    bundle_hash = digest(bundle)
    if targets[0].exists():
        require(digest(targets[0]) == bundle_hash, 'EXISTING_BACKUP_DIFFERS')
    checksum = bundle_hash + '  ' + NAME + '\n'
    if targets[1].exists():
        require(targets[1].read_bytes() == checksum.encode('ascii'), 'EXISTING_CHECKSUM_DIFFERS')
    print('BUNDLE_SOURCE=EXISTING_FAILED_RUN_EXPORT\nBUNDLE_REEXPORTED=NO', flush=True)
    STEP = 'INDEPENDENT_RESTORE'
    home = OUT / 'empty-home'; home.mkdir()
    template = OUT / 'empty-template'; template.mkdir()
    VERIFY_ENV = dict(SOURCE_ENV)
    VERIFY_ENV.update(HOME=str(home), XDG_CONFIG_HOME=str(home), GIT_CONFIG_NOSYSTEM='1',
                      GIT_CONFIG_GLOBAL='/dev/null', GIT_ATTR_NOSYSTEM='1',
                      LC_ALL='C', TMPDIR=str(OUT))
    verified = OUT / 'restore.git'
    git(OUT, 'init', '--quiet', '--bare', '--template=' + str(template), str(verified), independent=True)
    require(not (verified / 'objects' / 'info' / 'alternates').exists(), 'RESTORE_HAS_ALTERNATES')
    require(not (verified / 'objects' / 'info' / 'http-alternates').exists(), 'RESTORE_HAS_ALTERNATES')
    require(not output(verified, 'for-each-ref', independent=True).strip(), 'RESTORE_NOT_EMPTY')
    git(verified, 'bundle', 'verify', str(bundle), independent=True, log='bundle-verify-empty')
    require(text(verified, 'bundle', 'list-heads', str(bundle), independent=True) == COMMIT + ' ' + REF,
            'BUNDLE_REFERENCES_DIFFER')
    git(verified, 'bundle', 'unbundle', str(bundle), independent=True, log='unbundle')
    git(verified, 'update-ref', 'refs/heads/restored-a4', COMMIT, '0' * 40, independent=True)
    git(verified, 'fsck', '--full', '--no-reflogs', '--no-dangling', COMMIT, independent=True, log='fsck')
    require(text(verified, 'rev-list', '--parents', '-n', '1', COMMIT, independent=True) == COMMIT + ' ' + BASE,
            'RESTORED_PARENT_DIFFERS')
    print('EMPTY_REPOSITORY_RESTORE=PASS\nGIT_OBJECT_CHECK=PASS', flush=True)
    STEP = 'EXACT_CONTENT_COMPARISON'
    for oid in (BASE, COMMIT):
        require(output(ROOT, 'cat-file', 'commit', oid) == output(verified, 'cat-file', 'commit', oid, independent=True),
                'RAW_COMMIT_BYTES_DIFFER')
        require(text(ROOT, 'rev-parse', oid + '^{tree}') == text(verified, 'rev-parse', oid + '^{tree}', independent=True),
                'ROOT_TREE_ID_DIFFERS')
        source_tree = output(ROOT, 'ls-tree', '-r', '-t', '-z', '--full-tree', oid)
        target_tree = output(verified, 'ls-tree', '-r', '-t', '-z', '--full-tree', oid, independent=True)
        require(source_tree == target_tree, 'RECURSIVE_TREE_INVENTORY_DIFFERS')
    restored_patch = output(verified, 'diff', '--binary', '--no-ext-diff', '--no-textconv', BASE, COMMIT, independent=True)
    (OUT / 'restored-rendered.patch').write_bytes(restored_patch)
    restored_hash = hashlib.sha256(restored_patch).hexdigest()
    print('RAW_COMMIT_BYTES=IDENTICAL\nRECURSIVE_TREE_INVENTORIES=IDENTICAL', flush=True)
    print('RESTORED_RENDERED_PATCH_SHA256=' + restored_hash, flush=True)
    print('PATCH_TEXT=' + ('MATCHES_A4' if restored_hash == EXPECTED_PATCH else 'DIFFERS_BUT_STORED_CONTENT_MATCHES'), flush=True)
    require(digest(bundle) == bundle_hash, 'BUNDLE_CHANGED_DURING_VERIFICATION')
    STEP = 'PRESERVE_ORIGINAL_STATE'
    require(protected_state(common, index) == before, 'ORIGINAL_GIT_STATE_CHANGED')
    STEP = 'EXPOSE_DOWNLOAD_FILES'
    # Exclusive hard link: no second history export or overwrite. The source
    # bundle stays in the old audit directory. This is NOT an off-machine copy.
    if not targets[0].exists():
        os.link(bundle, targets[0], follow_symlinks=False)
    require(digest(targets[0]) == bundle_hash, 'DOWNLOAD_BUNDLE_DIFFERS')
    if not targets[1].exists():
        private_sum = OUT / 'bundle.sha256'
        private_sum.write_bytes(checksum.encode('ascii'))
        os.link(private_sum, targets[1], follow_symlinks=False)
    require(targets[1].read_bytes() == checksum.encode('ascii'), 'DOWNLOAD_CHECKSUM_DIFFERS')
    require(protected_state(common, index) == before, 'ORIGINAL_GIT_STATE_CHANGED')
    report = {'status': 'A4_PORTABLE_BACKUP_READY', 'source_patch_sha256': source_hash,
              'restored_rendered_patch_sha256': restored_hash, 'rendered_patch_equal': source_hash == restored_hash,
              'raw_commit_bytes_identical': True, 'recursive_tree_inventories_identical': True,
              'full_fsck_passed': True, 'bundle_imported_into_new_empty_repository': True,
              'commit': COMMIT, 'base': BASE, 'candidate_paths': EXPECTED_PATHS,
              'bundle_sha256': bundle_hash, 'bundle': str(targets[0]),
              'original_head_index_refs_config_unchanged': True,
              'off_machine_copy_confirmed': False, 'reexported': False}
    (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print('RESTORED_CONTENT_MATCHES_A4=YES\nORIGINAL_HEAD_INDEX_REFS_CONFIG=UNCHANGED')
    print('BUNDLE_FILE=' + str(targets[0]) + '\nCHECKSUM_FILE=' + str(targets[1]))
    print('BUNDLE_SHA256=' + bundle_hash + '\nBUNDLE_BYTES=' + str(targets[0].stat().st_size))
    print('APPLICATION_SOURCE_EDITS=NO\nNETWORK_REQUESTS=NO\nPUSH=NO\nBUILD=NO\nDEPLOY=NO')
    print('OFF_MACHINE_COPY=NOT_YET_CONFIRMED\nSTATUS=A4_PORTABLE_BACKUP_READY')

if __name__ == '__main__':
    try:
        main()
    except (Stop, OSError, subprocess.TimeoutExpired, UnicodeError, ValueError) as exc:
        reason = str(exc) if isinstance(exc, Stop) else type(exc).__name__
        print('STOP=' + reason + '\nSTATUS=BACKUP_STOPPED\nSTEP=' + STEP)
        if OUT is not None:
            print('VERIFICATION_DIR=' + str(OUT))
        sys.exit(1)
