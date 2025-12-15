// client/src/components/ThemeProvider.jsx

function ThemeProvider({ children }) {
  // 🔒 Simple wrapper – later you can add dark mode, fonts, etc.
  return <>{children}</>;
}

export default ThemeProvider;