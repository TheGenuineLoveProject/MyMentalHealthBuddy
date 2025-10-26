# MyMentalHealthBuddy Monorepo Structure

This document explains the monorepo structure, workspace organization, and development workflow.

---

## 📁 Directory Structure

```
MyMentalHealthBuddy/
├── apps/
│   ├── client/          Frontend React application
│   ├── server/          Backend Express API
│   └── shared/          Shared types and schemas
├── docs/
│   ├── cleanup/         Platform cleanup documentation
│   └── deployment/      Deployment guides and troubleshooting
├── scripts/             Development and automation scripts
├── types/               Global TypeScript type definitions
├── package.json         Root workspace configuration
└── tsconfig.json        Root TypeScript configuration
```

---

## 🏗️ Workspace Organization

This project uses **npm workspaces** to manage the monorepo. Each workspace is a separate package under `apps/`.

### Workspaces

#### 1. **apps/client** - Frontend Application

**Technology Stack:**
- React 18 with TypeScript
- Vite for bundling and dev server
- TanStack Query for server state
- Wouter for routing
- Lucide React for icons

**Key Files:**
- `package.json` - Client dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `src/` - Source code

**Scripts:**
```bash
npm run dev -w apps/client      # Start Vite dev server
npm run build -w apps/client    # Build for production
npm run preview -w apps/client  # Preview production build
```

#### 2. **apps/server** - Backend API

**Technology Stack:**
- Express.js with TypeScript
- OpenAI integration (GPT-5)
- Zod for validation
- In-memory storage (MemStorage)

**Key Files:**
- `package.json` - Server dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - Server entry point
- `src/routes.ts` - API route definitions
- `src/openai.ts` - OpenAI integration
- `storage.ts` - In-memory data storage

**Scripts:**
```bash
npm run dev -w apps/server      # Start server with hot-reload
npm run build -w apps/server    # Compile TypeScript
npm run start -w apps/server    # Run compiled server
```

#### 3. **apps/shared** - Shared Code

**Technology Stack:**
- TypeScript for type definitions
- Zod for runtime validation schemas

**Key Files:**
- `package.json` - Shared dependencies
- `tsconfig.json` - TypeScript configuration
- `schema.ts` - TypeScript interfaces and Zod schemas

**Usage:**
```typescript
// In server or client
import { User, InsertUser } from "../shared/schema.js";
```

---

## 🔧 Development Workflow

### Starting Development

```bash
# Start both client and server concurrently
npm run dev

# Or start individually
npm run start:client    # Frontend only (port 5000)
npm run start:server    # Backend only (port 3001)
```

### Building for Production

```bash
# Build both workspaces
npm run build

# Or build individually
npm run build -w apps/client
npm run build -w apps/server
```

### Running Production Build

```bash
# Start production server (serves both API and static files)
npm start
```

---

## 📦 Dependency Management

### Root Dependencies

The root `package.json` only includes workspace-wide tools:

```json
{
  "devDependencies": {
    "concurrently": "^8.2.2",  // Run multiple scripts
    "kill-port": "^2.0.1",     // Clean up ports
    "typescript": "^5.9.3"      // Shared TypeScript
  }
}
```

### Workspace Dependencies

Each workspace manages its own dependencies:

**Client Dependencies:**
- React ecosystem (react, react-dom)
- Build tools (vite, @vitejs/plugin-react)
- UI libraries (@tanstack/react-query, wouter, lucide-react)

