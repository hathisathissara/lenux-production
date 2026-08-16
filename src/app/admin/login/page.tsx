"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Login හරිනම් Dashboard එකට යවනවා
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lenux-offWhite px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border-t-4 border-lenux-emerald">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lenux-deep uppercase tracking-wider">Lenux</h1>
          <p className="text-sm text-lenux-darkGray tracking-widest mt-1">PRODUCTION</p>
          <h2 className="text-xl mt-6 text-lenux-charcoal">Admin Login</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-lenux-darkGray mb-2">Email Address</label>
            <input
              type="email"
              required
              className="admin-input"
              placeholder="admin@lenux.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-lenux-darkGray mb-2">Password</label>
            <input
              type="password"
              required
              className="admin-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>

      </div>
    </div>
  );
}