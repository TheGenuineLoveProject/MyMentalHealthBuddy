// client/src/components/layout/Navbar.jsx
import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        MyMentalHealthBuddy
      </Link>

      <div className="flex space-x-6 text-gray-700 font-medium">
        <Link href="/auth" className="hover:text-blue-600">Auth</Link>
        <Link href="/protected" className="hover:text-blue-600">Protected</Link>
        <Link href="/analytics" className="hover:text-blue-600">Analytics</Link>
        <Link href="/ai" className="hover:text-blue-600">AI Test</Link>
      </div>
    </nav>
  );
}