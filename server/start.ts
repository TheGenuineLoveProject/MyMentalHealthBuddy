import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import path from 'node:path'
import fs from 'node:fs'

const app = express()
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Serve built client if it exists (so "Run" can be one process)
const distDir = path.resolve(process.cwd(), 'client', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  // SPA fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const port = Number(process.env.PORT || 5000)
app.listen(port, () => console.log(`✅ API running on http://localhost:${port}`))