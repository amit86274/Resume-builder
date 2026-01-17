
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
 * Live rendered miniature showing the full resume preview
 */
const TemplateCardMiniature: React.FC<{ templateId: string }> = ({ templateId }) => {
  return (
    <div className="w-full h-full bg-slate-100 flex justify-center items-start overflow-hidden relative group-hover:bg-slate-200 transition-colors">
      <div 
        className="bg-white shadow-2xl origin-top transition-transform duration-700"
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          transform: 'scale(0.18)', /* Scale factor to fit full A4 in the card */
          marginTop: '12px'
        }}
      >
        <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId }} />
      </div>
    </div>
  );
};

/**
 * Main Application Controller
 */
const App: React.FC = () => {
  const { user, setUser, logout } = useUser();
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

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
          <div className="bg-white min-h-screen py-16 px-6 font-inter">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Select Your Professional Style</h2>
                 <p className="text-slate-500 mt-2">All formats are strictly ATS-compliant and recruiter-approved.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 justify-center">
                {TEMPLATES.map(t => (
                  <div key={t.id} className="flex flex-col group cursor-pointer" onClick={() => setPreviewTemplateId(t.id)}>
                    <div className="aspect-[210/297] overflow-hidden relative rounded-md border border-slate-200 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-400 bg-white">
                      <TemplateCardMiniature templateId={t.id} />
                      
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          Preview & Edit
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="text-[15px] font-semibold text-slate-900 leading-tight">
                        {t.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Modal */}
            {previewTemplateId && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setPreviewTemplateId(null)} />
                <div className="relative bg-white w-full max-w-7xl h-full max-h-[92vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
                  <button 
                    onClick={() => setPreviewTemplateId(null)} 
                    className="absolute top-6 right-6 z-50 bg-slate-100 text-slate-900 p-3 rounded-full hover:bg-red-50 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="w-full md:w-[65%] bg-slate-50 p-6 md:p-12 overflow-y-auto flex justify-center items-start">
                    <div className="w-full max-w-[21cm] shadow-2xl bg-white origin-top scale-[0.6] sm:scale-[0.8] lg:scale-[0.9]">
                       <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: previewTemplateId }} />
                    </div>
                  </div>
                  <div className="w-full md:w-[35%] p-10 md:p-16 flex flex-col justify-between border-l border-slate-100 bg-white">
                    <div className="space-y-10">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        {TEMPLATES.find(t => t.id === previewTemplateId)?.name}
                      </h2>
                      <p className="text-slate-500 font-medium leading-relaxed">
                        Standard professional format designed for maximum recruiter impact. 100% ATS-proof and visually balanced.
                      </p>
                    </div>
                    <button 
                      onClick={() => handleSelectTemplate(previewTemplateId)}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all"
                    >
                      Use template
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
