import fs from "fs";

const file = "client/src/content/routes.js";
const text = fs.readFileSync(file,"utf8");

const paths = [...text.matchAll(/path:\s*['"\`](.*?)['"\`]/g)]
.map(m=>m[1]);

const dupes = paths.filter((p,i)=>paths.indexOf(p)!==i);

console.log("\\n===== ROUTE AUDIT =====");
console.log("Total Routes:", paths.length);

if(dupes.length){
  console.log("DUPLICATES:");
  [...new Set(dupes)].forEach(d=>console.log("-",d));
  process.exit(1);
}

console.log("No duplicate routes.");

const protectedPatterns = [
  "/healing",
  "/crisis",
  "/pricing",
  "/admin",
  "/journal",
  "/dashboard"
];

console.log("\\nProtected Route Presence:");

protectedPatterns.forEach(p=>{
  const found = paths.some(x=>x.startsWith(p));
  console.log(found ? "PASS" : "FAIL", p);
});

console.log("\\nGREEN: route audit complete");
