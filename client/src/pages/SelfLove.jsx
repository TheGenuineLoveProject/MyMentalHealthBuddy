import React from "react";
import { Helmet } from "react-helmet-async";
import SelfLovePage from "./SelfLovePage.jsx";
import { getRouteMeta } from "../content/routes/routeRegistry.js";

export default function SelfLove() {
  const meta = getRouteMeta("/self-love");
  const title = meta?.title || "Self-Love | MyMentalHealthBuddy";
  const description =
    meta?.seoDescription ||
    meta?.description ||
    "Gentle self-love practices — compassion, acceptance, and tender self-care for emotional wellbeing.";
  const canonical =
    meta?.canonical || "https://mymentalhealthbuddy.com/self-love";
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
      <SelfLovePage />
    </>
  );
}
