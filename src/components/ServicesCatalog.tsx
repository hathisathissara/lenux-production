"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, CheckCircle2, Layers, Sparkles } from "lucide-react";

interface ServicesCatalogProps {
  categories: any[];
  services: any[];
}

export default function ServicesCatalog({ categories, services }: ServicesCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Category සහ Search Query එක අනුව Services Filter කිරීම
  const filteredServices = services.filter((service) => {
    const matchesCategory = 
      selectedCategory === "all" || 
      service.category?._id === selectedCategory || 
      service.category?.slug === selectedCategory;

    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      
      {/* SEARCH & CATEGORY FILTER BAR */}
      <div className="space-y-6">
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search any service (e.g. Sticker Print, Light Board, Vehicle Branding)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-2xl px-6 py-4 pl-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lenux-emerald transition-all shadow-xl"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar justify-start sm:justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-lenux-emerald text-white shadow-lg shadow-lenux-emerald/30 scale-105"
                : "bg-[#0d0d0d] text-gray-400 border border-white/5 hover:border-lenux-emerald/50 hover:text-white"
            }`}
          >
            All Services ({services.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat._id
                  ? "bg-lenux-emerald text-white shadow-lg shadow-lenux-emerald/30 scale-105"
                  : "bg-[#0d0d0d] text-gray-400 border border-white/5 hover:border-lenux-emerald/50 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* SERVICES GRID */}
      {filteredServices.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-xl mx-auto">
          <Layers size={48} className="mx-auto text-lenux-emerald opacity-60" />
          <h4 className="text-xl font-bold text-white">No Services Found</h4>
          <p className="text-sm text-gray-400 font-light">
            We couldn't find any services matching your search. Please try a different keyword or category.
          </p>
          <button 
            onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-lenux-emerald hover:bg-lenux-emerald hover:text-white transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="rounded-3xl bg-[#090909] border border-white/5 overflow-hidden hover:border-lenux-emerald/40 transition-all duration-500 group shadow-2xl flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative w-full h-60 bg-gray-900 overflow-hidden">
                  {service.image?.url ? (
                    <Image
                      src={service.image.url}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-lenux-emerald">
                    {service.category?.name || "Production"}
                  </span>
                </div>

                <div className="p-7 space-y-3">
                  <h4 className="text-xl font-bold text-white group-hover:text-lenux-emerald transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-xs text-gray-300 font-light leading-relaxed line-clamp-3">
                    {service.shortDescription || service.description}
                  </p>
                </div>
              </div>

              {/* 🌟 Action Bar: Request Quote වෙනුවට View Projects (Portfolio Filter) වෙත යොමු වේ */}
              <div className="p-7 pt-0 flex items-center justify-between border-t border-white/5 mt-4 pt-4">
                <Link
                  href={`/portfolio?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lenux-emerald hover:text-white transition-colors"
                >
                  View Related Projects <ArrowRight size={14} />
                </Link>
                
                <span className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-lenux-emerald" /> High Quality
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}