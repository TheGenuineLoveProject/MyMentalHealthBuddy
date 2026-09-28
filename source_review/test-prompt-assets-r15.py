"""Focused tests of the actual R15 driver with disposable inert Git repositories.

Only expected workspace/head/Node, the 41 baseline pins, prior report paths and
retained report hashes are transplanted. The embedded policy, 22 original assets,
reviewed prompt engine, loader source and real loader child remain unchanged.
Fault injection intercepts checkpoint writes in the local fixture process; it
never modifies the production driver. No application, build, dependency install,
network, AI request or database is run.
"""
from pathlib import Path
import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
DRIVER = HERE / 'prompt-assets-driver-r15.mjs'
BASE = DRIVER.read_text()
NODE_VERSION = subprocess.check_output(['node', '--version'], text=True).strip()
POLICY = json.loads(re.search(r'const REPAIR_POLICY = (\{.*?\n\});', BASE, re.S).group(1))
NAMES = json.loads(re.search(r'const PINS = (\{.*?\n\});', BASE, re.S).group(1))
MODULE_FILE = 'server/lib/promptEngine.mjs'
MODULE_SHA = 'fbbd43eaab399b029b5d976508da8f1e055e25d69fd2ee65551e23d102363170'
FIRST = POLICY['replacements'][0]['file']
LAST = POLICY['replacements'][-1]['file']
UNCHANGED = next(x['file'] for x in POLICY['assets'] if x['action'] == 'COPY_UNCHANGED')
SECRET = 'MMHB_FIXTURE_SECRET_NEVER_PRINT'
UNKNOWN = 'CONCURRENT_UNKNOWN_EDIT_PRESERVE'
COUNT = 0
assert len(NAMES) == 41 and len(POLICY['assets']) == 22 and len(POLICY['replacements']) == 6


def sha(value):
    return hashlib.sha256(value).hexdigest()


def js(value):
    return json.dumps(value, separators=(',', ':'), ensure_ascii=False)


def write(root, name, value, mode=0o644):
    file = root / name
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_bytes(value if isinstance(value, bytes) else value.encode())
    file.chmod(mode)
    return file


def git(root, *args):
    return subprocess.check_output(['git', *args], cwd=root, text=True, stderr=subprocess.DEVNULL).strip()


def snapshot(root):
    result = {}
    for file in sorted(root.rglob('*')):
        rel = file.relative_to(root)
        if '.git' in rel.parts:
            continue
        if file.is_symlink():
            result[str(rel)] = ('LINK', os.readlink(file))
        elif file.is_file():
            result[str(rel)] = (sha(file.read_bytes()), file.stat().st_mode)
    return result


