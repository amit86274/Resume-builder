import React, { useState, useRef } from 'react';
import { Upload, FileText, ChevronLeft, ArrowRight, CheckCircle2, FileCheck } from 'lucide-react';

interface UploadMethodProps {
  onFileSelect: (file: File) => void;
  onBack: () => void;
}

const UploadMethod: React.FC<UploadMethodProps> = ({ onFileSelect, onBack }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'doc', 'docx', 'html', 'rtf', 'txt'];
    if (validExts.includes(ext || '')) {
      setSelectedFile(file);
    } else {
      alert(`Unsupported file format: .${ext}. Please use PDF, DOCX, or TXT.`);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleNext = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter selection:bg-blue-100">
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6">
        
        <div className="max-w-4xl w-full space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Upload your resume
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
              Our AI will automatically extract your contact info, work history, and skills to build your new resume in seconds.
            </p>
          </div>

          {/* FULL WIDTH INTERACTIVE ZONE */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`relative group min-h-[420px] rounded-[3.5rem] border-4 border-dashed flex flex-col items-center justify-center transition-all duration-500 cursor-pointer
              ${isDragging 
                ? 'border-blue-600 bg-blue-50/50 scale-[1.02] shadow-2xl shadow-blue-100' 
                : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
              }
              ${selectedFile ? 'border-green-500 bg-green-50/30' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.doc,.docx,.html,.rtf,.txt" 
              onChange={onFileChange} 
            />
            
            <div className="mb-8 relative">
              <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-500
                ${selectedFile 
                  ? 'bg-green-500 text-white rotate-0' 
                  : 'bg-blue-600 text-white group-hover:scale-110 group-hover:rotate-6 shadow-2xl shadow-blue-200'
                }`}>
                {selectedFile ? <FileCheck className="w-12 h-12" /> : <Upload className="w-12 h-12" />}
              </div>
              
              {selectedFile && (
                <div className="absolute -bottom-2 -right-2 bg-white text-green-500 rounded-full p-2 shadow-xl border-2 border-green-500 animate-in zoom-in">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="space-y-3 px-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedFile ? 'File Ready to Port' : 'Click or Drag & Drop'}
              </h3>
              <p className="text-lg font-bold text-slate-400">
                {selectedFile ? selectedFile.name : 'Supports PDF, DOCX, and TXT'}
              </p>
            </div>

            {!selectedFile && (
              <div className="mt-10">
                <button className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl group-hover:bg-blue-600 transition-all">
                  Browse Files
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-6 pt-4 text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> High Parsing Accuracy</span>
            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> ATS Compatibility Check</span>
          </div>
        </div>
      </div>

      {/* STICKY FOOTER ACTION BAR */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-slate-100 py-10 px-6 md:px-12 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 px-10 py-5 border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!selectedFile}
            className={`flex items-center space-x-3 px-16 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl
              ${selectedFile 
                ? 'bg-animate-gradient text-white hover:scale-105 active:scale-95 shadow-blue-500/30' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
              }`}
          >
            <span>Import</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMethod;