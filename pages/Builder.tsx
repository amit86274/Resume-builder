
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Plus, Trash2, Sparkles, 
  RotateCcw, Download, Eye, FileSearch, CheckCircle,
  Layout as LayoutIcon, Briefcase, GraduationCap, Code,
  X, Loader2, Info
} from 'lucide-react';
import { ResumeData, AnalyzerResult, TemplateTier } from '../types';
import { INITIAL_RESUME, TEMPLATES } from '../constants';
import { improveSummary, rewriteExperience, analyzeResume } from '../services/gemini';
import { ModernTemplate, MinimalTemplate } from '../components/ResumeTemplates';

interface BuilderProps {
  user?: any;
}

const Builder: React.FC<BuilderProps> = ({ user }) => {
  const [data, setData] = useState<ResumeData>(INITIAL_RESUME);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzerResult | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isImproving, setIsImproving] = useState<string | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    if (showSaveSuccess) {
      const timer = setTimeout(() => setShowSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveSuccess]);

  const steps = [
    { id: 'personal', title: 'Personal Info', icon: <Eye /> },
    { id: 'experience', title: 'Work History', icon: <Briefcase /> },
    { id: 'education', title: 'Education', icon: <GraduationCap /> },
    { id: 'skills', title: 'Skills & More', icon: <Code /> },
    { id: 'template', title: 'Templates', icon: <LayoutIcon /> },
  ];

  const handleUpdate = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalInfoUpdate = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addItem = (field: 'experience' | 'education' | 'projects') => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...(field === 'experience' ? { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' } : {}),
      ...(field === 'education' ? { school: '', degree: '', location: '', startDate: '', endDate: '', grade: '' } : {}),
      ...(field === 'projects' ? { name: '', link: '', description: '' } : {}),
    };
    setData(prev => ({ ...prev, [field]: [...prev[field] as any, newItem] }));
  };

  const removeItem = (field: 'experience' | 'education' | 'projects', id: string) => {
    setData(prev => ({ ...prev, [field]: (prev[field] as any).filter((item: any) => item.id !== id) }));
  };

  const handleAIImproveSummary = async () => {
    if (!data.personalInfo.summary) return;
    setIsImproving('summary');
    try {
      const improved = await improveSummary(data.personalInfo.summary);
      handlePersonalInfoUpdate('summary', improved);
    } finally {
      setIsImproving(null);
    }
  };

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await analyzeResume(data);
      setAnalysis(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (user?.plan === 'free') {
      alert("Free plan only supports TXT export. Upgrade to Pro for PDF/DOCX!");
    } else {
      window.print();
    }
  };

  const renderStep = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
        {(() => {
          switch (activeStep) {
            case 0:
              return (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h3 className="text-2xl font-black text-slate-900">Essential Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" value={data.personalInfo.fullName} onChange={v => handlePersonalInfoUpdate('fullName', v)} placeholder="Rahul Sharma" />
                    <Input label="Email" value={data.personalInfo.email} onChange={v => handlePersonalInfoUpdate('email', v)} placeholder="rahul@example.com" />
                    <Input label="Phone" value={data.personalInfo.phone} onChange={v => handlePersonalInfoUpdate('phone', v)} placeholder="+91 98765 43210" />
                    <Input label="Location" value={data.personalInfo.location} onChange={v => handlePersonalInfoUpdate('location', v)} placeholder="Mumbai, India" />
                  </div>
                  <div className="relative group">
                    <div className="flex justify-between mb-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Professional Bio</label>
                      <button 
                        onClick={handleAIImproveSummary}
                        disabled={!!isImproving}
                        className="group flex items-center bg-blue-50 px-4 py-1.5 rounded-full text-xs text-blue-600 font-black hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3 mr-2 group-hover:animate-spin" />
                        {isImproving === 'summary' ? 'Magic working...' : 'AI Enhance with Gemini'}
                      </button>
                    </div>
                    <textarea 
                      className="w-full border-2 border-slate-100 rounded-2xl p-4 h-40 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none bg-slate-50/30"
                      value={data.personalInfo.summary}
                      onChange={e => handlePersonalInfoUpdate('summary', e.target.value)}
                      placeholder="I am a software developer with 5 years experience..."
                    />
                  </div>
                </div>
              );
            case 1:
              return (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                      <h3 className="text-2xl font-black text-slate-900">Career History</h3>
                    </div>
                    <button onClick={() => addItem('experience')} className="flex items-center bg-slate-900 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-600 transition shadow-lg">
                      <Plus className="w-4 h-4 mr-1" /> Add Job
                    </button>
                  </div>
                  {data.experience.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                      <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No experience added yet. Add your work history to start.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {data.experience.map((exp, idx) => (
                        <div key={exp.id} className="p-6 border-2 border-slate-100 rounded-3xl bg-white hover:border-blue-100 transition shadow-sm group">
                          <div className="flex justify-between items-start mb-6">
                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Role {idx + 1}</span>
                            <button onClick={() => removeItem('experience', exp.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Input label="Company" value={exp.company} onChange={v => {
                              const newList = [...data.experience];
                              newList[idx].company = v;
                              handleUpdate('experience', newList);
                            }} />
                            <Input label="Position" value={exp.position} onChange={v => {
                              const newList = [...data.experience];
                              newList[idx].position = v;
                              handleUpdate('experience', newList);
                            }} />
                            <Input label="Start Date" value={exp.startDate} placeholder="e.g. Jan 2020" onChange={v => {
                              const newList = [...data.experience];
                              newList[idx].startDate = v;
                              handleUpdate('experience', newList);
                            }} />
                            <Input label="End Date" value={exp.endDate} placeholder="e.g. Present" onChange={v => {
                              const newList = [...data.experience];
                              newList[idx].endDate = v;
                              handleUpdate('experience', newList);
                            }} />
                          </div>
                          <textarea 
                            className="w-full border-2 border-slate-50 rounded-2xl p-4 h-32 text-sm focus:border-blue-400 outline-none transition-all bg-slate-50/50"
                            value={exp.description}
                            onChange={e => {
                              const newList = [...data.experience];
                              newList[idx].description = e.target.value;
                              handleUpdate('experience', newList);
                            }}
                            placeholder="Managed a team of 5, increased efficiency by 20%..."
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            case 4:
              return (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h3 className="text-2xl font-black text-slate-900">Select Template</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {TEMPLATES.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => handleUpdate('templateId', t.id)}
                        className={`group relative p-2 border-4 rounded-[2rem] overflow-hidden transition-all duration-300 ${data.templateId === t.id ? 'border-blue-600 bg-blue-50 shadow-2xl' : 'border-slate-100 hover:border-blue-200'}`}
                      >
                        <img src={t.thumbnail} alt={t.name} className="w-full h-64 object-cover rounded-[1.5rem] mb-4 transition-transform group-hover:scale-105" />
                        <div className="p-4 flex justify-between items-center">
                          <div className="text-left">
                            <span className="text-sm font-black text-slate-900 block mb-1">{t.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${t.tier === TemplateTier.PREMIUM ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                              {t.tier}
                            </span>
                          </div>
                          {data.templateId === t.id && (
                            <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg animate-in zoom-in">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            default:
              return <div className="p-20 text-center text-slate-400"><Info className="w-12 h-12 mx-auto mb-4 opacity-20" />More sections coming soon...</div>;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col md:flex-row font-inter">
      {/* Editor Column */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-12 no-print ${isPreviewMode ? 'hidden md:block' : 'block'}`}>
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Crafting Excellence</h2>
              <p className="text-slate-500 mt-2 font-medium">Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}</p>
            </div>
            <button 
              onClick={handleAIAnalyze}
              disabled={isAnalyzing}
              className="group relative flex items-center justify-center bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 overflow-hidden"
            >
              {isAnalyzing && <div className="absolute inset-0 bg-blue-600 animate-pulse" />}
              <span className="relative flex items-center">
                {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileSearch className="w-4 h-4 mr-2" />}
                {isAnalyzing ? 'Scanning Resume...' : 'Analyze with AI'}
              </span>
            </button>
          </div>

          {/* New Stepper */}
          <div className="bg-slate-50 p-2 rounded-3xl flex items-center justify-between gap-2 overflow-x-auto">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`flex-1 flex items-center justify-center space-x-3 py-3.5 px-4 rounded-2xl transition-all duration-300 min-w-[140px] ${activeStep === idx ? 'bg-white shadow-lg shadow-slate-200/50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeStep === idx ? 'scale-110' : ''}`}>
                   {React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
                </div>
                <span className="text-xs font-black uppercase tracking-widest hidden lg:inline">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Analysis Results Overlay - Vibrant & Animated */}
          {analysis && (
            <div className="bg-gradient-to-br from-indigo-700 to-blue-800 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden animate-in slide-in-from-top duration-700">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-10">
                   <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-3 rounded-2xl"><Sparkles className="w-8 h-8 text-blue-300" /></div>
                      <div>
                        <h4 className="text-2xl font-black">AI Recruitment Review</h4>
                        <p className="text-indigo-200 text-sm">Real-time scan completed</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-4xl font-black text-blue-300">{analysis.score}%</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">Impact</div>
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div className="text-center">
                        <div className="text-4xl font-black text-pink-400">{analysis.atsScore}%</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">ATS Match</div>
                      </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="bg-black/10 p-6 rounded-3xl border border-white/5">
                     <span className="text-xs font-black uppercase tracking-widest text-indigo-200 block mb-4">Critical Improvements</span>
                     <ul className="space-y-3">
                       {analysis.missingSections.map((s, i) => (
                         <li key={i} className="flex items-start text-sm">
                           <CheckCircle className="w-4 h-4 mr-2 text-pink-400 shrink-0 mt-0.5" />
                           {s}
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div className="bg-black/10 p-6 rounded-3xl border border-white/5">
                     <span className="text-xs font-black uppercase tracking-widest text-indigo-200 block mb-4">Expert Feedback</span>
                     <p className="text-sm leading-relaxed italic">{analysis.generalFeedback}</p>
                   </div>
                 </div>
               </div>
               <button onClick={() => setAnalysis(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-100 border border-slate-50 min-h-[600px] flex flex-col justify-between">
            {renderStep()}

            <div className="flex justify-between items-center pt-12 mt-12 border-t border-slate-100">
              <button 
                onClick={() => setActiveStep(s => Math.max(0, s - 1))}
                disabled={activeStep === 0}
                className="flex items-center text-slate-400 font-black hover:text-slate-900 disabled:opacity-20 transition-colors uppercase tracking-widest text-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous Step
              </button>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsPreviewMode(true)}
                  className="md:hidden flex items-center bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  <Eye className="w-4 h-4 mr-2" /> Preview
                </button>
                
                {activeStep === steps.length - 1 ? (
                  <button 
                    onClick={() => setShowSaveSuccess(true)}
                    className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
                  >
                    Finalize Resume
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveStep(s => Math.min(steps.length - 1, s + 1))}
                    className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black shadow-2xl shadow-slate-900/10 hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
                  >
                    Next Component
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Column - Modern Dark UI */}
      <div className={`w-full md:w-[45%] lg:w-[45%] bg-slate-900 p-4 md:p-12 overflow-y-auto flex flex-col items-center ${isPreviewMode ? 'block fixed inset-0 z-50' : 'hidden md:flex'}`}>
        <div className="max-w-[800px] w-full flex justify-between items-center mb-10 no-print">
          <div className="flex items-center space-x-4">
             <button 
                onClick={() => setIsPreviewMode(false)}
                className="md:hidden text-white flex items-center bg-slate-800 p-3 rounded-2xl"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>
             <div>
               <h3 className="text-white font-black text-2xl tracking-tight">Live Render</h3>
               <p className="text-slate-500 text-xs uppercase tracking-widest">A4 Layout Optimized</p>
             </div>
          </div>
          <div className="flex space-x-3">
             <button onClick={() => setData(INITIAL_RESUME)} className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all" title="Reset All Fields">
               <RotateCcw className="w-5 h-5" />
             </button>
             <button 
              onClick={handleExport}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black flex items-center hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20"
             >
               <Download className="w-4 h-4 mr-2" />
               Download
             </button>
          </div>
        </div>

        {/* Floating Success Notification */}
        {showSaveSuccess && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-black animate-in fade-in slide-in-from-bottom-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-3" />
            Resume synced successfully!
          </div>
        )}

        <div className="w-full max-w-[21cm] transform scale-100 origin-top shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-sm print:shadow-none print:m-0 print:scale-100 bg-white">
          {data.templateId === 'modern' && <ModernTemplate data={data} />}
          {data.templateId === 'minimal' && <MinimalTemplate data={data} />}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em]">{label}</label>
    <input 
      type="text"
      placeholder={placeholder}
      className="border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none bg-slate-50/20"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default Builder;
