import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import fs from 'node:fs'
import { session } from './lib/session'
import { auth } from './routes/auth'

const app = express()
app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(session)

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'MyMentalHealthBuddy', ts: Date.now() }))

app.use('/api/auth', auth)

// Serve built client if present
const dist = path.resolve(process.cwd(), 'client', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(dist, 'index.html'))
  })
}

const port = Number(process.env.PORT || 5000)
app.listen(port, () => console.log(`✅ API running http://localhost:${port}`))
