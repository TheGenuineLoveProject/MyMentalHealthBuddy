import fs from "fs";
import path from "path";

function readSafe(p, hint) {
  try {
    const raw = fs.readFileSync(p, "utf8")
      .replace(/^\s*module\.exports\s*=\s*/,"")
      .replace(/;?\s*$/,"")
      .replace(/,\s*([}\]])/g,"$1");
    return JSON.parse(raw);
  } catch {
    return { name: hint ?? path.basename(path.dirname(p)), version:"1.0.0", private:true, type:"module", scripts:{} };
  }
}
function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive:true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}
function ensure(o,k,v){ if(o[k]===undefined) o[k]=v; }

function healRoot(p) {
  const pkg = readSafe(p, "mmhb-monorepo");
  ensure(pkg,"private",true);
  pkg.type = "module";
  ensure(pkg,"scripts",{});
  pkg.scripts["fix"] = "node scripts/autoheal-json.mjs";
  pkg.scripts["start:all"] = "concurrently -k \"npm --prefix apps/server run dev\" \"npm --prefix apps/client run start\"";
  pkg.scripts["start:heal"] = "node scripts/autoheal-json.mjs && npm install --prefer-offline --no-audit && npm run start:all";
  ensure(pkg,"devDependencies",{});
  Object.assign(pkg.devDependencies,{
    concurrently:"^9.0.0", typescript:"^5.6.3", tsx:"^4.19.1", "cross-env":"^7.0.3"
  });
  writeJson(p,pkg);
}
function healServer(p) {
  const pkg = readSafe(p,"server");
  pkg.type = "commonjs"; // fix require()/ESM conflict
  ensure(pkg,"scripts",{});
  pkg.scripts["dev"]   = pkg.scripts["dev"]   ?? "tsx src/index.ts || node src/index.js";
  pkg.scripts["start"] = pkg.scripts["start"] ?? "node dist/index.js";
  ensure(pkg,"dependencies",{});
  Object.assign(pkg.dependencies,{
    express:"^4.19.2", "express-session":"^1.17.3",
    cors:"^2.8.5", helmet:"^7.0.0", compression:"^1.7.4", morgan:"^1.10.0", zod:"^3.23.8"
  });
  ensure(pkg,"devDependencies",{});
  Object.assign(pkg.devDependencies,{
    typescript:"^5.6.3", tsx:"^4.19.1",
    "@types/express":"^4.17.21", "@types/express-session":"^1.17.8",
    "@types/cors":"^2.8.17", "@types/morgan":"^1.9.9", "@types/node":"^20.11.30"
  });
  writeJson(p,pkg);
}
function healClient(p) {
  const pkg = readSafe(p,"client");
  pkg.type = "module";
  ensure(pkg,"scripts",{});
  pkg.scripts["start"] = pkg.scripts["start"] ?? "vite --port 5173 --host 0.0.0.0 --strictPort";
  ensure(pkg,"dependencies",{});
  Object.assign(pkg.dependencies,{ react:"^18.3.1", "react-dom":"^18.3.1" });
  ensure(pkg,"devDependencies",{});
  Object.assign(pkg.devDependencies,{
    vite:"^5.4.12", tailwindcss:"^3.4.13", postcss:"^8.4.47", autoprefixer:"^10.4.20",
    "@types/react":"^18.3.7","@types/react-dom":"^18.3.0"
  });
  writeJson(p,pkg);
}

const root = process.cwd();
healRoot(path.join(root,"package.json"));

const appsDir = path.join(root,"apps");
if (fs.existsSync(appsDir)) {
  for (const name of fs.readdirSync(appsDir)) {
    const pkgP = path.join(appsDir,name,"package.json");
    if (!fs.existsSync(pkgP)) continue;
    if (name==="server") healServer(pkgP);
    else if (name==="client") healClient(pkgP);
    else {
      // generic apps/*: keep minimal valid json
      const pkg = readSafe(pkgP,name);
      pkg.type = pkg.type ?? "module";
      pkg.scripts = pkg.scripts ?? {};
      writeJson(pkgP,pkg);
    }
  }
}
console.log("JSON healed for root + apps/*.");
