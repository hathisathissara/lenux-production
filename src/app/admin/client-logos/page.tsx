"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Upload,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Building2,
  Search,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

interface ClientLogoItem {
  _id: string;
  companyName: string;
  logo: string;
  logoPublicId?: string;
  websiteUrl?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export default function ClientLogosPage() {
  const [logos, setLogos] = useState<ClientLogoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<ClientLogoItem | null>(null);

  // Add Form state
  const [formName, setFormName] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formOrder, setFormOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formLogo, setFormLogo] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit Form state
  const [editName, setEditName] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editLogo, setEditLogo] = useState<{ url: string; publicId: string } | null>(null);
  const [editUploadingLogo, setEditUploadingLogo] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Delete confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<ClientLogoItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchLogos = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/client-logos");
      const data = await res.json();
      if (data.success) {
        setLogos(data.data);
      } else {
        showNotification(data.message || "Failed to load client logos", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error loading client logos", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/admin/client-logos")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.success) {
            setLogos(data.data);
          } else {
            showNotification(data.message || "Failed to load client logos", "error");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) {
          showNotification("Error loading client logos", "error");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Upload image to Cloudinary via /api/admin/upload
  const uploadImage = async (file: File): Promise<{ url: string; publicId: string } | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "client_logos");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      return { url: data.url, publicId: data.publicId };
    } else {
      throw new Error(data.message || "Image upload failed");
    }
  };

  // Add Form Upload Handler
  const handleAddUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const uploaded = await uploadImage(file);
      if (uploaded) {
        setFormLogo(uploaded);
        showNotification("Logo uploaded successfully!", "success");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload logo";
      showNotification(errorMsg, "error");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Edit Form Upload Handler
  const handleEditUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditUploadingLogo(true);
    try {
      const uploaded = await uploadImage(file);
      if (uploaded) {
        setEditLogo(uploaded);
        showNotification("New logo uploaded!", "success");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload logo";
      showNotification(errorMsg, "error");
    } finally {
      setEditUploadingLogo(false);
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    }
  };

  // Submit New Logo
  const handleCreateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification("Company name is required", "error");
      return;
    }
    if (!formLogo?.url) {
      showNotification("Please upload a logo image", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/client-logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formName,
          logo: formLogo.url,
          logoPublicId: formLogo.publicId,
          websiteUrl: formWebsite,
          isActive: formIsActive,
          order: formOrder,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Client logo added successfully!", "success");
        setIsAddModalOpen(false);
        // Reset form
        setFormName("");
        setFormWebsite("");
        setFormOrder(0);
        setFormIsActive(true);
        setFormLogo(null);
        fetchLogos();
      } else {
        showNotification(data.message || "Failed to add logo", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to create client logo", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: ClientLogoItem) => {
    setEditingLogo(item);
    setEditName(item.companyName);
    setEditWebsite(item.websiteUrl || "");
    setEditOrder(item.order);
    setEditIsActive(item.isActive);
    setEditLogo({ url: item.logo, publicId: item.logoPublicId || "" });
  };

  // Submit Edit
  const handleUpdateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogo) return;

    if (!editName.trim()) {
      showNotification("Company name is required", "error");
      return;
    }
    if (!editLogo?.url) {
      showNotification("Logo image is required", "error");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/client-logos/${editingLogo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: editName,
          logo: editLogo.url,
          logoPublicId: editLogo.publicId,
          websiteUrl: editWebsite,
          isActive: editIsActive,
          order: editOrder,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Client logo updated successfully!", "success");
        setEditingLogo(null);
        fetchLogos();
      } else {
        showNotification(data.message || "Failed to update logo", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to update client logo", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Quick Toggle Active/Inactive
  const toggleActiveStatus = async (item: ClientLogoItem) => {
    try {
      const res = await fetch(`/api/admin/client-logos/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setLogos((prev) =>
          prev.map((l) => (l._id === item._id ? { ...l, isActive: !item.isActive } : l))
        );
        showNotification(
          `${item.companyName} is now ${!item.isActive ? "Active" : "Inactive"}`,
          "success"
        );
      } else {
        showNotification(data.message || "Failed to toggle status", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error toggling status", "error");
    }
  };

  // Delete Logo
  const handleDeleteLogo = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/client-logos/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Client logo deleted successfully!", "success");
        setDeleteTarget(null);
        fetchLogos();
      } else {
        showNotification(data.message || "Failed to delete logo", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error deleting client logo", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filteredLogos = logos.filter((item) =>
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium transition-all transform animate-in fade-in slide-in-from-top-4 ${
            notification.type === "success"
              ? "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
              : "bg-red-950 border border-red-500/40 text-red-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-lenux-charcoal mt-1">
            Client Logos & Partners
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage &quot;Trusted By&quot; company logos displayed automatically on the homepage.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-lenux-emerald text-white rounded-xl font-semibold text-sm hover:bg-lenux-dark transition-all duration-200 shadow-md shadow-lenux-emerald/20 shrink-0"
        >
          <Plus size={18} />
          <span>Add Client Logo</span>
        </button>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lenux-emerald/30 focus:border-lenux-emerald"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-600 self-end sm:self-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Active: <strong>{logos.filter((l) => l.isActive).length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            Inactive: <strong>{logos.filter((l) => !l.isActive).length}</strong>
          </span>
          <span>
            Total: <strong>{logos.length}</strong>
          </span>
        </div>
      </div>

      {/* Logos Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl border border-gray-100 p-8">
          <Loader2 className="w-10 h-10 text-lenux-emerald animate-spin" />
          <p className="text-sm text-gray-500 mt-3 font-medium">Loading client logos...</p>
        </div>
      ) : filteredLogos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-lenux-soft flex items-center justify-center text-lenux-deep mb-4">
            <Building2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-lenux-charcoal">No Client Logos Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-1 mb-5">
            {searchQuery
              ? `No client logos matching "${searchQuery}".`
              : "You haven't added any client or partner logos yet. Add your first logo to display on the homepage."}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-lenux-emerald text-white rounded-xl text-sm font-semibold hover:bg-lenux-dark transition-colors"
          >
            <Plus size={16} /> Add First Logo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLogos.map((item) => (
            <div
              key={item._id}
              className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                item.isActive ? "border-gray-200 hover:border-lenux-emerald/50" : "border-gray-200/60 opacity-75"
              }`}
            >
              <div>
                {/* Logo Image Preview Container (Darker backdrop so white/colored logos pop) */}
                <div className="relative h-36 bg-[#111] border-b border-gray-100 flex items-center justify-center p-6 overflow-hidden">
                  <Image
                    src={item.logo}
                    alt={item.companyName}
                    width={180}
                    height={80}
                    className="max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Status badge in top-right */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                        item.isActive
                          ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 backdrop-blur-sm"
                          : "bg-gray-800/80 border border-gray-600/40 text-gray-400 backdrop-blur-sm"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isActive ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
                        }`}
                      />
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Display Order badge top-left */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-white/80 text-[10px] font-mono border border-white/10">
                      Order: {item.order}
                    </span>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-5 space-y-2">
                  <h4 className="font-bold text-base text-lenux-charcoal line-clamp-1">
                    {item.companyName}
                  </h4>

                  {item.websiteUrl ? (
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-lenux-emerald hover:underline line-clamp-1"
                    >
                      <ExternalLink size={12} />
                      <span className="truncate">{item.websiteUrl}</span>
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No website link</p>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleActiveStatus(item)}
                  title={item.isActive ? "Click to set Inactive" : "Click to set Active"}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                    item.isActive
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-200/70"
                      : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  {item.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{item.isActive ? "Hide" : "Show"}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-gray-500 hover:text-lenux-emerald hover:bg-lenux-soft/40 rounded-lg transition-colors"
                    title="Edit logo"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete logo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          ADD LOGO MODAL
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-lenux-soft text-lenux-deep">
                  <Building2 size={18} />
                </div>
                <h3 className="text-lg font-bold text-lenux-charcoal">Add New Client Logo</h3>
              </div>
              <button
                onClick={() => !submitting && setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLogo} className="p-6 space-y-5">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation, Brand Lanka"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="admin-input"
                />
              </div>

              {/* Logo Upload via Cloudinary */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Logo Image (Cloudinary) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  {formLogo ? (
                    <div className="relative rounded-xl border border-gray-200 bg-[#111] p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={formLogo.url}
                          alt="Logo Preview"
                          width={100}
                          height={50}
                          className="h-12 w-auto object-contain"
                        />
                        <span className="text-xs text-gray-300 font-mono">Logo ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormLogo(null)}
                        className="p-1.5 text-red-400 hover:text-red-200 rounded-lg hover:bg-red-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => !uploadingLogo && fileInputRef.current?.click()}
                      className={`cursor-pointer border-2 border-dashed border-gray-300 hover:border-lenux-emerald rounded-xl p-6 text-center transition-all bg-gray-50/50 hover:bg-lenux-soft/10 ${
                        uploadingLogo ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAddUpload}
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        className="hidden"
                      />
                      {uploadingLogo ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Loader2 className="w-8 h-8 text-lenux-emerald animate-spin" />
                          <p className="text-xs font-semibold text-gray-600">
                            Uploading to Cloudinary...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="w-10 h-10 rounded-full bg-lenux-soft text-lenux-deep flex items-center justify-center mx-auto mb-2">
                            <Upload size={18} />
                          </div>
                          <p className="text-xs font-bold text-gray-700">
                            Click to upload logo image
                          </p>
                          <p className="text-[11px] text-gray-400">
                            PNG, SVG, or WebP with transparent background recommended
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  className="admin-input"
                />
              </div>

              {/* Display Order and Active Toggle in one row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value) || 0)}
                    className="admin-input"
                    placeholder="0"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Lower numbers appear first</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Active Status
                  </label>
                  <label className="flex items-center gap-3 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 text-lenux-emerald rounded focus:ring-lenux-emerald"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      {formIsActive ? "Visible on site" : "Hidden"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingLogo}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-lenux-emerald text-white hover:bg-lenux-dark transition-colors disabled:opacity-50 shadow-md shadow-lenux-emerald/20"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  <span>Save Logo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT LOGO MODAL
          ======================================================== */}
      {editingLogo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-lenux-soft text-lenux-deep">
                  <Edit2 size={18} />
                </div>
                <h3 className="text-lg font-bold text-lenux-charcoal">Edit Client Logo</h3>
              </div>
              <button
                onClick={() => !updating && setEditingLogo(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateLogo} className="p-6 space-y-5">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="admin-input"
                />
              </div>

              {/* Logo Preview & Replacement */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Logo Image (Cloudinary) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {editLogo && (
                    <div className="relative rounded-xl border border-gray-200 bg-[#111] p-4 flex items-center justify-between">
                      <Image
                        src={editLogo.url}
                        alt="Current Logo"
                        width={120}
                        height={50}
                        className="h-12 w-auto object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        disabled={editUploadingLogo}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={handleEditUpload}
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                  />

                  {editUploadingLogo && (
                    <div className="flex items-center gap-2 text-xs text-lenux-emerald">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading new image to Cloudinary...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="admin-input"
                />
              </div>

              {/* Display Order and Active Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editOrder}
                    onChange={(e) => setEditOrder(Number(e.target.value) || 0)}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Active Status
                  </label>
                  <label className="flex items-center gap-3 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="w-4 h-4 text-lenux-emerald rounded focus:ring-lenux-emerald"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      {editIsActive ? "Visible on site" : "Hidden"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setEditingLogo(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating || editUploadingLogo}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-lenux-emerald text-white hover:bg-lenux-dark transition-colors disabled:opacity-50 shadow-md shadow-lenux-emerald/20"
                >
                  {updating && <Loader2 size={16} className="animate-spin" />}
                  <span>Update Logo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRM MODAL
          ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-gray-900">Delete Client Logo?</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to remove <strong>{deleteTarget.companyName}</strong>? This
                will also delete the image from Cloudinary.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDeleteLogo}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-md shadow-red-600/20"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
