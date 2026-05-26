import React from "react";
import TrustPageLayout from "../../components/trust/TrustPageLayout.jsx";
import TrustSection from "../../components/trust/TrustSection.jsx";
import { trustRegistry } from "../../content/trust/trustRegistry.js";

export default function AITransparencyPage() {
  const meta = trustRegistry.aiTransparency;

  return (
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
  );
}
