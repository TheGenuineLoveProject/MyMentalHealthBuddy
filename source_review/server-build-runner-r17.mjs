import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
const [root,out]=process.argv.slice(2);let phase='CONTEXT';
const check=(ok,code)=>{if(!ok)throw Object.assign(new Error(code),{code});};
const hash=raw=>crypto.createHash('sha256').update(raw).digest('hex');
try {
  check(/^\/tmp\/mmhb-build-r17-[A-Za-z0-9]+$/.test(root)&&fs.realpathSync(root)===root&&process.cwd()===root,'BUILD_ROOT');
  check(fs.realpathSync(out)===out&&path.basename(out)==='server-build','SERVER_OUTPUT_ROOT');
  check(process.env.NODE_ENV==='production','PRODUCTION_ENV');
  const req=createRequire(path.join(root,'package.json'));
  const target=req.resolve('esbuild');check(target.startsWith(root+'/node_modules/esbuild/'),'COMPILER_RESOLUTION');
  // Demand the installed Linux binary. Do not trigger esbuild's missing-binary install fallback.
  const binary=path.join(root,'node_modules/@esbuild/linux-x64/bin/esbuild');
  check(fs.lstatSync(binary).isFile()&&fs.realpathSync(binary)===binary,'ESBUILD_PLATFORM_BINARY_REQUIRED');
  phase='IMPORT_COMPILER';const esbuild=await import(pathToFileURL(target).href);
  check(esbuild.version==='0.28.2','ESBUILD_VERSION');
  const outfile=path.join(out,'server.mjs'); const builds=[];
  try {
    for(let attempt=1;attempt<=2;attempt++) {
      phase='SERVER_COMPILE_'+attempt;
      const result=await esbuild.build({absWorkingDir:root,entryPoints:['server/app.mjs'],bundle:true,platform:'node',format:'esm',target:'node24',
        outfile,tsconfig:path.join(root,'tsconfig.json'),metafile:true,logLevel:'warning',
        external:['pg-native','pg-cloudflare','bufferutil','utf-8-validate','bcrypt'],
        banner:{js:"import { createRequire as __createRequire } from 'node:module';\nconst require = __createRequire(import.meta.url);"}});
      fs.writeFileSync(path.join(out,'meta-'+attempt+'.json'),JSON.stringify(result.metafile,null,2),{flag:'wx',mode:0o600});
      builds.push({attempt,sha256:hash(fs.readFileSync(outfile)),warnings:result.warnings.length});
    }
    check(builds[0].sha256===builds[1].sha256,'SERVER_REPEATABILITY');
    fs.writeFileSync(path.join(out,'build.json'),JSON.stringify({status:'SERVER_BUILD_PASS',builds,compilerVersion:esbuild.version}),{flag:'wx',mode:0o600});
  }finally {esbuild.stop();}
}catch(error){
  fs.writeFileSync(path.join(out,'error.json'),JSON.stringify({phase,code:/^[A-Z0-9_]{1,100}$/.test(error.code||'')?error.code:'SERVER_COMPILATION_FAILED',
    privateMessage:String(error.message).slice(0,32768),privateErrors:error.errors?.slice(0,10)}),{flag:'wx',mode:0o600});
  process.exitCode=1;
}
