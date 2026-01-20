'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import { Link, usePathname } from '../services/router';
import { Sparkles, Linkedin, Chrome, Github } from 'lucide-react';
import { UserProvider } from '../context/UserContext';

/**
 * Root Layout Component
 * Mimics Next.js app/layout.tsx behavior
 */
export default function RootLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/+/, '') || 'landing';

  // Immersive pages hide the standard Nav/Footer (e.g., Builder)
  const immersivePages = ['builder', 'resume-option', 'upload-method', 'direct-port'];
  const showNavFooter = !immersivePages.includes(normalizedPath);

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col bg-white selection:bg-blue-100">
        {showNavFooter && <Navbar currentPage={normalizedPath} />}
        
        <main className="flex-1">
          {children}
        </main>

        {showNavFooter && (
          <footer className="bg-slate-950 text-slate-400 py-24 no-print border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
              <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="flex items-center space-x-2 text-white">
                  <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter">ResuMaster AI</span>
                </div>
                <p className="max-w-md text-slate-500 font-medium leading-relaxed text-sm">
                  India's premium AI career platform. Leveraging Gemini 3 to help professionals dominate the job market.
                </p>
                <div className="flex items-center space-x-6">
                  <Linkedin className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-all hover:-translate-y-1" />
                  <Chrome className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-all hover:-translate-y-1" />
                  <Github className="w-5 h-5 hover:text-white cursor-pointer transition-all hover:-translate-y-1" />
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Solutions</h4>
                <ul className="space-y-4 text-[13px] font-bold">
                  <li><Link href="/builder" className="hover:text-blue-400 transition-colors uppercase tracking-widest block">Resume Builder</Link></li>
                  <li><Link href="/templates" className="hover:text-blue-400 transition-colors uppercase tracking-widest block">Templates Gallery</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Support</h4>
                <ul className="space-y-4 text-[13px] font-bold">
                  <li><Link href="/blog" className="hover:text-blue-400 transition-colors uppercase tracking-widest block">Career Hub</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-400 transition-colors uppercase tracking-widest block">Contact Support</Link></li>
                  <li><Link href="/faq" className="hover:text-blue-400 transition-colors uppercase tracking-widest block">Help Center</Link></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center">
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} ResuMaster AI India. All rights reserved.</p>
            </div>
          </footer>
        )}
      </div>
    </UserProvider>
  );
}