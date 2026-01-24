import React, { useState, useRef } from 'react';
import { 
  PhoneOff, Search, FileText, Upload, 
  Loader2, AlertTriangle, ArrowRight, 
  Zap, MessageSquareX, Ghost, Skull,
  UserX, CheckCircle2, Info, ChevronRight,
  TrendingDown, Target, BrainCircuit, Quote
} from 'lucide-react';
import { analyzeRejectionReasons } from '../services/gemini';

const CallAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const runAudit = async () => {
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

      const audit = await analyzeRejectionReasons({ data: base64, mimeType: file.type });
      setResult(audit);
    } catch (err: any) {
      setError(err.message || "Failed to audit resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-inter pb-24 selection:bg-red-50">
      {/* HEADER AREA */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
            <PhoneOff className="w-4 h-4" />
            <span>Interview Gap Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Stop the Silence. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Why Aren't They Calling?</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-14 px-4">
            Recruiters spend 6 seconds on your resume. If they're skipping you, we'll tell you the brutal truth—and how to fix it in 72 hours.
          </p>

          {!result && !isAnalyzing && (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 px-4">
              <div 
                className="group relative p-12 md:p-16 rounded-[4rem] border-4 border-dashed border-slate-200 bg-slate-50/30 hover:border-blue-500/50 hover:bg-white hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx" onChange={handleFile} />
                <div className="flex flex-col items-center space-y-8">
                  <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-xl
                    ${file ? 'bg-emerald-500 text-white rotate-0' : 'bg-slate-900 text-white group-hover:scale-110 group-hover:-rotate-6 shadow-slate-200'}`}>
                    {file ? <FileText className="w-12 h-12" /> : <Upload className="w-12 h-12" />}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {file ? file.name : "Select Resume to Audit"}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                      Upload your current version for a POV Audit
                    </p>
                  </div>
                </div>
              </div>
              
              {file && (
                <button 
                  onClick={runAudit}
                  className="w-full mt-10 py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl hover:bg-red-600 active:scale-95 flex items-center justify-center space-x-4"
                >
                  <BrainCircuit className="w-6 h-6" />
                  <span>Execute Recruiter POV Scan</span>
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
             <div className="w-32 h-32 bg-red-50 rounded-[3rem] flex items-center justify-center animate-pulse">
                <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
             </div>
             <Ghost className="w-10 h-10 text-red-400 absolute -top-4 -right-4 m-auto animate-bounce" />
          </div>
          <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Thinking Like a Recruiter...</h2>
             <div className="flex items-center justify-center space-x-3 text-slate-400 font-mono text-xs uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                <span>Simulating Tier-1 Hiring Manager Logic</span>
             </div>
          </div>
        </div>
      )}

      {/* RESULTS GRID */}
      {result && (
        <div className="max-w-7xl mx-auto px-6 pt-20 space-y-16 animate-in slide-in-from-bottom-8 duration-1000">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* VERDICT & CALL SCORE */}
            <div className="lg:col-span-4 space-y-10">
               <div className="bg-white rounded-[4rem] p-12 border border-slate-100 flex flex-col items-center text-center shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Interview Call Probability</p>
                  <div className="relative w-56 h-56 mb-10">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                       <circle
                         cx="112" cy="112" r="100" fill="none"
                         stroke={result.callProbability > 70 ? "#10b981" : result.callProbability > 40 ? "#f59e0b" : "#ef4444"}
                         strokeWidth="16"
                         strokeDasharray={628.31}
                         strokeDashoffset={628.31 - (628.31 * result.callProbability) / 100}
                         className="transition-all duration-[1500ms] ease-out"
                         strokeLinecap="round"
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-7xl font-black text-slate-900 tracking-tighter">{result.callProbability}%</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chance of Call</span>
                     </div>
                  </div>
                  <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${result.callProbability > 60 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {result.callProbability > 60 ? 'Strong Profile' : 'High Rejection Risk'}
                  </div>
               </div>

               <div className="bg-slate-900 rounded-[3.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Skull className="w-24 h-24 text-white" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center">
                    <Quote className="w-4 h-4 mr-2 text-red-500" /> The Brutal Verdict
                  </h3>
                  <p className="text-lg font-bold text-white leading-relaxed italic relative z-10">
                    "{result.brutalVerdict}"
                  </p>
                  <div className="pt-4 border-t border-white/10">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Signed, Your AI Recruiter</p>
                  </div>
               </div>
            </div>

            {/* RED FLAGS & FIXES */}
            <div className="lg:col-span-8 space-y-10">
               <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-16">
                  {/* RED FLAGS SECTION */}
                  <div className="space-y-10">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-sm"><UserX className="w-5 h-5" /></div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Critical Red Flags Detected</h4>
                     </div>
                     <div className="space-y-5">
                        {result.redFlags.map((flag: any, i: number) => (
                          <div key={i} className="flex items-start justify-between p-8 bg-white rounded-[2.5rem] border border-red-100 hover:border-red-300 hover:shadow-xl transition-all group">
                             <div className="flex space-x-8">
                                <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${flag.impact === 'High' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                                   <AlertTriangle className="w-7 h-7" />
                                </div>
                                <div>
                                   <div className="flex items-center space-x-3 mb-1">
                                      <p className="text-lg font-black text-slate-900 tracking-tight">{flag.issue}</p>
                                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500`}>{flag.impact} Impact</span>
                                   </div>
                                   <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                                      <span className="font-black text-red-600 uppercase text-[10px] mr-2">The Fix:</span>
                                      {flag.fix}
                                   </p>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* RECRUITER DISLIKES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                     <div className="space-y-8">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shadow-sm"><MessageSquareX className="w-5 h-5" /></div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Recruiter Pet Peeves</h4>
                        </div>
                        <ul className="space-y-4">
                           {result.recruiterPetPeeves.map((peeve: string, i: number) => (
                             <li key={i} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-600">
                               <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                               <span>{peeve}</span>
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="space-y-8">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Target className="w-5 h-5" /></div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Missing Impact Data</h4>
                        </div>
                        <ul className="space-y-4">
                           {result.missingImpactStatements.map((missing: string, i: number) => (
                             <li key={i} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-600">
                               <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                               <span>{missing}</span>
                             </li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  {/* 72-HOUR PLAN */}
                  <div className="p-10 bg-animate-gradient rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-32 h-32" /></div>
                     <div className="relative z-10 space-y-8">
                        <div className="space-y-2">
                           <h4 className="text-2xl font-black tracking-tight uppercase">Your 72-Hour Fix Plan</h4>
                           <p className="text-white/70 font-medium">Do these 3 things to triple your call rate immediately.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {result.top3Fixes.map((fix: string, i: number) => (
                             <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                <div className="text-3xl font-black mb-4 opacity-40">0{i+1}</div>
                                <p className="text-sm font-bold leading-relaxed">{fix}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                     <div className="flex items-center space-x-4 text-slate-400">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Validated against Tier-1 Recruitment Standards</span>
                     </div>
                     <button 
                        onClick={() => { setFile(null); setResult(null); }}
                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center space-x-3"
                     >
                        <Search className="w-4 h-4" />
                        <span>Audit New Iteration</span>
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
            <p className="font-black uppercase text-[10px] tracking-[0.3em] mb-1 opacity-60">Audit System Error</p>
            <p className="text-base font-bold">{error}</p>
            <button onClick={() => setError(null)} className="mt-4 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Dismiss Warning</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallAnalyzer;