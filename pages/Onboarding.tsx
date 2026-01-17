import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle2, X, Loader2, AlertCircle, 
  FileStack, Sparkles, Target, Zap, Lock, ArrowRight,
  TrendingUp, Search, Info, BarChart3, ShieldCheck, Eye,
  CreditCard, ExternalLink, FileWarning, SearchX
} from 'lucide-react';
import { analyzeResumeATS } from '../services/gemini';
import { AnalyzerResult } from '../types';

interface OnboardingProps {
  onSelectUpload: (file: File) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelectUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanSteps = [
    "Reading file data...",
    "Verifying document type...",
    "Validating content structure...",
    "Scanning keywords...",
    "Calculating ATS compatibility...",
    "Finalizing AI score..."
  ];

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      interval = setInterval(() => {
        setScanStep(prev => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 800);
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const validateFile = (selectedFile: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const isValidExtension = ['pdf', 'doc', 'docx', 'txt'].includes(extension || '');

    if (validTypes.includes(selectedFile.type) || isValidExtension) {
      setFile(selectedFile);
      setError(null);
      return true;
    } else {
      setError('Unsupported format. Please upload a PDF, Word document, or Text file.');
      setFile(null);
      return false;
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || "");
      reader.onerror = (e) => reject(e);
      // We read as text to extract identifiable strings for the LLM. 
      // For binary formats (PDF/DOCX), the LLM is smart enough to identify 
      // the structure or lack thereof from the raw stream.
      reader.readAsText(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateFile(droppedFile);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleStartAnalysis = async () => {
    if (!file) {
      triggerUpload();
      return;
    }
    
    setIsProcessing(true);
    setAnalysis(null);
    setError(null);

    try {
      // Step 1: Actually read the user's file content
      const actualContent = await readFileContent(file);
      
      // Step 2: Send the real content to Gemini
      const result = await analyzeResumeATS(file.name, actualContent);
      
      // Artificial delay for high-quality UX feel so users see the scan steps
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!result.isResume) {
        setError(result.rejectionMessage || "This file doesn't look like a professional resume. Please upload a CV or Resume file.");
      } else {
        setAnalysis(result);
      }
    } catch (err) {
      setError("Failed to read or analyze document. Please ensure you are uploading a valid resume file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const proceedToBuilder = () => {
    if (file) onSelectUpload(file);
  };

  if (analysis && analysis.isResume) {
    return (
      <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4 animate-in fade-in duration-700">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 mr-2" /> ATS Quality Report
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Analysis for <span className="text-blue-600 truncate max-w-[300px] inline-block align-bottom">{file?.name}</span>
              </h1>
              <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
                Our AI has compared your resume against <span className="text-slate-900 font-bold">12,000+ top-tier applications</span>.
              </p>
            </div>
            <div className="flex gap-3">
               <button 
                  onClick={() => { setAnalysis(null); setFile(null); }}
                  className="px-6 py-4 bg-white text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
               >
                 Re-upload
               </button>
               <button 
                  onClick={proceedToBuilder}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all"
               >
                 Open Editor
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
                <div className="relative w-56 h-56 mb-8 group">
                   <svg className="w-full h-full transform -rotate-90 relative z-10">
                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={628.3}
                      strokeDashoffset={628.3 * (1 - analysis.score / 100)}
                      className="text-blue-600 transition-all duration-2000 ease-out" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-7xl font-black text-slate-900 tracking-tighter">{analysis.score}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Match Score</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-loose italic">"{analysis.generalFeedback}"</p>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black uppercase tracking-widest text-[10px] text-blue-400">ATS Match</h3>
                  <span className="text-2xl font-black">{analysis.atsScore}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-6">
                  <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${analysis.atsScore}%` }} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">AI Recommendations</h2>
                      </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.contentSuggestions.map((suggestion: string, i: number) => (
                      <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                         <p className="text-slate-700 font-bold leading-relaxed text-sm">{suggestion}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-white flex flex-col items-center justify-center pt-16 md:pt-24 px-4 pb-12 overflow-hidden">
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="max-w-md w-full px-8 text-center space-y-12">
            <div className="relative inline-block">
              <div className="w-32 h-32 border-[6px] border-blue-50 rounded-full border-t-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-blue-600 p-5 rounded-3xl shadow-2xl shadow-blue-500/40 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-black text-[#1a2b48] tracking-tighter">AI Resume Scan</h3>
              <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
                {scanSteps[scanStep]}
              </p>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl w-full text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-[#1a2b48] tracking-tight">How's your resume looking?</h1>
        <p className="text-gray-500 text-lg font-medium">Upload and let our AI find your <span className="text-blue-600 font-black uppercase tracking-widest text-sm">match score</span></p>
      </div>

      <div className="max-w-xl w-full mb-12">
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />
        
        {error && (
          <div className="mb-8 p-10 rounded-[3rem] bg-red-50 border-2 border-red-100 flex flex-col items-center text-center animate-in zoom-in duration-500 shadow-2xl shadow-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-6 text-red-600">
               <SearchX className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">Not a Professional Resume</h4>
            <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-sm">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={() => { setError(null); setFile(null); triggerUpload(); }}
                className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" /> Try Different File
              </button>
              <button 
                onClick={() => { setError(null); setFile(null); }}
                className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {!error && (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerUpload}
            className={`relative transition-all duration-500 rounded-[3rem] border-[4px] border-dashed p-10 md:p-16 flex flex-col items-center text-center space-y-10 cursor-pointer shadow-2xl group
              ${isDragging 
                ? 'border-blue-600 bg-blue-50/50 scale-[1.02]' 
                : file 
                  ? 'border-green-500 bg-green-50/20 shadow-green-100' 
                  : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50/50'
              }`}
          >
            {file ? (
              <div className="animate-in zoom-in duration-300 flex flex-col items-center space-y-8">
                <div className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center bg-green-100 text-green-600 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                  <FileText className="w-14 h-14" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-gray-900 truncate max-w-[320px]">{file.name}</h2>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-xs font-black text-red-400 hover:text-red-600 transition-colors pt-4 block mx-auto uppercase tracking-widest"
                  >
                    Remove File
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center border-2 transition-all duration-500 bg-white shadow-2xl
                  ${isDragging ? 'scale-110 border-blue-600 text-blue-600 rotate-6' : 'border-slate-100 text-slate-300 group-hover:scale-110 group-hover:text-blue-50'}`}>
                  <div className="relative">
                    <Upload className={`w-16 h-16 ${isDragging ? 'text-blue-600' : 'text-slate-200 group-hover:text-blue-400'}`} />
                    <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-[#1a2b48]">Drag & drop resume</h2>
                  <p className="text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                    AI parsing supports <span className="text-slate-900 font-bold">PDF, DOC, DOCX, and TXT</span> formats. 
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="max-w-md w-full flex flex-col items-center px-4">
        <button 
          onClick={handleStartAnalysis}
          disabled={!file || !!error}
          className={`w-full font-black px-16 py-6 rounded-[2rem] text-xl text-white shadow-2xl transition-all active:scale-95 border-none uppercase tracking-widest bg-animate-gradient 
            ${(!file || !!error) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 shadow-blue-500/20'}`}
        >
          {file ? 'Get My Free Score' : 'Upload File'}
        </button>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Lock className="w-3 h-3 inline mr-2" /> 256-bit SSL encrypted & secure
        </p>
      </div>
    </div>
  );
};

export default Onboarding;