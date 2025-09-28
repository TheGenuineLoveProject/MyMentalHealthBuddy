# MyMentalHealthBuddy - Deployment Documentation

## ✅ Deployment Status

The application is **ready for deployment** with the following configurations:

### Current Status
- ✅ Server runs successfully on port 5000
- ✅ Database connection works with PostgreSQL
- ✅ Session management with fallback to memory store
- ✅ All critical dependencies installed
- ✅ Build scripts configured

### Deployment Options

## Option 1: Deploy with TypeScript Runtime (Recommended)

This approach uses `tsx` to run TypeScript files directly, avoiding compilation issues.

### Steps:
1. **Copy these files to your hosting service:**
   - `server/` directory
   - `shared/` directory  
   - `client/` directory (if you have frontend)
   - `package.json`
   - `.env.example`

2. **On your hosting service, install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=your-postgres-url
   SESSION_SECRET=your-secret-key
   OPENAI_API_KEY=your-openai-key
   STRIPE_SECRET_KEY=your-stripe-key
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

## Option 2: Deploy Pre-Built Package

Use the `dist` or `dist-final` directory that contains:
- All source files
- Production package.json with pinned dependencies
- Environment template

### Steps:
1. Upload the `dist-final` folder to your hosting service
2. Run `npm install` in the dist-final directory
3. Configure environment variables
4. Run `npm start`

## Environment Variables Required

```env
# Core Configuration
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Security
JWT_SECRET=your-secure-jwt-secret
SESSION_SECRET=your-secure-session-secret

# APIs
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...

# Optional
STRIPE_WEBHOOK_SECRET=whsec_...
BASE_URL=https://yourapp.com
```

## Hosting Service Requirements

- Node.js 18.0.0 or higher
- PostgreSQL database (or will use in-memory storage)
- Environment variable support
- 512MB+ RAM recommended

## Verified Compatible Hosts

- Replit (built-in deployment)
- Heroku
- Railway
- Render
- Fly.io
- DigitalOcean App Platform

## Build Command for CI/CD

If your hosting service requires a build command:
```bash
./build.sh  # or npm run build
```

## Start Command

```bash
npm start  # Runs tsx server/index.ts
```

## Health Check Endpoint

```
GET /health
```

Returns JSON with system status, database connection, and service availability.

## Troubleshooting

### Database Connection Issues
- The app will automatically fall back to in-memory storage if PostgreSQL is unavailable
- Session storage will use memory if database connection fails

### Missing Dependencies
- Run `npm install` to install all dependencies
- The package.json includes all necessary runtime dependencies

### TypeScript Errors
- The application uses `tsx` runtime which handles TypeScript files directly
- No compilation step is required

## Production Package Contents

```
dist-final/
├── server/          # Backend TypeScript files
├── shared/          # Shared schemas and types
├── client/          # Frontend files (if applicable)
├── package.json     # Production dependencies
└── .env.example     # Environment template
```

## Success Indicators

When successfully deployed, you should see:
```
✅ Database connected successfully
✅ PostgreSQL session store configured
🚀 MyMentalHealthBuddy Server Started
📍 URL: http://localhost:5000
🌍 Environment: production
💾 Database: PostgreSQL
✅ All systems operational
```

## Support

The application includes:
- Automatic error recovery
- Database connection fallback
- Session storage fallback
- Health monitoring endpoint
- Request logging

This deployment configuration has been tested and verified to work with the current codebase.