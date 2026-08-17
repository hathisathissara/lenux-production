"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Upload, Trash, Check, AlertCircle, ImageIcon, Calendar, User, Edit, X } from "lucide-react";

export default function PortfolioManagement() {
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States (Create)
  const [title, setTitle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState<{ url: string; publicId: string } | null>(null);
  const [galleryImages, setGalleryImages] = useState<{ url: string; publicId: string }[]>([]);

  // Edit Modal States
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editService, setEditService] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editClient, setEditClient] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editCover, setEditCover] = useState<{ url: string; publicId: string } | null>(null);
  const [editGallery, setEditGallery] = useState<{ url: string; publicId: string }[]>([]);
  const [updating, setUpdating] = useState(false);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchData = async () => {
    try {
      const [projRes, serRes] = await Promise.all([
        fetch("/api/admin/portfolio"),
        fetch("/api/admin/services")
      ]);
      const projData = await projRes.json();
      const serData = await serRes.json();

      if (projData.success) setProjects(projData.data);
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

  const uploadImage = async (file: File, folder: string): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    return await res.json();
  };

  // Cover Image Upload (Create)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const data = await uploadImage(file, "portfolio_covers");
      if (data.success) {
        setCoverImage({ url: data.url, publicId: data.publicId });
        showNotification("Cover image uploaded!", "success");
      }
    } catch (err) {
      showNotification("Cover upload failed", "error");
    } finally {
      setUploadingCover(false);
    }
  };

  // Gallery Upload (Create)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const data = await uploadImage(files[i], "portfolio_gallery");
        if (data.success) {
          setGalleryImages(prev => [...prev, { url: data.url, publicId: data.publicId }]);
        }
      }
      showNotification("Gallery images uploaded!", "success");
    } catch (err) {
      showNotification("Gallery upload failed", "error");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  // Gallery Upload (Edit Modal)
  const handleEditGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const data = await uploadImage(files[i], "portfolio_gallery");
        if (data.success) {
          setEditGallery(prev => [...prev, { url: data.url, publicId: data.publicId }]);
        }
      }
      showNotification("Gallery images added!", "success");
    } catch (err) {
      showNotification("Gallery upload failed", "error");
    }
  };

  const removeEditGalleryImage = (index: number) => {
    setEditGallery(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Create Project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedService || !description || !coverImage) {
      showNotification("Please fill required fields and add a cover image.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          serviceId: selectedService,
          description,
          coverImage,
          gallery: galleryImages,
          clientName,
          completionDate,
          isFeatured
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Portfolio project added successfully!", "success");
        setTitle(""); setSelectedService(""); setDescription(""); setClientName(""); setCompletionDate("");
        setCoverImage(null); setGalleryImages([]); setIsFeatured(false);
        fetchData();
      }
    } catch (err) {
      showNotification("Failed to save project", "error");
    }
  };

  // Delete Project
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio project?")) return;

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Project deleted successfully!", "success");
        fetchData();
      }
    } catch (err) {
      showNotification("Failed to delete project", "error");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (proj: any) => {
    setEditingProject(proj);
    setEditTitle(proj.title);
    setEditService(proj.service?._id || proj.service);
    setEditDesc(proj.description);
    setEditClient(proj.clientName || "");
    setEditDate(proj.completionDate ? proj.completionDate.substring(0, 10) : "");
    setEditFeatured(proj.isFeatured || false);
    setEditCover(proj.coverImage);
    setEditGallery(proj.gallery || []);
  };

  // Submit Update Project (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/portfolio/${editingProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          service: editService,
          description: editDesc,
          clientName: editClient,
          completionDate: editDate ? new Date(editDate) : undefined,
          isFeatured: editFeatured,
          coverImage: editCover,
          gallery: editGallery
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Portfolio updated successfully!", "success");
        setEditingProject(null);
        fetchData();
      } else {
        showNotification(data.message || "Update failed", "error");
      }
    } catch (err) {
      showNotification("Failed to update project", "error");
    } finally {
      setUpdating(false);
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
        <h1 className="text-3xl font-bold text-lenux-deep">Portfolio Management</h1>
        <p className="text-lenux-darkGray mt-1">Showcase completed visual production works here.</p>
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
        
        {/* LIST */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-lenux-deep mb-6">Current Projects Gallery ({projects.length})</h3>
          {projects.length === 0 ? (
            <p className="text-gray-400 text-sm">No portfolio projects added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj._id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative w-full h-48 bg-gray-100">
                      <Image src={proj.coverImage.url} alt={proj.title} fill className="object-cover" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-lenux-charcoal text-base">{proj.title}</h4>
                        {proj.isFeatured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">Featured</span>
                        )}
                      </div>
                      
                      <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-lenux-soft text-lenux-deep rounded-md">
                        {proj.service?.title || "Linked Service"}
                      </span>

                      <div className="flex items-center gap-4 text-xs text-lenux-darkGray pt-2 border-t border-gray-50">
                        {proj.clientName && <span className="flex items-center gap-1"><User size={14} /> {proj.clientName}</span>}
                        {proj.completionDate && <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(proj.completionDate).toLocaleDateString()}</span>}
                      </div>

                      {proj.gallery && proj.gallery.length > 0 && (
                        <p className="text-[11px] text-emerald-600 font-medium">📷 {proj.gallery.length} Gallery Photos</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-50 flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(proj)} className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(proj._id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold">
                      <Trash size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CREATE FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-lg font-bold text-lenux-deep">Add Completed Project</h3>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Project Title</label>
              <input type="text" required className="admin-input" placeholder="e.g., Dialog Van Branding" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Link to Service</label>
              <select required className="admin-input" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                <option value="">Select Related Service</option>
                {services.map((ser) => (
                  <option key={ser._id} value={ser._id}>{ser.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Client Name</label>
              <input type="text" className="admin-input" placeholder="e.g., Dialog Axiata" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Completion Date</label>
                <input type="date" className="admin-input" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} />
              </div>
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-lenux-charcoal font-medium">
                  <input type="checkbox" className="rounded text-lenux-emerald focus:ring-lenux-emerald" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  Feature on Home
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Description</label>
              <textarea rows={3} required className="admin-input" placeholder="Project description..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Cover Image</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleCoverUpload} />
                {coverImage ? (
                  <div className="text-center relative w-16 h-16">
                    <Image src={coverImage.url} alt="Cover preview" fill className="object-cover rounded-lg" />
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Upload size={20} className="mx-auto mb-1" />
                    <span className="text-[11px]">{uploadingCover ? "Uploading..." : "Upload Cover Image"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 🌟 Production Gallery Images (Multiple) */}
            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Production Gallery Photos (Optional)</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all mb-3">
                <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleGalleryUpload} />
                <div className="text-center text-gray-400">
                  <ImageIcon size={18} className="mx-auto mb-1" />
                  <span className="text-[11px]">{uploadingGallery ? "Uploading..." : "Add Gallery Photos"}</span>
                </div>
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 border border-gray-100 p-2 rounded-xl bg-gray-50 max-h-24 overflow-y-auto">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="relative w-full h-10 bg-white rounded border border-gray-200 group">
                      <Image src={img.url} alt="Gallery item" fill className="object-cover rounded" />
                      <button 
                        type="button" 
                        onClick={() => removeGalleryImage(i)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary w-full gap-2 text-sm mt-4">
              <Plus size={16} /> Save Project
            </button>
          </form>
        </div>

      </div>

      {/* ==========================================
          🌟 EDIT PORTFOLIO MODAL (with Gallery support)
          ========================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
            
            <div className="p-6 bg-lenux-deep text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Portfolio Project</h3>
              <button onClick={() => setEditingProject(null)} className="text-white/80 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Project Title</label>
                <input type="text" required className="admin-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Related Service</label>
                <select required className="admin-input" value={editService} onChange={(e) => setEditService(e.target.value)}>
                  {services.map((ser) => (
                    <option key={ser._id} value={ser._id}>{ser.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Client Name</label>
                <input type="text" className="admin-input" value={editClient} onChange={(e) => setEditClient(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Completion Date</label>
                  <input type="date" className="admin-input" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-lenux-charcoal font-medium">
                    <input type="checkbox" className="rounded text-lenux-emerald focus:ring-lenux-emerald" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)} />
                    Feature on Home
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Description</label>
                <textarea rows={3} required className="admin-input" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
              </div>

              {/* Edit Cover Image */}
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Cover Image</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if(file) {
                      const data = await uploadImage(file, "portfolio_covers");
                      if(data.success) setEditCover({ url: data.url, publicId: data.publicId });
                    }
                  }} />
                  {editCover?.url ? (
                    <div className="text-center relative w-16 h-16">
                      <Image src={editCover.url} alt="Edit cover" fill className="object-cover rounded-lg" />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Upload new cover</span>
                  )}
                </div>
              </div>

              {/* Edit Gallery Images */}
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Production Gallery Photos</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all mb-2">
                  <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleEditGalleryUpload} />
                  <span className="text-xs text-gray-400">Add More Gallery Photos</span>
                </div>

                {editGallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 border border-gray-100 p-2 rounded-xl bg-gray-50 max-h-24 overflow-y-auto">
                    {editGallery.map((img, i) => (
                      <div key={i} className="relative w-full h-10 bg-white rounded border border-gray-200 group">
                        <Image src={img.url} alt="Gallery item" fill className="object-cover rounded" />
                        <button 
                          type="button" 
                          onClick={() => removeEditGalleryImage(i)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash size={8} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditingProject(null)} className="px-5 py-2.5 border rounded-xl text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={updating} className="btn-primary text-sm px-6">{updating ? "Updating..." : "Save Changes"}</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}