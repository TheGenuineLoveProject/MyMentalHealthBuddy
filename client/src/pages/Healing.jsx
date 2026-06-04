import React from "react";
import { Helmet } from "react-helmet-async";
import AutopilotPage from "./_autopilot.jsx";
import { getRouteMeta } from "../content/routes/routeRegistry.js";

export default function Healing() {
  const meta = getRouteMeta("/healing");
  const title = meta?.title || "Healing | MyMentalHealthBuddy";
  const description =
    meta?.seoDescription ||
    meta?.description ||
    "Trauma-informed healing tools — gentle reflection prompts, recovery practices, and compassionate guidance.";
  const canonical =
    meta?.canonical || "https://mymentalhealthbuddy.com/healing";
  const indexable = meta?.indexable !== false;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        {!indexable ? <meta name="robots" content="noindex,nofollow" /> : null}

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyMentalHealthBuddy" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      <AutopilotPage route="/healing" />
    </>
  );
}
