import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Auth Page ✓</h1>
        <p className="text-slate-600 mb-6">
          Use this page to register and log in.
        </p>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full">Sign In</Button>
        </div>

        <Link to="/" className="text-blue-700 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}