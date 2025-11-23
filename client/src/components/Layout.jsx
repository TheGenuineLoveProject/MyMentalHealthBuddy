import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
