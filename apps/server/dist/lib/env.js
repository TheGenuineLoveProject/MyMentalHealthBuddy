"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.string().default("5000"),
    DATABASE_URL: zod_1.z.string().url().optional(),
    AI_INTEGRATIONS_OPENAI_BASE_URL: zod_1.z.string().url().optional(),
    AI_INTEGRATIONS_OPENAI_API_KEY: zod_1.z.string().optional(),
    SESSION_SECRET: zod_1.z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
}).refine((env) => {
    // In production, both SESSION_SECRET and DATABASE_URL are mandatory
    if (env.NODE_ENV === "production") {
        if (!env.SESSION_SECRET) {
            return false;
        }
        if (!env.DATABASE_URL) {
            return false;
        }
    }
    return true;
}, {
    message: "SESSION_SECRET and DATABASE_URL are required in production mode for secure multi-instance sessions"
});
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        console.error("❌ Invalid environment variables:");
        if (error instanceof zod_1.z.ZodError) {
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join(".")}: ${err.message}`);
            });
        }
        throw new Error("Environment validation failed");
    }
}
