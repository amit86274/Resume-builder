
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, XCircle, BrainCircuit, Cpu, Zap, Search, Fingerprint, Loader2 } from 'lucide-react';
import { extractResumeData, analyzeResumeATS } from '../lib/gemini';
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
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(["Neural link initializing..."]);
  const workflowInitiated = useRef(false);
  
  const steps = [
    { label: "Validating file identity", icon: <Fingerprint className="w-4 h-4" /> },
    { label: "Establishing neural link", icon: <Cpu className="w-4 h-4" /> },
    { label: "Mapping structural layout", icon: <Search className="w-4 h-4" /> },
    { label: "Deconstructing history", icon: <BrainCircuit className="w-4 h-4" /> },
    { label: "Synthesizing nodes", icon: <Zap className="w-4 h-4" /> },
    { label: "Final verification", icon: <Sparkles className="w-4 h-4" /> }
  ];

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  useEffect(() => {
    let isMounted = true;
    
    // Progress bar simulation
    const progressInterval = setInterval(() => {
      if (!isMounted || isComplete || error || isRejected) return;
      setProgress(p => {
        if (p >= 95) return p;
        return Math.min(95, p + (p < 50 ? 2 : 0.5));
      });
    }, 400);

    const stepInterval = setInterval(() => {
      if (!isMounted || isComplete || error || isRejected) return;
      setStep(s => (s + 1) % steps.length);
    }, 2500);

    const startProcessing = async () => {
      if (workflowInitiated.current || !initialFile) return;
      workflowInitiated.current = true;

      try {
        addLog(`Source: ${initialFile.name}`);
        
        const reader = new FileReader();
        const fileAsBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(initialFile);
        });

        const fileData = { data: fileAsBase64, mimeType: initialFile.type || 'application/pdf' };
        
        addLog("Analyzing document integrity...");
        const validation = await analyzeResumeATS(initialFile.name, fileData);
        
        if (!isMounted) return;

        if (validation && validation.isResume === false) {
          setIsRejected(true);
          setRejectionMessage(validation.rejectionMessage || "This file does not appear to be a professional resume.");
          return;
        }

        addLog("Identity confirmed. Commencing deep extraction...");
        const result = await extractResumeData(fileData);
        
        if (!isMounted) return;
        
        addLog("Synthesis successful. Finalizing port...");
        setProgress(100);
        setIsComplete(true);
        
        setTimeout(() => {
          if (isMounted) onImportComplete(result);
        }, 1000);

      } catch (err: any) {
        console.error("DirectPort Workflow Error:", err);
        if (isMounted) {
          setError(err.message || "A neural bottleneck occurred during porting. Please try another file.");
        }
      }
    };

    startProcessing();

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [initialFile, onImportComplete, onCancel]);

  if (isRejected) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full space-y-10">
          <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Port Terminated</h2>
            <p className="text-slate-500 font-medium leading-relaxed">{rejectionMessage}</p>
          </div>
          <button onClick={onCancel} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all">Try Another File</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full space-y-10">
          <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-16 h-16 text-amber-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Scan Halted</h2>
            <p className="text-slate-500 font-medium leading-relaxed">{error}</p>
          </div>
          <button onClick={onCancel} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all">Go Back & Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%"><pattern id="port-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#port-grid)" /></svg>
      </div>

      <div className="max-w-xl w-full relative">
        <div className="bg-white rounded-[4.5rem] shadow-2xl border border-slate-100 p-12 md:p-20 relative overflow-hidden">
          {!isComplete && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
               <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent shadow-[0_0_20px_rgba(37,99,235,0.6)] animate-[scan_3s_linear_infinite]" />
            </div>
          )}

          <div className="relative z-10 space-y-12">
            <div className="relative w-64 h-64 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="120" fill="none" stroke="#f8fafc" strokeWidth="12" />
                <circle
                  cx="128" cy="128" r="120" fill="none"
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
                    <div className="text-6xl font-black text-slate-900 tracking-tighter">{Math.round(progress)}%</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 animate-pulse">Scanning</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {isComplete ? "Success" : "AI Direct Port"}
              </h2>
              <p className="font-bold text-slate-400 flex items-center justify-center h-6 text-sm">
                {isComplete ? "Redirecting to Builder..." : steps[step].label}
              </p>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-left space-y-2 border border-slate-800 h-32 overflow-hidden relative">
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-10" />
              {logs.map((log, i) => (
                <p key={i} className={`text-[11px] font-mono flex items-center ${i === 0 ? 'text-blue-400 font-bold' : 'text-slate-500 opacity-40'}`}>
                  {i === 0 && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes scan { 0% { top: -10%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 110%; opacity: 0; } }`}</style>
    </div>
  );
};

export default DirectPort;
