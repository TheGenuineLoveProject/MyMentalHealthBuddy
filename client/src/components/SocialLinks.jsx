import React from "react";
import { SOCIAL_LINKS } from "../config/social";

export default function SocialLinks() {
  const items = Object.entries(SOCIAL_LINKS);

  return (
    <div className="flex flex-wrap gap-3">
      {items.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border px-3 py-1 text-sm hover:opacity-80"
          data-testid={`social-${key}`}
          title={key}
        >
          {key}
        </a>
      ))}
    </div>
  );
}