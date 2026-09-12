import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const pins = {
  'client/src/index.css': '4f3c8ee78dae5e51ebea71ae7cc6eba28314762bd229ada87ab84ca63d6d9113',
  'client/src/components/wellness/WellnessPageShell.jsx': 'ce29eb8b7bce5e7b6c575e2fa0e9da48903c31dc7e4c06dd5408bd4abc5624cc',
  'client/src/components/TglpNavbar.jsx': '8a9ff07e86b086ec6579a8e49419f4898043ed2a8f4d6944748580b738d88a32',
  'client/src/pages/JournalPage.jsx': 'c226dc9bced13f4a03b1a1b6132b18809f7f0a6e7d1bee349e22e5a0b6d87dce',
  'client/src/styles/mmhb-ui-controls.css': '62761c1b67d0d48082340db79f17209d4b5e59db59270b43b9d24dc0174711a7',
};
const once = (text, from, to) => {
  if (text.split(from).length !== 2) throw Error('PATCH_CONTEXT_CHANGED');
  return text.replace(from, () => to);
};
const uniquePattern = (text, re, to) => {
  if ([...text.matchAll(new RegExp(re.source, 'gm'))].length !== 1) throw Error('PATCH_PATTERN_CHANGED');
  return text.replace(re, () => to);
};

function change(file, source) {
  if (file.endsWith('/index.css')) {
    const tokens = ['background', 'foreground', 'card', 'card-foreground', 'popover',
      'popover-foreground', 'primary', 'primary-foreground', 'secondary',
      'secondary-foreground', 'muted', 'muted-foreground', 'accent', 'accent-foreground',
      'destructive', 'destructive-foreground', 'border', 'input', 'ring'];
    return '@import "tailwindcss" source(none);\n' + once(source,
      '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
      '@config "../../tailwind.config.js";\n@source "./";\n@source "../index.html";\n' +
      '@theme inline {\n' + tokens.map(t => '  --color-' + t + ': hsl(var(--' + t + '));').join('\n') + '\n}');
  }
  if (file.endsWith('/WellnessPageShell.jsx')) {
    let result = once(source, 'import { Link } from "wouter";\n', '');
    result = once(result, 'import { CRISIS_PATH } from "@/lib/safety";\n', '');
    result = once(result, ', Home, Sparkles, MessageCircle, BookOpen, Activity, LifeBuoy', '');
    result = uniquePattern(result, /^const QUICK_NAV = \[[\s\S]*?^\];\n\n/m, '');
    result = uniquePattern(result, /^      <nav\n[\s\S]*?^      <\/nav>\n\n/m, '');
    return once(result, '<div className="wellness-shell mx-auto max-w-5xl px-4 py-8">',
      '<div className="wellness-shell mx-auto max-w-5xl px-4 py-8" data-testid="wellness-page-shell">');
  }
  if (file.endsWith('/TglpNavbar.jsx')) {
    let result = once(source, 'const TOOL_LINKS = [\n',
      'const TOOL_LINKS = [\n  { href: "/start", label: "Start Here" },\n  { href: "/state", label: "Mood Check-In" },\n');
    result = once(result, '...WELLNESS_HUB_TOOLS.map((t) => ({ href: t.href, label: t.title })),\n];',
      '...WELLNESS_HUB_TOOLS.map((t) => ({ href: t.href, label: t.title })),\n].filter((item, index, items) => items.findIndex(t => t.href === item.href) === index);');
    if ((result.match(/cta-label-/g) || []).length !== 4) throw Error('NAV_LABEL_CONTEXT_CHANGED');
    return result.replaceAll('cta-label-', 'mmhb-nav-label-');
  }
  if (file.endsWith('/JournalPage.jsx')) {
    let result = once(source, 'className="hxos-vnext"', 'className="hxos-vnext mmhb-journal-page"');
    const start = '              <div\n                className="p-4 flex items-center justify-between gap-2 cursor-pointer hover:bg-muted/50 transition"';
    const end = '              {expandedId === entry.id && (';
    const a = result.indexOf(start), b = result.indexOf(end, a);
    if (a < 0 || b < 0 || result.indexOf(start, a + 1) >= 0) throw Error('ENTRY_CONTEXT_CHANGED');
    result = result.slice(0, a) + `              <div className="mmhb-entry-row">
                <h3 className="mmhb-entry-heading">
                  <button type="button" className="mmhb-entry-toggle"
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    aria-expanded={expandedId === entry.id}
                    aria-controls={\`entry-content-\${entry.id}\`}
                    data-testid={\`button-expand-\${entry.id}\`}>
                    <PenLine aria-hidden="true" />
                    <span className="mmhb-entry-copy">
                      <span className="mmhb-entry-title">{entry.title || "Untitled"}</span>
                      <span className="mmhb-entry-date">
                        <Calendar aria-hidden="true" />
                        <time dateTime={entry.createdAt}>
                          {new Date(entry.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </time>
                      </span>
                    </span>
                    {expandedId === entry.id ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                  </button>
                </h3>
                <button type="button" className="mmhb-entry-delete"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={\`button-delete-\${entry.id}\`}
                  aria-label={\`Delete entry: \${entry.title || "Untitled"}\`}>
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
` + result.slice(b);
    return result;
  }
  if (file.endsWith('/mmhb-ui-controls.css')) {
    return source.replaceAll('cta-label-', 'mmhb-nav-label-') + '\n' + JOURNAL_CSS;
  }
  throw Error('UNEXPECTED_PATCH_FILE');
}

