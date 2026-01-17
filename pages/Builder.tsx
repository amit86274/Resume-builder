import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Plus, Trash2, Sparkles, 
  RotateCcw, Download, Eye, FileSearch, CheckCircle,
  Layout as LayoutIcon, Briefcase, GraduationCap, Code,
  X, Loader2, Info, Save
} from 'lucide-react';
import { ResumeData, AnalyzerResult, TemplateTier } from '../types';
import { INITIAL_RESUME, TEMPLATES, MOCK_RESUME_DATA } from '../constants';
import { improveSummary, rewriteExperience, analyzeResumeATS } from '../services/gemini';
import { MasterTemplateSelector } from '../components/ResumeTemplates';
import { MockAPI } from '../services/api';

interface BuilderProps {
  user?: any;
  initialTemplateId?: string;
}

const Builder: React.FC<BuilderProps> = ({ user, initialTemplateId }) => {
  const [data, setData] = useState<ResumeData>(() => ({
    ...INITIAL_RESUME,
    templateId: initialTemplateId || INITIAL_RESUME.templateId
  }));
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzerResult | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isImproving, setIsImproving] = useState<string | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [fullPreviewId, setFullPreviewId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTemplateId) {
      setData(prev => ({ ...prev, templateId: initialTemplateId }));
    }
  }, [initialTemplateId]);

  const steps = [
    { id: 'personal', title: 'Personal', icon: <Eye /> },
    { id: 'experience', title: 'History', icon: <Briefcase /> },
    { id: 'education', title: 'Education', icon: <GraduationCap /> },
    { id: 'skills', title: 'Skills', icon: <Code /> },
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

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={data.personalInfo.fullName} onChange={v => handlePersonalInfoUpdate('fullName', v)} />
              <Input label="Email" value={data.personalInfo.email} onChange={v => handlePersonalInfoUpdate('email', v)} />
              <Input label="Phone" value={data.personalInfo.phone} onChange={v => handlePersonalInfoUpdate('phone', v)} />
              <Input label="Location" value={data.personalInfo.location} onChange={v => handlePersonalInfoUpdate('location', v)} />
            </div>
            <textarea 
              className="w-full border-2 border-slate-100 rounded-2xl p-4 h-40 text-sm focus:border-blue-500 transition-all outline-none bg-slate-50/30 text-black"
              value={data.personalInfo.summary}
              onChange={e => handlePersonalInfoUpdate('summary', e.target.value)}
              placeholder="Tell your professional story..."
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black">Choose a Style</h3>
            <div className="grid grid-cols-2 gap-4 pb-20">
              {TEMPLATES.map(t => (
                <div key={t.id} className="relative group">
                  <button 
                    onClick={() => handleUpdate('templateId', t.id)}
                    className={`w-full text-left p-2 border-2 rounded-2xl transition-all ${data.templateId === t.id ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-slate-100'}`}
                  >
                    <img src={t.thumbnail} alt={t.name} className="w-full h-32 object-cover rounded-xl mb-2" />
                    <span className="text-[10px] font-black uppercase truncate block px-1">{t.name}</span>
                    {t.tier === TemplateTier.PREMIUM && <span className="absolute top-4 right-4 bg-amber-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black shadow-lg">PRO</span>}
                  </button>
                  <button 
                    onClick={() => setFullPreviewId(t.id)}
                    className="absolute top-2 left-2 bg-white/90 p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    title="Quick Preview"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default: return <div className="p-10 text-center font-bold text-slate-300">Section details incoming...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col md:flex-row font-inter">
      <div className={`flex-1 overflow-y-auto p-4 md:p-12 no-print ${isPreviewMode ? 'hidden md:block' : 'block'}`}>
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="bg-slate-50 p-1 rounded-2xl flex items-center justify-between gap-1">
            {steps.map((step, idx) => (
              <button key={step.id} onClick={() => setActiveStep(idx)} className={`flex-1 py-2.5 px-3 rounded-xl transition-all ${activeStep === idx ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest">{step.title}</span>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-slate-50 min-h-[600px]">
            {renderStep()}
          </div>
        </div>
      </div>
      <div className={`w-full md:w-[45%] bg-slate-100 p-4 md:p-12 overflow-y-auto flex flex-col items-center ${isPreviewMode ? 'block fixed inset-0 z-50' : 'hidden md:flex'}`}>
        <div className="max-w-[21cm] w-full shadow-2xl rounded-sm bg-white mb-20">
          <MasterTemplateSelector data={data} />
        </div>
      </div>

      {/* Full Screen Preview Modal for Template Selection */}
      {fullPreviewId && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setFullPreviewId(null)} />
           <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col items-center">
              <div className="w-full p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                 <h3 className="text-xl font-black uppercase tracking-tight">Format Preview: {TEMPLATES.find(t => t.id === fullPreviewId)?.name}</h3>
                 <button onClick={() => setFullPreviewId(null)} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="flex-1 w-full bg-slate-50 overflow-y-auto p-10 flex justify-center">
                 <div className="w-full max-w-[21cm] shadow-2xl bg-white origin-top scale-75 lg:scale-90">
                    <MasterTemplateSelector data={{ ...MOCK_RESUME_DATA, templateId: fullPreviewId }} />
                 </div>
              </div>
              <div className="w-full p-8 border-t border-slate-100 bg-white flex justify-center">
                 <button 
                   onClick={() => { handleUpdate('templateId', fullPreviewId); setFullPreviewId(null); }}
                   className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all"
                 >
                   Select this style
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange }: any) => (
  <div className="flex flex-col space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input type="text" className="border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none bg-slate-50/20 text-black" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

export default Builder;
