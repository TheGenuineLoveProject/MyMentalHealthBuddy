"""Run the real R17B workflow with synthetic compilers/native packages.

R17B creates retained build inputs without depending on old R17 or /tmp data.
The complete driver, workers, graph policy and exact MMHB prompt loader execute;
this suite does not claim real Vite compilation or native ABI compatibility.
No network, npm install, application server or database is requested.
"""
from pathlib import Path
import base64, contextlib, importlib.util, json, os, re, secrets, shutil, subprocess, tempfile

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('fixture17', HERE / 'test-fresh-candidate-r17.py')
f = importlib.util.module_from_spec(spec)
spec.loader.exec_module(f)
ORIGINAL_VITE = f.front.VITE_STUB
RESULTS = []


def adapt(src, root, mode):
    for name, value in [('EXPECTED_ROOT', str(root)),
                        ('EXPECTED_HEAD', f.git(root, 'rev-parse', 'HEAD')),
                        ('EXPECTED_NODE', f.VERSION)]:
        src, n = re.subn(r'const ' + name + r" = '[^']*';",
                         lambda _: 'const ' + name + ' = ' + f.j(value) + ';', src, count=1)
        assert n == 1, name
    for key, names in [('PINS', f.PIN_NAMES), ('ASSET_PINS', f.ASSET_NAMES)]:
        pins = {name: f.sha((root / name).read_bytes()) for name in names}
        src, n = re.subn(r'const ' + key + r' = \{.*?\n\};',
                         lambda _: 'const ' + key + ' = ' + f.j(pins) + ';', src,
                         count=1, flags=re.S)
        assert n == 1, key
    helpers = json.loads(re.search(r'const HELPERS = (\{[^\n]+\});', src).group(1))
    # The workers retain their full path-boundary checks. Only the fixed fixture
    # workspace identity differs from the real Replit workspace identity.
    for name in ['SERVER', 'FRONTEND']:
        worker = base64.b64decode(helpers[name]['b64']).decode()
        worker = worker.replace('/home/runner/workspace', str(root))
        worker = worker.replace(r'\/home\/runner\/workspace', str(root).replace('/', r'\/'))
        helpers[name] = {'sha256': f.sha(worker.encode()),
                         'b64': base64.b64encode(worker.encode()).decode()}
    native = """import fs from 'node:fs';import path from 'node:path';
const [candidate,report]=process.argv.slice(2);
const compilerRoot=JSON.parse(fs.readFileSync(path.join(report,'build-input-manifest.json'),'utf8')).compilerWorkingDirectory;
if(process.env.OPENAI_API_KEY||process.env.DATABASE_URL||process.env.HOME||process.env.NODE_OPTIONS)
  throw Error('SECRET_INHERITED');
__FAULT__
fs.writeFileSync(path.join(report,'native-smoke-evidence.json'),
 JSON.stringify({status:'NATIVE_CANDIDATE_SMOKE_PASS'}));
"""
    faults = {
        'native_failure': 'process.exit(7);',
        'copied_source_drift': "fs.writeFileSync(path.join(report,'build-input/client/main.jsx'),'CHANGED_COPY');",
        'copied_dependency_drift': "fs.writeFileSync(path.join(report,'build-input/node_modules/resend/index.js'),'CHANGED_DEPENDENCY');",
        'copied_package_drift': "fs.appendFileSync(path.join(report,'build-input/package.json'),'\\n');",
        'compiler_source_drift': "fs.writeFileSync(path.join(compilerRoot,'client/main.jsx'),'CHANGED_COMPILER_COPY');",
        'compiler_dependency_drift': "fs.writeFileSync(path.join(compilerRoot,'node_modules/resend/index.js'),'CHANGED_COMPILER_DEPENDENCY');",
        'compiler_package_drift': "fs.appendFileSync(path.join(compilerRoot,'package.json'),'\\n');",
        'frontend_output_drift': "fs.writeFileSync(path.join(report,'frontend-build/frontend/assets/a.js'),'CHANGED_FRONTEND');",
        'workspace_edit': "fs.writeFileSync(" + f.j(str(root / 'user-work.txt')) + ",'CONCURRENT_CHANGE_RETAINED');",
    }
    native = native.replace('__FAULT__', faults.get(mode, ''))
    helpers['NATIVE'] = {'sha256': f.sha(native.encode()),
                         'b64': base64.b64encode(native.encode()).decode()}
    src = re.sub(r'const HELPERS = \{[^\n]+\};',
                 lambda _: 'const HELPERS = ' + f.j(helpers) + ';', src, count=1)
    if mode == 'timeout':
        assert 'timeoutMs=180000' in src
        src = src.replace('timeoutMs=180000', 'timeoutMs=50')
    if mode == 'low_space':
        assert src.count('const s=fs.statfsSync(full);') == 1
        src = src.replace('const s=fs.statfsSync(full);', 'const s={bavail:1280,bsize:1024**2};')
    return src


