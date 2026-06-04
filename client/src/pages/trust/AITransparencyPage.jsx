import React from "react";
import { Helmet } from "react-helmet-async";
import TrustPageLayout from "../../components/trust/TrustPageLayout.jsx";
import TrustSection from "../../components/trust/TrustSection.jsx";
import { trustRegistry } from "../../content/trust/trustRegistry.js";

export default function AITransparencyPage() {
  const meta = trustRegistry.aiTransparency;
  const seoTitle = `${meta.title} | MyMentalHealthBuddy`;
  const seoDescription = meta.seoDescription || meta.subtitle;
  const canonicalUrl = `https://mymentalhealthbuddy.com${meta.path}`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyMentalHealthBuddy" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>
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
