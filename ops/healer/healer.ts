import { execa } from "execa"; import simpleGit from "simple-git";
const git=simpleGit(); export type FixResult={type:string;ok:boolean;message?:string};
async function lintFix():Promise<FixResult>{try{await execa("npx",["eslint","..","--fix"],{stdio:"inherit"});return{type:"lint-fix",ok:true,message:"eslint --fix applied"}}catch(e:any){return{type:"lint-fix",ok:false,message:e?.message}}}
async function patchDeps():Promise<FixResult>{try{await execa("npx",["npm-check-updates","-u","--target=patch"],{stdio:"inherit"});await execa("npm",["install"],{stdio:"inherit"});return{type:"dep-patch",ok:true,message:"patched deps + installed"}}catch(e:any){return{type:"dep-patch",ok:false,message:e?.message}}}
async function regenLock():Promise<FixResult>{try{await execa("npm",["ci"],{stdio:"inherit"});return{type:"regen-lock",ok:true,message:"lockfile regenerated"}}catch(e:any){return{type:"regen-lock",ok:false,message:e?.message}}}
export async function runAutoFixes(){return[await lintFix(),await patchDeps(),await regenLock()]}
export async function createBranchCommitPush(){const b=`healer/auto-${Date.now()}`;await git.checkoutLocalBranch(b);await git.add(".");await git.commit("chore(healer): automated safe fixes");try{await git.push("origin",b)}catch{}return b}
