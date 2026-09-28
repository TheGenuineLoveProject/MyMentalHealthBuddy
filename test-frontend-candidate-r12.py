"""R12 parent-driver controls with an inert embedded Node build runner.

Only disposable fixture copies replace ROOT, HEAD, Node, pin digests and runner
bytes. The real parent executes unchanged. No Vite, MMHB, native binding, package
installation, database or browser is exercised. Child-runner tests are separate.
"""
from pathlib import Path
import base64
import hashlib
import json
import os
import re
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
DRIVER = HERE / "frontend-candidate-driver-r12.mjs"
NODE_VERSION = subprocess.check_output(["node", "--version"], text=True).strip()
SENTINEL = "MMHB_FIXTURE_INHERITED_SECRET_MUST_NOT_REACH_CHILD"
PRIVATE = "MMHB_FIXTURE_PRIVATE_CONTENT_MUST_NOT_BE_READ"
VERSIONS = {
    "vite": "8.0.16", "@vitejs/plugin-react": "6.1.1",
    "rollup-plugin-visualizer": "6.0.11", "postcss": "8.5.26",
    "@tailwindcss/postcss": "4.3.3", "tailwindcss": "4.3.3",
    "autoprefixer": "10.4.20", "esbuild": "0.28.2",
    "bcrypt": "6.0.0", "node-gyp-build": "4.8.4", "typescript": "6.0.3",
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def write(root, name, content, mode=0o644):
    target = root / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)
    target.chmod(mode)


def git(root, *args):
    return subprocess.check_output(["git", *args], cwd=root, text=True,
                                   stderr=subprocess.DEVNULL).strip()


def snapshot(root):
    result = {}
    for target in sorted(root.rglob("*")):
        name = str(target.relative_to(root))
        if ".git" in target.relative_to(root).parts:
            continue
        if target.is_symlink():
            result[name] = ("link", os.readlink(target))
        elif target.is_file():
            result[name] = (sha(target.read_bytes()), target.stat().st_mode & 0o777)
    return result


def setup(base):
    match = re.search(r"const PINS = (\{.*?\n\});", base, re.S)
    assert match, "PINS interface changed"
    real_pins = json.loads(match.group(1))
    assert len(real_pins) == 41
    root = Path(tempfile.mkdtemp(prefix="mmhb-r12-parent-fixture-"))
    for name in real_pins:
        content = "{}\n" if name.endswith(".json") else "// INERT_FIXTURE " + name + "\n"
        if name.endswith(".html"):
            content = "<html>EXISTING_SERVED_OUTPUT " + name + "</html>\n"
        if name.endswith(".sql"):
            content = "-- INERT_SQL_MUST_NOT_EXECUTE\n"
        write(root, name, content)
    write(root, "package.json", json.dumps({"name": "mmhb-inert-fixture", "type": "module"}))
    locked = {}
    for name, version in VERSIONS.items():
        write(root, "node_modules/" + name + "/package.json", json.dumps({"name": name, "version": version, "main": "index.js"}))
        write(root, "node_modules/" + name + "/index.js", "throw Error('BUILD_TOOL_MUST_NOT_EXECUTE_IN_PARENT_FIXTURE');\n")
        locked["node_modules/" + name] = {"version": "6.1.0" if name == "@vitejs/plugin-react" else version}
    write(root, "package-lock.json", json.dumps({"lockfileVersion": 3, "packages": locked}))
    write(root, "server/app.mjs", "throw Error('APPLICATION_MUST_NOT_EXECUTE');\n")
    write(root, "node_modules/bcrypt/index.js", "throw Error('NATIVE_MUST_NOT_EXECUTE');\n")
    write(root, "client/src/fixture.jsx", "// import.meta.env.VITE_PUBLIC_URL\n// import.meta.env['VITE_DYNAMIC']\n")
    write(root, "client/public/safe.txt", "PUBLIC_ASSET\n")
    write(root, "shared/fixture.ts", "// SHARED_INERT\n")
    write(root, "attached_assets/fixture image.svg", "<svg/>\n")
    write(root, "node_modules/fixture-graph/input.js", "// GRAPH_ONLY_INPUT\n")
    write(root, "untracked.txt", "PRESERVE_UNRELATED_BYTES\n")
    write(root, ".gitignore", "node_modules/\ndist/\nclient/dist/\nbundle-report.html\n.env*\n")
    git(root, "init", "-q", "-b", "integration")
    git(root, "add", ".")
    git(root, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "commit.gpgsign=false", "commit", "-qm", "inert frontend fixture")
    write(root, "untracked.txt", "PRESERVE_USER_UNCOMMITTED_CHANGE\n")
    return root, {name: sha((root / name).read_bytes()) for name in real_pins}


