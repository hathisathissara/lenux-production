"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Users, Image as ImageIcon, FileText, ArrowUpRight, Plus, MessageSquare } from "lucide-react";

interface Stats {
  totalServices: number;
  totalStaff: number;
  totalPortfolio: number;
  totalQuotes: number;
  newQuotes: number;
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
      title: "Total Services",
      value: stats?.totalServices ?? 0,
      icon: Briefcase,
      color: "bg-blue-500",
      link: "/admin/services"
    },
    {
      title: "Active Staff",
      value: stats?.totalStaff ?? 0,
      icon: Users,
      color: "bg-lenux-emerald",
      link: "/admin/staff"
    },
    {
      title: "Portfolio Projects",
      value: stats?.totalPortfolio ?? 0,
      icon: ImageIcon,
      color: "bg-purple-500",
      link: "/admin/portfolio"
    },
    {
      title: "Quote Requests",
      value: stats?.totalQuotes ?? 0,
      extra: stats?.newQuotes ? `${stats.newQuotes} New` : "0 New",
      icon: FileText,
      color: "bg-amber-500",
      link: "/admin/quotes"
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
      <div>
        <h1 className="text-3xl font-bold text-lenux-deep">Welcome, Admin!</h1>
        <p className="text-lenux-darkGray mt-1">Here is the quick overview of Lenux Production website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <p className="text-sm font-medium text-lenux-darkGray">{card.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-lenux-charcoal">{card.value}</span>
                  {card.extra && (
                    <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      {card.extra}
                    </span>
                  )}
                </div>
                <Link href={card.link} className="text-xs text-lenux-emerald hover:text-lenux-deep flex items-center gap-1 mt-2 font-medium">
                  View details <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className={`p-4 rounded-xl text-white ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-lenux-deep mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/services" className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-200 hover:border-lenux-emerald hover:bg-lenux-soft/10 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-lenux-soft text-lenux-deep rounded-lg group-hover:bg-lenux-emerald group-hover:text-white transition-all">
                <Plus size={20} />
              </div>
              <span className="font-medium text-sm text-lenux-charcoal">Add New Service</span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400 group-hover:text-lenux-emerald transition-all" />
          </Link>

          <Link href="/admin/portfolio" className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-200 hover:border-lenux-emerald hover:bg-lenux-soft/10 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-lenux-soft text-lenux-deep rounded-lg group-hover:bg-lenux-emerald group-hover:text-white transition-all">
                <Plus size={20} />
              </div>
              <span className="font-medium text-sm text-lenux-charcoal">Add Portfolio Project</span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400 group-hover:text-lenux-emerald transition-all" />
          </Link>

          <Link href="/admin/staff" className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-200 hover:border-lenux-emerald hover:bg-lenux-soft/10 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-lenux-soft text-lenux-deep rounded-lg group-hover:bg-lenux-emerald group-hover:text-white transition-all">
                <Plus size={20} />
              </div>
              <span className="font-medium text-sm text-lenux-charcoal">Add Staff Member</span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400 group-hover:text-lenux-emerald transition-all" />
          </Link>
        </div>
      </div>

    </div>
  );
}