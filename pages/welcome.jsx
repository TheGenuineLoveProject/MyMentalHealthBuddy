// /pages/welcome.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function WelcomeAliasPage() {
  return <PageTemplate config={getRouteConfig("/welcome")} />;
}