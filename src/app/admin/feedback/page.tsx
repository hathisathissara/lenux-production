"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, AlertCircle, Trash, Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (err) {
      console.error("Failed to load feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Toggle Approval Status (Approve / Reject)
  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message, "success");
        fetchFeedbacks();
      }
    } catch (err) {
      showNotification("Failed to update status", "error");
    }
  };

  // Delete Feedback
  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback permanently?")) return;

    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Feedback deleted!", "success");
        fetchFeedbacks();
      }
    } catch (err) {
      showNotification("Failed to delete feedback", "error");
    }
  };

  // Star Rating Render Helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} 
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lenux-emerald"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-lenux-deep">Customer Feedback</h1>
        <p className="text-lenux-darkGray mt-1">Review and approve customer testimonials to display on the website.</p>
      </div>

      {/* Notifications */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* List Grid */}
      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
          <MessageSquare size={48} className="mx-auto mb-3 opacity-50 text-lenux-deep" />
          <p className="text-sm font-medium">No customer feedback received yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((item) => (
            <div 
              key={item._id} 
              className={`bg-white p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                item.isApproved 
                ? "border-emerald-100 shadow-sm hover:shadow-md" 
                : "border-gray-200 bg-gray-50/30 shadow-none opacity-85"
              }`}
            >
              <div className="space-y-4">
                {/* Header info (Avatar + Name) */}
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-gray-100">
                    <Image 
                      src={item.avatar?.url || "/images/default-avatar.png"} // Default avatar if client hasn't added one
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lenux-charcoal text-sm">{item.name}</h4>
                    {item.designation && (
                      <p className="text-xs text-lenux-darkGray">{item.designation}</p>
                    )}
                  </div>
                </div>

                {/* Rating and Comment */}
                <div className="space-y-2">
                  {renderStars(item.rating)}
                  <p className="text-sm text-lenux-charcoal leading-relaxed italic">
                    "{item.comment}"
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                {/* Status Indicator */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.isApproved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {item.isApproved ? "Approved" : "Pending Review"}
                </span>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggleApprove(item._id, item.isApproved)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      item.isApproved 
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100" 
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {item.isApproved ? (
                      <><ThumbsDown size={14} /> Reject</>
                    ) : (
                      <><ThumbsUp size={14} /> Approve</>
                    )}
                  </button>

                  <button 
                    onClick={() => handleDeleteFeedback(item._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}