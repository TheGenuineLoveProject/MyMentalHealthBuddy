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
 * ============================================================================
 */
import { useLocation } from "wouter";
import { getFullRouteConfig, routes } from "../content/routes.js";
import PageTemplate from "../components/PageTemplate.jsx";
import RouteGuard from "../components/RouteGuard.jsx";
import styles from "./AutopilotFallback.module.css";

import { deriveRouteKeyFromPath } from "../content/meta/routeMetaRegistry.ts";

export default function AutopilotPage({ route, routeKey }) {
  const [location] = useLocation();
  const pathname = route || location;

  const effectiveRouteKey = routeKey || deriveRouteKeyFromPath(pathname);

  const config = getFullRouteConfig(pathname, routes, { routeKey: effectiveRouteKey });


  if (!config || !config.hero) {
    const notFoundConfig = getFullRouteConfig("/not-found", routes, { routeKey: "not_found" });
    if (notFoundConfig && notFoundConfig.hero) return <PageTemplate config={notFoundConfig} routeKey="not_found" />;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.message}>The route "{pathname}" is not configured.</p>
          <a href="/" className={styles.homeLink} data-testid="link-go-home">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const page = <PageTemplate config={config} routeKey={effectiveRouteKey} />;

  if (config.protected) {
    return <RouteGuard>{page}</RouteGuard>;
  }
  return page;
}

export { AutopilotPage };