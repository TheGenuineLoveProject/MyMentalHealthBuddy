import fs from "fs";
import path from "path";

function clean(raw){
  return String(raw)
    .replace(/^\s*module\.exports\s*=\s*/,"")
    .replace(/;?\s*$/,"")
    .replace(/,\s*([}\]])/g,"$1"); // strip trailing commas
}

function readJsonSafe(file, hintName){
  try{
    const cleaned = clean(fs.readFileSync(file,"utf8"));
    return JSON.parse(cleaned);
  }catch{
    // minimal sane default, keeps repo bootable
    return {
      name: hintName || path.basename(path.dirname(file)),
      version: "1.0.0",
      private: true,
      type: "module",
      scripts: {}
    };
  }
}

function ensure(obj, key, val){
  if (obj[key] === undefined) obj[key] = val;
}

function merge(obj, add){
  for (const [k,v] of Object.entries(add||{})){
    if (v && typeof v === "object" && !Array.isArray(v)){
      obj[k] ??= {};
      merge(obj[k], v);
    } else {
      obj[k] ??= v;
    }
  }
}

function writeJson(file, obj){
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2)+"\n");
}

function isServerPkg(p){
  return /(^|\/)apps\/server(\/|$)/.test(p);
}

function isClientPkg(p){
  return /(^|\/)apps\/client(\/|$)/.test(p);
}

function healOne(pkgPath){
  const pkg = readJsonSafe(pkgPath, path.basename(path.dirname(pkgPath)) || "mmhb");
  const dir = path.dirname(pkgPath);

  // root package.json: workspaces + orchestration
  if (!/\/apps\//.test(pkgPath)){
    ensure(pkg,"name","mmhb-monorepo");
    ensure(pkg,"private",true);
    ensure(pkg,"version","1.0.0");
    // monorepo workspaces pointing to apps/*
    ensure(pkg,"workspaces", ["apps/*"]);

    pkg.scripts ||= {};
    pkg.scripts["diagnose"] = pkg.scripts["diagnose"] || "node scripts/diagnose.mjs || echo diag";
    pkg.scripts["heal:json"] = "node scripts/autoHealJson.mjs";
    pkg.scripts["server:start"] = "npm --prefix apps/server run dev";
    pkg.scripts["client:start"] = "npm --prefix apps/client run dev";
    pkg.scripts["start:all"] = "concurrently -k -n server,client \"npm --prefix apps/server run dev\" \"npm --prefix apps/client run dev\"";
    pkg.scripts["start:heal"] = "npm run heal:json && npm install && npm run start:all";

    // shared dev deps at root for convenience
    merge(pkg, {
      devDependencies: {
        concurrently: "^9.0.0",
        tsx: "^4.19.0",
        typescript: "^5.6.3"
      }
    });
  }

  // server package.json: CommonJS (so require works), dev script, deps
  if (isServerPkg(pkgPath)){
    ensure(pkg,"name","mmhb-server");
    ensure(pkg,"private",true);
    pkg.type = "commonjs"; // 👈 fix the ESM/require crash
    pkg.scripts ||= {};
    // choose TS entry if present, else JS
    const tsEntry = fs.existsSync(path.join(dir,"src/index.ts"));
    const jsEntry = fs.existsSync(path.join(dir,"index.js")) ? "index.js" : "src/index.js";
    pkg.scripts["dev"] = tsEntry
      ? "tsx src/index.ts || node index.js"
      : `node ${jsEntry}`;

    merge(pkg, {
      dependencies: {
        express: "^4.19.2",
        cors: "^2.8.5",
        helmet: "^7.0.0",
        compression: "^1.7.4",
        morgan: "^1.10.0",
        dotenv: "^16.4.5",
        "express-session": "^1.17.3"
      },
      devDependencies: {
        "@types/express": "^4.17.21",
        "@types/cors": "^2.8.17",
        "@types/helmet": "^4.0.0",
        "@types/compression": "^1.7.5",
        "@types/morgan": "^1.9.9",
        "@types/express-session": "^1.17.8",
        "@types/node": "^20.11.30",
        tsx: "^4.19.0",
        typescript: "^5.6.3"
      }
    });
  }

  // client package.json: Vite dev
  if (isClientPkg(pkgPath)){
    ensure(pkg,"name","mmhb-client");
    ensure(pkg,"private",true);
    pkg.type = "module";
    pkg.scripts ||= {};
    pkg.scripts["dev"] = pkg.scripts["dev"] || "vite --port 5173 --host 0.0.0.0 --strictPort";

    merge(pkg, {
      devDependencies: {
        vite: "^5.4.8"
      }
    });
  }

  writeJson(pkgPath, pkg);
  console.log("🩹 healed", pkgPath);
}

function main(){
  // heal root package.json (create if missing)
  const rootPkg = path.resolve("package.json");
  if (!fs.existsSync(rootPkg)){
    writeJson(rootPkg, {
      name: "mmhb-monorepo",
      version: "1.0.0",
      private: true,
      workspaces: ["apps/*"],
      scripts: {}
    });
  }

  // heal root + every apps/*/package.json
  const all = [rootPkg];
  if (fs.existsSync("apps")){
    for (const sub of fs.readdirSync("apps")){
      const p = path.join("apps", sub, "package.json");
      if (fs.existsSync(p)) all.push(p);
    }
  }
  for (const p of all) healOne(p);
}

main();
