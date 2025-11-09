import { z } from "zod";
declare const envSchema: z.ZodEffects<z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodString>;
    DATABASE_URL: z.ZodOptional<z.ZodString>;
    AI_INTEGRATIONS_OPENAI_BASE_URL: z.ZodOptional<z.ZodString>;
    AI_INTEGRATIONS_OPENAI_API_KEY: z.ZodOptional<z.ZodString>;
    SESSION_SECRET: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "production" | "test" | "development";
    SESSION_SECRET: string;
    PORT: string;
    DATABASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_BASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_API_KEY?: string | undefined;
}, {
    SESSION_SECRET: string;
    DATABASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_BASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_API_KEY?: string | undefined;
    NODE_ENV?: "production" | "test" | "development" | undefined;
    PORT?: string | undefined;
}>, {
    NODE_ENV: "production" | "test" | "development";
    SESSION_SECRET: string;
    PORT: string;
    DATABASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_BASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_API_KEY?: string | undefined;
}, {
    SESSION_SECRET: string;
    DATABASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_BASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_API_KEY?: string | undefined;
    NODE_ENV?: "production" | "test" | "development" | undefined;
    PORT?: string | undefined;
}>;
export declare function validateEnv(): {
    NODE_ENV: "production" | "test" | "development";
    SESSION_SECRET: string;
    PORT: string;
    DATABASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_BASE_URL?: string | undefined;
    AI_INTEGRATIONS_OPENAI_API_KEY?: string | undefined;
};
export type Env = z.infer<typeof envSchema>;
export {};
