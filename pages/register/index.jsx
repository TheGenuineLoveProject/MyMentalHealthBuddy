// /pages/register/index.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function RegisterPage() {
  return <PageTemplate config={getRouteConfig("/register")} />;
}