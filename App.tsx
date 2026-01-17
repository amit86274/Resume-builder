import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Builder from './pages/Builder';
import Onboarding from './pages/Onboarding';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Toast, { ToastType } from './components/Toast';
import { User, TemplateTier } from './types';
import { TEMPLATES, MOCK_RESUME_DATA } from './constants';
import { Sparkles, Eye, X, Star } from 'lucide-react';
import { MasterTemplateSelector } from './components/ResumeTemplates';
import { useUser } from './context/UserContext';
import { useRouter, usePathname, useSearchParams } from './services/router';

/**
 * Miniature component for template cards - Zoomed & Wider
 */
const TemplateCardMiniature: React.FC<{ templateId: string }> = ({ templateId }) => {
  return (
    <div className="w-full h-full bg-slate-50 flex justify-center items-start overflow-hidden relative rounded-xl">
      <div 
        className="bg-white shadow-sm origin-top transition-transform duration-700"
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          transform: 'scale(0.55)',
          marginTop: '0px'
        }}
      >
        <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId }} />
      </div>
    </div>
  );
};

/**
 * Main Application Controller
 * Synchronized with the URL via RouterProvider hooks.
 */
const App: React.FC = () => {
  const { user, setUser, logout } = useUser();
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // Derive current page from URL
  const currentPage = pathname === '/' || pathname === '/landing' ? 'landing' : pathname.replace(/^\//, '');
  const selectedTemplateId = searchParams.get('template');

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const navigate = (page: string) => {
    const targetPath = page.startsWith('/') ? page : `/${page}`;
    push(targetPath);
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    showToast(`Welcome, ${userData.name}!`, 'success');
    // Intelligent redirect after auth
    navigate(userData.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    logout();
    showToast('Successfully logged out.', 'info');
    navigate('landing');
  };

  const handleSelectTemplate = (id: string) => {
    navigate(`builder?template=${id}`);
    showToast(`Template selected. Start building!`, 'success');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onStart={() => navigate('templates')} onNavigate={navigate} />;
      case 'builder':
        return <Builder user={user || undefined} initialTemplateId={selectedTemplateId || undefined} />;
      case 'dashboard':
        return user ? <Dashboard user={user} onNavigate={navigate} onUpdateUser={setUser} /> : <Auth initialMode="login" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard /> : <Landing onStart={() => navigate('templates')} onNavigate={navigate} />;
      case 'login':
        return <Auth initialMode="login" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case 'signup':
        return <Auth initialMode="signup" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case 'blog':
        return <Blog onNavigate={navigate} />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ />;
      case 'analyzer':
        return <Onboarding onSelectUpload={() => navigate('builder')} />;
      case 'templates':
        return (
          <div className="bg-[#fcfcfc] min-h-screen relative font-inter">
            {/* Premium Header */}
            <div className="bg-white border-b border-slate-100 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 text-center">
                <div className="flex flex-col items-center space-y-8">
                  <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                    <Star className="w-4 h-4 mr-3 fill-current" /> India's Premium Choice
                  </div>
                  <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                    Select Your Layout
                  </h1>
                  <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl">
                    Every template is built with recruiter insights and ATS logic. 
                    Optimized for top Indian companies and global enterprises.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto py-20 px-6">
              <div className={`flex justify-center ${TEMPLATES.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16' : ''}`}>
                {TEMPLATES.map(t => (
                  <div key={t.id} className="flex flex-col group max-w-lg w-full">
                    <div className="aspect-[3/2] overflow-hidden relative rounded-2xl border border-slate-200 shadow-md group-hover:shadow-2xl transition-all duration-700 bg-white p-1">
                      {/* Live zoomed miniature preview */}
                      <TemplateCardMiniature templateId={t.id} />
                      
                      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center space-y-4 px-10 text-center rounded-2xl">
                         <button 
                           onClick={() => handleSelectTemplate(t.id)}
                           className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-500 transition-all"
                         >
                           Use Template
                         </button>
                         <button 
                           onClick={() => setPreviewTemplateId(t.id)}
                           className="w-full max-w-xs bg-white text-slate-900 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center hover:bg-slate-50 transition-all"
                         >
                           <Eye className="w-4 h-4 mr-2" /> Live Preview
                         </button>
                      </div>
                      {t.tier === TemplateTier.PREMIUM && (
                        <div className="absolute top-6 right-6 bg-amber-500 text-white text-[8px] z-10 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20">PRO</div>
                      )}
                    </div>
                    <div className="mt-8 space-y-2 text-center">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{t.name}</h3>
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">ATS Verified • {t.tier === TemplateTier.FREE ? 'Free' : 'Premium'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Modal */}
            {previewTemplateId && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setPreviewTemplateId(null)} />
                <div className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
                  <button onClick={() => setPreviewTemplateId(null)} className="absolute top-8 right-8 z-50 bg-slate-900 text-white p-4 rounded-2xl hover:bg-red-500 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                  <div className="w-full md:w-[65%] bg-slate-50 p-12 overflow-y-auto flex justify-center">
                    <div className="w-full max-w-[21cm] shadow-2xl bg-white origin-top scale-[0.6] sm:scale-[0.8] lg:scale-[0.9] transition-transform duration-700">
                       <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: previewTemplateId }} />
                    </div>
                  </div>
                  <div className="w-full md:w-[35%] p-12 flex flex-col justify-between border-l border-slate-100 bg-white">
                    <div className="space-y-12">
                      <div className="inline-flex items-center px-6 py-2.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 mr-3" /> Professional Inspection
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">
                        {TEMPLATES.find(t => t.id === previewTemplateId)?.name}
                      </h2>
                      <p className="text-base text-slate-500 font-medium leading-relaxed">
                        Design focused on legibility and career-focused hierarchy. 
                        Engineered to help you land the first interview.
                      </p>
                      <ul className="space-y-4">
                        {['99.9% ATS Score', 'Modern Typography', 'Perfect Layout', 'Mobile Ready'].map(f => (
                          <li key={f} className="flex items-center text-[11px] font-black text-slate-900 tracking-widest uppercase">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-4 shadow-lg" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button 
                      onClick={() => handleSelectTemplate(previewTemplateId)}
                      className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 transition-all shadow-2xl active:scale-[0.98]"
                    >
                      Use this format
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <Landing onStart={() => navigate('templates')} onNavigate={navigate} />;
    }
  };

  return (
    <Layout user={user} onNavigate={navigate} onLogout={handleLogout} currentPage={currentPage}>
      {renderPage()}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </Layout>
  );
};

export default App;