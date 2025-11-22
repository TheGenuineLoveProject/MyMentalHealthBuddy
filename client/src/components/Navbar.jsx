import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        MyMentalHealthBuddy
      </Link>

      {/* Links */}
      <div className="flex space-x-6 text-gray-700 font-medium">
        <Link to="/auth" className="hover:text-blue-600">Auth</Link>
        <Link to="/protected-test" className="hover:text-blue-600">Protected</Link>
        <Link to="/analytics" className="hover:text-blue-600">Analytics</Link>
        <Link to="/ai-test" className="hover:text-blue-600">AI Test</Link>
      </div>
    </nav>
  );
}