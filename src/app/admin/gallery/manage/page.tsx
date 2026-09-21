"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Plus, 
  Trash, 
  Check, 
  AlertCircle, 
  ImageIcon, 
  ArrowLeft, 
  Upload, 
  Star,
  Loader2 
} from "lucide-react";

interface CategoryItem {
  _id: string;
  name: string;
}

function GalleryManageFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingItem, setLoadingItem] = useState(isEdit);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("Production");
  const [sortOrder, setSortOrder] = useState(0);
  const [isFeaturedOnHome, setIsFeaturedOnHome] = useState(false);
  
  // Single image for Edit mode
  const [singleImage, setSingleImage] = useState<{ url: string; publicId: string } | null>(null);

  // Multiple Images State for Create mode
  const [selectedImages, setSelectedImages] = useState<{ url: string; publicId: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // 🌟 1. Fetch Categories and (if Edit Mode) Existing Gallery Item
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch("/api/admin/categories");
        const catData = await catRes.json();
        
        let loadedCategories: CategoryItem[] = [];
        if (catData.success && catData.data.length > 0) {
          loadedCategories = catData.data;
          setCategoriesList(loadedCategories);
        }

        if (isEdit && editId) {
          const itemRes = await fetch(`/api/admin/gallery/${editId}`);
          const itemData = await itemRes.json();

          if (itemData.success && itemData.data) {
            const item = itemData.data;
            setTitle(item.title || "");
            setDescription(item.description || "");
            setSortOrder(item.sortOrder || 0);
            setIsFeaturedOnHome(Boolean(item.isFeaturedOnHome));
            setSingleImage(item.image || null);

            // Match Category by serviceCategory id or category name string
            const matchingCat = loadedCategories.find(
              (c) => c._id === item.serviceCategory || c.name.toLowerCase() === (item.category || "").toLowerCase()
            );

            if (matchingCat) {
              setSelectedCategoryId(matchingCat._id);
              setSelectedCategoryName(matchingCat.name);
            } else if (loadedCategories.length > 0) {
              setSelectedCategoryId(loadedCategories[0]._id);
              setSelectedCategoryName(item.category || loadedCategories[0].name);
            }
          } else {
            showNotification("Could not load gallery item data", "error");
          }
        } else {
          // Create Mode — default to first category
          if (loadedCategories.length > 0) {
            setSelectedCategoryId(loadedCategories[0]._id);
            setSelectedCategoryName(loadedCategories[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoadingCategories(false);
        setLoadingItem(false);
      }
    };

    fetchData();
  }, [isEdit, editId]);

  // 🌟 2. Multiple Image Upload (Create Mode)
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
      showNotification("All selected photos uploaded successfully!", "success");
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

  // 🌟 3. Single Image Replace Handler (Edit Mode)
  const handleSingleImageReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery_site");

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setSingleImage({ url: data.url, publicId: data.publicId });
        showNotification("Photo replaced successfully!", "success");
      } else {
        showNotification("Failed to upload photo", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Photo upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // 🌟 4. Submit Form (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      if (!singleImage) {
        showNotification("Please upload or keep a valid image.", "error");
        return;
      }

      setSaving(true);
      try {
        const res = await fetch(`/api/admin/gallery/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            category: selectedCategoryName || "Production",
            serviceCategory: selectedCategoryId || null,
            sortOrder,
            isFeaturedOnHome,
            image: singleImage,
          }),
        });

        const data = await res.json();
        if (data.success) {
          showNotification("Gallery photo updated successfully! Redirecting...", "success");
          setTimeout(() => {
            router.push("/admin/gallery");
            router.refresh();
          }, 1000);
        } else {
          showNotification(data.message || "Failed to update photo", "error");
        }
      } catch (err) {
        console.error(err);
        showNotification("Failed to save changes", "error");
      } finally {
        setSaving(false);
      }
    } else {
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
            category: selectedCategoryName || "Production",
            serviceCategory: selectedCategoryId || null,
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
          }, 1000);
        } else {
          showNotification(data.message || "Failed to save photos", "error");
        }
      } catch (err) {
        console.error(err);
        showNotification("Failed to save photos", "error");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loadingItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-lenux-emerald animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading photo details...</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-lenux-deep">
            {isEdit ? "Edit Gallery Photo" : "Upload Gallery Photos"}
          </h1>
          <p className="text-lenux-darkGray mt-1">
            {isEdit
              ? "Update photo details, assigned category, or replace the photo."
              : "Select the related category and upload single or multiple photos to the visual gallery."}
          </p>
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

      {/* Form Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
              Photo Title <span className="text-gray-400 font-normal">(Optional)</span>
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
                value={selectedCategoryId} 
                onChange={(e) => {
                  const cId = e.target.value;
                  setSelectedCategoryId(cId);
                  const found = categoriesList.find((c) => c._id === cId);
                  if (found) setSelectedCategoryName(found.name);
                }}
                disabled={loadingCategories}
              >
                {categoriesList.length === 0 && <option value="">Loading categories...</option>}
                {categoriesList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
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

          {/* 🌟 EDIT MODE: Single Image View & Replace */}
          {isEdit ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                Current Photo
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                {singleImage && (
                  <div className="relative w-36 h-28 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white shadow-sm">
                    <Image src={singleImage.url} alt="Photo Preview" fill className="object-cover" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors shadow-sm">
                    <Upload size={14} /> {uploading ? "Uploading new photo..." : "Replace Photo"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploading}
                      onChange={handleSingleImageReplace} 
                    />
                  </label>
                  <p className="text-xs text-gray-400">Select a new image file to replace this photo.</p>
                </div>
              </div>

              {/* Featured on Home Checkbox in Edit Mode */}
              <div className="flex items-center gap-2 pt-3">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={isFeaturedOnHome}
                  onChange={(e) => setIsFeaturedOnHome(e.target.checked)}
                  className="w-4 h-4 text-lenux-emerald border-gray-300 rounded focus:ring-lenux-emerald cursor-pointer"
                />
                <label htmlFor="featuredToggle" className="text-xs font-bold text-gray-700 cursor-pointer flex items-center gap-1.5">
                  <Star size={14} className={isFeaturedOnHome ? "text-amber-500 fill-amber-500" : "text-gray-400"} />
                  Feature on Home Page Gallery
                </label>
              </div>
            </div>
          ) : (
            /* 🌟 CREATE MODE: Multiple Image Upload */
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
          )}

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
              disabled={saving || uploading || (!isEdit && selectedImages.length === 0)}
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl disabled:opacity-50"
            >
              {isEdit ? <Check size={18} /> : <Plus size={18} />}
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Save All to Gallery"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function GalleryManagePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-lenux-emerald animate-spin" />
      </div>
    }>
      <GalleryManageFormContent />
    </Suspense>
  );
}