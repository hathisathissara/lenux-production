"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, AlertCircle, Clock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const router = useRouter();

  // Active countdown timer when locked out
  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;

    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setError("");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLocked = lockoutSeconds !== null && lockoutSeconds > 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

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
        // 🌟 Redirect back to the original page if callbackUrl exists, otherwise /admin
        const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const callbackUrl = params?.get("callbackUrl") || "/admin";
        router.push(callbackUrl);
        router.refresh();
      } else {
        if (data.isLocked) {
          const secs = data.remainingSeconds || (data.remainingMinutes ? data.remainingMinutes * 60 : 900);
          setLockoutSeconds(secs);
          setRemainingAttempts(0);
        } else if (typeof data.remainingAttempts === "number") {
          setRemainingAttempts(data.remainingAttempts);
        }
        setError(data.message || "Invalid login credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lenux-offWhite px-4 relative font-sans">
      
      {/* 🌟 Back to Home Button (top-left) */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lenux-darkGray hover:text-lenux-emerald transition-colors bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-200"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border-t-4 border-lenux-emerald">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lenux-deep uppercase tracking-wider">Lenux</h1>
          <p className="text-xs text-lenux-darkGray tracking-widest mt-1">PRODUCTION</p>
          <h2 className="text-xl mt-6 text-lenux-charcoal font-semibold">Admin Login</h2>
        </div>

        {/* Lockout Warning Banner */}
        {isLocked && lockoutSeconds !== null && (
          <div className="bg-amber-50 text-amber-900 p-4 rounded-xl mb-6 text-sm border border-amber-300 flex items-start gap-3 shadow-sm">
            <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-amber-950">Too Many Failed Attempts</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Access is temporarily restricted for security. Please wait before trying again:
              </p>
              <div className="mt-2.5 flex items-center gap-2 font-mono font-bold text-amber-950 bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-300 w-fit">
                <Clock size={16} className="text-amber-700 animate-pulse" />
                <span>{formatCountdown(lockoutSeconds)}</span>
              </div>
            </div>
          </div>
        )}

        {/* General / Credentials Error Message */}
        {!isLocked && error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-xl mb-4 text-sm border border-red-200 flex items-start gap-2.5">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{error}</p>
              {remainingAttempts !== null && remainingAttempts > 0 && remainingAttempts <= 3 && (
                <p className="text-xs font-semibold text-red-600 mt-1">
                  ⚠️ Caution: {remainingAttempts} {remainingAttempts === 1 ? "attempt" : "attempts"} remaining before temporary lockout.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-lenux-darkGray mb-2 font-medium">Email Address</label>
            <input
              type="email"
              required
              disabled={isLocked || loading}
              className="admin-input disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="admin@lenux.lk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error && !isLocked) setError("");
              }}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-lenux-darkGray font-medium">Password</label>
              {/* 🌟 Forgot Password Link */}
              <Link 
                href="/admin/forgot-password" 
                className="text-xs text-lenux-emerald hover:underline font-semibold transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              disabled={isLocked || loading}
              className="admin-input disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error && !isLocked) setError("");
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLocked
              ? `Locked (${formatCountdown(lockoutSeconds || 0)})`
              : loading
              ? "Signing in..."
              : "Login to Dashboard"}
          </button>
        </form>

      </div>

    </div>
  );
}