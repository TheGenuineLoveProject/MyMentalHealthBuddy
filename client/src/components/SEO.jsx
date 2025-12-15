// client/src/components/SEO.jsx
// Dynamic SEO component for page-specific meta tags

import { useEffect } from "react";

const defaultMeta = {
  title: "The Genuine Love Project - Live in Genuine Love",
  description: "An AI-powered mental wellness platform for self-love, healing, and emotional growth — private, compassionate, and available 24/7.",
  type: "website",
  image: "/og-image.png",
};

export function SEO({ 
  title, 
  description = defaultMeta.description,
  type = defaultMeta.type,
  image = defaultMeta.image,
  noindex = false 
}) {
  const fullTitle = title 
    ? `${title} | The Genuine Love Project` 
    : defaultMeta.title;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name, content) => {
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

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

    setMeta("description", description);
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:type", type);
    setMeta("og:site_name", "The Genuine Love Project");
    setMeta("og:image", imageUrl);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl);

    if (noindex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    return () => {
      document.title = defaultMeta.title;
    };
  }, [fullTitle, description, type, image, noindex]);

  return null;
}

export default SEO;
