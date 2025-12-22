{
  "name": "the-genuine-love-project",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "npm run start",
    "start": "node server/index.mjs",
    "build": "npm --prefix client install && npm --prefix client run build",
    "scan:colors": "node scripts/remove-legacy-colors.mjs",
    "brand:rename": "node scripts/brand-rename.mjs"
  }
}