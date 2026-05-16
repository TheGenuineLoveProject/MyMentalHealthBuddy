import { useLocation } from "wouter";
import { getHubLinks, getHubMeta } from "../../content/hubs/hubGraph";
import PageScaffold from "../../components/layout/PageScaffold";
import { RelatedLinksBlock } from "../../components/RelatedLinksBlock";

function topicFromPath(pathname) {
  const parts = (pathname || "").split("/").filter(Boolean);
  return parts[1] || "anxiety";
}

export default function TopicHubPage() {
  const [pathname] = useLocation();
  const topic = topicFromPath(pathname);
  const hub = getHubMeta(topic);

  const title = hub?.title || "Topic hub";
  const description = hub?.description || "Tools and next steps—organized for clarity.";
  const links = getHubLinks(topic, 18);

  const benefits = [
    "Find the next best tool in one click.",
    "Practice tiny steps that build real momentum.",
    "Stay grounded with gentle, legally-safe skill language.",
  ];

  return (
    <PageScaffold title={title} description={description} benefitsBullets={benefits}>
      <section className="mt-4 rounded-2xl border border-sage-200 dark:border-white/10 bg-sage-50 dark:bg-white/5 p-4" data-testid="section-hub-intro">
        <div className="text-sm text-gray-700 dark:text-white/85">
          Choose one small tool below. You don't need to do everything—just one next step.
        </div>
      </section>

      <RelatedLinksBlock links={links.map((l) => ({ label: l.label, routeKey: l.routeKey, href: l.href }))} />
    </PageScaffold>
  );
}
