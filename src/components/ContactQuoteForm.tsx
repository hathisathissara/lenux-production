"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

interface ContactQuoteFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  services: any[];
}

export default function ContactQuoteForm({ services }: ContactQuoteFormProps) {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [requiredService, setRequiredService] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          companyName,
          phoneNumber,
          email, // Optional
          requiredService,
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({
          text: "Thank you! Your quotation request has been submitted successfully. Our team will contact you shortly.",
          type: "success",
        });

        // Reset fields
        setFullName(""); 
        setCompanyName(""); 
        setPhoneNumber(""); 
        setEmail("");
        setRequiredService(""); 
        setMessage("");
      } else {
        setStatus({ text: data.message || "Failed to submit request.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#090909] border border-white/10 rounded-[2.5rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-80 h-80 bg-lenux-emerald/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="space-y-6 relative z-10">
        <div>
          <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Sparkles size={14} /> Instant Quotation
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Request a <span className="text-lenux-emerald">Free Quote</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-1">
            Fill out the form below and we will get back to you with custom pricing.
          </p>
        </div>

        {status.text && (
          <div className={`p-4 rounded-2xl flex items-start gap-3 border text-xs sm:text-sm ${
            status.type === "success" 
            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" 
            : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}>
            <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" />
            <span>{status.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Your Name <span className="text-lenux-emerald">*</span>
              </label>
              <input type="text" required placeholder="e.g. Kasun Perera" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Company Name <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input type="text" placeholder="e.g. Abans Group" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all" />
            </div>
          </div>

          {/* Row 2: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                WhatsApp / Phone Number <span className="text-lenux-emerald">*</span>
              </label>
              <input type="tel" required placeholder="e.g. 077 123 4567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input type="email" placeholder="e.g. kasun@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all" />
            </div>
          </div>

          {/* Row 3: Service Required */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Service Required <span className="text-lenux-emerald">*</span>
            </label>
            <select required value={requiredService} onChange={(e) => setRequiredService(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-lenux-emerald transition-all">
              <option value="">Select a Service</option>
              {services.map((s) => (
                <option key={s._id} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Row 4: Message */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Project Description / Requirements <span className="text-lenux-emerald">*</span>
            </label>
            <textarea rows={4} required placeholder="Write details about your required project..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all" />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-lenux-emerald text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl shadow-lenux-emerald/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Submitting Request..." : "Submit Quotation Request"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}