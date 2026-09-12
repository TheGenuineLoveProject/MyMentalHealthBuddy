// Permit this one observed child commit only when its complete delta consists
// of exact additions of previously delivered review artifacts. No Git mutation.
function reviewCommittedAdditions(){
  gate(before.head===OBSERVED_HEAD&&before.branch==='integration','GIT_BASELINE');
  const readGit=(...args)=>execFileSync(GIT_BIN||'/usr/bin/git',
    ['--no-pager','--no-optional-locks','--no-replace-objects','-c','core.fsmonitor=false',...args],
    {cwd:ROOT,env:{...MIN_ENV,GIT_NO_LAZY_FETCH:'1',GIT_CONFIG_GLOBAL:'/dev/null',GIT_CONFIG_NOSYSTEM:'1'},
      encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:30000,maxBuffer:8*1024**2});
  gate(readGit('rev-parse','HEAD').trim()===OBSERVED_HEAD
    &&readGit('branch','--show-current').trim()==='integration','CURRENT_GIT_IDENTITY');
  const parents=readGit('rev-list','--parents','-n','1',OBSERVED_HEAD).trim().split(' ');
  gate(parents.length===2&&parents[0]===OBSERVED_HEAD&&parents[1]===EXPECTED_HEAD,'OBSERVED_COMMIT_PARENT');
  const raw=readGit('diff','--no-ext-diff','--no-textconv','--no-renames','--raw','--no-abbrev','-z',EXPECTED_HEAD,OBSERVED_HEAD,'--');
  const fields=raw.split('\0');gate(fields.pop()===''&&fields.length%2===0,'COMMIT_DIFF_FORMAT');
  const rows=[],unmatched=[],groups=new Map(),seen=new Set();
  let matched=0;
  for(let i=0;i<fields.length;i+=2){
    const header=/^:([0-7]{6}) ([0-7]{6}) ([a-f0-9]{40}) ([a-f0-9]{40}) ([A-Z])$/.exec(fields[i]);
    gate(header&&fields[i+1]&&!seen.has(fields[i+1]),'COMMIT_DIFF_ROW');
    const file=fields[i+1];seen.add(file);
    const row={file,status:header[5],oldMode:header[1],newMode:header[2],oldBlob:header[3],newBlob:header[4]};
    rows.push(row);
    const root=file.includes('/')?file.split('/')[0]+'/':file;
    const group=groups.get(root)||{path:label(root),paths:0,statuses:{}};
    group.paths++;group.statuses[row.status]=(group.statuses[row.status]||0)+1;groups.set(root,group);
    const candidates=Object.hasOwn(DELIVERED_REVIEW_BLOBS,file)?DELIVERED_REVIEW_BLOBS[file]:[];
    const addition=row.status==='A'&&row.oldMode==='000000'&&row.newMode==='100644'&&/^0{40}$/.test(row.oldBlob);
    if(addition&&candidates.includes(row.newBlob)){matched++;continue;}
    unmatched.push({...row,file:label(file),pathSha256:hash(file),
      reason:!addition?'NOT_A_REGULAR_FILE_ADDITION':candidates.length?'DELIVERED_BYTES_DIFFER':'PATH_NOT_IN_DELIVERED_REVIEW_SET'});
  }
  const report={status:unmatched.length?'COMMITTED_CHANGES_REQUIRE_REVIEW':'EXACT_DELIVERED_REVIEW_ADDITIONS_MATCH',
    originalHead:EXPECTED_HEAD,observedHead:OBSERVED_HEAD,directChild:true,changedPaths:rows.length,
    expectedChangedPaths:EXPECTED_COMMITTED_CHANGES,matchedAdditions:matched,unmatchedCount:unmatched.length,
    groups:[...groups.values()].sort((a,b)=>a.path.localeCompare(b.path)),unmatched,
    deltaSha256:hash(raw),catalogSha256:hash(JSON.stringify(DELIVERED_REVIEW_BLOBS)),
    scope:'COMMITTED_GIT_BLOB_IDENTITIES_AGAINST_DELIVERED_BYTES; CURRENT_SOURCE_RECHECK_FOLLOWS',
    historicalFailuresRewritten:false};
  result.gitBaselineReview=report;
  save('commit-review.json',report);
  gate(rows.length===EXPECTED_COMMITTED_CHANGES,'COMMITTED_CHANGE_COUNT');
  gate(unmatched.length===0,'COMMITTED_CHANGES_REQUIRE_REVIEW');
  gate(readGit('rev-parse','HEAD').trim()===OBSERVED_HEAD
    &&readGit('branch','--show-current').trim()==='integration','CURRENT_GIT_IDENTITY_CHANGED');
  console.log('GATE=EXACT_COMMITTED_REVIEW_ADDITIONS RESULT=PASS COUNT='+matched);
}
