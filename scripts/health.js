import http from 'node:http';
http.get('http://localhost:5000/health', r => {
  let d=''; r.on('data', c => d+=c); r.on('end', () => console.log(d));
}).on('error', e => { console.error('Health failed:', e.message); process.exit(1); });
