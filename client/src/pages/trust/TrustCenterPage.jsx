import React from "react";
import TrustPageLayout from "../../components/trust/TrustPageLayout.jsx";
import TrustSection from "../../components/trust/TrustSection.jsx";
import PageSEO from "../../components/seo/PageSEO.jsx";
import { trustRegistry } from "../../content/trust/trustRegistry.js";
import { getRouteMeta } from "../../content/routes/routeRegistry.js";

export default function TrustCenterPage() {
  const meta = trustRegistry.trustCenter;
  const route = getRouteMeta("/trust");

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
            MyMentalHealthBuddy is educational and supportive — not a substitute
            for professional care. In crisis, call 988, text 741741, or 911.
          </p>
        }
      >
        {meta.sections.map((s) => (
          <TrustSection
            key={s.id}
            title={s.title}
            body={s.body}
            testId={`section-trust-${s.id}`}
          />
        ))}
      </TrustPageLayout>
    </>
  );
}
