"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Trash,
  Check,
  AlertCircle,
  Star,
  Search,
  Filter,
  Edit,
  ArrowLeft,
  Images,
  Upload,
  X,
  Loader2,
} from "lucide-react";

interface GalleryItem {
  _id: string;
  title?: string;
  description?: string;
  category: string;
  serviceCategory?: string;
  service?: string;
  image: { url: string; publicId: string };
  sortOrder?: number;
  isFeaturedOnHome?: boolean;
}

interface CategoryItem {
  _id: string;
  name: string;
}

interface GalleryGroup {
  title: string;
  category: string;
  serviceCategory?: string;
  description?: string;
  items: GalleryItem[];
}

export default function GalleryManagementPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Selected Title Group State (Album Detail View)
  const [selectedGroupTitle, setSelectedGroupTitle] = useState<string | null>(null);

  // Group being edited in modal
  const [editingGroup, setEditingGroup] = useState<GalleryGroup | null>(null);

  // Add Photos Directly to Active Album Modal State
  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [newAlbumImages, setNewAlbumImages] = useState<{ url: string; publicId: string }[]>([]);
  const [isUploadingNewPhotos, setIsUploadingNewPhotos] = useState(false);
  const [isSavingNewPhotos, setIsSavingNewPhotos] = useState(false);

  // Pagination State for Table view
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [message, setMessage] = useState({ text: "", type: "" });

  // Album Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [isSavingAlbum, setIsSavingAlbum] = useState(false);
  const [editDescription, setEditDescription] = useState("");

  const fetchGalleryAndCategories = async () => {
    try {
      const [galleryRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/gallery"),
        fetch("/api/admin/categories"),
      ]);

      const galleryData = await galleryRes.json();
      const categoriesData = await categoriesRes.json();

      if (galleryData.success) {
        setGallery(galleryData.data);
      }

      if (categoriesData.success && categoriesData.data.length > 0) {
        setCategoriesList(categoriesData.data);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGalleryAndCategories();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // 🌟 Dynamic Filter Options — from ServiceCategories DB + existing gallery category strings
  const filterOptions = useMemo(() => {
    const catNames = categoriesList.map((c) => c.name);
    const galleryCategories = gallery.map((g) => g.category).filter(Boolean);
    return Array.from(new Set([...catNames, ...galleryCategories]));
  }, [categoriesList, gallery]);

  // 🌟 Filter & Search Logic
  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      const matchesSearch =
        (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

      const matchesCategory =
        selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [gallery, searchQuery, selectedCategory]);

  // 🌟 Group by Title
  const groupedGallery = useMemo(() => {
    const groupsMap = new Map<string, GalleryGroup>();

    filteredGallery.forEach((item) => {
      const rawTitle = item.title?.trim() || "Untitled";
      const key = rawTitle.toLowerCase();

      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          title: rawTitle,
          category: item.category || "Production",
          serviceCategory: item.serviceCategory,
          description: item.description || "",
          items: [],
        });
      } else if (!groupsMap.get(key)!.description && item.description) {
        groupsMap.get(key)!.description = item.description;
      }
      groupsMap.get(key)!.items.push(item);
    });

    return Array.from(groupsMap.values());
  }, [filteredGallery]);

  // Currently Active Group (if user clicked into a Title Album)
  const activeGroup = useMemo(() => {
    if (!selectedGroupTitle) return null;
    return (
      groupedGallery.find(
        (g) => g.title.toLowerCase() === selectedGroupTitle.toLowerCase()
      ) || null
    );
  }, [groupedGallery, selectedGroupTitle]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  // 🌟 Toggle Feature on Home for an individual photo
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

  // 🌟 Open Edit Album Modal (Title & Category only)
  const handleOpenEditModal = (group: GalleryGroup) => {
    setEditingGroup(group);
    setEditTitle(group.title);
    const matchingCat = categoriesList.find(
      (c) =>
        (group.serviceCategory && c._id === group.serviceCategory) ||
        c.name.toLowerCase() === group.category.toLowerCase()
    );
    if (matchingCat) {
      setEditCategoryId(matchingCat._id);
      setEditCategoryName(matchingCat.name);
    } else if (categoriesList.length > 0) {
      setEditCategoryId(categoriesList[0]._id);
      setEditCategoryName(group.category || categoriesList[0].name);
    } else {
      setEditCategoryId("");
      setEditCategoryName(group.category || "Production");
    }
    setEditDescription(group.description || "");
    setIsEditModalOpen(true);
  };

  // 🌟 Save Edited Album Details (Updates Title and Category only across photos)
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetGroup = editingGroup || activeGroup;
    if (!targetGroup) return;

    if (!editTitle.trim()) {
      showNotification("Please enter an album title.", "error");
      return;
    }

    setIsSavingAlbum(true);
    try {
      const imageIds = targetGroup.items.map((i) => i._id);
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageIds,
          title: editTitle.trim(),
          category: editCategoryName || "Production",
          serviceCategory: editCategoryId || null,
          description: editDescription.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Album details updated successfully!", "success");
        if (selectedGroupTitle) {
          setSelectedGroupTitle(editTitle.trim());
        }
        setIsEditModalOpen(false);
        setEditingGroup(null);
        await fetchGalleryAndCategories();
      } else {
        showNotification(data.message || "Failed to update album details", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to update album details", "error");
    } finally {
      setIsSavingAlbum(false);
    }
  };

  // 🌟 Add More Photos to Active Album (Direct Upload without redirecting to manage page)
  const handleUploadNewAlbumPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingNewPhotos(true);
    try {
      const uploadedBatch: { url: string; publicId: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("folder", "gallery_site");

        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          uploadedBatch.push({ url: data.url, publicId: data.publicId });
        }
      }
      setNewAlbumImages((prev) => [...prev, ...uploadedBatch]);
      showNotification(`${uploadedBatch.length} photo(s) uploaded successfully!`, "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to upload some photos", "error");
    } finally {
      setIsUploadingNewPhotos(false);
    }
  };

  const removeNewAlbumImage = (index: number) => {
    setNewAlbumImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveNewPhotosToAlbum = async () => {
    if (!activeGroup) return;
    if (newAlbumImages.length === 0) {
      showNotification("Please select and upload at least one photo.", "error");
      return;
    }

    setIsSavingNewPhotos(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeGroup.title,
          category: activeGroup.category,
          serviceCategory: activeGroup.serviceCategory || null,
          images: newAlbumImages,
          isFeaturedOnHome: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`${newAlbumImages.length} photo(s) added to "${activeGroup.title}" successfully!`, "success");
        setIsAddPhotosModalOpen(false);
        setNewAlbumImages([]);
        await fetchGalleryAndCategories();
      } else {
        showNotification(data.message || "Failed to add photos to album", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to add photos to album", "error");
    } finally {
      setIsSavingNewPhotos(false);
    }
  };

  // Delete Gallery Item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Photo deleted successfully!", "success");
        fetchGalleryAndCategories();
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete image", "error");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(groupedGallery.length / itemsPerPage);

  const paginatedGroups = useMemo(() => {
    return groupedGallery.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [groupedGallery, currentPage, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lenux-emerald"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lenux-deep">Gallery Management</h1>
          <p className="text-lenux-darkGray mt-1">
            Organize photo albums by title, categorize by services, and manage showcases.
          </p>
        </div>

        {/* Upload Page Link */}
        <Link
          href="/admin/gallery/manage"
          className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Upload New Photos
        </Link>
      </div>

      {/* Notifications */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* =========================================================
          🌟 DETAIL ALBUM VIEW (Inside a specific Title Group)
          ========================================================= */}
      {activeGroup ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Return Banner */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setSelectedGroupTitle(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-lenux-emerald uppercase tracking-wider mb-2.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to Gallery Table
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-extrabold text-lenux-deep tracking-tight">
                  {activeGroup.title}
                </h2>
                <span className="px-2.5 py-0.5 bg-lenux-soft/40 border border-lenux-soft text-lenux-deep text-xs font-bold uppercase rounded-md">
                  {activeGroup.category}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">
                  {activeGroup.items.length} {activeGroup.items.length === 1 ? "Photo" : "Photos"}
                </span>
              </div>

              {activeGroup.items.some((i) => i.isFeaturedOnHome) && activeGroup.description && (
                <div className="mt-2 flex items-start gap-2">
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 mt-0.5">
                    Home Showcase
                  </span>
                  <p className="text-sm text-gray-500 max-w-3xl font-light leading-relaxed">
                    {activeGroup.description}
                  </p>
                </div>
              )}
            </div>

            {/* Actions: Edit Album & Add More Photos */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
              <button
                onClick={() => handleOpenEditModal(activeGroup)}
                className="inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-lenux-deep font-bold shadow-sm transition-all hover:border-lenux-emerald cursor-pointer"
              >
                <Edit size={16} className="text-lenux-emerald" /> Edit Album
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewAlbumImages([]);
                  setIsAddPhotosModalOpen(true);
                }}
                className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                <Plus size={16} /> Add More Photos to this Title
              </button>
            </div>
          </div>

          {/* Photo Grid inside this album */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-lenux-deep mb-4">
              Photos in this Album ({activeGroup.items.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activeGroup.items.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-lenux-emerald/40 transition-all duration-300"
                >
                  {/* Photo Display */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    <Image
                      src={item.image.url}
                      alt={item.title || "Gallery Photo"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Home Featured Star toggle */}
                    <button
                      onClick={() => handleToggleFeatured(item._id, item.isFeaturedOnHome || false)}
                      className={`absolute top-3 left-3 p-2 rounded-full transition-all shadow-md cursor-pointer ${
                        item.isFeaturedOnHome
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-black/60 text-white/80 hover:bg-black/85 hover:text-amber-400"
                      }`}
                      title={
                        item.isFeaturedOnHome
                          ? "Featured on Home (Click to remove)"
                          : "Click to feature on Home"
                      }
                    >
                      <Star size={15} fill={item.isFeaturedOnHome ? "currentColor" : "none"} />
                    </button>

                    <span className="absolute bottom-3 left-3 text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Description preview only if featured on home */}
                  {item.isFeaturedOnHome && item.description && (
                    <div className="px-3 py-2 bg-amber-50/40 border-t border-amber-100/60 text-[11px] text-gray-600 line-clamp-2">
                      <span className="font-bold text-amber-800">Home Description: </span>
                      {item.description}
                    </div>
                  )}

                  {/* Photo Actions Footer */}
                  <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {item.isFeaturedOnHome ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> Home Featured
                        </span>
                      ) : (
                        "Standard Photo"
                      )}
                    </span>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors cursor-pointer"
                      title="Delete this Photo"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
           🌟 MAIN ALBUM TABLE VIEW (With Search & Filters)
           ========================================================= */
        <div className="space-y-6">
          {/* SEARCH & FILTER TOOLBAR */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by album title or description..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lenux-emerald focus:border-transparent transition-all"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              {/* Category Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full sm:w-56 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lenux-emerald focus:border-transparent transition-all bg-white"
                >
                  <option value="all">All Categories ({gallery.length} photos)</option>
                  {filterOptions.map((opt) => {
                    const count = gallery.filter(
                      (i) => i.category.toLowerCase() === opt.toLowerCase()
                    ).length;
                    return (
                      <option key={opt} value={opt}>
                        {opt} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-lenux-emerald hover:underline font-semibold px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* ALBUM TABLE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-lenux-deep">
                  Photo Albums ({groupedGallery.length})
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Click on any album title or row to view all photos inside
                </p>
              </div>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-lenux-emerald hover:underline font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {groupedGallery.length === 0 ? (
              <div className="p-16 text-center text-gray-400">
                <Images size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No photo albums match your search or filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs text-lenux-darkGray uppercase tracking-wider">
                      <th className="p-4 font-bold w-24">Cover</th>
                      <th className="p-4 font-bold">Album Title</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold text-center">Photos</th>
                      <th className="p-4 font-bold text-center">Featured on Home</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedGroups.map((group) => {
                      const coverImage = group.items[0]?.image?.url;
                      const featuredCount = group.items.filter((i) => i.isFeaturedOnHome).length;

                      return (
                        <tr
                          key={group.title}
                          className="hover:bg-emerald-50/30 transition-colors group"
                        >
                          {/* Album Cover Thumbnail */}
                          <td className="p-4 align-middle w-24">
                            <div
                              onClick={() => setSelectedGroupTitle(group.title)}
                              className="relative w-20 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs cursor-pointer group-hover:border-lenux-emerald/50 group-hover:shadow-sm transition-all"
                              title="Click to open album"
                            >
                              {coverImage ? (
                                <Image
                                  src={coverImage}
                                  alt={group.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Images size={20} />
                                </div>
                              )}
                              <span className="absolute bottom-1 right-1 text-[9px] bg-black/75 backdrop-blur-xs text-white px-1.5 py-0.2 rounded font-mono">
                                {group.items.length}
                              </span>
                            </div>
                          </td>

                          {/* Album Title (Clickable) */}
                          <td className="p-4 align-middle">
                            <div className="space-y-1">
                              <button
                                type="button"
                                onClick={() => setSelectedGroupTitle(group.title)}
                                className="font-bold text-lenux-deep hover:text-lenux-emerald text-sm transition-colors text-left flex items-center gap-1.5 cursor-pointer group/btn"
                              >
                                <span className="group-hover/btn:underline">{group.title}</span>
                                <span className="text-xs text-lenux-emerald opacity-0 group-hover/btn:opacity-100 transition-opacity font-semibold">
                                  →
                                </span>
                              </button>
                              {group.description && (
                                <p className="text-xs text-gray-400 line-clamp-1 max-w-md">
                                  {group.description}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="p-4 align-middle whitespace-nowrap">
                            <span className="inline-block px-2.5 py-0.5 bg-lenux-soft/40 border border-lenux-soft text-lenux-deep text-[11px] font-bold uppercase rounded-md">
                              {group.category}
                            </span>
                          </td>

                          {/* Photos Count Badge */}
                          <td className="p-4 align-middle text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedGroupTitle(group.title)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-lenux-soft/40 hover:text-lenux-deep transition-colors cursor-pointer"
                              title="Click to view all photos"
                            >
                              <Images size={13} className="text-lenux-emerald" />
                              <span>
                                {group.items.length} {group.items.length === 1 ? "Photo" : "Photos"}
                              </span>
                            </button>
                          </td>

                          {/* Home Featured Status */}
                          <td className="p-4 align-middle text-center whitespace-nowrap">
                            {featuredCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                <Star size={12} fill="currentColor" className="text-amber-500" />
                                {featuredCount} Featured
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 font-medium">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 align-middle text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedGroupTitle(group.title)}
                                className="inline-flex items-center gap-1 text-xs font-bold text-lenux-emerald bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                title="Open Album to View Photos"
                              >
                                <span>View Photos</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(group)}
                                className="p-1.5 text-gray-500 hover:text-lenux-deep hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer"
                                title="Edit Album Details"
                              >
                                <Edit size={15} />
                              </button>

                              <Link
                                href={`/admin/gallery/manage?title=${encodeURIComponent(group.title)}&category=${encodeURIComponent(group.category)}`}
                                className="p-1.5 text-gray-500 hover:text-lenux-emerald hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer inline-flex items-center"
                                title="Add More Photos to this Title"
                              >
                                <Plus size={15} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 font-semibold bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          🌟 ALBUM EDIT MODAL
          ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-lenux-deep">Edit Album Details</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Updates Title, Category, and Description for all photos in this album ({(editingGroup || activeGroup)?.items.length || 0} photos)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingGroup(null);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                  Album Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g., Outdoor Signboard Installation"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                  Category
                </label>
                <select
                  value={editCategoryId}
                  onChange={(e) => {
                    const cId = e.target.value;
                    setEditCategoryId(cId);
                    const found = categoriesList.find((c) => c._id === cId);
                    if (found) setEditCategoryName(found.name);
                  }}
                  className="admin-input bg-white"
                >
                  {categoriesList.length === 0 && <option value="">Loading categories...</option>}
                  {categoriesList.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                  {editCategoryName && !categoriesList.some((c) => c.name === editCategoryName) && (
                    <option value={editCategoryId || "custom"}>{editCategoryName}</option>
                  )}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1.5">
                  Description <span className="text-gray-400 font-normal">(Optional — shown in album detail view)</span>
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="e.g., Outdoor signboard installation for commercial complex..."
                  className="admin-input bg-white resize-none"
                />
              </div>

              {/* Info note about per-photo feature — dynamic based on current featured count */}
              {(() => {
                const targetGroup = editingGroup || activeGroup;
                const featuredCount = targetGroup?.items.filter((i) => i.isFeaturedOnHome).length ?? 0;
                const totalCount = targetGroup?.items.length ?? 0;
                return (
                  <div className="rounded-2xl border overflow-hidden">
                    {featuredCount > 0 && (
                      <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                        <Star size={14} className="text-emerald-600 fill-emerald-500 shrink-0" />
                        <p className="text-xs text-emerald-800 font-semibold">
                          {featuredCount} of {totalCount} photo{totalCount !== 1 ? "s" : ""} in this album{" "}
                          {featuredCount === 1 ? "is" : "are"} currently featured on the Home Page Gallery.
                        </p>
                      </div>
                    )}
                    <div className="flex items-start gap-3 px-4 py-3 bg-amber-50/60 border-amber-100">
                      <Star size={14} className="text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        <span className="font-bold">Home Page Feature</span> is managed per-photo — open the album and tap the ⭐ star icon on any photo to feature or un-feature it individually.
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingGroup(null);
                  }}
                  disabled={isSavingAlbum}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAlbum}
                  className="btn-primary inline-flex items-center gap-2 text-xs px-5 py-2.5 rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSavingAlbum ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving Album...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Save Album Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          🌟 ADD MORE PHOTOS TO ALBUM MODAL
          ========================================================= */}
      {isAddPhotosModalOpen && activeGroup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-lenux-deep">Add More Photos</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Adding to album: <span className="font-semibold text-lenux-emerald">{activeGroup.title}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddPhotosModalOpen(false);
                  setNewAlbumImages([]);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1">
              {/* Upload Drop Zone */}
              <div className="relative">
                <label
                  htmlFor="addMorePhotosInput"
                  className={`flex flex-col items-center justify-center w-full min-h-[140px] rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    isUploadingNewPhotos
                      ? "border-lenux-emerald/60 bg-emerald-50/40"
                      : "border-gray-200 bg-gray-50/50 hover:border-lenux-emerald hover:bg-emerald-50/20"
                  }`}
                >
                  {isUploadingNewPhotos ? (
                    <div className="flex flex-col items-center gap-2 text-lenux-emerald">
                      <Loader2 size={28} className="animate-spin" />
                      <span className="text-sm font-semibold">Uploading photos...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Upload size={28} className="text-gray-300" />
                      <span className="text-sm font-semibold text-gray-500">Click to select photos</span>
                      <span className="text-xs text-gray-400">JPG, PNG, WebP — multiple files supported</span>
                    </div>
                  )}
                  <input
                    id="addMorePhotosInput"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleUploadNewAlbumPhotos}
                    disabled={isUploadingNewPhotos}
                  />
                </label>
              </div>

              {/* Uploaded Preview Grid */}
              {newAlbumImages.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-lenux-darkGray uppercase tracking-wider mb-3">
                    Ready to Add ({newAlbumImages.length} photo{newAlbumImages.length !== 1 ? "s" : ""})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {newAlbumImages.map((img, idx) => (
                      <div
                        key={img.publicId}
                        className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50"
                      >
                        <div className="relative h-32">
                          <Image
                            src={img.url}
                            alt={`New photo ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewAlbumImage(idx)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-red-600 shadow"
                          title="Remove this photo"
                        >
                          <X size={12} />
                        </button>
                        <div className="p-2 text-center text-[10px] text-gray-500 font-mono">#{idx + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 p-5 border-t border-gray-100 bg-gray-50/50 shrink-0">
              <span className="text-xs text-gray-400">
                {newAlbumImages.length === 0
                  ? "No photos selected yet"
                  : `${newAlbumImages.length} photo${newAlbumImages.length !== 1 ? "s" : ""} ready to save`}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPhotosModalOpen(false);
                    setNewAlbumImages([]);
                  }}
                  disabled={isSavingNewPhotos}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewPhotosToAlbum}
                  disabled={isSavingNewPhotos || newAlbumImages.length === 0}
                  className="btn-primary inline-flex items-center gap-2 text-xs px-5 py-2.5 rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSavingNewPhotos ? (
                    <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  ) : (
                    <><Check size={16} /> Add {newAlbumImages.length > 0 ? newAlbumImages.length : ""} Photo{newAlbumImages.length !== 1 ? "s" : ""} to Album</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}