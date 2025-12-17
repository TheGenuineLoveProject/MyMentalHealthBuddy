import React from "react";
import { BRAND } from "@shared/brand";

export default function Profile() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: BRAND.colors.primary }}>{BRAND.name}</h1>
      <p>{BRAND.tagline}</p>
      <p style={{ opacity: 0.75 }}>
        Replace this scaffold with your Figma Dev Mode code for: Profile
      </p>
    </div>
  );
}
