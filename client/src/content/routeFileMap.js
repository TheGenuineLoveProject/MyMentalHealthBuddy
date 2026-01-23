/**
 * Deterministic route → generated file mapping helpers.
 * These rules MUST match the generator output exactly.
 * 
 * Rules:
 * 1) "/" -> "index.jsx"
 * 2) "/404" -> "404.jsx"
 * 3) "/*" and any Not Found config -> "not-found.jsx" (canonical)
 * 4) Dynamic patterns:
 *    - "/blog/:slug" -> "blog-[param].jsx"
 *    - "/community/discussion/:id" -> "community-discussion-[param].jsx"
 * 5) All other routes:
 *    - strip leading "/"
 *    - replace "/" with "-"
 *    - keep existing kebab-case
 *    - append ".jsx"
 */

const GENERATED_DIR = 'client/src/pages/generated/';

/**
 * Convert a route path to a generated file name.
 * @param {string} route - The route path (e.g., "/account/profile")
 * @returns {string} - The generated file name (e.g., "account-profile.jsx")
 */
export function routeToGeneratedFile(route) {
  if (!route || typeof route !== 'string') {
    throw new Error(`Invalid route: ${route}`);
  }
  
  if (route === '/') {
    return 'index.jsx';
  }
  
  if (route === '/404') {
    return '404.jsx';
  }
  
  if (route === '/*' || route.toLowerCase().includes('not-found') || route === '/not-found') {
    return 'not-found.jsx';
  }
  
  let name = route.slice(1);
  
  const dynamicParamMatch = name.match(/:[a-zA-Z_][a-zA-Z0-9_]*/);
  if (dynamicParamMatch) {
    name = name.replace(/:[a-zA-Z_][a-zA-Z0-9_]*/, '[param]');
  }
  
  name = name.replace(/\//g, '-');
  
  return `${name}.jsx`;
}

/**
 * Convert a route path to a generated file path (absolute from project root).
 * @param {string} route - The route path (e.g., "/account/profile")
 * @returns {string} - The full path (e.g., "client/src/pages/generated/account-profile.jsx")
 */
export function routeToGeneratedFileAbs(route) {
  return GENERATED_DIR + routeToGeneratedFile(route);
}

/**
 * Check if the generated file for a route exists.
 * @param {string} route - The route path
 * @param {object} fs - Node.js fs module (for optional server-side use)
 * @returns {boolean} - True if the file exists
 */
export function routeToGeneratedFileExists(route, fs) {
  if (!fs || typeof fs.existsSync !== 'function') {
    throw new Error('fs module required for file existence check');
  }
  const filePath = routeToGeneratedFileAbs(route);
  return fs.existsSync(filePath);
}

/**
 * Self-check examples for validation.
 * Run with: node -e "import('./routeFileMap.js').then(m => m.runSelfCheck())"
 */
export function runSelfCheck() {
  const testCases = [
    { route: '/', expected: 'index.jsx' },
    { route: '/404', expected: '404.jsx' },
    { route: '/*', expected: 'not-found.jsx' },
    { route: '/blog/:slug', expected: 'blog-[param].jsx' },
    { route: '/community/discussion/:id', expected: 'community-discussion-[param].jsx' },
    { route: '/account/profile', expected: 'account-profile.jsx' },
    { route: '/growth-analytics', expected: 'growth-analytics.jsx' },
    { route: '/healing-library', expected: 'healing-library.jsx' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  console.log('\n🔍 routeFileMap self-check:');
  console.log('─'.repeat(60));
  
  for (const { route, expected } of testCases) {
    const actual = routeToGeneratedFile(route);
    const ok = actual === expected;
    const icon = ok ? '✓' : '✗';
    console.log(`  ${icon} "${route}" -> "${actual}"${ok ? '' : ` (expected: "${expected}")`}`);
    if (ok) passed++;
    else failed++;
  }
  
  console.log('─'.repeat(60));
  console.log(`  ${passed}/${testCases.length} passed${failed > 0 ? `, ${failed} failed` : ''}\n`);
  
  return failed === 0;
}

export default {
  routeToGeneratedFile,
  routeToGeneratedFileAbs,
  routeToGeneratedFileExists,
  runSelfCheck,
  GENERATED_DIR,
};
