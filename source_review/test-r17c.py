"""R17C diagnostic fixtures.

Create a genuine R17B preservation failure with 42 unrelated Git-observed
changes using synthetic compiler/native packages and the actual prompt loader.
Then run the real R17C diagnostic on that saved evidence. No npm, application,
database or network operation is requested. Existing files are observed, never
restored by the diagnostic; test-only mutations are explicit below.
"""
from pathlib import Path
import base64, contextlib, importlib.util, json, os, re, shutil, subprocess, tempfile

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('fixture17b', HERE / 'test-fresh-candidate-r17b.py')
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)
f = b.f
RESULTS = []


def replace_const(src, name, value):
    src, count = re.subn(r'const ' + name + r'\s*=\s*[^;]+;',
                         lambda _: 'const ' + name + ' = ' + f.j(value) + ';', src, count=1)
    assert count == 1, name
    return src


def replace_map(src, name, value):
    src, count = re.subn(r'const ' + name + r' = \{.*?\n\};',
                         lambda _: 'const ' + name + ' = ' + f.j(value) + ';',
                         src, count=1, flags=re.S)
    assert count == 1, name
    return src


def all_files(base):
    return {str(p.relative_to(base)): (f.sha(p.read_bytes()), p.stat().st_mode & 0o777)
            for p in base.rglob('*') if p.is_file() and not p.is_symlink()}


def seeded_failure(root, tmp, mode, cleanup):
    f.front.VITE_STUB = b.ORIGINAL_VITE
    stage = f.build_fixture(root, 'success')
    names = ['unrelated/wip-%02d.txt' % i for i in range(42)]
    if mode == 'sensitive_name':
        names[-1] = 'unrelated/.env.PRIVATE_PATH_SECRET'
    for name in names:
        f.write(root, name, 'BEFORE_WORK\n')
    if mode == 'sensitive_name':
        f.git(root, 'add', '-f', names[-1])
    changes = ["fs.writeFileSync(" + f.j(str(root / name)) + ",'AFTER_WORK');"
               for name in names]
    if mode == 'history_delete':
        changes[-1] = "fs.unlinkSync(" + f.j(str(root / names[-1])) + ');'
    if mode == 'history_visibility':
        changes[-1] = "fs.appendFileSync(" + f.j(str(root / '.git/info/exclude')) + ",'/" + names[-1] + "\\n');"
    source = b.adapt((HERE / 'fresh-candidate-driver-r17b.mjs').read_text(), root, 'success')
    helpers = json.loads(re.search(r'const HELPERS = (\{[^\n]+\});', source).group(1))
    native = base64.b64decode(helpers['NATIVE']['b64']).decode()
    native = native.replace("fs.writeFileSync(path.join(report,'native-smoke-evidence.json'),",
                            '\n'.join(changes) + "\nfs.writeFileSync(path.join(report,'native-smoke-evidence.json'),")
    helpers['NATIVE'] = {'sha256': f.sha(native.encode()), 'b64': base64.b64encode(native.encode()).decode()}
    source = re.sub(r'const HELPERS = \{[^\n]+\};',
                    lambda _: 'const HELPERS = ' + f.j(helpers) + ';', source, count=1)
    original = "fs.mkdtempSync(path.join(evidenceRoot,'r17b-'))"
    replacement = "(()=>{const p=path.join(evidenceRoot,'r17b-q6rzGy');fs.mkdirSync(p,{mode:0o700});return p;})()"
    assert source.count(original) == 1
    source = source.replace(original, replacement)
    script = f.write(tmp, 'r17b-seed.mjs', source)
    completed = subprocess.run([f.NODE, str(script)], cwd=root,
                               env={**os.environ, 'OPENAI_API_KEY': f.SECRET, 'DATABASE_URL': f.SECRET},
                               capture_output=True, text=True, timeout=35)
    report = root / '.mmhb-release-evidence/r17b-q6rzGy'
    evidence = json.loads((report / 'fresh-candidate-evidence.json').read_text())
    disposable = evidence.get('disposableBuildRoot')
    if disposable:
        cleanup.callback(shutil.rmtree, disposable, True)
    assert completed.returncode == 1, (mode, completed.stdout, completed.stderr)
    assert evidence['failure']['gate'] == 'WORKTREE_PRESERVATION', (mode, evidence['failure'])
    assert evidence['preservation']['changedFileCount'] == 42, (mode, evidence['preservation'])
    assert len(evidence['preservation']['changes']) == 40
    assert evidence['native']['status'] == 'NATIVE_CANDIDATE_SMOKE_PASS'
    assert evidence['prompt']['moduleLoads'] == 18
    assert all(p['exitCode'] == 0 for p in evidence['processes'])
    assert f.SECRET not in completed.stdout + completed.stderr
    pins = {name: f.sha((root / name).read_bytes()) for name in f.PIN_NAMES}
    assets = {name: f.sha((root / name).read_bytes()) for name in f.ASSET_NAMES}
    return stage, report, evidence, names, pins, assets


