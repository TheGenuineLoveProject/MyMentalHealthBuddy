/**
 * Canva Token Auto-Refresh - 360° Integration Enhancement
 * Automatically refreshes Canva access tokens before expiration
 */
declare class CanvaTokenManager {
    private tokens;
    private refreshIntervals;
    /**
     * Store token data and set up auto-refresh
     */
    setToken(userId: string, tokenData: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }): void;
    /**
     * Get valid access token (refreshes if needed)
     */
    getAccessToken(userId: string): Promise<string | null>;
    /**
     * Refresh access token using refresh token
     */
    private refreshToken;
    /**
     * Schedule automatic token refresh
     */
    private scheduleRefresh;
    /**
     * Remove token and cancel refresh
     */
    removeToken(userId: string): void;
    /**
     * Check if user has valid token
     */
    hasValidToken(userId: string): boolean;
    /**
     * Get all users with tokens
     */
    getActiveUsers(): string[];
    /**
     * Cleanup expired tokens (run periodically)
     */
    cleanup(): void;
}
export declare const canvaTokenManager: CanvaTokenManager;
export {};
//# sourceMappingURL=canvaTokenRefresh.d.ts.map