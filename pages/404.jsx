// /pages/404.jsx
import SacredLayout from "@/components/Layout";
import SacredSection from "@/components/SacredSection";
import SacredButton from "@/components/SacredButton";
// /pages/404.jsx
import React from "react";
import AutopilotPage from "./_autopilot.jsx";
// /pages/404.jsx
import Layout from "../components/Layout";
import PageTemplate from "../components/PageTemplate";

export default function NotFound() {
  const config = {
    title: "Not Found — The Genuine Love Project",
    description: "That page isn’t here. Let’s get you somewhere steady.",
    heroTitle: "This page isn’t here.",
    heroCopy: "No problem. Take a breath—then choose a gentle path back.",
    primaryCta: { label: "Go home", href: "/" },
    secondaryCta: { label: "Go to Healing", href: "/healing" },
  };

  return (
    <Layout seo={{ title: config.title, description: config.description }}>
      <PageTemplate config={config} />
    </Layout>
  );
}
export default function NotFoundPage() {
  return <AutopilotPage routeOverride="/*" />;
}
export default function NotFoundPage() {
  return (
    <SacredLayout title="404 — Not Found" description="This page could not be found.">
      <SacredSection
        eyebrow="Not found"
        title="This page isn’t here."
        subtitle="You didn’t do anything wrong. Let’s bring you back to a calm starting point."
        variant="glow"
        aos="fade-up"
      >
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <SacredButton href="/" ariaLabel="Go to homepage">Go home</SacredButton>
          <SacredButton href="/healing" variant="ghost" ariaLabel="Go to healing">Go to Healing</SacredButton>
        </div>
      </SacredSection>
    </SacredLayout>
  );
}