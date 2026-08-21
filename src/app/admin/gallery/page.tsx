"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash, Check, AlertCircle, ImageIcon } from "lucide-react";

export default function GalleryManagement() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Production");
  const [sortOrder, setSortOrder] = useState(0);
  
  // Multiple Images State
  const [selectedImages, setSelectedImages] = useState<{ url: string; publicId: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      if (data.success) {
        setGallery(data.data);
      }
    } catch (err) {
      console.error("Failed to load gallery", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchGallery();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // 🌟 Multiple Image Files Upload Handler
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("folder", "gallery_site");

        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          setSelectedImages((prev) => [...prev, { url: data.url, publicId: data.publicId }]);
        }
      }
      showNotification("All photos uploaded successfully!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Some photo uploads failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Gallery Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      showNotification("Please select and upload at least one photo.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          images: selectedImages, // 🌟 Array එකක් ලෙස යවයි
          sortOrder,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`${data.count} gallery photos added successfully!`, "success");
        setTitle("");
        setDescription("");
        setCategory("Production");
        setSortOrder(0);
        setSelectedImages([]);
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to save photos", "error");
    }
  };

  // Delete Gallery Item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Image deleted successfully!", "success");
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete image", "error");
    }
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
      <div>
        <h1 className="text-3xl font-bold text-lenux-deep">Gallery Management</h1>
        <p className="text-lenux-darkGray mt-1">Upload and manage visual showcase photos for the public gallery.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: GALLERY IMAGES GRID */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-lenux-deep mb-6">Uploaded Gallery Photos ({gallery.length})</h3>
          
          {gallery.length === 0 ? (
            <p className="text-gray-400 text-sm">No gallery photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((item) => (
                <div key={item._id} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 flex flex-col justify-between group">
                  <div className="relative w-full h-44 bg-gray-200">
                    <Image src={item.image.url} alt={item.title || "Gallery"} fill className="object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/70 text-lenux-emerald text-[10px] font-bold uppercase rounded-full backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-lenux-charcoal text-sm truncate">{item.title || "Untitled"}</h4>
                    {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
                  </div>
                  <div className="p-3 bg-white border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: MULTIPLE UPLOAD FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-lg font-bold text-lenux-deep">Upload Gallery Photos</h3>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Common Title (Optional)</label>
              <input type="text" className="admin-input" placeholder="e.g., Exhibition Works" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Category</label>
              <select className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Production">Production</option>
                <option value="Printing">Printing</option>
                <option value="Branding">Branding</option>
                <option value="Events">Events</option>
                <option value="Behind The Scenes">Behind The Scenes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Display Order</label>
              <input type="number" className="admin-input" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Description (Optional)</label>
              <textarea rows={2} className="admin-input" placeholder="Short description..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* 🌟 Multiple Image Selection & Previews */}
            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Select Photos (Multiple)</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all mb-3">
                {/* 🌟 multiple attribute එක එකතු කර ඇත */}
                <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMultipleImageUpload} />
                <div className="text-center text-gray-400">
                  <ImageIcon size={24} className="mx-auto mb-1 text-lenux-emerald" />
                  <span className="text-xs font-semibold">{uploading ? "Uploading files..." : "Click to select multiple photos"}</span>
                </div>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 border border-gray-100 p-2 rounded-xl bg-gray-50 max-h-36 overflow-y-auto">
                  {selectedImages.map((img, i) => (
                    <div key={i} className="relative w-full h-14 bg-white rounded-lg border border-gray-200 group overflow-hidden">
                      <Image src={img.url} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeSelectedImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      >
                        <Trash size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary w-full gap-2 text-sm mt-4">
              <Plus size={16} /> Save All to Gallery
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}