/**
 * ============================================================================
 * AUTOPILOT PAGE - Config-Driven Route Renderer
 * ============================================================================
 * 
 * Renders any route via: getRouteConfig(pathname) -> <PageTemplate config={...} />
 * 
 * Uses:
 * - AOS with once:true (gentle animations)
 * - GSAP respects prefers-reduced-motion
 * - Sacred UI components with CSS tokens
 * ============================================================================
 */

import { useLocation } from 'wouter';
import { routes } from '../content/routes.js';
import PageTemplate from '../components/PageTemplate.jsx';

export function getRouteConfig(pathname) {
  return routes.find(r => r.route === pathname) || null;
}

export default function AutopilotPage({ route }) {
  const [location] = useLocation();
  const pathname = route || location;
  
  const config = getRouteConfig(pathname);
  
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--sacred-white,#faf9f7)]">
        <div className="text-center">
          <h1 className="sacred-title text-[var(--sacred-teal,#2f5d5d)] mb-4">
            Page Not Found
          </h1>
          <p className="sacred-body text-[var(--sacred-charcoal,#3a3a3a)]">
            The route "{pathname}" is not configured.
          </p>
        </div>
      </div>
    );
  }
  
  return <PageTemplate config={config} />;
}

export { AutopilotPage };
