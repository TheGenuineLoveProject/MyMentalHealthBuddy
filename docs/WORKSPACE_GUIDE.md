# Workspace Development Guide

Quick reference for working with the MyMentalHealthBuddy monorepo workspaces.

---

## 🎯 Quick Commands

### Start Development

```bash
# Full-stack development
npm run dev

# Frontend only (port 5000)
npm run start:client

# Backend only (port 3001)
npm run start:server
```

### Build for Production

```bash
# Build everything
npm run build

# Build client only
npm run build -w apps/client

# Build server only
npm run build -w apps/server
```

### Install Dependencies

```bash
# Install to client workspace
npm install <package> -w apps/client

# Install to server workspace
npm install <package> -w apps/server

# Install dev dependency to server
npm install -D <package> -w apps/server
```

---

## 📁 Workspace Locations

```bash
apps/client/     # Frontend React application
apps/server/     # Backend Express API
apps/shared/     # Shared types and schemas
```

---

## 🔧 Common Tasks

### Adding a New Client Component

```bash
# Create component file
touch apps/client/src/components/MyComponent.tsx

# Component will automatically be available for import
```

### Adding a New API Route

1. Add route handler in `apps/server/src/routes.ts`
2. Import shared types from `../shared/schema.js`
3. Server will auto-reload with changes

### Adding Shared Types

1. Edit `apps/shared/schema.ts`
2. Export new interface or Zod schema
3. Import in client or server as needed

### Fixing Port Conflicts

```bash
# Clean up stuck ports
npm run fixports
```

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean build
rm -rf apps/client/dist apps/server/dist
npm run build
```

### Dependency Issues

```bash
# Reinstall all dependencies
rm -rf node_modules apps/*/node_modules
npm install
```

### TypeScript Errors

- Ensure you're using `.js` extension in imports
- Check relative paths from monorepo root
- Verify imported file exports correctly

---

## 📚 More Information

See [MONOREPO.md](../MONOREPO.md) for complete documentation.