def adapt_diagnostic(source, root, evidence, pins, assets):
    for name, value in [('EXPECTED_ROOT', str(root)), ('EXPECTED_HEAD', f.git(root, 'rev-parse', 'HEAD')),
                        ('EXPECTED_NODE', f.VERSION), ('OBSERVED_SERVER_SHA', evidence['server']['bundleSha256']),
                        ('OBSERVED_CANDIDATE_SHA', evidence['candidate']['manifestSha256']),
                        ('OBSERVED_FRONTEND_SHA', evidence['frontend']['manifestSha256']),
                        ('OBSERVED_CHANGED_FILES', 42),
                        ('OBSERVED_CANDIDATE_FILES', evidence['candidate']['files']),
                        ('OBSERVED_CANDIDATE_BYTES', evidence['candidate']['bytes'])]:
        source = replace_const(source, name, value)
    source = replace_map(source, 'PINS', pins)
    source = replace_map(source, 'ASSET_PINS', assets)
    return source


def mutate_json(file, fn):
    value = json.loads(file.read_text())
    fn(value)
    file.write_text(json.dumps(value, indent=2) + '\n')


def child_guard(tmp, concurrent_path=None):
    """Instrument the diagnostic process: only synchronous read-only Git calls."""
    trace = tmp / 'r17c-process-attempts.jsonl'
    source = """import cp from 'node:child_process';import fs from 'node:fs';
import path from 'node:path';import {syncBuiltinESMExports} from 'node:module';
const trace=__TRACE__, original=cp.execFileSync;let observations=0;
for(const name of ['spawn','spawnSync','exec','execSync','execFile','fork']){
 cp[name]=(...args)=>{fs.appendFileSync(trace,JSON.stringify({name,allowed:false})+'\\n');throw Error('UNEXPECTED_CHILD_PROCESS');};
}
cp.execFileSync=(file,args,options)=>{
 if(args?.includes('--cached')&&args?.includes('--others')&&++observations===2){__CONCURRENT__}
 let i=0;while(args?.[i]==='-c')i+=2;
 const command=args?.[i], allowed=path.basename(String(file))==='git'
  && ['rev-parse','branch','ls-files','check-ignore'].includes(command)
  &&(command!=='branch'||args[i+1]==='--show-current');
 fs.appendFileSync(trace,JSON.stringify({name:'execFileSync',command,allowed})+'\\n');
 if(!allowed)throw Error('UNEXPECTED_CHILD_PROCESS');
 return original(file,args,options);
};syncBuiltinESMExports();
""".replace('__TRACE__', f.j(str(trace))).replace('__CONCURRENT__',
    'fs.writeFileSync(' + f.j(str(concurrent_path)) + ",'EDIT_DURING_R17C_RETAINED');" if concurrent_path else '')
    return f.write(tmp, 'r17c-process-guard.mjs', source), trace


