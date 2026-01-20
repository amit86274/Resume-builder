
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle, XCircle, RotateCcw, BrainCircuit, Cpu, Zap, Search, Fingerprint, Network } from 'lucide-react';
import { extractResumeData, analyzeResumeATS } from '../services/gemini';
import { ResumeData } from '../types';

interface DirectPortProps {
  initialFile?: File;
  onImportComplete: (data: Partial<ResumeData>) => void;
  onCancel: () => void;
}

const DirectPort: React.FC<DirectPortProps> = ({ initialFile, onImportComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [extractedData, setExtractedData] = useState<Partial<ResumeData> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(["Activating Intelligence Engine..."]);
  const processingRef = useRef(false);
  
  const steps = [
    { label: "Establishing neural link", icon: <Cpu className="w-4 h-4" /> },
    { label: "Validating document identity", icon: <Fingerprint className="w-4 h-4" /> },
    { label: "Mapping structural layout", icon: <Search className="w-4 h-4" /> },
    { label: "Deconstructing career history", icon: <BrainCircuit className="w-4 h-4" /> },
    { label: "Synthesizing skill matrices", icon: <Zap className="w-4 h-4" /> },
    { label: "Confirming data integrity", icon: <Sparkles className="w-4 h-4" /> }
  ];

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    let isMounted = true;
    
    // Smooth progress simulation (visual only, actual progress capped at 98% until finish)
    const progressInterval = setInterval(() => {
      if (!isMounted) return;
      setProgress(p => {
        if (p >= 98) return p;
        const inc = Math.random() * 2.5;
        return Math.min(98, p + inc);
      });
    }, 400);

    // Visual step cycle for status messages
    const stepInterval = setInterval(() => {
      if (!isMounted) return;
      setStep(s => (s + 1) % steps.length);
    }, 2200);

    const performAIWorkflow = async () => {
      // Prevent multiple concurrent runs
      if (processingRef.current) return;
      processingRef.current = true;

      // Ensure we have a file
      if (!initialFile) {
        if (isMounted) {
          setError("Session Expired: No file buffer detected. Please go back and re-upload.");
          addLog("Error: File buffer lost.");
        }
        return;
      }

      try {
        addLog(`Analyzing: ${initialFile.name}...`);
        
        // 1. Convert to Base64
        const base64 = await fileToBase64(initialFile);
        const mimeType = initialFile.type || (initialFile.name.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        const fileData = { data: base64, mimeType };
        
        // 2. Validation Stage
        addLog("Validating professional content...");
        const validation = await analyzeResumeATS(initialFile.name, fileData);
        
        if (!isMounted) return;

        if (validation.isResume === false) {
          setIsRejected(true);
          setRejectionMessage(validation.rejectionMessage || "This document does not meet our professional criteria for a Resume or CV.");
          return;
        }

        // 3. Extraction Stage
        addLog("Verification passed. Mapping data nodes...");
        const result = await extractResumeData(fileData);
        
        if (!isMounted) return;

        // Verify we actually got something back
        if (!result || Object.keys(result).length < 2) {
          throw new Error("Data Synthesis Failure: AI could not identify standard career sections in this specific document layout.");
        }

        // 4. Finalize
        setExtractedData(result);
        setProgress(100);
        addLog("Profile synthesis complete.");
        
        // Give the user a moment to see the completion
        setTimeout(() => {
          if (isMounted) setIsComplete(true);
        }, 1200);

      } catch (err: any) {
        if (!isMounted) return;
        console.error("Critical AI Exception:", err);
        setError(err.message || "An unexpected error occurred during the intelligence scan.");
        addLog("Critical: Data mapping interrupted.");
      }
    };

    performAIWorkflow();

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [initialFile]);

  // Rejection UI (Not a Resume)
  if (isRejected) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full space-y-10">
          <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-100">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Rejection</h2>
            <p className="text-slate-500 font-medium leading-relaxed">{rejectionMessage}</p>
          </div>
          <button onClick={onCancel} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center group transform hover:scale-105 active:scale-95">
            <RotateCcw className="mr-3 w-5 h-5 group-hover:-rotate-45 transition-transform" />
            <span>Try Different File</span>
          </button>
        </div>
      </div>
    );
  }

  // Error UI (Technical Failure)
  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full space-y-10">
          <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-amber-100">
            <AlertCircle className="w-16 h-16 text-amber-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Scan Failure</h2>
            <p className="text-slate-500 font-medium leading-relaxed">{error}</p>
          </div>
          <div className="flex flex-col space-y-4 pt-4">
            <button onClick={onCancel} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all">Go Back & Retry</button>
            <button onClick={() => onImportComplete({})} className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline">Or Skip & Build Manually</button>
          </div>
        </div>
      </div>
    );
  }

  // Active Scanning UI
  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 overflow-hidden">
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="port-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#port-grid)" />
        </svg>
      </div>

      <div className="max-w-xl w-full relative">
        {/* Progress Container */}
        <div className="bg-white rounded-[4.5rem] shadow-[0_50px_120px_rgba(0,0,0,0.08)] border border-slate-100 p-12 md:p-20 relative overflow-hidden">
          
          {/* Scanning Line Animation */}
          {!isComplete && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
               <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent shadow-[0_0_20px_rgba(37,99,235,0.6)] animate-[scan_3s_linear_infinite]" />
            </div>
          )}

          <div className="relative z-10 space-y-12">
            {/* Circular Progress Scanner */}
            <div className="relative w-64 h-64 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="120" fill="none" stroke="#f8fafc" strokeWidth="12" />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke={isComplete ? "#22c55e" : "#2563eb"}
                  strokeWidth="12"
                  strokeDasharray={753.98}
                  strokeDashoffset={753.98 - (753.98 * progress) / 100}
                  className="transition-all duration-700 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isComplete ? (
                  <div className="bg-green-500 text-white p-8 rounded-full animate-in zoom-in duration-700 shadow-2xl shadow-green-200">
                    <CheckCircle2 className="w-20 h-20" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-6xl font-black text-slate-900 tracking-tighter">
                      {Math.round(progress)}%
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 animate-pulse">
                      Synthesizing
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {isComplete ? "Data Sync Ready" : "Intelligence Mapping"}
              </h2>
              <div className="flex items-center justify-center space-x-3 text-slate-400">
                <div className="p-2 bg-slate-50 rounded-2xl">
                  {steps[step].icon}
                </div>
                <p className="font-bold text-base">
                  {isComplete ? "Successfully mapped career history" : steps[step].label}
                </p>
              </div>
            </div>

            {/* AI Reasoning Log (The "Neural Log") */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-left space-y-2 border border-slate-800 h-32 overflow-hidden relative shadow-inner">
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none z-10" />
              {logs.map((log, i) => (
                <p key={i} className={`text-[11px] font-mono transition-all duration-300 flex items-center ${i === 0 ? 'text-blue-400 font-bold' : 'text-slate-500 opacity-40'}`}>
                  {i === 0 && <Network className="w-3 h-3 mr-2 animate-pulse" />}
                  {log}
                </p>
              ))}
            </div>

            {isComplete ? (
              <div className="animate-in slide-in-from-bottom-8 duration-700">
                <button 
                  onClick={() => extractedData && onImportComplete(extractedData)}
                  className="w-full bg-animate-gradient text-white py-7 rounded-[2.5rem] font-black text-base uppercase tracking-[0.2em] shadow-[0_25px_50px_rgba(37,99,235,0.3)] hover:opacity-90 transition-all flex items-center justify-center group transform hover:scale-105 active:scale-95"
                >
                  <span>Launch AI Builder</span>
                  <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-3 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="pt-6 flex items-center justify-center space-x-4 text-slate-400 opacity-40">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em]">Secure Intelligent Extraction</span>
              </div>
            )}
          </div>
        </div>

        <p className="mt-16 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Source: <span className="text-slate-900">{initialFile?.name || "Initializing buffer..."}</span>
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default DirectPort;
