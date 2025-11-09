interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}
export declare class OpenAIError extends Error {
    code: string;
    statusCode?: number | undefined;
    constructor(message: string, code: string, statusCode?: number | undefined);
}
export declare class RateLimitError extends OpenAIError {
    constructor(message?: string);
}
export declare class APIKeyError extends OpenAIError {
    constructor(message?: string);
}
export declare class TimeoutError extends OpenAIError {
    constructor(message?: string);
}
export declare class QuotaExceededError extends OpenAIError {
    constructor(message?: string);
}
export declare function generateChatResponse(userMessage: string, chatHistory?: Message[], retryCount?: number): Promise<string>;
export declare function streamChatResponse(userMessage: string, chatHistory?: Message[]): AsyncGenerator<string>;
export declare function checkOpenAIHealth(): Promise<{
    healthy: boolean;
    error?: string;
}>;
export {};
//# sourceMappingURL=openai.d.ts.map