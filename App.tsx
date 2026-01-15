
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Builder from './pages/Builder';
import Onboarding from './pages/Onboarding';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import { User } from './types';
import { TEMPLATES } from './constants';

// Simple mock user for demo
const MOCK_USER: User = {
  id: 'user123',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  role: 'user',
  plan: 'free',
  resumeCount: 1
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<User | null>(null);

  // Persistence simulation
  useEffect(() => {
    const savedPage = window.location.hash.replace('#', '') || 'landing';
    setCurrentPage(savedPage);
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  };

  const handleStart = () => {
    setUser(MOCK_USER); // In real app, this would be login flow
    navigate('builder');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onStart={handleStart} onNavigate={navigate} />;
      case 'builder':
        return <Builder user={user || undefined} />;
      case 'analyzer':
        return (
          <Onboarding 
            onSelectScratch={() => navigate('builder')} 
            onSelectUpload={() => navigate('builder')} // In real flow, this would trigger file upload
          />
        );
      case 'blog':
        return <Blog onNavigate={navigate} />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ />;
      case 'cover-letter':
        return (
          <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">AI Cover Letter Builder</h2>
            <p className="text-xl text-gray-600 mb-10">Generate a professional cover letter tailored to your resume and a specific job description in seconds.</p>
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-left">
              <p className="text-gray-500 italic">Feature arriving soon: Integration with your current resume data for one-click generation.</p>
              <button onClick={() => navigate('builder')} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Go to Builder first</button>
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="max-w-7xl mx-auto py-20 px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Professional Resume Templates</h2>
              <p className="text-xl text-gray-600">Hand-crafted designs proven to land more interviews.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {TEMPLATES.map(t => (
                <div key={t.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{t.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${t.tier === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {t.tier}
                      </span>
                    </div>
                    <button onClick={() => navigate('builder')} className="w-full py-2 bg-gray-50 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition">Use Template</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'dashboard':
        return <div className="p-20 text-center"><h2 className="text-3xl font-bold">User Dashboard</h2><p>Overview of your 3 saved resumes will appear here.</p></div>;
      case 'admin':
        return <div className="p-20 text-center"><h2 className="text-3xl font-bold text-purple-600">Admin Panel</h2><p>Analytics and template management active.</p></div>;
      case 'login':
        return <div className="p-20 text-center"><h2 className="text-3xl font-bold">Login to ResuMaster</h2><button onClick={handleStart} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">Social Login</button></div>;
      default:
        return <Landing onStart={handleStart} onNavigate={navigate} />;
    }
  };

  return (
    <Layout user={user} onNavigate={navigate} currentPage={currentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;
