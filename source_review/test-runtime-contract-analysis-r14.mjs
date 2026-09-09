import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { r14RegistrySummary, r14PackageSummary } from './runtime-contract-analysis-r14.mjs';

let count = 0;
function test(name, fn) { fn(); count++; process.stdout.write(`PASS ${name}\n`); }
const clone = value => structuredClone(value);
const registry = {
  engine: 'healing', version: '1.0.0', allowed_audiences: ['anonymous', 'subscriber'],
  prompts: [{ id: 'h01_intake', risk: 'low' }, { id: 'h02_journal_reflect', risk: 'medium' }],
};
const paths = ['ai/healing/system.md', ...registry.prompts.map(p => `ai/healing/prompts/${p.id}.md`)];
const assets = Object.fromEntries(paths.map(path => [path, { state: 'FILE', bytes: 100 }]));
const summary = (value = registry, listed = paths, available = assets) =>
  r14RegistrySummary('healing', JSON.stringify(value), listed, available);
const has = (value, code) => value.issues.some(issue => issue.code === code);

test('valid registry and approved assets', () => {
  const value = summary(); assert.equal(value.valid, true); assert.equal(value.promptCount, 2);
  assert.equal(value.requiredAssets.length, 3); assert.deepEqual(value.riskCounts, { low: 1, medium: 1, high: 0 });
});
test('current reviewed healing and business registry shapes', () => {
  for (const engine of ['healing', 'business']) {
    const text = readFileSync(new URL(`./r14-assets-ai-${engine}-registry.json`, import.meta.url), 'utf8');
    const current = JSON.parse(text);
    const allowed = [`ai/${engine}/system.md`, ...current.prompts.map(p => `ai/${engine}/prompts/${p.id}.md`)];
    const metadata = Object.fromEntries(allowed.map(path => [path, { state: 'FILE', bytes: 10 }]));
    assert.equal(r14RegistrySummary(engine, text, allowed, metadata).valid, true);
  }
});
test('malformed JSON never emits raw input', () => {
  const value = r14RegistrySummary('healing', '{"secret":"TOKEN_SENTINEL"', paths, assets);
  assert(has(value, 'REGISTRY_INVALID_JSON')); assert(!JSON.stringify(value).includes('TOKEN_SENTINEL'));
});
test('nonobject registry rejected', () => assert(has(summary([]), 'REGISTRY_INVALID_OBJECT')));
test('null registry absent', () => assert(has(summary(null), 'REGISTRY_INVALID_OBJECT')));
test('oversized registry bounded', () => assert(has(r14RegistrySummary('healing', 'x'.repeat(1_048_577), paths, assets), 'REGISTRY_SIZE_LIMIT')));
test('engine mismatch', () => assert(has(summary({ ...registry, engine: 'business' }), 'ENGINE_MISMATCH')));
test('invalid caller engine redacted', () => {
  const value = r14RegistrySummary('TOKEN_SENTINEL', '{}', paths, assets);
  assert.equal(value.engine, null); assert(!JSON.stringify(value).includes('TOKEN_SENTINEL'));
});
test('traversal prompt ID rejected and redacted', () => {
  const value = clone(registry); value.prompts[0].id = '../../TOKEN_SENTINEL';
  const result = summary(value); assert(has(result, 'PROMPT_ID_INVALID')); assert(!JSON.stringify(result).includes('TOKEN_SENTINEL'));
});
test('syntactically valid unlisted ID rejected and redacted', () => {
  const value = clone(registry); value.prompts[0].id = 'h99_token_sentinel';
  const result = summary(value); assert(has(result, 'PROMPT_ASSET_NOT_APPROVED')); assert(!JSON.stringify(result).includes('h99_token_sentinel'));
});
test('duplicate ID is not silently collapsed', () => {
  const value = clone(registry); value.prompts[1].id = value.prompts[0].id;
  assert(has(summary(value), 'PROMPT_ID_DUPLICATE'));
});
test('engine prefix checked before approval', () => {
  const value = clone(registry); value.prompts[0].id = 'b01_intake';
  assert(has(summary(value), 'PROMPT_ENGINE_MISMATCH'));
});
test('missing approved prompt asset reported', () => {
  const value = clone(assets); delete value[paths[1]];
  assert(has(summary(registry, paths, value), 'PROMPT_ASSET_MISSING_OR_EMPTY'));
});
test('empty prompt asset reported', () => {
  const value = clone(assets); value[paths[1]].bytes = 0;
  assert(has(summary(registry, paths, value), 'PROMPT_ASSET_MISSING_OR_EMPTY'));
});
test('symlink metadata is not considered an available file', () => {
  const value = clone(assets); value[paths[1]].state = 'SYMLINK';
  assert(has(summary(registry, paths, value), 'PROMPT_ASSET_MISSING_OR_EMPTY'));
});
test('missing system asset reported', () => {
  const value = clone(assets); delete value[paths[0]];
  assert(has(summary(registry, paths, value), 'SYSTEM_ASSET_MISSING_OR_EMPTY'));
});
test('system path must be caller approved', () => assert(has(summary(registry, paths.slice(1)), 'SYSTEM_ASSET_NOT_APPROVED')));
test('malformed approved path cannot enable traversal', () => {
  const value = clone(registry); value.prompts[0].id = '../secret';
  assert(has(summary(value, [...paths, 'ai/healing/prompts/../secret.md']), 'PROMPT_ID_INVALID'));
});
test('registry version redacts unknown suffix', () => {
  const value = summary({ ...registry, version: '1.0.0-TOKEN_SENTINEL' });
  assert.equal(value.version, null); assert(has(value, 'VERSION_UNRECOGNIZED')); assert(!JSON.stringify(value).includes('TOKEN_SENTINEL'));
});
test('audience duplicates invalid', () => assert(has(summary({ ...registry, allowed_audiences: ['admin', 'admin'] }), 'AUDIENCE_DUPLICATE')));
test('unknown audience redacted', () => {
  const value = summary({ ...registry, allowed_audiences: ['TOKEN_SENTINEL'] });
  assert(has(value, 'AUDIENCE_UNRECOGNIZED')); assert(!JSON.stringify(value).includes('TOKEN_SENTINEL'));
});
test('missing audience array invalid', () => assert(has(summary({ ...registry, allowed_audiences: null }), 'AUDIENCES_INVALID')));
test('prompt count over bound returns no prompt data', () => {
  const value = summary({ ...registry, prompts: Array(101).fill(registry.prompts[0]) });
  assert(has(value, 'PROMPT_COUNT_OUT_OF_BOUNDS')); assert.equal(value.approvedPromptCount, 0);
});
test('invalid risk redacted', () => {
  const value = clone(registry); value.prompts[0].risk = 'TOKEN_SENTINEL';
  const result = summary(value); assert(has(result, 'RISK_UNRECOGNIZED')); assert(!JSON.stringify(result).includes('TOKEN_SENTINEL'));
});

