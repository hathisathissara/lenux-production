"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Trash, 
  Check, 
  AlertCircle, 
  ImageIcon, 
  Loader2 
} from "lucide-react";

function PortfolioFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState<{ url: string; publicId: string } | null>(null);

  // Stage Photos
  const [beforeImages, setBeforeImages] = useState<{ url: string; publicId: string }[]>([]);
  const [productionImages, setProductionImages] = useState<{ url: string; publicId: string }[]>([]);
  const [installationImages, setInstallationImages] = useState<{ url: string; publicId: string }[]>([]);

  // Upload progress states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingStage, setUploadingStage] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Load services and, if edit mode, existing project data
  useEffect(() => {
    const initData = async () => {
      setInitialLoading(true);
      try {
        const serRes = await fetch("/api/admin/services");
        const serData = await serRes.json();
        if (serData.success) {
          setServices(serData.data);
        }

        if (editId) {
          const projRes = await fetch(`/api/admin/portfolio/${editId}`);
          const projData = await projRes.json();
          if (projData.success && projData.data) {
            const proj = projData.data;
            setTitle(proj.title || "");
            setSelectedService(proj.service?._id || proj.service || "");
            setDescription(proj.description || "");
            setClientName(proj.clientName || "");
            setCompletionDate(
              proj.completionDate ? proj.completionDate.substring(0, 10) : ""
            );
            setIsFeatured(proj.isFeatured || false);
            setCoverImage(proj.coverImage || null);
            setBeforeImages(proj.beforeImages || []);
            setProductionImages(proj.productionImages || []);
            setInstallationImages(proj.installationImages || []);
          } else {
            showNotification("Failed to load project details", "error");
          }
        }
      } catch (err) {
        console.error("Error loading form data:", err);
        showNotification("Error loading project information", "error");
      } finally {
        setInitialLoading(false);
      }
    };

    initData();
  }, [editId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadImage = async (file: File, folder: string): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    return await res.json();
  };

  const handleStagePhotosUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    stage: "before" | "production" | "installation"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingStage(stage);
    try {
      const uploaded: { url: string; publicId: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const data = await uploadImage(files[i], `portfolio_${stage}`);
        if (data.success) {
          uploaded.push({ url: data.url, publicId: data.publicId });
        }
      }

      if (stage === "before") setBeforeImages(prev => [...prev, ...uploaded]);
      if (stage === "production") setProductionImages(prev => [...prev, ...uploaded]);
      if (stage === "installation") setInstallationImages(prev => [...prev, ...uploaded]);

      showNotification(`${uploaded.length} ${stage} photos uploaded!`, "success");
    } catch (err) {
      console.error(err);
      showNotification("Upload failed", "error");
    } finally {
      setUploadingStage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedService || !description || !coverImage) {
      showNotification("Please fill required fields and add a cover image.", "error");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        const res = await fetch(`/api/admin/portfolio/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            service: selectedService,
            description,
            clientName,
            completionDate: completionDate ? new Date(completionDate) : undefined,
            isFeatured,
            coverImage,
            beforeImages,
            productionImages,
            installationImages
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification("Portfolio project updated successfully!", "success");
          setTimeout(() => {
            router.push("/admin/portfolio");
            router.refresh();
          }, 1200);
        } else {
          showNotification(data.message || "Failed to update project", "error");
        }
      } else {
        const res = await fetch("/api/admin/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            serviceId: selectedService,
            description,
            coverImage,
            beforeImages,
            productionImages,
            installationImages,
            clientName,
            completionDate,
            isFeatured
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification("Portfolio project added successfully!", "success");
          setTimeout(() => {
            router.push("/admin/portfolio");
            router.refresh();
          }, 1200);
        } else {
          showNotification(data.message || "Failed to add project", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showNotification("An unexpected error occurred while saving", "error");
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lenux-emerald"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Bar with Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/portfolio"
          className="inline-flex items-center gap-2 text-sm font-semibold text-lenux-darkGray hover:text-lenux-deep transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-lenux-emerald bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          {isEdit ? "Edit Mode" : "New Project"}
        </span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-lenux-deep">
          {isEdit ? "Edit Project" : "Add Completed Project"}
        </h1>
        <p className="text-lenux-darkGray mt-1 text-sm">
          {isEdit
            ? "Update project details, cover photo, and Before/Production/Final installation stages."
            : "Showcase completed project details with stage-by-stage photos."}
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border transition-all ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Basic Details Section */}
        <div>
          <h2 className="text-base font-bold text-lenux-deep border-b border-gray-100 pb-2 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="e.g., Dialog Delivery Van Branding"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                Link to Service <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="admin-input"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">Select Related Service</option>
                {services.map((ser) => (
                  <option key={ser._id} value={ser._id}>
                    {ser.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                Client Name
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g., Dialog Axiata PLC"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                Completion Date
              </label>
              <input
                type="date"
                className="admin-input"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
              />
            </div>

            <div className="flex items-center md:pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-lenux-charcoal font-medium select-none">
                <input
                  type="checkbox"
                  className="rounded w-4 h-4 text-lenux-emerald focus:ring-lenux-emerald border-gray-300"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                Feature on Home Page
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                className="admin-input"
                placeholder="Project execution details, client requirements, materials used..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Cover Photo Section */}
        <div>
          <h2 className="text-base font-bold text-lenux-deep border-b border-gray-100 pb-2 mb-4">
            Main Cover Photo <span className="text-red-500">*</span>
          </h2>
          <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all bg-gray-50/50 group">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadingCover(true);
                  const data = await uploadImage(file, "portfolio_covers");
                  if (data.success) {
                    setCoverImage({ url: data.url, publicId: data.publicId });
                  }
                  setUploadingCover(false);
                }
              }}
            />
            {coverImage ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <Image src={coverImage.url} alt="Cover preview" fill className="object-cover" />
                </div>
                <span className="text-xs text-lenux-emerald font-semibold group-hover:underline">
                  Click or drag to change cover photo
                </span>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <Upload size={28} className="mx-auto mb-2 text-gray-400 group-hover:text-lenux-emerald transition-colors" />
                <span className="text-sm font-medium text-gray-600 block">
                  {uploadingCover ? "Uploading Cover..." : "Click or drag to upload Main Cover Photo"}
                </span>
                <span className="text-xs text-gray-400 mt-1 block">PNG, JPG, WebP up to 10MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Stage Photos Section */}
        <div>
          <h2 className="text-base font-bold text-lenux-deep border-b border-gray-100 pb-2 mb-4">
            Stage Photos (Before, Production &amp; Final Installation)
          </h2>

          <div className="space-y-6">
            {/* 1. Before Photos */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-lenux-darkGray uppercase">
                  1. Before Photos ({beforeImages.length})
                </label>
                <span className="text-[11px] text-gray-400">Optional initial state photos</span>
              </div>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all mb-3 bg-white">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleStagePhotosUpload(e, "before")}
                />
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-gray-400" />
                  {uploadingStage === "before" ? "Uploading photos..." : "+ Add Before Stage Photos (Multiple)"}
                </span>
              </div>
              {beforeImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {beforeImages.map((img, i) => (
                    <div key={i} className="relative h-16 bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                      <Image src={img.url} alt="Before" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setBeforeImages(p => p.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Production Photos */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-lenux-darkGray uppercase">
                  2. Production / Printing Photos ({productionImages.length})
                </label>
                <span className="text-[11px] text-gray-400">Optional in-progress photos</span>
              </div>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all mb-3 bg-white">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleStagePhotosUpload(e, "production")}
                />
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-gray-400" />
                  {uploadingStage === "production" ? "Uploading photos..." : "+ Add Production Stage Photos (Multiple)"}
                </span>
              </div>
              {productionImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {productionImages.map((img, i) => (
                    <div key={i} className="relative h-16 bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                      <Image src={img.url} alt="Production" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setProductionImages(p => p.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Final Installation Photos */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-lenux-darkGray uppercase">
                  3. Final Installation Photos ({installationImages.length})
                </label>
                <span className="text-[11px] text-gray-400">Optional final on-site photos</span>
              </div>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all mb-3 bg-white">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleStagePhotosUpload(e, "installation")}
                />
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-gray-400" />
                  {uploadingStage === "installation" ? "Uploading photos..." : "+ Add Final Installation Photos (Multiple)"}
                </span>
              </div>
              {installationImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {installationImages.map((img, i) => (
                    <div key={i} className="relative h-16 bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                      <Image src={img.url} alt="Final Installation" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setInstallationImages(p => p.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Link
            href="/admin/portfolio"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploadingCover || Boolean(uploadingStage)}
            className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isEdit ? "Updating Project..." : "Saving Project..."}</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEdit ? "Update Project" : "Save Project with Stages"}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function PortfolioManagePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lenux-emerald"></div>
        </div>
      }
    >
      <PortfolioFormContent />
    </Suspense>
  );
}
