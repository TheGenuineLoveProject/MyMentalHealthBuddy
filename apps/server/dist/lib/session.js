"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionStore = createSessionStore;
exports.createSessionMiddleware = createSessionMiddleware;
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const pg_1 = __importDefault(require("pg"));
const PgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
const { Pool } = pg_1.default;
function createSessionStore() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL environment variable is required for session management");
    }
    const pool = new Pool({
        connectionString: dbUrl,
    });
    return new PgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true,
    });
}
function createSessionMiddleware() {
    const isProduction = process.env.NODE_ENV === "production";
    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
        throw new Error("SESSION_SECRET environment variable is required for session management");
    }
    if (sessionSecret.length < 32) {
        throw new Error("SESSION_SECRET must be at least 32 characters for security");
    }
    return (0, express_session_1.default)({
        store: createSessionStore(),
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: isProduction,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: isProduction ? "strict" : "lax",
        },
    });
}
