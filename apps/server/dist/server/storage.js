import { PgStorage } from "./pg-storage.js";
// MemStorage removed - now using PgStorage for production persistence
// See apps/server/pg-storage.ts for full implementation
// Switch to PostgreSQL for production persistence
export const storage = new PgStorage();
