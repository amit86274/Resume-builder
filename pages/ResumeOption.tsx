import React, { useState } from 'react';
import { Upload, PenLine, ChevronRight, Check } from 'lucide-react';

interface ResumeOptionProps {
  onSelect: (method: 'upload' | 'scratch') => void;
  templateId?: string;
}

const ResumeOption: React.FC<ResumeOptionProps> = ({ onSelect, templateId }) => {
  const [selected, setSelected] = useState<'upload' | 'scratch' | null>(null);

  const handleNext = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-12 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-[#1a2b48] tracking-tight">
          Are you uploading an existing resume?
        </h1>
        <p className="text-gray-500 text-lg font-medium">
          Just review, edit, and update it with new information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Option 1: Upload */}
        <div 
          onClick={() => setSelected('upload')}
          className={`relative group cursor-pointer p-10 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center text-center space-y-6 bg-white
            ${selected === 'upload' 
              ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50' 
              : 'border-slate-100 hover:border-blue-200 hover:shadow-xl'
            }`}
        >
          {/* Recommended Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff6b81]/10 text-[#ff6b81] px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap border border-[#ff6b81]/20">
            Recommended option to save you time
          </div>

          <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <div className="relative border-2 border-slate-300 rounded-lg p-3 bg-white">
              <Upload className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black text-[#1a2b48]">Yes, upload from my resume</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              We'll give you expert guidance to fill out your info and enhance your resume, from start to finish
            </p>
          </div>

          {selected === 'upload' && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white p-1 rounded-full">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Option 2: Start from scratch */}
        <div 
          onClick={() => setSelected('scratch')}
          className={`relative group cursor-pointer p-10 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center text-center space-y-6 bg-white
            ${selected === 'scratch' 
              ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50' 
              : 'border-slate-100 hover:border-blue-200 hover:shadow-xl'
            }`}
        >
          <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform">
            <div className="relative border-2 border-slate-300 rounded-lg p-3 bg-white">
              <PenLine className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black text-[#1a2b48]">No, start from scratch</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              We'll guide you through the whole process so your skills can shine
            </p>
          </div>

          {selected === 'scratch' && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white p-1 rounded-full">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 w-full max-w-5xl flex justify-end px-4 pb-20">
        <button 
          onClick={handleNext}
          disabled={!selected}
          className={`px-16 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center
            ${selected 
              ? 'bg-slate-900 text-white shadow-2xl hover:bg-blue-600 active:scale-95' 
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
        >
          Next <ChevronRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ResumeOption;