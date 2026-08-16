import fs from"node:fs";
const L="docs/API_CONTRACT_LOCK.json",A="server/app.mjs",F=[],P=[];
const ok=x=>{P.push(x);console.log("PASS "+x)},bad=x=>{F.push(x);console.error("FAIL "+x)},rd=x=>fs.readFileSync(x,"utf8"),e=x=>x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
let j;try{j=JSON.parse(rd(L));ok("lock JSON")}catch(x){bad("lock JSON "+x.message);j={}};
const app=rd(A),owners=[["/ai/","/api/ai","aiRoutes","server/routes/ai.mjs"],["/auth/","/api/auth","authRoutes","server/routes/auth.mjs"],["/session-boundary/","/api/session-boundary","sessionBoundaryRoutes","server/routes/session-boundary.mjs"]];
j.version?ok("version="+j.version):bad("version missing");j.baseUrl==="/api"?ok("baseUrl=/api"):bad("baseUrl="+j.baseUrl);
const E=Object.entries(j.endpoints||{}),seen=new Set();E.length?ok("endpoints="+E.length):bad("no endpoints");
for(const[n,v]of E){const m=String(v.method||"").toUpperCase(),p=String(v.path||""),a=String(v.auth||""),s=v.expectedStatus??v.successStatus,id=m+" "+p;console.log("\n--- "+n+" ---");seen.has(id)?bad(n+" duplicate "+id):(seen.add(id),ok(n+" "+id));Number.isInteger(s)?ok(n+" success="+s):bad(n+" success missing");Array.isArray(v.requiredHeaders||[])?ok(n+" headers valid"):bad(n+" headers invalid");Object.values(v.failureCases||{}).every(Number.isInteger)?ok(n+" failure cases valid"):bad(n+" failure cases invalid");
if(p==="/health"){new RegExp("app\\."+m.toLowerCase()+"\\(\\s*[\"']"+e(p)+"[\"']").test(app)?ok(n+" route"):bad(n+" route missing");continue}
const o=owners.find(x=>p.startsWith(x[0]));if(!o){bad(n+" owner missing");continue}const src=rd(o[3]),local=p.slice(o[0].length-1),mount=new RegExp("app\\.use\\(\\s*[\"']"+e(o[1])+"[\"'][^;\\n]*\\b"+o[2]+"\\b"),rr=new RegExp("router\\."+m.toLowerCase()+"\\(\\s*[\"']"+e(local)+"[\"']"),q=rr.exec(src);mount.test(app)?ok(n+" mount"):bad(n+" mount missing");if(!q){bad(n+" owner route missing");continue}ok(n+" owner route");const sn=src.slice(q.index,q.index+1200);a==="bearer"?(sn.includes("requireAuth")?ok(n+" bearer"):bad(n+" requireAuth missing")):a==="guest-or-bearer"?(sn.includes("optionalAuth")?ok(n+" guest-or-bearer"):bad(n+" optionalAuth missing")):a==="none"?ok(n+" auth none"):bad(n+" auth="+a)}
console.log("\nEndpoints evaluated: "+E.length+"\nPasses: "+P.length+"\nFailures: "+F.length);if(F.length){console.error("API_CONTRACT_LOCK_STATIC_VERIFY_FAIL");process.exit(1)}console.log("API_CONTRACT_LOCK_STATIC_VERIFY_PASS");

const csrfModes = new Set([
  "pre-global-middleware",
  "safe-method",
  "bypass-bearer-or-x-guest-id",
  "required-unless-bearer-or-x-guest-id",
  "exempt-auth-prefix",
]);
const csrfFailures = [];
const cp = j.csrfPolicy || {};

if (cp.header !== "x-csrf-token") csrfFailures.push("csrfPolicy.header");
if (cp.tokenEndpoint !== "/api/session-boundary/csrf-token") csrfFailures.push("csrfPolicy.tokenEndpoint");
if (cp.failureStatus !== 403) csrfFailures.push("csrfPolicy.failureStatus");
if (JSON.stringify(cp.safeMethods || []) !== JSON.stringify(["GET","HEAD","OPTIONS"]))
  csrfFailures.push("csrfPolicy.safeMethods");
if (JSON.stringify(cp.bypasses || []) !== JSON.stringify(["bearer","x-guest-id"]))
  csrfFailures.push("csrfPolicy.bypasses");

for (const [name, ep] of Object.entries(j.endpoints || {})) {
  if (!csrfModes.has(ep.csrf)) csrfFailures.push(`${name}.csrf`);
  if (ep.csrf === "required-unless-bearer-or-x-guest-id" &&
      ep.failureCases?.csrf !== 403) {
    csrfFailures.push(`${name}.failureCases.csrf`);
  }
}

console.log("\n--- CSRF CONTRACT METADATA ---");
if (csrfFailures.length) {
  for (const x of csrfFailures) console.error("FAIL csrf " + x);
  console.error("API_CONTRACT_LOCK_CSRF_VERIFY_FAIL");
  process.exit(1);
}
console.log("API_CONTRACT_LOCK_CSRF_VERIFY_PASS");
