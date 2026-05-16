import { useEffect } from "react";

/**
 * useScrollReveal — IntersectionObserver hook that toggles
 * data-revealed="true" on any element with [data-reveal] OR
 * [data-reveal-stagger] currently mounted in the document.
 *
 * Mount once at app or page level. Respects prefers-reduced-motion.
 */
export function useScrollReveal({ rootMargin = "0px 0px -10% 0px", threshold = 0.15 } = {}) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document.querySelectorAll("[data-reveal], [data-reveal-stagger]").forEach((el) => {
        el.setAttribute("data-revealed", "true");
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin, threshold }
    );

    const targets = document.querySelectorAll(
      "[data-reveal]:not([data-revealed]), [data-reveal-stagger]:not([data-revealed])"
    );
    targets.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [rootMargin, threshold]);
}

export default useScrollReveal;
