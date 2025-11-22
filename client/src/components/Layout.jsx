// client/src/components/Layout.jsx
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <Navbar />

      {/* Page content */}
      <main className="p-6 max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
}