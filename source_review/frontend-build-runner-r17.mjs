import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

// This child executes the reviewed build configuration and build tools only.
// The parent validates source/tool identities, owns the timeout and verifies
// candidate outputs. No application server, package manager or installer runs.
const ROOT = process.argv[3];
const reportDir = process.argv[2];
const LIMIT = { entries: 100000, string: 32768, evidence: 64 * 1024 * 1024, asset: 64 * 1024 * 1024 };
let phase = 'VALIDATE_CHILD_CONTEXT';
let ready = false;
let resolvedEvidence;
let graph = { modules: [], watchFiles: [], capturedAt: [], moduleIdsSupported: false, watchFilesSupported: false };
let emitted = [];

function fail(code) { const e = new Error(code); e.code = code; throw e; }
function ensure(value, code) { if (!value) fail(code); }
function boundedString(value) {
  ensure(typeof value === 'string' && value.length <= LIMIT.string, 'UNSUPPORTED_EVIDENCE_STRING');
  return value;
}
function strings(values) {
  ensure(values && typeof values[Symbol.iterator] === 'function', 'UNSUPPORTED_EVIDENCE_LIST');
  const result = [];
  for (const value of values) {
    ensure(result.length < LIMIT.entries, 'EVIDENCE_ENTRY_LIMIT');
    result.push(boundedString(value));
  }
  return [...new Set(result)].sort();
}
function writeEvidence(name, value) {
  const encoded = JSON.stringify(value, null, 2) + '\n';
  ensure(Buffer.byteLength(encoded) <= LIMIT.evidence, 'EVIDENCE_SIZE_LIMIT');
  const full = path.join(reportDir, name);
  fs.writeFileSync(full, encoded, { encoding: 'utf8', mode: 0o600, flag: 'wx' });
}
function assetName(value) {
  boundedString(value);
  ensure(value && !path.isAbsolute(value) && !value.includes('\\') && !/[\x00-\x1f\x7f]/.test(value)
    && !value.split('/').some(p => p === '' || p === '.' || p === '..'), 'UNSUPPORTED_OUTPUT_PATH');
  return value;
}
function outputFile(relative) {
  const name = assetName(relative);
  const full = path.join(reportDir, 'frontend', name);
  const root = path.join(reportDir, 'frontend');
  let cursor = root;
  ensure(fs.lstatSync(cursor).isDirectory(), 'OUTPUT_DIRECTORY_INVALID');
  for (const component of name.split('/')) {
    cursor = path.join(cursor, component);
    ensure(!fs.lstatSync(cursor).isSymbolicLink(), 'OUTPUT_SYMLINK_REJECTED');
  }
  const stat = fs.statSync(full);
  ensure(stat.isFile() && stat.size <= LIMIT.asset, 'OUTPUT_FILE_INVALID');
  return { full, bytes: stat.size };
}
function collectGraph(context, at) {
  const hasIds = typeof context.getModuleIds === 'function';
  const hasWatch = typeof context.getWatchFiles === 'function';
  if (hasIds) {
    graph.moduleIdsSupported = true;
    graph.modules = strings(context.getModuleIds()).map(id => {
      const info = typeof context.getModuleInfo === 'function' ? context.getModuleInfo(id) : null;
      return {
        id,
        importedIds: strings(info?.importedIds || []),
        dynamicallyImportedIds: strings(info?.dynamicallyImportedIds || []),
        isEntry: info?.isEntry === true,
        isExternal: info?.isExternal === true,
      };
    });
  }
  if (hasWatch) {
    graph.watchFilesSupported = true;
    graph.watchFiles = strings(context.getWatchFiles());
  }
  graph.capturedAt.push(at);
}
function collectEmitted(bundle) {
  ensure(bundle && typeof bundle === 'object' && Object.keys(bundle).length <= LIMIT.entries, 'OUTPUT_ENTRY_LIMIT');
  return Object.values(bundle).map(item => {
    const fileName = assetName(item.fileName);
    ensure(item.type === 'asset' || item.type === 'chunk', 'UNSUPPORTED_OUTPUT_TYPE');
    if (item.type === 'asset') {
      return { fileName, type: 'asset', bytes: Buffer.byteLength(item.source),
        names: strings(item.names || (item.name ? [item.name] : [])),
        originalFileNames: strings(item.originalFileNames || []) };
    }
    return {
      fileName, type: 'chunk', bytes: Buffer.byteLength(item.code), isEntry: item.isEntry === true,
      isDynamicEntry: item.isDynamicEntry === true, facadeModuleId: item.facadeModuleId === null ? null : boundedString(item.facadeModuleId || ''),
      imports: strings(item.imports || []), dynamicImports: strings(item.dynamicImports || []),
      referencedFiles: strings(item.referencedFiles || []), implicitlyLoadedBefore: strings(item.implicitlyLoadedBefore || []),
      css: strings(item.viteMetadata?.importedCss || []), assets: strings(item.viteMetadata?.importedAssets || []),
      moduleIds: strings(Object.keys(item.modules || {})),
    };
  }).sort((a, b) => a.fileName.localeCompare(b.fileName));
}

