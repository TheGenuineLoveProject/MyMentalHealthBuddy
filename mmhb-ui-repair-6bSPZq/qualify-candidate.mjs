import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const [root, report] = process.argv.slice(2);
assert.equal(process.cwd(), root);
assert.equal(path.dirname(report), root);
const req = createRequire(path.join(root, 'package.json'));
const dep = name => import(pathToFileURL(req.resolve(name)).href);
const esbuild = await dep('esbuild');
const { chromium } = await dep('playwright');
const fixture = path.join(report, 'fixture');
fs.mkdirSync(fixture, { mode: 0o700 });
const dist = path.join(report, 'dist');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const css = [...html.matchAll(/<link\b[^>]*href=["']([^"']+\.css(?:\?[^"']*)?)["'][^>]*>/g)]
  .map(m => m[1]).filter(s => s.startsWith('/assets/') && !s.includes('..'));
assert.ok(css.length, 'APP_STYLES_REQUIRED');
const authFixture = `import React, { createContext, useContext, useState } from 'react';
const Context = createContext(null);
export function Provider({ children }) {
  const [user, setUser] = useState({ id: 'mmhb-ui-fixture', name: 'UI fixture' });
  const [calls, setCalls] = useState(0);
  async function logout() {
    setCalls(n => n + 1);
    await Promise.resolve();
    if (new URLSearchParams(location.search).has('failure')) throw Error('Simulated failure');
    setUser(null);
  }
  return <Context.Provider value={{ user, isPro: false, logout, token: new URLSearchParams(location.search).has('local') ? 'fixture-token' : null }}>
    {children}<output id="logout-calls">{calls}</output>
    <output id="fixture-session">{user ? 'signed-in-fixture' : 'signed-out-fixture'}</output>
  </Context.Provider>;
}
export const useAuth = () => useContext(Context);`;
const nav = path.join(root, 'client/src/components/TglpNavbar.jsx');
const sharing = path.join(root, 'client/src/components/JournalSharingOptions.jsx');
const entry = `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from ${JSON.stringify(nav)};
import Sharing from ${JSON.stringify(sharing)};
import { Provider } from 'mmhb-fixture-auth';
if (new URLSearchParams(location.search).get('theme') === 'dark') document.documentElement.classList.add('dark');
function Controls() {
  const [shared, setShared] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  return <main className="hxos-vnext" style={{ padding: 20 }}>
    <h1>MMHB control qualification</h1>
    <Sharing shareWithCommunity={shared} setShareWithCommunity={setShared}
      shareAnonymously={anonymous} setShareAnonymously={setAnonymous} />
  </main>;
}
createRoot(document.getElementById('root')).render(<Provider><Navbar/><Controls/></Provider>);`;
await esbuild.build({
  stdin: { contents: entry, sourcefile: 'mmhb-fixture.jsx', resolveDir: root, loader: 'jsx' },
  outfile: path.join(fixture, 'fixture.js'), absWorkingDir: root,
  bundle: true, platform: 'browser', format: 'esm', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: { '@': path.join(root, 'client/src') },
  plugins: [{ name: 'isolated-ui-fixture', setup(build) {
    build.onResolve({ filter: /mmhb-fixture-auth|AuthContext|ModeToggle|GlobalSearch|LumiSceneRenderer/ }, args => {
      if (args.path === 'mmhb-fixture-auth' || args.importer === nav) {
        const kind = /AuthContext|mmhb-fixture-auth/.test(args.path) ? 'auth' :
          /LumiSceneRenderer/.test(args.path) ? 'lumi' : 'empty';
        return { path: kind, namespace: 'mmhb-ui-fixture' };
      }
    });
    build.onLoad({ filter: /.*/, namespace: 'mmhb-ui-fixture' }, args => ({
      contents: args.path === 'auth' ? authFixture : args.path === 'lumi'
        ? 'export const LumiSceneRenderer = () => null;'
        : 'export default function Decoration(){return null;}',
      loader: 'jsx', resolveDir: root,
    }));
  }}],
});
const fixtureHtml = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MMHB UI fixture</title>' +
  css.map(href => '<link rel="stylesheet" href="' + href + '">').join('') +
  '<link rel="stylesheet" href="/__fixture/fixture.css"><div id="root"></div><script type="module" src="/__fixture/fixture.js"></script></html>';
let server, browser;
const results = [];
try {
  server = http.createServer((request, response) => {
    const u = new URL(request.url, 'http://localhost');
    if (u.pathname.startsWith('/api/')) { response.writeHead(503); response.end(); return; }
    if (u.pathname === '/__fixture/') { response.setHeader('Content-Type', 'text/html'); response.end(fixtureHtml); return; }
    const base = u.pathname.startsWith('/__fixture/') ? fixture : dist;
    const relative = u.pathname.startsWith('/__fixture/') ? u.pathname.slice(11) : u.pathname.slice(1);
    const full = path.resolve(base, relative);
    if (!full.startsWith(base + path.sep)) { response.writeHead(404); response.end(); return; }
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      const ext = path.extname(full);
      response.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.json': 'application/json' })[ext] || 'application/octet-stream');
      response.setHeader('Cache-Control', 'no-store'); fs.createReadStream(full).pipe(response); return;
    }
    response.setHeader('Content-Type', 'text/html'); response.end(html);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({ executablePath: '/repl/tools/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  for (const width of [320, 390, 768, 1365]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: 'block' });
      const blocked = [];
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin === origin && !url.pathname.startsWith('/api/')) return route.continue();
        blocked.push(url.pathname.startsWith('/api/') ? 'API_BLOCKED' : 'EXTERNAL_BLOCKED');
        return route.abort();
      });
      const page = await context.newPage(); const errors = [];
      page.on('pageerror', () => errors.push('PAGE_ERROR'));
      await page.goto(origin + '/__fixture/?theme=' + theme, { waitUntil: 'networkidle' });
      const signout = page.getByTestId('button-navbar-signout');
      await signout.waitFor({ state: 'visible' });
      assert.equal(await page.getByTestId('toggle-share').isChecked(), false, 'SHARE_DEFAULT_OFF');
      const metrics = await page.evaluate(() => {
        const box = document.querySelector('.mmhb-journal-sharing');
        const title = box.querySelector('.mmhb-sharing-title');
        const help = box.querySelector('.mmhb-sharing-help');
        const header = document.querySelector('[data-testid="navbar-main"]');
        const visible = [...header.querySelectorAll('nav a, nav button')].filter(e => e.getBoundingClientRect().width > 0);
        const controls = visible.map(e => {
          const s = getComputedStyle(e), r = e.getBoundingClientRect();
          return { height: r.height, left: r.left, right: r.right, radius: s.borderRadius, fontSize: s.fontSize };
        });
        return { background: getComputedStyle(box).backgroundColor, title: getComputedStyle(title).color,
          help: getComputedStyle(help).color, controls, width: innerWidth,
          overflow: header.scrollWidth > header.clientWidth + 1 };
      });
      assert.equal(metrics.background, 'rgb(246, 241, 232)', 'SHARE_SURFACE');
      assert.equal(metrics.title, 'rgb(22, 58, 54)', 'SHARE_TEXT');
      assert.equal(metrics.help, 'rgb(47, 93, 93)', 'SHARE_HELP');
      assert.equal(metrics.overflow, false, 'NAV_OVERFLOW');
      for (const c of metrics.controls) {
        assert.ok(c.height >= 43.9 && c.left >= -1 && c.right <= metrics.width + 1, 'NAV_TARGET_OR_OVERFLOW');
        assert.equal(c.radius, '12px', 'NAV_RADIUS'); assert.equal(c.fontSize, '14px', 'NAV_FONT');
      }
      await page.getByTestId('toggle-share').focus();
      await page.keyboard.press('Space');
      assert.equal(await page.getByTestId('toggle-share').isChecked(), true);
      assert.equal(await page.getByTestId('toggle-anonymous').isChecked(), true, 'ANONYMOUS_DEFAULT');
      const focus = await page.getByTestId('toggle-share').evaluate(e => getComputedStyle(e).outlineWidth);
      assert.equal(focus, '3px', 'FOCUS_VISIBLE');
      await page.getByTestId('toggle-share').uncheck();
      if (width < 768) {
        await page.getByTestId('button-mobile-menu').click();
        await page.getByTestId('menu-mobile').waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        assert.equal(await page.getByTestId('menu-mobile').count(), 0);
      } else {
        await page.getByTestId('button-nav-topics').click();
        await page.getByTestId('menu-nav-topics').waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        assert.equal(await page.getByTestId('menu-nav-topics').count(), 0);
      }
      if (theme === 'light' && [390, 1365].includes(width))
        await page.screenshot({ path: path.join(report, 'controls-' + width + '.png'), fullPage: true });
      await signout.click();
      await page.waitForFunction(() => document.getElementById('fixture-session').textContent === 'signed-out-fixture');
      assert.equal(await page.locator('#logout-calls').innerText(), '1', 'EXISTING_LOGOUT_CALLED_ONCE');
      assert.equal(await signout.count(), 0, 'SIGNED_OUT_BUTTON_HIDDEN');
      assert.equal(errors.length, 0, 'FIXTURE_RUNTIME_ERRORS');
      results.push({ width, theme, result: 'CONTROL_FIXTURE_PASS', controls: metrics.controls.length,
        logout: 'EXISTING_HANDLER_INVOCATION_ONLY', blockedRequests: blocked.length });
      await context.close();
    }
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, serviceWorkers: 'block' });
  await context.route('**/*', route => {
    const u = new URL(route.request().url());
    return u.origin === origin && !u.pathname.startsWith('/api/') ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  await page.goto(origin + '/__fixture/?failure=1', { waitUntil: 'networkidle' });
  await page.getByTestId('button-navbar-signout').click();
  await page.getByRole('alert').waitFor({ state: 'visible' });
  assert.equal(await page.getByTestId('button-navbar-signout').isEnabled(), true);
  results.push({ result: 'LOGOUT_REJECTION_DISPLAY_PASS' });
  await page.goto(origin + '/__fixture/?local=1', { waitUntil: 'networkidle' });
  await page.getByTestId('button-navbar-signout').click();
  await page.waitForURL(origin + '/login');
  results.push({ result: 'LOCAL_SESSION_FULL_NAVIGATION_PASS', authentication: 'SIMULATED' });
  await page.locator('.tglp-nav-root.mmhb-nav-root').waitFor({ state: 'visible' });
  results.push({ route: '/login', result: 'CANDIDATE_APP_NAV_MOUNT_PASS', authenticatedAPIs: 'BLOCKED' });
  await context.close();
  fs.writeFileSync(path.join(report, 'ui-check.json'), JSON.stringify({
    status: 'CANDIDATE_UI_QUALIFICATION_PASS', results,
    limitations: ['Authentication is simulated only in component fixtures.',
      'No real login, token revocation, journal write, or community posting was tested.',
      'Candidate login route mounts the changed navigation with API requests blocked.'],
  }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
}
