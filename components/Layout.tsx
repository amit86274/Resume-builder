
import React from 'react';
import Navbar from './Navbar';
import { Sparkles, Linkedin, Chrome, Github } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user?: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentPage: string;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onNavigate, 
  onLogout, 
  currentPage,
  showNavbar = true,
  showFooter = true
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-inter">
      {showNavbar && <Navbar onNavigate={onNavigate} currentPage={currentPage} />}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-slate-950 text-slate-400 py-24 no-print border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center space-x-2 text-white">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter">ResuMaster AI</span>
              </div>
              <p className="max-w-md text-slate-500 font-medium leading-relaxed text-sm">
                India's premium AI career platform. Leveraging Gemini 3 to help professionals dominate the job market.
              </p>
              <div className="flex items-center space-x-6">
                <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Chrome className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-black text-xs uppercase tracking-widest">Solutions</h4>
              <ul className="space-y-4 text-xs font-bold">
                <li><button onClick={() => onNavigate('builder')} className="hover:text-blue-400 transition-colors uppercase tracking-wider">Resume Builder</button></li>
                <li><button onClick={() => onNavigate('templates')} className="hover:text-blue-400 transition-colors uppercase tracking-wider">Templates Gallery</button></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-black text-xs uppercase tracking-widest">Support</h4>
              <ul className="space-y-4 text-xs font-bold">
                <li><button onClick={() => onNavigate('blog')} className="hover:text-blue-400 transition-colors uppercase tracking-wider">Career Blog</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors uppercase tracking-wider">Contact Support</button></li>
                <li><button onClick={() => onNavigate('faq')} className="hover:text-blue-400 transition-colors uppercase tracking-wider">Help Center</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} ResuMaster AI India. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
