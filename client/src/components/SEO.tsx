import { useEffect } from "react";
import { BRAND } from "@shared/brand.mjs";

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
  canonicalUrl?: string;
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
  canonicalUrl
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | ${BRAND.name}` 
    : defaultMeta.title;

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

    setMeta("description", description);
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:type", type);
    setMeta("og:site_name", BRAND.name);
    setMeta("og:image", imageUrl);
    setMeta("og:url", canonicalUrl || window.location.href);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl);

    if (canonicalUrl) {
      const fullCanonical = canonicalUrl.startsWith("http") ? canonicalUrl : `${baseUrl}${canonicalUrl}`;
      setCanonical(fullCanonical);
    } else {
      setCanonical(window.location.href.split('?')[0]);
    }

    if (noindex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    return () => {
      document.title = defaultMeta.title;
    };
  }, [fullTitle, description, type, image, noindex, canonicalUrl]);

  return null;
}

export default SEO;
