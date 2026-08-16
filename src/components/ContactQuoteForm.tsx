"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Upload, CheckCircle2, AlertCircle, Sparkles, X, FileText } from "lucide-react";

interface ContactQuoteFormProps {
  services: any[];
}

export default function ContactQuoteForm({ services }: ContactQuoteFormProps) {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [requiredService, setRequiredService] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  // File Attachment State
  const [fileAttachment, setFileAttachment] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

  // Handle Reference File Upload to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "quotes_attachments");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setFileAttachment({ url: data.url, publicId: data.publicId });
      }
    } catch (err) {
      console.error("File upload failed", err);
    } finally {
      setUploadingFile(false);
    }
  };

  // Submit Quotation Request Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      const payload = {
        fullName,
        companyName,
        phoneNumber,
        email,
        requiredService: requiredService || "General Advertising Inquiry",
        quantity,
        preferredDeliveryDate: preferredDeliveryDate || undefined,
        budget,
        message,
        fileAttachment,
      };

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({
          text: "Thank you! Your quotation request has been submitted successfully. Our team will contact you shortly.",
          type: "success",
        });

        // Reset Form Fields
        setFullName("");
        setCompanyName("");
        setPhoneNumber("");
        setEmail("");
        setRequiredService("");
        setQuantity("");
        setPreferredDeliveryDate("");
        setBudget("");
        setMessage("");
        setFileAttachment(null);
      } else {
        setStatus({ text: data.message || "Failed to submit request.", type: "error" });
      }
    } catch (err) {
      setStatus({ text: "Something went wrong. Please try again or WhatsApp us directly.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#090909] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
      
      {/* Decorative ambient top glow */}
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
            Fill out the project details below and we will get back to you with custom pricing.
          </p>
        </div>

        {/* Feedback Alert Message */}
        {status.text && (
          <div className={`p-4 rounded-2xl flex items-start gap-3 border text-xs sm:text-sm ${
            status.type === "success" 
            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" 
            : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}>
            {status.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />}
            <span>{status.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-lenux-emerald">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Perera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Company Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Abans Group"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
          </div>

          {/* Row 2: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Phone / WhatsApp <span className="text-lenux-emerald">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 077 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-lenux-emerald">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. kasun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
          </div>

          {/* Row 3: Required Service & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Required Service <span className="text-lenux-emerald">*</span>
              </label>
              <select
                required
                value={requiredService}
                onChange={(e) => setRequiredService(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-lenux-emerald transition-all"
              >
                <option value="">Select a Service</option>
                {services.map((s) => (
                  <option key={s._id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Vehicle Branding">Vehicle Branding</option>
                <option value="Signboards & Light Boards">Signboards & Light Boards</option>
                <option value="Digital / Flex Printing">Digital / Flex Printing</option>
                <option value="Custom Graphic Design">Custom Graphic Design</option>
                <option value="Other Production Service">Other Production Service</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Estimated Quantity
              </label>
              <input
                type="text"
                placeholder="e.g. 5 Vans / 1000 Leaflets / 10x4 ft Board"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
          </div>

          {/* Row 4: Preferred Date & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Required Delivery Date
              </label>
              <input
                type="date"
                value={preferredDeliveryDate}
                onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-300 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Estimated Budget (LKR)
              </label>
              <input
                type="text"
                placeholder="e.g. 50,000 - 100,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Project Description / Specifications <span className="text-lenux-emerald">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide dimensions, materials, UV finishing requirements or details about your project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
            />
          </div>

          {/* Optional Reference Upload */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Attach Reference Artwork / Image (Optional)
            </label>
            <div className="relative border border-dashed border-white/15 rounded-xl p-4 flex items-center justify-between hover:border-lenux-emerald/50 transition-all bg-[#0f0f0f]">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {fileAttachment ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <Image src={fileAttachment.url} alt="Attachment" fill className="object-cover" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold truncate flex-1">Reference Ready</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFileAttachment(null); }}
                    className="p-1 text-gray-400 hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                  <Upload size={18} className="text-lenux-emerald shrink-0" />
                  <span>{uploadingFile ? "Uploading to Cloud..." : "Upload sample design, logo or sketch (PNG/JPG)"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || uploadingFile}
              className="w-full py-4 bg-lenux-emerald text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl shadow-lenux-emerald/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Submitting Request..." : (
                <>
                  Submit Quotation Request <Send size={16} />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}