
import React from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, FileText, Settings, BarChart, BookOpen, Layers, FileSearch } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user?: any;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => {
        onNavigate(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
        currentPage === id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <button onClick={() => onNavigate('landing')} className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">ResuMaster AI</span>
              </button>

              <div className="hidden lg:flex items-center space-x-1">
                <NavItem id="builder" label="Resume Builder" icon={FileText} />
                <NavItem id="analyzer" label="Resume Analyzer" icon={FileSearch} />
                <NavItem id="cover-letter" label="Cover Letter" icon={BookOpen} />
                <NavItem id="templates" label="Templates" icon={Layers} />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                  {user.role === 'admin' && <NavItem id="admin" label="Admin" icon={BarChart} />}
                  <div className="h-6 w-px bg-gray-200 mx-2" />
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>
                  <button onClick={() => window.location.reload()} className="p-2 text-gray-400 hover:text-red-500">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => onNavigate('login')} className="text-gray-600 hover:text-blue-600 font-medium px-4 text-sm">Login</button>
                  <button onClick={() => onNavigate('builder')} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">Get Started</button>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-1">
            <NavItem id="builder" label="Resume Builder" icon={FileText} />
            <NavItem id="analyzer" label="Resume Analyzer" icon={FileSearch} />
            <NavItem id="cover-letter" label="Cover Letter" icon={BookOpen} />
            <NavItem id="templates" label="Templates" icon={Layers} />
            <div className="border-t border-gray-100 my-2 pt-2" />
            {user ? (
              <>
                <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                {user.role === 'admin' && <NavItem id="admin" label="Admin" icon={BarChart} />}
                <button className="w-full text-left px-4 py-2 text-gray-600 text-sm">Profile Settings</button>
                <button className="w-full text-left px-4 py-2 text-red-500 text-sm">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('login')} className="w-full text-left px-4 py-2 text-gray-600 text-sm">Login</button>
                <button onClick={() => onNavigate('builder')} className="w-full text-left px-4 py-2 text-blue-600 font-semibold text-sm">Get Started</button>
              </>
            )}
          </div>
        )}
      </nav>

      <main className="flex-1 overflow-auto">
        {children}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-white mb-4">
              <FileText className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">ResuMaster AI</span>
            </div>
            <p className="max-w-xs text-sm">Building careers with AI. The smartest way to build, analyze, and optimize your resume for professional success.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('builder')} className="hover:text-white">Resume Builder</button></li>
              <li><button onClick={() => onNavigate('analyzer')} className="hover:text-white">Resume Analyzer</button></li>
              <li><button onClick={() => onNavigate('cover-letter')} className="hover:text-white">Cover Letter</button></li>
              <li><button onClick={() => onNavigate('templates')} className="hover:text-white">Templates</button></li>
              <li><button onClick={() => onNavigate('blog')} className="hover:text-white">Career Blog</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white">Contact Us</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-white">FAQ</button></li>
              <li><button className="hover:text-white">Privacy Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-xs">&copy; {new Date().getFullYear()} ResuMaster AI. All rights reserved. Made for job seekers in India.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
