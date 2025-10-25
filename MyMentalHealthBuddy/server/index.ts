import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'server', ts: new Date().toISOString() });
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(JSON.stringify({ msg: 'server_started', port: PORT }));
});