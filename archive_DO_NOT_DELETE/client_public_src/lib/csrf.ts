/**
 * 360° Security: CSRF Token Management for Frontend
 * 
 * Provides automatic CSRF token fetching and attachment to all
 * state-changing requests (POST, PATCH, PUT, DELETE).
 */

let csrfToken: string | null = null;
let tokenPromise: Promise<string> | null = null;

/**
 * Fetch CSRF token from backend
 * Uses singleton pattern to prevent multiple concurrent requests
 */
export async function fetchCsrfToken(): Promise<string> {
  // Return cached token if available
  if (csrfToken) {
    return csrfToken;
  }
  
  // Return existing promise if already fetching
  if (tokenPromise) {
    return tokenPromise;
  }
  
  // Fetch new token
  tokenPromise = (async () => {
    try {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include', // Include session cookie
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }
      
      const data = await response.json();
      csrfToken = data.token;
      
      console.log('[CSRF] Token fetched successfully');
      return csrfToken!;
    } catch (error) {
      console.error('[CSRF] Failed to fetch token:', error);
      throw error;
    } finally {
      tokenPromise = null;
    }
  })();
  
  return tokenPromise;
}

/**
 * Get current CSRF token (cached)
 * Returns null if not yet fetched
 */
export function getCsrfToken(): string | null {
  return csrfToken;
}

/**
 * Clear cached CSRF token
 * Call this after logout or when token becomes invalid
 */
export function clearCsrfToken(): void {
  csrfToken = null;
  tokenPromise = null;
  console.log('[CSRF] Token cleared');
}

/**
 * Attach CSRF token to request headers
 * Automatically fetches token if not cached
 */
export async function attachCsrfToken(headers: HeadersInit = {}): Promise<HeadersInit> {
  const token = await fetchCsrfToken();
  
  return {
    ...headers,
    'X-CSRF-Token': token,
  };
}

/**
 * Check if request method requires CSRF protection
 */
export function requiresCsrfToken(method: string): boolean {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
  return !safeMethods.includes(method.toUpperCase());
}

/**
 * Initialize CSRF token on application load
 * Call this in your root component (App.tsx)
 */
export async function initializeCsrf(): Promise<void> {
  try {
    await fetchCsrfToken();
    console.log('[CSRF] Initialization complete');
  } catch (error) {
    console.warn('[CSRF] Initialization failed - will retry on first mutation:', error);
  }
}
