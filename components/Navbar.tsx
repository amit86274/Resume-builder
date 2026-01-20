
import React, { useState } from 'react';
import { 
  Sparkles, FileText, Layers, 
  ChevronDown, LayoutDashboard, LogOut, Bell, Menu, X, BarChart 
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useRouter } from '../services/router';

interface NavbarProps {
  onNavigate?: (path: string) => void;
  currentPage?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage: propCurrentPage }) => {
  const { user, logout } = useUser();
  const { push, pathname } = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derive current page from pathname if not provided as a prop
  const currentPage = propCurrentPage || (pathname === '/' ? 'landing' : pathname.slice(1));

  const navItems = [
    { id: 'builder', label: 'Builder', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Layers },
  ];

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate('landing');
    else push('/landing');
  };

  const handleNavClick = (path: string) => {
    if (onNavigate) onNavigate(path);
    else push(`/${path}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] no-print h-20 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        <div className="flex items-center space-x-12">
          <button onClick={() => handleNavClick('landing')} className="flex items-center space-x-2.5 group">
            <div className="bg-blue-600 text-white p-2 rounded-[14px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">ResuMaster AI</span>
          </button>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all text-sm tracking-tight ${
                  currentPage === item.id 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50 font-semibold hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${currentPage === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
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
                      <button onClick={() => handleNavClick('dashboard')} className="w-full flex items-center space-x-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold text-sm transition-colors text-left">
                        <LayoutDashboard className="w-4 h-4" /> <span>My Dashboard</span>
                      </button>
                      {user.role === 'admin' && (
                        <button onClick={() => handleNavClick('admin')} className="w-full flex items-center space-x-3 px-5 py-3 text-purple-600 hover:bg-purple-50 font-bold text-sm transition-colors text-left">
                          <BarChart className="w-4 h-4" /> <span>Admin Console</span>
                        </button>
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
              <button onClick={() => handleNavClick('login')} className="text-slate-600 hover:text-blue-600 font-bold text-sm px-4">Login</button>
              <button 
                onClick={() => handleNavClick('signup')} 
                className="bg-animate-gradient text-white px-7 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 hover:opacity-90"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 space-y-3 lg:hidden shadow-2xl animate-in slide-in-from-top-4 duration-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl ${
                currentPage === item.id ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 font-semibold hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-lg">{item.label}</span>
            </button>
          ))}
          {!user && (
            <div className="pt-6 border-t border-slate-50 space-y-3">
              <button onClick={() => handleNavClick('login')} className="w-full py-4 text-center font-bold text-slate-600 rounded-2xl bg-slate-50">Login</button>
              <button 
                onClick={() => handleNavClick('signup')} 
                className="w-full py-4 text-center bg-animate-gradient text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
