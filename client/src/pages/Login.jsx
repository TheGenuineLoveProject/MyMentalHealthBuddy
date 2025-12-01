import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Save token + redirect
      localStorage.setItem("token", data.token);
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 text-white">
      <form 
        onSubmit={handleLogin}
        className="w-full max-w-md bg-neutral-900 p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-700 rounded text-sm">{error}</div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 rounded bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}