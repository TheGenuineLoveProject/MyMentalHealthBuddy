import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export function requireThat(ok, code, file) { if (!ok) throw Object.assign(new Error(code), {code, ...(file?{file}:{})}); }
export const within = (base, full) => full.startsWith(base + path.sep);
export function safeRelative(rel) {
  return typeof rel==='string' && rel.length>0 && rel.length<=4096 && !path.isAbsolute(rel)
    && !/[\x00-\x1f\x7f\\]/.test(rel) && !rel.split('/').some(x=>!x||x==='.'||x==='..');
}
export function directory(full) {
  requireThat(path.isAbsolute(full)&&path.normalize(full)===full,'DIRECTORY_PATH');
  const st=fs.lstatSync(full);
  requireThat(st.isDirectory()&&!st.isSymbolicLink()&&fs.realpathSync(full)===full,'DIRECTORY_BOUNDARY');
}
export function fileIdentity(base,rel) {
  requireThat(safeRelative(rel),'FILE_PATH'); directory(base);
  const full=path.join(base,rel); let cursor=base;
  for(const part of rel.split('/')) {cursor=path.join(cursor,part);requireThat(!fs.lstatSync(cursor).isSymbolicLink(),'FILE_SYMLINK',rel);}
  const st=fs.lstatSync(full);requireThat(st.isFile()&&st.size<=512*1024**2,'FILE_SIZE_OR_TYPE',rel);
  const fd=fs.openSync(full,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);const h=crypto.createHash('sha256'),buf=Buffer.allocUnsafe(1024**2);
  try {let n;while((n=fs.readSync(fd,buf,0,buf.length,null))>0)h.update(buf.subarray(0,n));}
  finally {fs.closeSync(fd);}
  const after=fs.lstatSync(full);
  requireThat(['dev','ino','mode','size','mtimeMs','ctimeMs'].every(k=>st[k]===after[k]),'FILE_CHANGED',rel);
  return {file:rel,type:'file',sha256:h.digest('hex'),bytes:st.size,mode:st.mode};
}
export function regularTree(base,skip=()=>false) {
  directory(base);const rows=[];let bytes=0,entries=0;
  function walk(dir,depth) {
    requireThat(depth<100,'TREE_DEPTH');directory(dir);
    for(const name of fs.readdirSync(dir).sort()) {
      requireThat(++entries<=100000,'TREE_ENTRY_LIMIT');
      const full=path.join(dir,name),rel=path.relative(base,full);
      requireThat(safeRelative(rel),'TREE_PATH');
      if(skip(rel))continue;
      const st=fs.lstatSync(full);requireThat(!st.isSymbolicLink(),'SOURCE_OR_OUTPUT_SYMLINK',rel);
      if(st.isDirectory())walk(full,depth+1);
      else {const row=fileIdentity(base,rel);bytes+=row.bytes;rows.push(row);requireThat(bytes<=2*1024**3&&rows.length<=30000,'TREE_SIZE_LIMIT');}
    }
  }
  walk(base,0);return {rows,bytes,manifestSha256:digest(JSON.stringify(rows))};
}
export const sourceSkip = rel => rel.split('/').some(x=>['.git','node_modules','.vite','dist','coverage'].includes(x)
  || /^\.env(?:\.|$)/i.test(x) || x==='.npmrc' || /\.(pem|key|p12|pfx)$/i.test(x));
export function copyRows(from,to,rows,{links=false}={}) {
  directory(from);directory(to);const names=new Set();
  for(const row of rows) {
    requireThat(safeRelative(row.file)&&!names.has(row.file),'COPY_ROW_PATH');names.add(row.file);
    const target=path.join(to,row.file);fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
    requireThat(fs.realpathSync(path.dirname(target))===path.dirname(target),'COPY_PARENT_SYMLINK');
    if(row.type==='symlink') {
      requireThat(links&&path.basename(path.dirname(row.file))==='.bin'&&typeof row.link==='string'
        &&!path.isAbsolute(row.link)&&within(path.join(to,'node_modules'),path.resolve(path.dirname(target),row.link)),'COPY_LINK_BOUNDARY');
      requireThat(fs.readlinkSync(path.join(from,row.file))===row.link,'COPY_LINK_CHANGED');fs.symlinkSync(row.link,target);
    }else {
      const current=fileIdentity(from,row.file);requireThat(current.sha256===row.sha256&&current.bytes===row.bytes&&current.mode===row.mode,'COPY_SOURCE_CHANGED',row.file);
      fs.copyFileSync(path.join(from,row.file),target,fs.constants.COPYFILE_EXCL|fs.constants.COPYFILE_FICLONE);
      fs.chmodSync(target,row.mode&0o777);
      const copied=fileIdentity(to,row.file);requireThat(copied.sha256===row.sha256&&copied.bytes===row.bytes&&copied.mode===row.mode,'COPY_IDENTITY_MISMATCH',row.file);
    }
  }
}
export function verifyBuildInputs(meta,root,inventory) {
  requireThat(meta&&meta.inputs&&meta.outputs&&Object.keys(meta.inputs).length>0,'SERVER_META_INVALID');
  const byName=new Map(inventory.map(x=>[x.file,x])); const files=[];
  for(const input of Object.keys(meta.inputs).sort()) {
    const absolute=path.resolve(root,input),rel=path.relative(root,absolute);
    requireThat(within(root,absolute)&&byName.has(rel),'SERVER_INPUT_NOT_IN_SNAPSHOT',rel);
    const actual=fileIdentity(root,rel),expected=byName.get(rel);
    requireThat(actual.sha256===expected.sha256&&actual.bytes===expected.bytes,'SERVER_INPUT_CHANGED',rel);files.push(rel);
  }
  return files;
}
export function verifyFrontend(base,evidence) {
  const tree=regularTree(base),names=new Set(tree.rows.map(x=>x.file));
  requireThat(evidence?.status==='FRONTEND_COMPILED_CANDIDATE_NOT_RELEASE'&&Array.isArray(evidence.emitted),'FRONTEND_EVIDENCE');
  requireThat(names.has('index.html')&&tree.rows.some(x=>x.file.endsWith('.css')&&x.bytes>0),'FRONTEND_OUTPUTS');
  requireThat(evidence.emitted.some(x=>x.type==='chunk'&&x.isEntry&&names.has(x.fileName)),'FRONTEND_ENTRY');
  let localReferences=0,externalReferences=0;
  for(const row of evidence.emitted) {
    requireThat(names.has(row.fileName),'FRONTEND_EMITTED_MISSING',row.fileName);
    for(const kind of ['imports','dynamicImports','referencedFiles','css','assets'])for(const ref of row[kind]||[]) {
      if(names.has(ref))localReferences++;
      else if(/^(?:https?:|data:|\/\/)/.test(ref))externalReferences++;
      else requireThat(false,'FRONTEND_LOCAL_REFERENCE_MISSING',ref);
    }
  }
  const rootURL=new URL('https://mmhb.invalid/');
  const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
  for(const m of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
    const attrs=new Map([...m[0].matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(x=>[x[1].toLowerCase(),x[2]??x[3]]));
    const ref=m[1].toLowerCase()==='script'?attrs.get('src'):/^(stylesheet|modulepreload)$/i.test(attrs.get('rel')||'')?attrs.get('href'):undefined;
    if(ref===undefined)continue;const url=new URL(ref,rootURL);
    if(url.origin!==rootURL.origin){externalReferences++;continue;}
    const rel=decodeURIComponent(url.pathname).slice(1);requireThat(safeRelative(rel)&&names.has(rel),'FRONTEND_HTML_REFERENCE_MISSING',rel);localReferences++;
  }
  return {tree,localReferences,externalReferences,scope:'BUNDLER_REFERENCES_AND_QUOTED_HTML_ATTRIBUTES_NOT_BROWSER_VALIDATION'};
}