def runner_stub(mode):
    return r'''
import fs from 'node:fs';
import path from 'node:path';
const mode = __MODE__, root = process.cwd(), report = process.argv[2];
if (Object.values(process.env).some(x => x.includes('MMHB_FIXTURE_INHERITED_SECRET_MUST_NOT_REACH_CHILD'))) {
  throw Error('FIXTURE_CHILD_SECRET_LEAK');
}
fs.writeFileSync(path.join(report,'fixture-runner-started'),'1',{mode:0o600});
if (mode === 'child_error') {
  console.error('MMHB_FIXTURE_PRIVATE_CONTENT_MUST_NOT_BE_READ');
  fs.writeFileSync(path.join(report,'frontend-runner-error.json'), JSON.stringify({
    code:'PLUGIN_ERROR',phase:'BUILD',id:path.join(root,'.env.fixture'),loc:{line:7},
    privateMessage:'MMHB_FIXTURE_PRIVATE_CONTENT_MUST_NOT_BE_READ'}),{mode:0o600});
  process.exit(3);
}
const out = path.join(report,'frontend');
fs.mkdirSync(path.join(out,'assets'),{recursive:true,mode:0o700});
let html = '<html><script type="module" src="/assets/main.js"></script><link rel="stylesheet" href="/assets/main.css"></html>';
if (mode === 'missing_html_reference') html = html.replace('/assets/main.js','/assets/missing.js');
if (mode === 'external_reference') html += '<script src="https://example.invalid/external.js"></script>';
for (const [name, content] of Object.entries({'index.html':html,'assets/main.js':'// INERT_FRONTEND_CHUNK\n','assets/main.css':'body{color:#123456}\n'}))
  fs.writeFileSync(path.join(out,name),content,{mode:0o600});
const emitted=[{type:'chunk',isEntry:true,fileName:'assets/main.js',imports:[],dynamicImports:[],referencedFiles:[],css:['assets/main.css'],assets:[]}];
if (mode === 'missing_chunk') fs.unlinkSync(path.join(out,'assets/main.js'));
if (mode === 'missing_nonentry_chunk') emitted.push({type:'chunk',isEntry:false,fileName:'assets/nonentry-missing.js'});
if (mode === 'missing_import') emitted[0].imports.push('assets/missing.js');
if (mode === 'missing_dynamic_import') emitted[0].dynamicImports.push('assets/missing.js');
if (mode === 'missing_css') fs.unlinkSync(path.join(out,'assets/main.css'));
if (mode === 'missing_entry') emitted[0].isEntry=false;
if (mode === 'empty_index') fs.writeFileSync(path.join(out,'index.html'),'');
if (mode === 'empty_js_entry') fs.writeFileSync(path.join(out,'assets/main.js'),'');
if (mode === 'output_symlink') { fs.unlinkSync(path.join(out,'assets/main.js')); fs.symlinkSync(path.join(root,'client/src/fixture.jsx'),path.join(out,'assets/main.js')); }
let ids=[path.join(root,'client/src/fixture.jsx'),path.join(root,'node_modules/fixture-graph/input.js')];
let watches=[path.join(root,'shared')];
if (mode === 'graph_private') ids.push(path.join(root,'.env.fixture'));
if (mode === 'graph_outside') ids.push('/etc/passwd');
if (mode === 'graph_private_resolution') ids.push(path.join(root,'node_modules/fixture-private-link.js'));
if (mode === 'graph_outside_resolution') ids.push(path.join(root,'node_modules/fixture-outside-link.js'));
if (mode === 'graph_source_symlink') ids.push(path.join(root,'elsewhere/source-link.js'));
if (mode === 'graph_directory_symlink') watches.push(path.join(root,'node_modules/fixture-dir'));
if (mode === 'virtual_query') ids.push('\0fixture-virtual','vite:fixture','/@fixture-virtual','relative-unresolved',path.join(root,'client/src/fixture.jsx')+'?raw');
if (mode === 'source_drift') fs.appendFileSync(path.join(root,'client/src/fixture.jsx'),'// CONCURRENT_SOURCE_EDIT\n');
if (mode === 'tool_drift') fs.appendFileSync(path.join(root,'node_modules/vite/index.js'),'// CONCURRENT_TOOL_EDIT\n');
if (mode === 'unrelated_drift') fs.appendFileSync(path.join(root,'untracked.txt'),'CONCURRENT_UNRELATED_EDIT\n');
if (mode === 'served_drift') fs.appendFileSync(path.join(root,'client/dist/index.html'),'CONCURRENT_SERVED_EDIT\n');
fs.writeFileSync(path.join(report,'frontend-graph.json'),JSON.stringify({modules:ids.map(id=>({id,isExternal:false})),watchFiles:watches}),{mode:0o600});
fs.writeFileSync(path.join(report,'frontend-build-evidence.json'),JSON.stringify({status:'FRONTEND_COMPILED_CANDIDATE_NOT_RELEASE',graphFile:'frontend-graph.json',emitted,
  resolvedConfig:{root:path.join(root,'client'),outDir:out},cssDiagnostics:{scope:'INERT_FIXTURE_NOT_VISUAL_PROOF'}}),{mode:0o600});
'''.replace("__MODE__", json.dumps(mode))