def snapshot(root):
    return {str(p.relative_to(root)): (f.sha(p.read_bytes()), p.stat().st_mode & 0o777)
            for p in root.rglob('*') if p.is_file() and not p.is_symlink()}


def run(mode, expected):
    raw = (HERE / 'fresh-candidate-driver-r17b.mjs').read_text()
    with tempfile.TemporaryDirectory(prefix='mmhb-r17b-fixture-') as tmp_name, contextlib.ExitStack() as cleanup:
        tmp = Path(tmp_name)
        root = tmp / 'workspace'
        root.mkdir()
        f.front.VITE_STUB = ORIGINAL_VITE
        if mode in ['relative_watch', 'rerun']:
            f.front.VITE_STUB = ORIGINAL_VITE.replace(
                "getWatchFiles: () => [config.root + '/index.html']",
                "getWatchFiles: () => ['client/index.html', 'client']")
        if mode == 'vite_builtin':
            f.front.VITE_STUB = ORIGINAL_VITE.replace(
                "getWatchFiles: () => [config.root + '/index.html'],", '').replace(
                "[config.root + '/main.jsx']", "[config.root + '/main.jsx','__vite-browser-external']")
        if mode == 'unknown_ids':
            f.front.VITE_STUB = ORIGINAL_VITE.replace(
                "[config.root + '/main.jsx']",
                "[config.root + '/main.jsx','virtual:unreviewed','https://user:PRIVATE_SECRET@example.invalid/a?token=PRIVATE_SECRET']")
        if mode == 'graph_ancestor':
            f.front.VITE_STUB = ORIGINAL_VITE.replace(
                "[config.root + '/main.jsx']", '[' + f.j(str(root / 'node_modules/resend/index.js')) + ']')
        fixture_mode = mode if mode in ['tree_drift', 'missing_binary', 'timeout'] else 'success'
        stage = f.build_fixture(root, fixture_mode)
        if mode == 'graph_ancestor':
            f.write(root, 'node_modules/resend/index.js', 'ANCESTOR_DEPENDENCY_NOT_BUILD_COPY')
        assert not list((root / '.mmhb-release-evidence').glob('r17-*'))
        assert not list((root / '.mmhb-release-evidence').glob('r17a-*'))
        source = adapt(raw, root, mode)
        script = f.write(tmp, 'r17b.mjs', source)
        env = {**os.environ, 'OPENAI_API_KEY': f.SECRET, 'DATABASE_URL': f.SECRET}
        root_lock = (root / 'package-lock.json').read_bytes()
        prior = snapshot(stage.parent)
        completed = subprocess.run([f.NODE, str(script)], cwd=root, env=env,
                                   capture_output=True, text=True, timeout=35)
        reports = list((root / '.mmhb-release-evidence').glob('r17b-*'))
        assert len(reports) == 1, (mode, completed.stdout, completed.stderr)
        report = reports[0]
        evidence = json.loads((report / 'fresh-candidate-evidence.json').read_text())
        disposable = evidence.get('disposableBuildRoot')
        if disposable:
            assert re.fullmatch(r'/tmp/mmhb-build-r17b-[A-Za-z0-9]{6}', disposable)
            cleanup.callback(shutil.rmtree, disposable, True)
        failure = (evidence.get('failure') or {}).get('gate')
        if expected is None:
            assert completed.returncode == 0 and evidence['status'] == 'FRESH_CANDIDATE_BUILD_AND_SMOKE_PASS_NOT_RELEASE', (mode, evidence.get('failure'), evidence.get('processes'), completed.stderr)
            assert evidence['prompt']['moduleLoads'] == 18
            assert [p['name'] for p in evidence['processes']] == ['server-build', 'frontend-build', 'server-syntax', 'native-bcrypt', 'prompt-assets']
            assert evidence['server']['compilerInvocations'] == 2
            assert (report / 'candidate-manifest.json').is_file()
        else:
            assert completed.returncode != 0 and failure == expected, (mode, evidence.get('failure'), evidence.get('processes'), completed.stderr)
        assert evidence['releaseReady'] is False
        assert evidence['applicationRuntime'] == evidence['deployedArtifact'] == 'UNPROVEN'
        assert (root / 'package-lock.json').read_bytes() == root_lock
        assert snapshot(stage.parent) == prior
        assert f.SECRET not in completed.stdout + completed.stderr
        assert 'PRIVATE_SECRET' not in completed.stdout + completed.stderr
        if mode in ['tree_drift', 'low_space']:
            assert not evidence['processes']
        if mode == 'low_space':
            assert evidence['failure']['phase'] == 'FRESH_BUILD_COPY'
            assert not (report / 'build-input').exists()
            assert not disposable
        if (report / 'build-input').exists():
            assert evidence['retainedBuildRoot'] == str(report / 'build-input')
            assert (report / 'build-input').stat().st_mode & 0o777 == 0o700
            assert not (report / 'build-input/client/src/.env.fixture').exists()
            retained_manifest = json.loads((report / 'build-input-manifest.json').read_text())
            assert retained_manifest['directory'] == str(report / 'build-input')
            assert retained_manifest['compilerWorkingDirectory'] == disposable
        if mode in ['unknown_ids', 'graph_ancestor']:
            assert [p['name'] for p in evidence['processes']] == ['server-build', 'frontend-build']
            assert all(p['exitCode'] == 0 for p in evidence['processes'])
            assert (report / 'build-input/client/main.jsx').is_file()
            assert (report / 'frontend-graph-review.json').is_file()
            assert (report / 'frontend-output-manifest.json').is_file()
            graph = json.loads((report / 'frontend-graph-review.json').read_text())
            assert graph['issueCount'] == (2 if mode == 'unknown_ids' else 1)
            if mode == 'graph_ancestor':
                assert graph['issues'][0]['code'] == 'GRAPH_INPUT_OUTSIDE_COPY'
            assert not (report / 'candidate').exists()
        if mode == 'vite_builtin':
            graph = json.loads((report / 'frontend-graph-review.json').read_text())
            assert graph['watchCoverage'] == 'API_NOT_AVAILABLE_NO_WATCH_PATH_COVERAGE'
            assert len(graph['generatedModules']) == 1
        if mode == 'workspace_edit':
            assert (root / 'user-work.txt').read_text() == 'CONCURRENT_CHANGE_RETAINED'
        if mode == 'timeout':
            assert evidence['processes'][0]['timedOut'] is True
        if mode == 'rerun':
            first_snapshot = snapshot(report)
            second = subprocess.run([f.NODE, str(script)], cwd=root, env=env,
                                    capture_output=True, text=True, timeout=35)
            reports = list((root / '.mmhb-release-evidence').glob('r17b-*'))
            assert second.returncode == 0 and len(reports) == 2, (second.stdout, second.stderr)
            assert snapshot(report) == first_snapshot
            other = next(p for p in reports if p != report)
            other_evidence = json.loads((other / 'fresh-candidate-evidence.json').read_text())
            cleanup.callback(shutil.rmtree, other_evidence['disposableBuildRoot'], True)
            assert other_evidence['status'] == 'FRESH_CANDIDATE_BUILD_AND_SMOKE_PASS_NOT_RELEASE'
            assert other_evidence['retainedBuildRoot'] != evidence['retainedBuildRoot']
        RESULTS.append({'case': mode, 'result': 'PASS', 'expectedGate': expected,
                        'actualStatus': evidence['status'],
                        'oldR17ReportOrTemporaryCopyRequired': False})
        print('PASS ' + mode, flush=True)


