"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Image as ImageIcon, FileText, Settings, LogOut, Briefcase,MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // 1. ඔයා ඉන්නේ Login පිටුවේ නම්, Sidebar එක නැතුව කෙලින්ම Page එක පෙන්නනවා
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 2. Sidebar Navigation Items
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Team / Staff', href: '/admin/staff', icon: Users },
    { name: 'Quote Requests', href: '/admin/quotes', icon: FileText },
    { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // Logout Function
  const handleLogout = async () => {
    try {
      // Call the API route to clear the httpOnly cookie
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-lenux-offWhite font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-lenux-deep text-white flex flex-col shadow-xl z-20 shrink-0">
        <div className="p-6 border-b border-lenux-dark">
          <h2 className="text-2xl font-bold text-lenux-emerald tracking-wider uppercase">Lenux</h2>
          <p className="text-xs text-lenux-soft mt-1 tracking-widest">PRODUCTION</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                  ? 'bg-lenux-emerald text-white shadow-md' 
                  : 'text-gray-300 hover:bg-lenux-dark hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-lenux-dark">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 w-full px-4 py-3 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        {/* මේ children කියන තැනට තමයි අනිත් Pages (Dashboard, Services වගේ දේවල්) load වෙන්නේ */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}