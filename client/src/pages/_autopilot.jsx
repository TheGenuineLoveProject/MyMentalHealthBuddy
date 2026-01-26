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
 * - Automatic route protection based on config.protected
 * - AOS with once:true (gentle animations)
 * - GSAP respects prefers-reduced-motion
 * - Sacred UI components with CSS Modules
 * - Deterministic routeKey for SEO/benefits/content selection
 * ============================================================================
 */

import { useLocation } from 'wouter';
import { getRouteConfig } from '../content/routes.js';
import PageTemplate from '../components/PageTemplate.jsx';
import RouteGuard from '../components/RouteGuard.jsx';
import styles from './AutopilotFallback.module.css';

export function AutopilotPage({ route, routeKey }) {
  const [location] = useLocation();
  const pathname = route || location;
  
  // Deterministic routeKey: use provided or fallback to route
  const effectiveRouteKey = routeKey || pathname;
  
  const config = getRouteConfig(pathname);
  
  if (!config) {
    const notFoundConfig = getRouteConfig('/not-found');
    if (notFoundConfig) {
      return <PageTemplate config={notFoundConfig} routeKey="not-found" />;
    }
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Page Not Found
          </h1>
          <p className={styles.message}>
            The route "{pathname}" is not configured.
          </p>
          <a 
            href="/"
            className={styles.homeLink}
            data-testid="link-go-home"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }
  
  // Pass effectiveRouteKey to PageTemplate for SEO/benefits/content selection
  const page = <PageTemplate config={config} routeKey={effectiveRouteKey} />;
  
  if (config.protected) {
    return <RouteGuard>{page}</RouteGuard>;
  }
  
  return page;
}

export default AutopilotPage;
