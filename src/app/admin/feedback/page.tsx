"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, AlertCircle, Trash, Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

export default function FeedbackManagement() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    // eslint-disable-next-line
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
      console.error(err);
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
      console.error(err);
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
        <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-lenux-darkGray uppercase tracking-wider">
                <th className="p-4 font-bold w-20">Avatar</th>
                <th className="p-4 font-bold">Client Info</th>
                <th className="p-4 font-bold">Feedback</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {feedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                <tr key={item._id} className={`transition-colors ${item.isApproved ? "hover:bg-gray-50/50" : "bg-gray-50/30 opacity-85 hover:opacity-100"}`}>
                  <td className="p-4 align-top">
                    <div className="relative w-11 h-11 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                      <Image 
                        src={item.avatar?.url || "/images/default-avatar.png"} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <h4 className="font-bold text-lenux-charcoal text-sm">{item.name}</h4>
                    {item.designation && (
                      <p className="text-xs text-lenux-darkGray mt-0.5">{item.designation}</p>
                    )}
                  </td>
                  <td className="p-4 align-top max-w-sm">
                    <div className="space-y-1.5">
                      {renderStars(item.rating)}
                      <p className="text-sm text-lenux-charcoal leading-relaxed italic line-clamp-3">
                        &quot;{item.comment}&quot;
                      </p>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.isApproved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {item.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="p-4 align-top text-right space-x-1 whitespace-nowrap">
                    <button 
                      onClick={() => handleToggleApprove(item._id, item.isApproved)}
                      className={`inline-flex items-center justify-center p-2 rounded-lg transition-all ${
                        item.isApproved 
                        ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50" 
                        : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                      }`}
                      title={item.isApproved ? "Reject Feedback" : "Approve Feedback"}
                    >
                      {item.isApproved ? <ThumbsDown size={16} /> : <ThumbsUp size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteFeedback(item._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all inline-flex items-center justify-center"
                      title="Delete Feedback"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {Math.ceil(feedbacks.length / itemsPerPage) > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/30">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 font-semibold bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
                Page {currentPage} of {Math.ceil(feedbacks.length / itemsPerPage)}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(feedbacks.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(feedbacks.length / itemsPerPage)}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}