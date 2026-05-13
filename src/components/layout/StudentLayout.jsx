import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, ClipboardList, Bell, FileText, LogOut, User, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

const StudentLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Pendaftaran', path: '/daftar/A', icon: ClipboardList, match: '/daftar', protected: true },
    { name: 'Pengumuman', path: '/pengumuman', icon: Bell, protected: true },
    { name: 'Laporan & Kartu', path: '/laporan', icon: FileText, protected: true },
  ];

  const visibleMenuItems = menuItems.filter(item => !item.protected || user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-brand-blue text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center font-bold text-brand-blue text-xl">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MACE</h1>
              <p className="text-[10px] uppercase tracking-widest text-brand-gold/80 font-medium hidden xs:block">Beasiswa SDM Papua</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                  <User size={16} className="text-brand-gold" />
                  <span className="text-sm font-medium">{user?.mahasiswa?.nama_lengkap || user?.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="bg-brand-gold text-brand-blue px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Masuk Portal
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 relative">
        {/* Overlay for mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Sidebar Nav */}
        <aside className={cn(
          "fixed md:sticky md:top-28 inset-y-0 left-0 z-50 w-64 bg-slate-50 md:bg-transparent p-6 md:p-0 transition-transform duration-300 md:translate-x-0 flex-shrink-0",
          isMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}>
          <div className="md:hidden flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center font-bold text-white text-xl">M</div>
            <span className="font-bold text-slate-800 text-xl tracking-tight">MACE PORTAL</span>
          </div>

          <nav className="space-y-2">
            {visibleMenuItems.map((item) => {
              const isActive = item.match 
                ? location.pathname.startsWith(item.match)
                : location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-brand-blue text-white premium-shadow" 
                      : "hover:bg-white text-slate-600 hover:text-brand-blue"
                  )}
                >
                  <item.icon size={20} className={cn(isActive ? "text-brand-gold" : "text-slate-400 group-hover:text-brand-blue")} />
                  <span className="font-semibold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-3xl premium-shadow p-6 md:p-10 border border-slate-100 z-10">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Pemerintah Provinsi Papua. All Rights Reserved.
      </footer>
    </div>
  );
};

export default StudentLayout;
