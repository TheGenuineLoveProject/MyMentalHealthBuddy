import React from "react";
import { Route } from "react-router-dom";

export default function ToolRoutes({ WellnessRoute, ConfigRoute }) {
  return (
    <>
      <Route path="/tools" element={<WellnessRoute />} />
      <Route path="/tools/*" element={<WellnessRoute />} />
      <Route path="/tools/config" element={<ConfigRoute />} />
    </>
  );
}