**Server Dependencies:**
- Express and middleware (express, cors, helmet, compression)
- OpenAI SDK (openai)
- Validation (zod)
- Type definitions (@types/*)

**Shared Dependencies:**
- Validation library (zod)
- TypeScript (typescript)

### Installing Dependencies

```bash
# Install to specific workspace
npm install <package> -w apps/client
npm install <package> -w apps/server
npm install <package> -w apps/shared

# Install dev dependency
npm install -D <package> -w apps/server

# Install all workspace dependencies
npm install
```

---

## 🏭 Build Output Structure

### Development Mode

**Client:** Vite dev server on port 5000  
**Server:** Express on port 3001 with hot-reload

### Production Mode

```
apps/
├── client/dist/                 Static frontend files
│   ├── index.html
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
│
└── server/dist/                 Compiled backend
    └── apps/
        ├── server/
        │   ├── src/
        │   │   └── index.js     Entry point
        │   └── storage.js
        └── shared/
            └── schema.js
```

**Why nested structure?**  
TypeScript preserves the monorepo directory structure because the server imports from `../shared/`. This is intentional and correct for maintaining import paths.

---

## 🔄 Workspace Scripts

### Root-Level Scripts

```bash
npm run dev           # Start both client and server
npm run fixports      # Kill stuck ports
npm run build         # Build all workspaces
npm start             # Run production server
npm run db:push       # Push database schema changes
```

### Workspace-Specific Scripts

```bash
# Client
npm run dev -w apps/client
npm run build -w apps/client
npm run preview -w apps/client

# Server
npm run dev -w apps/server
npm run build -w apps/server
npm run start -w apps/server

# Shared
npm run build -w apps/shared
npm run dev -w apps/shared
```

---

## 🎯 TypeScript Configuration

### Root Configuration (`tsconfig.json`)

Base configuration inherited by all workspaces:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "outDir": "dist",
    "rootDir": ".",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["apps", "packages"]
}
```

### Workspace-Specific Configurations

Each workspace extends the root config and adds workspace-specific settings:

**Client:** Adds React-specific types  
**Server:** Includes `src/` and `../shared/` for cross-workspace imports  
**Shared:** Enables declaration files for type exports

---

## 🔗 Import Paths

### Cross-Workspace Imports

**Server importing from shared:**
```typescript
import { User, InsertUser } from "../shared/schema.js";
```

**Important:** Always use `.js` extension in imports (TypeScript ESM requirement).

### Module Resolution

TypeScript resolves modules using Node resolution strategy. All cross-workspace imports use relative paths from the monorepo root.

---

## 🚀 Deployment

### Build Process

1. **Build client:** `npm run build -w apps/client`
   - Vite bundles React app → `apps/client/dist/`
   
2. **Build server:** `npm run build -w apps/server`
   - TypeScript compiles → `apps/server/dist/apps/server/src/`

3. **Start production:** `npm start`
   - Express server serves API routes at `/api/*`
   - Serves static client files at all other routes

### Deployment Configuration

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["sh", "-c", "npm run build"]
run = ["sh", "-c", "npm start"]
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests (when added)
npm test

# Run tests for specific workspace
npm test -w apps/client
npm test -w apps/server
```

*Note: Test configuration to be added in future updates*

---

## 📝 Best Practices

### Adding New Workspaces

1. Create directory under `apps/`
2. Add `package.json` with workspace name
3. Add `tsconfig.json` extending root config
4. Ensure workspace is included in root `workspaces` array

### Managing Dependencies

- Install dependencies in the workspace that uses them
- Use root `devDependencies` only for workspace-wide tools
- Share TypeScript at root level to ensure version consistency
- Avoid duplicate dependencies across workspaces

### Code Sharing

- Put shared types and schemas in `apps/shared/`
- Use relative imports for cross-workspace code
- Export reusable utilities from shared workspace
- Keep business logic in respective workspaces

### Development

- Always use workspace-specific scripts when working on one app
- Use root `npm run dev` for full-stack development
- Clean up ports with `npm run fixports` if ports are stuck
- Check build output before deploying

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
npm run fixports
```

### Dependencies Not Found

```bash
# Reinstall all workspace dependencies
npm install
```

### TypeScript Errors

```bash
# Rebuild all workspaces
npm run build
```

### Import Errors

- Verify you're using `.js` extension in imports
- Check relative path is correct from monorepo root
- Ensure imported file exists and is exported

---

## 📚 Additional Documentation

- **Deployment:** See `docs/deployment/` for detailed deployment guides
- **Cleanup History:** See `docs/cleanup/` for platform cleanup documentation
- **Project Overview:** See `replit.md` for recent changes and architecture

---

**Last Updated:** October 26, 2025  
**Monorepo Version:** 1.0.0
