// /pages/community/discussion/[id].jsx
import Layout from "../../../components/Layout";
import PageTemplate from "../../../components/PageTemplate";
import { getRouteConfig } from "../../../content/routes";

export default function DiscussionThread({ config, id }) {
  const base = config || getRouteConfig("/community");
  const pageCfg = {
    ...base,
    title: `Discussion ${id} — Community — The Genuine Love Project`,
    heroTitle: "A steady place to talk.",
    heroCopy:
      "This space is designed for emotional safety: clear norms, kind language, and room to be human.",
  };

  return (
    <Layout seo={{ title: pageCfg.title, description: pageCfg.description }}>
      <PageTemplate config={pageCfg} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return { paths: [{ params: { id: "1" } }, { params: { id: "2" } }], fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { id: params.id, config: getRouteConfig("/community") } };
}