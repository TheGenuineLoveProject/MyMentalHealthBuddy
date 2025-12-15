import { BrandLogo } from "./BrandLogo";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/brand/logo.png"
          alt="The Genuine Love Project"
          className="h-10 w-auto"
        />
        <span className="font-serif text-xl font-semibold">
          The Genuine Love Project
        </span>
      </Link>

      <nav className="flex gap-6 items-center">
        <Link to="/about">About</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/healing">Healing</Link>
        <Link to="/signin" className="btn-primary">
          Get Started
        </Link>
      </nav>
    </header>
  );
}