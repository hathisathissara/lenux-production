"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ text: data.message, type: "success" });
      } else {
        setMessage({ text: data.message || "Failed to send reset link", type: "error" });
      }
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lenux-offWhite px-4 relative font-sans">
      
      {/* Back to Login */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/admin/login" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lenux-darkGray hover:text-lenux-emerald transition-colors bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-200"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border-t-4 border-lenux-emerald space-y-6">
        
        <div className="text-center">
          <div className="w-14 h-14 bg-lenux-soft text-lenux-deep rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Mail size={28} />
          </div>
          <h2 className="text-2xl font-bold text-lenux-charcoal">Forgot Password?</h2>
          <p className="text-xs text-lenux-darkGray mt-1">
            Enter your registered admin email and we will send you a secure password reset link.
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

        <form onSubmit={handleSendLink} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@lenux.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3.5 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? "Sending Reset Link..." : <>Send Reset Link <Send size={15} /></>}
          </button>
        </form>

      </div>
    </div>
  );
}