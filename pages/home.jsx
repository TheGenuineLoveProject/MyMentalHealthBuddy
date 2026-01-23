// /pages/home.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function HomeAliasPage() {
  return <PageTemplate config={getRouteConfig("/home")} />;
}