def setup():
    root = Path(tempfile.mkdtemp(prefix='mmhb-r15-driver-fixture-'))
    prior = Path(tempfile.mkdtemp(prefix='mmhb-r15-fixture-prior-'))
    r14 = Path(tempfile.mkdtemp(prefix='mmhb-r15-fixture-r14-'))
    for file in NAMES:
        write(root, file, '{}\n' if file.endswith('.json') else '// INERT_FIXTURE\n')
    write(root, 'package.json', js({'name': 'mmhb-inert-fixture', 'type': 'module'}))
    write(root, 'server/app.mjs', "throw Error('APPLICATION_MUST_NOT_EXECUTE');\n")
    write(root, '.gitignore', 'node_modules/\ndist/\nclient/dist/\nbundle-report.html\n.env*\n')
    write(root, '.env.fixture', SECRET)
    write(root, 'untracked.txt', 'USER_WORK_PRESERVE\n')
    for asset in POLICY['assets']:
        raw = (HERE / ('r14-assets-' + asset['file'].replace('/', '-'))).read_bytes()
        assert sha(raw) == asset['expectedSha256'] and len(raw) == asset['expectedBytes']
        write(root, asset['file'], raw)
    module = (HERE / 'r14-assets-server-lib-promptEngine.mjs').read_bytes()
    assert sha(module) == MODULE_SHA
    write(root, MODULE_FILE, module)
    candidate = prior / 'candidate'
    write(candidate, 'server.mjs', "throw Error('CANDIDATE_MUST_NOT_EXECUTE');\n", 0o600)
    write(candidate, 'schema.canonical.sql', '-- DATABASE_MUST_NOT_EXECUTE\n', 0o600)
    write(candidate, 'client/dist/index.html', '<html>INERT_CORE_FIXTURE</html>\n', 0o600)
    write(candidate, 'client/dist/assets/inert.js', "throw Error('BROWSER_MUST_NOT_EXECUTE');\n", 0o600)
    rows = [{'file': str(p.relative_to(candidate)), 'sha256': sha(p.read_bytes()),
             'bytes': p.stat().st_size, 'mode': p.stat().st_mode}
            for p in sorted(candidate.rglob('*')) if p.is_file()]
    assembly = {'rows': rows, 'bytes': sum(r['bytes'] for r in rows)}
    r13 = {'status': 'CORE_CANDIDATE_ASSEMBLED_NATIVE_PASS_NOT_RELEASE',
           'preservation': 'OBSERVED_INPUTS_AND_CANDIDATES_PRESERVED'}
    evidence = {'status': 'RUNTIME_CONTRACT_EVIDENCE_COMPLETE',
                'preservation': 'OBSERVED_INPUTS_AND_R13_CANDIDATE_PRESERVED',
                'sourceReviews': [{'file': MODULE_FILE, 'current': {'sha256': MODULE_SHA},
                                   'listedCompilerInput': True, 'retainedInputIdentityMatches': True}]}
    write(prior, 'assembly-manifest-before.json', js(assembly), 0o600)
    write(prior, 'assembly-evidence.json', js(r13), 0o600)
    write(r14, 'runtime-contract-evidence.json', js(evidence), 0o600)
    git(root, 'init', '-q', '-b', 'integration')
    git(root, 'add', '.')
    git(root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
        '-c', 'commit.gpgsign=false', 'commit', '-qm', 'inert R15 fixture')
    write(root, 'untracked.txt', 'PRESERVE_EXISTING_UNCOMMITTED_WORK\n')
    return {'root': root, 'prior': prior, 'r14': r14, 'candidate': candidate,
            'assembly': assembly, 'evidence': evidence}


def interception(ctx, mode):
    fail = "throw Object.assign(new Error('INJECTED_FAILURE'), {gate:'FIXTURE_INJECTED_FAILURE'});"
    cases = {
        'child_failure': ("String(file).endsWith('/reviewed-promptEngine.mjs')",
                          "originalWrite.call(fs,file,'// changed reviewed module');"),
        'first_write_failure': ("String(file).endsWith('/content-step-1.json')", fail),
        'last_write_failure': ("String(file).endsWith('/content-step-6.json')", fail),
        'concurrent_repair_edit': ("String(file).endsWith('/content-step-1.json')",
            "originalWrite.call(fs,path.join(fixtureRoot,fixtureFirst),fixtureUnknown);" + fail),
        'worktree_drift': ("String(file).endsWith('/content-step-6.json')",
            "originalWrite.call(fs,path.join(fixtureRoot,'untracked.txt'),fixtureUnknown);"),
        'ignored_asset_drift': ("String(file).endsWith('/content-step-6.json')",
            "originalWrite.call(fs,path.join(fixtureRoot,fixtureUnchanged),fixtureUnknown);"),
        'retained_drift': ("String(file).endsWith('/content-step-6.json')",
            "originalWrite.call(fs,path.join(fixtureR14,'runtime-contract-evidence.json'),'{}');"),
        'private_candidate_drift': ("String(file).endsWith('/content-step-6.json')",
            "originalWrite.call(fs,path.join(path.dirname(file),'candidate/server.mjs'),fixtureUnknown);"),
    }
    condition, action = cases.get(mode, ('false', ''))
    before_write = "if (String(file).endsWith('/prompt-asset-repair-evidence.json')) " + fail if mode == 'report_write_failure' else ''
    return '''
const fixtureRoot=__ROOT__,fixtureR14=__R14__,fixtureFirst=__FIRST__,fixtureUnchanged=__UNCHANGED__,fixtureUnknown=__UNKNOWN__;
const originalWrite=fs.writeFileSync,originalRead=fs.readFileSync,originalOpen=fs.openSync;
fs.readFileSync=function(file,...args){if(String(file).endsWith('/.env.fixture'))throw Error('SECRET_READ_FORBIDDEN');return originalRead.call(this,file,...args);};
fs.openSync=function(file,...args){if(String(file).endsWith('/.env.fixture'))throw Error('SECRET_READ_FORBIDDEN');return originalOpen.call(this,file,...args);};
fs.writeFileSync=function(file,...args){__BEFORE_WRITE__
const value=originalWrite.call(this,file,...args);if(__CONDITION__){__ACTION__}return value;};
'''.replace('__ROOT__', js(str(ctx['root']))).replace('__R14__', js(str(ctx['r14']))).replace('__FIRST__', js(FIRST)).replace('__UNCHANGED__', js(UNCHANGED)).replace('__UNKNOWN__', js(UNKNOWN)).replace('__BEFORE_WRITE__', before_write).replace('__CONDITION__', condition).replace('__ACTION__', action)


