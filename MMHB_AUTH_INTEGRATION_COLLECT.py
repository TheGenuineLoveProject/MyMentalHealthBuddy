#!/usr/bin/env python3
"""Export a bounded, committed MMHB authentication source set for review.
No installation, app execution, remote operation, or source edits.
Run: python3 -I MMHB_AUTH_INTEGRATION_COLLECT.py
"""
from __future__ import annotations
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys

ROOT = Path('/home/runner/workspace/.local/mmhb-candidates/a4-63ff8372')
EXPECTED = '63ff8372d07368a5434c11ff58bdf87bb468449d'
OUTPUT = Path('/home/runner/workspace/MMHB_AUTH_INTEGRATION_SOURCE.txt')
FILES = (
    'server/app.mjs',
    'server/replit_integrations/auth/storage.mjs',
    'server/replit_integrations/auth/index.mjs',
    'server/routes/auth.mjs',
    'server/services/refreshTokens.service.mjs',
    'client/src/context/AuthContext.jsx',
    'client/src/api/fetchWithAuth.js',
    'scripts/security/verify-auth-session-contracts.mjs',
    'package.json',
)
MAX_FILE = 2 * 1024 * 1024
MAX_TOTAL = 12 * 1024 * 1024
CREDENTIAL = re.compile(
    r'-----BEGIN (?:(?:RSA|EC|OPENSSH|DSA) )?PRIVATE KEY-----|'
    r'\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}|'
    r'\bgh[pousr]_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{30,}|'
    r'\bAKIA[A-Z0-9]{16}\b|\bsk_(?:live|test)_[A-Za-z0-9]{16,}|'
    r'(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?)://[^\s\'\"/:]+:[^\s\'\"@]+@'
)

class Stop(RuntimeError):
    pass

def fail(message: str) -> None:
    raise Stop(message)

def regular_bytes(p: Path, cap: int = MAX_FILE) -> bytes:
    for item in (p, *p.parents):
        if item.is_symlink():
            fail('SYMLINK_PATH_REFUSED')
    fd = os.open(p, os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0))
    try:
        s = os.fstat(fd)
        if not stat.S_ISREG(s.st_mode) or s.st_size > cap:
            fail('FILE_TYPE_OR_SIZE_REFUSED')
        with os.fdopen(fd, 'rb', closefd=False) as stream:
            data = stream.read(cap + 1)
        if len(data) > cap:
            fail('FILE_GREW_DURING_READ')
        return data
    finally:
        os.close(fd)

