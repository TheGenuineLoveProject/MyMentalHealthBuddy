import { useAuth } from "../context/AuthContext.jsx";

export default function RequirePro({ children }) {
  const { user } = useAuth();
  const plan = user?.subscription_status || "free";
  
  if (plan !== "pro" && plan !== "premium") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Pro Feature</h2>
        <p>This feature requires a Pro subscription.</p>
        <a href="/pricing">View Pricing</a>
      </div>
    );
  }
  return children;
}