def adapted_driver(base, root, pins, mode):
    src = re.sub(r"const PINS = \{.*?\n\};", "const PINS = " + json.dumps(pins) + ";", base, count=1, flags=re.S)
    for name, value in {"EXPECTED_ROOT": str(root), "EXPECTED_HEAD": git(root,"rev-parse","HEAD"), "EXPECTED_NODE": NODE_VERSION}.items():
        src, count = re.subn(r"const " + name + r" = '[^']*';", "const " + name + " = " + json.dumps(value) + ";", src, count=1)
        assert count == 1
    encoded = base64.b64encode(runner_stub(mode).encode()).decode()
    src, count = re.subn(r"const RUNNER_B64 = '[^']*';", "const RUNNER_B64 = '" + encoded + "';", src, count=1)
    assert count == 1
    return src


def run_case(label, mode="success", edit=None, expected_gate=None, expected_runs=1,
             allowed_changes=(), final_write_error=None, intercept_private=False):
    base = DRIVER.read_text()
    root, pins = setup(base)
    src = adapted_driver(base,root,pins,mode)
    marker = "const ROOT = fs.realpathSync('.');"
    if intercept_private:
        src = src.replace(marker,marker+r'''
const fixtureOpen = fs.openSync, fixtureRead = fs.readFileSync;
function fixturePrivate(file) { if (String(file).endsWith('/.env.fixture')) throw Object.assign(new Error('FIXTURE_PRIVATE_CONTENT_READ'),{gate:'FIXTURE_PRIVATE_CONTENT_READ'}); }
fs.openSync = function(file,...args) { fixturePrivate(file); return fixtureOpen.call(fs,file,...args); };
fs.readFileSync = function(file,...args) { fixturePrivate(file); return fixtureRead.call(fs,file,...args); };
''',1)
    if final_write_error:
        src=src.replace(marker,marker+r'''
const fixtureWrite = fs.writeFileSync;
fs.writeFileSync = function(file,...args) {
  if (String(file).endsWith('/frontend-candidate-evidence.json')) throw Object.assign(new Error('MMHB_FIXTURE_PRIVATE_CONTENT_MUST_NOT_BE_READ'), {code:__CODE__,syscall:'open',path:String(file)});
  return fixtureWrite.call(fs,file,...args);
};
'''.replace('__CODE__',json.dumps(final_write_error)),1)
    if edit:
        edit(root)
    before=snapshot(root)
    execution=subprocess.run(['node','--input-type=module'],input=src,cwd=root,capture_output=True,text=True,timeout=30,
        env={**os.environ,'NODE_OPTIONS':'','NODE_DISABLE_COMPILE_CACHE':'1','GIT_OPTIONAL_LOCKS':'0','DATABASE_URL':SENTINEL,'OPENAI_API_KEY':SENTINEL,'VITE_PRIVATE':SENTINEL})
    output=execution.stdout+execution.stderr
    for marker_text in (SENTINEL, PRIVATE, 'APPLICATION_MUST_NOT_EXECUTE','NATIVE_MUST_NOT_EXECUTE','BUILD_TOOL_MUST_NOT_EXECUTE_IN_PARENT_FIXTURE'):
        assert marker_text not in output,(label,'leak or unintended code execution',marker_text)
    start=execution.stdout.find('\n{')
    assert start>=0,(label,'no JSON result',output[-4000:])
    evidence,_=json.JSONDecoder().raw_decode(execution.stdout[start+1:])
    assert evidence['buildProcessesStarted']==expected_runs,(label,evidence)
    assert evidence['buildAttempts']==expected_runs,(label,evidence)
    after=snapshot(root)
    changed={name for name in set(before)|set(after) if before.get(name)!=after.get(name)}
    assert changed==set(allowed_changes),(label,'unexpected workspace mutation',changed)
    if expected_gate:
        assert execution.returncode==1,(label,output[-4000:])
        assert evidence['status']=='FRONTEND_CANDIDATE_FAILED',(label,evidence)
        assert evidence['failure']['gate']==expected_gate,(label,evidence)
    else:
        assert execution.returncode==0,(label,output[-4000:])
        assert evidence['status']=='FRONTEND_CANDIDATE_ONLY_NOT_RELEASE',(label,evidence)
        assert evidence['preservation']=='OBSERVED_SOURCES_TOOLS_AND_GIT_STATE_PRESERVED'
        assert evidence['dependencyAlignment']=='PENDING'
        react=next(x for x in evidence['tools'] if x['name']=='@vitejs/plugin-react')
        assert (react['installed'],react['locked'],react['alignment'])==('6.1.1','6.1.0','PENDING')
        assert evidence['runtime']=='UNPROVEN' and evidence['deployedArtifact']=='UNPROVEN'
        assert evidence['outputFiles']==3 and evidence['outputBytes']>0
        assert evidence['publicConfiguration']['referencedNames']==['VITE_PUBLIC_URL']
        assert evidence['publicConfiguration']['dynamicSyntaxFiles']==1
        assert evidence['publicConfiguration']['valuesReadOrForwarded']==0
    report=Path(re.findall(r'^REPORT_DIRECTORY=(.+)$',execution.stdout,re.M)[-1])
    assert report.stat().st_mode&0o777==0o700
    for name in ('worktree-before.json','worktree-after.json','worktree-comparison.json'):
        assert (report/name).is_file(),(label,'missing snapshot',name)
        assert (report/name).stat().st_mode&0o777==0o600
    difference=json.loads((report/'worktree-comparison.json').read_text())
    assert difference==evidence['currentPreservation']
    if not allowed_changes:
        assert not difference['components'],(label,difference)
        assert json.loads((report/'worktree-before.json').read_text())==json.loads((report/'worktree-after.json').read_text())
    if final_write_error:
        assert evidence['evidenceWrite']=='FAILED' and not (report/'frontend-candidate-evidence.json').exists()
        assert evidence['failure']['phase']=='FINAL_EVIDENCE_WRITE'
        assert evidence['failure']['errorCode']==final_write_error
        assert evidence['failure']['detail']['file']=='REPORT/frontend-candidate-evidence.json'
    else:
        assert evidence['evidenceWrite']=='SAVED'
        assert (report/'frontend-candidate-evidence.json').stat().st_mode&0o777==0o600
    assert (report/'fixture-runner-started').exists()==bool(expected_runs)
    assert not (report/'server.mjs').exists() and not (report/'schema.canonical.sql').exists()
    assert not (root/'FILTER_EXECUTED').exists()
    if not expected_gate:
        manifests=json.loads((report/'output-manifest.json').read_text())
        for row in manifests['rows']:
            assert sha((report/'frontend'/row['file']).read_bytes())==row['sha256']
    print('CASE='+label+' RESULT=PASS')
    return evidence