const packageName = '@vitejs/plugin-react';
const installed = { name: packageName, version: '6.1.1', dependencies: { alpha: '^1.0.0', beta: '^2.0.0' } };
const locked = { version: '6.1.0', dependencies: { beta: '^2.0.0', alpha: '^1.0.0' },
  resolved: 'https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-6.1.0.tgz', integrity: `sha512-${'A'.repeat(86)}==` };
test('version mismatch preserved independently of matching dependency maps', () => {
  const value = r14PackageSummary(packageName, installed, locked, null);
  assert.equal(value.comparisons.installedToLock.versionMatch, false);
  assert.equal(value.comparisons.installedToLock.dependencyMapsMatch.dependencies, true);
  assert.equal(value.hiddenLocked.state, 'ABSENT');
});
test('dependency value changes detected without emitting values', () => {
  const value = r14PackageSummary(packageName, installed, { ...locked, dependencies: { alpha: 'https://TOKEN_SENTINEL', beta: '^2.0.0' } }, null);
  assert.equal(value.comparisons.installedToLock.dependencyMapsMatch.dependencies, false);
  assert(!JSON.stringify(value).includes('TOKEN_SENTINEL'));
});
test('matching hidden lock recognized', () => {
  const value = r14PackageSummary(packageName, installed, locked, { ...locked, version: '6.1.1' });
  assert.equal(value.comparisons.installedToHiddenLock.versionMatch, true);
  assert.equal(value.comparisons.hiddenLockToLock.versionMatch, false);
});
test('official registry and sha512 metadata only', () => {
  const value = r14PackageSummary(packageName, installed, locked, null);
  assert.equal(value.locked.resolved.officialNpmRegistry, true); assert.equal(value.locked.integrity.sha512Format, true);
  assert(!JSON.stringify(value).includes('plugin-react-6.1.0.tgz')); assert(!JSON.stringify(value).includes('sha512-AAA'));
});
test('credentialed registry URL never output or considered official', () => {
  const value = r14PackageSummary(packageName, null, { ...locked, resolved: 'https://TOKEN_SENTINEL:password@registry.npmjs.org/a.tgz' }, null);
  assert.equal(value.locked.resolved.officialNpmRegistry, false); assert(!JSON.stringify(value).includes('TOKEN_SENTINEL'));
});
test('registry query and lookalike hostname rejected', () => {
  for (const resolved of ['https://registry.npmjs.org/a.tgz?token=TOKEN_SENTINEL', 'https://registry.npmjs.org.attacker.test/a.tgz', 'http://registry.npmjs.org/a.tgz']) {
    assert.equal(r14PackageSummary(packageName, null, { ...locked, resolved }, null).locked.resolved.officialNpmRegistry, false);
  }
});
test('unsafe package version omitted', () => {
  const value = r14PackageSummary(packageName, { ...installed, version: '6.1.1-TOKEN_SENTINEL' }, locked, null);
  assert.equal(value.installed.version, null); assert.equal(value.comparisons.installedToLock.versionMatch, null);
  assert(!JSON.stringify(value).includes('TOKEN_SENTINEL'));
});
test('script commands and unknown script names omitted', () => {
  const value = r14PackageSummary(packageName, { ...installed, scripts: { install: 'send TOKEN_SENTINEL', TOKEN_SENTINEL: 'command' } }, locked, null);
  assert.deepEqual(value.installed.scripts.lifecycleNames, ['install']); assert.equal(value.installed.scripts.otherCount, 1);
  assert(!JSON.stringify(value).includes('TOKEN_SENTINEL'));
});
test('bin path and names omitted', () => {
  const value = r14PackageSummary(packageName, { ...installed, bin: { TOKEN_SENTINEL: '../../SECRET_SENTINEL' } }, locked, null);
  assert.equal(value.installed.bin.count, 1); assert(!JSON.stringify(value).includes('SENTINEL'));
});
test('malformed package and invalid dependency map comparison stays unknown', () => {
  const a = r14PackageSummary(packageName, '{"TOKEN_SENTINEL"', locked, null);
  assert.equal(a.installed.state, 'INVALID_JSON'); assert.equal(a.comparisons.installedToLock.versionMatch, null);
  const b = r14PackageSummary(packageName, { ...installed, dependencies: ['wrong'] }, locked, null);
  assert.equal(b.comparisons.installedToLock.dependencyMapsMatch.dependencies, null);
});
test('null package is absent without invented metadata', () => assert.equal(r14PackageSummary(packageName, null, null, null).installed.state, 'ABSENT'));
test('semver prerelease is narrowly accepted', () => assert.equal(r14PackageSummary(packageName, { ...installed, version: '6.1.1-rc.2' }, null, null).installed.version, '6.1.1-rc.2'));
test('helper has no imports or IO', () => {
  const source = readFileSync(new URL('./runtime-contract-analysis-r14.mjs', import.meta.url), 'utf8');
  assert(!/^\s*import\s/m.test(source)); assert(!/\b(?:readFile|writeFile|exec|spawn|fetch|require)\s*\(/.test(source));
});
process.stdout.write(`FIXTURES=${count} RESULT=PASS\n`);
