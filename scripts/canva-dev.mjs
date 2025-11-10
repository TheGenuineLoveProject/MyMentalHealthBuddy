// scripts/canva-dev.mjs
// ✅ One-file Canva Dev Bridge (no SSL to localhost, no extra imports)
// - Serves http://localhost:<BRIDGE_PORT>/canva-app.js  (for Canva "Development URL")
// - Proxies http://localhost:<BRIDGE_PORT>/api/*  ->  http://127.0.0.1:<BACKEND_PORT>
// - Opens HTTPS tunnel (loca.lt) to your backend for OAuth (valid cert, no self-signed)
// - Auto-picks a free BRIDGE port to avoid EADDRINUSE

import 'dotenv/config';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import localtunnel from 'localtunnel';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// -------- CONFIG (only via .env) --------
const BACKEND_PORT = Number(process.env.PORT || 5173);      // your running server/index.js
const BRIDGE_START = Number(process.env.BRIDGE_START || 5174);
const BRIDGE_END   = Number(process.env.BRIDGE_END   || 5200);
const LT_SUBDOMAIN = (process.env.LT_SUBDOMAIN || 'genuineloveapi')
  .toLowerCase().replace(/[^a-z0-9-]/g,'');
// ---------------------------------------

// Find a free port for the localhost bridge
const findFreePort = (start, end) => new Promise((resolve, reject) => {
  let p = start;
  const probe = () => {
    if (p > end) return reject(new Error('No free port available'));
    const srv = net.createServer();
    srv.once('error', () => { p += 1; probe(); });
    srv.once('listening', () => { const got = p; srv.close(() => resolve(got)); });
    srv.listen(p, '127.0.0.1');
  };
  probe();
});

// Load canva-app.js (fallback if missing)
function loadCanvaApp() {
  const candidates = [
    path.join(process.cwd(), 'public', 'canva-app.js'),
    path.join(process.cwd(), 'canva-app.js'),
  ];
  for (const f of candidates) if (fs.existsSync(f)) return fs.readFileSync(f);
  return Buffer.from(`// fallback canva-app.js
export default {
  name: "The Genuine Love Project",
  pages: [{ id: "home", elements: [{ type: "TEXT", text: "GLP dev connected ✅" }]}],
};`);
}

// Minimal health check to backend
async function backendOk() {
  try {
    const r = await fetch(`http://127.0.0.1:${BACKEND_PORT}/healthz`, { method: 'GET' });
    return r.ok;
  } catch { return false; }
}

// Very small fetch proxy for /api/* -> backend
async function proxyApi(req, res) {
  const target = new URL(`http://127.0.0.1:${BACKEND_PORT}${req.url}`);
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!['host', 'content-length'].includes(k)) headers[k] = v;
  }
  const body = ['GET','HEAD'].includes(req.method||'GET') ? undefined : req;
  try {
    const r = await fetch(target, { method: req.method, headers, body, redirect: 'manual' });
    res.writeHead(r.status, Object.fromEntries(r.headers));
    if (r.body) {
      const reader = r.body.getReader();
      const pump = () => reader.read().then(({done, value}) => {
        if (done) return res.end();
        res.write(value); return pump();
      });
      await pump();
    } else res.end();
  } catch (err) {
    res.writeHead(502, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok:false, error:'Proxy failed', detail:String(err?.message||err) }));
  }
}

(async () => {
  // 1) HTTPS tunnel to backend (OAuth) — valid cert
  const tunnel = await localtunnel({ port: BACKEND_PORT, subdomain: LT_SUBDOMAIN || undefined });
  const pub = tunnel.url; // e.g. https://<sub>.loca.lt

  // 2) Start localhost bridge (HTTP only)
  const BRIDGE_PORT = await findFreePort(BRIDGE_START, BRIDGE_END);
  const appJS = loadCanvaApp();

  const server = http.createServer(async (req, res) => {
    if (req.url === '/canva-app.js') {
      res.writeHead(200, { 'content-type': 'application/javascript; charset=utf-8' });
      return res.end(appJS);
    }
    if (req.url?.startsWith('/api/')) return proxyApi(req, res);

    // helper page
    const ok = await backendOk();
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<div style="font:14px/1.6 system-ui;padding:12px">
      <b>GLP — Canva Dev Bridge</b><br/>
      Backend: http://localhost:${BACKEND_PORT} (${ok?'healthy ✅':'not responding ⚠️'})<br/>
      Dev JS:  <code>http://localhost:${BRIDGE_PORT}/canva-app.js</code><br/>
      OAuth:   <code>${pub}</code><br/>
    </div>`);
  });

  server.listen(BRIDGE_PORT, '127.0.0.1', () => {
    const AUTHORIZATION_SERVER_URL = `${pub}/`;
    const TOKEN_EXCHANGE_URL      = `${pub}/api/canva/callback`;
    const DEVELOPMENT_URL         = `http://localhost:${BRIDGE_PORT}/canva-app.js`;

    console.log('\n✅ Canva Integration URLs (copy/paste)\n');
    console.log('Authorization server URL :', AUTHORIZATION_SERVER_URL);
    console.log('Token exchange URL       :', TOKEN_EXCHANGE_URL);
    console.log('Development URL          :', DEVELOPMENT_URL, '\n');
    console.log('ℹ️  Use the two HTTPS URLs in Authentication → Add provider (Custom).');
    console.log('ℹ️  Use the Development URL in Code upload → Development URL.\n');
  });

  // graceful shutdown
  ['SIGINT','SIGTERM','SIGHUP'].forEach(sig => {
    process.on(sig, async () => {
      try { await tunnel.close(); } catch {}
      server.close(() => process.exit(0));
    });
  });
})();