def main():
    run_case('frontend_only_candidate_preserves_source_git_served_outputs')
    run_case('baseline_pin_drift_stops_before_child',edit=lambda r:write(r,'server/app.mjs','changed\n'),expected_gate='R10A_BASELINE_DRIFT',expected_runs=0)
    partial_source=run_case('private_public_asset_refused_before_build_and_read',edit=lambda r:write(r,'client/public/.env.fixture',PRIVATE),expected_gate='PRIVATE_OR_UNSUPPORTED_TREE_PATH',expected_runs=0,intercept_private=True)
    assert partial_source['preservation']=='PARTIAL_BASELINES_PRESERVED_FULL_SCOPE_UNOBSERVED',partial_source
    assert partial_source['preservationScope']=={'git':True,'pins':True,'sourceTrees':False,'toolTrees':False},partial_source
    partial_tool=run_case('tool_tree_symlink_refused_with_partial_preservation',edit=lambda r:(r/'node_modules/vite/fixture-symlink').symlink_to('/etc/passwd'),expected_gate='TREE_SYMLINK',expected_runs=0)
    assert partial_tool['preservation']=='PARTIAL_BASELINES_PRESERVED_FULL_SCOPE_UNOBSERVED',partial_tool
    assert partial_tool['preservationScope']=={'git':True,'pins':True,'sourceTrees':True,'toolTrees':False},partial_tool
    run_case('public_asset_symlink_refused_before_build',edit=lambda r:(r/'client/public/link.txt').symlink_to('/etc/passwd'),expected_gate='TREE_SYMLINK',expected_runs=0)
    run_case('source_root_symlink_refused_before_build',edit=lambda r:(r/'attached_assets/link').symlink_to('/etc'),expected_gate='TREE_SYMLINK',expected_runs=0)
    run_case('source_concurrent_edit_detected',mode='source_drift',expected_gate='FRONTEND_SOURCE_NOT_PRESERVED',allowed_changes=('client/src/fixture.jsx',))
    run_case('tool_concurrent_edit_detected',mode='tool_drift',expected_gate='BUILD_TOOL_NOT_PRESERVED',allowed_changes=('node_modules/vite/index.js',))
    run_case('unrelated_worktree_edit_detected',mode='unrelated_drift',expected_gate='GIT_OR_WORKTREE_NOT_PRESERVED',allowed_changes=('untracked.txt',))
    run_case('served_output_edit_detected',mode='served_drift',expected_gate='PINNED_FILE_NOT_PRESERVED',allowed_changes=('client/dist/index.html',))
    run_case('missing_entry_chunk_refused',mode='missing_chunk',expected_gate='FRONTEND_ENTRY_MISSING')
    run_case('missing_emitted_nonentry_chunk_refused',mode='missing_nonentry_chunk',expected_gate='EMITTED_OUTPUT_MISSING')
    run_case('missing_import_refused',mode='missing_import',expected_gate='OUTPUT_LOCAL_REFERENCE_MISSING')
    run_case('missing_dynamic_import_refused',mode='missing_dynamic_import',expected_gate='OUTPUT_LOCAL_REFERENCE_MISSING')
    run_case('missing_html_reference_refused',mode='missing_html_reference',expected_gate='OUTPUT_LOCAL_REFERENCE_MISSING')
    run_case('missing_css_refused',mode='missing_css',expected_gate='FRONTEND_CSS_MISSING')
    run_case('missing_entry_refused',mode='missing_entry',expected_gate='FRONTEND_ENTRY_MISSING')
    run_case('empty_js_entry_refused',mode='empty_js_entry',expected_gate='FRONTEND_ENTRY_MISSING')
    run_case('empty_html_refused',mode='empty_index',expected_gate='FRONTEND_INDEX_MISSING')
    run_case('output_symlink_refused',mode='output_symlink',expected_gate='TREE_SYMLINK')
    run_case('graph_private_path_refused_before_read',mode='graph_private',edit=lambda r:write(r,'.env.fixture',PRIVATE),expected_gate='GRAPH_INPUT_BOUNDARY',intercept_private=True)
    run_case('graph_outside_workspace_refused',mode='graph_outside',expected_gate='GRAPH_INPUT_BOUNDARY')
    def private_link(root):
        write(root,'.env.fixture',PRIVATE)
        (root/'node_modules/fixture-private-link.js').symlink_to('../.env.fixture')
    run_case('graph_private_resolution_refused_before_read',mode='graph_private_resolution',edit=private_link,expected_gate='METAFILE_PRIVATE_OR_UNSUPPORTED_RESOLUTION',intercept_private=True)
    run_case('graph_outside_resolution_refused',mode='graph_outside_resolution',edit=lambda r:(r/'node_modules/fixture-outside-link.js').symlink_to('/etc/passwd'),expected_gate='RESOLVED_INPUT_OUTSIDE_WORKSPACE')
    def source_link(root):
        (root/'elsewhere').mkdir()
        (root/'elsewhere/source-link.js').symlink_to('../client/src/fixture.jsx')
    run_case('graph_source_symlink_refused',mode='graph_source_symlink',edit=source_link,expected_gate='INPUT_SYMLINK')
    run_case('graph_directory_symlink_refused',mode='graph_directory_symlink',edit=lambda r:(r/'node_modules/fixture-dir').symlink_to('../shared'),expected_gate='GRAPH_WATCH_DIRECTORY_SYMLINK')
    virtual=run_case('virtual_and_query_ids_classified',mode='virtual_query')
    assert virtual['virtualInputs']==3 and virtual['unresolvedInputs']==1 and virtual['observedPhysicalInputs']==2,virtual
    external=run_case('external_html_reference_reported',mode='external_reference')
    assert external['references']['externalReferences']==1
    child=run_case('child_error_is_sanitized',mode='child_error',expected_gate='FRONTEND_COMPILATION_FAILED')
    assert child['failure']['detail']['diagnostics']['rawLog']=='PRIVATE_NOT_PRINTED'
    assert child['failure']['detail']['diagnostics']['file'].startswith('REDACTED_PATH_')
    run_case('final_evidence_missing_path_retained_on_stdout',final_write_error='ENOENT',expected_gate='EVIDENCE_WRITE_FAILED')
    final=run_case('final_evidence_error_retains_child_failure',mode='child_error',final_write_error='EIO',expected_gate='EVIDENCE_WRITE_FAILED')
    assert final['failure']['previousFailure']['gate']=='FRONTEND_COMPILATION_FAILED'
    def git_filter(root):
        write(root,'.gitattributes','client/src/fixture.jsx filter=review\n')
        git(root,'config','filter.review.clean','touch FILTER_EXECUTED; cat')
    run_case('git_clean_filter_is_never_executed',edit=git_filter)
    print('R12_PARENT_FIXTURE_CASES=32 RESULT=PASS')
    print('SCOPE=FULL_PARENT_WITH_INERT_CHILD_NOT_VITE_BUILD_OR_APPLICATION_RUNTIME')


if __name__=='__main__':
    main()
