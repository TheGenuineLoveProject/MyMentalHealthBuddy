// /pages/[...slug].jsx
import Layout from "../components/Layout";
import PageTemplate from "../components/PageTemplate";
import { getRouteConfig, getStaticRoutes } from "../content/routes";

export default function CatchAllPage({ config }) {
  if (!config) return null;
  return (
    <Layout seo={{ title: config.title, description: config.description }}>
      <PageTemplate config={config} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const staticRoutes = getStaticRoutes();
  const paths = staticRoutes.map((r) => ({
    params: { slug: r.route.replace(/^\//, "").split("/") },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const slug = params?.slug || [];
  const path = "/" + slug.join("/");
  const config = getRouteConfig(path);

  return { props: { config } };
}