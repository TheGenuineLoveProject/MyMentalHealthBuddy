// /pages/blog/[slug].jsx
import Layout from "../../components/Layout";
import PageTemplate from "../../components/PageTemplate";
import { getRouteConfig } from "../../content/routes";

export default function BlogPost({ config, slug }) {
  const base = config || getRouteConfig("/blog");
  const pageCfg = {
    ...base,
    title: `${slug} — Blog — The Genuine Love Project`,
    heroTitle: "A gentle read.",
    heroCopy:
      "Warm, grounded writing—designed to clarify without overwhelm. Take what helps. Leave what doesn’t.",
  };

  return (
    <Layout seo={{ title: pageCfg.title, description: pageCfg.description }}>
      <PageTemplate config={pageCfg} />
    </Layout>
  );
}

export async function getStaticPaths() {
  // Safe placeholder paths—replace with real CMS/content later
  return {
    paths: [{ params: { slug: "welcome" } }, { params: { slug: "grounding-basics" } }],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: { slug: params.slug, config: getRouteConfig("/blog") } };
}