import config from '../brand/brand.config.json' assert { type: 'json' };

console.log(`✅ Enforcing brand: ${config.name}`);
console.log(`Primary color: ${config.palette.primary}`);