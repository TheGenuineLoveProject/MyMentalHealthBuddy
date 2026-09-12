import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [root, report] = process.argv.slice(2);
if (process.cwd() !== root || path.dirname(report) !== root) throw Error('BUILD_CONTEXT');
const req = createRequire(path.join(root, 'package.json'));
const dependency = name => import(pathToFileURL(req.resolve(name)).href);
const { build } = await dependency('vite');
const { default: config } = await import(pathToFileURL(path.join(root, 'vite.config.js')).href);
const { default: tailwind } = await dependency('@tailwindcss/postcss');
const { default: autoprefixer } = await dependency('autoprefixer');
if (path.resolve(config.root) !== path.join(root, 'client') ||
    config.plugins.length !== 2 || config.plugins[1]?.name !== 'visualizer') throw Error('CONFIG_SHAPE_CHANGED');
const outDir = path.join(report, 'dist');
await build({
  ...config, configFile: false, envFile: false, envDir: false, mode: 'production',
  cacheDir: path.join(report, 'cache'), clearScreen: false,
  plugins: [config.plugins[0]],
  css: { ...config.css, postcss: { plugins: [tailwind({}), autoprefixer({})] } },
  build: { ...config.build, outDir, emptyOutDir: false },
});
fs.writeFileSync(path.join(report, 'build-complete.json'), JSON.stringify({
  status: 'FRONTEND_CANDIDATE_BUILT', outDir, environmentFilesLoaded: false,
  serverBuild: false, packageInstall: false,
}) + '\n', { flag: 'wx', mode: 0o600 });
