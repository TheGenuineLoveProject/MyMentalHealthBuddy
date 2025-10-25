import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { log } from './lib/logger.js';
import mountHealth from './routes/health.js';
import mountAI from './routes/ai.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: '*', credentials: false }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(responseTime());

// API
const api = express.Router();
mountHealth(api);
mountAI(api);
app.use('/api', api);

// Serve built client
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.resolve(__dirname, '../client/dist');

app.use(express.static(CLIENT_DIST));
app.use((_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  log('ok', `server started on :${PORT}`, { frontend: CLIENT_DIST });
});