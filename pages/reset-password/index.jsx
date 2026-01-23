// /pages/reset-password/index.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function ResetPasswordPage() {
  return <PageTemplate config={getRouteConfig("/reset-password")} />;
}