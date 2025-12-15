import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import React from "react";
import { useAuth } from "../auth/AuthContext";
import RequirePro from "../guards/RequirePro";
<Route path="/pro-tool" element={<RequirePro><ProTool /></RequirePro>} />

export default function RequirePro({ children }) {
  const { user } = useAuth();
  const plan = user?.subscription_status || "free";
  if (plan !== "pro" && plan !== "premium") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Pro Feature</h2>
        <p>This feature requires Pro.</p>
        <a href="/pricing">Go to Pricing</a>
      </div>
    );
  }
  return children;
}
export default function RequirePro({ children }) {
  const { user } = useAuth();

  if (!user || user.subscription_status !== "pro") {
    return <Navigate to="/upgrade" replace />;
  }
  <Route
    path="/pro-dashboard"
    element={
      <RequirePro>
        <ProDashboard />
      </RequirePro>
    }
  />
  return children;
}