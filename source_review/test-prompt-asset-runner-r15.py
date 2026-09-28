#!/usr/bin/env python3
"""Local fixture qualification for the exact R15 read-only prompt loader child."""
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
RUNNER = HERE / 'prompt-asset-runner-r15.mjs'
REVIEWED_MODULE = HERE / 'r14-assets-server-lib-promptEngine.mjs'
SOURCE_HASH = 'fbbd43eaab399b029b5d976508da8f1e055e25d69fd2ee65551e23d102363170'
NODE = shutil.which('node')
assert NODE
ENV = {'PATH': str(Path(NODE).parent), 'NODE_OPTIONS': '', 'NODE_DISABLE_COMPILE_CACHE': '1'}
KNOWN = [r for r in json.loads((HERE / 'r14-assets-known-asset-metadata.json').read_text()) if r['file'].startswith('ai/')]
assert len(KNOWN) == 22
assert hashlib.sha256(REVIEWED_MODULE.read_bytes()).hexdigest() == SOURCE_HASH
RESULTS = []


def identity(p):
    b = p.read_bytes()
    return {'sha256': hashlib.sha256(b).hexdigest(), 'bytes': len(b)}


def tree(root):
    return {str(p.relative_to(root)): identity(p) for p in sorted(root.rglob('*')) if p.is_file() and not p.is_symlink()}


def case(name, mutator=None, expected_gate=None, expected_phase=None, populated=True):
    with tempfile.TemporaryDirectory(prefix='mmhb-r15-loader-fixture-') as td:
        report = Path(td)
        candidate = report / 'candidate'
        candidate.mkdir()
        module = report / 'promptEngine.mjs'
        shutil.copyfile(REVIEWED_MODULE, module)
        manifest = {'project': 'MyMentalHealthBuddy', 'schemaVersion': 1, 'assets': [], 'engines': {}}
        for row in KNOWN:
            source = HERE / ('r14-assets-' + row['file'].replace('/', '-'))
            assert source.exists(), source
            b = source.read_bytes()
            assert hashlib.sha256(b).hexdigest() == row['sha256']
            manifest['assets'].append({'file': row['file'], **identity(source)})
            if populated:
                p = candidate / row['file']
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_bytes(b)
        for engine in ('healing', 'business'):
            registry = json.loads((HERE / f'r14-assets-ai-{engine}-registry.json').read_text())
            manifest['engines'][engine] = {'version': registry['version'], 'prompts': [{'id': p['id'], 'risk': p['risk']} for p in registry['prompts']]}
        manifest_path = report / 'manifest.json'
        context = {'root': report, 'candidate': candidate, 'module': module, 'manifest': manifest, 'manifest_path': manifest_path, 'cwd': candidate, 'raw_manifest': None}
        if mutator:
            mutator(context)
        manifest_path.write_text(context['raw_manifest'] if context['raw_manifest'] is not None else json.dumps(context['manifest']))
        before = tree(candidate)
        completed = subprocess.run([NODE, str(RUNNER), str(module), str(manifest_path)], cwd=context['cwd'], env=ENV, text=True, capture_output=True, timeout=15)
        assert completed.stderr == '', (name, completed.stderr[:100])
        data = json.loads(completed.stdout)
        assert tree(candidate) == before, name + ' mutated candidate'
        assert data['scope']['promptWrites'] == 0
        assert data['scope']['applicationStarted'] is False
        assert 'You are' not in completed.stdout and 'GLP' not in completed.stdout and 'secret-fixture-marker' not in completed.stdout
        if expected_gate:
            assert completed.returncode == 1, (name, completed.returncode, data)
            assert data['status'] == 'PROMPT_ASSET_LOADER_FAILED'
            assert data['failure']['gate'] == expected_gate, (name, data)
            if expected_phase:
                assert data['failure']['phase'] == expected_phase, (name, data)
        else:
            assert completed.returncode == 0, (name, data)
            assert data['status'] == 'PROMPT_ASSET_LOAD_PASS'
            assert data['sourceModuleImported'] is True
            assert data['registryChecks'] == 2
            assert data['moduleLoads'] == 18
            assert data['sourceReads'] == 20
            assert data['denialChecks'] == 35
            assert data['assetsChecked'] == 22
            assert data['assetPreservation'] == 'ALL_22_OBSERVED_ASSETS_PRESERVED'
        RESULTS.append({'name': name, 'result': 'PASS'})
        return data


def refresh_asset(context, file, payload):
    target = context['candidate'] / file
    target.write_bytes(payload)
    next(r for r in context['manifest']['assets'] if r['file'] == file).update(identity(target))


def malformed_registry(context):
    refresh_asset(context, 'ai/healing/registry.json', b'{malformed')


def reordered_registry(context):
    p = context['candidate'] / 'ai/healing/registry.json'
    reg = json.loads(p.read_text())
    reg['prompts'].reverse()
    refresh_asset(context, 'ai/healing/registry.json', json.dumps(reg).encode())


def symlink_asset(context):
    source = context['candidate'] / 'ai/healing/system.md'
    outside = context['root'] / 'outside-system.md'
    source.rename(outside)
    source.symlink_to(outside)


