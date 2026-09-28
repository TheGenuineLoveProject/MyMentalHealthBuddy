"""Execute the real R17 -> R17A handoff using synthetic compiler/native packages.
R17 genuinely fails its original validator on a relative watch ID in every fixture.
R17A must reuse its outputs, never invoke a compiler and execute the actual prompt
loader. This does not test real Replit compilation or native ABI compatibility.
"""
from pathlib import Path
import base64,importlib.util,json,os,re,shutil,subprocess,tempfile
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('fixture17',HERE/'test-fresh-candidate-r17.py')
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
f.front.VITE_STUB=f.front.VITE_STUB.replace("getWatchFiles: () => [config.root + '/index.html']","getWatchFiles: () => ['client/index.html']")
RELATIVE_STUB=f.front.VITE_STUB
RAW=(HERE/'resumed-candidate-driver-r17a.mjs').read_text()
RESULTS=[]
def adapt(src,root):
 for name,value in [('EXPECTED_ROOT',str(root)),('EXPECTED_HEAD',f.git(root,'rev-parse','HEAD')),('EXPECTED_NODE',f.VERSION)]:
  src=re.sub(r'const '+name+r" = '[^']*';",lambda _:'const '+name+' = '+f.j(value)+';',src,count=1)
 for key,names in [('PINS',f.PIN_NAMES),('ASSET_PINS',f.ASSET_NAMES)]:
  pins={name:f.sha((root/name).read_bytes()) for name in names}
  src=re.sub(r'const '+key+r' = \{.*?\n\};',lambda _:'const '+key+' = '+f.j(pins)+';',src,count=1,flags=re.S)
 return src
