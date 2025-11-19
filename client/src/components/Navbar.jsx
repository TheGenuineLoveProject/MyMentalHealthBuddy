import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-700">
        MyMentalHealthBuddy
      </Link>
      <div className="flex gap-6 text-gray-700">
        <Link to="/mood">Mood</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/ai">AI Buddy</Link>
      </div>
    </nav>
  );
}