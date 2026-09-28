#!/usr/bin/env python3
"""Inert runner fixtures; fake .node files are JavaScript, never native ABI proof.

The temporary test runner substitutes only the required Node version and native
extension handler; production runner and copied production packages are untouched.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
SOURCE = (HERE / 'native-candidate-runner-r13.mjs').read_text()
NODE = shutil.which('node')
VERSION = subprocess.check_output([NODE, '--version'], text=True).strip()
FIXTURE_SOURCE = SOURCE.replace("const EXPECTED_NODE = 'v24.13.0';", f"const EXPECTED_NODE = '{VERSION}';")
needle = "originalNativeExtension = requireFromCandidate.extensions['.node'];"
assert SOURCE.count(needle) == 1
FIXTURE_SOURCE = FIXTURE_SOURCE.replace(needle, "originalNativeExtension = (module, filename) => { module._compile(fs.readFileSync(filename, 'utf8'), filename); };")

BCRYPT = """const path = require('path');
const bindings = require('node-gyp-build')(__dirname);
module.exports = bindings;
"""
LOADER = """const path = require('path');
function load(dir) { return require(load.resolve(dir)); }
load.resolve = dir => path.join(dir, 'prebuilds/linux-x64/bcrypt.node');
module.exports = load;
"""
BINDING = """const samples = new Map();
module.exports = {
  hashSync(sample, rounds) { const hash = '$2b$04$' + 'a'.repeat(53); samples.set(hash, sample); return hash; },
  compareSync(sample, hash) { return samples.get(hash) === sample; },
  getRounds(hash) { return 4; }
};
"""

def write(file, content):
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content)

def fixture(name, mutate=None, expected=None, environment=None, source=None, arguments=None):
    report = Path(tempfile.mkdtemp(prefix='mmhb-release-assembly-r13-', dir='/tmp'))
    # tempfile's punctuation cannot match the production report grammar.
    clean = report.with_name(report.name.replace('_', 'A'))
    if clean != report:
        report.rename(clean)
        report = clean
    candidate = report / 'candidate'
    bcrypt = candidate / 'node_modules/bcrypt'
    loader = candidate / 'node_modules/node-gyp-build'
    binding = bcrypt / 'prebuilds/linux-x64/bcrypt.node'
    server = candidate / 'server.mjs'
    sentinel = report / 'app-imported.txt'
    write(server, f"import fs from 'node:fs'; fs.writeFileSync({json.dumps(str(sentinel))}, 'IMPORTED'); throw new Error('APP_IMPORT_SENTINEL');\n")
    write(bcrypt / 'package.json', json.dumps({'name': 'bcrypt', 'version': '6.0.0', 'main': 'bcrypt.js'}))
    write(loader / 'package.json', json.dumps({'name': 'node-gyp-build', 'version': '4.8.4', 'main': 'index.js'}))
    write(bcrypt / 'bcrypt.js', BCRYPT)
    write(loader / 'index.js', LOADER)
    write(binding, BINDING)
    context = {'report': report, 'candidate': candidate, 'bcrypt': bcrypt, 'loader': loader, 'binding': binding, 'server': server}
    if mutate:
        mutate(context)
    runner = report / 'runner.mjs'
    write(runner, source if source is not None else FIXTURE_SOURCE)
    env = {'PATH': '/usr/local/bin:/usr/bin:/bin', 'NODE_ENV': 'production', 'NODE_DISABLE_COMPILE_CACHE': '1'}
    if environment:
        env.update(environment)
    args = arguments(context) if arguments else [str(candidate), str(report)]
    result = subprocess.run([NODE, str(runner), *args], env=env, text=True, capture_output=True, timeout=10)
    evidence_path = report / 'native-smoke-evidence.json'
    evidence = json.loads(evidence_path.read_text()) if evidence_path.exists() else None
    combined = result.stdout + result.stderr
    assert not sentinel.exists(), (name, 'application imported')
    assert '$2b$04$' not in combined and str(report) not in combined, (name, 'private output')
    assert 'DO_NOT_PRINT_PRIVATE_MESSAGE' not in combined and '/secret/data' not in combined, (name, 'raw error output')
    if expected:
        assert result.returncode != 0, (name, combined)
        assert f'CODE={expected}' in combined, (name, expected, combined, evidence)
        if evidence and evidence.get('status') != 'PREEXISTING':
            assert evidence['failure']['code'] == expected, (name, evidence)
    else:
        assert result.returncode == 0, (name, combined, evidence)
        assert evidence['status'] == 'NATIVE_CANDIDATE_SMOKE_PASS', (name, evidence)
        assert all(v == 'PASS' for v in evidence['checks'].values()), (name, evidence)
        assert evidence['paths']['binding'] == 'node_modules/bcrypt/prebuilds/linux-x64/bcrypt.node'
        assert evidence['loadedNativeFiles'] == [evidence['paths']['binding']]
        assert evidence['loadedModuleCount'] >= 3
        assert all(not Path(x).is_absolute() and '..' not in Path(x).parts for x in evidence['loadedModuleFiles'])
        assert evidence['scope']['serverImported'] is False
        assert evidence_path.stat().st_mode & 0o077 == 0
    shutil.rmtree(report)
    print(f'{name}: PASS')

def loader_source(ctx, code): write(ctx['loader'] / 'index.js', code)
def bcrypt_source(ctx, code): write(ctx['bcrypt'] / 'bcrypt.js', code)
def binding_source(ctx, code): write(ctx['binding'], code)

fixture('candidate_anchored_positive_and_app_sentinel')
fixture('missing_bcrypt', lambda c: shutil.rmtree(c['bcrypt']), 'ENOENT')
fixture('missing_loader', lambda c: shutil.rmtree(c['loader']), 'ENOENT')
fixture('wrong_bcrypt_version', lambda c: write(c['bcrypt'] / 'package.json', '{"name":"bcrypt","version":"5.0.0","main":"bcrypt.js"}'), 'BCRYPT_VERSION_MISMATCH')
fixture('wrong_loader_version', lambda c: write(c['loader'] / 'package.json', '{"name":"node-gyp-build","version":"4.8.3","main":"index.js"}'), 'LOADER_VERSION_MISMATCH')
fixture('missing_loader_resolver', lambda c: loader_source(c, 'module.exports = function () {};'), 'LOADER_RESOLVE_UNAVAILABLE')
fixture('host_binding_refused_before_load', lambda c: loader_source(c, LOADER.replace("path.join(dir, 'prebuilds/linux-x64/bcrypt.node')", json.dumps(str(c['report'] / 'HOST_MUST_NOT_BE_READ.node')))), 'NATIVE_BINDING_OUTSIDE_PACKAGE')
fixture('prefix_collision_refused_before_load', lambda c: loader_source(c, LOADER.replace("path.join(dir, 'prebuilds/linux-x64/bcrypt.node')", json.dumps(str(c['bcrypt']) + '-other/invalid.node'))), 'NATIVE_BINDING_OUTSIDE_PACKAGE')
fixture('relative_binding_refused', lambda c: loader_source(c, LOADER.replace("path.join(dir, 'prebuilds/linux-x64/bcrypt.node')", "'prebuilds/linux-x64/bcrypt.node'")), 'NATIVE_BINDING_OUTSIDE_PACKAGE')
fixture('non_native_extension_refused', lambda c: loader_source(c, LOADER.replace("path.join(dir, 'prebuilds/linux-x64/bcrypt.node')", "path.join(dir, 'bcrypt.js')")), 'NATIVE_BINDING_EXTENSION')
def binding_symlink(c):
    real = c['report'] / 'outside.node'
    write(real, "throw new Error('HOST_MUST_NOT_LOAD');")
    c['binding'].unlink()
    c['binding'].symlink_to(real)
fixture('binding_symlink_escape_refused', binding_symlink, 'NATIVE_BINDING_OUTSIDE_PACKAGE')
def second_binding(c):
    write(c['binding'].with_name('other.node'), "throw new Error('SECOND_BINDING_MUST_NOT_LOAD');")
    loader_source(c, LOADER.replace("load.resolve = dir => path.join(dir, 'prebuilds/linux-x64/bcrypt.node');", "let count=0; load.resolve = dir => path.join(dir, 'prebuilds/linux-x64/' + (++count===1 ? 'bcrypt.node' : 'other.node'));"))
fixture('changed_second_resolution_refused_before_native_load', second_binding, 'UNEXPECTED_NATIVE_BINDING')
fixture('no_native_binding_loaded', lambda c: bcrypt_source(c, BINDING), 'SELECTED_NATIVE_BINDING_NOT_LOADED')
fixture('invalid_hash_format', lambda c: binding_source(c, BINDING.replace("'$2b$04$' + 'a'.repeat(53)", "'INVALID'")), 'BCRYPT_HASH_FORMAT')
fixture('correct_password_rejected', lambda c: binding_source(c, BINDING.replace('return samples.get(hash) === sample;', 'return false;')), 'CORRECT_PASSWORD_REJECTED')
fixture('incorrect_password_accepted', lambda c: binding_source(c, BINDING.replace('return samples.get(hash) === sample;', 'return true;')), 'INCORRECT_PASSWORD_ACCEPTED')
fixture('rounds_mismatch', lambda c: binding_source(c, BINDING.replace('return 4;', 'return 10;')), 'BCRYPT_ROUNDS_MISMATCH')
fixture('bcrypt_api_incomplete', lambda c: binding_source(c, 'module.exports = {};'), 'BCRYPT_API_INCOMPLETE')
def outside_cache(c):
    outside = c['report'] / 'outside.js'
    write(outside, 'module.exports = 1;')
    bcrypt_source(c, BCRYPT + f'require({json.dumps(str(outside))});\n')
fixture('external_require_cache_refused', outside_cache, 'REQUIRE_CACHE_OUTSIDE_CANDIDATE')
fixture('native_environment_override_refused', environment={'BCRYPT_PREBUILD': '/host/must/not/load'}, expected='NATIVE_RESOLUTION_ENVIRONMENT_OVERRIDE')
fixture('node_options_refused', environment={'NODE_OPTIONS': '--no-warnings'}, expected='NATIVE_RESOLUTION_ENVIRONMENT_OVERRIDE')
fixture('nonproduction_environment_refused', environment={'NODE_ENV': 'development'}, expected='PRODUCTION_ENVIRONMENT_REQUIRED')
fixture('candidate_argument_boundary', arguments=lambda c: [str(c['report']), str(c['report'])], expected='CANDIDATE_DIRECTORY_FORMAT')
fixture('report_argument_boundary', arguments=lambda c: [str(c['candidate']), str(c['candidate'])], expected='REPORT_DIRECTORY_FORMAT')
fixture('report_mode_not_private', lambda c: c['report'].chmod(0o755), 'REPORT_DIRECTORY_NOT_PRIVATE')
fixture('existing_evidence_not_overwritten', lambda c: write(c['report'] / 'native-smoke-evidence.json', '{"status":"PREEXISTING"}'), 'EEXIST')
fixture('raw_error_message_redaction', lambda c: loader_source(c, "throw new Error('DO_NOT_PRINT_PRIVATE_MESSAGE /secret/data');"), 'UNEXPECTED_NATIVE_RUNNER_FAILURE')
fixture('runtime_mismatch', source=FIXTURE_SOURCE.replace(f"const EXPECTED_NODE = '{VERSION}';", "const EXPECTED_NODE = 'v0.0.0';"), expected='RUNTIME_MISMATCH')
print('FIXTURES=28 PASS=28 SCOPE=INERT_CONTROL_FLOW_NOT_NATIVE_ABI')