const JOURNAL_CSS = `/* MMHB: readable journal controls and native entry disclosure. */
.hxos-vnext.mmhb-journal-page {
  --foreground: 173 45% 16%; --muted-foreground: 180 33% 27%;
  --background: 36 33% 98%; --card: 0 0% 100%;
  --card-foreground: 173 45% 16%; --primary: 180 33% 27%;
  --primary-foreground: 0 0% 100%;
}
.hxos-vnext.mmhb-journal-page button {
  min-height: 44px; min-width: 44px; padding: 10px 14px;
  color: #fff !important; background: #2f5d5d !important;
  border: 1px solid #2f5d5d; border-radius: 12px;
  font-size: 14px; line-height: 1.5; font-weight: 600;
  text-shadow: none !important; -webkit-text-fill-color: currentColor !important;
}
.hxos-vnext.mmhb-journal-page button:not(:disabled):hover { background: #214747 !important; }
.hxos-vnext.mmhb-journal-page button :is(span, p, svg) {
  color: inherit !important; -webkit-text-fill-color: currentColor !important;
}
.hxos-vnext.mmhb-journal-page button:disabled { opacity: 1 !important; cursor: not-allowed; }
.hxos-vnext.mmhb-journal-page button:focus-visible,
.hxos-vnext.mmhb-journal-page input:focus-visible, .hxos-vnext.mmhb-journal-page textarea:focus-visible {
  outline: 3px solid #163a36 !important; outline-offset: 3px !important;
}
.hxos-vnext.mmhb-journal-page [data-testid="form-journal"] { background: #fff !important; }
.hxos-vnext.mmhb-journal-page [data-testid="form-journal"] :is(input[type="text"], textarea) {
  color: #163a36 !important; background: #fff !important;
  font-size: 16px; line-height: 1.5; border: 1px solid #718e85;
  -webkit-text-fill-color: currentColor !important;
}
.hxos-vnext.mmhb-journal-page [data-testid="form-journal"] :is(input, textarea)::placeholder {
  color: #2f5d5d !important; opacity: 1 !important;
}
.hxos-vnext.mmhb-journal-page .mmhb-entry-row {
  display: flex; align-items: center; gap: 8px; padding-right: 8px;
  color: #163a36; background: #f6f1e8; border-radius: 12px;
}
.hxos-vnext.mmhb-journal-page .mmhb-entry-heading {
  flex: 1; min-width: 0; margin: 0; padding: 0; background: none !important;
}
.hxos-vnext.mmhb-journal-page button.mmhb-entry-toggle {
  display: flex; align-items: center; gap: 12px; width: 100%;
  min-width: 0; padding: 16px; text-align: left;
}
.hxos-vnext.mmhb-journal-page .mmhb-entry-copy { display: block; flex: 1; min-width: 0; }
.hxos-vnext.mmhb-journal-page .mmhb-entry-title {
  display: block; font-size: 16px; font-weight: 600; white-space: normal;
  overflow-wrap: anywhere; color: #163a36 !important; background: none !important;
  -webkit-text-fill-color: currentColor !important;
}
.hxos-vnext.mmhb-journal-page .mmhb-entry-date {
  display: flex; align-items: center; gap: 6px; margin-top: 4px;
  color: #2f5d5d !important; font-size: 14px; font-weight: 400;
}
.hxos-vnext.mmhb-journal-page .mmhb-entry-row svg { width: 18px; height: 18px; flex-shrink: 0; }
.hxos-vnext.mmhb-journal-page button.mmhb-entry-delete { flex-shrink: 0; padding: 10px; }
.hxos-vnext.mmhb-journal-page :is(button.mmhb-entry-toggle, button.mmhb-entry-delete,
  button[data-testid="button-cancel"], button[data-testid="button-refresh-prompt"],
  button[role="tab"][aria-selected="false"]) {
  color: #163a36 !important; background: #f6f1e8 !important; box-shadow: none !important;
}
.hxos-vnext.mmhb-journal-page :is(button.mmhb-entry-toggle, button.mmhb-entry-delete,
  button[data-testid="button-cancel"], button[data-testid="button-refresh-prompt"]):hover {
  background: #e1ece3 !important;
}
@media (max-width: 479px) {
  .hxos-vnext.mmhb-journal-page [data-testid="journal-prompts"] > div { flex-wrap: wrap; }
  .hxos-vnext.mmhb-journal-page [data-testid="journal-prompts"] > div > div:first-child { flex-basis: 100%; }
}
@media (forced-colors: active) {
  .hxos-vnext.mmhb-journal-page button { border-color: ButtonText !important; }
}
`;

