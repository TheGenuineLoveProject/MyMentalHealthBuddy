import { useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

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
    return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Route Guard — The Genuine Love Project" description="Explore route guard tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Route Guard</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
  }

  return children;
}
