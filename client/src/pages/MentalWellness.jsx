import React from "react";
import { Helmet } from "react-helmet-async";
import AutopilotPage from "./_autopilot.jsx";
import { getRouteMeta } from "../content/routes/routeRegistry.js";

export default function MentalWellness() {
  const meta = getRouteMeta("/mental-wellness");
  const title = meta?.title || "Mental Wellness | MyMentalHealthBuddy";
  const description =
    meta?.seoDescription ||
    meta?.description ||
    "Supportive mental wellness practices — non-clinical, trauma-informed, and gently paced.";
  const canonical =
    meta?.canonical || "https://mymentalhealthbuddy.com/mental-wellness";
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
