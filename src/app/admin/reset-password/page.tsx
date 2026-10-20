"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!token) {
      setMessage({ text: "Invalid or missing reset token link. Please request a new link.", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ text: data.message + " Redirecting to login...", type: "success" });
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      } else {
        setMessage({ text: data.message || "Failed to reset password", type: "error" });
      }
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border-t-4 border-lenux-emerald space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 bg-lenux-soft text-lenux-deep rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
          <KeyRound size={28} />
        </div>
        <h2 className="text-2xl font-bold text-lenux-charcoal">Set New Password</h2>
        <p className="text-xs text-lenux-darkGray mt-1">
          Enter your new secure password below to access the admin portal.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-start gap-2.5 text-xs ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
            : "bg-red-50 text-red-600 border border-red-200"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="admin-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="admin-input text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3.5 disabled:opacity-60"
        >
          {loading ? "Resetting Password..." : "Update Password & Login"}
        </button>

        <div className="text-center pt-2">
          <Link href="/admin/login" className="text-xs text-lenux-darkGray hover:text-lenux-emerald font-semibold">
            Cancel & Return to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lenux-offWhite px-4 relative font-sans">
      {/* Back to Login Button */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/admin/login" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lenux-darkGray hover:text-lenux-emerald transition-colors bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-200"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl text-center text-sm text-lenux-darkGray">
          Loading reset form...
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}