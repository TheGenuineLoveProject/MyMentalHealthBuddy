const DIAGNOSTIC_HELPER_B64='aW1wb3J0IGNyeXB0byBmcm9tICdub2RlOmNyeXB0byc7CmNvbnN0IGhhc2ggPSBkYXRhID0+IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZGF0YSkuZGlnZXN0KCdoZXgnKTsKY29uc3Qgc3RvcCA9IGNvZGUgPT4geyB0aHJvdyBPYmplY3QuYXNzaWduKG5ldyBFcnJvcihjb2RlKSx7Y29kZX0pOyB9OwpmdW5jdGlvbiBhcmNoaXZlUG9saWN5KGVudHJ5LCBmaWxlKSB7CiAgaWYgKHR5cGVvZiBlbnRyeS5yZXNvbHZlZCAhPT0gJ3N0cmluZycgfHwgZW50cnkucmVzb2x2ZWQubGVuZ3RoID4gMjA0OCkgc3RvcCgnQVJDSElWRV9VUkxfSU5WQUxJRCcsIGZpbGUpOwogIGxldCB1cmw7CiAgdHJ5IHsgdXJsID0gbmV3IFVSTChlbnRyeS5yZXNvbHZlZCk7IH0gY2F0Y2ggeyBzdG9wKCdBUkNISVZFX1VSTF9JTlZBTElEJywgZmlsZSk7IH0KICBpZiAodXJsLmhyZWYgIT09IGVudHJ5LnJlc29sdmVkIHx8IHVybC5wcm90b2NvbCAhPT0gJ2h0dHBzOicgfHwgdXJsLmhvc3RuYW1lICE9PSAncmVnaXN0cnkubnBtanMub3JnJwogICAgfHwgdXJsLnVzZXJuYW1lIHx8IHVybC5wYXNzd29yZCB8fCB1cmwucG9ydCB8fCB1cmwuc2VhcmNoIHx8IHVybC5oYXNoCiAgICB8fCAhL15cLyg/OkBbQS1aYS16MC05Xy4tXStcLyk/W0EtWmEtejAtOV8uLV0rXC8tXC9bQS1aYS16MC05Xy4rLV0rXC50Z3okLy50ZXN0KHVybC5wYXRobmFtZSkpIHsKICAgIHN0b3AoJ0FSQ0hJVkVfVVJMX05PVF9BTExPV0VEJywgZmlsZSk7CiAgfQogIGlmICh0eXBlb2YgZW50cnkuaW50ZWdyaXR5ICE9PSAnc3RyaW5nJyB8fCAhL15zaGE1MTItW0EtWmEtejAtOSsvXXs4Nn09PSQvLnRlc3QoZW50cnkuaW50ZWdyaXR5KSkgc3RvcCgnQVJDSElWRV9JTlRFR1JJVFlfSU5WQUxJRCcsIGZpbGUpOwogIGNvbnN0IGRlY29kZWQgPSBCdWZmZXIuZnJvbShlbnRyeS5pbnRlZ3JpdHkuc2xpY2UoNyksICdiYXNlNjQnKTsKICBpZiAoZGVjb2RlZC5sZW5ndGggIT09IDY0IHx8IGRlY29kZWQudG9TdHJpbmcoJ2Jhc2U2NCcpICE9PSBlbnRyeS5pbnRlZ3JpdHkuc2xpY2UoNykpIHN0b3AoJ0FSQ0hJVkVfSU5URUdSSVRZX0lOVkFMSUQnLCBmaWxlKTsKfQoKY29uc3Qgc2hhcGUgPSAvXlwvKD86QFtBLVphLXowLTlfLi1dK1wvKT9bQS1aYS16MC05Xy4tXStcLy1cL1tBLVphLXowLTlfListXStcLnRneiQvOwpjb25zdCBzYWZlVmVyc2lvbiA9IHYgPT4gdHlwZW9mIHY9PT0nc3RyaW5nJyYmL15bMC05QS1aYS16ListXXsxLDEwMH0kLy50ZXN0KHYpP3Y6bnVsbDsKY29uc3Qgc2FmZU5hbWUgPSBuID0+IHR5cGVvZiBuPT09J3N0cmluZycmJi9eKD86QFtBLVphLXowLTlfLi1dK1wvKT9bQS1aYS16MC05Xy4tXSskLy50ZXN0KG4pP246bnVsbDsKY29uc3Qgc2FmZUZpbGUgPSBzID0+IHR5cGVvZiBzPT09J3N0cmluZycmJnMubGVuZ3RoPD01MDAmJi9ebm9kZV9tb2R1bGVzXC8oPzpbQS1aYS16MC05X0AuLV0rXC8pKltBLVphLXowLTlfLi1dKyQvLnRlc3QocykmJiFzLnNwbGl0KCcvJykuc29tZShwPT5wPT09Jy4nfHxwPT09Jy4uJyk/czonUkVEQUNURURfJytoYXNoKFN0cmluZyhzKSkuc2xpY2UoMCwxMik7CmV4cG9ydCBmdW5jdGlvbiBkaWFnbm9zZShlbnRyeSwgZmlsZSl7CiAgY29uc3QgZT1lbnRyeSYmdHlwZW9mIGVudHJ5PT09J29iamVjdCcmJiFBcnJheS5pc0FycmF5KGVudHJ5KT9lbnRyeTp7fTsKICBjb25zdCBvdXQ9e2ZpbGU6c2FmZUZpbGUoZmlsZSksdmVyc2lvbjpzYWZlVmVyc2lvbihlLnZlcnNpb24pLGFyY2hpdmVQb2xpY3k6J1BBU1MnLHJlYXNvbnM6W119OwogIHRyeXthcmNoaXZlUG9saWN5KGUsZmlsZSk7fWNhdGNoKGVycm9yKXtvdXQuYXJjaGl2ZVBvbGljeT1lcnJvci5jb2RlfHwnQ0xBU1NJRklFUl9FUlJPUic7fQogIGNvbnN0IHJhdz1lLnJlc29sdmVkOwogIG91dC5yZXNvbHZlZFR5cGU9cmF3PT09bnVsbD8nbnVsbCc6dHlwZW9mIHJhdzsKICBpZih0eXBlb2YgcmF3IT09J3N0cmluZycpe291dC5yZWFzb25zLnB1c2goJ1JFU09MVkVEX05PVF9TVFJJTkcnKTtyZXR1cm4gb3V0O30KICBvdXQucmF3U2hhMjU2PWhhc2gocmF3KTtvdXQucmF3Qnl0ZXM9QnVmZmVyLmJ5dGVMZW5ndGgocmF3KTsKICBvdXQucmF3Q2hhcmFjdGVyRmxhZ3M9e291dGVyV2hpdGVzcGFjZTpyYXchPT1yYXcudHJpbSgpLGNvbnRyb2xDaGFyYWN0ZXJzOi9bXHgwMC1ceDFmXHg3Zl0vLnRlc3QocmF3KSxiYWNrc2xhc2g6cmF3LmluY2x1ZGVzKCdcXCcpfTsKICBpZihyYXcubGVuZ3RoPjIwNDgpe291dC5yZWFzb25zLnB1c2goJ1VSTF9MRU5HVEhfTElNSVQnKTtyZXR1cm4gb3V0O30KICBsZXQgdTsKICB0cnl7dT1uZXcgVVJMKHJhdyk7fWNhdGNoe291dC5yZWFzb25zLnB1c2goJ1VSTF9QQVJTRV9GQUlMRUQnKTtyZXR1cm4gb3V0O30KICBjb25zdCBjPXtjYW5vbmljYWxTZXJpYWxpemF0aW9uOnUuaHJlZj09PXJhdyxodHRwczp1LnByb3RvY29sPT09J2h0dHBzOicsbnBtUmVnaXN0cnlIb3N0OnUuaG9zdG5hbWU9PT0ncmVnaXN0cnkubnBtanMub3JnJyxjcmVkZW50aWFsc0Fic2VudDohdS51c2VybmFtZSYmIXUucGFzc3dvcmQsbm9uZGVmYXVsdFBvcnRBYnNlbnQ6IXUucG9ydCxxdWVyeUFic2VudDohdS5zZWFyY2gsZnJhZ21lbnRBYnNlbnQ6IXUuaGFzaCxhcmNoaXZlUGF0aFNoYXBlOnNoYXBlLnRlc3QodS5wYXRobmFtZSl9OwogIG91dC5jaGVja3M9YzsKICBjb25zdCBsYWJlbHM9e2Nhbm9uaWNhbFNlcmlhbGl6YXRpb246J05PTkNBTk9OSUNBTF9VUkxfU0VSSUFMSVpBVElPTicsaHR0cHM6J1NDSEVNRV9OT1RfSFRUUFMnLG5wbVJlZ2lzdHJ5SG9zdDonSE9TVF9OT1RfTlBNX1JFR0lTVFJZJyxjcmVkZW50aWFsc0Fic2VudDonVVJMX0NPTlRBSU5TX0NSRURFTlRJQUxTJyxub25kZWZhdWx0UG9ydEFic2VudDonTk9OREVGQVVMVF9QT1JUJyxxdWVyeUFic2VudDonVVJMX0NPTlRBSU5TX1FVRVJZJyxmcmFnbWVudEFic2VudDonVVJMX0NPTlRBSU5TX0ZSQUdNRU5UJyxhcmNoaXZlUGF0aFNoYXBlOidBUkNISVZFX1BBVEhfU0hBUEVfTUlTTUFUQ0gnfTsKICBmb3IoY29uc3QgW2tleSxva10gb2YgT2JqZWN0LmVudHJpZXMoYykpaWYoIW9rKW91dC5yZWFzb25zLnB1c2gobGFiZWxzW2tleV0pOwogIG91dC5ob3N0Q2xhc3M9Yy5ucG1SZWdpc3RyeUhvc3Q/J05QTV9QVUJMSUNfUkVHSVNUUlknOnUuaG9zdG5hbWU9PT0ncmVnaXN0cnkubnBtanMuY29tJz8nTlBNSlNfQ09NX0hPU1QnOnUuaG9zdG5hbWU9PT0ncmVnaXN0cnkueWFybnBrZy5jb20nPydZQVJOX1BVQkxJQ19SRUdJU1RSWSc6J09USEVSX0hPU1RfUkVEQUNURUQnOwogIGlmKCFjLm5wbVJlZ2lzdHJ5SG9zdClvdXQuaG9zdFNoYTI1Nj1oYXNoKHUuaG9zdG5hbWUpOwogIG91dC5wYXRoRW5jb2Rpbmc9e3BlcmNlbnRFc2NhcGU6LyVbMC05QS1GYS1mXXsyfS8udGVzdCh1LnBhdGhuYW1lKSxlbmNvZGVkU2xhc2g6LyUyZi9pLnRlc3QodS5wYXRobmFtZSksZW5jb2RlZEF0Oi8lNDAvaS50ZXN0KHUucGF0aG5hbWUpLGVuY29kZWRCYWNrc2xhc2g6LyU1Yy9pLnRlc3QodS5wYXRobmFtZSksbWFsZm9ybWVkUGVyY2VudDovJSg/IVswLTlBLUZhLWZdezJ9KS8udGVzdCh1LnBhdGhuYW1lKX07CiAgbGV0IGRlY29kZWQ7dHJ5e2RlY29kZWQ9ZGVjb2RlVVJJQ29tcG9uZW50KHUucGF0aG5hbWUpO31jYXRjaHtkZWNvZGVkPW51bGw7fQogIG91dC5kZWNvZGVkUGF0aEhhc0FyY2hpdmVTaGFwZT10eXBlb2YgZGVjb2RlZD09PSdzdHJpbmcnJiZzaGFwZS50ZXN0KGRlY29kZWQpOwogIC8vIFJldmVhbCBvbmx5IHRoZSBleHBlY3RlZCBwYWNrYWdlL3ZlcnNpb24gcGF0aC4gQXJiaXRyYXJ5IFVSTCBwYXlsb2FkcyByZW1haW4gcmVkYWN0ZWQuCiAgY29uc3QgbG9naWNhbD1maWxlLnNwbGl0KCcvbm9kZV9tb2R1bGVzLycpLmF0KC0xKS5yZXBsYWNlKC9ebm9kZV9tb2R1bGVzXC8vLCcnKTsKICBjb25zdCBuYW1lPXNhZmVOYW1lKGUubmFtZSl8fHNhZmVOYW1lKGxvZ2ljYWwpLHZlcnNpb249c2FmZVZlcnNpb24oZS52ZXJzaW9uKTsKICBjb25zdCBleHBlY3RlZD1uYW1lJiZ2ZXJzaW9uPycvJytuYW1lKycvLS8nK25hbWUuc3BsaXQoJy8nKS5hdCgtMSkrJy0nK3ZlcnNpb24rJy50Z3onOm51bGw7CiAgb3V0LmV4cGVjdGVkUGFja2FnZUFyY2hpdmVNYXRjaD1leHBlY3RlZD91LnBhdGhuYW1lPT09ZXhwZWN0ZWQ6bnVsbDsKICBvdXQuZGVjb2RlZEV4cGVjdGVkUGFja2FnZUFyY2hpdmVNYXRjaD1leHBlY3RlZD9kZWNvZGVkPT09ZXhwZWN0ZWQ6bnVsbDsKICBpZihjLm5wbVJlZ2lzdHJ5SG9zdCYmYy5jcmVkZW50aWFsc0Fic2VudCYmYy5xdWVyeUFic2VudCYmYy5mcmFnbWVudEFic2VudCYmZXhwZWN0ZWQmJih1LnBhdGhuYW1lPT09ZXhwZWN0ZWR8fGRlY29kZWQ9PT1leHBlY3RlZCkpb3V0LmV4cGVjdGVkUHVibGljUGF0aD1leHBlY3RlZDsKICBpZihvdXQuYXJjaGl2ZVBvbGljeT09PSdBUkNISVZFX0lOVEVHUklUWV9JTlZBTElEJylvdXQucmVhc29ucy5wdXNoKCdTSEE1MTJfSU5URUdSSVRZX0ZPUk1BVF9JTlZBTElEJyk7CiAgcmV0dXJuIG91dDsKfQpleHBvcnQgZnVuY3Rpb24gZGlhZ25vc2VBbGwobG9jayl7CiAgaWYoIWxvY2t8fHR5cGVvZiBsb2NrIT09J29iamVjdCd8fCFsb2NrLnBhY2thZ2VzfHx0eXBlb2YgbG9jay5wYWNrYWdlcyE9PSdvYmplY3QnfHxBcnJheS5pc0FycmF5KGxvY2sucGFja2FnZXMpKXRocm93IE9iamVjdC5hc3NpZ24obmV3IEVycm9yKCdMT0NLX1NUUlVDVFVSRScpLHtjb2RlOidMT0NLX1NUUlVDVFVSRSd9KTsKICBjb25zdCBlbnRyaWVzPU9iamVjdC5lbnRyaWVzKGxvY2sucGFja2FnZXMpLmZpbHRlcigoW3BdKT0+cCE9PScnKS5zb3J0KChbYV0sW2JdKT0+YTxiPy0xOmE+Yj8xOjApOwogIGlmKGVudHJpZXMubGVuZ3RoPDF8fGVudHJpZXMubGVuZ3RoPjIwMDAwKXRocm93IE9iamVjdC5hc3NpZ24obmV3IEVycm9yKCdMT0NLX0NPVU5UX0xJTUlUJykse2NvZGU6J0xPQ0tfQ09VTlRfTElNSVQnfSk7CiAgY29uc3Qgcm93cz1lbnRyaWVzLm1hcCgoW3AsZV0pPT5kaWFnbm9zZShlLHApKTsKICBjb25zdCBmYWlsZWQ9cm93cy5maWx0ZXIocj0+ci5hcmNoaXZlUG9saWN5IT09J1BBU1MnKSxjb3VudHM9e307CiAgZm9yKGNvbnN0IHIgb2YgZmFpbGVkKWZvcihjb25zdCB3aHkgb2Ygci5yZWFzb25zKWNvdW50c1t3aHldPShjb3VudHNbd2h5XXx8MCkrMTsKICByZXR1cm4ge3BhY2thZ2VDb3VudDpyb3dzLmxlbmd0aCxhcmNoaXZlUmVqZWN0ZWRDb3VudDpmYWlsZWQubGVuZ3RoLHJlamVjdGlvblJlYXNvbnM6Y291bnRzLHNlbGVjdGVkOnJvd3MuZmluZChyPT5yLmZpbGU9PT0nbm9kZV9tb2R1bGVzL0BhbGxvYy9xdWljay1scnUnKXx8bnVsbCxmYWlsZWQsc2NvcGU6J0FSQ0hJVkVfRklFTERTX09OTFlfTk9UX0ZVTExfTE9DS19QT0xJQ1lfT1JfSU5TVEFMTF9BVVRIT1JJWkFUSU9OJ307Cn0K';
const DIAGNOSTIC_HELPER_SHA='1ebb49394e86a42357ec0b649bc7c3775826d8e3271cdaf804c39a6e5023e472';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const EXPECTED_ROOT='/home/runner/workspace';
const EXPECTED_NODE='v24.13.0';
const PINS={'package.json':'0f7ef43511c004e3d268a2e2840d46a264453892937f5a2eb6a680b01481c1e0','package-lock.json':'648b869facffba16150769018ee062210691bd4ff10819ca379f501bfdb8d287'};
const PRIOR_RUN='r16a-1jiu7A';
const PRIOR_COMMAND_SHA='747d455e65568aac111328ef25adef876346270f990434b0ed5b8e841af62ae9';
const PRIOR_POLICY_SHA='0d32a375e7f43b58a809f5f902e971d6030512729927b4f4f19668610c0f7404';
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const gate=(ok,code)=>{if(!ok)throw Object.assign(new Error(code),{code});};
let reportDir,before={},complete=false,phase='PREFLIGHT';
const observed=new Map();
const result={project:'MyMentalHealthBuddy',status:'ARCHIVE_URL_DIAGNOSTIC_FAILED',releaseReady:false,npmStarted:false,workspaceDependencyAlignment:'UNCHANGED_PENDING',applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN'};
const root=fs.realpathSync('.');
function readSafe(rel,limit=32*1024*1024,optional=false){
  let file=root;
  for(const part of rel.split('/')){
    gate(part&&part!=='.'&&part!=='..','READ_PATH_INVALID');file=path.join(file,part);
    let st;try{st=fs.lstatSync(file);}catch(e){if(optional&&e.code==='ENOENT')return {identity:{state:'ABSENT'}};throw e;}
    gate(!st.isSymbolicLink(),'READ_SYMLINK');
  }
  const fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);
  try{
    const st=fs.fstatSync(fd);gate(st.isFile()&&st.size<=limit,'READ_FILE_LIMIT');
    const raw=fs.readFileSync(fd),after=fs.fstatSync(fd);
    gate(st.dev===after.dev&&st.ino===after.ino&&st.mtimeMs===after.mtimeMs&&st.size===after.size&&raw.length===st.size,'INPUT_CHANGED_DURING_READ');
    return {identity:{state:'FILE',sha256:hash(raw),bytes:raw.length,mode:st.mode},raw};
  }finally{fs.closeSync(fd);}
}
function observe(rel,limit,optional=false){const r=readSafe(rel,limit,optional);observed.set(rel,{identity:r.identity,limit,optional});return r;}
function safeCode(e){return typeof e.code==='string'&&/^[A-Z][A-Z0-9_]{0,100}$/.test(e.code)?e.code:'DIAGNOSTIC_DRIVER_FAILURE';}
function save(name,value){fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});}
try{
  gate(root===EXPECTED_ROOT,'WORKSPACE_IDENTITY');gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','NODE_PLATFORM_IDENTITY');
  // R16A already created this reserved private directory. Never recreate old runs.
  const ev=path.join(root,'.mmhb-release-evidence'),st=fs.lstatSync(ev);
  gate(st.isDirectory()&&!st.isSymbolicLink()&&fs.realpathSync(ev)===ev&&st.uid===process.getuid()&&(st.mode&0o777)===0o700,'EVIDENCE_DIRECTORY_BOUNDARY');
  const ig=observe('.mmhb-release-evidence/.gitignore',16);
  gate(ig.raw.toString()==='*\n'&&(ig.identity.mode&0o777)===0o600,'EVIDENCE_IGNORE_BOUNDARY');
  process.umask(0o077);reportDir=fs.mkdtempSync(path.join(ev,'r16b-'));
  console.log('COMMAND_ID=MMHB-ARCHIVE-URL-DIAGNOSTIC-R16B');console.log('UTC='+new Date().toISOString());console.log('REPORT_DIRECTORY='+reportDir);
  phase='CURRENT_MANIFEST_IDENTITIES';
  const pair={};
  for(const [file,expected] of Object.entries(PINS)){
    pair[file]=observe(file);before[file]=pair[file].identity;
    gate(pair[file].identity.sha256===expected,'CURRENT_MANIFEST_DRIFT');
  }
  result.inputs=before;
  const manifest=JSON.parse(pair['package.json'].raw),lock=JSON.parse(pair['package-lock.json'].raw);
  gate(manifest.name==='mymentalhealthbuddy'&&lock.name===manifest.name&&lock.lockfileVersion===3,'LOCK_IDENTITY');
  phase='VERIFIER_IDENTITY_OBSERVATION';
  result.verifierObservations=[];
  for(const [file,expected] of [['MMHB-LOCKED-DEPENDENCIES-R16A.txt',PRIOR_COMMAND_SHA],['.mmhb-release-evidence/'+PRIOR_RUN+'/policy-r16.mjs',PRIOR_POLICY_SHA]]){
    const r=observe(file,2*1024*1024,true);
    result.verifierObservations.push({file,state:r.identity.state,sha256:r.identity.sha256,expectedSha256:expected,matches:r.identity.state==='FILE'?r.identity.sha256===expected:null});
  }
  phase='ARCHIVE_CLASSIFICATION';
  const helperRaw=Buffer.from(DIAGNOSTIC_HELPER_B64,'base64');gate(hash(helperRaw)===DIAGNOSTIC_HELPER_SHA,'DIAGNOSTIC_HELPER_IDENTITY');
  const helper=await import('data:text/javascript;base64,'+DIAGNOSTIC_HELPER_B64);
  const full=helper.diagnoseAll(lock);
  save('archive-url-findings.json',full);
  result.diagnostic={...full,failed:undefined,rejectedExamples:full.failed.slice(0,12),allFindingsFile:'archive-url-findings.json',helperSha256:DIAGNOSTIC_HELPER_SHA};
  result.priorEvidence='R16A_REPORTED_ARCHIVE_URL_NOT_ALLOWED_NPM_NOT_STARTED';
  complete=true;
}catch(e){result.failure={gate:safeCode(e),phase};}
finally{
  const changed=[];
  for(const [file,prior] of observed)try{
    const current=readSafe(file,prior.limit,prior.optional).identity;
    if(JSON.stringify(current)!==JSON.stringify(prior.identity))changed.push(file);
  }catch(e){changed.push(file);}
  result.preservation={scope:'SELECTED_MANIFEST_VERIFIER_AND_IGNORE_FILE_OBSERVATIONS_ONLY',changedFiles:changed,observedFiles:observed.size,fullWorktree:'NOT_OBSERVED'};
  if(changed.length){result.failure={gate:'OBSERVED_INPUT_CHANGED',phase:'FINAL_PRESERVATION',previousFailure:result.failure};complete=false;}
  result.status=complete?'ARCHIVE_URL_DIAGNOSTIC_COMPLETE_NOT_INSTALL':'ARCHIVE_URL_DIAGNOSTIC_FAILED';
  result.limitations=['Archive classification only; no URL is approved, rewritten or fetched.','Arbitrary URLs, credentials, query and fragment values are not printed or saved.','Current root package manifests must match the prior reported hashes. Source trees and all dependencies are not requalified.','Selected before/after observations do not lock editors or enforce operating-system isolation.','The missing R15 candidate is not recreated; fresh builds remain required.'];
  result.evidenceWrite=reportDir?'SAVED':'REPORT_NOT_CREATED';
  if(reportDir)try{save('archive-url-diagnostic-evidence.json',result);}catch(e){result.evidenceWrite='FAILED';result.failure={gate:safeCode(e),phase:'EVIDENCE_WRITE'};complete=false;result.status='ARCHIVE_URL_DIAGNOSTIC_FAILED';}
  console.log(JSON.stringify(result,null,2));
  console.log('SOURCE_EDIT=0 PACKAGE_EDIT=0 PACKAGE_INSTALL=0 NPM_STARTED=0 NETWORK_REQUEST=0 APPLICATION_STARTED=0 DATABASE_CONNECTION=0');
  console.log('GIT_STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);console.log('NEXT_ACTION=RETURN_COMPLETE_TERMINAL_SUMMARY');process.exitCode=complete?0:1;
}