def collect(root: Path, expected: str, output: Path, files: tuple[str,...] = FILES) -> dict:
    root = root.absolute()
    if not re.fullmatch(r'[0-9a-f]{40}', expected):
        fail('INVALID_EXPECTED_COMMIT')
    if root.is_symlink() or root.resolve() != root or not root.is_dir():
        fail('CANDIDATE_PATH_MISSING_OR_SYMLINKED')
    git = shutil.which('git')
    if not git:
        fail('GIT_NOT_FOUND')
    env = {
        'PATH': os.environ.get('PATH', '/usr/bin:/bin'),
        'LANG': 'C', 'LC_ALL': 'C',
        'GIT_CONFIG_NOSYSTEM': '1', 'GIT_CONFIG_GLOBAL': os.devnull,
        'GIT_OPTIONAL_LOCKS': '0', 'GIT_NO_LAZY_FETCH': '1',
        'GIT_TERMINAL_PROMPT': '0', 'GIT_PAGER': 'cat',
    }
    def run(*args: str) -> bytes:
        p = subprocess.run([git, '--no-optional-locks', '-c', 'core.fsmonitor=false',
                            '-c', 'core.hooksPath=/dev/null', '-c', 'gc.auto=0',
                            '-C', str(root), *args], env=env, stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE, timeout=30, check=False)
        if p.returncode:
            fail('GIT_READ_FAILED:' + args[0])
        if len(p.stdout) > MAX_FILE + 4096:
            fail('GIT_OUTPUT_LIMIT')
        return p.stdout
    if Path(run('rev-parse', '--show-toplevel').decode().strip()).resolve() != root:
        fail('WRONG_REPOSITORY_ROOT')
    def head() -> str:
        return run('rev-parse', '--verify', 'HEAD').decode().strip()
    if head() != expected:
        fail('CANDIDATE_COMMIT_CHANGED')
    entries = []
    reads = {}
    total = 0
    for relative in files:
        if Path(relative).is_absolute() or any(p in ('', '.', '..') for p in relative.split('/')):
            fail('INVALID_ALLOWLIST_PATH')
        if any(part.startswith('.') for part in relative.split('/')):
            fail('HIDDEN_SOURCE_REFUSED')
        obj = expected + ':' + relative
        if run('cat-file', '-t', obj).strip() != b'blob':
            fail('NOT_A_BLOB:' + relative)
        size = int(run('cat-file', '-s', obj))
        if size > MAX_FILE:
            fail('SOURCE_SIZE_LIMIT:' + relative)
        raw = run('cat-file', 'blob', obj)
        if len(raw) != size:
            fail('OBJECT_READ_MISMATCH:' + relative)
        disk = regular_bytes(root / relative)
        if disk != raw:
            fail('WORKING_FILE_DIFFERS_FROM_COMMIT:' + relative)
        try:
            text = raw.decode('utf-8')
        except UnicodeDecodeError:
            fail('NON_UTF8_SOURCE:' + relative)
        if '\x00' in text:
            fail('BINARY_SOURCE_REFUSED:' + relative)
        if CREDENTIAL.search(text):
            fail('POSSIBLE_CREDENTIAL_REVIEW_REQUIRED:' + relative)
        total += size
        if total > MAX_TOTAL:
            fail('SOURCE_TOTAL_LIMIT')
        digest = hashlib.sha256(raw).hexdigest()
        reads[relative] = digest
        entries.append({'path': relative, 'bytes': size, 'sha256': digest, 'content': text})
    for relative, digest in reads.items():
        if hashlib.sha256(regular_bytes(root/relative)).hexdigest() != digest:
            fail('SOURCE_CHANGED_DURING_COLLECTION:' + relative)
    if head() != expected:
        fail('COMMIT_MOVED_DURING_COLLECTION')
    header = {'schema':'MMHB_AUTH_INTEGRATION_SOURCE_V1', 'project':'MyMentalHealthBuddy',
              'commit':expected, 'scope':'Exact allowlisted committed files; no .env or cookie files.',
              'credentialScan':'Heuristic guard only; not a comprehensive secret audit.',
              'files':[ {k:v for k,v in e.items() if k!='content'} for e in entries]}
    sections = [json.dumps(header, indent=2)]
    for e in entries:
        sections.append('\n--- ' + e['path'] + ' ---\n' + e['content'])
    payload = ('\n'.join(sections) + '\n').encode('utf-8')
    if len(payload)>MAX_TOTAL:
        fail('REPORT_SIZE_LIMIT')
    for p in (output.parent, *output.parent.parents):
        if p.is_symlink(): fail('OUTPUT_PARENT_SYMLINK')
    mode='CREATED'
    if output.exists() or output.is_symlink():
        if regular_bytes(output,MAX_TOTAL)!=payload:
            fail('EXISTING_REPORT_DIFFERS')
        mode='ALREADY_IDENTICAL'
    else:
        fd = os.open(output,os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os,'O_NOFOLLOW',0),0o600)
        try:
            with os.fdopen(fd,'wb',closefd=False) as f:
                f.write(payload);f.flush();os.fsync(fd)
        finally:
            os.close(fd)
    return {'COMMAND':'MMHB_AUTH_INTEGRATION_COLLECT','CANDIDATE_COMMIT':expected,
            'FILES_VERIFIED_AGAINST_COMMIT':len(entries),'REPORT':str(output),
            'REPORT_SHA256':hashlib.sha256(payload).hexdigest(),'REPORT_WRITE':mode,
            'SOURCE_EDITS':'NO','APPLICATION_START':'NO','NETWORK_REQUESTS':'NO',
            'INSTALL':'NO','PUSH':'NO','DEPLOY':'NO','STATUS':'AUTH_INTEGRATION_SOURCE_READY'}

if __name__=='__main__':
    try:
        for k,v in collect(ROOT,EXPECTED,OUTPUT).items():
            print(f'{k}={v}')
    except (Stop,OSError,ValueError,subprocess.TimeoutExpired) as exc:
        if isinstance(exc,Stop):
            message=str(exc)
        else:
            message=type(exc).__name__
        print('STOP='+message)
        print('STATUS=COLLECTION_STOPPED')
        sys.exit(1)
