#!/usr/bin/env python3
"""Compile synthetic fixtures with exact esbuild 0.28.2. Never execute outputs.

This review-only script does not download/install a compiler, access MMHB, or
run on Replit as part of R18A. Supply an already reviewed compiler binary.
The sole metadata adapter replaces the output key with the synthetic historical
report path expected by the graph policy; source, edges and byte counts stay as
reported by esbuild. Input paths are relative and require no adaptation.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile

BINARY_SHA = 'e1698a3d5c6c0798fee4fd3b5cc816651f460c63d390a7a26ea4beb0b1884100'
COMPILER_ROOT = '/tmp/mmhb-build-r17b-AbC123'
REPORT_ROOT = '/home/runner/workspace/.mmhb-release-evidence/r17b-AbC123'
OUTPUT_KEY = REPORT_ROOT + '/server-build/server.mjs'
SOURCE = {
    'relative_live': {'server/app.mjs': 'try { require("./absent.node") } catch (error) { console.log("fallback") }'},
    'relative_unused': {'server/app.mjs': 'export function keep() { return 1 }; function unused() { try { require("./absent.node") } catch {} }'},
    'relative_unused_export': {
        'server/app.mjs': 'import { keep } from "./optional.mjs"; console.log(keep());',
        'server/optional.mjs': 'export function keep() { return 1 }; export function unused() { try { require("./absent.node") } catch {} }',
    },
    'package_unused': {'server/app.mjs': 'export function keep() { return 1 }; function unused() { try { require("missing-package") } catch {} }'},
}
POLICY_RUNNER = '''
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const [policyPath, fixturePath] = process.argv.slice(1);
const {analyzeRuntimeGraph} = await import(pathToFileURL(policyPath).href);
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
try {
  const result = analyzeRuntimeGraph(fixture.meta, structuredClone(fixture.meta), fixture.options);
  process.stdout.write(JSON.stringify({outcome:'RETURNED', status:result.status, externalImports:result.externalImports,
    externalInputReview:result.externalInputReview,
    requiresReview:result.requiresReview, fullResult:result}));
} catch (error) {
  process.stdout.write(JSON.stringify({outcome:'THREW', code:error.code || 'UNCLASSIFIED', details:error.details}));
}
'''

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--compiler', required=True, type=Path)
    parser.add_argument('--policy', action='append', required=True, type=Path)
    parser.add_argument('--output-dir', required=True, type=Path)
    args = parser.parse_args()
    compiler = args.compiler.resolve(strict=True)
    assert hashlib.sha256(compiler.read_bytes()).hexdigest() == BINARY_SHA, 'Unreviewed compiler'
    version = subprocess.run([str(compiler), '--version'], check=True, text=True, capture_output=True, timeout=10).stdout.strip()
    assert version == '0.28.2'
    policies = [p.resolve(strict=True) for p in args.policy]
    args.output_dir.mkdir(parents=True, exist_ok=True)
    results = {'scope':'SYNTHETIC_COMPILER_FIXTURES_NOT_ACTUAL_R18_OFFENDING_SPECIFIER', 'compilerVersion':version,
               'compilerSha256':BINARY_SHA, 'outputsExecuted':False, 'packageInstalls':0, 'applicationBuilds':0, 'cases':[]}
    with tempfile.TemporaryDirectory(prefix='r18a-compiler-test-') as temporary:
        for name, files in SOURCE.items():
            root = Path(temporary) / name
            root.mkdir()
            for rel, content in files.items():
                target = root / rel
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(content)
            argv = [str(compiler), 'server/app.mjs', '--bundle', '--format=esm', '--platform=node', '--target=node24',
                    '--metafile=meta.json', '--outfile=server.mjs']
            completed = subprocess.run(argv, cwd=root, text=True, capture_output=True, timeout=20)
            assert completed.returncode == 0, completed.stderr
            meta = json.loads((root/'meta.json').read_text())
            assert set(meta['outputs']) == {'server.mjs'}
            original_meta = json.loads(json.dumps(meta))
            meta['outputs'][OUTPUT_KEY] = meta['outputs'].pop('server.mjs')
            fixture = {'sources':files, 'rawMeta':original_meta, 'meta':meta, 'options':{
                'compilerWorkingDirectory':COMPILER_ROOT, 'reportDirectory':REPORT_ROOT,
                'inputRows':[{'file':rel, 'type':'file', 'bytes':len(content.encode())} for rel, content in files.items()]},
                'adapter':'ONLY_OUTPUT_MAP_KEY_REPLACED_WITH_SYNTHETIC_EXPECTED_REPORT_PATH'}
            fixture_path = args.output_dir / ('r18a-esbuild-'+name+'-fixture.json')
            fixture_path.write_text(json.dumps(fixture, indent=2)+'\n')
            row = {'name':name, 'compilerExit':completed.returncode,
                'inputExternals':[edge['path'] for source in meta['inputs'].values() for edge in source['imports'] if edge.get('external')],
                'outputExternals':[edge['path'] for edge in meta['outputs'][OUTPUT_KEY]['imports'] if edge.get('external')], 'policies':[]}
            for policy in policies:
                completed = subprocess.run(['node', '--input-type=module', '-e', POLICY_RUNNER, str(policy), str(fixture_path.resolve())],
                                           cwd=root, text=True, capture_output=True, timeout=20)
                assert completed.returncode == 0, completed.stderr
                observed = json.loads(completed.stdout)
                if policy.name == 'runtime-graph-policy-r18.mjs':
                    if name == 'package_unused':
                        assert observed['outcome'] == 'RETURNED'
                    else:
                        assert observed['outcome'] == 'THREW' and observed['code'] == 'RUNTIME_EXTERNAL_SPECIFIER'
                elif policy.name == 'runtime-graph-policy-r18a.mjs':
                    if name == 'relative_live':
                        assert observed['outcome'] == 'THREW' and observed['code'] == 'RUNTIME_EXTERNAL_SPECIFIER'
                        assert observed['details']['graphSide'] == 'OUTPUT'
                    else:
                        assert observed['outcome'] == 'RETURNED' and observed['externalImports'] == []
                        assert observed['requiresReview'] == (name != 'package_unused')
                        assert len(observed['externalInputReview']) == (0 if name == 'package_unused' else 1)
                    assert './absent.node' not in json.dumps(observed), 'Opaque raw specifier must not be returned'
                row['policies'].append({'file':policy.name, 'sha256':hashlib.sha256(policy.read_bytes()).hexdigest(), **observed})
            results['cases'].append(row)
    output = args.output_dir / 'r18a-esbuild-reproduction-results.json'
    output.write_text(json.dumps(results, indent=2)+'\n')
    print(json.dumps({'resultFile':str(output), 'cases':[{'name':r['name'], 'policies':[
        {k:v for k,v in p.items() if k != 'fullResult'} for p in r['policies']]} for r in results['cases']]}, indent=2))

if __name__ == '__main__':
    main()
