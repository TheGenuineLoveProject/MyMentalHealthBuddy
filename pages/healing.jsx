// /pages/healing.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function HealingPage() {
  return <PageTemplate config={getRouteConfig("/healing")} />;
}