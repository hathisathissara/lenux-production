"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, Eye, Trash, X, Calendar, Phone, Mail, Building, FileText, ChevronRight } from "lucide-react";

export default function QuotesManagement() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [statusInput, setStatusInput] = useState("");
  const [adminNotesInput, setAdminNotesInput] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      if (data.success) {
        setQuotes(data.data);
        setFilteredQuotes(data.data);
      }
    } catch (err) {
      console.error("Failed to load quotes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Filtering Logic
  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredQuotes(quotes);
    } else {
      setFilteredQuotes(quotes.filter(q => q.status === activeFilter));
    }
  }, [activeFilter, quotes]);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Open Modal with selected Quote details
  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setStatusInput(quote.status);
    setAdminNotesInput(quote.adminNotes || "");
  };

  // Save Status & Notes
  const handleUpdateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    try {
      const res = await fetch(`/api/quotes/${selectedQuote._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusInput, adminNotes: adminNotesInput })
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Quotation updated successfully!", "success");
        setSelectedQuote(null);
        fetchQuotes();
      }
    } catch (err) {
      showNotification("Failed to update quotation", "error");
    }
  };

  // Delete Quote Request
  const handleDeleteQuote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote request?")) return;

    try {
      const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Quote request deleted successfully!", "success");
        fetchQuotes();
      }
    } catch (err) {
      showNotification("Failed to delete quote request", "error");
    }
  };

  // Status Colors Helper
  const getStatusBadge = (status: string) => {
    const badges: any = {
      New: "bg-blue-100 text-blue-800",
      Contacted: "bg-purple-100 text-purple-800",
      Quoted: "bg-amber-100 text-amber-800",
      "In Progress": "bg-indigo-100 text-indigo-800",
      Completed: "bg-emerald-100 text-emerald-800",
      Cancelled: "bg-red-100 text-red-800"
    };
    return `px-2.5 py-1 text-xs font-semibold rounded-full ${badges[status] || "bg-gray-100 text-gray-800"}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lenux-emerald"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-lenux-deep">Quotation Requests</h1>
        <p className="text-lenux-darkGray mt-1">Manage customer quotes, requirements, and project orders.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        {["All", "New", "Contacted", "Quoted", "In Progress", "Completed", "Cancelled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all ${
              activeFilter === filter 
              ? "bg-lenux-emerald text-white shadow-sm" 
              : "bg-white text-lenux-darkGray border border-gray-100 hover:border-lenux-emerald"
            }`}
          >
            {filter}
          </button>
        ))}
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

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredQuotes.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-50 text-lenux-deep" />
            <p className="text-sm font-medium">No quote requests found in this status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <div className="overflow-x-auto whitespace-nowrap">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-lenux-darkGray uppercase font-bold bg-gray-50/50">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Required Service</th>
                  <th className="p-4">Date Received</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50/50 transition-all">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-lenux-charcoal">{quote.fullName}</p>
                        {quote.email && <p className="text-xs text-gray-400">{quote.email}</p>}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-lenux-deep">{quote.requiredService}</td>
                    <td className="p-4 text-lenux-darkGray">{new Date(quote.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={getStatusBadge(quote.status)}>{quote.status}</span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleViewQuote(quote)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lenux-soft text-lenux-deep hover:bg-lenux-emerald hover:text-white rounded-lg text-xs font-bold transition-all"
                      >
                        <Eye size={14} /> Review
                      </button>
                      <button 
                        onClick={() => handleDeleteQuote(quote._id)}
                        className="inline-flex items-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Quote"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>

      {/* DETAIL VIEW MODAL (Updated Clean Version) */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-lenux-deep text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-lenux-soft">Quotation Request Details</span>
                <h3 className="text-xl font-bold">{selectedQuote.fullName}</h3>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-lenux-soft/20 p-4 rounded-xl border border-lenux-soft/30 text-xs">
                {selectedQuote.companyName && (
                  <p className="flex items-center gap-2"><Building size={14} className="text-lenux-deep" /> <span className="font-semibold">Company:</span> {selectedQuote.companyName}</p>
                )}
                <p className="flex items-center gap-2"><Phone size={14} className="text-lenux-deep" /> <span className="font-semibold">Phone/WhatsApp:</span> {selectedQuote.phoneNumber}</p>
                {selectedQuote.email && (
                  <p className="flex items-center gap-2"><Mail size={14} className="text-lenux-deep" /> <span className="font-semibold">Email:</span> {selectedQuote.email}</p>
                )}
                <p className="flex items-center gap-2"><Calendar size={14} className="text-lenux-deep" /> <span className="font-semibold">Date Received:</span> {new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Requirement Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-lenux-deep uppercase tracking-wide">Project Scope</h4>
                <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm text-lenux-charcoal">
                  <p><span className="font-semibold">Requested Service:</span> {selectedQuote.requiredService}</p>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <p className="font-semibold text-xs text-lenux-darkGray mb-1">Message / Requirements:</p>
                    <p className="italic bg-white p-3 rounded border border-gray-100 whitespace-pre-line">{selectedQuote.message}</p>
                  </div>
                </div>
              </div>

              {/* Admin Panel Actions */}
              <form onSubmit={handleUpdateQuote} className="border-t border-gray-100 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-lenux-deep uppercase tracking-wide">Manage Status & Admin Notes</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Update Status</label>
                    <select className="admin-input py-1 text-sm" value={statusInput} onChange={(e) => setStatusInput(e.target.value)}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Quoted">Quoted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Internal Admin Notes</label>
                  <textarea rows={3} className="admin-input py-2 text-sm" placeholder="Write internal notes here..." value={adminNotesInput} onChange={(e) => setAdminNotesInput(e.target.value)} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setSelectedQuote(null)} className="px-4 py-2 border border-gray-200 text-lenux-darkGray text-xs font-bold rounded-xl hover:bg-gray-50">Close</button>
                  <button type="submit" className="btn-primary py-2 text-xs font-bold rounded-xl">Save Changes</button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}