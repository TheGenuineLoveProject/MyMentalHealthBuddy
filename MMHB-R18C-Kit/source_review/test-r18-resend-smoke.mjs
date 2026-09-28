import fs from 'node:fs';
import assert from 'node:assert/strict';
import { runResendSmoke } from './r18-resend-smoke.mjs';
const source = fs.readFileSync(new URL('./r18-resend-6.22.1-index.cjs', import.meta.url), 'utf8');
await assert.rejects(runResendSmoke(source + '\n'), { code: 'RESEND_CJS_REVIEWED_BYTES_REQUIRED' });
await assert.rejects(runResendSmoke(source.replace('6.22.1', '6.22.2')), { code: 'RESEND_CJS_REVIEWED_BYTES_REQUIRED' });
await assert.rejects(runResendSmoke(null), { code: 'RESEND_CJS_REVIEWED_BYTES_REQUIRED' });
if (process.argv.includes('--without-vm-flag')) {
  await assert.rejects(runResendSmoke(source), { code: 'RESEND_VM_MODULES_FLAG_REQUIRED' });
  console.log(JSON.stringify({status:'PASS',mode:'vm_flag_refusal',checks:4}));
} else {
  const result = await runResendSmoke(source);
  assert.equal(result.caseCount, 20);
  assert.equal(result.dynamicImportRequests, 5);
  assert.equal(result.forbiddenFetchAttempts, 0);
  assert.equal(result.dependencyUseAttempts, 0);
  assert.equal(result.cases.filter(c => c.syntheticTransportCalls === 1).length, 15);
  assert.equal(result.cases.filter(c => c.missingRendererBlocksTransport === true).length, 5);
  console.log(JSON.stringify({status:'PASS',negativeHashAndTypeChecks:3,...result},null,2));
}
