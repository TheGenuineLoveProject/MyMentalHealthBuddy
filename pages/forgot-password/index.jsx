// /pages/forgot-password/index.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function ForgotPasswordPage() {
  return <PageTemplate config={getRouteConfig("/forgot-password")} />;
}