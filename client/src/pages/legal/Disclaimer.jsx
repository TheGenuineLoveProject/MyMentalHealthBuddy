import React from "react";
import { BRAND } from "@shared/brand.mjs";

export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>{BRAND.name}</h1>
      <p style={{ opacity: 0.8 }}>{BRAND.tagline}</p>
      <hr style={{ margin: "16px 0" }} />
      <p>TODO: Replace with the matching Figma frame layout.</p>
    </div>
  );
}
cat > client/src/pages/legal/Disclaimer.jsx <<'EOF'
import React from "react";

export default function Disclaimer() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Important Information
      </h1>

      <p className="mt-4 text-neutral-700">
        This platform is not a medical or mental health service.
      </p>

      <p className="mt-4 text-neutral-700">
        If you are in immediate danger or distress, please contact local
        emergency services or a trusted professional.
      </p>

      <p className="mt-4 text-neutral-700">
        All content is provided for reflection and educational purposes only.
      </p>
    </div>
  );
}
EOF