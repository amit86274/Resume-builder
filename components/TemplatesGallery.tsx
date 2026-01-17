
import React, { useState } from 'react';
import { Star, Eye, X, Sparkles } from 'lucide-react';
import { TEMPLATES, MOCK_RESUME_DATA } from '../constants';
import { TemplateTier } from '../types';
import { MasterTemplateSelector } from './ResumeTemplates';

interface TemplatesGalleryProps {
  onSelect: (id: string) => void;
  onNavigate: (path: string) => void;
}

/**
 * Full resume preview miniature
 */
const ResumeMiniature: React.FC<{ templateId: string }> = ({ templateId }) => {
  return (
    <div className="w-full h-full bg-slate-100 flex justify-center items-start overflow-hidden relative group-hover:bg-slate-200 transition-colors">
      <div 
        className="bg-white shadow-2xl origin-top transition-transform duration-700"
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          transform: 'scale(0.18)', /* Adjusted scale to show full page within the card */
          marginTop: '12px'
        }}
      >
        <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId }} />
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
    <div className="bg-white min-h-screen py-16 px-6 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Choose Your Template</h1>
          <p className="text-slate-500 font-medium">Standard professional format designed for maximum recruiter impact.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 justify-center">
          {TEMPLATES.map(t => (
            <div key={t.id} className="flex flex-col group cursor-pointer" onClick={() => setPreviewId(t.id)}>
              <div className="aspect-[210/297] overflow-hidden relative rounded-md border border-slate-200 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-400 bg-white">
                <ResumeMiniature templateId={t.id} />
                
                {/* Hover overlay with button */}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    Preview & Edit
                  </button>
                </div>
              </div>

              {/* Title below the card */}
              <div className="mt-4">
                <h3 className="text-[15px] font-semibold text-slate-900 leading-tight">
                  {t.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Preview Modal */}
      {previewId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setPreviewId(null)} />
          <div className="relative bg-white w-full max-w-7xl h-full max-h-[92vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <button 
              onClick={() => setPreviewId(null)} 
              className="absolute top-6 right-6 z-50 bg-slate-100 text-slate-900 p-3 rounded-full hover:bg-red-50 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full md:w-[65%] bg-slate-50 p-6 md:p-12 overflow-y-auto flex justify-center items-start">
              <div className="w-full max-w-[21cm] shadow-2xl bg-white origin-top scale-[0.6] sm:scale-[0.8] lg:scale-[0.9] transition-transform duration-700">
                 <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: previewId }} />
              </div>
            </div>
            <div className="w-full md:w-[35%] p-10 md:p-16 flex flex-col justify-between border-l border-slate-100 bg-white">
              <div className="space-y-10">
                <div className="inline-flex items-center px-6 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 mr-3" /> Template Design
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {TEMPLATES.find(t => t.id === previewId)?.name}
                  </h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Professionally engineered for ATS compatibility and human readability.
                  </p>
                </div>
                <ul className="space-y-4">
                  {['99.9% ATS Score', 'Modern Font Palette', 'Standard 1-Page Layout'].map(f => (
                    <li key={f} className="flex items-center text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-4" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => handleSelect(previewId)}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-xl"
              >
                Use this template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesGallery;
