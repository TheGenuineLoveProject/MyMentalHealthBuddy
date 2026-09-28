#!/usr/bin/env python3
"""Compiler-only qualification of the source-integrated MMHB candidate.
No npm lifecycle scripts, application startup, database operations, installations,
Git writes, or deployment. Writes private logs and compiler build-info only.
"""
from __future__ import annotations
import argparse, collections, datetime, hashlib, json, os, pathlib, re
import shutil, stat, subprocess, sys, tempfile
P = pathlib.Path
ROOT = P('/home/runner/workspace')
WORK = ROOT / '.local/mmhb-candidates/a4-63ff8372'
STORE = ROOT / '.git/mmhb-a4-backup-lcyKVK/recheck-7g_es8ex/restore.git'
CHECKPOINT = 'e23ee835f21198157b7aad4c248f768633814903'
PARENT = 'cb2e164a8fc19e7fab3a539a9facb4b4b562eaca'
FIX_REF = 'refs/mmhb-fixes/refresh-family-source-v1-da2a00f34c197fc9'
BASE = '63ff8372d07368a5434c11ff58bdf87bb468449d'
MAX_FILE = 64 * 1024 * 1024
MAX_TOTAL = 512 * 1024 * 1024
MAX_OUTPUT = 1024 * 1024

class Stop(RuntimeError):
    pass

def need(ok, message):
    if not ok:
        raise Stop(message)

def digest(raw):
    return hashlib.sha256(raw).hexdigest()

def clean_env():
    return {'PATH': os.environ.get('PATH', '/usr/bin:/bin'),
            'LANG': 'C', 'LC_ALL': 'C', 'TZ': 'UTC', 'CI': 'true',
            'NODE_DISABLE_COMPILE_CACHE': '1', 'GIT_CONFIG_NOSYSTEM': '1',
            'GIT_CONFIG_GLOBAL': '/dev/null', 'GIT_NO_LAZY_FETCH': '1'}

def plain(path, limit=MAX_FILE):
    st = path.lstat()
    need(stat.S_ISREG(st.st_mode), 'NOT_REGULAR_FILE:' + str(path))
    need(st.st_size <= limit, 'FILE_SIZE_LIMIT:' + str(path))
    fd = os.open(path, os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0))
    try:
        current = os.fstat(fd)
        need((current.st_dev, current.st_ino) == (st.st_dev, st.st_ino), 'FILE_REPLACED:' + str(path))
        with os.fdopen(fd, 'rb', closefd=False) as f:
            raw = f.read(limit + 1)
        need(len(raw) <= limit, 'FILE_GREW:' + str(path))
        return raw
    finally:
        os.close(fd)

def run(cmd, cwd, timeout=30):
    r = subprocess.run(cmd, cwd=cwd, env=clean_env(), capture_output=True, timeout=timeout)
    need(r.returncode == 0, 'COMMAND_FAILED:' + P(str(cmd[0])).name + ':' + r.stderr.decode(errors='replace')[:300])
    return r.stdout

class Repo:
    def __init__(self, store):
        self.store = store
        self.git = shutil.which('git')
        need(self.git, 'GIT_MISSING_NO_INSTALL')
    def get(self, *args):
        return run([self.git, '--no-pager', '--no-replace-objects', '--no-optional-locks',
                    '-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null',
                    '--git-dir=' + str(self.store), *args], self.store)
    def text(self, *args):
        return self.get(*args).decode().strip()

