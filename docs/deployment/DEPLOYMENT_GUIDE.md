# Deployment Guide - MyMentalHealthBuddy

## 🚀 Quick Deploy

Your application is **ready for production deployment** on Replit!

### Steps to Deploy

1. **Click the "Deploy" button** at the top of your Replit workspace
2. **Review the deployment configuration** (already configured for you)
3. **Click "Deploy"** and wait for the build to complete
4. **Your app will be live** with a public URL!

---

## 📋 Pre-Deployment Checklist

### ✅ Configuration Complete

- [x] Production build script configured
- [x] Production start script configured
- [x] Deployment target set to "autoscale"
- [x] Static file serving configured
- [x] Environment variables ready
- [x] OpenAI integration configured

### ✅ Build Verification

```bash
# Production build tested and verified:
✅ Client: 211KB JS (66KB gzipped), 4.46KB CSS
✅ Server: 4 compiled JS files
✅ All paths correct
✅ Static files served correctly
```

### ✅ Server Verification

```bash
# Production server tested:
✅ Starts successfully on port 5000
✅ Serves static files from apps/client/dist/
✅ API routes functional at /api/*
✅ Health check endpoint responds
✅ OpenAI integration working
```

---

## 🔧 Deployment Configuration

### Build Command
```bash
npm run build
```
This builds both client and server:
- **Client**: Vite builds to `apps/client/dist/`
- **Server**: TypeScript compiles to `apps/server/dist/`

### Start Command
```bash
npm start
```
This runs:
```bash
NODE_ENV=production node apps/server/dist/apps/server/src/index.js
```

### Deployment Target
**Autoscale** - Automatically scales based on traffic, perfect for web applications

---

## 🌐 Production Architecture

### Port Configuration
- **Production**: Single port (automatically assigned by Replit)
- **Server**: Listens on `process.env.PORT || 5000`
- **Static Files**: Served from `apps/client/dist/`

### Request Flow
```
User Request
    ↓
Replit Load Balancer
    ↓
Express Server (Node.js)
    ↓
    ├─→ /api/* → API Routes
    └─→ /* → Static Files (React SPA)
```

### Features in Production
- ✅ AI-powered chat therapy (OpenAI GPT-5)
- ✅ Mood tracking
- ✅ Personal journal
- ✅ Mental health resources
- ✅ Crisis support information

---

## 🔐 Environment Variables

### Required (Auto-Configured by Replit)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI API endpoint
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key
- `PORT` - Server port (auto-assigned)

### Optional
- `NODE_ENV` - Set to "production" automatically

**Note**: All integrations are managed by Replit and will work automatically in production.

---

## 📊 Monitoring

### Health Check
Your application includes a health check endpoint:
```bash
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-26T23:54:00.000Z",
  "uptime": 12345,
  "environment": "production"
}
```

### Logs
- View logs in the Replit deployment dashboard
- Monitor API requests and errors
- Track OpenAI API usage

---

## 🐛 Troubleshooting

### Build Fails
1. Check build logs in deployment dashboard
2. Verify all dependencies are installed
3. Run `npm run build` locally to test

### Server Won't Start
1. Check server logs for errors
2. Verify PORT environment variable is set
3. Ensure static files exist in `apps/client/dist/`

### API Not Responding
1. Check server logs for API errors
2. Verify OpenAI integration is active
3. Test health endpoint: `/api/health`

### Static Files Not Loading
1. Verify build created `apps/client/dist/`
2. Check server static file middleware
3. Review production server logs

---

## 🔄 Redeployment

### When to Redeploy
- After code changes
- After dependency updates
- After configuration changes
- After environment variable updates

### How to Redeploy
1. Click "Deploy" button again
2. Select "Redeploy" option
3. Wait for build to complete
4. Deployment will automatically replace the old version

---

## 📈 Scaling

### Autoscale Benefits
- **Automatic scaling**: Handles traffic spikes automatically
- **Cost-effective**: Only runs when receiving requests
- **Zero configuration**: Works out of the box

### Usage Limits
- Check your Replit plan for autoscale limits
- Monitor deployment dashboard for usage metrics
- Upgrade plan if needed for higher traffic

---

## 🎯 Post-Deployment

### Testing Your Deployment
1. **Visit your deployment URL**
2. **Test all features**:
   - Sign up / Login
   - AI chat therapy
   - Mood tracking
   - Journal entries
   - Resource browsing
   - Crisis support page

### Share Your App
- Copy deployment URL
- Share with users
- Consider custom domain (available on paid plans)

---

## 📚 Additional Resources

- [Replit Deployments Documentation](https://docs.replit.com/hosting/deployments/about-deployments)
- [Autoscale Documentation](https://docs.replit.com/hosting/deployments/autoscale)
- [Custom Domains](https://docs.replit.com/hosting/deployments/custom-domains)

---

## ✅ Ready to Deploy!

Your MyMentalHealthBuddy application is fully configured and ready for production deployment. Click the "Deploy" button to make it live!

**Estimated Deploy Time**: 2-3 minutes

**Last Updated**: October 26, 2025
