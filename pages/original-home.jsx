// /pages/original-home.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function OriginalHomePage() {
  return <PageTemplate config={getRouteConfig("/original-home")} />;
}