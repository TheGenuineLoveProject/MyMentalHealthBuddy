import React from "react";
import { Helmet } from "react-helmet-async";

export default function PageSEO({
  title,
  description,
  canonical,
  seoDescription,
  indexable = true,
  image = null,
  type = "website",
}) {
  const desc = seoDescription || description || "";

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {desc ? <meta name="description" content={desc} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {!indexable ? <meta name="robots" content="noindex,nofollow" /> : null}

      {title ? <meta property="og:title" content={title} /> : null}
      {desc ? <meta property="og:description" content={desc} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MyMentalHealthBuddy" />
      {image ? <meta property="og:image" content={image} /> : null}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {desc ? <meta name="twitter:description" content={desc} /> : null}
      {image ? <meta name="twitter:image" content={image} /> : null}
    </Helmet>
  );
}
