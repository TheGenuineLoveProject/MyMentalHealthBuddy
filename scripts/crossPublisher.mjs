import fetch from 'node-fetch';
export async function ping(url){ const r = await fetch(url); return r.ok; }
if (process.argv[2] === 'selftest'){ ping('https://example.com').then(ok=>console.log('fetch ok?',ok)).catch(console.error); }
