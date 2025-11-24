// client/src/components/layout/Layout.jsx
import Navbar from "@/components/layout/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}