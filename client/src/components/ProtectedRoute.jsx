import { useAuth } from "../hooks/useAuth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--glp-white)] to-[var(--glp-sage)]/10"
        data-testid="loading-auth"
      >
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--glp-sage)] mx-auto" />
          <p className="text-gray-600 dark:text-gray-300 font-inter">
            Preparing your sacred space...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return children;
}
