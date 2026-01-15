
import React, { useState } from 'react';
import { Upload, FileEdit, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onSelectScratch: () => void;
  onSelectUpload: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelectScratch, onSelectUpload }) => {
  const [selectedOption, setSelectedOption] = useState<'upload' | 'scratch'>('upload');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 md:pt-24 px-4 pb-12">
      <div className="max-w-4xl w-full text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a2b48]">
          Are you uploading an existing resume?
        </h1>
        <p className="text-gray-500 text-lg">
          Just review, edit, and update it with new information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mb-16">
        {/* Recommended Option (Upload) */}
        <div 
          onClick={() => setSelectedOption('upload')}
          className={`relative cursor-pointer group transition-all duration-300 rounded-xl border-[3px] p-8 md:p-12 flex flex-col items-center text-center space-y-6 ${
            selectedOption === 'upload' 
              ? 'border-[#2e47c1] bg-white shadow-xl' 
              : 'border-transparent bg-white shadow-sm hover:shadow-md'
          }`}
        >
          {/* Recommendation Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fde8ef] text-[#d6336c] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            Recommended option to save you time
          </div>

          <div className={`w-20 h-20 rounded-xl flex items-center justify-center border-2 transition-colors ${
            selectedOption === 'upload' ? 'bg-[#f0f3ff] border-[#2e47c1]' : 'bg-gray-50 border-gray-200'
          }`}>
            <Upload className={`w-10 h-10 ${selectedOption === 'upload' ? 'text-[#2e47c1]' : 'text-gray-400'}`} />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#1a2b48]">Yes, upload from my resume</h2>
            <p className="text-gray-500 leading-relaxed text-sm px-4">
              We'll give you expert guidance to fill out your info and enhance your resume, from start to finish
            </p>
          </div>
        </div>

        {/* Start from Scratch Option */}
        <div 
          onClick={() => setSelectedOption('scratch')}
          className={`cursor-pointer group transition-all duration-300 rounded-xl border-[3px] p-8 md:p-12 flex flex-col items-center text-center space-y-6 ${
            selectedOption === 'scratch' 
              ? 'border-[#2e47c1] bg-white shadow-xl' 
              : 'border-gray-100 bg-white shadow-sm hover:shadow-md'
          }`}
        >
          <div className={`w-20 h-20 rounded-xl flex items-center justify-center border-2 transition-colors ${
            selectedOption === 'scratch' ? 'bg-[#f0f3ff] border-[#2e47c1]' : 'bg-gray-50 border-gray-200'
          }`}>
            <FileEdit className={`w-10 h-10 ${selectedOption === 'scratch' ? 'text-[#2e47c1]' : 'text-gray-400'}`} />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#1a2b48]">No, start from scratch</h2>
            <p className="text-gray-500 leading-relaxed text-sm px-4">
              We'll guide you through the whole process so your skills can shine
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full flex flex-col items-end px-4">
        <button 
          onClick={selectedOption === 'upload' ? onSelectUpload : onSelectScratch}
          className="bg-[#ffc84d] hover:bg-[#ffba1f] text-[#1a2b48] font-bold px-16 py-4 rounded-full text-lg shadow-lg shadow-yellow-200 transition-all active:scale-95"
        >
          Next
        </button>
        <p className="mt-8 text-[11px] text-gray-400 max-w-md text-right">
          By clicking Next, you agree to our <span className="underline cursor-pointer">Terms of Use</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
