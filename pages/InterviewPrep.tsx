import React, { useState, useRef } from 'react';
import { 
  Mic, Search, FileText, Upload, 
  Loader2, AlertTriangle, ArrowRight, 
  Zap, BrainCircuit, Target, CheckCircle2,
  MessagesSquare, Lightbulb, UserCheck, Play,
  BookOpen, ChevronDown, ChevronUp, Quote, Sparkles
} from 'lucide-react';
import { generateInterviewPrep } from '../services/gemini';

const InterviewPrep: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const runPrep = async () => {
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

      const prep = await generateInterviewPrep({ data: base64, mimeType: file.type });
      setResult(prep);
    } catch (err: any) {
      setError(err.message || "Failed to generate interview prep.");
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
            <Mic className="w-4 h-4" />
            <span>AI Interview Readiness Suite</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Ace the Interview. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Know the Questions Before They Ask.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-14 px-4">
            Upload your resume, and our AI Technical Interviewer will predict exactly what questions you'll face and how to answer them with high-impact model answers.
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
                      {file ? file.name : "Select Resume for Mock Scan"}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                      Your data is used only to generate your custom prep guide
                    </p>
                  </div>
                </div>
              </div>
              
              {file && (
                <button 
                  onClick={runPrep}
                  className="w-full mt-10 py-6 bg-animate-gradient text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center space-x-4"
                >
                  <BrainCircuit className="w-6 h-6" />
                  <span>Execute AI Prep Engine</span>
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
             <Sparkles className="w-10 h-10 text-indigo-400 absolute -top-4 -right-4 m-auto animate-bounce" />
          </div>
          <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Simulating Your Interviewer...</h2>
             <div className="flex items-center justify-center space-x-3 text-slate-400 font-mono text-xs uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                <span>Generating Personalized Mock Scenarios</span>
             </div>
          </div>
        </div>
      )}

      {/* RESULTS GRID */}
      {result && (
        <div className="max-w-7xl mx-auto px-6 pt-20 space-y-16 animate-in slide-in-from-bottom-8 duration-1000">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* STRATEGY & CONFIDENCE */}
            <div className="lg:col-span-4 space-y-10">
               <div className="bg-white rounded-[4rem] p-12 border border-slate-100 flex flex-col space-y-8 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 flex items-center">
                      <Target className="w-4 h-4 mr-2" /> Master Strategy
                    </h3>
                    <p className="text-lg font-black text-slate-900 leading-tight">Your Custom Approach</p>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed relative z-10">
                    {result.interviewStrategy}
                  </p>
               </div>

               <div className="bg-slate-900 rounded-[3.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                     <UserCheck className="w-24 h-24 text-white" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" /> Confidence Booster
                  </h3>
                  <p className="text-lg font-bold text-white leading-relaxed italic relative z-10">
                    "{result.confidenceBooster}"
                  </p>
                  <div className="pt-4 border-t border-white/10">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">You've Got This.</p>
                  </div>
               </div>

               <button className="w-full p-10 bg-animate-gradient rounded-[3rem] text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group text-left">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Play className="w-7 h-7 fill-current" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full">Pro Feature</span>
                  </div>
                  <h4 className="text-2xl font-black tracking-tight mb-2">Start Live Mock Session</h4>
                  <p className="text-white/70 text-sm font-medium leading-relaxed">Practice with our AI Voice Interviewer and get real-time verbal feedback.</p>
               </button>
            </div>

            {/* PREDICTED QUESTIONS */}
            <div className="lg:col-span-8 space-y-10">
               <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-12">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><MessagesSquare className="w-5 h-5" /></div>
                        <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">10 Predicted Questions</h4>
                     </div>
                  </div>

                  <div className="space-y-4">
                    {result.predictedQuestions.map((q: any, i: number) => (
                      <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden transition-all hover:shadow-lg">
                        <button 
                          onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                          className="w-full p-8 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-start space-x-6">
                            <span className="text-2xl font-black text-slate-200 mt-0.5">{i+1}</span>
                            <div>
                               <div className="flex items-center space-x-3 mb-1">
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                    q.type === 'Technical' ? 'bg-blue-50 text-blue-600' :
                                    q.type === 'Behavioral' ? 'bg-purple-50 text-purple-600' :
                                    'bg-orange-50 text-orange-600'
                                  }`}>{q.type}</span>
                               </div>
                               <p className="text-lg font-black text-slate-900 tracking-tight leading-tight">{q.question}</p>
                            </div>
                          </div>
                          {expandedQuestion === i ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </button>
                        
                        {expandedQuestion === i && (
                          <div className="px-8 pb-10 space-y-8 animate-in slide-in-from-top-4 duration-300">
                             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Why they ask this:</p>
                                <p className="text-sm font-medium text-slate-600">{q.whyAsked}</p>
                             </div>

                             <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-indigo-600">
                                   <CheckCircle2 className="w-4 h-4" />
                                   <p className="text-[10px] font-black uppercase tracking-widest">The Model Answer (AI-Generated)</p>
                                </div>
                                <div className="p-8 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100">
                                   <p className="text-sm font-bold text-slate-800 leading-[1.8] italic">
                                      <Quote className="w-8 h-8 text-indigo-100 absolute -translate-x-4 -translate-y-4" />
                                      {q.modelAnswer}
                                   </p>
                                </div>
                             </div>

                             <div className="flex flex-wrap gap-2">
                                {q.keyKeywords.map((tag: string, tid: number) => (
                                   <span key={tid} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                                      {tag}
                                   </span>
                                ))}
                             </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                     <div className="flex items-center space-x-4 text-slate-400">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Prep Guide Sync'd with Enterprise Hiring Standards</span>
                     </div>
                     <button 
                        onClick={() => { setFile(null); setResult(null); }}
                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center space-x-3"
                     >
                        <Search className="w-4 h-4" />
                        <span>Prep with New Resume</span>
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
            <p className="font-black uppercase text-[10px] tracking-[0.3em] mb-1 opacity-60">Prep Engine Halted</p>
            <p className="text-base font-bold">{error}</p>
            <button onClick={() => setError(null)} className="mt-4 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Dismiss Warning</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;