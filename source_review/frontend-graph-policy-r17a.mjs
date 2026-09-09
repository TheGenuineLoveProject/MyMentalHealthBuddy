import path from 'node:path';
import crypto from 'node:crypto';
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const check = (ok,code) => {if(!ok)throw Object.assign(new Error(code),{code});};

// Module IDs and watch paths are different contracts. In Rolldown 1.0.3,
// addWatchFile accepts paths relative to process.cwd(); the Rust context retains
// the supplied string. A relative module ID has no equivalent filesystem promise.
// NUL-prefixed modules follow the documented virtual-module convention. Vite's
// production resolver also has two non-NUL generated ID forms (see retained
// v1.0.3 native resolver and v8.0.16 constants). Recording a generated ID makes
// no claim that it is a hashed physical input or that its consumer works at runtime.
export function inspectGraph(graph,{buildRoot,inputs,fileIdentity,directory}) {
  check(path.isAbsolute(buildRoot),'GRAPH_BUILD_ROOT');
  check(graph && graph.moduleIdsSupported===true && typeof graph.watchFilesSupported==='boolean'
    &&Array.isArray(graph.modules)&&graph.modules.length>0&&graph.modules.length<=100000
    &&Array.isArray(graph.watchFiles)&&graph.watchFiles.length<=100000
    &&(graph.watchFilesSupported||graph.watchFiles.length===0),'FRONTEND_GRAPH');
  const names=new Map(inputs.map(row=>[row.file,row]));
  check(names.size===inputs.length,'GRAPH_INPUT_DUPLICATE');
  const directories=new Set(['']);
  for(const rel of names.keys())for(let d=path.dirname(rel);d!=='.';d=path.dirname(d))directories.add(d);
  const moduleIds=new Set(),physical=new Map(),virtual=new Map(),problems=[],observations=[];
  const counts={moduleIds:graph.modules.length,watchIds:graph.watchFiles.length,physicalFiles:0,
    physicalDirectories:0,relativeWatchPaths:0,virtualModuleIds:0,virtualWatchReferences:0,externalModuleIds:0,
    viteBrowserExternalModules:0,viteOptionalPeerModules:0};
  const generatedModules=[];
  const validId=id=>typeof id==='string'&&id.length>0&&id.length<=32768;
  const describe=(id,origin)=>{
    const physicalName=path.isAbsolute(id)?path.relative(buildRoot,id):id;
    const publicName=physicalName.length<=220&&!/(?:^|\/)\.(?:env|git|npmrc)(?:\.|\/|$)|\.(?:pem|key|p12|pfx)$/i.test(physicalName)
      &&/^[A-Za-z0-9_@.+/-]+$/.test(physicalName)&&!physicalName.split('/').includes('..')
      ?physicalName:/^(?:virtual|vite|rolldown|__vite-optional-peer-dep):[A-Za-z0-9_@.:/-]{1,200}$/.test(id)?id:undefined;
    return {origin,idSha256:sha(id),idBytes:Buffer.byteLength(id),
      idClass:id.startsWith('\0')?'NUL_PREFIX':path.isAbsolute(id)?'ABSOLUTE':/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(id)?'SCHEME_OR_NAMESPACE':'RELATIVE_OR_BARE',
      ...(publicName?{name:publicName}:{}),hasQuery:id.includes('?'),hasBackslash:id.includes('\\')};
  };
  const problem=(id,origin,code)=>{problems.push({...describe(id,origin),code});};
  for(const m of graph.modules){check(m&&validId(m.id)&&typeof m.isExternal==='boolean','GRAPH_MODULE_SHAPE');
    check(!moduleIds.has(m.id),'GRAPH_MODULE_DUPLICATE');moduleIds.add(m.id);}
  function observe(id,origin,external=false){
    check(validId(id),'GRAPH_STRING');
    if(external){counts.externalModuleIds++;observations.push({...describe(id,origin),classification:'EXTERNAL_NOT_PHYSICAL_PROOF'});return;}
    const builtin=id==='__vite-browser-external'?'VITE_BROWSER_EXTERNAL':
      /^__vite-optional-peer-dep:(?:@[A-Za-z0-9_.-]+\/)?[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*:(?:@[A-Za-z0-9_.-]+\/)?[A-Za-z0-9_.-]+$/.test(id)?'VITE_OPTIONAL_PEER':null;
    if(id.startsWith('\0')||builtin){
      if(origin==='watch'&&!moduleIds.has(id)){problem(id,origin,'VIRTUAL_WATCH_WITHOUT_MODULE');return;}
      if(origin==='module'){
        virtual.set(sha(id),id);counts.virtualModuleIds++;
        if(builtin){
          if(builtin==='VITE_BROWSER_EXTERNAL')counts.viteBrowserExternalModules++;else counts.viteOptionalPeerModules++;
          generatedModules.push({id,classification:builtin,consumerRuntime:'UNQUALIFIED',
            consumers:graph.modules.filter(m=>[...(m.importedIds||[]),...(m.dynamicallyImportedIds||[])].includes(id))
              .map(m=>describe(m.id,'module'))});
        }
      }else counts.virtualWatchReferences++;
      observations.push({...describe(id,origin),classification:builtin||'VIRTUAL_NO_FILE_IDENTITY'});return;
    }
    if(/[\x00-\x1f\x7f\\]/.test(id)){problem(id,origin,'UNSUPPORTED_ID_CHARACTERS');return;}
    const absolute=path.isAbsolute(id);
    if(!absolute&&origin==='module'){problem(id,origin,'UNCLASSIFIED_MODULE_ID');return;}
    if(!absolute&&(/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(id)||/[?*{}[\]]/.test(id))){problem(id,origin,'UNCLASSIFIED_WATCH_ID');return;}
    // A '?' is a module resource query, not part of a physical module filename.
    // Watch paths are filesystem paths; they receive no URL decoding/stripping.
    const physicalName=origin==='module'?id.split('?')[0]:id;
    const full=path.resolve(buildRoot,physicalName),rel=path.relative(buildRoot,full);
    if(full!==buildRoot&&!full.startsWith(buildRoot+path.sep)){problem(id,origin,'GRAPH_INPUT_OUTSIDE_COPY');return;}
    if(!names.has(rel)&&!directories.has(rel)){problem(id,origin,'GRAPH_INPUT_NOT_IN_SNAPSHOT');return;}
    try {
      if(!physical.has(full)){
        if(directories.has(rel)&&!names.has(rel)){
          directory(full);physical.set(full,{file:rel,type:'directory'});counts.physicalDirectories++;
        }else{
          const expected=names.get(rel);check(expected.type==='file','GRAPH_SYMLINK_INPUT');
          const actual=fileIdentity(buildRoot,rel);
          check(actual.sha256===expected.sha256&&actual.bytes===expected.bytes&&actual.mode===expected.mode,'GRAPH_INPUT_CHANGED');
          physical.set(full,actual);counts.physicalFiles++;
        }
      }
      if(!absolute)counts.relativeWatchPaths++;
      observations.push({...describe(id,origin),classification:!absolute?'RELATIVE_WATCH_RESOLVED_AGAINST_BUILD_CWD':physical.get(full).type==='directory'?'PHYSICAL_DIRECTORY':'PHYSICAL_FILE',file:rel});
    }catch(e){problem(id,origin,/^[A-Z0-9_]{1,100}$/.test(e.code||'')?e.code:'GRAPH_PHYSICAL_CHECK_FAILED');}
  }
  for(const m of graph.modules)observe(m.id,'module',m.isExternal);
  for(const id of graph.watchFiles)observe(id,'watch');
  const files=[...physical.values()].sort((a,b)=>a.file.localeCompare(b.file));
  return {status:problems.length?'GRAPH_REVIEW_REQUIRED':'REPORTED_GRAPH_INPUTS_VERIFIED',counts,generatedModules,
    watchCoverage:graph.watchFilesSupported?'REPORTED_WATCH_PATHS':'API_NOT_AVAILABLE_NO_WATCH_PATH_COVERAGE',
    issueCount:problems.length,issues:problems,observations,physicalInputs:files,
    physicalManifestSha256:sha(JSON.stringify(files)),virtualIdsSha256:sha(JSON.stringify([...virtual.keys()].sort())),
    scope:'REPORTED_MODULE_AND_WATCH_GRAPH_NOT_ALL_TOOL_READS',
    basis:'Pinned Vite 8.0.16 / Rolldown 1.0.3 generated ID contracts; addWatchFile cwd-relative paths; NUL virtual convention',
    limitation:'Virtual/external identifiers are classified, not hashed as source files. This is not an OS sandbox or a runtime-closure proof.'};
}