def symlink_parent(context):
    source = context['candidate'] / 'ai/healing'
    outside = context['root'] / 'outside-healing'
    source.rename(outside)
    source.symlink_to(outside, target_is_directory=True)


# Prove the actual reviewed module's empty-cwd behavior before adding assets.
with tempfile.TemporaryDirectory(prefix='mmhb-r15-absent-loader-') as td:
    baseline = r'''
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const bytes = fs.readFileSync(process.argv[1]);
if (createHash('sha256').update(bytes).digest('hex') !== process.argv[2]) process.exit(2);
const m = await import(`data:text/javascript;base64,${bytes.toString('base64')}`);
const info = m.getRegistryInfo();
const checks = ['healing','business'].map(engine => {
  let code;
  try { m.loadPromptModule(engine, engine === 'healing' ? 'h01_intake' : 'b01_offer_design'); } catch (e) { code = e.code; }
  return info[engine].version === 'unavailable' && info[engine].promptIds.length === 0 && code === 'unregistered_prompt';
});
process.stdout.write(JSON.stringify({absentAssetBehavior: checks.every(Boolean) ? 'PASS' : 'FAIL'}));
if (!checks.every(Boolean)) process.exitCode = 1;
'''
    run = subprocess.run([NODE, '--input-type=module', '-e', baseline, str(REVIEWED_MODULE), SOURCE_HASH], cwd=td, env=ENV, capture_output=True, text=True, timeout=15)
    assert run.returncode == 0 and json.loads(run.stdout)['absentAssetBehavior'] == 'PASS' and run.stderr == ''
    assert not list(Path(td).iterdir())
    RESULTS.append({'name': 'actual_reviewed_module_absent_asset_baseline', 'result': 'PASS'})

case('full_22_asset_candidate_actual_module_pass')
empty = case('absent_assets_preflight_denied', populated=False, expected_gate='UNEXPECTED_LOADER_FAILURE', expected_phase='ASSET_IDENTITIES')
assert not empty['sourceModuleImported'] and empty['failure']['code'] == 'ENOENT'
case('missing_prompt_file_denied', lambda c: (c['candidate'] / 'ai/healing/prompts/h01_intake.md').unlink(), expected_gate='UNEXPECTED_LOADER_FAILURE', expected_phase='ASSET_IDENTITIES')
case('changed_prompt_hash_denied', lambda c: (c['candidate'] / 'ai/healing/prompts/h01_intake.md').write_text('secret-fixture-marker'), expected_gate='ASSET_HASH_OR_SIZE')
case('changed_module_denied', lambda c: c['module'].write_text("throw new Error('secret-fixture-marker');"), expected_gate='MODULE_HASH')
case('invalid_manifest_json_redacted', lambda c: c.update(raw_manifest='secret-fixture-marker'), expected_gate='MANIFEST_JSON')
case('duplicate_manifest_asset_denied', lambda c: c['manifest']['assets'].__setitem__(0, copy.deepcopy(c['manifest']['assets'][1])), expected_gate='MANIFEST_ASSET_SET')
case('manifest_traversal_denied', lambda c: c['manifest']['assets'][0].update(file='../outside'), expected_gate='MANIFEST_ASSET_ROW')
case('manifest_extra_property_denied', lambda c: c['manifest'].update(extra='secret-fixture-marker'), expected_gate='MANIFEST_SHAPE')
case('asset_symlink_denied', symlink_asset, expected_gate='INPUT_SYMLINK')
case('asset_parent_symlink_denied', symlink_parent, expected_gate='INPUT_SYMLINK')
case('wrong_candidate_working_directory_denied', lambda c: c.update(cwd=c['root']), expected_gate='MODULE_MUST_BE_OUTSIDE_CANDIDATE')
case('malformed_registry_actual_loader_detected', malformed_registry, expected_gate='REGISTRY_CONTENT', expected_phase='REGISTRIES')
case('reordered_registry_ids_actual_loader_detected', reordered_registry, expected_gate='REGISTRY_CONTENT')
case('incorrect_risk_contract_actual_loader_detected', lambda c: c['manifest']['engines']['healing']['prompts'][0].update(risk='high'), expected_gate='LOADED_PROMPT_RISK')
case('non_utf8_prompt_denied', lambda c: refresh_asset(c, 'ai/healing/prompts/h01_intake.md', b'\xff'), expected_gate='ASSET_INVALID_UTF8')
case('oversized_asset_manifest_denied', lambda c: c['manifest']['assets'][0].update(bytes=50001), expected_gate='MANIFEST_ASSET_ROW')
case('edited_candidate_bytes_pass_when_manifest_matches', lambda c: refresh_asset(c, 'ai/healing/system.md', b'MyMentalHealthBuddy educational system.\n'))
output = {'project': 'MyMentalHealthBuddy', 'status': 'R15_PROMPT_ASSET_RUNNER_FIXTURES_PASS', 'fixtures': RESULTS, 'count': len(RESULTS), 'moduleSha256': SOURCE_HASH, 'runnerSha256': hashlib.sha256(RUNNER.read_bytes()).hexdigest(), 'scope': 'LOCAL_TEMPORARY_CANDIDATES_WITH_ACTUAL_HASH_VERIFIED_PROMPT_ENGINE_NO_APPLICATION_START'}
print(json.dumps(output, indent=2))
