set -euo pipefail

echo "🔧 Ensuring Node toolchain"
if ! command -v corepack >/dev/null 2>&1; then
  npm install -g corepack >/dev/null 2>&1 || true
fi
if command -v corepack >/dev/null 2>&1; then
  corepack enable || true
  corepack prepare pnpm@8.15.4 --activate || true
fi
if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm || true
  export PATH="$PATH:/home/runner/.npm-global/bin"
fi
echo "➡️ pnpm: $(pnpm -v || echo 'not found')"

echo "🔧 Jump to project root"
cd ~/workspace 2>/dev/null || cd "$HOME" || true

echo "🔧 Clean conflicting locks (ok if not present)"
rm -f package-lock.json pnpm-lock.yaml 2>/dev/null || true

echo "🔧 Make Run reliable"
cat > .replit <<'R'
run = "pnpm exec tsx server/start.ts"
language = "nodejs"
[env]
PORT = "5000"
NODE_ENV = "development"
[packager]
packageManager = "pnpm"
[interpreter]
command = ["bash"]
R

echo "🔧 Allow build scripts (esbuild etc.)"
pnpm config set allow-scripts true -w || true

echo "🔧 Ensure dev tools"
pnpm add -D tsx typescript >/dev/null || true

echo "🔧 Ensure server entry"
mkdir -p server
if [ ! -f server/start.ts ]; then
  cat > server/start.ts <<'TS'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
const app = express()
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())
app.get('/api/health', (_req,res)=>res.json({ok:true}))
const port = Number(process.env.PORT||5000)
app.listen(port, ()=>console.log(`✅ Server running http://localhost:${port}`))
TS
  jq -r '.' package.json >/dev/null 2>&1 || cat > package.json <<'PKG'
{
  "name": "mmhb-root",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "pnpm exec tsx server/start.ts",
    "dev:client": "pnpm --dir client dev"
  },
  "dependencies": {
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "tsx": "^4.20.0",
    "typescript": "^5.4.0"
  }
}
PKG
fi

echo "🔧 Install root deps (ok if already installed)"
pnpm install || true

echo "🔧 Ensure minimal client"
if [ ! -d client ]; then
  mkdir -p client/src
  cat > client/index.html <<'HTML'
<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>MyMentalHealthBuddy</title></head>
<body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
HTML

  cat > client/src/main.tsx <<'TSX'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const qc = new QueryClient()
function App(){return(<div style={{padding:20}}>
  <h1>MyMentalHealthBuddy</h1>
  <p>Frontend online ✅ (Vite dev server)</p>
  <a href="/api/health" target="_blank" rel="noreferrer">Ping API</a>
</div>)}
createRoot(document.getElementById('root')!).render(<QueryClientProvider client={qc}><App/></QueryClientProvider>)
TSX

  cat > client/vite.config.ts <<'TS'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins:[react()],
  server:{ port:5173, proxy:{ '/api':'http://localhost:5000' } }
})
TS

  cat > client/package.json <<'PKG'
{
  "name": "mmhb-client",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5173"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.2",
    "typescript": "^5.4.0",
    "vite": "^5.4.0"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.51.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
PKG
  (cd client && pnpm install)
fi

echo "✅ Heal complete."
echo "👉 Click Run (starts Express)."
echo "👉 In a new shell:  cd client && pnpm dev  # starts Vite"