def snapshot(root, work, store, checkpoint, parent, ref, base):
    for directory in (root, work, store):
        need(directory.is_dir() and directory.resolve() == directory, 'DIRECTORY_MISSING_OR_LINK:' + str(directory))
    raw_marker = plain(work / '.git', MAX_OUTPUT)
    marker = raw_marker.decode().strip()
    need(marker.startswith('gitdir: '), 'WORKTREE_MARKER_INVALID')
    admin = P(marker[8:])
    if not admin.is_absolute():
        admin = work / admin
    need(admin.resolve() == admin and admin.parent == store / 'worktrees', 'WORKTREE_WRONG_STORE')
    need(plain(admin / 'gitdir').decode().strip() == str(work / '.git'), 'WORKTREE_BACKLINK')
    need(plain(admin / 'HEAD').decode().strip() == base, 'BASE_HEAD_CHANGED')
    need((admin / 'locked').is_file(), 'WORKTREE_LOCK_MISSING')
    repo = Repo(store)
    need(repo.text('rev-parse', '--verify', checkpoint + '^{commit}') == checkpoint, 'CHECKPOINT_MISSING')
    need(repo.text('rev-parse', '--verify', ref) == checkpoint, 'CHECKPOINT_REF_CHANGED')
    need(repo.text('rev-list', '--parents', '-n', '1', checkpoint) == checkpoint + ' ' + parent, 'CHECKPOINT_PARENT_CHANGED')
    entries = repo.get('ls-tree', '-r', '-z', '--full-tree', checkpoint).split(b'\0')
    observed = {}
    total = 0
    for entry in entries:
        if not entry:
            continue
        metadata, relative = entry.split(b'\t', 1)
        mode, kind, oid = metadata.decode().split()
        name = relative.decode('utf-8')
        need(not name.startswith('/') and all(x not in ('', '.', '..') for x in name.split('/')), 'UNSAFE_TREE_PATH')
        need(kind == 'blob' and mode in ('100644', '100755', '120000'), 'UNSUPPORTED_TREE_ENTRY:' + name)
        path = work / name
        for directory in path.parents:
            if directory == work:
                break
            need(directory.is_dir() and not directory.is_symlink(), 'LINKED_SOURCE_PARENT:' + name)
        if mode == '120000':
            need(path.is_symlink(), 'SOURCE_LINK_CHANGED:' + name)
            raw = os.fsencode(os.readlink(path))
        else:
            raw = plain(path)
            need(bool(path.stat().st_mode & 0o111) == (mode == '100755'), 'SOURCE_MODE_CHANGED:' + name)
        total += len(raw)
        need(total <= MAX_TOTAL, 'SOURCE_BYTE_BUDGET')
        blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
        need(blob == oid, 'WORKING_SOURCE_DIFFERS_FROM_CHECKPOINT:' + name)
        observed[name] = oid
    for name in ('package.json', 'package-lock.json', 'tsconfig.json'):
        need(name in observed, 'BUILD_INPUT_NOT_COMMITTED:' + name)
        need(not (work / name).is_symlink(), 'BUILD_INPUT_LINK:' + name)
    metadata_paths = [work / '.git', admin / 'HEAD', admin / 'index', admin / 'locked', store / 'config']
    outer = root / '.git'
    if outer.is_dir():
        metadata_paths += [outer / n for n in ('HEAD', 'index', 'config') if (outer / n).exists()]
    meta = {str(p): digest(plain(p, 128 * 1024 * 1024)) for p in metadata_paths}
    refs = digest(repo.get('for-each-ref', '--format=%(refname) %(objectname) %(symref)'))
    return {'entries': observed, 'metadata': meta, 'refs': refs, 'bytes': total}

RESOLVE = r'''
const fs = require('node:fs'), path = require('node:path');
const cwd = process.cwd();
const manifest = require.resolve('typescript/package.json', { paths: [cwd] });
const entry = require.resolve('typescript/lib/tsc.js', { paths: [cwd] });
const pkg = JSON.parse(fs.readFileSync(manifest, 'utf8'));
const folder = fs.realpathSync(path.dirname(manifest));
if (fs.realpathSync(entry) !== path.join(folder, 'lib', 'tsc.js')) throw Error('COMPILER_ENTRY_MISMATCH');
console.log(JSON.stringify({version: pkg.version, manifest: fs.realpathSync(manifest), entry: fs.realpathSync(entry)}));
'''

