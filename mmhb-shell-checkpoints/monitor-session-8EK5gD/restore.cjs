const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const target = "client/src/components/admin/OperationsPanel.jsx";
const before = "3ed8e0b95d943f33b70c1c549b206317562250d8f87cb95a03f7d8fd43aba5e4", after = "b95bd4722d8bea0821b409f8b5a640458a1a614890bd08f44717dd12e0314778";
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
try {
  let current = root;
  for (const part of target.split('/')) { current = path.join(current, part); if (fs.lstatSync(current).isSymbolicLink()) throw Error('Symlink refused'); }
  const live = fs.readFileSync(current);
  if (hash(live) === before) { console.log('MMHB_MONITOR_SESSIONS_ALREADY_RESTORED'); process.exit(0); }
  if (hash(live) !== after) throw Error('File changed after repair; restore refused');
  const original = fs.readFileSync(path.join(__dirname, 'OperationsPanel.before.jsx'));
  if (hash(original) !== before) throw Error('Backup verification failed');
  const temporary = path.join(__dirname, 'restore-' + crypto.randomUUID() + '.jsx');
  fs.writeFileSync(temporary, original, { flag: 'wx', mode: 420 });
  if (hash(fs.readFileSync(current)) !== after) throw Error('File changed during restore');
  fs.renameSync(temporary, current);
  console.log(hash(fs.readFileSync(current)) === before ? 'MMHB_MONITOR_SESSIONS_RESTORED' : 'STOP: Restore verification failed');
} catch { console.error('STOP: Restore refused or failed; keep the checkpoint and send this output to ChatGPT.'); process.exitCode = 1; }