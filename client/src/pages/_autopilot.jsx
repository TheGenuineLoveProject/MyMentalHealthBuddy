/**
 * ============================================================================
 * AUTOPILOT PAGE - Config-Driven Route Renderer (v145)
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
import PageSEO from "../components/seo/PageSEO.jsx";
import { getRouteMeta } from "../content/routes/routeRegistry.js";
import styles from "./AutopilotFallback.module.css";

import { deriveRouteKeyFromPath } from "../content/meta/routeMetaRegistry.ts";

const SEO_ENABLED_PATHS = new Set(["/about"]);

function RouteRegistrySEO({ pathname }) {
  if (!SEO_ENABLED_PATHS.has(pathname)) return null;
  const meta = getRouteMeta(pathname);
  if (!meta) return null;
  return (
    <PageSEO
      title={meta.title}
      description={meta.description}
      seoDescription={meta.seoDescription}
      canonical={meta.canonical}
      indexable={meta.indexable !== false}
    />
  );
}

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
          <h1 className={styles.title}>Taking a different path</h1>
          <p className={styles.message}>This page isn't here right now—but that's okay. Sometimes we find ourselves in unexpected places. Let's guide you somewhere helpful.</p>
          <a href="/" className={styles.homeLink} data-testid="link-go-home">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const page = (
    <>
      <RouteRegistrySEO pathname={pathname} />
      <PageTemplate config={config} routeKey={effectiveRouteKey} />
    </>
  );

  if (config.protected) {
    return <RouteGuard>{page}</RouteGuard>;
  }
  return page;
}

export { AutopilotPage };