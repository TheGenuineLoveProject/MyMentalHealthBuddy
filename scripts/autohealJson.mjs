import fs from "fs"; import path from "path";
const cwd = process.cwd();
const x = p => { try { fs.accessSync(p); return true; } catch { return false; } };
const read = p => fs.readFileSync(p,"utf8");
const write = (p,o)=>{ fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,JSON.stringify(o,null,2)); };
const clean = raw => String(raw)
  .replace(/^\s*module\.exports\s*=\s*/,"")
  .replace(/,\s*([}\]])/g,"$1")
  .replace(/;?\s*$/,"");
const safe = (p, hint) => { try { return JSON.parse(clean(read(p))); }
  catch { return { name: hint||path.basename(path.dirname(p))||"mmhb", version:"1.0.0", private:true, type:"module", scripts:{} }; } };
const ensure = (o,k,v)=>{ if(o[k]===undefined) o[k]=v; };

function healRoot(){
  const p = path.join(cwd,"package.json");
  const pkg = safe(p,"mymentalhealthbuddy-monorepo");
  pkg.private = true;
  if (x("apps/server") || x("apps/client")) ensure(pkg,"workspaces",["apps/*"]);
  pkg.scripts ||= {};
  pkg.scripts["diagnose"]     ||= "node scripts/autohealJson.mjs";
  pkg.scripts["heal"]         ||= "node scripts/autohealJson.mjs";
  pkg.scripts["server:start"]  = "npm --prefix apps/server run dev";
  pkg.scripts["client:start"]  = "npm --prefix apps/client run dev";
  pkg.scripts["start:all"]     = "concurrently -k \"npm:server:start\" \"npm:client:start\"";
  pkg.scripts["start:heal"]    = "node scripts/autohealJson.mjs && npm i && npm run start:all";
  pkg.devDependencies ||= {};
  pkg.devDependencies.concurrently ??= "^9.0.0";
  pkg.devDependencies["cross-env"] ??= "^7.0.3";
  write(p,pkg);
}

function healServer(){
  const p = path.join(cwd,"apps/server/package.json");
  if (!x(p)) return;
  const pkg = safe(p,"mmhb-server");
  pkg.private = true;
  pkg.type = "commonjs";                // allow require()
  pkg.scripts ||= {};
  const ts = x("apps/server/src/index.ts");
  const js = x("apps/server/index.js") || x("apps/server/src/index.js");
  pkg.scripts.dev = ts ? "tsx apps/server/src/index.ts" : (js ? "node apps/server/src/index.js" : "node apps/server/index.js");
  pkg.dependencies ||= {};
  Object.assign(pkg.dependencies,{
    express: pkg.dependencies?.express ?? "^4.19.2",
    cors: pkg.dependencies?.cors ?? "^2.8.5",
    compression: pkg.dependencies?.compression ?? "^1.7.4",
    helmet: pkg.dependencies?.helmet ?? "^7.0.0",
    morgan: pkg.dependencies?.morgan ?? "^1.10.0",
    "express-session": pkg.dependencies?.["express-session"] ?? "^1.17.3",
    "express-static-gzip": pkg.dependencies?.["express-static-gzip"] ?? "^2.1.7"
  });
  pkg.devDependencies ||= {};
  Object.assign(pkg.devDependencies,{
    tsx: pkg.devDependencies?.tsx ?? "^4.19.0",
    typescript: pkg.devDependencies?.typescript ?? "^5.6.3",
    "@types/express": pkg.devDependencies?.["@types/express"] ?? "^4.17.21",
    "@types/cors": pkg.devDependencies?.["@types/cors"] ?? "^2.8.17",
    "@types/express-session": pkg.devDependencies?.["@types/express-session"] ?? "^1.17.8",
    "@types/morgan": pkg.devDependencies?.["@types/morgan"] ?? "^1.9.6"
  });
  write(p,pkg);
}

function healClient(){
  const p = path.join(cwd,"apps/client/package.json");
  if (!x(p)) return;
  const pkg = safe(p,"mmhb-client");
  pkg.private = true; pkg.type = "module";
  pkg.scripts ||= {};
  pkg.scripts.dev ||= "vite --port 5173 --host 0.0.0.0 --strictPort";
  pkg.devDependencies ||= {};
  Object.assign(pkg.devDependencies,{
    vite: pkg.devDependencies?.vite ?? "^5.4.12",
    postcss: pkg.devDependencies?.postcss ?? "^8.4.47",
    tailwindcss: pkg.devDependencies?.tailwindcss ?? "^3.4.14",
    autoprefixer: pkg.devDependencies?.autoprefixer ?? "^10.4.20"
  });
  write(p,pkg);

  // configs
  const pc = path.join(cwd,"apps/client/postcss.config.js");
  if (!x(pc)) fs.writeFileSync(pc, `export default { plugins: { tailwindcss:{}, autoprefixer:{} } };`);
  const tw = path.join(cwd,"apps/client/tailwind.config.js");
  if (!x(tw)) fs.writeFileSync(tw, `export default { content:["./index.html","./src/**/*.{js,ts,jsx,tsx}"], theme:{extend:{}}, plugins:[] };`);
  const css = path.join(cwd,"apps/client/src/index.css");
  if (x(path.dirname(css)) && !x(css)) fs.writeFileSync(css, "@tailwind base;@tailwind components;@tailwind utilities;");
}

healRoot(); healServer(); healClient();
console.log("✅ JSON healed for root/server/client (monorepo consistent).");
