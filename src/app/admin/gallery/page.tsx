"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Trash, Check, AlertCircle, Star, Search, Filter, Edit } from "lucide-react";

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

interface ServiceItem {
  _id: string;
  title: string;
  category?: { _id: string; name: string };
}

export default function GalleryManagementPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchGalleryAndServices = async () => {
    try {
      const [galleryRes, servicesRes] = await Promise.all([
        fetch("/api/admin/gallery"),
        fetch("/api/admin/services")
      ]);
      
      const galleryData = await galleryRes.json();
      const servicesData = await servicesRes.json();
      
      if (galleryData.success) {
        setGallery(galleryData.data);
      }
      
      if (servicesData.success && servicesData.data.length > 0) {
        setServicesList(servicesData.data);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGalleryAndServices();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // 🌟 Dynamic Filter Options (All Services from DB + existing gallery categories)
  const filterOptions = useMemo(() => {
    const serviceTitles = servicesList.map((s) => s.title);
    const galleryCategories = gallery.map((g) => g.category).filter(Boolean);
    return Array.from(new Set([...serviceTitles, ...galleryCategories]));
  }, [servicesList, gallery]);

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
        fetchGalleryAndServices();
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
        fetchGalleryAndServices();
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete image", "error");
    }
  };

  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
  const paginatedItems = filteredGallery.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <p className="text-lenux-darkGray mt-1">Manage, categorize by services, and organize visual showcase photos.</p>
        </div>

        {/* 🌟 Upload Page Link */}
        <Link
          href="/admin/gallery/manage"
          className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Upload New Photos
        </Link>
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

      {/* 🌟 SEARCH & SERVICE FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lenux-emerald focus:border-transparent transition-all"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Service Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lenux-emerald focus:border-transparent transition-all bg-white"
          >
            <option value="all">All Services ({gallery.length})</option>
            {filterOptions.map((opt) => {
              const count = gallery.filter((i) => i.category.toLowerCase() === opt.toLowerCase()).length;
              return (
                <option key={opt} value={opt}>
                  {opt} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* GALLERY TABLE */}
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
                {paginatedItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 align-top w-28">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                        <Image src={item.image.url} alt={item.title || "Gallery"} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="space-y-1">
                        <h4 className="font-bold text-lenux-charcoal text-sm">{item.title || "Untitled"}</h4>
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
                    <td className="p-4 align-middle text-right w-32">
                      <div className="flex items-center justify-end gap-1">
                        {/* 🌟 Edit Button - Navigates to /admin/gallery/manage?id=... */}
                        <Link
                          href={`/admin/gallery/manage?id=${item._id}`}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all inline-flex items-center justify-center"
                          title="Edit Photo Details"
                        >
                          <Edit size={16} />
                        </Link>
                        {/* Delete Button */}
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/30">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500 font-semibold bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
    </div>
  );
}