
import React, { useState } from 'react';
import { Upload, PenLine, Check, Sparkles, ChevronRight } from 'lucide-react';
import { MasterTemplateSelector } from '../components/ResumeTemplates';
import { MOCK_RESUME_DATA } from '../constants';

interface ResumeOptionProps {
  onSelect: (method: 'upload' | 'scratch') => void;
  templateId?: string;
}

const ResumeOption: React.FC<ResumeOptionProps> = ({ onSelect, templateId }) => {
  const [selectedMethod, setSelectedMethod] = useState<'upload' | 'scratch' | null>(null);

  const handleNext = () => {
    if (selectedMethod) {
      console.log(`[ResumeOption] Selected method: ${selectedMethod}. Notifying parent.`);
      onSelect(selectedMethod);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter selection:bg-blue-100">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT CONTENT */}
        <div className="flex-1 bg-white pt-20 pb-32 px-6 md:px-12 flex flex-col items-center lg:items-start overflow-y-auto relative">
          
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="bg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#bg-grid)" />
            </svg>
          </div>

          <div className="max-w-2xl w-full space-y-4 mb-16 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>India's Elite AI Builder</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1a2b48] tracking-tight leading-[1.1]">
              How would you like to start?
            </h1>
            <p className="text-gray-400 text-lg font-medium max-w-lg">
              Choose the method that works best for your career journey.
            </p>
          </div>

          <div className="flex flex-col space-y-6 w-full max-w-2xl relative z-10">
            
            <div 
              className={`relative group p-10 rounded-[3rem] border-2 transition-all duration-500 bg-white cursor-pointer
                ${selectedMethod === 'upload' 
                  ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50' 
                  : 'border-slate-100 hover:border-blue-200 hover:shadow-xl'
                }`}
              onClick={() => setSelectedMethod('upload')}
            >
              <div className="flex items-center space-x-8">
                <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center transition-all duration-500 shrink-0
                  ${selectedMethod === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                  <Upload className="w-8 h-8" />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-2xl font-black text-[#1a2b48] tracking-tight">Upload Existing Resume</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
                    Port your history from an old PDF or Word doc using AI.
                  </p>
                </div>

                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                  ${selectedMethod === 'upload' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-200'}`}>
                  <Check className="w-5 h-5 stroke-[3px]" />
                </div>
              </div>
            </div>

            <div 
              className={`relative group p-10 rounded-[3rem] border-2 transition-all duration-500 bg-white cursor-pointer
                ${selectedMethod === 'scratch' 
                  ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50' 
                  : 'border-slate-100 hover:border-blue-200 hover:shadow-xl'
                }`}
              onClick={() => setSelectedMethod('scratch')}
            >
              <div className="flex items-center space-x-8">
                <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center transition-all duration-500 shrink-0
                  ${selectedMethod === 'scratch' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                  <PenLine className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-2xl font-black text-[#1a2b48] tracking-tight">Start from Scratch</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
                    We'll guide you step-by-step with AI writing assistance.
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                  ${selectedMethod === 'scratch' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-200'}`}>
                  <Check className="w-5 h-5 stroke-[3px]" />
                </div>
              </div>
            </div>

            <div className="pt-10 flex justify-center lg:justify-start">
               <button 
                onClick={handleNext}
                disabled={!selectedMethod}
                className={`group px-20 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center shadow-2xl
                  ${!selectedMethod
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-animate-gradient text-white hover:scale-105 active:scale-95 shadow-blue-500/20'
                  }`}
               >
                 Continue to Next Step
                 <ChevronRight className={`ml-3 w-5 h-5 transition-transform ${selectedMethod ? 'group-hover:translate-x-1.5' : ''}`} />
               </button>
            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="hidden lg:flex w-[500px] bg-slate-50 border-l border-slate-100 p-12 flex-col items-center shrink-0">
           <div className="w-full shadow-2xl bg-white rounded-sm overflow-hidden transform hover:scale-[1.03] transition-transform duration-700 border border-slate-200 aspect-[210/297] relative group">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 origin-top scale-[0.45] w-[210mm] h-[297mm]">
               <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: templateId || 'yuki-blue' }} />
             </div>
             <div className="absolute inset-0 bg-transparent z-10" />
           </div>
           <div className="mt-12 space-y-6 text-center max-w-xs">
              <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Selected Style</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                You are currently using the <span className="text-blue-600 font-bold">Yuki Blue</span> template.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeOption;
