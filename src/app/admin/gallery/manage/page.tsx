"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash, Check, AlertCircle, ImageIcon, ArrowLeft } from "lucide-react";

interface CategoryItem {
  _id: string;
  name: string;
}

export default function GalleryManageUploadPage() {
  const router = useRouter();
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Production");
  const [sortOrder, setSortOrder] = useState(0);
  
  // Multiple Images State
  const [selectedImages, setSelectedImages] = useState<{ url: string; publicId: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setCategoriesList(data.data);
          setCategory(data.data[0].name);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // 🌟 Multiple Image Files Upload Handler to Cloudinary
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
      showNotification("All selected photos uploaded to Cloudinary successfully!", "success");
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

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      showNotification("Please select and upload at least one photo.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          images: selectedImages,
          sortOrder,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`${data.count} gallery photos saved successfully! Redirecting...`, "success");
        setTimeout(() => {
          router.push("/admin/gallery");
          router.refresh();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to save photos", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-lenux-deep mb-2 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Gallery List
          </Link>
          <h1 className="text-3xl font-bold text-lenux-deep">Upload Gallery Photos</h1>
          <p className="text-lenux-darkGray mt-1">Select and upload single or multiple photos to the visual gallery.</p>
        </div>
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

      {/* Upload Form Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
              Common Title <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="e.g., Outdoor Signboard Installation" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                Category
              </label>
              <select 
                className="admin-input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                disabled={loadingCategories}
              >
                {categoriesList.length === 0 && <option value="Production">Production</option>}
                {categoriesList.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                Display Order
              </label>
              <input 
                type="number" 
                className="admin-input" 
                value={sortOrder} 
                onChange={(e) => setSortOrder(Number(e.target.value))} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
              Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea 
              rows={3} 
              className="admin-input" 
              placeholder="Provide context or material specifications for these photos..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          {/* 🌟 Multiple Image Selection */}
          <div>
            <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
              Select Photos (Multiple allowed)
            </label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all bg-gray-50/50 hover:bg-white">
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleMultipleImageUpload} 
              />
              <div className="text-center text-gray-400 space-y-1">
                <ImageIcon size={32} className="mx-auto text-lenux-emerald" />
                <p className="text-sm font-semibold text-lenux-charcoal">
                  {uploading ? "Uploading photos to Cloudinary..." : "Click to select or drag and drop photos"}
                </p>
                <p className="text-xs text-gray-400">PNG, JPG or WebP (Images will be automatically converted to WebP)</p>
              </div>
            </div>

            {/* Selected Images Grid Previews */}
            {selectedImages.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-lenux-deep uppercase tracking-wider">
                  Uploaded Photos Ready to Save ({selectedImages.length}):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-gray-100 p-3 rounded-2xl bg-gray-50">
                  {selectedImages.map((img, i) => (
                    <div key={i} className="relative w-full h-24 bg-white rounded-xl border border-gray-200 group overflow-hidden shadow-sm">
                      <Image src={img.url} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeSelectedImage(i)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        title="Remove photo"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/admin/gallery"
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={saving || uploading || selectedImages.length === 0}
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl disabled:opacity-50"
            >
              <Plus size={18} /> {saving ? "Saving..." : "Save All to Gallery"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}