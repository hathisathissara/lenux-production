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
  LayoutGrid,
  List,
} from "lucide-react";

interface GalleryItem {
  _id: string;
  title?: string;
  description?: string;
  category: string;
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

  // View Mode: 'grouped' (Album Cards) or 'table' (Flat List)
  const [viewMode, setViewMode] = useState<"grouped" | "table">("grouped");

  // Pagination State for Table & Grouped views
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grouped" ? 9 : 8;

  const [message, setMessage] = useState({ text: "", type: "" });

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
          description: item.description,
          items: [],
        });
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
  const totalItemsCount = viewMode === "grouped" ? groupedGallery.length : filteredGallery.length;
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  const paginatedGroups = useMemo(() => {
    return groupedGallery.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [groupedGallery, currentPage, itemsPerPage]);

  const paginatedTableItems = useMemo(() => {
    return filteredGallery.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredGallery, currentPage, itemsPerPage]);

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
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-lenux-emerald uppercase tracking-wider mb-2.5 transition-colors"
              >
                <ArrowLeft size={16} /> Back to All Title Albums
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

              {activeGroup.description && (
                <p className="text-sm text-gray-500 mt-2 max-w-3xl font-light leading-relaxed">
                  {activeGroup.description}
                </p>
              )}
            </div>

            {/* Quick action to add more photos to this group */}
            <Link
              href={`/admin/gallery/manage?title=${encodeURIComponent(activeGroup.title)}&category=${encodeURIComponent(activeGroup.category)}`}
              className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl shadow-md self-start md:self-center shrink-0"
            >
              <Plus size={16} /> Add More Photos to this Title
            </Link>
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
                      className={`absolute top-3 left-3 p-2 rounded-full transition-all shadow-md ${
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

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/gallery/manage?id=${item._id}`}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-colors"
                        title="Edit Photo Details / Replace"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors"
                        title="Delete this Photo"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
           🌟 MAIN ALBUM / ALL PHOTOS VIEW (With Search & Filters)
           ========================================================= */
        <div className="space-y-6">
          {/* SEARCH & FILTER TOOLBAR */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by title or description..."
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
                  <option value="all">All Categories ({gallery.length})</option>
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

              {/* View Switcher: Grouped Albums vs Flat Table */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => {
                    setViewMode("grouped");
                    setCurrentPage(1);
                  }}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === "grouped"
                      ? "bg-white text-lenux-deep shadow-sm"
                      : "text-gray-500 hover:text-lenux-deep"
                  }`}
                  title="Title Group Cards View"
                >
                  <LayoutGrid size={15} />
                  <span className="hidden sm:inline">Albums</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode("table");
                    setCurrentPage(1);
                  }}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === "table"
                      ? "bg-white text-lenux-deep shadow-sm"
                      : "text-gray-500 hover:text-lenux-deep"
                  }`}
                  title="Table View"
                >
                  <List size={15} />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================
              VIEW 1: TITLE GROUP ALBUM CARDS
              ========================================================= */}
          {viewMode === "grouped" ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-lenux-deep">
                  Title Albums ({groupedGallery.length})
                </h3>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedGroups.map((group) => {
                    const coverImage = group.items[0]?.image?.url;
                    const featuredCount = group.items.filter((i) => i.isFeaturedOnHome).length;

                    return (
                      <div
                        key={group.title}
                        onClick={() => setSelectedGroupTitle(group.title)}
                        className="bg-white rounded-2xl border border-gray-100 hover:border-lenux-emerald/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
                      >
                        {/* Album Cover & Badges */}
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          {coverImage ? (
                            <Image
                              src={coverImage}
                              alt={group.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Images size={36} />
                            </div>
                          )}

                          {/* Gradient overlay on bottom */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                          {/* Category Badge (Top Right) */}
                          <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold uppercase rounded-full border border-white/10">
                            {group.category}
                          </span>

                          {/* Home Featured Indicator (Top Left) */}
                          {featuredCount > 0 && (
                            <span className="absolute top-3 left-3 bg-amber-500/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <Star size={11} fill="currentColor" /> {featuredCount} Featured
                            </span>
                          )}

                          {/* Photos Count Pill (Bottom Right) */}
                          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                            <Images size={13} className="text-lenux-emerald" />
                            <span>
                              {group.items.length}{" "}
                              {group.items.length === 1 ? "Photo" : "Photos"}
                            </span>
                          </div>
                        </div>

                        {/* Album Details */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-lenux-deep text-base group-hover:text-lenux-emerald transition-colors line-clamp-1">
                              {group.title}
                            </h4>
                            {group.description && (
                              <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 font-light leading-relaxed">
                                {group.description}
                              </p>
                            )}
                          </div>

                          {/* Card Footer Call to Action */}
                          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-lenux-emerald font-semibold">
                            <span>Open Album ({group.items.length} photos)</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* =========================================================
                VIEW 2: FLAT TABLE VIEW (Original)
                ========================================================= */
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-lenux-deep">
                  Photos List ({filteredGallery.length})
                </h3>
                {(searchQuery || selectedCategory !== "all") && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-lenux-emerald hover:underline font-semibold"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {filteredGallery.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <p className="text-sm font-medium">No gallery photos match your search or filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-xs text-lenux-darkGray uppercase tracking-wider">
                        <th className="p-4 font-bold">Image</th>
                        <th className="p-4 font-bold">Details</th>
                        <th className="p-4 font-bold text-center">Featured on Home</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedTableItems.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 align-top w-28">
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                              <Image
                                src={item.image.url}
                                alt={item.title || "Gallery"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="space-y-1">
                              <h4 className="font-bold text-lenux-charcoal text-sm">
                                {item.title || "Untitled"}
                              </h4>
                              <span className="inline-block px-2.5 py-0.5 bg-lenux-soft/40 border border-lenux-soft text-lenux-deep text-[11px] font-bold uppercase rounded-md">
                                {item.category}
                              </span>
                              {item.description && (
                                <p className="text-xs text-gray-500 line-clamp-2 max-w-xl mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-4 align-middle text-center w-36">
                            <button
                              onClick={() =>
                                handleToggleFeatured(item._id, item.isFeaturedOnHome || false)
                              }
                              className={`p-2 rounded-full transition-all mx-auto flex items-center justify-center shadow-sm ${
                                item.isFeaturedOnHome
                                  ? "bg-amber-100 border border-amber-200 text-amber-600 hover:bg-amber-200"
                                  : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-amber-500"
                              }`}
                              title={
                                item.isFeaturedOnHome
                                  ? "Remove from Home Page"
                                  : "Feature on Home Page"
                              }
                            >
                              <Star
                                size={16}
                                fill={item.isFeaturedOnHome ? "currentColor" : "none"}
                              />
                            </button>
                          </td>
                          <td className="p-4 align-middle text-right w-32">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/admin/gallery/manage?id=${item._id}`}
                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all inline-flex items-center justify-center"
                                title="Edit Photo Details"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all inline-flex items-center justify-center"
                                title="Delete Photo"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 font-semibold bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}