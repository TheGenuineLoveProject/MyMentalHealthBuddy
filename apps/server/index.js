const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const { z } = require('zod');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

// ---------- middleware ----------
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '256kb' }));
app.use(morgan('tiny'));

// ---------- health ----------
app.get('/health', (_req, res) => res.json({ ok: true, service: 'server', port: PORT, ts: Date.now() }));

// ---------- example API (validated echo) ----------
const BodySchema = z.object({ message: z.string().min(1).max(500) });
app.post('/api/echo', (req, res, next) => {
  const parse = BodySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ ok:false, errors: parse.error.issues });
  res.json({ ok: true, echo: parse.data.message });
});

// ---------- static production (optional) ----------
app.use('/assets', express.static('public', { immutable:true, maxAge: '1y' }));

// ---------- 404 ----------
app.use((_req, res) => res.status(404).json({ ok:false, error:'Not Found' }));

// ---------- error handler ----------
app.use((err, _req, res, _next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ ok:false, error:'Internal Server Error' });
});

app.listen(PORT, () => console.log('✅ Server listening on', PORT));
