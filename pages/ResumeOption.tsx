
import React, { useState, useRef } from 'react';
import { Upload, PenLine, Check, Sparkles, Eye, FileText, X, ShieldCheck, ArrowRight, FileCheck } from 'lucide-react';
import { MasterTemplateSelector } from '../components/ResumeTemplates';
import { MOCK_RESUME_DATA } from '../constants';

interface ResumeOptionProps {
  onSelect: (method: 'upload' | 'scratch', file?: File) => void;
  templateId?: string;
}

const ResumeOption: React.FC<ResumeOptionProps> = ({ onSelect, templateId }) => {
  const [selected, setSelected] = useState<'upload' | 'scratch' | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMethodClick = (method: 'upload' | 'scratch') => {
    setSelected(method);
    if (method === 'scratch') {
      setStagedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndStage(f);
  };

  const validateAndStage = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
      setStagedFile(f);
    } else {
      alert('Unsupported format. Please upload PDF, DOCX, or TXT.');
    }
  };

  const handleNext = () => {
    if (selected === 'scratch') {
      onSelect('scratch');
    } else if (selected === 'upload' && stagedFile) {
      onSelect('upload', stagedFile);
    }
  };

  const isNextDisabled = !selected || (selected === 'upload' && !stagedFile);

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT CONTENT: Selection Logic */}
        <div className="flex-1 bg-white pt-20 pb-32 px-6 md:px-12 flex flex-col items-center lg:items-start overflow-y-auto">
          <div className="max-w-2xl w-full space-y-4 mb-16 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Onboarding</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1a2b48] tracking-tight leading-tight">
              How's your resume looking?
            </h1>
            <p className="text-gray-500 text-lg font-medium max-w-lg">
              Upload and let our AI find your <span className="text-blue-600 font-bold uppercase text-sm tracking-widest">Match Score</span>
            </p>
          </div>

          <div className="flex flex-col space-y-6 w-full max-w-2xl mb-12">
            {/* Option 1: Upload */}
            <div 
              className={`relative group p-8 rounded-[2.5rem] border-2 transition-all duration-500 bg-white overflow-hidden
                ${selected === 'upload' 
                  ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50' 
                  : 'border-slate-100 hover:border-blue-200 hover:shadow-xl cursor-pointer'
                }`}
              onClick={() => handleMethodClick('upload')}
            >
              <div className="flex items-center space-x-8">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 shrink-0
                  ${selected === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-blue-500 group-hover:scale-105'}`}>
                  <Upload className="w-8 h-8" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-black text-[#1a2b48]">Upload Existing Resume</h3>
                    <span className="bg-[#ff6b81] text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Fastest</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Gemini 3 AI will port your career history directly into the builder. Saves 15+ minutes.
                  </p>
                </div>

                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                  ${selected === 'upload' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                  {selected === 'upload' && <Check className="w-4 h-4 stroke-[3px]" />}
                </div>
              </div>

              {/* In-place Upload Zone */}
              {selected === 'upload' && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in slide-in-from-top-4 duration-500">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.txt" 
                    onChange={handleFileChange} 
                  />
                  {!stagedFile ? (
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) validateAndStage(f); }}
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className={`relative transition-all duration-300 rounded-[2rem] border-[3px] border-dashed p-10 flex flex-col items-center text-center space-y-4 cursor-pointer group/drop
                        ${isDragging 
                          ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
                          : 'border-slate-100 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
                        }`}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm text-slate-400 group-hover/drop:text-blue-500 group-hover/drop:scale-110 transition-all">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Drag & drop resume</h4>
                        <p className="text-slate-400 text-xs font-medium">AI parsing supports <span className="text-slate-900 font-bold">PDF, DOC, DOCX, and TXT</span> formats.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-center justify-between animate-in zoom-in duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 truncate max-w-[200px]">{stagedFile.name}</p>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ready to scan</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setStagedFile(null); }}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Option 2: Scratch */}
            <div 
              onClick={() => handleMethodClick('scratch')}
              className={`relative group cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col bg-white overflow-hidden
                ${selected === 'scratch' 
                  ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50' 
                  : 'border-slate-100 hover:border-blue-200 hover:shadow-xl'
                }`}
            >
              <div className="flex items-center space-x-8 w-full">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 shrink-0
                  ${selected === 'scratch' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-indigo-500 group-hover:scale-105'}`}>
                  <PenLine className="w-8 h-8" />
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-black text-[#1a2b48]">Create New from Scratch</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Build your profile step-by-step with expert prompts and suggestions.
                  </p>
                </div>

                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                  ${selected === 'scratch' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                  {selected === 'scratch' && <Check className="w-4 h-4 stroke-[3px]" />}
                </div>
              </div>
            </div>
          </div>

          {/* DEDICATED ACTION AREA: Positioned under the last option and above footer info */}
          <div className="w-full max-w-2xl mb-12 min-h-[80px]">
            {selected && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <button 
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className={`w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl flex items-center justify-center whitespace-nowrap active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed
                    ${selected === 'upload' ? 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700' : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'}`}
                >
                  {selected === 'upload' ? 'Scan & Extract Data' : 'Continue to Builder'} 
                  <ArrowRight className="ml-3 w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 md:mb-0">
              India's Most Advanced AI Resume Builder
            </p>
            <div className="flex items-center space-x-6 grayscale opacity-50">
               <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                 <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-green-500" /> Secure
               </div>
               <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                 <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> AI Porting
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="hidden lg:flex w-[480px] bg-slate-900 flex-col shrink-0 overflow-hidden relative border-l border-white/5">
          <div className="absolute inset-0 bg-black/40 z-0" />
          <div className="p-10 relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3 text-white">
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Final Look Preview</span>
              </div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Selected Template</div>
            </div>

            <div className="flex-1 flex items-center justify-center relative min-h-0">
              <div className="w-full relative aspect-[210/297] flex items-center justify-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 transform scale-[0.42] origin-top bg-white shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden">
                  <div className="w-[210mm] h-[297mm]">
                     <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: templateId || 'yuki-blue' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeOption;
