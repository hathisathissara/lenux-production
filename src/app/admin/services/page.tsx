"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Upload, Trash, LayoutGrid, ClipboardList, Check, AlertCircle, Edit, X } from "lucide-react";

export default function ServicesManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States (Category Create)
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingCatImg, setUploadingCatImg] = useState(false);

  // Form States (Service Create)
  const [serTitle, setSerTitle] = useState("");
  const [serCategory, setSerCategory] = useState("");
  const [serShortDesc, setSerShortDesc] = useState("");
  const [serDesc, setSerDesc] = useState("");
  const [serImage, setSerImage] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingSerImg, setUploadingSerImg] = useState(false);

  // Edit Modal States
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editShortDesc, setEditShortDesc] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState<{ url: string; publicId: string } | null>(null);
  const [updating, setUpdating] = useState(false);

  const [activeTab, setActiveTab] = useState<"services" | "categories">("services");
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

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "category" | "service" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "category") setUploadingCatImg(true);
    else if (type === "service") setUploadingSerImg(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "services");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        const imgObj = { url: data.url, publicId: data.publicId };
        if (type === "category") setCatImage(imgObj);
        else if (type === "service") setSerImage(imgObj);
        else if (type === "edit") setEditImage(imgObj);
        showNotification("Image uploaded successfully!", "success");
      }
    } catch (err) {
      showNotification("Image upload failed", "error");
    } finally {
      setUploadingCatImg(false);
      setUploadingSerImg(false);
    }
  };

  // Create Category
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
        setCatName(""); setCatDesc(""); setCatImage(null);
        fetchData();
      }
    } catch (err) {
      showNotification("Failed to add category", "error");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Category deleted successfully!", "success");
        fetchData();
      }
    } catch (err) {
      showNotification("Failed to delete category", "error");
    }
  };

  // Create Service
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
        setSerTitle(""); setSerCategory(""); setSerShortDesc(""); setSerDesc(""); setSerImage(null);
        fetchData();
      }
    } catch (err) {
      showNotification("Failed to add service", "error");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditCategory(service.category?._id || service.category);
    setEditShortDesc(service.shortDescription);
    setEditDesc(service.description);
    setEditImage(service.image);
  };

  // Submit Update Service (PUT)
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/services/${editingService._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
          shortDescription: editShortDesc,
          description: editDesc,
          image: editImage
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Service updated successfully!", "success");
        setEditingService(null);
        fetchData();
      } else {
        showNotification(data.message || "Update failed", "error");
      }
    } catch (err) {
      showNotification("Failed to update service", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Delete Service
  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Service deleted successfully!", "success");
        fetchData();
      }
    } catch (err) {
      showNotification("Failed to delete service", "error");
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lenux-deep">Services & Categories</h1>
          <p className="text-lenux-darkGray mt-1">Manage dynamic service modules here.</p>
        </div>

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

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LIST AREA */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {activeTab === "services" ? (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-lenux-deep">Current Services List ({services.length})</h3>
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
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                      {services.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50/50">
                          <td className="py-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                              <Image src={item.image.url} alt={item.title} fill className="object-cover" />
                            </div>
                          </td>
                          <td className="py-3 font-medium text-lenux-charcoal">{item.title}</td>
                          <td className="py-3 text-lenux-darkGray">{item.category?.name || "Uncategorized"}</td>
                          <td className="py-3 text-right space-x-2">
                            {/* Edit Button */}
                            <button 
                              onClick={() => handleOpenEdit(item)}
                              className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-all inline-block"
                              title="Edit Service"
                            >
                              <Edit size={16} />
                            </button>
                            {/* Delete Button */}
                            <button 
                              onClick={() => handleDeleteService(item._id)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all inline-block"
                              title="Delete Service"
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
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-lenux-deep">Current Categories List ({categories.length})</h3>
              {categories.length === 0 ? (
                <p className="text-gray-400 text-sm">No categories added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat._id} className="p-4 rounded-xl border border-gray-100 bg-lenux-offWhite flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {cat.image?.url && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            <Image src={cat.image.url} alt={cat.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-lenux-charcoal text-sm">{cat.name}</p>
                          <p className="text-xs text-gray-400">Slug: {cat.slug}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Category"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ADD FORM AREA */}
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
                <input type="text" required className="admin-input" placeholder="Short description..." value={serShortDesc} onChange={(e) => setSerShortDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Detailed Description</label>
                <textarea rows={3} required className="admin-input" placeholder="Detailed service description..." value={serDesc} onChange={(e) => setSerDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Service Image</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "service")} />
                  {serImage ? (
                    <div className="text-center relative w-16 h-16">
                      <Image src={serImage.url} alt="Service preview" fill className="object-cover rounded-lg" />
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
                <textarea rows={3} className="admin-input" placeholder="Short description..." value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Category Image</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "category")} />
                  {catImage ? (
                    <div className="text-center relative w-16 h-16">
                      <Image src={catImage.url} alt="Category preview" fill className="object-cover rounded-lg" />
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

      {/* ==========================================
          🌟 EDIT SERVICE MODAL (POPUP)
          ========================================== */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
            
            <div className="p-6 bg-lenux-deep text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Service</h3>
              <button onClick={() => setEditingService(null)} className="text-white/80 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateService} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Service Title</label>
                <input type="text" required className="admin-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Category</label>
                <select required className="admin-input" value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Short Description</label>
                <input type="text" required className="admin-input" value={editShortDesc} onChange={(e) => setEditShortDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Detailed Description</label>
                <textarea rows={3} required className="admin-input" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Service Image</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "edit")} />
                  {editImage?.url ? (
                    <div className="text-center relative w-16 h-16">
                      <Image src={editImage.url} alt="Edit preview" fill className="object-cover rounded-lg" />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Upload new image</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditingService(null)} className="px-5 py-2.5 border rounded-xl text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={updating} className="btn-primary text-sm px-6">{updating ? "Updating..." : "Save Changes"}</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}