def run_worker_scope(mode):
    """Exercise only the changed worker boundaries before any tool imports."""
    with tempfile.TemporaryDirectory(prefix='mmhb-r17b-worker-fixture-') as tmp_name, contextlib.ExitStack() as cleanup:
        tmp = Path(tmp_name)
        workspace = tmp / 'workspace'
        report = workspace / '.mmhb-release-evidence/r17b-ABC123'
        report.mkdir(parents=True, mode=0o700)
        build = Path('/tmp/mmhb-build-r17b-' + secrets.token_hex(3))
        build.mkdir(mode=0o700)
        cleanup.callback(shutil.rmtree, build, True)
        f.write(build, 'package.json', '{"type":"module"}')
        is_server = mode == 'server_sibling_output'
        source_name = 'server-build-runner-r17b.mjs' if is_server else 'frontend-build-runner-r17b.mjs'
        source = (HERE / source_name).read_text().replace(
            r'\/home\/runner\/workspace', str(workspace).replace('/', r'\/'))
        out = report / ('wrong-build' if mode.endswith('sibling_output') else 'frontend-build')
        out.mkdir(mode=0o700)
        if mode == 'frontend_tool_outside_copy':
            outside = tmp / 'outside-vite'
            f.write(outside, 'package.json', '{"type":"module","main":"index.js"}')
            marker = tmp / 'tool-was-imported'
            f.write(outside, 'index.js', "import fs from 'node:fs';fs.writeFileSync(" + f.j(str(marker)) + ",'BAD');")
            (build / 'node_modules').mkdir()
            (build / 'node_modules/vite').symlink_to(outside, target_is_directory=True)
        script = f.write(tmp, source_name, source)
        args = [str(build), str(out)] if is_server else [str(out), str(build)]
        completed = subprocess.run([f.NODE, str(script), *args], cwd=build,
                                   env={'PATH': str(Path(f.NODE).parent) + ':/usr/bin:/bin', 'NODE_ENV': 'production'},
                                   capture_output=True, text=True, timeout=15)
        expected = {'server_sibling_output': 'BUILD_ROOT',
                    'frontend_sibling_output': 'REPORT_DIRECTORY_SCOPE',
                    'frontend_tool_outside_copy': 'DIRECT_TOOL_OUTSIDE_COPY'}[mode]
        assert completed.returncode == 1, (mode, completed.stdout, completed.stderr)
        if is_server:
            assert json.loads((out / 'error.json').read_text())['code'] == expected
        else:
            assert 'CODE=' + expected in completed.stdout
        if mode == 'frontend_tool_outside_copy':
            assert not marker.exists(), 'Outside compiler was imported before rejection'
        RESULTS.append({'case': mode, 'result': 'PASS', 'expectedGate': expected,
                        'scope': 'DIRECT_WORKER_BOUNDARY_NO_COMPILER_IMPORT'})
        print('PASS ' + mode, flush=True)


