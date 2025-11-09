"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const pg_storage_js_1 = require("./pg-storage.js");
// MemStorage removed - now using PgStorage for production persistence
// See apps/server/pg-storage.ts for full implementation
// Switch to PostgreSQL for production persistence
exports.storage = new pg_storage_js_1.PgStorage();
