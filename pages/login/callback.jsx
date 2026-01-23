// /pages/login/callback.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function LoginCallbackPage() {
  return <PageTemplate config={getRouteConfig("/login/callback")} />;
}