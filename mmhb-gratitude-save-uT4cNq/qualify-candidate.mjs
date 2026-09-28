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
const { chromium } = req('playwright');
assert.equal(typeof chromium?.launch, 'function', 'PLAYWRIGHT_CHROMIUM_EXPORT_MISSING');
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
checkCompiledUtilities();
const pageFixtureHtml = await buildPageFixture();
const publicFixtureHtml = await buildPublicFixture();
await buildGratitudeFixture();
const fixtureHtml = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MMHB UI fixture</title>' +
  css.map(href => '<link rel="stylesheet" href="' + href + '">').join('') +
  '<link rel="stylesheet" href="/__fixture/fixture.css"><div id="root"></div><script type="module" src="/__fixture/fixture.js"></script></html>';
let server, browser;
const results = [];
try {
  server = http.createServer((request, response) => {
    const u = new URL(request.url, 'http://localhost');
    if (u.pathname.startsWith('/api/')) { response.writeHead(503); response.end(); return; }
    if (['/journal','/dashboard'].includes(u.pathname) && u.searchParams.get('fixture') === '1') { response.setHeader('Content-Type','text/html'); response.end(pageFixtureHtml); return; }
    if (['/','/lumi'].includes(u.pathname) && u.searchParams.get('publicFixture') === '1') { response.setHeader('Content-Type','text/html'); response.end(publicFixtureHtml); return; }
    if (u.pathname === '/__fixture/') { response.setHeader('Content-Type', 'text/html'); response.end(fixtureHtml); return; }
    if (u.pathname === '/') { response.setHeader('Content-Type', 'text/html'); response.end(html); return; }
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
      assert.equal(metrics.background, 'rgb(250, 248, 242)', 'SHARE_SURFACE');
      assert.equal(metrics.title, 'rgb(41, 51, 41)', 'SHARE_TEXT');
      assert.equal(metrics.help, 'rgb(63, 98, 73)', 'SHARE_HELP');
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
  await checkPages(browser, origin, results);
  await checkPublicPages(browser, origin, results);
  await checkGratitude(browser, origin, results);
  fs.writeFileSync(path.join(report, 'ui-check.json'), JSON.stringify({
    status: 'CANDIDATE_UI_QUALIFICATION_PASS', results,
    limitations: ['Authentication and API data are simulated in component and page-composition fixtures.',
      'No real login, token revocation, journal write, or community posting was tested.',
      'Candidate login route mounts the changed navigation with API requests blocked.'],
  }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
}

// Appended to the previously reviewed qualifier; it supplies req, root, report,
// fixture, esbuild, authFixture, css, assert, fs and path.
async function buildPageFixture() {
  const pageEntry = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import Navbar from ${JSON.stringify(path.join(root, 'client/src/components/TglpNavbar.jsx'))};
import Journal from ${JSON.stringify(path.join(root, 'client/src/pages/JournalPage.jsx'))};
import Dashboard from ${JSON.stringify(path.join(root, 'client/src/pages/dashboard/Overview.jsx'))};
import { Provider } from 'mmhb-fixture-auth';
import { queryClient } from 'mmhb-fixture-data';
if (new URLSearchParams(location.search).get('theme') === 'dark') document.documentElement.classList.add('dark');
createRoot(document.getElementById('root')).render(
 <QueryClientProvider client={queryClient}><Provider><Navbar/>
  {location.pathname === '/journal' ? <Journal/> : <Dashboard/>}
  <div id="utility-probe" className="hidden md:flex p-4 gap-3 text-sm bg-card text-foreground rounded-xl">Layout check</div>
 </Provider></QueryClientProvider>);`;
  const dataFixture = `import { QueryClient } from '@tanstack/react-query';
window.fixtureMutationCalls = 0;
export const queryClient = new QueryClient({defaultOptions:{queries:{
 retry:false, staleTime:Infinity, refetchOnWindowFocus:false,
 queryFn:()=>{throw Error('UNSEEDED_FIXTURE_QUERY');}
}}});
const entries = [{id:'mmhb-fixture-entry',title:'A readable journal title ' + 'longword'.repeat(12),
 content:'Synthetic text for checking the journal display. No personal information.',createdAt:'2026-09-11T00:00:00Z'}];
for (const key of ['/api/journal','/api/journals']) queryClient.setQueryData([key],entries);
for (const key of ['/api/mood','/api/moods']) queryClient.setQueryData([key],[]);
queryClient.setQueryData(['/api/user/stats'],{streak:'1 day',sessions:0,insights:1,growthScore:'3%',xp:45,level:1});
queryClient.setQueryData(['/api/user/activity'],{activities:[]});
queryClient.setQueryData(['/api/user/tasks'],{tasks:[]});
export async function apiRequest(){window.fixtureMutationCalls++;throw Error('FIXTURE_API_FORBIDDEN');}
export const getQueryFn=()=>async()=>{throw Error('FIXTURE_FETCH_FORBIDDEN');};`;
  await esbuild.build({
    stdin: {contents:pageEntry,sourcefile:'mmhb-pages.jsx',resolveDir:root,loader:'jsx'},
    outfile:path.join(fixture,'pages.js'),absWorkingDir:root,
    bundle:true,platform:'browser',format:'esm',jsx:'automatic',
    define:{'process.env.NODE_ENV':'"production"'},alias:{'@':path.join(root,'client/src')},
    plugins:[{name:'page-fixture-services',setup(build){
      build.onResolve({filter:/mmhb-fixture-|AuthContext|GamificationContext|EmotionContext|lib\/queryClient|ModeToggle|GlobalSearch|lumi-registry|ReflectionCardExport|VoiceAffirmation|useSEO|\/SEO$/},args=>{
        let kind;
        if (/AuthContext|mmhb-fixture-auth/.test(args.path)) kind='auth';
        else if (/lib\/queryClient|mmhb-fixture-data/.test(args.path)) kind='data';
        else if (/GamificationContext/.test(args.path)) kind='xp';
        else if (/EmotionContext/.test(args.path)) kind='emotion';
        else if (/lumi-registry/.test(args.path)) kind='lumi';
        else if (/useSEO/.test(args.path)) kind='seo';
        else kind='empty';
        return {path:kind,namespace:'mmhb-page-fixture'};
      });
      build.onLoad({filter:/.*/,namespace:'mmhb-page-fixture'},args=>({
        contents:args.path==='auth'?authFixture:args.path==='data'?dataFixture:
          args.path==='xp'?'export const useGamification=()=>({awardXp:async()=>{throw Error("FIXTURE_XP_FORBIDDEN");}});':
          args.path==='emotion'?'export const useEmotion=()=>({setEmotion:()=>{}});':
          args.path==='lumi'?'export const OfficialLumi=()=>null; export const LumiSceneRenderer=()=>null;':
          args.path==='seo'?'export const useSEO=()=>{};':'export default function Decoration(){return null;}',
        loader:'jsx',resolveDir:root,
      }));
    }}],
  });
  return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MMHB page qualification</title>' +
    css.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+
    '<link rel="stylesheet" href="/__fixture/pages.css"><div id="root"></div><script type="module" src="/__fixture/pages.js"></script></html>';
}

function checkCompiledUtilities() {
  const parse = createRequire(req.resolve('@tailwindcss/postcss'))('postcss').parse;
  const required = new Map([
    ['.p-4','padding'],['.py-8','padding-block'],['.gap-3','gap'],['.text-sm','font-size'],
    ['.text-foreground','color'],['.text-muted-foreground','color'],['.bg-card','background-color'],
    ['.rounded-xl','border-radius'],['.md\\:flex','display'],
  ]);
  const found = new Set();
  for (const href of css) {
    const tree=parse(fs.readFileSync(path.join(report,'dist',href.slice(1)),'utf8'));
    tree.walkRules(rule=>{
      const selectors=rule.selector.split(',').map(s=>s.trim());
      for (const [selector,prop] of required) {
        if(selectors.includes(selector)) rule.walkDecls(prop,()=>found.add(selector));
      }
    });
  }
  for (const selector of required.keys()) assert.ok(found.has(selector),'MISSING_COMPILED_UTILITY:'+selector);
  console.log('COMPILED_UTILITY_CHECKS='+found.size);
}

async function readable(locator, label) {
  await locator.waitFor({state:'visible'});
  const paint = await locator.evaluate(element=>{
    const s=getComputedStyle(element);
    let p=element, background, gradient=false;
    while(p){
      const style=getComputedStyle(p);
      if(style.backgroundImage!=='none') gradient=true;
      const rgb=style.backgroundColor.match(/[\d.]+/g)?.map(Number)||[];
      if(rgb.length>=3 && (rgb.length===3 || rgb[3]===1)){background=rgb.slice(0,3);break;}
      p=p.parentElement;
    }
    const color=s.color.match(/[\d.]+/g)?.map(Number)||[];
    return {color:color.slice(0,3),alpha:color[3]??1,background,gradient,
      fill:s.webkitTextFillColor,paintColor:s.color,opacity:s.opacity,font:parseFloat(s.fontSize)};
  });
  assert.equal(paint.alpha,1,label+':TEXT_ALPHA');
  assert.equal(paint.opacity,'1',label+':OPACITY');
  assert.equal(paint.gradient,false,label+':GRADIENT_REQUIRES_REVIEW');
  assert.ok(paint.background&&paint.color.length===3,label+':SOLID_COLORS_REQUIRED');
  assert.ok(paint.fill===paint.paintColor || paint.fill==='currentcolor',label+':TEXT_FILL');
  const luminance=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;})
    .reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  const a=luminance(paint.color),b=luminance(paint.background);
  const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  assert.ok(ratio>=4.5,label+':CONTRAST='+ratio.toFixed(2));
  return Number(ratio.toFixed(2));
}

async function checkPages(browser, origin, results) {
  for (const width of [320,768,1365]) for(const theme of ['light','dark']) {
    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
    await context.route('**/*',route=>{
      const u=new URL(route.request().url());
      return u.origin===origin&&!u.pathname.startsWith('/api/')&&route.request().method()==='GET'
        ? route.continue():route.abort();
    });
    try {
      for (const route of ['/journal','/dashboard']) {
        const page=await context.newPage(); const errors=[];
        page.on('pageerror',e=>errors.push(e.message.slice(0,140)));
        await page.goto(origin+route+'?fixture=1&theme='+theme,{waitUntil:'networkidle'});
        await page.getByTestId('wellness-page-shell').waitFor({state:'visible'});
        assert.equal(await page.getByTestId('navbar-main').count(),1,'ONE_MAIN_NAVBAR');
        assert.equal(await page.getByTestId('wellness-quicknav').count(),0,'NO_SECOND_NAVIGATION_ROW');
        assert.equal(await page.getByTestId('wellness-page-shell').count(),1,'ONE_PAGE_SHELL');
        const layout=await page.evaluate(()=>{
          const probe=getComputedStyle(document.getElementById('utility-probe'));
          const shell=document.querySelector('[data-testid="wellness-page-shell"]');
          const cta=document.querySelector('[data-testid="link-dashboard-cta"] .mmhb-nav-label-full');
          return {padding:parseFloat(probe.paddingTop),gap:parseFloat(probe.gap),font:parseFloat(probe.fontSize),
            display:probe.display,shellPadding:parseFloat(getComputedStyle(shell).paddingLeft),
            nestedImage:getComputedStyle(cta).backgroundImage,nestedColor:getComputedStyle(cta).backgroundColor,
            overflow:document.documentElement.scrollWidth>innerWidth+1};
        });
        assert.ok(layout.padding>=14&&layout.gap>=10&&layout.font>=12,'LAYOUT_UTILITIES_EFFECTIVE');
        assert.equal(layout.display,width<768?'none':'flex','RESPONSIVE_VISIBILITY');
        assert.ok(layout.shellPadding>=14,'PAGE_SPACING');
        assert.equal(layout.nestedImage,'none','NO_NESTED_CTA_GRADIENT');
        assert.equal(layout.nestedColor,'rgba(0, 0, 0, 0)','NO_NESTED_CTA_BACKGROUND');
        assert.equal(layout.overflow,false,'PAGE_OVERFLOW');
        const ratios={signout:await readable(page.getByTestId('button-navbar-signout'),'SIGN_OUT'),
          dashboard:await readable(page.locator('[data-testid="link-dashboard-cta"] .mmhb-nav-label-full'),'DASHBOARD_LABEL')};
        if(route==='/journal'){
          const toggle=page.getByTestId('button-expand-mmhb-fixture-entry');
          assert.equal(await toggle.evaluate(e=>e.tagName),'BUTTON','NATIVE_DISCLOSURE');
          ratios.title=await readable(page.locator('.mmhb-entry-title'),'JOURNAL_TITLE');
          ratios.date=await readable(page.locator('.mmhb-entry-date'),'JOURNAL_DATE');
          await toggle.focus(); await page.keyboard.press('Space');
          await page.locator('#entry-content-mmhb-fixture-entry').waitFor({state:'visible'});
          assert.equal(await toggle.getAttribute('aria-expanded'),'true','SPACE_OPENS_ENTRY');
          await toggle.focus(); await page.keyboard.press('Enter');
          assert.equal(await page.locator('#entry-content-mmhb-fixture-entry').count(),0,'ENTER_CLOSES_ENTRY');
          await page.getByTestId('button-new').click();
          await page.getByTestId('input-title').fill('Synthetic draft');
          await page.getByTestId('input-content').fill('Synthetic content for a visual check only.');
          assert.equal(await page.getByTestId('toggle-share').isChecked(),false,'ACTUAL_FORM_SHARE_DEFAULT_OFF');
          ratios.share=await readable(page.locator('.mmhb-sharing-title'),'SHARING_TITLE');
          ratios.save=await readable(page.getByTestId('button-save'),'SAVE_ENTRY');
          ratios.insights=await readable(page.getByTestId('button-analyze-journal'),'GET_INSIGHTS');
          ratios.input=await readable(page.getByTestId('input-title'),'DRAFT_TEXT');
          assert.equal(await page.evaluate(()=>window.fixtureMutationCalls),0,'NO_FIXTURE_MUTATIONS');
        }else{
          await page.getByTestId('text-page-title').waitFor({state:'visible'});
          assert.equal((await page.getByTestId('stat-value-journal-entries').innerText()).trim(),'1','DASHBOARD_FIXTURE_LOADED');
        }
        assert.equal(errors.length,0,'PAGE_RUNTIME_ERRORS:'+errors.join('|'));
        if(width===320||width===1365) await page.screenshot({path:path.join(report,'page-'+route.slice(1)+'-'+width+'-'+theme+'.png'),fullPage:true});
        results.push({route,width,theme,result:'PAGE_COMPOSITION_FIXTURE_PASS',contrastRatios:ratios});
        await page.close();
      }
    } finally {await context.close();}
  }
  console.log('PAGE_COMPOSITION_CASES=12');
}

async function buildPublicFixture() {
  const entry=`import React from 'react';
import {createRoot} from 'react-dom/client';
import Home from ${JSON.stringify(path.join(root,'client/src/pages/CanvaLanding.jsx'))};
import Lumi from ${JSON.stringify(path.join(root,'client/src/pages/MeetLumi.jsx'))};
if(new URLSearchParams(location.search).get('theme')==='dark')document.documentElement.classList.add('dark');
createRoot(document.getElementById('root')).render(<main id="main-content">{location.pathname==='/lumi'?<Lumi/>:<Home/>}</main>);`;
  await esbuild.build({stdin:{contents:entry,sourcefile:'mmhb-public.jsx',resolveDir:root,loader:'jsx'},
    outfile:path.join(fixture,'public.js'),absWorkingDir:root,bundle:true,platform:'browser',format:'esm',jsx:'automatic',
    define:{'process.env.NODE_ENV':'"production"'},alias:{'@':path.join(root,'client/src')}});
  return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Public page fixture</title>'+css.map(h=>'<link rel="stylesheet" href="'+h+'">').join('')+'<link rel="stylesheet" href="/__fixture/public.css"><div id="root"></div><script type="module" src="/__fixture/public.js"></script></html>';
}
async function checkPublicPages(browser,origin,results) {
  for(const width of [320,768,1365]) for(const theme of ['light','dark']) {
    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block',reducedMotion:'reduce'});
    await context.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===origin&&!u.pathname.startsWith('/api/')&&r.request().method()==='GET'?r.continue():r.abort();});
    try {for(const route of ['/','/lumi']) {
      const page=await context.newPage(), errors=[];
      page.on('pageerror',e=>errors.push(e.message.slice(0,160)));
      await page.goto(origin+route+'?publicFixture=1&theme='+theme,{waitUntil:'networkidle'});
      const scope=page.locator('.mm-public'); await scope.waitFor();
      assert.equal(await scope.locator('h1').count(),1,'PUBLIC_ONE_H1');
      assert.equal(await scope.locator('main').count(),0,'NO_NESTED_MAIN');
      assert.equal(await page.locator('main').count(),1,'PUBLIC_MAIN_LANDMARK');
      assert.equal(await scope.locator('[data-testid="link-crisis"]').getAttribute('href'),'/crisis');
      const ratios={};
      for(const selector of ['h1','.mp-lead','.mp-primary','.mp-text-link']) ratios[selector]=await readable(scope.locator(selector).first(),'PUBLIC_'+selector);
      const metrics=await scope.evaluate(el=>({overflow:document.documentElement.scrollWidth>innerWidth+1,
        font:parseFloat(getComputedStyle(el.querySelector('.mp-lead')).fontSize),
        background:getComputedStyle(el).backgroundColor,
        targets:[...el.querySelectorAll('.mp-button,.mp-text-link,summary')].map(e=>e.getBoundingClientRect().height)}));
      assert.equal(metrics.overflow,false,'PUBLIC_OVERFLOW');
      assert.ok(metrics.font>=16,'PUBLIC_BODY_SIZE');
      assert.equal(metrics.background,theme==='dark'?'rgb(32, 39, 31)':'rgb(250, 248, 242)','PUBLIC_THEME');
      assert.ok(metrics.targets.every(h=>h>=43.9),'PUBLIC_TOUCH_TARGETS');
      const cta=scope.locator('.mp-primary'); await cta.focus();
      assert.equal(await cta.evaluate(e=>getComputedStyle(e).backgroundColor),theme==='dark'?'rgb(188, 211, 190)':'rgb(63, 98, 73)','LUMI_ACTION_PALETTE');
      assert.equal(await cta.evaluate(e=>getComputedStyle(e).outlineWidth),'3px','PUBLIC_FOCUS');
      if(route==='/') {
        assert.equal(await scope.locator('a[href="/lumi"]').count(),1,'ONE_LUMI_INTRO');
        assert.equal(await scope.locator('img').count(),0,'NO_REPEAT_HOME_GALLERY');
        assert.equal(await scope.locator('.mp-card').count(),4,'FOUR_HOME_PATHS');
        assert.equal(await cta.getAttribute('href'),'/start','HOME_START_ROUTE');
      } else {
        assert.equal(await scope.locator('.mp-gallery img').count(),7,'LUMI_REGISTRY_GALLERY');
        for(const img of await scope.locator('.mp-gallery img').all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(e=>new Promise((resolve,reject)=>{if(e.complete)return e.naturalWidth?resolve():reject(Error('LUMI_IMAGE_BROKEN'));e.onload=resolve;e.onerror=()=>reject(Error('LUMI_IMAGE_BROKEN'));}));
        }
        const summary=scope.locator('summary').first(); await summary.focus(); await page.keyboard.press('Enter');
        assert.equal(await scope.locator('details').first().evaluate(e=>e.open),true,'FAQ_KEYBOARD_OPENS');
        await page.keyboard.press('Space');
        assert.equal(await scope.locator('details').first().evaluate(e=>e.open),false,'FAQ_KEYBOARD_CLOSES');
        assert.equal(await cta.getAttribute('href'),'/chat','LUMI_CHAT_ROUTE');
      }
      assert.equal(errors.length,0,'PUBLIC_RUNTIME_ERRORS:'+errors.join('|'));
      if(width===320||width===1365)await page.screenshot({path:path.join(report,'public-'+(route==='/'?'home':'lumi')+'-'+width+'-'+theme+'.png'),fullPage:true});
      results.push({route,width,theme,result:'PUBLIC_PAGE_FIXTURE_PASS',contrastRatios:ratios});await page.close();
    }}finally{await context.close();}
  }
  const context=await browser.newContext({viewport:{width:1365,height:1000},serviceWorkers:'block',reducedMotion:'reduce'});
  await context.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===origin&&!u.pathname.startsWith('/api/')&&r.request().method()==='GET'?r.continue():r.abort();});
  try {for(const route of ['/','/lumi','/lumi/']) {
    const page=await context.newPage();
    await page.goto(origin+route,{waitUntil:'networkidle'});
    await page.getByTestId(route==='/'?'page-home-refined':'page-lumi').waitFor({state:'visible'});
    assert.equal(await page.getByTestId('navbar-main').count(),1,'PUBLIC_APP_ONE_NAV');
    await readable(page.locator('.mm-public .mp-primary'),'PUBLIC_APP_CTA');
    results.push({route,result:'PUBLIC_CANDIDATE_APP_MOUNT_PASS',apis:'BLOCKED'});await page.close();
  }}finally{await context.close();}
  console.log('PUBLIC_PAGE_CASES=15');
}

async function buildGratitudeFixture() {
  const component=path.join(root,'client/src/components/GratitudePrompt.jsx');
  await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import Gratitude from ${JSON.stringify(component)};
const mode=new URLSearchParams(location.search).get('case');
const onSave=mode==='callback_reject'?()=>Promise.reject(Error('SYNTHETIC_CALLBACK')):mode==='callback_throw'?()=>{throw Error('SYNTHETIC_CALLBACK');}:undefined;
createRoot(document.getElementById('root')).render(<Gratitude onSave={onSave}/>);`,sourcefile:'gratitude-fixture.jsx',resolveDir:root,loader:'jsx'},
    outfile:path.join(fixture,'gratitude.js'),absWorkingDir:root,bundle:true,platform:'browser',format:'esm',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},
    plugins:[{name:'gratitude-isolation',setup(build){
      build.onResolve({filter:/AuthContext|^wouter$/},args=>{
        if(args.importer===component)return {path:args.path==='wouter'?'route':'auth',namespace:'gratitude-isolated'};
      });
      build.onLoad({filter:/.*/,namespace:'gratitude-isolated'},args=>({contents:args.path==='auth'
        ? `export const useAuth=()=>({isLoading:false,isAuthenticated:()=>new URLSearchParams(location.search).get('case')!=='signed_out'});`
        : `export const useLocation=()=>[new URLSearchParams(location.search).get('case')==='crisis'?'/crisis':'/'];`,loader:'js'}));
    }}]});
  fs.writeFileSync(path.join(fixture,'gratitude.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gratitude qualification</title>'+css.map(h=>'<link rel="stylesheet" href="'+h+'">').join('')+'<div id="root"></div><script type="module" src="/__fixture/gratitude.js"></script></html>');
}
async function checkGratitude(browser,origin,results) {
  const cases=['success','existing','quota','blocked_read','invalid_json','invalid_shape','callback_reject','callback_throw','signed_out','crisis'];
  for(const scenario of cases){
    const context=await browser.newContext({viewport:{width:390,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
    await context.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===origin&&!u.pathname.startsWith('/api/')&&r.request().method()==='GET'?r.continue():r.abort();});
    try {
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(mode=>{
        window.__originalSet=Storage.prototype.setItem;window.__originalGet=Storage.prototype.getItem;
        const initial=mode==='existing'?JSON.stringify([{response:'synthetic previous'}]):mode==='invalid_json'?'{broken':mode==='invalid_shape'?'{}':null;
        if(initial!==null)localStorage.setItem('gratitudeEntries',initial);
        window.__initial=initial;
        if(mode==='quota')Storage.prototype.setItem=function(k,v){if(k==='gratitudeEntries')throw new DOMException('Synthetic quota','QuotaExceededError');return window.__originalSet.call(this,k,v);};
        if(mode==='blocked_read')Storage.prototype.getItem=function(k){if(k==='gratitudeEntries')throw new DOMException('Synthetic denial','SecurityError');return window.__originalGet.call(this,k);};
      },scenario);
      await page.goto(origin+'/__fixture/gratitude.html?case='+scenario,{waitUntil:'networkidle'});
      if(['signed_out','crisis'].includes(scenario)){
        assert.equal(await page.getByTestId('gratitude-prompt').count(),0,'GRATITUDE_HIDDEN_'+scenario);
      }else{
        const field=page.getByTestId('textarea-gratitude'),save=page.getByTestId('button-save-gratitude');
        await field.waitFor();assert.equal(await save.isDisabled(),true,'EMPTY_SAVE_DISABLED');
        await field.fill('   ');assert.equal(await save.isDisabled(),true,'WHITESPACE_SAVE_DISABLED');
        await field.fill('  Synthetic gratitude test  ');await save.click();
        if(['quota','blocked_read','invalid_json','invalid_shape'].includes(scenario)){
          await page.getByTestId('gratitude-save-error').waitFor();
          assert.equal(await page.getByTestId('gratitude-save-success').count(),0,'NO_FALSE_SUCCESS');
          assert.equal(await field.inputValue(),'  Synthetic gratitude test  ','DRAFT_PRESERVED');
          assert.equal(await field.isEnabled(),true,'RETRY_FIELD_ENABLED');
          const preserved=await page.evaluate(()=>window.__originalGet.call(localStorage,'gratitudeEntries')===window.__initial);
          assert.equal(preserved,true,'OLD_STORAGE_PRESERVED');
          if(['quota','blocked_read'].includes(scenario)){
            await page.evaluate(()=>{Storage.prototype.setItem=window.__originalSet;Storage.prototype.getItem=window.__originalGet;});
            await save.click();await page.getByTestId('gratitude-save-success').waitFor();
            assert.equal(await page.getByTestId('gratitude-save-error').count(),0,'RETRY_CLEARS_ERROR');
            assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('gratitudeEntries')).length),1,'RETRY_SAVES_ONCE');
          }
        }else{
          await page.getByTestId('gratitude-save-success').waitFor();
          assert.equal(await page.getByTestId('gratitude-save-success').innerText(),'Saved on this device');
          const entries=await page.evaluate(()=>JSON.parse(localStorage.getItem('gratitudeEntries')));
          assert.equal(entries.length,scenario==='existing'?2:1,'ENTRY_COUNT');
          assert.equal(entries[0].response,'Synthetic gratitude test','TRIMMED_SAVE');
          if(scenario==='existing')assert.equal(entries[1].response,'synthetic previous','PREVIOUS_ENTRY_RETAINED');
          if(scenario.startsWith('callback'))await page.getByTestId('gratitude-save-error').waitFor();
          if(scenario==='success'){
            await page.reload({waitUntil:'networkidle'});
            assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('gratitudeEntries'))[0].response),'Synthetic gratitude test','BROWSER_STORAGE_RELOAD');
          }
        }
      }
      assert.equal(errors.length,0,'GRATITUDE_RUNTIME_ERRORS:'+errors.join('|'));
      results.push({scenario,result:'GRATITUDE_FIXTURE_PASS',storage:'ISOLATED_SYNTHETIC_BROWSER',apis:'BLOCKED'});
    }finally{await context.close();}
  }
  console.log('GRATITUDE_FIXTURE_CASES='+cases.length);
}
