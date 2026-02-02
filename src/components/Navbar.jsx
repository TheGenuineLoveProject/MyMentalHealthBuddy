import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full p-4 bg-white shadow flex justify-between items-center font-playfair">
      <img src="/assets/logo.svg" alt="Logo" className="h-10" />
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        {user && <Link to="/journal" className="hover:underline">Journal</Link>}
        {user && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
        {user ? (
          <button onClick={logout} className="text-red-500">Logout</button>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}