import fs from 'fs';

const dirs = [
  'server',
  'server/routes',
  'server/middleware',
  'server/services',
  'client',
  'client/src',
  'client/src/components',
  'client/src/pages',
  'database',
  'scripts',
  'shared',
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d);
});

console.log("✨ Platform folders created perfectly.");