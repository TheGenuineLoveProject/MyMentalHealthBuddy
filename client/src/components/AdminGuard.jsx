import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard({ children }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setLocation("/login?redirect=/admin");
      return;
    }

    if (user.role !== "admin") {
      setLocation("/dashboard");
      return;
    }

    setChecked(true);
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-sm opacity-70">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