const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const single = (text, from, to) => {
  if (text.split(from).length !== 2) throw Error('RUNNER_CONTEXT_CHANGED');
  return text.replace(from, () => to);
};
const constant = (text, name) => {
  const regex = new RegExp('^const '+name+' = (.*);$', 'gm');
  const matches=[...text.matchAll(regex)];
  if(matches.length!==1)throw Error('RUNNER_CONSTANT_CHANGED');
  return {line:matches[0][0],value:JSON.parse(matches[0][1])};
};
function assemble(original, sources, pageChecks) {
  if(sha(original)!=='93f1728acfe7ee672a699971f7b60f82839eed24a8783538dd858202a05627d8')
    throw Error('ORIGINAL_REPAIR_CHANGED');
  const payload=Object.entries(pins).map(([file,beforeHash])=>{
    if(sha(sources[file])!==beforeHash)throw Error('SOURCE_BASELINE_CHANGED:'+file);
    return {file,beforeHash,after:change(file,sources[file])};
  });
  const oldQualify=constant(original,'QUALIFY_CHILD');
  let qualifier=single(oldQualify.value,"const { chromium } = await dep('playwright');",
    "const { chromium } = req('playwright');\nassert.equal(typeof chromium?.launch, 'function', 'PLAYWRIGHT_CHROMIUM_EXPORT_MISSING');");
  qualifier=single(qualifier,'const fixtureHtml = ',
    "checkCompiledUtilities();\nconst pageFixtureHtml = await buildPageFixture();\nconst fixtureHtml = ");
  qualifier=single(qualifier,"    if (u.pathname === '/__fixture/')",
    "    if (['/journal','/dashboard'].includes(u.pathname) && u.searchParams.get('fixture') === '1') { response.setHeader('Content-Type','text/html'); response.end(pageFixtureHtml); return; }\n    if (u.pathname === '/__fixture/')");
  qualifier=single(qualifier,"  fs.writeFileSync(path.join(report, 'ui-check.json'),",
    "  await checkPages(browser, origin, results);\n  fs.writeFileSync(path.join(report, 'ui-check.json'),");
  qualifier=single(qualifier,"'Authentication is simulated only in component fixtures.'",
    "'Authentication and API data are simulated in component and page-composition fixtures.'");
  qualifier+='\n'+pageChecks;
  let script=single(original,constant(original,'PAYLOAD').line,'const PAYLOAD = '+JSON.stringify(payload)+';');
  script=single(script,oldQualify.line,'const QUALIFY_CHILD = '+JSON.stringify(qualifier)+';');
  script=single(script,"const ID = 'MMHB_NAV_SHARE_20260911_V1';","const ID = 'MMHB_UI_FOUNDATION_20260911_V1';");
  script=single(script,"const INDEX_BEFORE = '33e6aa5d4ebd419f62c02f47714d846d9a51c19735a284e75855bff793ed61d0';",
    "const INDEX_BEFORE = '5a1c51ba4285c1d3335d8ee8d15e9b015d47654f2aa4589109b8bf1fbea87bba';");
  script=single(script,"path.join(ROOT, 'mmhb-ui-repair-')","path.join(ROOT, 'mmhb-ui-foundation-')");
  script=script.replace(/^\/\*\*[\s\S]*?\*\/\n/, '/** MMHB CSS foundation and page controls. Generated from reviewed inputs.\n * Updates Preview after build, compiled-CSS and browser checks.\n * Keeps backups and restores owned changes on failure. No public deployment.\n */\n');
  script=single(script,"const protectedFiles = {",`const protectedFiles = {
  'client/src/styles/wellness-shell.css': 'fb6686f97789cbc1e5123cd50ba7e75577bbe3f8f79cb7effeb4819e74d96bcd',
  'client/src/components/JournalSharingOptions.jsx': '91dc07839429ad3284160309503450f5d5cd0f4a518ed952c37f851abc26c1c0',`);
  script=single(script,"    await checkHttp('/journal', newIndexHash, /text\\/html/i);",
    "    await checkHttp('/journal', newIndexHash, /text\\/html/i);\n    await checkHttp('/dashboard', newIndexHash, /text\\/html/i);");
  return {script,payload,qualifier,build:constant(original,'BUILD_CHILD').value};
}