def run(mode,expected):
 build=None
 with tempfile.TemporaryDirectory(prefix='mmhb-r17a-fixture-') as tmp:
  tmp=Path(tmp);root=tmp/'workspace';root.mkdir()
  f.front.VITE_STUB=RELATIVE_STUB
  if mode in ['vite_builtin','vite_optional_peer']:
   generated='__vite-browser-external' if mode=='vite_builtin' else '__vite-optional-peer-dep:@foo/peer:@foo/parent'
   f.front.VITE_STUB=RELATIVE_STUB.replace("getWatchFiles: () => ['client/index.html'],",'').replace("[config.root + '/main.jsx']","[config.root + '/main.jsx',"+f.j(generated)+"]")
  stage=f.build_fixture(root,'success')
  src=adapt(f.raw,root)
  src=src.replace("fs.mkdtempSync(path.join(evidenceRoot,'r17-'))","(fs.mkdirSync(path.join(evidenceRoot,'r17-u9BFmJ'),{mode:0o700}),path.join(evidenceRoot,'r17-u9BFmJ'))")
  script=f.write(tmp,'r17.mjs',src)
  env={**os.environ,'OPENAI_API_KEY':f.SECRET,'DATABASE_URL':f.SECRET}
  oldrun=subprocess.run([f.NODE,str(script)],cwd=root,env=env,capture_output=True,text=True,timeout=30)
  prior=root/'.mmhb-release-evidence/r17-u9BFmJ'
  old=json.loads((prior/'fresh-candidate-evidence.json').read_text());build=Path(old['disposableBuildRoot'])
  try:
   assert oldrun.returncode==1 and old['failure']['gate']=='GRAPH_NONPHYSICAL_ID',(mode,old.get('failure'))
   assert all(x['exitCode']==0 for x in old['processes'])
   src=adapt(RAW,root)
   src=re.sub(r"const OBSERVED_SERVER_SHA='[a-f0-9]+';",lambda _:'const OBSERVED_SERVER_SHA='+f.j(old['server']['bundleSha256'])+';',src,count=1)
   src=src.replace('const OBSERVED_SERVER_INPUT_COUNT=1277;','const OBSERVED_SERVER_INPUT_COUNT=3;')
   helpers=json.loads(re.search(r'const HELPERS = (\{[^\n]+\});',src).group(1))
   native="""import fs from 'node:fs';import path from 'node:path';const [candidate,report]=process.argv.slice(2);
   if(process.env.OPENAI_API_KEY||process.env.DATABASE_URL||process.env.HOME||process.env.NODE_OPTIONS)throw Error('CREDENTIALS_FORWARDED');
   __FAULT__
   fs.writeFileSync(path.join(report,'native-smoke-evidence.json'),JSON.stringify({status:'NATIVE_CANDIDATE_SMOKE_PASS'}));"""
   faults={'native_failure':'process.exit(7);',
    'concurrent_workspace_edit':f"fs.writeFileSync({f.j(str(root/'user-work.txt'))},'CONCURRENT_CHANGE_RETAINED');",
    'concurrent_prior_frontend_edit':f"fs.writeFileSync({f.j(str(prior/'frontend-build/frontend/assets/a.js'))},'CONCURRENT_OUTPUT_CHANGE');"}
   native=native.replace('__FAULT__',faults.get(mode,''))
   helpers['NATIVE']={'sha256':f.sha(native.encode()),'b64':base64.b64encode(native.encode()).decode()}
   src=re.sub(r'const HELPERS = \{[^\n]+\};',lambda _:'const HELPERS = '+f.j(helpers)+';',src,count=1)
   if mode=='source_drift':f.write(root,'client/main.jsx','source changed after R17')
   if mode=='copy_drift':f.write(build,'client/main.jsx','copied source changed')
   if mode=='server_drift':f.write(prior,'server-build/server.mjs','server changed after R17')
   if mode=='frontend_size_drift':f.write(prior,'frontend-build/frontend/assets/a.js','a different sized script')
   if mode=='missing_copy':shutil.rmtree(build)
   if mode=='helper_drift':f.write(prior,'frontend-runner.mjs','helper changed after R17')
   if mode=='dependency_drift':f.write(stage,'node_modules/resend/index.js','dependency changed after R17')
   if mode in ['unknown_ids','watch_escape','relative_directory']:
    gfile=prior/'frontend-build/frontend-graph.json';g=json.loads(gfile.read_text())
    if mode=='unknown_ids':g['modules'] += [{'id':'virtual:unreviewed','isExternal':False},{'id':'https://user:PRIVATE_SECRET@example.invalid/a?token=PRIVATE_SECRET','isExternal':False}]
    if mode=='watch_escape':g['watchFiles']+=['../outside-copy']
    if mode=='relative_directory':g['watchFiles']+=['client']
    gfile.write_text(f.j(g));ef=prior/'frontend-build/frontend-build-evidence.json';e=json.loads(ef.read_text())
    e['moduleCount']=len(g['modules']);e['watchFileCount']=len(g['watchFiles']);ef.write_text(f.j(e))
   script=f.write(tmp,'r17a.mjs',src)
   r=subprocess.run([f.NODE,str(script)],cwd=root,env=env,capture_output=True,text=True,timeout=30)
   reports=list((root/'.mmhb-release-evidence').glob('r17a-*'));assert len(reports)==1,(mode,r.stdout,r.stderr)
   report=reports[0];e=json.loads((report/'resumed-candidate-evidence.json').read_text())
   if expected is None:
    assert r.returncode==0 and e['status']=='RETAINED_CANDIDATE_BUILD_AND_SMOKE_PASS_NOT_RELEASE',(mode,e.get('failure'),r.stderr)
    if mode in ['vite_builtin','vite_optional_peer']:
     assert e['graph']['watchCoverage']=='API_NOT_AVAILABLE_NO_WATCH_PATH_COVERAGE'
     assert len(e['graph']['generatedModules'])==1
    else:assert e['graph']['counts']['relativeWatchPaths']>=1
    assert e['prompt']['moduleLoads']==18
    assert [x['name'] for x in e['processes']]==['server-syntax','native-bcrypt','prompt-assets']
    assert e['preservationStatus']=='CURRENT_SOURCE_R16E_AND_OBSERVED_R17_PRESERVED'
   else:assert r.returncode!=0 and e['failure']['gate']==expected,(mode,e.get('failure'),e.get('processes'),r.stderr)
   assert e['releaseReady'] is False and e['compilerInvocationsThisRun']==0
   assert not any(x['name'] in ['server-build','frontend-build'] for x in e['processes'])
   assert f.SECRET not in r.stdout+r.stderr and 'PRIVATE_SECRET' not in r.stdout+r.stderr
   if mode=='unknown_ids':assert e['graph']['issueCount']==2 and not e['processes']
   if mode=='watch_escape':assert e['graph']['issues'][0]['code']=='GRAPH_INPUT_OUTSIDE_COPY'
   if mode=='concurrent_workspace_edit':assert (root/'user-work.txt').read_text()=='CONCURRENT_CHANGE_RETAINED'
   RESULTS.append({'case':mode,'result':'PASS','expectedGate':expected,'actualStatus':e['status'],'newCompilerProcesses':0})
   print('PASS '+mode,flush=True)
  finally:
   if build and build.is_dir():shutil.rmtree(build)
if __name__=='__main__':
 for mode,expected in [('success',None),('vite_builtin',None),('vite_optional_peer',None),('relative_directory',None),('unknown_ids','GRAPH_REVIEW_REQUIRED'),('watch_escape','GRAPH_REVIEW_REQUIRED'),
  ('source_drift','R17_SOURCE_BASELINE_CHANGED'),('copy_drift','R17_COPIED_SOURCE_CHANGED'),('server_drift','SERVER_RETAINED_IDENTITY'),
  ('frontend_size_drift','R17_EMITTED_SIZE_CHANGED'),('missing_copy','R17_BUILD_COPY_MISSING'),('helper_drift','R17_BUILD_RUNNER_IDENTITY'),
  ('dependency_drift','R16E_INSTALLED_TREE_DRIFT'),('native_failure','CHILD_FAILED'),('concurrent_workspace_edit','WORKTREE_PRESERVATION'),
  ('concurrent_prior_frontend_edit','R17_FRONTEND_CHANGED')]:run(mode,expected)
 (HERE/'r17a-resume-fixture-results.json').write_text(json.dumps({'status':'PASS','checks':len(RESULTS),
  'scope':'REAL_R17_AND_R17A_DRIVERS_WITH_SYNTHETIC_COMPILER_NATIVE_PACKAGES; ACTUAL_PROMPT_LOADER; NO_APPLICATION_OR_NETWORK',
  'results':RESULTS},indent=2)+'\n')
