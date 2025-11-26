// scripts/canva-bridge.mjs
// ✅ Canva Dev Bridge (no self-signed SSL, no repeats, port-safe)
// - Serves /canva-app.js over http://localhost:<BRIDGE_PORT>  (what Canva wants)
// - Proxies /api/* to your running backend on http://127.0.0.1:<BACKEND_PORT>
// - Opens a public HTTPS tunnel for OAuth callbacks via loca.lt
// - Auto-picks a free BRIDGE port so "address already in use" never blocks you

import 'dotenv/config';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import localtunnel from 'localtunnel';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------- Config (edit via .env only) --------
const BACKEND_PORT = Number(process.env.PORT || 5173);    // your running API (server/index.js)
const BRIDGE_START = Number(process.env.BRIDGE_START || 5174);
const BRIDGE_END   = Number(process.env.BRIDGE_END   || 5200);
const LT_SUBDOMAIN = (process.env.LT_SUBDOMAIN || 'genuineloveapi').toLowerCase().replace(/[^a-z0-9-]/g,'');
// --------------------------------------------

// Find a free local port for the bridge
const findFreePort = (start, end) => new Promise((resolve, reject) => {
  let p = start;
  const tryOnce = () => {
    if (p > end) return reject(new Error('No free port available'));
    const srv = net.createServer();
    srv.once('error', () => { p += 1; tryOnce(); });
    srv.once('listening', () => { const got = p; srv.close(() => resolve(got)); });
    srv.listen(p, '127.0.0.1');
  };
  tryOnce();
});

// Load the app JS from either /public/canva-app.js or /canva-app.js
function readCanvaApp() {
  const candidates = [
    path.join(process.cwd(), 'public', 'canva-app.js'),
    path.join(process.cwd(), 'canva-app.js'),
  ];
  for (const f of candidates) if (fs.existsSync(f)) return fs.readFileSync(f);
  // Minimal placeholder if file doesn't exist
  return Buffer.from(`// placeholder canva-app.js
export default {
  name: "The Genuine Love Project",
  pages: [{ id: "home", elements: [{ type: "TEXT", text: "GLP dev connected ✅" }]}],
};`);
}

// Lightweight /api proxy using Node 20’s global fetch (undici)
async function proxyApi(req, res) {
  const targetURL = new URL(`http://127.0.0.1:${BACKEND_PORT}${req.url}`);
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!['host', 'content-length'].includes(k)) headers[k] = v;
  }
  const body = ['GET','HEAD'].includes(req.method || 'GET') ? undefined : req;
  try {
    const r = await fetch(targetURL, { method: req.method, headers, body, redirect: 'manual' });
    res.writeHead(r.status, Object.fromEntries(r.headers));
    if (r.body) r.body.pipeTo(new WritableStream({
      write(chunk) { res.write(chunk); },
      close() { res.end(); }
    }));
    else res.end();
  } catch (err) {
    res.writeHead(502, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok:false, error:'Proxy failed', detail:String(err?.message||err) }));
  }
}

(async () => {
  // 1) Start HTTPS tunnel to backend (for OAuth) — valid cert, no self-signed issues
  const tunnel = await localtunnel({ port: BACKEND_PORT, subdomain: LT_SUBDOMAIN || undefined });
  const pub = tunnel.url; // e.g., https://something.loca.lt

  // 2) Start the localhost bridge for Canva’s Development URL (HTTP only)
  const BRIDGE_PORT = await findFreePort(BRIDGE_START, BRIDGE_END);
  const appJS = readCanvaApp();

  const server = http.createServer((req, res) => {
    // Serve the canva app JS
    if (req.url === '/canva-app.js') {
      res.writeHead(200, { 'content-type': 'application/javascript; charset=utf-8' });
      return res.end(appJS);
    }
    // Proxy all /api/* to backend (keeps your existing routes)
    if (req.url?.startsWith('/api/')) return proxyApi(req, res);

    // Tiny helper page
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<div style="font:14px/1.6 system-ui;padding:12px">
      <b>The Genuine Love Project — Canva Bridge</b><br/>
      Backend: http://localhost:${BACKEND_PORT}<br/>
      Dev JS:   http://localhost:${BRIDGE_PORT}/canva-app.js<br/>
      OAuth:    ${pub}<br/>
    </div>`);
  });

  server.listen(BRIDGE_PORT, '127.0.0.1', () => {
    const AUTHORIZATION_SERVER_URL = `${pub}/`;
    const TOKEN_EXCHANGE_URL      = `${pub}/api/canva/callback`;
    const DEVELOPMENT_FILE_URL    = `http://localhost:${BRIDGE_PORT}/canva-app.js`;

    console.log('\n✅ Canva Integration URLs (copy/paste)\n');
    console.log('Authorization server URL :', AUTHORIZATION_SERVER_URL);
    console.log('Token exchange URL       :', TOKEN_EXCHANGE_URL);
    console.log('Development URL          :', DEVELOPMENT_FILE_URL, '\n');

    console.log('ℹ️  Use the two HTTPS URLs above in Authentication → Add Provider (Custom).');
    console.log('ℹ️  Use the Development URL above in Code upload → Development URL.\n');
  });

  // Keep the tunnel alive & clean up on exit
  ['SIGINT','SIGTERM','SIGHUP'].forEach(sig => {
    process.on(sig, async () => {
      try { await tunnel.close(); } catch {}
      server.close(() => process.exit(0));
    });
  });
})();