"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Send, CheckCircle2, AlertCircle, MessageSquare, Upload, X } from "lucide-react";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  
  // Avatar / Company Logo State (Optional)
  const [avatar, setAvatar] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

  // Handle Avatar / Logo Upload to Cloudinary
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "feedback_avatars");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAvatar({ url: data.url, publicId: data.publicId });
      }
    } catch (err) {
      console.error("Avatar upload failed", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, designation, comment, rating, avatar }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ text: data.message, type: "success" });
        setName("");
        setDesignation("");
        setComment("");
        setRating(5);
        setAvatar(null);
      } else {
        setStatus({ text: data.message || "Failed to submit feedback", type: "error" });
      }
    } catch (err) {
      setStatus({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#090909] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        
        <div>
          <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <MessageSquare size={14} /> Share Your Experience
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Leave a <span className="text-lenux-emerald">Review</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-1">
            Worked with Lenux Production? We would love to hear your feedback!
          </p>
        </div>

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Your Name <span className="text-lenux-emerald">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nimal Perera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Designation / Company (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Director, ABC Company"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
              />
            </div>
          </div>

          {/* Star Rating Selector */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Rating
            </label>
            <div className="flex gap-2 bg-[#121212] border border-white/10 rounded-xl p-3 w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={22}
                    className={star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-600"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 🌟 Optional Profile Image / Company Logo Upload */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Profile Photo / Company Logo (Optional)
            </label>
            <div className="relative border border-dashed border-white/15 rounded-xl p-3 flex items-center justify-between hover:border-lenux-emerald/50 transition-all bg-[#121212]">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {avatar ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                    <Image src={avatar.url} alt="Avatar preview" fill className="object-cover" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold truncate flex-1">Photo Uploaded</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setAvatar(null); }}
                    className="p-1 text-gray-400 hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                  <Upload size={18} className="text-lenux-emerald shrink-0" />
                  <span>{uploadingAvatar ? "Uploading..." : "Upload photo or logo (Optional)"}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Your Review / Comment <span className="text-lenux-emerald">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Write about your experience with Lenux Production..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lenux-emerald transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploadingAvatar}
            className="w-full py-4 bg-lenux-emerald text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Submitting..." : (
              <>
                Submit Review <Send size={16} />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}