if __name__ == '__main__':
    cases = [('success', None), ('relative_watch', None), ('vite_builtin', None),
             ('unknown_ids', 'GRAPH_REVIEW_REQUIRED'), ('graph_ancestor', 'GRAPH_REVIEW_REQUIRED'),
             ('tree_drift', 'R16E_INSTALLED_TREE_DRIFT'), ('low_space', 'INSUFFICIENT_FREE_SPACE'), ('missing_binary', 'CHILD_FAILED'),
             ('copied_source_drift', 'BUILD_COPIED_INPUT_CHANGED'),
             ('copied_dependency_drift', 'BUILD_DEPENDENCIES_CHANGED'),
             ('copied_package_drift', 'BUILD_COPIED_INPUT_CHANGED'),
             ('compiler_source_drift', 'BUILD_COPIED_INPUT_CHANGED'),
             ('compiler_dependency_drift', 'BUILD_DEPENDENCIES_CHANGED'),
             ('compiler_package_drift', 'BUILD_COPIED_INPUT_CHANGED'),
             ('frontend_output_drift', 'FRONTEND_OUTPUT_CHANGED'),
             ('native_failure', 'CHILD_FAILED'), ('workspace_edit', 'WORKTREE_PRESERVATION'),
             ('timeout', 'CHILD_FAILED'), ('rerun', None)]
    for mode, expected in cases:
        run(mode, expected)
    for mode in ['server_sibling_output', 'frontend_sibling_output', 'frontend_tool_outside_copy']:
        run_worker_scope(mode)
    (HERE / 'r17b-driver-fixture-results.json').write_text(json.dumps({
        'status': 'PASS', 'checks': len(RESULTS),
        'scope': 'REAL_R17B_DRIVER_AND_WORKERS_WITH_SYNTHETIC_COMPILER_NATIVE_PACKAGES; ACTUAL_PROMPT_LOADER; NO_APPLICATION_DATABASE_OR_NETWORK',
        'results': RESULTS}, indent=2) + '\n')
