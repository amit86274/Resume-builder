import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Plus, Trash2, Sparkles, 
  RotateCcw, Download, Eye, FileSearch, CheckCircle,
  Layout as LayoutIcon, Briefcase, GraduationCap, Code,
  X, Loader2, Info, Save, Languages, Award
} from 'lucide-react';
import { ResumeData, AnalyzerResult, TemplateTier, Experience, Education } from '../types';
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
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [fullPreviewId, setFullPreviewId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTemplateId) {
      setData(prev => ({ ...prev, templateId: initialTemplateId }));
    }
  }, [initialTemplateId]);

  const steps = [
    { id: 'personal', title: 'Personal', icon: <Eye className="w-4 h-4" /> },
    { id: 'experience', title: 'History', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', title: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'skills', title: 'Skills & Extras', icon: <Code className="w-4 h-4" /> },
    { id: 'template', title: 'Templates', icon: <LayoutIcon className="w-4 h-4" /> },
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

  const addItem = (field: 'experience' | 'education' | 'skills' | 'languages' | 'certifications') => {
    if (field === 'experience') {
      const newItem: Experience = { id: Date.now().toString(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' };
      setData(prev => ({ ...prev, experience: [...prev.experience, newItem] }));
    } else if (field === 'education') {
      const newItem: Education = { id: Date.now().toString(), school: '', degree: '', location: '', startDate: '', endDate: '', grade: '' };
      setData(prev => ({ ...prev, education: [...prev.education, newItem] }));
    } else if (field === 'skills' || field === 'languages' || field === 'certifications') {
      setData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    }
  };

  const removeItem = (field: keyof ResumeData, idOrIndex: string | number) => {
    setData(prev => {
      const current = prev[field];
      if (Array.isArray(current)) {
        if (typeof idOrIndex === 'string') {
          return { ...prev, [field]: (current as any[]).filter(item => item.id !== idOrIndex) };
        } else {
          return { ...prev, [field]: (current as any[]).filter((_, idx) => idx !== idOrIndex) };
        }
      }
      return prev;
    });
  };

  const updateArrayItem = (field: 'experience' | 'education', id: string, key: string, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map(item => item.id === id ? { ...item, [key]: value } : item)
    }));
  };

  const updateStringArrayItem = (field: 'skills' | 'languages' | 'certifications', index: number, value: string) => {
    setData(prev => {
      const arr = [...(prev[field] as string[])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={data.personalInfo.fullName} onChange={(v: string) => handlePersonalInfoUpdate('fullName', v)} />
              <Input label="Email" value={data.personalInfo.email} onChange={(v: string) => handlePersonalInfoUpdate('email', v)} />
              <Input label="Phone" value={data.personalInfo.phone} onChange={(v: string) => handlePersonalInfoUpdate('phone', v)} />
              <Input label="Location" value={data.personalInfo.location} onChange={(v: string) => handlePersonalInfoUpdate('location', v)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Summary</label>
              <textarea 
                className="w-full border-2 border-slate-100 rounded-2xl p-4 h-40 text-sm focus:border-blue-500 transition-all outline-none bg-slate-50/30 text-black"
                value={data.personalInfo.summary}
                onChange={e => handlePersonalInfoUpdate('summary', e.target.value)}
                placeholder="Tell your professional story..."
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Work Experience</h3>
              <button onClick={() => addItem('experience')} className="flex items-center space-x-2 text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100">
                <Plus className="w-4 h-4" /> <span>Add Position</span>
              </button>
            </div>
            {data.experience.map((exp) => (
              <div key={exp.id} className="p-6 border-2 border-slate-50 rounded-[2rem] space-y-6 bg-slate-50/20 relative">
                <button onClick={() => removeItem('experience', exp.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Job Title" value={exp.position} onChange={(v: string) => updateArrayItem('experience', exp.id, 'position', v)} />
                  <Input label="Employer" value={exp.company} onChange={(v: string) => updateArrayItem('experience', exp.id, 'company', v)} />
                  <Input label="Location" value={exp.location} onChange={(v: string) => updateArrayItem('experience', exp.id, 'location', v)} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Start Date" value={exp.startDate} onChange={(v: string) => updateArrayItem('experience', exp.id, 'startDate', v)} />
                    <Input label="End Date" value={exp.endDate} onChange={(v: string) => updateArrayItem('experience', exp.id, 'endDate', v)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description (Bullet points)</label>
                  <textarea 
                    className="w-full border-2 border-slate-100 rounded-xl p-4 h-32 text-sm focus:border-blue-500 transition-all outline-none bg-white text-black"
                    value={exp.description}
                    onChange={e => updateArrayItem('experience', exp.id, 'description', e.target.value)}
                    placeholder="Enter accomplishments..."
                  />
                </div>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Education</h3>
              <button onClick={() => addItem('education')} className="flex items-center space-x-2 text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100">
                <Plus className="w-4 h-4" /> <span>Add Degree</span>
              </button>
            </div>
            {data.education.map((edu) => (
              <div key={edu.id} className="p-6 border-2 border-slate-50 rounded-[2rem] space-y-6 bg-slate-50/20 relative">
                <button onClick={() => removeItem('education', edu.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Degree / Diploma" value={edu.degree} onChange={(v: string) => updateArrayItem('education', edu.id, 'degree', v)} />
                  <Input label="School / University" value={edu.school} onChange={(v: string) => updateArrayItem('education', edu.id, 'school', v)} />
                  <Input label="Location" value={edu.location} onChange={(v: string) => updateArrayItem('education', edu.id, 'location', v)} />
                  <Input label="Graduation Date / Year" value={edu.startDate} onChange={(v: string) => updateArrayItem('education', edu.id, 'startDate', v)} />
                </div>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black flex items-center space-x-2">
                  <Code className="w-5 h-5 text-blue-600" /> <span>Skills</span>
                </h3>
                <button onClick={() => addItem('skills')} className="text-blue-600 font-bold text-sm hover:underline">Add Skill</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.skills.map((skill, idx) => (
                  <div key={idx} className="relative group">
                    <input 
                      className="w-full px-4 py-2 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-blue-500 outline-none" 
                      value={skill} 
                      onChange={e => updateStringArrayItem('skills', idx, e.target.value)} 
                    />
                    <button onClick={() => removeItem('skills', idx)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-green-600" /> <span>Languages</span>
                </h3>
                <button onClick={() => addItem('languages')} className="text-green-600 font-bold text-sm hover:underline">Add Language</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="relative group">
                    <input 
                      className="w-full px-4 py-2 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-blue-500 outline-none" 
                      value={lang} 
                      onChange={e => updateStringArrayItem('languages', idx, e.target.value)} 
                    />
                    <button onClick={() => removeItem('languages', idx)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-600" /> <span>Certifications</span>
                </h3>
                <button onClick={() => addItem('certifications')} className="text-amber-600 font-bold text-sm hover:underline">Add Cert</button>
              </div>
              <div className="space-y-4">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="relative group">
                    <input 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-blue-500 outline-none" 
                      value={cert} 
                      onChange={e => updateStringArrayItem('certifications', idx, e.target.value)} 
                      placeholder="e.g. AWS Certified Solutions Architect"
                    />
                    <button onClick={() => removeItem('certifications', idx)} className="absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
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
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col md:flex-row font-inter">
      <div className={`flex-1 overflow-y-auto p-4 md:p-12 no-print ${isPreviewMode ? 'hidden md:block' : 'block'}`}>
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Progress / Steps Navigation */}
          <div className="bg-slate-50 p-1 rounded-2xl flex items-center justify-between gap-1 sticky top-0 z-20 shadow-sm border border-slate-100">
            {steps.map((step, idx) => (
              <button 
                key={step.id} 
                onClick={() => setActiveStep(idx)} 
                className={`flex-1 flex flex-col items-center py-2.5 px-2 rounded-xl transition-all ${activeStep === idx ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="mb-1">{step.icon}</div>
                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">{step.title}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-slate-50 min-h-[600px]">
            {renderStep()}
            
            {/* Footer Navigation */}
            <div className="mt-12 pt-12 border-t border-slate-50 flex justify-between items-center">
              <button 
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase text-xs tracking-widest disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" /> <span>Back</span>
              </button>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setData(MOCK_RESUME_DATA)}
                  className="flex items-center space-x-2 text-amber-600 font-black uppercase text-[10px] tracking-widest bg-amber-50 px-4 py-2 rounded-xl"
                >
                  <RotateCcw className="w-4 h-4" /> <span>Use Mock Data</span>
                </button>
                {activeStep < steps.length - 1 && (
                  <button 
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="flex items-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all"
                  >
                    <span>Continue</span> <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Real-time Preview */}
      <div className={`w-full md:w-[45%] bg-slate-100 p-4 md:p-12 overflow-y-auto flex flex-col items-center ${isPreviewMode ? 'block fixed inset-0 z-50' : 'hidden md:flex'}`}>
        <div className="max-w-[21cm] w-full shadow-2xl rounded-sm bg-white mb-20 transform origin-top hover:scale-[1.01] transition-transform duration-500">
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
    <input 
      type="text" 
      className="border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none bg-slate-50/20 text-black transition-all" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);

export default Builder;