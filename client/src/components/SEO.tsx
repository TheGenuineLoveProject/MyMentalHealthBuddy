import { useEffect } from "react";
import { BRAND } from "@shared/brand.mjs";

export const SITE_URL = "https://mymentalhealthbuddy.com";

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
  canonicalUrl?: string;
  route?: string;
  datePublished?: string;
  dateModified?: string;
}

const defaultMeta = {
  title: `${BRAND.name} - ${BRAND.tagline}`,
  description: BRAND.mission,
  type: "website",
  image: "/og-image.png",
};

export function SEO({ 
  title, 
  description = defaultMeta.description,
  type = defaultMeta.type,
  image = defaultMeta.image,
  noindex = false,
  canonicalUrl,
  route,
  datePublished,
  dateModified
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | ${BRAND.name}` 
    : defaultMeta.title;
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        if (name.startsWith("og:") || name.startsWith("twitter:")) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const setCanonical = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);
    };

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;
    // Public metadata identifies the published page even when rendered on a
    // preview host. Explicit absolute canonicals can still identify a publisher.
    const canonical = new URL(canonicalUrl || route || currentPath, SITE_URL);
    canonical.search = "";
    canonical.hash = "";
    const pageUrl = canonical.href;

    setMeta("description", description);
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:type", type);
    setMeta("og:site_name", BRAND.name);
    setMeta("og:image", imageUrl);
    setMeta("og:url", pageUrl);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl);

    setCanonical(pageUrl);

    if (noindex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": fullTitle,
      "description": description,
      "url": pageUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": BRAND.name,
        "url": SITE_URL
      },
      ...(datePublished && { "datePublished": datePublished }),
      ...(dateModified && { "dateModified": dateModified }),
      "publisher": {
        "@type": "Organization",
        "name": BRAND.name,
        "url": SITE_URL
      }
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"][data-seo]') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.type = "application/ld+json";
      jsonLdScript.setAttribute("data-seo", "true");
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = defaultMeta.title;
      const existingJsonLd = document.querySelector('script[type="application/ld+json"][data-seo]');
      if (existingJsonLd) existingJsonLd.remove();
    };
  }, [fullTitle, description, type, image, noindex, canonicalUrl, route, currentPath, datePublished, dateModified]);

  return null;
}

export default SEO;
