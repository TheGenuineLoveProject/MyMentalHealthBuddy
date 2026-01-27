import { useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function RouteGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const metaRobots = document.querySelector('meta[name="robots"]');
    const originalContent = metaRobots?.getAttribute("content") || null;
    
    if (metaRobots) {
      metaRobots.setAttribute("content", "noindex, nofollow");
    } else {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, nofollow";
      meta.dataset.routeGuard = "true";
      document.head.appendChild(meta);
    }
    
    return () => {
      const meta = document.querySelector('meta[name="robots"][data-route-guard="true"]');
      if (meta) {
        meta.remove();
      } else {
        const existingMeta = document.querySelector('meta[name="robots"]');
        if (existingMeta && originalContent) {
          existingMeta.setAttribute("content", originalContent);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  return children;
}
