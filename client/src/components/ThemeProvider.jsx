// client/src/components/ThemeProvider.jsx

import React from "react";

function ThemeProvider({ children }) {
  // 🔒 Simple wrapper – later you can add dark mode, fonts, etc.
  return <>{children}</>;
}

export default ThemeProvider;