def execute(root=ROOT, work=WORK, store=STORE, checkpoint=CHECKPOINT,
            parent=PARENT, ref=FIX_REF, base=BASE, node_major=24):
    root, work, store = map(P, (root, work, store))
    before = snapshot(root, work, store, checkpoint, parent, ref, base)
    pkg = json.loads(plain(work / 'package.json'))
    need(pkg.get('scripts', {}).get('typecheck') == 'tsc --noEmit', 'TYPECHECK_COMMAND_CHANGED')
    lock = json.loads(plain(work / 'package-lock.json'))
    expected = lock.get('packages', {}).get('node_modules/typescript', {}).get('version')
    need(isinstance(expected, str) and expected, 'TYPESCRIPT_LOCK_ENTRY_MISSING')
    node = shutil.which('node')
    need(node, 'NODE_MISSING_NO_INSTALL')
    version = run([node, '--version'], work).decode().strip()
    need(re.fullmatch(fr'v{node_major}\.\d+\.\d+', version), 'NODE_24_REQUIRED_NO_INSTALL')
    resolved = json.loads(run([node, '--input-type=commonjs', '-e', RESOLVE], work))
    need(resolved['version'] == expected, 'TYPESCRIPT_VERSION_DIFFERS:expected=' + expected + ':actual=' + resolved['version'])
    allowed = [(work / 'node_modules').resolve(), (root / 'node_modules').resolve()]
    need(any(P(resolved['entry']).is_relative_to(d) for d in allowed), 'COMPILER_OUTSIDE_WORKSPACE_DEPENDENCIES')
    compiler_info_before = (plain(P(resolved['manifest'])), plain(P(resolved['entry'])))
    audit = P(tempfile.mkdtemp(prefix='mmhb-typecheck-', dir=store))
    print('CHECKPOINT=' + checkpoint, flush=True)
    print('TRACKED_ENTRIES_VERIFIED=' + str(len(before['entries'])), flush=True)
    print('NODE=' + version + '\nTYPESCRIPT=' + expected + '\nCOMPILER=' + resolved['entry'], flush=True)
    print('AUDIT_DIR=' + str(audit), flush=True)
    report = {'schema': 'MMHB_COMPILER_CHECK_V1', 'checkpoint': checkpoint,
              'node': version, 'typescript': expected, 'compiler': resolved['entry'],
              'dependencyVerification': 'Direct compiler package version and location; not a full dependency-integrity audit',
              'trackedEntriesVerified': len(before['entries']), 'sourceEditOperations': 0,
              'applicationStarted': False, 'databaseOperations': 0, 'installationOperations': 0,
              'fullNpmTestRun': False, 'frontendBuildRun': False, 'error': None}
    log = audit / 'typecheck.log'
    status = 1
    try:
        config = run([node, resolved['entry'], '--project', 'tsconfig.json', '--showConfig'], work)
        (audit / 'effective-tsconfig.json').write_bytes(config)
        conf = json.loads(config)
        report['configuredFiles'] = len(conf.get('files', []))
        report['compilerOptions'] = {k: conf.get('compilerOptions', {}).get(k) for k in
                                     ('allowJs', 'checkJs', 'strict', 'skipLibCheck', 'composite')}
        args = [node, resolved['entry'], '--project', 'tsconfig.json', '--noEmit', '--pretty', 'false',
                '--incremental', '--tsBuildInfoFile', str(audit / 'typecheck.tsbuildinfo')]
        report['command'] = args
        with log.open('xb') as stream:
            result = subprocess.run(args, cwd=work, env=clean_env(), stdout=stream,
                                    stderr=subprocess.STDOUT, timeout=240)
        status = result.returncode
        report['compilerExitCode'] = status
    except subprocess.TimeoutExpired:
        report['error'] = 'COMPILER_TIMEOUT'; status = 124
    except Exception as exc:
        report['error'] = str(exc); status = 1
    finally:
        try:
            after = snapshot(root, work, store, checkpoint, parent, ref, base)
            same_compiler = compiler_info_before == (plain(P(resolved['manifest'])), plain(P(resolved['entry'])))
            need(before == after and same_compiler, 'SOURCE_OR_METADATA_OR_COMPILER_CHANGED')
            report['trackedSourceAndCheckedMetadataUnchanged'] = True
        except Exception as exc:
            report['trackedSourceAndCheckedMetadataUnchanged'] = False
            report['error'] = (report['error'] or '') + ';POSTCHECK:' + str(exc)
            status = 1
        counts = collections.Counter(); preview = []
        if log.exists():
            with log.open(encoding='utf-8', errors='replace') as stream:
                for line in stream:
                    counts.update(re.findall(r'\berror (TS\d+):', line))
                    if len(preview) < 45:
                        preview.append(line.rstrip()[:1500])
        report['diagnosticCounts'] = dict(sorted(counts.items()))
        report['logFile'] = str(log)
        report['status'] = 'CONFIGURED_TYPESCRIPT_CHECK_PASS' if status == 0 else 'TYPECHECK_NOT_PASSED'
        result_path = audit / 'result.json'
        result_path.write_text(json.dumps(report, indent=2) + '\n')
        print('CONFIGURED_FILES=' + str(report.get('configuredFiles', 'UNKNOWN')), flush=True)
        print('COMPILER_OPTIONS=' + json.dumps(report.get('compilerOptions', {}), sort_keys=True), flush=True)
        print('DIAGNOSTIC_COUNTS=' + json.dumps(report['diagnosticCounts'], sort_keys=True), flush=True)
        if status != 0:
            print('--- First 45 compiler-output lines ---', flush=True)
            for line in preview:
                print(line, flush=True)
            if report['error']:
                print('ERROR=' + report['error'], flush=True)
        print('COMPILER_EXIT_CODE=' + str(report.get('compilerExitCode', status)), flush=True)
        print('FULL_LOG=' + str(log) + '\nRESULTS_FILE=' + str(result_path), flush=True)
        print('TRACKED_SOURCE_AND_CHECKED_METADATA_UNCHANGED=' + ('YES' if report['trackedSourceAndCheckedMetadataUnchanged'] else 'NO'), flush=True)
        print('APPLICATION_START=NO\nDATABASE_OPERATIONS=NO\nINSTALL=NO\nFRONTEND_BUILD=NOT_RUN\nFULL_NPM_TEST=NOT_RUN\nPUSH=NO\nDEPLOY=NO', flush=True)
        print('STATUS=' + report['status'], flush=True)
    return report, status

if __name__ == '__main__':
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Run the compiler-only check; never starts MMHB')
    args = parser.parse_args()
    print('COMMAND=MMHB_TYPECHECK_CANDIDATE', flush=True)
    if not args.check:
        print('ACTION_REQUIRED=--check'); sys.exit(0)
    try:
        _, code = execute()
        sys.exit(0 if code == 0 else 1)
    except (Exception, KeyboardInterrupt) as exc:
        print('STOP=' + type(exc).__name__ + ':' + str(exc), flush=True)
        print('STATUS=TYPECHECK_PREFLIGHT_STOPPED', flush=True)
        sys.exit(1)