def adapted(ctx, mode):
    src = BASE
    pins = {file: sha((ctx['root'] / file).read_bytes()) for file in NAMES}
    src, count = re.subn(r'const PINS = \{.*?\n\};', lambda _: 'const PINS = ' + js(pins) + ';', src, count=1, flags=re.S)
    assert count == 1
    constants = {'EXPECTED_ROOT': str(ctx['root']), 'EXPECTED_HEAD': git(ctx['root'], 'rev-parse', 'HEAD'),
                 'EXPECTED_NODE': NODE_VERSION, 'PRIOR_REPORT': str(ctx['prior']), 'R14_REPORT': str(ctx['r14']),
                 'EXPECTED_ASSEMBLY_MANIFEST': sha(js(ctx['assembly']).encode()),
                 'EXPECTED_R14_REPORT': sha((ctx['r14'] / 'runtime-contract-evidence.json').read_bytes())}
    for name, value in constants.items():
        src, count = re.subn(r'const ' + name + r" = '[^']*';", lambda _: 'const ' + name + ' = ' + js(value) + ';', src, count=1)
        assert count == 1, name
    src = src.replace("const ROOT = fs.realpathSync('.');", "const ROOT = fs.realpathSync('.');\n" + interception(ctx, mode), 1)
    return src


def gates(result):
    found = set()
    def visit(item):
        if isinstance(item, dict):
            if isinstance(item.get('gate'), str): found.add(item['gate'])
            for v in item.values(): visit(v)
        elif isinstance(item, list):
            for v in item: visit(v)
    visit(result)
    return found


