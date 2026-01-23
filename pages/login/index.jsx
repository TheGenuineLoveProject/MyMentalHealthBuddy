// /pages/login/index.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function LoginPage() {
  return <PageTemplate config={getRouteConfig("/login")} />;
}