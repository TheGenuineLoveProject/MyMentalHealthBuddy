#!/usr/bin/env python3
"""Restore the pinned MMHB A4 source into an ignored, separate worktree.

Reuses the already verified independent bare repository. No fetch, clone,
application execution, npm invocation, push, or deployment. Never overwrites
an existing candidate. Original integration HEAD/index/refs/config are checked.
A worktree lock protects Git metadata, not against filesystem loss.
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
COMMIT = '63ff8372d07368a5434c11ff58bdf87bb468449d'
RECOVERY_REF = 'refs/mmhb-recovery/a4-259b8b63f4b38adb'
BUNDLE_NAME = 'MMHB_A4_63ff8372.bundle'
BUNDLE_SHA = '5c3805234e938f76fd0e05ce32cb8c9678c69df81694e9e6cd1876c0d7bf71a4'
BUNDLE_BYTES = 402538359
VERIFIED_REL = Path('mmhb-a4-backup-lcyKVK/recheck-7g_es8ex/restore.git')
DEST_REL = Path('.local/mmhb-candidates/a4-63ff8372')
EXPECTED_PATHS = 75
CSS_SHA = '1683170369367eaba4e36b9d25ea5eca6fe9549152c2c4b6cb2e2686eb20ae61'
REQUIRED = ('package.json', 'package-lock.json', 'README.md', 'CHANGELOG.md',
            'client/src/index.css', 'server/app.mjs',
            'server/replit_integrations/auth/replitAuth.mjs',
            'scripts/build-server.mjs')
CFG = ['-c', 'core.hooksPath=/dev/null', '-c', 'core.fsmonitor=false',
       '-c', 'gc.auto=0', '-c', 'maintenance.auto=false',
       '-c', 'core.commitGraph=false', '-c', 'core.pager=cat',
       '-c', 'core.autocrlf=false', '-c', 'core.eol=lf',
       '-c', 'core.attributesFile=/dev/null', '-c', 'core.excludesFile=/dev/null',
       '-c', 'submodule.recurse=false']
ENV: dict[str, str] = {}
GIT = ''
OUT: Path | None = None
STEP = 'IDENTITY'

class Stop(Exception):
    pass

def require(ok: bool, reason: str) -> None:
    if not ok:
        raise Stop(reason)

def checked(p: Path, kind: str = 'file', optional: bool = False) -> bool:
    require(p.is_absolute(), 'PATH_NOT_ABSOLUTE')
    cur = Path(p.anchor)
    for part in p.parts[1:]:
        cur /= part
        try:
            st = cur.lstat()
        except FileNotFoundError:
            if optional:
                return False
            raise Stop('PATH_MISSING:' + p.name)
        require(not stat.S_ISLNK(st.st_mode), 'SYMLINK_PATH:' + cur.name)
    require(stat.S_ISDIR(st.st_mode) if kind == 'dir' else stat.S_ISREG(st.st_mode),
            'UNEXPECTED_PATH_TYPE:' + p.name)
    return True

def sha(p: Path) -> str:
    checked(p)
    h = hashlib.sha256()
    with p.open('rb') as f:
        for data in iter(lambda: f.read(1024 * 1024), b''):
            h.update(data)
    return h.hexdigest()

def run(repo: Path, *args: str, allowed: tuple[int, ...] = (0,),
        log: str | None = None) -> tuple[int, bytes]:
    r = subprocess.run([GIT, '--no-replace-objects', *CFG, '-C', str(repo), *args],
                       env=ENV, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE,
                       stderr=subprocess.PIPE, timeout=900, check=False)
    if OUT is not None and log:
        (OUT / (log + '.log')).write_bytes(r.stdout + b'\n--- stderr ---\n' + r.stderr)
    if r.returncode not in allowed:
        if OUT is not None:
            (OUT / 'last-git-error.log').write_bytes(r.stderr)
        raise Stop('GIT_FAILED:' + args[0] + ':EXIT_' + str(r.returncode))
    return r.returncode, r.stdout

def raw(repo: Path, *args: str) -> bytes:
    return run(repo, *args)[1]

def text(repo: Path, *args: str) -> str:
    return raw(repo, *args).decode('utf-8').strip()

def state(common: Path, index: Path) -> dict:
    controls = ('HEAD', 'config', 'config.worktree', 'info/exclude', 'info/attributes')
    return {'head': text(ROOT, 'rev-parse', 'HEAD'),
            'branch': text(ROOT, 'symbolic-ref', '-q', 'HEAD'),
            'index': sha(index),
            'refs': raw(ROOT, 'for-each-ref', '--format=%(refname) %(objectname) %(symref)').hex(),
            'controls': {k: sha(common / k) if checked(common / k, optional=True) else None
                         for k in controls}}

def tree(repo: Path) -> tuple[bytes, list[tuple[str, str, int, str]]]:
    inventory = raw(repo, 'ls-tree', '-r', '-l', '-z', '--full-tree', COMMIT)
    records = []
    for line in inventory.split(b'\0'):
        if not line:
            continue
        meta, name = line.split(b'\t', 1)
        mode, kind, oid, size = meta.split()
        p = name.decode('utf-8')
        parts = p.split('/')
        require(all(x not in ('', '.', '..') and x.lower() != '.git' for x in parts)
                and not p.startswith('/') and '\\' not in p, 'UNSAFE_TRACKED_PATH')
        require(kind == b'blob' and mode in (b'100644', b'100755', b'120000'),
                'SUBMODULE_OR_UNSUPPORTED_ENTRY_REQUIRES_REVIEW')
        records.append((p, mode.decode('ascii'), int(size), oid.decode('ascii')))
    require(bool(records), 'EMPTY_SOURCE_TREE')
    return inventory, records

def verify_checkout(dest: Path, entries: list[tuple[str, str, int, str]]) -> int:
    """Compare every raw file/symlink with its Git blob, not rendered diffs."""
    lfs = 0
    for p, mode, size, oid in entries:
        f = dest / p
        checked(f.parent, 'dir')
        st = f.lstat()
        if mode == '120000':
            require(stat.S_ISLNK(st.st_mode), 'SYMLINK_TYPE_DIFFERS:' + p)
            data = os.fsencode(os.readlink(f))
            require(len(data) == size, 'SYMLINK_SIZE_DIFFERS:' + p)
            h = hashlib.sha1(b'blob ' + str(size).encode() + b'\0' + data).hexdigest()
        else:
            checked(f)
            require(st.st_size == size, 'WORKING_FILE_SIZE_DIFFERS:' + p)
            require(bool(st.st_mode & stat.S_IXUSR) == (mode == '100755'),
                    'EXECUTABLE_MODE_DIFFERS:' + p)
            h1 = hashlib.sha1(b'blob ' + str(size).encode() + b'\0')
            with f.open('rb') as stream:
                first = stream.read(1024 * 1024)
                if first.startswith(b'version https://git-lfs.github.com/spec/v1\n'):
                    lfs += 1
                h1.update(first)
                for data in iter(lambda: stream.read(1024 * 1024), b''):
                    h1.update(data)
            h = h1.hexdigest()
        require(h == oid, 'WORKING_FILE_CONTENT_DIFFERS:' + p)
    return lfs

def main() -> None:
    global GIT, ENV, STEP, OUT
    os.umask(0o077)
    print('COMMAND=MMHB_RESTORE_A4_WORKTREE', flush=True)
    checked(ROOT, 'dir')
    GIT = shutil.which('git') or ''
    require(bool(GIT), 'GIT_NOT_FOUND')
    # Git only; do not inherit API keys, DB credentials, routing overrides,
    # user Git config, credential helpers, pager commands, or application env.
    ENV = {'PATH': os.environ.get('PATH', '/usr/bin:/bin'), 'HOME': str(ROOT),
           'LC_ALL': 'C', 'GIT_CONFIG_NOSYSTEM': '1', 'GIT_CONFIG_GLOBAL': '/dev/null',
           'GIT_ATTR_NOSYSTEM': '1', 'GIT_OPTIONAL_LOCKS': '0', 'GIT_NO_LAZY_FETCH': '1',
           'GIT_NO_REPLACE_OBJECTS': '1', 'GIT_TERMINAL_PROMPT': '0',
           'GIT_ALLOW_PROTOCOL': '', 'GIT_PAGER': 'cat'}
    require(text(ROOT, 'rev-parse', '--show-toplevel') == str(ROOT), 'WRONG_WORKSPACE')
    require(text(ROOT, 'symbolic-ref', '-q', 'HEAD') == 'refs/heads/integration', 'ORIGINAL_BRANCH_CHANGED')
    require(text(ROOT, 'rev-parse', 'HEAD') == MAIN, 'ORIGINAL_HEAD_CHANGED')
    common = Path(text(ROOT, 'rev-parse', '--path-format=absolute', '--git-common-dir'))
    index = Path(text(ROOT, 'rev-parse', '--path-format=absolute', '--git-path', 'index'))
    checked(common, 'dir'); checked(index)
    require(common == ROOT / '.git', 'NONSTANDARD_COMMON_DIRECTORY')
    require(not Path(str(index) + '.lock').exists(), 'ORIGINAL_INDEX_BUSY')
    require(text(ROOT, 'rev-parse', RECOVERY_REF + '^{commit}') == COMMIT, 'RECOVERY_REFERENCE_DIFFERS')
    before = state(common, index)
    verified = common / VERIFIED_REL
    checked(verified, 'dir')
    require(text(verified, 'rev-parse', '--is-bare-repository') == 'true', 'EXPECTED_VERIFIED_BARE_REPOSITORY')
    require(Path(text(verified, 'rev-parse', '--path-format=absolute', '--git-common-dir')) == verified,
            'VERIFIED_REPOSITORY_ROUTING_DIFFERS')
    require(not (verified / 'objects/info/alternates').exists(), 'OBJECT_ALTERNATES_REQUIRE_REVIEW')
    require(not (verified / 'objects/info/http-alternates').exists(), 'OBJECT_ALTERNATES_REQUIRE_REVIEW')
    require(not (verified / 'info/grafts').exists(), 'GRAFTS_REQUIRE_REVIEW')
    require(not raw(verified, 'for-each-ref', 'refs/replace/').strip(), 'REPLACE_REFS_REQUIRE_REVIEW')
    rc, _ = run(verified, 'config', '--local', '--get-regexp',
                r'^(filter\.|include\.|includeif\.|remote\.|extensions\.partialclone|core\.worktree|core\.sparsecheckout)',
                allowed=(0, 1))
    require(rc == 1, 'VERIFIED_REPOSITORY_CONFIG_REQUIRES_REVIEW')
    bundle = ROOT / BUNDLE_NAME
    checked(bundle)
    require(bundle.stat().st_size == BUNDLE_BYTES, 'BUNDLE_SIZE_DIFFERS')
    require(sha(bundle) == BUNDLE_SHA, 'BUNDLE_CHECKSUM_DIFFERS')
    checked(ROOT / (BUNDLE_NAME + '.sha256'))
    require((ROOT / (BUNDLE_NAME + '.sha256')).read_bytes() ==
            (BUNDLE_SHA + '  ' + BUNDLE_NAME + '\n').encode(), 'CHECKSUM_FILE_DIFFERS')
    print('BUNDLE_CHECKSUM=PASS\nOBJECT_STORE=EXISTING_INDEPENDENT_RESTORE\nBUNDLE_REIMPORTED=NO', flush=True)
    dest = ROOT / DEST_REL
    checked(dest.parent, 'dir', optional=True)
    checked(dest, 'dir', optional=True)
    require(not raw(ROOT, 'ls-files', '-z', '--', str(DEST_REL)).strip(), 'DESTINATION_TRACKED_IN_ORIGINAL')
    require(run(ROOT, 'check-ignore', '--no-index', '-q', '--', str(DEST_REL / 'probe'), allowed=(0, 1))[0] == 0,
            'DESTINATION_NOT_IGNORED_IN_ORIGINAL')
    OUT = Path(tempfile.mkdtemp(prefix='mmhb-a4-restore-', dir=common))
    print('RESTORE_AUDIT_DIR=' + str(OUT), flush=True)
    STEP = 'STORED_CONTENT'
    for repo in (ROOT, verified):
        require(text(repo, 'rev-list', '--parents', '-n', '1', COMMIT) == COMMIT + ' ' + BASE,
                'COMMIT_OR_PARENT_DIFFERS')
    require(raw(ROOT, 'cat-file', 'commit', COMMIT) == raw(verified, 'cat-file', 'commit', COMMIT),
            'COMMIT_BYTES_DIFFER')
    inv, entries = tree(verified)
    require(inv == tree(ROOT)[0], 'SOURCE_TREE_INVENTORY_DIFFERS')
    paths = raw(verified, 'diff-tree', '-r', '--no-commit-id', '--no-renames', '--name-only', '-z', BASE, COMMIT)
    require(paths.count(b'\0') == EXPECTED_PATHS, 'CHANGED_PATH_COUNT_DIFFERS')
    # No executable git filters run. Avoid unsafe or external symlink targets.
    for p, mode, _, oid in entries:
        if mode == '120000':
            target = raw(verified, 'cat-file', 'blob', oid).decode('utf-8')
            require(target and not os.path.isabs(target) and '\0' not in target,
                    'EXTERNAL_SYMLINK_REQUIRES_REVIEW:' + p)
            resolved = Path(os.path.normpath(str((dest / p).parent / target)))
            require(resolved.is_relative_to(dest), 'EXTERNAL_SYMLINK_REQUIRES_REVIEW:' + p)
    run(verified, 'fsck', '--full', '--no-reflogs', '--no-dangling', COMMIT, log='object-check')
    print('COMMIT_PARENT_AND_TREE=PASS\nCANDIDATE_CHANGED_PATHS=' + str(EXPECTED_PATHS), flush=True)
    STEP = 'WORKING_DIRECTORY'
    existed = checked(dest, 'dir', optional=True)
    if existed:
        checked(dest / '.git')
        require(Path(text(dest, 'rev-parse', '--path-format=absolute', '--git-common-dir')) == verified,
                'EXISTING_DESTINATION_UNRELATED')
        require(text(dest, 'rev-parse', 'HEAD') == COMMIT, 'EXISTING_DESTINATION_HEAD_DIFFERS')
        require(run(dest, 'symbolic-ref', '-q', 'HEAD', allowed=(0, 1))[0] == 1,
                'EXISTING_DESTINATION_ON_BRANCH')
        require(not raw(dest, 'status', '--porcelain=v1', '-z', '--untracked-files=all'),
                'EXISTING_DESTINATION_HAS_CHANGES')
        print('WORKTREE=REUSE_WITHOUT_OVERWRITE', flush=True)
    else:
        require(shutil.disk_usage(ROOT).free >= sum(e[2] for e in entries) + 512 * 1024**2,
                'INSUFFICIENT_DISK_FOR_CHECKOUT')
        dest.parent.mkdir(parents=True, exist_ok=True)
        checked(dest.parent, 'dir')
        run(verified, 'worktree', 'add', '--detach', '--lock', '--reason',
            'MMHB A4 recovered source; retain metadata', str(dest), COMMIT, log='checkout')
        print('WORKTREE=CREATED_FROM_RECOVERY_COMMIT', flush=True)
    STEP = 'WORKING_BYTES'
    require(text(dest, 'rev-parse', '--show-toplevel') == str(dest), 'CHECKOUT_ROOT_DIFFERS')
    require(text(dest, 'rev-parse', 'HEAD') == COMMIT, 'CHECKOUT_HEAD_DIFFERS')
    require(text(dest, 'rev-parse', 'HEAD^{tree}') == text(verified, 'rev-parse', COMMIT + '^{tree}'),
            'CHECKOUT_TREE_DIFFERS')
    lfs = verify_checkout(dest, entries)
    for name in REQUIRED:
        checked(dest / name)
    require(sha(dest / 'client/src/index.css') == CSS_SHA, 'RGB_SOURCE_DIFFERS')
    require(not raw(dest, 'status', '--porcelain=v1', '-z', '--untracked-files=all'), 'CHECKOUT_NOT_CLEAN')
    admin = Path(text(dest, 'rev-parse', '--path-format=absolute', '--git-dir'))
    require(admin.parent == verified / 'worktrees', 'CHECKOUT_ADMIN_LOCATION_DIFFERS')
    if not checked(admin / 'locked', optional=True):
        run(verified, 'worktree', 'lock', '--reason', 'MMHB A4 recovered source; retain metadata', str(dest))
    checked(admin / 'locked')
    require(sha(bundle) == BUNDLE_SHA, 'BUNDLE_CHANGED_DURING_RESTORE')
    require(state(common, index) == before, 'ORIGINAL_HEAD_INDEX_REFS_CONFIG_CHANGED')
    report = {'status': 'A4_SOURCE_WORKTREE_RESTORED', 'source_commit': COMMIT,
              'base': BASE, 'changed_paths_vs_base': EXPECTED_PATHS, 'worktree': str(dest),
              'git_common_dir': str(verified), 'mode': 'DETACHED_AT_COMMITTED_SNAPSHOT',
              'tracked_entries_checked': len(entries), 'git_lfs_pointer_count': lfs,
              'source_files_match_raw_git_blobs': True, 'worktree_clean': True,
              'worktree_locked': True, 'original_head_index_refs_config_unchanged': True,
              'bundle_sha256': BUNDLE_SHA, 'off_machine_copy_confirmed': False,
              'dependency_install_run': False, 'build_run': False, 'app_run': False,
              'network_requests': False, 'push_run': False, 'deployment_run': False}
    (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print('CHECKOUT_HEAD=' + COMMIT + '\nCHECKOUT_MODE=DETACHED_AT_COMMITTED_SNAPSHOT')
    print('TRACKED_ENTRIES_CHECKED=' + str(len(entries)) + '\nWORKING_FILES_MATCH_GIT_OBJECTS=YES')
    print('GIT_LFS_POINTER_COUNT=' + str(lfs))
    print('WORKTREE_CLEAN=YES\nWORKTREE_LOCKED=YES\nORIGINAL_HEAD_INDEX_REFS_CONFIG=UNCHANGED')
    print('WORKTREE=' + str(dest))
    print('ORIGINAL_APPLICATION_SOURCE_EDITS=NO\nRESTORED_SOURCE_FILES=YES')
    print('NETWORK_REQUESTS=NO\nINSTALL=NO\nBUILD=NO\nAPPLICATION_START=NO\nPUSH=NO\nDEPLOY=NO')
    print('OFF_MACHINE_COPY=NOT_YET_CONFIRMED\nSTATUS=A4_SOURCE_WORKTREE_RESTORED')

if __name__ == '__main__':
    try:
        main()
    except (Stop, OSError, subprocess.TimeoutExpired, UnicodeError, ValueError) as e:
        print('STOP=' + (str(e) if isinstance(e, Stop) else type(e).__name__))
        print('STEP=' + STEP + '\nSTATUS=RESTORE_STOPPED')
        if OUT is not None:
            print('RESTORE_AUDIT_DIR=' + str(OUT))
        sys.exit(1)
