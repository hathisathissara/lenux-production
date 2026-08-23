"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash, Check, AlertCircle, ImageIcon, Star } from "lucide-react";

interface GalleryItem {
  _id: string;
  title?: string;
  description?: string;
  category: string;
  image: { url: string; publicId: string };
  isFeaturedOnHome?: boolean;
}

interface CategoryItem {
  _id: string;
  name: string;
}

export default function GalleryManagement() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
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

  const fetchGalleryAndCategories = async () => {
    try {
      const [galleryRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/gallery"),
        fetch("/api/admin/categories")
      ]);
      
      const galleryData = await galleryRes.json();
      const categoriesData = await categoriesRes.json();
      
      if (galleryData.success) {
        setGallery(galleryData.data);
      }
      
      if (categoriesData.success && categoriesData.data.length > 0) {
        setCategoriesList(categoriesData.data);
        // If the current category state is not in the fetched list, set it to the first category
        const firstCategoryName = categoriesData.data[0].name;
        setCategory((prevCat) => {
          const exists = categoriesData.data.some((c: CategoryItem) => c.name === prevCat);
          return exists ? prevCat : firstCategoryName;
        });
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchGalleryAndCategories();
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
          images: selectedImages,
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
        fetchGalleryAndCategories();
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to save photos", "error");
    }
  };

  // 🌟 Toggle Feature on Home
  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeaturedOnHome: !currentValue }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          !currentValue ? "Image featured on Home Page!" : "Image removed from Home Page.",
          "success"
        );
        fetchGalleryAndCategories();
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to update feature status", "error");
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
        fetchGalleryAndCategories();
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
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs text-lenux-darkGray uppercase tracking-wider">
                    <th className="p-4 font-bold">Image</th>
                    <th className="p-4 font-bold">Details</th>
                    <th className="p-4 font-bold text-center">Home</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gallery.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 align-top w-28">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                          <Image src={item.image.url} alt={item.title || "Gallery"} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-lenux-charcoal text-sm">{item.title || "Untitled"}</h4>
                          <span className="inline-block px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold uppercase rounded-md">
                            {item.category}
                          </span>
                          {item.description && <p className="text-xs text-gray-500 line-clamp-2 max-w-sm mt-1">{item.description}</p>}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center w-24">
                        <button 
                          onClick={() => handleToggleFeatured(item._id, item.isFeaturedOnHome || false)}
                          className={`p-2 rounded-full transition-all mx-auto flex items-center justify-center shadow-sm ${
                            item.isFeaturedOnHome 
                              ? "bg-amber-100 border border-amber-200 text-amber-600 hover:bg-amber-200" 
                              : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-amber-500"
                          }`}
                          title={item.isFeaturedOnHome ? "Remove from Home Page" : "Feature on Home Page"}
                        >
                          <Star size={16} fill={item.isFeaturedOnHome ? "currentColor" : "none"} /> 
                        </button>
                      </td>
                      <td className="p-4 align-middle text-right w-24">
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all inline-flex items-center justify-center"
                          title="Delete Image"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                {categoriesList.length === 0 && <option value="Production">Production</option>}
                {categoriesList.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
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