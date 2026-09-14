"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  ArrowUpRight, 
  Plus, 
  Building2, 
  MessageSquare, 
  Clock, 
  Phone,
  Sparkles
} from "lucide-react";

interface RecentQuote {
  _id: string;
  fullName: string;
  companyName?: string;
  phoneNumber: string;
  requiredService: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalServices: number;
  totalStaff: number;
  totalPortfolio: number;
  totalGallery: number;
  totalQuotes: number;
  newQuotes: number;
  totalClients: number;
  totalFeedback: number;
  recentQuotes?: RecentQuote[];
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Portfolio Projects",
      value: stats?.totalPortfolio ?? 0,
      icon: ImageIcon,
      color: "bg-emerald-500 text-emerald-600 bg-emerald-50 border-emerald-100",
      iconBg: "bg-emerald-500 text-white",
      link: "/admin/portfolio"
    },
    {
      title: "Gallery Showcase",
      value: stats?.totalGallery ?? 0,
      icon: Sparkles,
      color: "bg-purple-500 text-purple-600 bg-purple-50 border-purple-100",
      iconBg: "bg-purple-500 text-white",
      link: "/admin/gallery"
    },
    {
      title: "Services Offered",
      value: stats?.totalServices ?? 0,
      icon: Briefcase,
      color: "bg-blue-500 text-blue-600 bg-blue-50 border-blue-100",
      iconBg: "bg-blue-500 text-white",
      link: "/admin/services"
    },
    {
      title: "Quote Requests",
      value: stats?.totalQuotes ?? 0,
      extra: stats?.newQuotes ? `${stats.newQuotes} New` : "0 New",
      icon: FileText,
      color: "bg-amber-500 text-amber-600 bg-amber-50 border-amber-100",
      iconBg: "bg-amber-500 text-white",
      link: "/admin/quotes"
    },
    {
      title: "Active Team Staff",
      value: stats?.totalStaff ?? 0,
      icon: Users,
      color: "bg-teal-500 text-teal-600 bg-teal-50 border-teal-100",
      iconBg: "bg-teal-500 text-white",
      link: "/admin/staff"
    },
    {
      title: "Client Brands",
      value: stats?.totalClients ?? 0,
      icon: Building2,
      color: "bg-rose-500 text-rose-600 bg-rose-50 border-rose-100",
      iconBg: "bg-rose-500 text-white",
      link: "/admin/client-logos"
    }
  ];

  const quickActions = [
    {
      title: "Add Completed Project",
      subtitle: "Upload stage photos & project details",
      href: "/admin/portfolio/manage",
      icon: Plus,
      color: "text-lenux-emerald"
    },
    {
      title: "Upload Gallery Photos",
      subtitle: "Single or bulk upload photos to showcase",
      href: "/admin/gallery/manage",
      icon: Plus,
      color: "text-purple-600"
    },
    {
      title: "Add New Service",
      subtitle: "Create a new production or printing service",
      href: "/admin/services",
      icon: Briefcase,
      color: "text-blue-600"
    },
    {
      title: "Add Staff Member",
      subtitle: "Manage company team & profiles",
      href: "/admin/staff",
      icon: Users,
      color: "text-teal-600"
    },
    {
      title: "Manage Client Logos",
      subtitle: "Update trust logos displayed on homepage",
      href: "/admin/client-logos",
      icon: Building2,
      color: "text-rose-600"
    },
    {
      title: "Client Feedback & Reviews",
      subtitle: `${stats?.totalFeedback ?? 0} reviews recorded`,
      href: "/admin/feedback",
      icon: MessageSquare,
      color: "text-amber-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lenux-emerald"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lenux-deep">Welcome, Admin! 👋</h1>
          <p className="text-lenux-darkGray mt-1 text-sm">
            Overview and real-time management for Lenux Production website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio/manage"
            className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2.5 shadow-sm"
          >
            <Plus size={16} /> Add Project
          </Link>
          <Link
            href="/admin/gallery/manage"
            className="bg-white hover:bg-gray-50 text-lenux-deep border border-gray-200 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Sparkles size={16} className="text-lenux-emerald" /> Upload Gallery
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              href={card.link}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-lenux-charcoal">
                    {card.value}
                  </span>
                  {card.extra && (
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      {card.extra}
                    </span>
                  )}
                </div>
                <p className="text-xs text-lenux-emerald group-hover:underline flex items-center gap-1 font-semibold pt-1">
                  View and manage <ArrowUpRight size={12} />
                </p>
              </div>
              <div className={`p-3.5 rounded-2xl shadow-sm ${card.iconBg}`}>
                <Icon size={22} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-lenux-deep">Quick Management Actions</h2>
            <p className="text-xs text-gray-400 mt-0.5">Direct shortcuts to add or edit website content</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                className="flex items-start justify-between p-4 rounded-xl border border-gray-200/80 hover:border-lenux-emerald hover:bg-lenux-soft/10 transition-all group bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-lenux-soft text-lenux-deep rounded-xl group-hover:bg-lenux-emerald group-hover:text-white transition-all shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-lenux-charcoal group-hover:text-lenux-deep transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {action.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-gray-300 group-hover:text-lenux-emerald group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Quote Requests Section */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-lenux-deep">Recent Quote Requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest client inquiries submitted through the website</p>
          </div>
          <Link
            href="/admin/quotes"
            className="text-xs font-bold text-lenux-emerald hover:underline inline-flex items-center gap-1"
          >
            View All Quotes <ArrowUpRight size={13} />
          </Link>
        </div>

        {!stats?.recentQuotes || stats.recentQuotes.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FileText size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium">No quote requests received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] text-lenux-darkGray uppercase tracking-wider font-bold border-b border-gray-100">
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Service Requested</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentQuotes.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-lenux-charcoal">{q.fullName}</div>
                      {q.companyName && (
                        <span className="text-xs text-gray-400">{q.companyName}</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-lenux-soft text-lenux-deep">
                        {q.requiredService}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Phone size={11} className="text-gray-400" /> {q.phoneNumber}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          q.status === "New"
                            ? "bg-amber-100 text-amber-800"
                            : q.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}