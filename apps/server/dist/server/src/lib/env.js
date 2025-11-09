import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("5000"),
    DATABASE_URL: z.string().url().optional(),
    AI_INTEGRATIONS_OPENAI_BASE_URL: z.string().url().optional(),
    AI_INTEGRATIONS_OPENAI_API_KEY: z.string().optional(),
    SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
    SENTRY_DSN: z.string().url().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    CANVA_CLIENT_ID: z.string().optional(),
    CANVA_CLIENT_SECRET: z.string().optional(),
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
export function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        console.error("❌ Invalid environment variables:");
        if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join(".")}: ${err.message}`);
            });
        }
        throw new Error("Environment validation failed");
    }
}