def run(label, mode='success', prepare=None, tamper=None, expected_gate=None, expected_changes=None,
        expected_remaining=0, child_started=None, inspect=None):
    global COUNT
    ctx = setup()
    report = None
    try:
        if prepare: prepare(ctx)
        src = adapted(ctx, mode)
        if tamper: tamper(ctx)
        before = snapshot(ctx['root'])
        prior_before = snapshot(ctx['candidate'])
        git_before = (git(ctx['root'], 'rev-parse', 'HEAD'), git(ctx['root'], 'ls-files', '--stage'),
                      sha((ctx['root'] / '.git/index').read_bytes()))
        env = {**os.environ, 'NODE_OPTIONS': '', 'NODE_DISABLE_COMPILE_CACHE': '1', 'GIT_OPTIONAL_LOCKS': '0',
               'DATABASE_URL': SECRET, 'OPENAI_API_KEY': SECRET, 'NODE_PG_FORCE_NATIVE': SECRET, 'HEAL_AUTO_ENABLED': 'true'}
        execution = subprocess.run(['node', '--input-type=module'], input=src, cwd=ctx['root'],
                                   capture_output=True, text=True, env=env, timeout=40)
        output = execution.stdout + execution.stderr
        for marker in (SECRET, UNKNOWN, 'APPLICATION_MUST_NOT_EXECUTE', 'CANDIDATE_MUST_NOT_EXECUTE',
                       'DATABASE_MUST_NOT_EXECUTE', 'BROWSER_MUST_NOT_EXECUTE', 'SECRET_READ_FORBIDDEN'):
            assert marker not in output, (label, 'unexpected execution/raw content leak', marker)
        start = execution.stdout.find('\n{')
        assert start >= 0, (label, 'no result JSON', output[-2000:])
        result, _ = json.JSONDecoder().raw_decode(execution.stdout[start + 1:])
        reports = re.findall(r'^REPORT_DIRECTORY=(.+)$', execution.stdout, re.M)
        assert reports, (label, 'missing report path')
        report = Path(reports[-1])
        if expected_gate:
            assert execution.returncode == 1 and result['status'] == 'PROMPT_ASSET_REPAIR_FAILED', (label, result)
            assert expected_gate in gates(result), (label, 'wrong failure', gates(result))
            assert result['sourceEditsRemaining'] == expected_remaining, (label, result)
        else:
            assert execution.returncode == 0 and result['status'] == 'PROMPT_ASSETS_REPAIRED_AND_LOAD_PASS_NOT_RELEASE', (label, result)
            assert result['sourceEditsRemaining'] == 6
            assert result['files'] == len(ctx['assembly']['rows']) + 22
            assert result['promptAssets'] == 22
            assert result['preservation'] == 'EXPECTED_SOURCE_CHANGES_AND_R13_PRESERVED'
            assert len(result['sourceContentEdits']) == 6
            assert result['loader']['status'] == 'PROMPT_ASSET_LOAD_PASS'
            assert result['loader']['moduleLoads'] == 18 and result['loader']['sourceReads'] == 20
            assert result['loader']['registryChecks'] == 2 and result['loader']['denialChecks'] == 35
            assert result['loader']['assetsChecked'] == 22
            assert result['loader']['scope']['applicationStarted'] is False
            assert result['loader']['scope']['aiRequests'] == 0
            assert result['rollback']['attempted'] is False
            for repair in POLICY['replacements']:
                file = ctx['root'] / repair['file']
                assert file.read_text() == repair['newText']
                assert sha(file.read_bytes()) == repair['resultSha256']
                assert file.stat().st_mode == before[repair['file']][1]
                assert (report / 'backups' / repair['file']).read_text() == repair['oldText']
            for asset in POLICY['assets']:
                file = report / 'candidate' / asset['file']
                assert sha(file.read_bytes()) == asset['resultSha256'] and file.stat().st_size == asset['resultBytes']
                assert file.stat().st_mode & 0o777 == 0o600
            loader_at = output.find('GATE=ALL_18_PROMPT_MODULES_LOAD_FROM_CANDIDATE RESULT=PASS')
            mutation_at = output.find('GATE=SIX_EXACT_CONTENT_REPAIRS RESULT=PASS')
            assert 0 <= loader_at < mutation_at
        assert result['releaseReady'] is False and result['dependencyAlignment'] == 'PENDING'
        assert result['applicationRuntime'] == result['deployedArtifact'] == 'UNPROVEN'
        started = sum(p['started'] for p in result['processes'])
        if child_started is not None: assert started == child_started, (label, 'child count', started)
        after = snapshot(ctx['root'])
        changed = {name for name in set(before) | set(after) if before.get(name) != after.get(name)}
        expected = {r['file'] for r in POLICY['replacements']} if expected_changes is None and not expected_gate else set(expected_changes or [])
        assert changed == expected, (label, 'unexpected workspace changes', changed, expected)
        assert snapshot(ctx['candidate']) == prior_before, (label, 'R13 candidate changed')
        git_after = (git(ctx['root'], 'rev-parse', 'HEAD'), git(ctx['root'], 'ls-files', '--stage'),
                     sha((ctx['root'] / '.git/index').read_bytes()))
        assert git_before == git_after, (label, 'Git state mutation')
        assert not any('.mmhb-r15-' in str(p) for p in ctx['root'].rglob('*')), (label, 'temporary source leftover')
        assert report.stat().st_mode & 0o777 == 0o700
        evidence_file = report / 'prompt-asset-repair-evidence.json'
        if mode == 'report_write_failure':
            assert not evidence_file.exists() and result['evidenceWrite'] == 'FAILED'
        else:
            assert result['evidenceWrite'] == 'SAVED'
            assert json.loads(evidence_file.read_text()) == result
            assert evidence_file.stat().st_mode & 0o777 == 0o600
        if inspect: inspect(ctx, result, report)
        COUNT += 1
        print('CASE=' + label + ' RESULT=PASS', flush=True)
        return result
    finally:
        for key in ('root', 'prior', 'r14'): shutil.rmtree(ctx[key], ignore_errors=True)
        if report: shutil.rmtree(report, ignore_errors=True)


def differing_modes(ctx):
    for i, repair in enumerate(POLICY['replacements']):
        (ctx['root'] / repair['file']).chmod([0o600, 0o640, 0o644][i % 3])


def ignore_asset(ctx):
    git(ctx['root'], 'rm', '--cached', '--', UNCHANGED)
    with (ctx['root'] / '.gitignore').open('a') as file: file.write(UNCHANGED + '\n')
    git(ctx['root'], 'add', '.gitignore')
    git(ctx['root'], '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
        '-c', 'commit.gpgsign=false', 'commit', '-qm', 'fixture ignored selected asset')


def symlink_asset(ctx):
    file = ctx['root'] / FIRST
    file.unlink()
    file.symlink_to(ctx['root'] / UNCHANGED)


