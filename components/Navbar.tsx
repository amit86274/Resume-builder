
import React, { useState } from 'react';
import { 
  Sparkles, FileText, Layers, 
  ChevronDown, LayoutDashboard, LogOut, Bell, Menu, X, BarChart 
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useRouter, Link } from '../lib/router';

interface NavbarProps {
  currentPage?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { user, logout } = useUser();
  const { push } = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'builder', label: 'Builder', icon: FileText, href: '/builder' },
    { id: 'templates', label: 'Templates', icon: Layers, href: '/templates' },
  ];

  const handleLogout = () => {
    logout();
    push('/landing');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] no-print h-20 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="bg-blue-600 text-white p-2 rounded-[14px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">ResuMaster AI</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all text-sm tracking-tight ${
                  currentPage === item.id 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50 font-semibold hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${currentPage === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <div className="flex items-center space-x-5">
              <button className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100"
                >
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-[12px] flex items-center justify-center font-black shadow-md">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user.name}</p>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{user.plan} Account</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-[24px] shadow-2xl border border-slate-100 py-3 z-20 animate-in fade-in slide-in-from-top-2">
                      <div className="px-5 py-3 border-b border-slate-50 mb-2">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="w-full flex items-center space-x-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold text-sm transition-colors text-left">
                        <LayoutDashboard className="w-4 h-4" /> <span>My Dashboard</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="w-full flex items-center space-x-3 px-5 py-3 text-purple-600 hover:bg-purple-50 font-bold text-sm transition-colors text-left">
                          <BarChart className="w-4 h-4" /> <span>Admin Console</span>
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-5 py-3 text-red-500 hover:bg-red-50 font-bold text-sm transition-colors text-left">
                        <LogOut className="w-4 h-4" /> <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth?mode=login" className="text-slate-600 hover:text-blue-600 font-bold text-sm px-4">Login</Link>
              <Link 
                href="/auth?mode=signup" 
                className="bg-animate-gradient text-white px-7 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
