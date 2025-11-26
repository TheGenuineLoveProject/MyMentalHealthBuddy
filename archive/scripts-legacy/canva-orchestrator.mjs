/**
 * ✅ Genuine Love Project — Canva Dev Orchestrator (Final)
 * ---------------------------------------------------------
 * PURPOSE:
 *  • Connects your running backend (localhost:5173) to Canva.
 *  • Opens a stable HTTPS tunnel (via loca.lt) for OAuth URLs.
 *  • Serves your /canva-app.js locally for Canva’s Development URL.
 *  • Prints the 3 exact URLs to paste into Canva Console.
 *
 * HOW TO RUN:
 *   npm run canva-dev
 *
 * REQUIRES:
 *   npm i express undici localtunnel dotenv
 * ---------------------------------------------------------
 */

import 'dotenv/config';
import http from 'node:http';
import net from 'node:net';
import { request as undiciRequest } from 'undici';
const { default: localtunnel } = await import('localtunnel');

// ---------------- CONFIG ----------------
const BACKEND_PORT = Number(process.env.PORT || 5173);
const START_PORT = Number(process.env.CANVA_BRIDGE_START || 5183);
const END_PORT = Number(process.env.CANVA_BRIDGE_END || 5200);
const SUBDOMAIN = (process.env.LT_SUBDOMAIN || 'genuineloveapi').toLowerCase();

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// ---------------- HELPERS ----------------
async function backendHealthy() {
  try {
    const res = await undiciRequest(`http://127.0.0.1:${BACKEND_PORT}/healthz`, { method: 'GET' });
    return res.statusCode >= 200 && res.statusCode < 500;
  } catch {
    return false;
  }
}

async function waitBackend() {
  console.log(`⏳ Checking backend on port ${BACKEND_PORT}...`);
  for (let i = 0; i < 30; i++) {
    if (await backendHealthy()) {
      console.log('✅ Backend is healthy!');
      return true;
    }
    await sleep(500);
  }
  console.log('⚠️ Backend not responding; continuing anyway...');
  return false;
}

async function findPort(start, end) {
  for (let p = start; p <= end; p++) {
    const isFree = await new Promise((resolve) => {
      const s = net.createServer()
        .once('error', () => resolve(false))
        .once('listening', () => s.close(() => resolve(true)))
        .listen(p, '127.0.0.1');
    });
    if (isFree) return p;
  }
  throw new Error('No free port found between ' + start + ' and ' + end);
}

// ---------------- LOCAL BRIDGE ----------------
function startBridge(bridgePort) {
  const appJs = `
    // Minimal Canva app (dev mode)
    export const onAppOpen = () => {
      console.log('[Canva] Dev bridge connected ✅ Genuine Love Project ready');
    };
  `.trim();

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${bridgePort}`);

    if (url.pathname === '/canva-app.js') {
      res.writeHead(200, { 'content-type': 'application/javascript; charset=utf-8' });
      return res.end(appJs);
    }

    if (url.pathname.startsWith('/api/')) {
      try {
        const upstream = await undiciRequest(
          `http://127.0.0.1:${BACKEND_PORT}${url.pathname}${url.search}`,
          {
            method: req.method,
            headers: { ...req.headers, host: `localhost:${BACKEND_PORT}` },
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
          }
        );

        res.writeHead(upstream.statusCode, Object.fromEntries(upstream.headers));
        if (upstream.body) upstream.body.pipe(res); else res.end();
      } catch (err) {
        res.writeHead(502, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'proxy_failed', detail: String(err?.message) }));
      }
      return;
    }

    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`
      <pre>🌸 Genuine Love Project — Canva Dev Bridge
Backend: http://localhost:${BACKEND_PORT}
App JS : http://localhost:${bridgePort}/canva-app.js
</pre>`);
  });

  server.listen(bridgePort, '127.0.0.1', () => {
    console.log(`🔗 Local bridge running on http://localhost:${bridgePort}`);
  });

  return server;
}

// ---------------- MAIN ----------------
(async () => {
  await waitBackend();

  const bridgePort = await findPort(START_PORT, END_PORT);
  const bridge = startBridge(bridgePort);

  console.log('🚀 Opening secure loca.lt tunnel for OAuth...');
  const tunnel = await localtunnel({ port: BACKEND_PORT, subdomain: SUBDOMAIN });
  const publicUrl = tunnel.url.replace(/\/$/, '');

  const AUTH_URL = `${publicUrl}/`;
  const TOKEN_URL = `${publicUrl}/api/canva/callback`;
  const DEV_URL = `http://localhost:${bridgePort}/canva-app.js`;

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Canva Integration URLs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Authorization server URL : ${AUTH_URL}
Token exchange URL       : ${TOKEN_URL}
Development URL          : ${DEV_URL}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Paste into Canva Developer Console:

• Authentication → Add provider (Custom)
    Authorization server URL : ${AUTH_URL}
    Token exchange URL       : ${TOKEN_URL}

• Code upload → Development URL
    ${DEV_URL}

Bridge Port: ${bridgePort} | Backend: ${BACKEND_PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  const cleanup = async () => {
    try { bridge.close(); } catch {}
    try { await tunnel.close(); } catch {}
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
})();