try {
  ensure(process.cwd() === ROOT && fs.realpathSync(ROOT) === ROOT, 'WRONG_WORKSPACE');
  ensure(typeof reportDir === 'string' && path.isAbsolute(reportDir), 'REPORT_PATH_REQUIRED');
  ensure(fs.realpathSync(reportDir) === reportDir && fs.lstatSync(reportDir).isDirectory(), 'REPORT_DIRECTORY_INVALID');
  ensure(path.basename(reportDir) === 'frontend-build' && /^\/tmp\/mmhb-build-r17-[A-Za-z0-9]+$/.test(ROOT), 'REPORT_DIRECTORY_SCOPE');
  ensure((fs.statSync(reportDir).mode & 0o077) === 0, 'REPORT_DIRECTORY_NOT_PRIVATE');
  ensure(process.env.NODE_ENV === 'production', 'PRODUCTION_ENV_REQUIRED');
  process.umask(0o077);
  ready = true;
  const requireFromRoot = createRequire(path.join(ROOT, 'package.json'));
  const importDependency = specifier => import(pathToFileURL(requireFromRoot.resolve(specifier)).href);

  phase = 'IMPORT_REVIEWED_BUILD_TOOLS';
  const vite = await importDependency('vite');
  const { visualizer } = await importDependency('rollup-plugin-visualizer');
  const tailwindPostcssModule = await importDependency('@tailwindcss/postcss');
  const autoprefixerModule = await importDependency('autoprefixer');
  ensure(typeof vite.build === 'function' && typeof visualizer === 'function', 'BUILD_API_UNAVAILABLE');
  const tailwindPostcss = tailwindPostcssModule.default;
  const autoprefixer = autoprefixerModule.default;
  ensure(typeof tailwindPostcss === 'function' && typeof autoprefixer === 'function', 'POSTCSS_FACTORY_UNAVAILABLE');

  phase = 'IMPORT_PINNED_ROOT_CONFIG';
  const { default: config } = await import(pathToFileURL(path.join(ROOT, 'vite.config.js')).href);
  ensure(config && typeof config === 'object' && !Array.isArray(config), 'ROOT_CONFIG_NOT_OBJECT');
  ensure(Array.isArray(config.plugins) && config.plugins.length === 2
    && config.plugins[1]?.name === 'visualizer', 'ROOT_CONFIG_PLUGIN_SHAPE_CHANGED');
  ensure(path.resolve(config.root) === path.join(ROOT, 'client'), 'ROOT_CONFIG_CLIENT_ROOT_CHANGED');
  ensure(config.build && config.build.rollupOptions?.input === path.join(ROOT, 'client/index.html'), 'ROOT_CONFIG_ENTRY_CHANGED');
  ensure(config.define?.['process.env.NODE_ENV'] === '"production"', 'ROOT_CONFIG_PRODUCTION_DEFINE_CHANGED');
  const postcssPlugins = [tailwindPostcss({}), autoprefixer({})];
  ensure(postcssPlugins[0]?.postcssPlugin === '@tailwindcss/postcss'
    && postcssPlugins[1]?.postcssPlugin === 'autoprefixer', 'POSTCSS_PLUGIN_SHAPE_CHANGED');

  const frontendDir = path.join(reportDir, 'frontend');
  const cacheDir = path.join(reportDir, 'cache');
  ensure(!fs.existsSync(frontendDir) && !fs.existsSync(cacheDir), 'CANDIDATE_DIRECTORY_ALREADY_EXISTS');
  const evidencePlugin = {
    name: 'mmhb-r17-private-build-evidence',
    enforce: 'post',
    configResolved(resolved) {
      phase = 'VERIFY_RESOLVED_BUILD_CONFIG';
      ensure(resolved.command === 'build' && resolved.mode === 'production' && resolved.isProduction === true, 'RESOLVED_BUILD_MODE_CHANGED');
      ensure(path.resolve(resolved.root) === path.join(ROOT, 'client'), 'RESOLVED_ROOT_CHANGED');
      ensure(path.resolve(resolved.build.outDir) === frontendDir && resolved.build.emptyOutDir === false, 'RESOLVED_OUTPUT_CHANGED');
      ensure(path.resolve(resolved.cacheDir) === cacheDir, 'RESOLVED_CACHE_CHANGED');
      ensure(resolved.envDir === false && resolved.inlineConfig?.envFile === false
        && resolved.configFile === undefined, 'RESOLVED_ENV_OR_CONFIG_LOADING_CHANGED');
      ensure(resolved.build.write === true && resolved.build.ssr === false && !resolved.build.lib
        && !resolved.build.watch, 'RESOLVED_BUILD_KIND_CHANGED');
      ensure(Array.isArray(resolved.css?.postcss?.plugins)
        && resolved.css.postcss.plugins.length === 2
        && resolved.css.postcss.plugins[0]?.postcssPlugin === '@tailwindcss/postcss'
        && resolved.css.postcss.plugins[1]?.postcssPlugin === 'autoprefixer', 'RESOLVED_POSTCSS_CHANGED');
      resolvedEvidence = {
        command: resolved.command, mode: resolved.mode, isProduction: resolved.isProduction,
        root: resolved.root, publicDir: resolved.publicDir, cacheDir: resolved.cacheDir,
        configFile: resolved.configFile ?? null, envDir: resolved.envDir, envFile: resolved.inlineConfig.envFile,
        base: resolved.base, outDir: resolved.build.outDir, emptyOutDir: resolved.build.emptyOutDir,
        write: resolved.build.write, ssr: resolved.build.ssr, sourcemap: resolved.build.sourcemap,
        target: resolved.build.target, minify: resolved.build.minify,
        cssPostcss: ['@tailwindcss/postcss', 'autoprefixer'],
        visualizerFile: path.join(reportDir, 'bundle-report.html'),
        pluginNames: strings(resolved.plugins.map(plugin => plugin.name)),
      };
      phase = 'VITE_BUILD';
    },
    generateBundle(_options, bundle) {
      collectGraph(this, 'generateBundle');
      emitted = collectEmitted(bundle);
    },
    writeBundle(_options, bundle) {
      collectGraph(this, 'writeBundle');
      emitted = collectEmitted(bundle);
    },
  };
  phase = 'VITE_BUILD';
  await vite.build({
    ...config,
    configFile: false,
    envFile: false,
    envDir: false,
    mode: 'production',
    cacheDir,
    clearScreen: false,
    plugins: [config.plugins[0], visualizer({ filename: path.join(reportDir, 'bundle-report.html'),
      template: 'treemap', gzipSize: true, brotliSize: true, open: false }), evidencePlugin],
    css: { ...config.css, postcss: { plugins: postcssPlugins } },
    build: { ...config.build, outDir: frontendDir, emptyOutDir: false },
  });

  phase = 'VERIFY_FRONTEND_OUTPUTS';
  ensure(resolvedEvidence && graph.capturedAt.includes('writeBundle'), 'BUILD_EVIDENCE_HOOK_NOT_REACHED');
  ensure(graph.moduleIdsSupported && graph.modules.length > 0, 'MODULE_GRAPH_UNAVAILABLE');
  ensure(emitted.some(item => item.fileName === 'index.html'), 'HTML_ENTRY_NOT_EMITTED');
  ensure(emitted.some(item => item.type === 'chunk' && /\.(?:m?js)$/.test(item.fileName)), 'JAVASCRIPT_NOT_EMITTED');
  const cssFiles = emitted.filter(item => item.type === 'asset' && item.fileName.endsWith('.css'));
  ensure(cssFiles.length > 0, 'CSS_NOT_EMITTED');
  const index = outputFile('index.html');
  ensure(index.bytes > 0, 'HTML_ENTRY_EMPTY');
  const cssDiagnostics = cssFiles.map(item => {
    const file = outputFile(item.fileName);
    const css = fs.readFileSync(file.full, 'utf8');
    return {
      fileName: item.fileName, bytes: file.bytes,
      // Diagnostics, not a CSS parser or rendered UI correctness assertion.
      directiveResidueCandidates: (css.match(/@(tailwind|apply|source|config|plugin|utility|theme)\b/g) || []).length,
      hasRootOrHtmlSelector: /(?::root|(?:^|[},])\s*html)(?:\s|[,{:.#[])/.test(css),
      hasClassSelectorCandidate: /\.[A-Za-z_-][A-Za-z0-9_-]*[\s,:.{#[]/.test(css),
      hasFlexDeclaration: /display\s*:\s*(?:inline-)?flex\b/.test(css),
      hasGridDeclaration: /display\s*:\s*(?:inline-)?grid\b/.test(css),
    };
  });
  ensure(cssDiagnostics.some(item => item.bytes > 0), 'CSS_OUTPUT_EMPTY');
  phase = 'SAVE_BUILD_EVIDENCE';
  writeEvidence('frontend-graph.json', graph);
  writeEvidence('frontend-build-evidence.json', {
    project: 'MyMentalHealthBuddy', status: 'FRONTEND_COMPILED_CANDIDATE_NOT_RELEASE',
    compilerInvocations: 1, resolvedConfig: resolvedEvidence, emitted,
    graphFile: 'frontend-graph.json', moduleCount: graph.modules.length,
    watchFileCount: graph.watchFiles.length, watchFilesSupported: graph.watchFilesSupported,
    cssDiagnostics,
    limitations: [
      'One current-machine build; not repeatability or clean-lockfile-install proof',
      'Module and watch graph does not prove every build-tool or dynamic filesystem read',
      'Production environment files disabled; deployment environment parity remains unqualified',
      'CSS diagnostics are lexical observations; browser layout and accessibility remain unqualified',
      'No application startup, server integration, browser, native ABI, database or deployment qualification',
      'Output and cache redirected; no operating-system filesystem or network isolation claim',
    ],
  });
  console.log('FRONTEND_RUNNER_STATUS=COMPILED_CANDIDATE_NOT_RELEASE');
} catch (error) {
  const code = typeof error?.code === 'string' && /^[A-Z0-9_]{1,100}$/.test(error.code)
    ? error.code : 'FRONTEND_BUILD_DRIVER_FAILURE';
  if (ready) {
    try {
      writeEvidence('frontend-runner-error.json', {
        project: 'MyMentalHealthBuddy', status: 'FRONTEND_RUNNER_FAILED', phase, code,
        id: typeof error?.id === 'string' ? error.id.slice(0,8192) : undefined,
        loc: error?.loc ? { line: error.loc.line, column: error.loc.column } : undefined,
        // Private report only. The parent must not echo this file without redaction.
        privateMessage: String(error?.message || error).slice(0, 32768),
        privateStack: String(error?.stack || '').slice(0, 65536),
      });
    } catch { /* Fixed console result still identifies failure if evidence write fails. */ }
  }
  console.log(`FRONTEND_RUNNER_STATUS=FAILED PHASE=${phase} CODE=${code}`);
  process.exitCode = 1;
}
