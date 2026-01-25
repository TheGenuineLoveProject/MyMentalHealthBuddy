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

import { useLocation } from 'wouter';
import { getRouteConfig } from '../content/routes.js';
import PageTemplate from '../components/PageTemplate.jsx';
import RouteGuard from '../components/RouteGuard.jsx';
import styles from './AutopilotFallback.module.css';
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

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
  <WellnessPageShell
    title="_autopilot"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

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
    </WellnessPageShell>
  );
  }
  
  const page = <PageTemplate config={config} />;
  
  if (config.protected) {
    return <RouteGuard>{page}</RouteGuard>;
  }
  
  return page;
}

export { AutopilotPage };
