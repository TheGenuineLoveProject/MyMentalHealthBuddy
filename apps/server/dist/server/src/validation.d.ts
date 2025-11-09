import { z } from "zod";
export declare class Sanitizer {
    static sanitizeString(input: string): string;
    static sanitizeStringArray(input: unknown): string[];
    static sanitizeObject<T extends Record<string, unknown>>(input: T): T;
    static sanitizeUserId(input: unknown): string;
}
export declare const ValidationPatterns: {
    userId: z.ZodString;
    sessionId: z.ZodString;
    email: z.ZodString;
    username: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
    mood: z.ZodString;
    intensity: z.ZodNumber;
    notes: z.ZodString;
    tag: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    country: z.ZodString;
    phoneNumber: z.ZodString;
    website: z.ZodString;
};
export declare class ValidationError extends Error {
    errors?: unknown | undefined;
    statusCode: number;
    constructor(message: string, errors?: unknown | undefined, statusCode?: number);
}
export declare function validateRequest<T>(schema: z.ZodType<T>, data: unknown): T;
declare class RateLimiter {
    private requests;
    private readonly windowMs;
    private readonly maxRequests;
    constructor(windowMs?: number, maxRequests?: number);
    check(identifier: string): boolean;
    private cleanup;
}
export declare const apiRateLimiter: RateLimiter;
export declare const chatRateLimiter: RateLimiter;
export {};
