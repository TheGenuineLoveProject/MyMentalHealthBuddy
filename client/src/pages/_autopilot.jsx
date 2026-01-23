/**
 * ============================================================================
 * AUTOPILOT PAGE - Config-Driven Route Renderer
 * ============================================================================
 * 
 * Renders any route via: getRouteConfig(pathname) -> <PageTemplate config={...} />
 * 
 * Features:
 * - Alias route resolution (/home -> /)
 * - Dynamic pattern matching (/blog/:slug)
 * - Safe fallback for unknown routes
 * - AOS with once:true (gentle animations)
 * - GSAP respects prefers-reduced-motion
 * - Sacred UI components with CSS tokens
 * ============================================================================
 */

import { useLocation, useRoute } from 'wouter';
import { getRouteConfig } from '../content/routes.js';
import PageTemplate from '../components/PageTemplate.jsx';

export default function AutopilotPage({ route }) {
  const [location] = useLocation();
  const pathname = route || location;
  
  const config = getRouteConfig(pathname);
  
  if (!config) {
    const notFoundConfig = getRouteConfig('/not-found');
    if (notFoundConfig) {
      return <PageTemplate config={notFoundConfig} />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--sacred-white,#faf9f7)]">
        <div className="text-center px-6">
          <h1 className="sacred-title text-[var(--sacred-teal,#2f5d5d)] mb-4">
            Page Not Found
          </h1>
          <p className="sacred-body text-[var(--sacred-charcoal,#3a3a3a)] mb-8">
            The route "{pathname}" is not configured.
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))',
              color: 'white',
              boxShadow: '0 4px 16px rgba(143, 191, 159, 0.3)'
            }}
            data-testid="link-go-home"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }
  
  return <PageTemplate config={config} />;
}

export { AutopilotPage };
