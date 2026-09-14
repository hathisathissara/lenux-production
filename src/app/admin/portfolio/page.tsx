"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Trash, 
  Check, 
  AlertCircle, 
  Calendar, 
  User, 
  Edit, 
  Search, 
  X,
  ExternalLink
} from "lucide-react";

export default function PortfolioManagement() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Failed to load portfolio projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchData();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Delete Project
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio project and all its photos? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Project deleted successfully!", "success");
        fetchData();
      } else {
        showNotification(data.message || "Failed to delete project", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete project", "error");
    }
  };

  // Filter projects by search query (title, client name, service title, description)
  const filteredProjects = projects.filter((proj) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      proj.title?.toLowerCase().includes(q) ||
      proj.clientName?.toLowerCase().includes(q) ||
      proj.service?.title?.toLowerCase().includes(q) ||
      proj.description?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lenux-emerald"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lenux-deep">Portfolio Management</h1>
          <p className="text-lenux-darkGray mt-1 text-sm">
            Showcase completed projects with Before, Production, and Final Installation stages.
          </p>
        </div>
        <Link
          href="/admin/portfolio/manage"
          className="btn-primary inline-flex items-center justify-center gap-2 text-sm px-5 py-2.5 shrink-0 shadow-sm"
        >
          <Plus size={18} /> Add Completed Project
        </Link>
      </div>

      {/* Notification banner */}
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

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Search Bar & Stats Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-lenux-deep">All Projects</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-lenux-soft text-lenux-deep">
              {filteredProjects.length} {searchQuery ? `of ${projects.length}` : "total"}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, client, service..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lenux-emerald/30 focus:border-lenux-emerald transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content Table or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Search size={24} />
            </div>
            <h3 className="text-base font-bold text-lenux-deep mb-1">
              {searchQuery ? "No matching projects found" : "No portfolio projects yet"}
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-5">
              {searchQuery
                ? `No projects matched "${searchQuery}". Try searching for a different keyword or clear the search.`
                : "Get started by adding your first completed client project with before, production, and installation photos."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => handleSearchChange("")}
                className="px-4 py-2 text-xs font-semibold text-lenux-deep bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <Link
                href="/admin/portfolio/manage"
                className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2"
              >
                <Plus size={15} /> Add First Project
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] text-lenux-darkGray uppercase tracking-wider font-bold">
                  <th className="p-4 w-36">Cover</th>
                  <th className="p-4">Project Details</th>
                  <th className="p-4 w-44">Stage Photos</th>
                  <th className="p-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginatedProjects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Cover Thumbnail */}
                    <td className="p-4 align-top">
                      <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                        {proj.coverImage?.url ? (
                          <Image
                            src={proj.coverImage.url}
                            alt={proj.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Cover
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Project Details */}
                    <td className="p-4 align-top space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-lenux-charcoal text-base">{proj.title}</h4>
                        {proj.isFeatured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 bg-lenux-soft text-lenux-deep rounded-md uppercase tracking-wider">
                          {proj.service?.title || "Linked Service"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 max-w-xl">
                        {proj.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-lenux-darkGray pt-1 flex-wrap">
                        {proj.clientName && (
                          <span className="flex items-center gap-1 font-medium">
                            <User size={12} className="text-gray-400" /> {proj.clientName}
                          </span>
                        )}
                        {proj.completionDate && (
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar size={12} className="text-gray-400" />{" "}
                            {new Date(proj.completionDate).toLocaleDateString()}
                          </span>
                        )}
                        {proj.slug && (
                          <a
                            href={`/portfolio/${proj.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-lenux-emerald hover:underline text-[11px] font-medium"
                          >
                            <ExternalLink size={11} /> View Live
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Stage Photos Counter Badges */}
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-1.5 text-xs font-medium">
                        <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100">
                          <span className="text-gray-500 text-[11px]">Before:</span>
                          <span className={`text-[11px] font-bold ${proj.beforeImages?.length > 0 ? "text-lenux-deep" : "text-gray-400"}`}>
                            {proj.beforeImages?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100">
                          <span className="text-gray-500 text-[11px]">Production:</span>
                          <span className={`text-[11px] font-bold ${proj.productionImages?.length > 0 ? "text-lenux-deep" : "text-gray-400"}`}>
                            {proj.productionImages?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                          <span className="text-emerald-800 text-[11px] font-semibold">Installation:</span>
                          <span className="text-[11px] font-bold text-emerald-800">
                            {proj.installationImages?.length || 0}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="p-4 align-middle text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/admin/portfolio/manage?id=${proj._id}`}
                        className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        title="Edit Project"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(proj._id)}
                        className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Delete Project"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600 font-medium">
                  Page <span className="font-bold text-lenux-deep">{currentPage}</span> of{" "}
                  <span className="font-bold text-lenux-deep">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
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