import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, ShieldCheck, Search, FileText, 
  Upload, Loader2, CheckCircle2, XCircle, 
  AlertTriangle, ArrowRight, Sparkles, Terminal, 
  ChevronRight, BrainCircuit, Zap, BarChart3,
  MousePointer2, Layout, ScanText, Info
} from 'lucide-react';
import { simulateATSAnalysis } from '../services/gemini';

const ATSSimulator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const runSimulation = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const analysis = await simulateATSAnalysis({ data: base64, mimeType: file.type });
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Failed to simulate ATS.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-inter pb-24 selection:bg-blue-100">
      {/* HEADER AREA */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>AI Resume Audit Core</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Will Your Resume <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pass the Machine?</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-14 px-4">
            Most resumes are auto-rejected before a human sees them. 
            Our expert AI simulates Fortune 500 ATS logic to find your blind spots instantly.
          </p>

          {!result && !isAnalyzing && (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 px-4">
              <div 
                className="group relative p-12 md:p-16 rounded-[4rem] border-4 border-dashed border-slate-200 bg-slate-50/30 hover:border-blue-500/50 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx" onChange={handleFile} />
                <div className="flex flex-col items-center space-y-8">
                  <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-xl
                    ${file ? 'bg-green-500 text-white rotate-0' : 'bg-blue-600 text-white group-hover:scale-110 group-hover:rotate-6 shadow-blue-200'}`}>
                    {file ? <FileText className="w-12 h-12" /> : <Upload className="w-12 h-12" />}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {file ? file.name : "Select Resume to Audit"}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                      Supports PDF and DOCX formats
                    </p>
                  </div>
                </div>
              </div>
              
              {file && (
                <button 
                  onClick={runSimulation}
                  className="w-full mt-10 py-6 bg-animate-gradient text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center space-x-4"
                >
                  <BrainCircuit className="w-6 h-6" />
                  <span>Execute Neural Audit</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ANALYSIS LOADING */}
      {isAnalyzing && (
        <div className="max-w-2xl mx-auto px-6 py-40 text-center space-y-10 animate-in fade-in duration-500">
          <div className="relative inline-block">
             <div className="w-32 h-32 bg-blue-50 rounded-[3rem] flex items-center justify-center animate-pulse">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
             </div>
             <Zap className="w-10 h-10 text-blue-400 absolute -top-4 -right-4 m-auto animate-bounce" />
          </div>
          <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Scanning Neural Nodes...</h2>
             <div className="flex items-center justify-center space-x-3 text-slate-400 font-mono text-xs uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                <span>Simulating Workday & Greenhouse Logic</span>
             </div>
          </div>
        </div>
      )}

      {/* RESULTS GRID */}
      {result && (
        <div className="max-w-7xl mx-auto px-6 pt-20 space-y-16 animate-in slide-in-from-bottom-8 duration-1000">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* SCORE CARD */}
            <div className="lg:col-span-4 space-y-10">
               <div className="bg-white rounded-[4rem] p-12 border border-slate-100 flex flex-col items-center text-center shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Neural Compatibility Score</p>
                  <div className="relative w-56 h-56 mb-10">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                       <circle
                         cx="112" cy="112" r="100" fill="none"
                         stroke={result.score > 70 ? "#10b981" : "#3b82f6"}
                         strokeWidth="16"
                         strokeDasharray={628.31}
                         strokeDashoffset={628.31 - (628.31 * result.score) / 100}
                         className="transition-all duration-[1500ms] ease-out"
                         strokeLinecap="round"
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-7xl font-black text-slate-900 tracking-tighter">{result.score}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of 100</span>
                     </div>
                  </div>
                  <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${result.score > 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {result.score > 70 ? 'High Pass Probability' : 'Risk of Auto-Rejection'}
                  </div>
               </div>

               <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 space-y-8 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center">
                    <Terminal className="w-4 h-4 mr-2 text-indigo-600" /> Machine Interpretation
                  </h3>
                  <div className="bg-slate-900 rounded-3xl p-8 font-mono text-[11px] text-emerald-400/80 leading-relaxed border border-slate-800 h-56 overflow-y-auto shadow-inner">
                    <p className="text-slate-500 mb-4 font-bold uppercase tracking-widest text-[9px] border-b border-slate-800 pb-2">Raw Text Extraction Buffer:</p>
                    {result.extractedText}...
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-blue-800 font-medium leading-relaxed">This is exactly what the ATS parser "sees". If this looks fragmented or key data is missing, the machine cannot rank you.</p>
                  </div>
               </div>
            </div>

            {/* ANALYSIS DETAILS */}
            <div className="lg:col-span-8 space-y-10">
               <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm"><ScanText className="w-5 h-5" /></div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Validated Modules</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                           {result.foundSections.map((s: string, i: number) => (
                             <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase border border-emerald-100 flex items-center shadow-sm">
                               <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> {s}
                             </span>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-8">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-sm"><XCircle className="w-5 h-5" /></div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Parsing Failures</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                           {result.missingSections.length > 0 ? result.missingSections.map((s: string, i: number) => (
                             <span key={i} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase border border-red-100 flex items-center shadow-sm">
                               <AlertTriangle className="w-3.5 h-3.5 mr-2" /> {s}
                             </span>
                           )) : <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">All Critical Nodes Detected</div>}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-10">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><BarChart3 className="w-5 h-5" /></div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Optimization Roadmap</h4>
                     </div>
                     <div className="space-y-5">
                        {result.optimizationChecklist.map((item: any, i: number) => (
                          <div key={i} className="flex items-start justify-between p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all group">
                             <div className="flex space-x-8">
                                <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${item.status === 'pass' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                   {item.status === 'pass' ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
                                </div>
                                <div>
                                   <p className="text-lg font-black text-slate-900 tracking-tight">{item.item}</p>
                                   <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed max-w-xl">{item.fix}</p>
                                </div>
                             </div>
                             <div className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl shadow-sm self-start ${item.status === 'pass' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                {item.status === 'pass' ? 'OPTIMIZED' : 'CRITICAL FIX'}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                     <div className="flex items-center space-x-4 text-slate-400">
                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified against Fortune 500 Standards</span>
                     </div>
                     <button 
                        onClick={() => { setFile(null); setResult(null); }}
                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center space-x-3"
                     >
                        <Search className="w-4 h-4" />
                        <span>Scan New Iteration</span>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto px-6 mt-20 p-10 bg-red-50 border border-red-100 rounded-[3rem] shadow-xl flex items-center space-x-8 text-red-600 animate-in slide-in-from-top-4 duration-500">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="font-black uppercase text-[10px] tracking-[0.3em] mb-1 opacity-60">Neural Bottleneck Detected</p>
            <p className="text-base font-bold">{error}</p>
            <button onClick={() => setError(null)} className="mt-4 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Dismiss Warning</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSSimulator;