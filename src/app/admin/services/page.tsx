"use client";

import { useEffect, useState } from "react";
import { Plus, Upload, Trash, LayoutGrid, ClipboardList, Check, AlertCircle } from "lucide-react";

export default function ServicesManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States (Category)
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingCatImg, setUploadingCatImg] = useState(false);

  // Form States (Service)
  const [serTitle, setSerTitle] = useState("");
  const [serCategory, setSerCategory] = useState("");
  const [serShortDesc, setSerShortDesc] = useState("");
  const [serDesc, setSerDesc] = useState("");
  const [serImage, setSerImage] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingSerImg, setUploadingSerImg] = useState(false);

  // UI Active Tab
  const [activeTab, setActiveTab] = useState<"services" | "categories">("services");

  // Notification States
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchData = async () => {
    try {
      const [catRes, serRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/services")
      ]);
      const catData = await catRes.json();
      const serData = await serRes.json();

      if (catData.success) setCategories(catData.data);
      if (serData.success) setServices(serData.data);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Image Upload Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "category" | "service") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "category") setUploadingCatImg(true);
    else setUploadingSerImg(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", type === "category" ? "categories" : "services");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        if (type === "category") setCatImage({ url: data.url, publicId: data.publicId });
        else setSerImage({ url: data.url, publicId: data.publicId });
        showNotification("Image uploaded successfully!", "success");
      }
    } catch (err) {
      showNotification("Image upload failed", "error");
    } finally {
      if (type === "category") setUploadingCatImg(false);
      else setUploadingSerImg(false);
    }
  };

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Submit Category Form
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catImage) {
      showNotification("Please fill name and upload an image.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, description: catDesc, image: catImage })
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Category added successfully!", "success");
        setCatName("");
        setCatDesc("");
        setCatImage(null);
        fetchData();
      }
    } catch (err) {
      showNotification("Failed to add category", "error");
    }
  };

  // Submit Service Form
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serTitle || !serCategory || !serShortDesc || !serDesc || !serImage) {
      showNotification("Please fill all fields and upload an image.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: serTitle,
          categoryId: serCategory,
          shortDescription: serShortDesc,
          description: serDesc,
          image: serImage
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Service added successfully!", "success");
        setSerTitle("");
        setSerCategory("");
        setSerShortDesc("");
        setSerDesc("");
        setSerImage(null);
        fetchData();
      }
    } catch (err) {
      showNotification("Failed to add service", "error");
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lenux-deep">Services & Categories</h1>
          <p className="text-lenux-darkGray mt-1">Manage dynamic service modules here.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-gray-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "services" ? "bg-white text-lenux-deep shadow" : "text-lenux-darkGray hover:text-lenux-deep"
            }`}
          >
            <ClipboardList size={16} /> Services
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "categories" ? "bg-white text-lenux-deep shadow" : "text-lenux-darkGray hover:text-lenux-deep"
            }`}
          >
            <LayoutGrid size={16} /> Categories
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Grid Layout: Left is List, Right is Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LIST AREA (Left 2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {activeTab === "services" ? (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-lenux-deep">Current Services List</h3>
              {services.length === 0 ? (
                <p className="text-gray-400 text-sm">No services added yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs text-lenux-darkGray uppercase font-bold">
                        <th className="py-3">Image</th>
                        <th className="py-3">Title</th>
                        <th className="py-3">Category</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                      {services.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50/50">
                          <td className="py-3">
                            <img src={item.image.url} alt={item.title} className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                          </td>
                          <td className="py-3 font-medium text-lenux-charcoal">{item.title}</td>
                          <td className="py-3 text-lenux-darkGray">{item.category?.name || "Uncategorized"}</td>
                          <td className="py-3">
                            <button className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all">
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
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-lenux-deep">Current Categories List</h3>
              {categories.length === 0 ? (
                <p className="text-gray-400 text-sm">No categories added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat._id} className="p-4 rounded-xl border border-gray-100 bg-lenux-offWhite flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {cat.image?.url && <img src={cat.image.url} alt={cat.name} className="w-10 h-10 object-cover rounded-lg" />}
                        <div>
                          <p className="font-bold text-lenux-charcoal text-sm">{cat.name}</p>
                          <p className="text-xs text-gray-400">Slug: {cat.slug}</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all">
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ADD FORM AREA (Right 1 column) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          {activeTab === "services" ? (
            <form onSubmit={handleAddService} className="space-y-5">
              <h3 className="text-lg font-bold text-lenux-deep">Add New Service</h3>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Service Title</label>
                <input type="text" required className="admin-input" placeholder="e.g., Diamond Cut Sticker" value={serTitle} onChange={(e) => setSerTitle(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Select Category</label>
                <select required className="admin-input" value={serCategory} onChange={(e) => setSerCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Short Description</label>
                <input type="text" required className="admin-input" placeholder="e.g., Fast digital print on high quality adhesive stickers" value={serShortDesc} onChange={(e) => setSerShortDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Detailed Description</label>
                <textarea rows={4} required className="admin-input" placeholder="Detailed service description..." value={serDesc} onChange={(e) => setSerDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Service Image</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "service")} />
                  {serImage ? (
                    <div className="text-center">
                      <img src={serImage.url} alt="Service preview" className="w-16 h-16 object-cover rounded-lg mx-auto mb-2" />
                      <span className="text-xs text-emerald-600 font-bold">Image ready</span>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload size={24} className="mx-auto mb-2" />
                      <span className="text-xs">{uploadingSerImg ? "Uploading..." : "Click to Upload Image"}</span>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full gap-2 text-sm">
                <Plus size={16} /> Save Service
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddCategory} className="space-y-5">
              <h3 className="text-lg font-bold text-lenux-deep">Add New Category</h3>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Category Name</label>
                <input type="text" required className="admin-input" placeholder="e.g., Sticker Works" value={catName} onChange={(e) => setCatName(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Description</label>
                <textarea rows={3} className="admin-input" placeholder="Short description about the category..." value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Category Image</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "category")} />
                  {catImage ? (
                    <div className="text-center">
                      <img src={catImage.url} alt="Category preview" className="w-16 h-16 object-cover rounded-lg mx-auto mb-2" />
                      <span className="text-xs text-emerald-600 font-bold">Image ready</span>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload size={24} className="mx-auto mb-2" />
                      <span className="text-xs">{uploadingCatImg ? "Uploading..." : "Click to Upload Image"}</span>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full gap-2 text-sm">
                <Plus size={16} /> Save Category
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}