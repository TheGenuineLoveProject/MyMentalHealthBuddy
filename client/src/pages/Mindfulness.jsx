import React from "react";
import { Helmet } from "react-helmet-async";
import AutopilotPage from "./_autopilot.jsx";
import { getRouteMeta } from "../content/routes/routeRegistry.js";

export default function Mindfulness() {
  const meta = getRouteMeta("/mindfulness");
  const title = meta?.title || "Mindfulness | MyMentalHealthBuddy";
  const description =
    meta?.seoDescription ||
    meta?.description ||
    "Accessible mindfulness practices — grounding, present-moment awareness, and gentle meditation for emotional regulation.";
  const canonical =
    meta?.canonical || "https://mymentalhealthbuddy.com/mindfulness";
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
      <AutopilotPage route="/meditation" />
    </>
  );
}
