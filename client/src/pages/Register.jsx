import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors && typeof data.fieldErrors === "object") {
          setFieldErrors(data.fieldErrors);
        }
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Optional: store token, then redirect
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // After successful registration, go to login or dashboard
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-neutral-900 p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-700 rounded text-sm">{error}</div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm">Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 rounded bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}