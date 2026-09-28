node --input-type=module <<'MMHB_PAGES'
import fs from 'node:fs';
const say = value => console.log(JSON.stringify(value));
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (pkg.name !== 'mymentalhealthbuddy') throw Error('WRONG_PROJECT');
  say({check:'START', at:new Date().toISOString(), node:process.version});
  say({check:'WORKSPACE_CONFIG', present:Object.fromEntries(
    ['SESSION_SECRET', 'DATABASE_URL', 'REPL_ID'].map(key => [key, Boolean(process.env[key])]))});
  for (const file of ['client/dist/index.html', 'server/client/dist/index.html',
    'dist/client/dist/index.html', 'dist/server.mjs']) {
    const exists = fs.existsSync(file);
    say({check:'FILE', file, exists,
      bytes:exists ? fs.statSync(file).size : null});
  }
  for (const origin of ['http://127.0.0.1:5000',
    'https://mymentalhealthbuddy.com', 'https://www.mymentalhealthbuddy.com']) {
    for (const route of ['/health', '/']) {
      const url = origin + route;
      try {
        const response = await fetch(url, {redirect:'manual',
          headers:{Accept:route === '/health' ? 'application/json' : 'text/html'},
          signal:AbortSignal.timeout(8000)});
        const reader = response.body?.getReader();
        const chunks = []; let size = 0;
        if (reader) {
          while (size < 262144) {
            const {done, value} = await reader.read();
            if (done) break;
            const chunk = value.subarray(0, 262144 - size);
            chunks.push(Buffer.from(chunk)); size += chunk.length;
          }
          await reader.cancel();
        }
        const body = Buffer.concat(chunks).toString('utf8');
        const location = response.headers.get('location');
        const next = location ? new URL(location, url) : null;
        say({check:'HTTP', url, status:response.status,
          type:response.headers.get('content-type'),
          redirect:next ? next.origin + next.pathname : null,
          requestId:response.headers.get('x-request-id'),
          internalServerError:/internal\s+server\s+error/i.test(body),
          reactRoot:/id\s*=\s*["']root["']/i.test(body),
          builtAsset:/\/assets\/[^\s"'<>]+\.js\b/.test(body)});
      } catch (error) {
        say({check:'HTTP', url, error:error.cause?.code || error.name});
      }
    }
  }
  say({check:'DONE', at:new Date().toISOString(), sourceFilesChanged:0});
} catch (error) {
  say({check:'STOP', reason:error.message}); process.exitCode = 1;
}
MMHB_PAGES
