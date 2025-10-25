set -euo pipefail

echo "🔧 1) Toolchain"
# make sure we can reach npm's globals
export PATH="$HOME/.npm-global/bin:$PATH"
# add corepack / pnpm if missing
if ! command -v corepack >/dev/null 2>&1; then
  npm install -g corepack >/dev/null 2>&1 || true
fi
corepack enable || true
corepack prepare pnpm@8.15.4 --activate || true
if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm || true
  export PATH="$HOME/.npm-global/bin:$PATH"
fi
echo "➡️ pnpm $(pnpm -v || echo 'NOT FOUND')"

echo "🔧 2) Project root + clean locks"
cd ~/workspace 2>/dev/null || cd "$HOME"
rm -f package-lock.json pnpm-lock.yaml 2>/dev/null || true

echo "🔧 3) Make Run reliable"
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

echo "🔧 4) Allow build scripts (esbuild, etc.)"
pnpm config set allow-scripts true -w || true

echo "🔧 5) Ensure dev tools"
pnpm add -D tsx typescript >/dev/null || true

echo "🔧 6) Ensure server entry"
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

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const port = Number(process.env.PORT || 5000)
app.listen(port, () => console.log(`✅ Server running http://localhost:${port}`))
TS
fi

# minimal package.json if you don't have one
if ! [ -f package.json ]; then
  cat > package.json <<'PKG'
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

echo "🔧 7) Install/refresh root deps"
pnpm install || true

echo "🔧 8) Ensure a minimal client (only if missing)"
if [ ! -d client ]; then
  mkdir -p client/src
  cat > client/index.html <<'HTML'
<!doctype html><html lang="en"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>MyMentalHealthBuddy</title>
</head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>
HTML

  cat > client/src/main.tsx <<'TSX'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const qc = new QueryClient()
function App(){
  return <div style={{padding:20}}>
    <h1>MyMentalHealthBuddy</h1>
    <p>Frontend online ✅</p>
    <a href="/api/health" target="_blank" rel="noreferrer">Ping API</a>
  </div>
}
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={qc}><App/></QueryClientProvider>
)
TSX

  cat > client/vite.config.ts <<'TS'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } }
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
echo "👉 Click Run to start the API. In another shell: cd client && pnpm dev"
