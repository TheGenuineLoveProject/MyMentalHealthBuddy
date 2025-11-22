import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Home Page Loaded <span className="text-emerald-600">✓</span>
        </h1>

        <p className="text-slate-600 mb-6">
          Your UI is now active and connected. Use these links and buttons to
          move around the app.
        </p>

        {/* Primary action button */}
        <div className="mb-8">
          <Button asChild>
            <Link to="/auth">Go to Auth Page</Link>
          </Button>
        </div>

        {/* Links list */}
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>
            <Link to="/auth" className="hover:underline">
              Auth Page
            </Link>
          </li>
          <li>
            <Link to="/protected-test" className="hover:underline">
              Protected Route Test
            </Link>
          </li>
          <li>
            <Link to="/analytics" className="hover:underline">
              Analytics
            </Link>
          </li>
          <li>
            <Link to="/ai-test" className="hover:underline">
              AI Page
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}