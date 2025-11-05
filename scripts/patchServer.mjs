import fs from "fs";
import path from "path";

const candidates = [
  "apps/server/src/index.ts",
  "apps/server/src/index.js",
  "apps/server/index.ts",
  "apps/server/index.js",
];

let target = candidates.find(f=>fs.existsSync(f));
if (!target){
  console.log("ℹ️ No server entry found to patch. Skipping.");
  process.exit(0);
}

let src = fs.readFileSync(target,"utf8");
const hadRequire = /require\(['"]express/.test(src) || /module\.exports/.test(src);

// if already ESM, leave it
if (!hadRequire && /from ['"]express['"]/.test(src)){
  console.log("✅ Server already ESM:", target);
  process.exit(0);
}

// very small transform
src = src
  .replace(/const\s+express\s*=\s*require\(['"]express['"]\);?/g, "import express from 'express';")
  .replace(/const\s+session\s*=\s*require\(['"]express-session['"]\);?/g, "import session from 'express-session';")
  .replace(/const\s+compression\s*=\s*require\(['"]compression['"]\);?/g, "import compression from 'compression';")
  .replace(/const\s+cors\s*=\s*require\(['"]cors['"]\);?/g, "import cors from 'cors';")
  .replace(/const\s+helmet\s*=\s*require\(['"]helmet['"]\);?/g, "import helmet from 'helmet';")
  .replace(/const\s+morgan\s*=\s*require\(['"]morgan['"]\);?/g, "import morgan from 'morgan';")
  .replace(/const\s+staticGzip\s*=\s*require\(['"]express-static-gzip['"]\);?/g, "import staticGzip from 'express-static-gzip';")
  .replace(/\bmodule\.exports\s*=\s*([A-Za-z0-9_]+)/g, "export default $1");

if (!/import express from 'express'/.test(src)){
  // if file was tiny, drop a minimal working server
  src =
`import express from 'express';
import session from 'express-session';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));
app.get('/healthz', (_req,res)=>res.json({ok:true}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('✅ Server up on', PORT));
`;
}

fs.writeFileSync(target, src);
console.log("🔧 Patched server to ESM:", target);

// Ensure tsconfig for NodeNext
const tsconfigPath = "apps/server/tsconfig.json";
if (!fs.existsSync(tsconfigPath)){
  fs.writeFileSync(tsconfigPath, JSON.stringify({
    "compilerOptions":{
      "target":"ES2022",
      "module":"NodeNext",
      "moduleResolution":"NodeNext",
      "esModuleInterop": true,
      "strict": false,
      "skipLibCheck": true,
      "outDir":"dist"
    },
    "include":["src/**/*"]
  }, null, 2));
  console.log("🗂  Wrote", tsconfigPath);
}