def run(mode):
    with tempfile.TemporaryDirectory(prefix='mmhb-r17c-fixture-') as tmp_name, contextlib.ExitStack() as cleanup:
        tmp = Path(tmp_name)
        root = tmp / 'workspace'
        root.mkdir()
        stage, prior, evidence, names, pins, assets = seeded_failure(root, tmp, mode, cleanup)
        source = adapt_diagnostic((HERE / 'preservation-diagnostic-driver-r17c.mjs').read_text(), root, evidence, pins, assets)
        if mode == 'source_drift':
            f.write(root, 'client/main.jsx', 'USER_SOURCE_EDIT_AFTER_R17B')
        elif mode == 'pin_drift':
            f.write(root, 'server/routes/auth.mjs', 'USER_AUTH_EDIT_AFTER_R17B')
        elif mode == 'candidate_drift':
            f.write(prior, 'candidate/server.mjs', 'CHANGED_RETAINED_CANDIDATE')
        elif mode == 'candidate_symlink':
            (prior / 'candidate/server.mjs').unlink()
            (prior / 'candidate/server.mjs').symlink_to(tmp / 'outside-candidate.mjs')
            f.write(tmp, 'outside-candidate.mjs', 'PRIVATE_EXTERNAL_CANDIDATE_BYTES')
        elif mode == 'retained_dependency_drift':
            f.write(prior, 'build-input/node_modules/resend/index.js', 'CHANGED_RETAINED_DEPENDENCY')
        elif mode == 'r16e_dependency_drift':
            f.write(stage, 'node_modules/resend/index.js', 'CHANGED_R16E_DEPENDENCY')
        elif mode == 'r16e_package_drift':
            f.write(stage, 'package.json', (stage / 'package.json').read_text() + '\n')
        elif mode == 'manifest_package_row_replaced':
            # Keep the total row count and self-hash valid while substituting an
            # unexpected extra root file for the required package.json row.
            f.write(prior, 'build-input/package-alias.json', (prior / 'build-input/package.json').read_bytes())
            def replace_package_row(value):
                row = next(row for row in value['rows'] if row['file'] == 'package.json')
                row['file'] = 'package-alias.json'
                value['rows'].sort(key=lambda row: row['file'])
                value['manifestSha256'] = f.sha(f.j(value['rows']).encode())
            mutate_json(prior / 'build-input-manifest.json', replace_package_row)
        elif mode == 'current_snapshot_oversized':
            # A tracked, sparse file exceeds snapshot's 256MiB per-file limit.
            # It is unrelated to compiled source, so historical evidence and
            # candidate inspection should remain available to the user.
            with (root / 'user-work.txt').open('wb') as handle:
                handle.truncate(256 * 1024**2 + 1)
        elif mode == 'absent_tmp':
            shutil.rmtree(evidence['disposableBuildRoot'])
        elif mode == 'history_hash_inconsistent':
            mutate_json(prior / 'git-before.json', lambda v: v.__setitem__('worktree', '0' * 64))
        elif mode == 'history_duplicate':
            def duplicate(v):
                v['records'].append(v['records'][0])
                v['files'] = len(v['records'])
                v['worktree'] = f.sha(f.j(v['records']).encode())
            mutate_json(prior / 'git-before.json', duplicate)
        elif mode == 'history_unknown_identity_field':
            def unknown_identity_field(value):
                next(row[1] for row in value['records'] if row[0] == names[0])['unrecognizedField'] = 'PRIVATE_METADATA_SECRET'
                value['worktree'] = f.sha(f.j(value['records']).encode())
            mutate_json(prior / 'git-before.json', unknown_identity_field)
        elif mode == 'unsafe_graph_id':
            mutate_json(prior / 'frontend-graph-review.json', lambda value: value['generatedModules'].append({
                'id': 'PRIVATE_METADATA_SECRET\nUNTRUSTED_INSTRUCTION',
                'classification': 'VITE_OPTIONAL_PEER', 'consumers': [], 'consumerRuntime': 'UNQUALIFIED'}))
        elif mode == 'unsafe_graph_status':
            mutate_json(prior / 'frontend-graph-review.json', lambda value: value.__setitem__('status', 'PRIVATE_METADATA_SECRET'))
        elif mode == 'unsafe_external_specifier':
            mutate_json(prior / 'external-runtime-requirements.json', lambda value: value.append({
                'kind': 'PACKAGE', 'candidatePackagePresent': False,
                'specifier': 'https://credentials:PRIVATE_METADATA_SECRET@example.invalid/a'}))
        elif mode == 'current_edit':
            f.write(root, names[-1], 'USER_CURRENT_EDIT_AFTER_R17B')
        script = f.write(tmp, 'r17c.mjs', source)
        guard, trace = child_guard(tmp, root / names[-1] if mode == 'concurrent_edit' else None)
        old_prior = all_files(prior)
        old_r16e = all_files(stage.parent)
        completed = subprocess.run([f.NODE, '--import', str(guard), str(script)], cwd=root,
                                   env={**os.environ, 'OPENAI_API_KEY': f.SECRET, 'DATABASE_URL': f.SECRET},
                                   capture_output=True, text=True, timeout=35)
        reports = list((root / '.mmhb-release-evidence').glob('r17c-*'))
        assert len(reports) == 1, (mode, completed.stdout, completed.stderr)
        diagnostic = json.loads((reports[0] / 'preservation-diagnostic-evidence.json').read_text())
        assert all_files(prior) == old_prior, mode + ': R17B evidence was modified'
        assert all_files(stage.parent) == old_r16e, mode + ': R16E evidence was modified'
        assert f.SECRET not in completed.stdout + completed.stderr
        assert 'PRIVATE_PATH_SECRET' not in completed.stdout + completed.stderr
        assert 'PRIVATE_EXTERNAL_CANDIDATE_BYTES' not in completed.stdout + completed.stderr
        assert 'PRIVATE_METADATA_SECRET' not in completed.stdout + completed.stderr
        attempts = [json.loads(line) for line in trace.read_text().splitlines()] if trace.exists() else []
        assert all(x['name'] == 'execFileSync' and x['allowed'] for x in attempts), (mode, attempts)
        if mode == 'concurrent_edit':
            assert (root / names[-1]).read_text() == 'EDIT_DURING_R17C_RETAINED'
        assert diagnostic['releaseReady'] is False
        assert diagnostic['applicationRuntime'] == diagnostic['deployedArtifact'] == 'UNPROVEN'
        fatal = {'history_hash_inconsistent': 'SNAPSHOT_SELF_CONSISTENCY',
                 'history_duplicate': 'SNAPSHOT_DUPLICATE_OR_ORDER',
                 'history_unknown_identity_field': 'SNAPSHOT_IDENTITY_SCHEMA',
                 'concurrent_edit': 'CURRENT_WORKTREE_CHANGED_DURING_DIAGNOSTIC'}
        if mode in fatal:
            assert completed.returncode == 1 and diagnostic['status'] == 'PRESERVATION_DIAGNOSTIC_FAILED'
            expected = {fatal[mode]}
            if mode == 'concurrent_edit':
                expected.add('SOURCE_CHANGED_DURING_DIAGNOSTIC')
            assert diagnostic['failure']['gate'] in expected, (mode, diagnostic.get('failure'))
        else:
            assert completed.returncode == 0 and diagnostic['status'] == 'PRESERVATION_DIAGNOSTIC_COMPLETE_REVIEW_REQUIRED', (mode, diagnostic.get('failure'))
            if mode == 'current_snapshot_oversized':
                assert diagnostic['currentGitBaseline']['status'] == 'INSPECTION_FAILED'
                assert diagnostic['currentGitBaseline']['gate'] == 'INPUT_FILE_LIMIT'
                assert diagnostic['sinceR17B']['status'] == 'CURRENT_SNAPSHOT_UNAVAILABLE'
                assert diagnostic['diagnosticPreservation']['status'] == 'READ_ARTIFACTS_STABLE_CURRENT_WORKTREE_UNQUALIFIED'
                assert (root / 'user-work.txt').stat().st_size == 256 * 1024**2 + 1
            else:
                assert diagnostic['diagnosticPreservation']['changedFileCount'] == 0
                assert diagnostic['diagnosticPreservation']['status'] == 'OBSERVED_CURRENT_WORKTREE_AND_READ_ARTIFACTS_STABLE'
        assert diagnostic['historicalRunStatus'] == 'FRESH_CANDIDATE_FAILED'
        assert diagnostic['historicalPreservation'] == 'FAILED_REVIEW_REQUIRED'
        if mode not in ['history_hash_inconsistent', 'history_duplicate', 'history_unknown_identity_field']:
            historical = diagnostic['historicalChanges']
            assert historical['changedFileCount'] == len(historical['changes']) == 42
            assert historical['summaryWasTruncated'] is True and historical['actor'] == 'UNKNOWN'
            assert {row['pathSha256'] for row in historical['changes']} == {f.sha(name.encode()) for name in names}
            assert not any(row['scope']['pinned'] or row['scope']['inRecordedSourceCopy'] for row in historical['changes'])
            assert diagnostic['frontend']['status'] == 'CURRENT_FILES_MATCH_RECORDED_MANIFEST'
            assert diagnostic['server']['status'] == 'CURRENT_SERVER_MATCHES_OBSERVED_SHA'
            if mode == 'unsafe_graph_status':
                assert diagnostic['recordedSmokesAndGraph']['status'] == 'INSPECTION_FAILED'
                assert diagnostic['recordedSmokesAndGraph']['gate'] == 'RECORDED_GRAPH_SCHEMA'
            else:
                assert diagnostic['recordedSmokesAndGraph']['reexecuted'] is False
                assert diagnostic['recordedSmokesAndGraph']['moduleLoads'] == 18
            expected_candidate = ('CURRENT_FILES_DIFFER_FROM_RECORDED_MANIFEST' if mode == 'candidate_drift'
                                  else 'INSPECTION_FAILED' if mode == 'candidate_symlink'
                                  else 'CURRENT_FILES_MATCH_RECORDED_MANIFEST')
            assert diagnostic['candidate']['status'] == expected_candidate
            if mode == 'candidate_symlink':
                assert diagnostic['candidate']['gate'] == 'SOURCE_OR_OUTPUT_SYMLINK'
                assert (prior / 'candidate/server.mjs').is_symlink()
            expected_retained = ('INSPECTION_FAILED' if mode in ['r16e_package_drift', 'manifest_package_row_replaced']
                                 else 'RETAINED_INPUT_DIFFERENCES_REQUIRE_REVIEW' if mode in ['retained_dependency_drift', 'r16e_dependency_drift']
                                 else 'RETAINED_INPUTS_MATCH_RECORDED_IDENTITIES_NOW')
            assert diagnostic['retainedInputs']['status'] == expected_retained
            if mode == 'r16e_package_drift':
                assert diagnostic['retainedInputs']['gate'] == 'RETAINED_PACKAGE_IDENTITY'
            elif mode == 'manifest_package_row_replaced':
                assert diagnostic['retainedInputs']['gate'] == 'BUILD_INPUT_PACKAGE_ROWS'
            else:
                assert diagnostic['retainedInputs']['temporaryCompilerCopyRequired'] is False
            expected_pins = 'PIN_DIFFERENCES_REQUIRE_REVIEW' if mode == 'pin_drift' else 'ALL_PINS_MATCH'
            assert diagnostic['pins']['status'] == expected_pins
            expected_source = 'RECORDED_SOURCE_DIFFERS_NOW' if mode in ['source_drift', 'pin_drift'] else 'RECORDED_SOURCE_FILES_MATCH_NOW'
            assert diagnostic['recordedSourceNow']['status'] == expected_source
            if mode in ['source_drift', 'pin_drift']:
                assert diagnostic['recordedSourceNow']['changedFileCount'] == 1
                assert diagnostic['sinceR17B']['changedFileCount'] == 1
            if mode == 'pin_drift':
                assert diagnostic['pins']['mismatchCount'] == 1
                assert (root / 'server/routes/auth.mjs').read_text() == 'USER_AUTH_EDIT_AFTER_R17B'
            if mode == 'source_drift':
                assert (root / 'client/main.jsx').read_text() == 'USER_SOURCE_EDIT_AFTER_R17B'
            if mode in ['history_delete', 'history_visibility']:
                last = next(row for row in historical['changes'] if row['pathSha256'] == f.sha(names[-1].encode()))
                assert last['kind'] == 'REMOVED_FROM_OBSERVED_SET'
                assert last['after']['state'] == 'NOT_IN_OBSERVED_SET'
                assert last['current']['inObservedSet'] is False
                if mode == 'history_delete':
                    assert last['current']['identity']['state'] == 'ABSENT'
                    assert last['current']['visibility'] == 'PATH_ABSENT_NOW'
                    assert not (root / names[-1]).exists()
                else:
                    assert last['current']['identity']['state'] == 'FILE'
                    assert last['current']['visibility'] == 'PRESENT_BUT_NOT_IN_CURRENT_OBSERVED_SET'
                    assert last['current']['matchesIgnoreRules'] is True
                    assert last['current']['matchesBefore'] is True
                    assert (root / names[-1]).read_text() == 'BEFORE_WORK\n'
            if mode == 'sensitive_name':
                private = next(row for row in historical['changes'] if row['pathSha256'] == f.sha(names[-1].encode()))
                assert private['file'].startswith('REDACTED_PATH_')
                assert 'PRIVATE_PATH_SECRET' not in json.dumps(diagnostic)
            if mode == 'current_edit':
                assert diagnostic['sinceR17B']['changedFileCount'] == 1
                assert (root / names[-1]).read_text() == 'USER_CURRENT_EDIT_AFTER_R17B'
            if mode == 'concurrent_edit':
                if 'diagnosticPreservation' in diagnostic:
                    assert diagnostic['diagnosticPreservation']['changedFileCount'] == 1
            if mode == 'absent_tmp':
                assert not Path(evidence['disposableBuildRoot']).exists()
        RESULTS.append({'case': mode, 'result': 'PASS', 'status': diagnostic['status'],
                        'failure': diagnostic.get('failure'),
                        'historicalFixtureChangedFileCount': 42,
                        'diagnosticProcessAttempts': len(attempts),
                        'onlyReadOnlyGitChildren': True,
                        'priorEvidenceBytesAndModesUnchanged': True})
        print('PASS ' + mode, flush=True)
        return completed, diagnostic


if __name__ == '__main__':
    cases = ['42_changes', 'history_delete', 'history_visibility', 'sensitive_name',
             'source_drift', 'pin_drift', 'candidate_drift', 'candidate_symlink', 'retained_dependency_drift',
             'r16e_dependency_drift', 'absent_tmp', 'history_hash_inconsistent',
             'history_duplicate', 'current_edit', 'concurrent_edit',
             'current_snapshot_oversized', 'manifest_package_row_replaced', 'r16e_package_drift',
             'history_unknown_identity_field', 'unsafe_graph_id', 'unsafe_graph_status',
             'unsafe_external_specifier']
    for mode in cases:
        run(mode)
    (HERE / 'r17c-diagnostic-fixture-results.json').write_text(json.dumps({
        'status': 'PASS', 'checks': len(RESULTS),
        'scope': 'REAL_R17B_SEED_WITH_SYNTHETIC_COMPILER_AND_NATIVE_PACKAGES; REAL_R17C_DIAGNOSTIC; ACTUAL_PROMPT_LOADER_IN_SEED; NO_APP_DATABASE_NETWORK',
        'results': RESULTS}, indent=2) + '\n')
