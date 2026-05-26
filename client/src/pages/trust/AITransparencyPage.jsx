import React from "react";
import TrustPageLayout from "../../components/trust/TrustPageLayout.jsx";
import TrustSection from "../../components/trust/TrustSection.jsx";
import PageSEO from "../../components/seo/PageSEO.jsx";
import { trustRegistry } from "../../content/trust/trustRegistry.js";
import { getRouteMeta } from "../../content/routes/routeRegistry.js";

export default function AITransparencyPage() {
  const meta = trustRegistry.aiTransparency;
  const route = getRouteMeta("/ai-transparency");

  return (
    <>
      {route ? (
        <PageSEO
          title={route.title}
          description={route.description}
          seoDescription={route.seoDescription}
          canonical={route.canonical}
          indexable={route.indexable}
        />
      ) : null}
      <TrustPageLayout
        title={meta.title}
        subtitle={meta.subtitle}
        callout={
          <p>
            AI here is a gentle reflection aid — never a diagnostician, never a
            therapist, never a replacement for human care.
          </p>
        }
      >
        {meta.sections.map((s) => (
          <TrustSection
            key={s.id}
            title={s.title}
            body={s.body}
            testId={`section-ai-${s.id}`}
          />
        ))}
      </TrustPageLayout>
    </>
  );
}
