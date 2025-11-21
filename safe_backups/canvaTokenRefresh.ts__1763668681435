/**
 * Canva Token Auto-Refresh - 360° Integration Enhancement
 * Automatically refreshes Canva access tokens before expiration
 */

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
  userId: string;
}

class CanvaTokenManager {
  private tokens: Map<string, TokenData> = new Map();
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Store token data and set up auto-refresh
   */
  setToken(userId: string, tokenData: {
    access_token: string;
    refresh_token: string;
    expires_in: number; // Seconds until expiration
  }) {
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    
    const data: TokenData = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
      userId
    };

    this.tokens.set(userId, data);

    // Schedule refresh 5 minutes before expiration
    const refreshTime = Math.max(0, (tokenData.expires_in - 300) * 1000);
    this.scheduleRefresh(userId, refreshTime);

    console.log(`[CANVA] Token stored for user ${userId}, expires at ${new Date(expiresAt).toISOString()}`);
  }

  /**
   * Get valid access token (refreshes if needed)
   */
  async getAccessToken(userId: string): Promise<string | null> {
    const data = this.tokens.get(userId);
    
    if (!data) {
      console.warn(`[CANVA] No token found for user ${userId}`);
      return null;
    }

    // Check if token is expired or about to expire (within 5 minutes)
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    
    if (data.expiresAt <= fiveMinutesFromNow) {
      console.log(`[CANVA] Token expiring soon, refreshing for user ${userId}`);
      return await this.refreshToken(userId);
    }

    return data.accessToken;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshToken(userId: string): Promise<string | null> {
    const data = this.tokens.get(userId);
    
    if (!data) {
      console.error(`[CANVA] Cannot refresh: No token data for user ${userId}`);
      return null;
    }

    try {
      // Canva token refresh endpoint
      const response = await fetch('https://api.canva.com/rest/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: data.refreshToken,
          client_id: process.env.CANVA_CLIENT_ID || '',
          client_secret: process.env.CANVA_CLIENT_SECRET || ''
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
      }

      const newTokenData = await response.json();

      // Update stored token
      this.setToken(userId, {
        access_token: newTokenData.access_token,
        refresh_token: newTokenData.refresh_token || data.refreshToken,
        expires_in: newTokenData.expires_in
      });

      console.log(`[CANVA] ✅ Token refreshed successfully for user ${userId}`);
      return newTokenData.access_token;

    } catch (error) {
      console.error(`[CANVA] ❌ Token refresh failed for user ${userId}:`, error);
      
      // Remove invalid token
      this.removeToken(userId);
      
      return null;
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleRefresh(userId: string, delayMs: number) {
    // Clear existing refresh interval
    const existing = this.refreshIntervals.get(userId);
    if (existing) {
      clearTimeout(existing);
    }

    // Schedule new refresh
    const timeout = setTimeout(async () => {
      console.log(`[CANVA] Auto-refreshing token for user ${userId}`);
      await this.refreshToken(userId);
    }, delayMs);

    this.refreshIntervals.set(userId, timeout);
  }

  /**
   * Remove token and cancel refresh
   */
  removeToken(userId: string) {
    this.tokens.delete(userId);
    
    const interval = this.refreshIntervals.get(userId);
    if (interval) {
      clearTimeout(interval);
      this.refreshIntervals.delete(userId);
    }

    console.log(`[CANVA] Token removed for user ${userId}`);
  }

  /**
   * Check if user has valid token
   */
  hasValidToken(userId: string): boolean {
    const data = this.tokens.get(userId);
    return data !== undefined && data.expiresAt > Date.now();
  }

  /**
   * Get all users with tokens
   */
  getActiveUsers(): string[] {
    return Array.from(this.tokens.keys());
  }

  /**
   * Cleanup expired tokens (run periodically)
   */
  cleanup() {
    const now = Date.now();
    
    for (const [userId, data] of this.tokens.entries()) {
      if (data.expiresAt <= now) {
        console.log(`[CANVA] Cleaning up expired token for user ${userId}`);
        this.removeToken(userId);
      }
    }
  }
}

// Global instance
export const canvaTokenManager = new CanvaTokenManager();

// Run cleanup every hour
setInterval(() => {
  canvaTokenManager.cleanup();
}, 60 * 60 * 1000);
