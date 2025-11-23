// client/src/components/Layout/Layout.jsx

import { Link } from "wouter";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-4 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-bold">MyMentalHealthBuddy</h1>
        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/mood">Mood</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/auth">Login</Link>
        </nav>
      </header>

      <main className="flex-grow p-4">
        {children}
      </main>

      <footer className="p-4 text-center text-sm opacity-60">
        © {new Date().getFullYear()} MyMentalHealthBuddy
      </footer>
    </div>
  );
}