const PAGE_CHECKS = "// Appended to the previously reviewed qualifier; it supplies req, root, report,\n// fixture, esbuild, authFixture, css, assert, fs and path.\nasync function buildPageFixture() {\n  const pageEntry = `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { QueryClientProvider } from '@tanstack/react-query';\nimport Navbar from ${JSON.stringify(path.join(root, 'client/src/components/TglpNavbar.jsx'))};\nimport Journal from ${JSON.stringify(path.join(root, 'client/src/pages/JournalPage.jsx'))};\nimport Dashboard from ${JSON.stringify(path.join(root, 'client/src/pages/dashboard/Overview.jsx'))};\nimport { Provider } from 'mmhb-fixture-auth';\nimport { queryClient } from 'mmhb-fixture-data';\nif (new URLSearchParams(location.search).get('theme') === 'dark') document.documentElement.classList.add('dark');\ncreateRoot(document.getElementById('root')).render(\n <QueryClientProvider client={queryClient}><Provider><Navbar/>\n  {location.pathname === '/journal' ? <Journal/> : <Dashboard/>}\n  <div id=\"utility-probe\" className=\"hidden md:flex p-4 gap-3 text-sm bg-card text-foreground rounded-xl\">Layout check</div>\n </Provider></QueryClientProvider>);`;\n  const dataFixture = `import { QueryClient } from '@tanstack/react-query';\nwindow.fixtureMutationCalls = 0;\nexport const queryClient = new QueryClient({defaultOptions:{queries:{\n retry:false, staleTime:Infinity, refetchOnWindowFocus:false,\n queryFn:()=>{throw Error('UNSEEDED_FIXTURE_QUERY');}\n}}});\nconst entries = [{id:'mmhb-fixture-entry',title:'A readable journal title ' + 'longword'.repeat(12),\n content:'Synthetic text for checking the journal display. No personal information.',createdAt:'2026-09-11T00:00:00Z'}];\nfor (const key of ['/api/journal','/api/journals']) queryClient.setQueryData([key],entries);\nfor (const key of ['/api/mood','/api/moods']) queryClient.setQueryData([key],[]);\nqueryClient.setQueryData(['/api/user/stats'],{streak:'1 day',sessions:0,insights:1,growthScore:'3%',xp:45,level:1});\nqueryClient.setQueryData(['/api/user/activity'],{activities:[]});\nqueryClient.setQueryData(['/api/user/tasks'],{tasks:[]});\nexport async function apiRequest(){window.fixtureMutationCalls++;throw Error('FIXTURE_API_FORBIDDEN');}\nexport const getQueryFn=()=>async()=>{throw Error('FIXTURE_FETCH_FORBIDDEN');};`;\n  await esbuild.build({\n    stdin: {contents:pageEntry,sourcefile:'mmhb-pages.jsx',resolveDir:root,loader:'jsx'},\n    outfile:path.join(fixture,'pages.js'),absWorkingDir:root,\n    bundle:true,platform:'browser',format:'esm',jsx:'automatic',\n    define:{'process.env.NODE_ENV':'\"production\"'},alias:{'@':path.join(root,'client/src')},\n    plugins:[{name:'page-fixture-services',setup(build){\n      build.onResolve({filter:/mmhb-fixture-|AuthContext|GamificationContext|EmotionContext|lib\\/queryClient|ModeToggle|GlobalSearch|lumi-registry|ReflectionCardExport|VoiceAffirmation|useSEO|\\/SEO$/},args=>{\n        let kind;\n        if (/AuthContext|mmhb-fixture-auth/.test(args.path)) kind='auth';\n        else if (/lib\\/queryClient|mmhb-fixture-data/.test(args.path)) kind='data';\n        else if (/GamificationContext/.test(args.path)) kind='xp';\n        else if (/EmotionContext/.test(args.path)) kind='emotion';\n        else if (/lumi-registry/.test(args.path)) kind='lumi';\n        else if (/useSEO/.test(args.path)) kind='seo';\n        else kind='empty';\n        return {path:kind,namespace:'mmhb-page-fixture'};\n      });\n      build.onLoad({filter:/.*/,namespace:'mmhb-page-fixture'},args=>({\n        contents:args.path==='auth'?authFixture:args.path==='data'?dataFixture:\n          args.path==='xp'?'export const useGamification=()=>({awardXp:async()=>{throw Error(\"FIXTURE_XP_FORBIDDEN\");}});':\n          args.path==='emotion'?'export const useEmotion=()=>({setEmotion:()=>{}});':\n          args.path==='lumi'?'export const OfficialLumi=()=>null; export const LumiSceneRenderer=()=>null;':\n          args.path==='seo'?'export const useSEO=()=>{};':'export default function Decoration(){return null;}',\n        loader:'jsx',resolveDir:root,\n      }));\n    }}],\n  });\n  return '<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>MMHB page qualification</title>' +\n    css.map(href=>'<link rel=\"stylesheet\" href=\"'+href+'\">').join('')+\n    '<link rel=\"stylesheet\" href=\"/__fixture/pages.css\"><div id=\"root\"></div><script type=\"module\" src=\"/__fixture/pages.js\"></script></html>';\n}\n\nfunction checkCompiledUtilities() {\n  const parse = createRequire(req.resolve('@tailwindcss/postcss'))('postcss').parse;\n  const required = new Map([\n    ['.p-4','padding'],['.py-8','padding-block'],['.gap-3','gap'],['.text-sm','font-size'],\n    ['.text-foreground','color'],['.text-muted-foreground','color'],['.bg-card','background-color'],\n    ['.rounded-xl','border-radius'],['.md\\\\:flex','display'],\n  ]);\n  const found = new Set();\n  for (const href of css) {\n    const tree=parse(fs.readFileSync(path.join(report,'dist',href.slice(1)),'utf8'));\n    tree.walkRules(rule=>{\n      const selectors=rule.selector.split(',').map(s=>s.trim());\n      for (const [selector,prop] of required) {\n        if(selectors.includes(selector)) rule.walkDecls(prop,()=>found.add(selector));\n      }\n    });\n  }\n  for (const selector of required.keys()) assert.ok(found.has(selector),'MISSING_COMPILED_UTILITY:'+selector);\n  console.log('COMPILED_UTILITY_CHECKS='+found.size);\n}\n\nasync function readable(locator, label) {\n  await locator.waitFor({state:'visible'});\n  const paint = await locator.evaluate(element=>{\n    const s=getComputedStyle(element);\n    let p=element, background, gradient=false;\n    while(p){\n      const style=getComputedStyle(p);\n      if(style.backgroundImage!=='none') gradient=true;\n      const rgb=style.backgroundColor.match(/[\\d.]+/g)?.map(Number)||[];\n      if(rgb.length>=3 && (rgb.length===3 || rgb[3]===1)){background=rgb.slice(0,3);break;}\n      p=p.parentElement;\n    }\n    const color=s.color.match(/[\\d.]+/g)?.map(Number)||[];\n    return {color:color.slice(0,3),alpha:color[3]??1,background,gradient,\n      fill:s.webkitTextFillColor,paintColor:s.color,opacity:s.opacity,font:parseFloat(s.fontSize)};\n  });\n  assert.equal(paint.alpha,1,label+':TEXT_ALPHA');\n  assert.equal(paint.opacity,'1',label+':OPACITY');\n  assert.equal(paint.gradient,false,label+':GRADIENT_REQUIRES_REVIEW');\n  assert.ok(paint.background&&paint.color.length===3,label+':SOLID_COLORS_REQUIRED');\n  assert.ok(paint.fill===paint.paintColor || paint.fill==='currentcolor',label+':TEXT_FILL');\n  const luminance=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;})\n    .reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);\n  const a=luminance(paint.color),b=luminance(paint.background);\n  const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);\n  assert.ok(ratio>=4.5,label+':CONTRAST='+ratio.toFixed(2));\n  return Number(ratio.toFixed(2));\n}\n\nasync function checkPages(browser, origin, results) {\n  for (const width of [320,768,1365]) for(const theme of ['light','dark']) {\n    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});\n    await context.route('**/*',route=>{\n      const u=new URL(route.request().url());\n      return u.origin===origin&&!u.pathname.startsWith('/api/')&&route.request().method()==='GET'\n        ? route.continue():route.abort();\n    });\n    try {\n      for (const route of ['/journal','/dashboard']) {\n        const page=await context.newPage(); const errors=[];\n        page.on('pageerror',e=>errors.push(e.message.slice(0,140)));\n        await page.goto(origin+route+'?fixture=1&theme='+theme,{waitUntil:'networkidle'});\n        await page.getByTestId('wellness-page-shell').waitFor({state:'visible'});\n        assert.equal(await page.getByTestId('navbar-main').count(),1,'ONE_MAIN_NAVBAR');\n        assert.equal(await page.getByTestId('wellness-quicknav').count(),0,'NO_SECOND_NAVIGATION_ROW');\n        assert.equal(await page.getByTestId('wellness-page-shell').count(),1,'ONE_PAGE_SHELL');\n        const layout=await page.evaluate(()=>{\n          const probe=getComputedStyle(document.getElementById('utility-probe'));\n          const shell=document.querySelector('[data-testid=\"wellness-page-shell\"]');\n          const cta=document.querySelector('[data-testid=\"link-dashboard-cta\"] .mmhb-nav-label-full');\n          return {padding:parseFloat(probe.paddingTop),gap:parseFloat(probe.gap),font:parseFloat(probe.fontSize),\n            display:probe.display,shellPadding:parseFloat(getComputedStyle(shell).paddingLeft),\n            nestedImage:getComputedStyle(cta).backgroundImage,nestedColor:getComputedStyle(cta).backgroundColor,\n            overflow:document.documentElement.scrollWidth>innerWidth+1};\n        });\n        assert.ok(layout.padding>=14&&layout.gap>=10&&layout.font>=12,'LAYOUT_UTILITIES_EFFECTIVE');\n        assert.equal(layout.display,width<768?'none':'flex','RESPONSIVE_VISIBILITY');\n        assert.ok(layout.shellPadding>=14,'PAGE_SPACING');\n        assert.equal(layout.nestedImage,'none','NO_NESTED_CTA_GRADIENT');\n        assert.equal(layout.nestedColor,'rgba(0, 0, 0, 0)','NO_NESTED_CTA_BACKGROUND');\n        assert.equal(layout.overflow,false,'PAGE_OVERFLOW');\n        const ratios={signout:await readable(page.getByTestId('button-navbar-signout'),'SIGN_OUT'),\n          dashboard:await readable(page.locator('[data-testid=\"link-dashboard-cta\"] .mmhb-nav-label-full'),'DASHBOARD_LABEL')};\n        if(route==='/journal'){\n          const toggle=page.getByTestId('button-expand-mmhb-fixture-entry');\n          assert.equal(await toggle.evaluate(e=>e.tagName),'BUTTON','NATIVE_DISCLOSURE');\n          ratios.title=await readable(page.locator('.mmhb-entry-title'),'JOURNAL_TITLE');\n          ratios.date=await readable(page.locator('.mmhb-entry-date'),'JOURNAL_DATE');\n          await toggle.focus(); await page.keyboard.press('Space');\n          await page.locator('#entry-content-mmhb-fixture-entry').waitFor({state:'visible'});\n          assert.equal(await toggle.getAttribute('aria-expanded'),'true','SPACE_OPENS_ENTRY');\n          await toggle.focus(); await page.keyboard.press('Enter');\n          assert.equal(await page.locator('#entry-content-mmhb-fixture-entry').count(),0,'ENTER_CLOSES_ENTRY');\n          await page.getByTestId('button-new').click();\n          await page.getByTestId('input-title').fill('Synthetic draft');\n          await page.getByTestId('input-content').fill('Synthetic content for a visual check only.');\n          assert.equal(await page.getByTestId('toggle-share').isChecked(),false,'ACTUAL_FORM_SHARE_DEFAULT_OFF');\n          ratios.share=await readable(page.locator('.mmhb-sharing-title'),'SHARING_TITLE');\n          ratios.save=await readable(page.getByTestId('button-save'),'SAVE_ENTRY');\n          ratios.insights=await readable(page.getByTestId('button-analyze-journal'),'GET_INSIGHTS');\n          ratios.input=await readable(page.getByTestId('input-title'),'DRAFT_TEXT');\n          assert.equal(await page.evaluate(()=>window.fixtureMutationCalls),0,'NO_FIXTURE_MUTATIONS');\n        }else{\n          await page.getByTestId('text-page-title').waitFor({state:'visible'});\n          assert.equal((await page.getByTestId('stat-value-journal-entries').innerText()).trim(),'1','DASHBOARD_FIXTURE_LOADED');\n        }\n        assert.equal(errors.length,0,'PAGE_RUNTIME_ERRORS:'+errors.join('|'));\n        if(width===320||width===1365) await page.screenshot({path:path.join(report,'page-'+route.slice(1)+'-'+width+'-'+theme+'.png'),fullPage:true});\n        results.push({route,width,theme,result:'PAGE_COMPOSITION_FIXTURE_PASS',contrastRatios:ratios});\n        await page.close();\n      }\n    } finally {await context.close();}\n  }\n  console.log('PAGE_COMPOSITION_CASES=12');\n}\n";
const AFTER_HASHES = {"client/src/index.css":"4cd664160fa56ca74c6f4ce8f956b52d547df66b7d28330f50e19c5778080f83","client/src/components/wellness/WellnessPageShell.jsx":"a7786f30b920e59a001a9257f331972570d7b245b825190d4148a7b0a35a46d1","client/src/components/TglpNavbar.jsx":"53ee47e3fe33934446a5904699359ad5f473028fd0c79fb89363741de743d103","client/src/pages/JournalPage.jsx":"987b58914510c4550f2de76ba36633e8cab4918b6675abe1eeb5f066265b5c62","client/src/styles/mmhb-ui-controls.css":"f573e5237ac7783efc9cbda41e833407ecc8ea07d309ee086b7b1f6a64132044"};
const ROOT='/home/runner/workspace';
const ensure=(ok,message)=>{if(!ok)throw Error(message);};
function read(file){
 ensure(!path.isAbsolute(file)&&file.split('/').every(p=>p&&p!=='.'&&p!=='..'),'INVALID_PATH');
 let full=ROOT;for(const part of file.split('/')){full=path.join(full,part);ensure(!fs.lstatSync(full).isSymbolicLink(),'SYMLINK_FOUND');}
 const stat=fs.statSync(full);ensure(stat.isFile()&&stat.size<2000000,'UNEXPECTED_FILE');
 return fs.readFileSync(full,'utf8');
}
try{
 ensure(fs.realpathSync('.')===ROOT,'WRONG_WORKSPACE');
 ensure(sha(read('package.json'))==='0f7ef43511c004e3d268a2e2840d46a264453892937f5a2eb6a680b01481c1e0','PACKAGE_BASELINE_CHANGED');
 const req=createRequire(ROOT+'/package.json');
 ensure(req('tailwindcss/package.json').version==='4.3.3','TAILWIND_VERSION_CHANGED');
 ensure(typeof req('playwright').chromium?.launch==='function','PLAYWRIGHT_CHROMIUM_EXPORT_MISSING');
 const sources=Object.fromEntries(Object.keys(pins).map(file=>[file,read(file)]));
 if(Object.entries(AFTER_HASHES).every(([file,hash])=>sha(sources[file])===hash)){
  console.log('STATUS=SOURCE_ALREADY_UPDATED');
  console.log('NEXT_ACTION=CHECK_PREVIOUS_FOUNDATION_REPORT');
 }else{
  const built=assemble(read('mmhb-ui-repair.mjs'),sources,PAGE_CHECKS);
  for(const code of [built.script,built.qualifier,built.build]){
   const check=spawnSync(process.execPath,['--input-type=module','--check'],{input:code,encoding:'utf8',timeout:10000,maxBuffer:262144});
   ensure(!check.error&&check.status===0,'GENERATED_SCRIPT_SYNTAX_FAILED');
  }
  const file='mmhb-ui-foundation-v1.mjs';
  if(fs.existsSync(file))ensure(sha(read(file))===sha(built.script),'GENERATED_SCRIPT_DIFFERS');
  else fs.writeFileSync(file,built.script,{flag:'wx',mode:0o600});
  console.log('FOUNDATION_REPAIR=READY');
  console.log('SOURCE_FILES_PLANNED=5 PUBLIC_DEPLOYMENT=NOT_RUN');
  const result=spawnSync(process.execPath,[file],{stdio:'inherit',timeout:1200000});
  if(result.error)throw Error('REPAIR_PROCESS_FAILED');
  process.exitCode=result.status===0?0:1;
 }
}catch(error){
 console.error('PREPARATION_STOPPED='+(error.code||error.message));process.exitCode=1;
}
