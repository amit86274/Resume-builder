import React, { useState } from 'react';
import { Star, Eye, X, Sparkles, Layout } from 'lucide-react';
import { TEMPLATES, MOCK_RESUME_DATA } from '../constants';
import { TemplateTier } from '../types';
import { MasterTemplateSelector } from './ResumeTemplates';

interface TemplatesGalleryProps {
  onSelect: (id: string) => void;
  onNavigate: (path: string) => void;
}

/**
 * Renders a zoomed, wider crop of the actual resume template
 */
const ResumeMiniature: React.FC<{ templateId: string }> = ({ templateId }) => {
  return (
    <div className="w-full h-full bg-slate-100 flex justify-center items-start overflow-hidden relative rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/5 z-10 pointer-events-none" />
      <div 
        className="bg-white shadow-sm origin-top transition-transform duration-700 group-hover:scale-[0.62]"
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          transform: 'scale(0.55)',
          marginTop: '0px'
        }}
      >
        <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId }} />
      </div>
      
      {/* Visual scanning effect on hover */}
      <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="w-full h-1 bg-blue-500/30 blur-sm absolute top-0 animate-[scan_3s_linear_infinite]" />
      </div>
    </div>
  );
};

const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onSelect, onNavigate }) => {
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen relative font-inter">
      {/* Gallery Hero Section */}
      <div className="bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col items-center text-center space-y-10">
            <div className="inline-flex items-center px-6 py-2.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-[0.4em] shadow-sm">
              <Star className="w-4 h-4 mr-3 fill-current" /> Premium 2025 Layouts
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Select Your Template
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl">
              Precision-designed by top HR experts. Optimized for 100% accurate parsing across major recruitment systems.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex items-center justify-between mb-16">
           <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900">Available Selection</h2>
           <div className="h-px bg-slate-100 flex-1 ml-10" />
        </div>
        <div className={`flex justify-center ${TEMPLATES.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20' : ''}`}>
          {TEMPLATES.map(t => (
            <div key={t.id} className="flex flex-col group max-w-lg w-full">
              <div className="aspect-[3/2] overflow-hidden relative rounded-2xl border border-slate-200 shadow-xl group-hover:shadow-2xl transition-all duration-700 bg-white p-1">
                {/* Live Preview Miniature - Zoomed & Wider */}
                <ResumeMiniature templateId={t.id} />
                
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center space-y-4 px-10 text-center rounded-2xl">
                   <button 
                     onClick={() => handleSelect(t.id)}
                     className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-500 transition-all transform hover:scale-105"
                   >
                     Use Template
                   </button>
                   <button 
                     onClick={() => setPreviewId(t.id)}
                     className="w-full max-w-xs bg-white text-slate-900 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center hover:bg-slate-50 transition-all"
                   >
                     <Eye className="w-4 h-4 mr-2" /> Full View
                   </button>
                </div>
                {t.tier === TemplateTier.PREMIUM && (
                  <div className="absolute top-6 right-6 bg-amber-500 text-white text-[8px] z-30 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20">PRO</div>
                )}
              </div>
              <div className="mt-8 space-y-2 text-center">
                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{t.name}</h3>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">ATS Optimized • {t.tier === TemplateTier.FREE ? 'Free' : 'Pro'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setPreviewId(null)} />
          <div className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <button onClick={() => setPreviewId(null)} className="absolute top-8 right-8 z-50 bg-slate-900 text-white p-4 rounded-2xl hover:bg-red-500 transition-colors shadow-2xl">
              <X className="w-6 h-6" />
            </button>
            <div className="w-full md:w-[65%] bg-slate-50 p-12 overflow-y-auto flex justify-center">
              <div className="w-full max-w-[21cm] shadow-2xl bg-white origin-top scale-[0.6] sm:scale-[0.8] lg:scale-[0.9] transition-transform duration-700 p-1 border border-slate-200 rounded-sm">
                 <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: previewId }} />
              </div>
            </div>
            <div className="w-full md:w-[35%] p-12 flex flex-col justify-between border-l border-slate-100 bg-white">
              <div className="space-y-12">
                <div className="inline-flex items-center px-6 py-2.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 mr-3" /> Template Scan
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">
                  {TEMPLATES.find(t => t.id === previewId)?.name}
                </h2>
                <p className="text-base text-slate-500 font-medium leading-relaxed">
                  Engineered for maximum readability. This format ensures your most relevant experience hits the recruiter first.
                </p>
                <ul className="space-y-5">
                  {['99.9% ATS Score', 'Modern Typography', 'Perfect Spacing', 'Mobile-Ready'].map(f => (
                    <li key={f} className="flex items-center text-[10px] font-black text-slate-900 tracking-widest uppercase">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-4 shadow-lg shadow-green-200" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => handleSelect(previewId)}
                className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 transition-all shadow-2xl active:scale-[0.98]"
              >
                Use this format
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default TemplatesGallery;