import React, { useState } from 'react';
import Layout from '../components/Layout';
import Landing from '../pages/Landing';
import Builder from '../pages/Builder';
import Blog from '../pages/Blog';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Onboarding from '../pages/Onboarding';
import Toast, { ToastType } from '../components/Toast';
import { User, TemplateTier } from '../types';
import { TEMPLATES, MOCK_RESUME_DATA } from '../constants';
import { X, Eye, CheckCircle, Sparkles } from 'lucide-react';
import { MasterTemplateSelector } from '../components/ResumeTemplates';
import { useUser } from '../context/UserContext';
import { useRouter, usePathname, useSearchParams } from '../services/router';

const App: React.FC = () => {
  const { user, setUser, logout } = useUser();
  const { push, pathname } = useRouter();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const currentPage = pathname === '/' || pathname === '/landing' ? 'landing' : pathname.replace(/^\//, '');
  const selectedTemplateId = searchParams.get('template');

  const navigate = (page: string) => {
    push(page.startsWith('/') ? page : `/${page}`);
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setToast({ message: `Welcome, ${userData.name}!`, type: 'success' });
    navigate(userData.role === 'admin' ? 'admin' : 'dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <Landing onStart={() => navigate('templates')} onNavigate={navigate} />;
      case 'builder': return <Builder user={user || undefined} initialTemplateId={selectedTemplateId || undefined} />;
      case 'dashboard': return user ? <Dashboard user={user} onNavigate={navigate} onUpdateUser={setUser} /> : <Auth initialMode="login" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case 'admin': return user?.role === 'admin' ? <AdminDashboard /> : <Landing onStart={() => navigate('templates')} onNavigate={navigate} />;
      case 'login': return <Auth initialMode="login" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case 'signup': return <Auth initialMode="signup" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case 'blog': return <Blog onNavigate={navigate} />;
      case 'contact': return <Contact />;
      case 'faq': return <FAQ />;
      case 'analyzer': return <Onboarding onSelectUpload={() => navigate('builder')} />;
      case 'templates': return (
        <div className="bg-slate-50 min-h-screen py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Professional Designs</h2>
               <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">Choose from our curated collection of high-performance resume templates, engineered for ATS compatibility.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {TEMPLATES.map(t => (
                <div key={t.id} className="flex flex-col group cursor-pointer relative">
                  {t.tier === TemplateTier.PREMIUM && (
                    <div className="absolute top-4 right-4 z-20 bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-2" /> Premium
                    </div>
                  )}
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[2.5rem] border border-slate-200 shadow-[0_10px_40px_rgb(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[0_30px_80px_rgb(0,0,0,0.12)] group-hover:border-blue-300 bg-white group-hover:-translate-y-3">
                    <img 
                      src={t.thumbnail} 
                      alt={t.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4 px-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`builder?template=${t.id}`); }}
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-500 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Use Template</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPreviewTemplateId(t.id); }}
                        className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 hover:bg-slate-50 flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Full Preview</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-8 text-center px-4">
                    <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight">{t.name.split(':')[0]}</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{t.name.split(':')[1] || 'Corporate Professional'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {previewTemplateId && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setPreviewTemplateId(null)} />
              <div className="relative bg-white w-full max-w-[96vw] h-full max-h-[96vh] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row border border-white/20">
                <button onClick={() => setPreviewTemplateId(null)} className="absolute top-8 right-8 z-50 bg-slate-100 text-slate-900 p-3 rounded-full hover:bg-red-50 hover:text-red-600 transition-all shadow-xl"><X className="w-6 h-6" /></button>
                <div className="w-full md:w-[80%] bg-slate-100/50 p-6 md:p-12 overflow-y-auto flex justify-center items-start scrollbar-hide">
                  <div className="w-full max-w-[21cm] shadow-[0_40px_100px_rgba(0,0,0,0.1)] bg-white origin-top scale-[0.6] sm:scale-[0.85] lg:scale-[1.0] transition-transform duration-700">
                     <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: previewTemplateId }} />
                  </div>
                </div>
                <div className="w-full md:w-[20%] p-10 flex flex-col justify-between border-l border-slate-100 bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.03)]">
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">{TEMPLATES.find(t => t.id === previewTemplateId)?.name.split(':')[0]}</h2>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{TEMPLATES.find(t => t.id === previewTemplateId)?.tier} Design</p>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed text-[13px]">Engineered for maximum readability and recruiter engagement. Full ATS compliance guaranteed.</p>
                  </div>
                  <button onClick={() => navigate(`builder?template=${previewTemplateId}`)} className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 active:scale-95 whitespace-nowrap leading-none">Use this Template</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      default: return <Landing onStart={() => navigate('templates')} onNavigate={navigate} />;
    }
  };

  return (
    <Layout user={user} onNavigate={navigate} onLogout={() => { logout(); navigate('landing'); }} currentPage={currentPage}>
      {renderPage()}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
};

export default App;