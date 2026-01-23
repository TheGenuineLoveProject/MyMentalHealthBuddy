// /pages/index.jsx
import Layout from "../components/Layout";
import PageTemplate from "../components/PageTemplate";
import { getRouteConfig } from "../content/routes";

export default function HomePage() {
  const config = getRouteConfig("/");
  return (
    <Layout seo={{ title: config?.title, description: config?.description }}>
      <PageTemplate config={config} />
    </Layout>
  );
}