def inspect_unknown(ctx, result, report):
    assert (ctx['root'] / FIRST).read_text() == UNKNOWN
    assert result['rollback']['attempted'] is True and len(result['rollback']['conflicts']) >= 1
    assert 'ROLLBACK_CONCURRENT_EDIT_PRESERVED' in gates(result)


def inspect_rollback(count):
    def check(ctx, result, report):
        assert result['rollback']['attempted'] is True
        assert len(result['rollback']['restored']) == count and not result['rollback']['conflicts']
    return check


run('six_repairs_and_actual_18_module_loads', child_started=1)
run('source_file_modes_preserved', prepare=differing_modes, child_started=1)
run('selected_ignored_assets_preserved', prepare=ignore_asset, child_started=1)
run('source_special_modes_refused_before_child', prepare=lambda c: [(c['root'] / FIRST).chmod(0o6644), (c['root'] / LAST).chmod(0o1644)],
    expected_gate='SOURCE_SPECIAL_MODE_UNSUPPORTED', child_started=0)
run('wrong_source_bytes_refused_before_child', tamper=lambda c: write(c['root'], FIRST, 'WRONG_SOURCE'),
    expected_gate='SOURCE_IDENTITY_MISMATCH', child_started=0)
run('missing_asset_refused_before_child', tamper=lambda c: (c['root'] / FIRST).unlink(),
    expected_gate='SOURCE_IDENTITY_MISMATCH', child_started=0)
run('source_symlink_refused_before_child', tamper=symlink_asset, expected_gate='INPUT_SYMLINK', child_started=0)
run('retained_candidate_drift_refused_before_child', tamper=lambda c: write(c['candidate'], 'server.mjs', 'STALE_CORE', 0o600),
    expected_gate='R13_CANDIDATE_CHANGED', child_started=0)
run('r14_report_hash_refused_before_child', tamper=lambda c: write(c['r14'], 'runtime-contract-evidence.json', '{}', 0o600),
    expected_gate='R14_REPORT_PIN', child_started=0)
run('real_child_failure_keeps_source_unchanged', mode='child_failure', expected_gate='PROMPT_ASSET_LOADER_FAILED', child_started=1)
run('first_source_step_failure_rolls_back', mode='first_write_failure', expected_gate='FIXTURE_INJECTED_FAILURE', child_started=1,
    inspect=inspect_rollback(1))
run('last_source_step_failure_rolls_back', mode='last_write_failure', expected_gate='FIXTURE_INJECTED_FAILURE', child_started=1,
    inspect=inspect_rollback(6))
run('concurrent_unknown_source_edit_preserved', mode='concurrent_repair_edit', expected_gate='ROLLBACK_CONCURRENT_EDIT_PRESERVED',
    expected_remaining=1, expected_changes=[FIRST], child_started=1, inspect=inspect_unknown)
run('unrelated_worktree_drift_causes_guarded_rollback', mode='worktree_drift', expected_gate='UNEXPECTED_GIT_OR_WORKTREE_CHANGE',
    expected_changes=['untracked.txt'], child_started=1, inspect=inspect_rollback(6))
run('final_report_failure_rolls_back_six_sources', mode='report_write_failure', expected_gate='FIXTURE_INJECTED_FAILURE',
    child_started=1, inspect=inspect_rollback(6))
run('ignored_selected_asset_drift_causes_guarded_rollback', prepare=ignore_asset, mode='ignored_asset_drift',
    expected_gate='SELECTED_SOURCE_NOT_EXPECTED', expected_changes=[UNCHANGED], child_started=1, inspect=inspect_rollback(6))
run('retained_report_drift_causes_guarded_rollback', mode='retained_drift', expected_gate='RETAINED_REPORT_NOT_PRESERVED',
    child_started=1, inspect=inspect_rollback(6))
run('private_candidate_drift_causes_guarded_rollback', mode='private_candidate_drift', expected_gate='R15_CANDIDATE_NOT_PRESERVED',
    child_started=1, inspect=inspect_rollback(6))
print('FIXTURES=' + str(COUNT) + ' RESULT=PASS')
print('DRIVER_SHA256=' + sha(BASE.encode()))
print('POLICY_SHA256=' + sha(js(POLICY).encode()))
print('SCOPE=ACTUAL_POLICY_AND_REVIEWED_LOADER_REAL_CHILD_IN_DISPOSABLE_INERT_CORE_FIXTURES_NOT_REPLIT_OR_APPLICATION_QUALIFICATION')
