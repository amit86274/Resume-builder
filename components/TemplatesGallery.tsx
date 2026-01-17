import React, { useState } from 'react';
import { X, Sparkles, Eye, CheckCircle } from 'lucide-react';
import { TEMPLATES, MOCK_RESUME_DATA } from '../constants';
import { MasterTemplateSelector } from './ResumeTemplates';

interface TemplatesGalleryProps {
  onSelect: (id: string) => void;
  onNavigate: (path: string) => void;
}

const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onSelect, onNavigate }) => {
  const [previewId, setPreviewId] = useState<string | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen py-24 px-6 font-inter text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900">Choose Your Template</h1>
          <p className="text-slate-500 font-medium text-lg">Land your dream job with industry-standard professional layouts.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {TEMPLATES.map(t => (
            <div key={t.id} className="flex flex-col group cursor-pointer relative">
              <div className="aspect-[3/4] overflow-hidden relative rounded-[2.5rem] border border-slate-200 shadow-[0_10px_40px_rgb(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[0_30px_80px_rgb(0,0,0,0.12)] group-hover:border-blue-300 bg-white group-hover:-translate-y-3">
                <img 
                  src={t.thumbnail} 
                  alt={t.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4 px-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelect(t.id); }}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-500 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Use Template</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPreviewId(t.id); }}
                    className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 hover:bg-slate-50 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Full Preview</span>
                  </button>
                </div>
              </div>
              <div className="mt-8 text-center px-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.name.split(':')[0]}</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{t.name.split(':')[1] || 'Modern Layout'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setPreviewId(null)} />
          <div className="relative bg-white w-full max-w-[96vw] h-full max-h-[96vh] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row border border-white/20">
            <button onClick={() => setPreviewId(null)} className="absolute top-8 right-8 z-50 bg-slate-100 text-slate-900 p-3 rounded-full hover:bg-red-50 transition-all shadow-lg"><X className="w-6 h-6" /></button>
            <div className="w-full md:w-[80%] bg-slate-50 p-6 md:p-12 overflow-y-auto flex justify-center items-start scrollbar-hide border-r border-slate-100">
              <div className="w-full max-w-[21cm] shadow-[0_40px_100px_rgba(0,0,0,0.1)] bg-white origin-top scale-[0.55] sm:scale-[0.8] lg:scale-[1.0] transition-transform duration-700">
                 <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: previewId }} />
              </div>
            </div>
            <div className="w-full md:w-[20%] p-10 flex flex-col justify-between bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.02)] border-l border-slate-100">
              <div className="space-y-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 mr-2" /> Template Design
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">Professional Template</h2>
                <p className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">Full immersive layout preview optimized for professional standards. Engineered for maximum impact and readability in the modern job market.</p>
              </div>
              <button onClick={() => onSelect(previewId)} className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 whitespace-nowrap leading-none">Use this template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesGallery;