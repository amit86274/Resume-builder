import React, { useState, useRef } from 'react';
import { 
  Map, Search, FileText, Upload, 
  Loader2, AlertTriangle, ArrowRight, 
  Zap, BrainCircuit, Target, CheckCircle2,
  TrendingUp, BookOpen, ChevronRight, Sparkles,
  BarChart4, ArrowUpRight, GraduationCap, Code2, Layers
} from 'lucide-react';
import { analyzeSkillGap } from '../services/gemini';

const SkillGapMap: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const runAnalysis = async () => {
    if (!file || !jobDescription) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const analysis = await analyzeSkillGap({ data: base64, mimeType: file.type }, jobDescription);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Failed to analyze skill gap.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-inter pb-24 selection:bg-purple-100">
      {/* HEADER AREA */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
            <Map className="w-4 h-4" />
            <span>Career Path Visualization</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Map Your Skill Gap. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">See Exactly What's Missing.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-14 px-4">
            Compare your resume against any job description. We'll show you exactly where you stand, what the employer requires, and the shortest path to bridge the gap.
          </p>

          {!result && !isAnalyzing && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 px-4">
              {/* RESUME UPLOAD */}
              <div 
                className="group relative p-10 rounded-[3rem] border-4 border-dashed border-slate-200 bg-slate-50/30 hover:border-purple-500/50 hover:bg-white hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center h-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx" onChange={handleFile} />
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-xl mb-6
                  ${file ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white group-hover:scale-110 group-hover:rotate-6 shadow-purple-200'}`}>
                  {file ? <FileText className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                  {file ? file.name : "Step 1: Your Resume"}
                </h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  {file ? "File Linked" : "Upload your current version"}
                </p>
              </div>

              {/* JD INPUT */}
              <div className="p-10 rounded-[3rem] border-4 border-slate-100 bg-white shadow-xl flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><Search className="w-5 h-5" /></div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Step 2: Target Job</h3>
                </div>
                <textarea 
                  className="w-full flex-1 border border-slate-100 rounded-2xl p-6 text-sm font-medium focus:border-purple-500 outline-none bg-slate-50 transition-all resize-none min-h-[160px] text-black"
                  placeholder="Paste the Job Description or Role requirements here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <button 
                  onClick={runAnalysis}
                  disabled={!file || !jobDescription}
                  className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl flex items-center justify-center space-x-4
                    ${!file || !jobDescription 
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                      : 'bg-animate-gradient text-white hover:scale-[1.01] active:scale-95 shadow-purple-500/20'}`}
                >
                  <BrainCircuit className="w-6 h-6" />
                  <span>Generate Visual Gap Map</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ANALYSIS LOADING */}
      {isAnalyzing && (
        <div className="max-w-2xl mx-auto px-6 py-40 text-center space-y-10 animate-in fade-in duration-500">
          <div className="relative inline-block">
             <div className="w-32 h-32 bg-purple-50 rounded-[3rem] flex items-center justify-center animate-pulse">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
             </div>
             <Layers className="w-10 h-10 text-purple-400 absolute -top-4 -right-4 m-auto animate-bounce" />
          </div>
          <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Quantifying Market Gap...</h2>
             <div className="flex items-center justify-center space-x-3 text-slate-400 font-mono text-xs uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                <span>Comparing Resume Vectors against JD requirements</span>
             </div>
          </div>
        </div>
      )}

      {/* RESULTS GRID */}
      {result && (
        <div className="max-w-7xl mx-auto px-6 pt-20 space-y-16 animate-in slide-in-from-bottom-8 duration-1000">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* OVERALL MATCH & KEYWORDS */}
            <div className="lg:col-span-4 space-y-10">
               <div className="bg-white rounded-[4rem] p-12 border border-slate-100 flex flex-col items-center text-center shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Job-Resume Neural Sync</p>
                  <div className="relative w-56 h-56 mb-10">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                       <circle
                         cx="112" cy="112" r="100" fill="none"
                         stroke="#7c3aed"
                         strokeWidth="16"
                         strokeDasharray={628.31}
                         strokeDashoffset={628.31 - (628.31 * result.matchScore) / 100}
                         className="transition-all duration-[2000ms] ease-out"
                         strokeLinecap="round"
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-7xl font-black text-slate-900 tracking-tighter">{result.matchScore}%</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</span>
                     </div>
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed mb-8 italic">"{result.summary}"</p>
               </div>

               <div className="bg-slate-900 rounded-[3.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                     <BarChart4 className="w-24 h-24 text-white" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center">
                    <Target className="w-4 h-4 mr-2" /> Key Missing Modules
                  </h3>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {result.missingKeywords.map((kw: string, i: number) => (
                      <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-white/10 text-[10px] font-bold text-white/50 leading-relaxed">
                    Recruiters filter for these specific keywords. Adding them to your resume is priority #1.
                  </div>
               </div>
            </div>

            {/* VISUAL SKILLS MAP */}
            <div className="lg:col-span-8 space-y-10">
               <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-12">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shadow-sm"><BarChart4 className="w-5 h-5" /></div>
                        <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">Skill Calibration Map</h4>
                     </div>
                     <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                           <div className="w-3 h-3 rounded-full bg-slate-100" />
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <div className="w-3 h-3 rounded-full bg-purple-600" />
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">You</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {result.skillsMap.map((item: any, i: number) => (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">{item.skill}</p>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                              item.status === 'Match' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === 'Gap' ? 'bg-red-50 text-red-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>{item.status}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 tracking-widest">{item.userLevel}/10</span>
                        </div>
                        <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          {/* Required level indicator */}
                          <div 
                            className="absolute inset-y-0 left-0 bg-slate-200 border-r-2 border-slate-300"
                            style={{ width: `${item.requiredLevel * 10}%` }}
                          />
                          {/* User level indicator */}
                          <div 
                            className="absolute inset-y-0 left-0 bg-purple-600 rounded-full transition-all duration-[1.5s] ease-out shadow-lg"
                            style={{ width: `${item.userLevel * 10}%`, opacity: 0.9 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* LEARNING PATH */}
                  <div className="space-y-10 pt-12 border-t border-slate-100">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><GraduationCap className="w-5 h-5" /></div>
                        <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">Recommended Roadmap</h4>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {result.learningPath.map((path: any, i: number) => (
                          <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group">
                             <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                   {path.resourceType === 'Course' ? <BookOpen className="w-6 h-6 text-blue-500" /> : 
                                    path.resourceType === 'Project' ? <Code2 className="w-6 h-6 text-purple-500" /> : 
                                    <Sparkles className="w-6 h-6 text-indigo-500" />}
                                </div>
                                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${
                                  path.effort === 'Low' ? 'bg-emerald-50 text-emerald-600' :
                                  path.effort === 'Medium' ? 'bg-orange-50 text-orange-600' :
                                  'bg-red-50 text-red-600'
                                }`}>{path.effort} Effort</span>
                             </div>
                             <h5 className="text-lg font-black text-slate-900 tracking-tight mb-2">{path.topic}</h5>
                             <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6">{path.description}</p>
                             <div className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:underline">
                                Start Roadmap <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                     <div className="flex items-center space-x-4 text-slate-400">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Validated Roadmap for Market Domination</span>
                     </div>
                     <button 
                        onClick={() => { setFile(null); setResult(null); }}
                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-purple-600 transition-all shadow-xl active:scale-95 flex items-center space-x-3"
                     >
                        <Search className="w-4 h-4" />
                        <span>Compare New Role</span>
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
            <p className="font-black uppercase text-[10px] tracking-[0.3em] mb-1 opacity-60">System Error</p>
            <p className="text-base font-bold">{error}</p>
            <button onClick={() => setError(null)} className="mt-4 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Dismiss Warning</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapMap;