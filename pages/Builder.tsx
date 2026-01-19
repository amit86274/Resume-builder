import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Plus, Trash2, Sparkles, 
  RotateCcw, Download, Eye, FileSearch, CheckCircle,
  Layout as LayoutIcon, Briefcase, GraduationCap, Code,
  X, Loader2, Info, Save, Languages, Award, User,
  Camera, Linkedin, ChevronDown, Lightbulb, Wand2, Search,
  Star
} from 'lucide-react';
import { ResumeData, TemplateTier, Experience, Education } from '../types';
import { INITIAL_RESUME, TEMPLATES, MOCK_RESUME_DATA } from '../constants';
import { MasterTemplateSelector } from '../components/ResumeTemplates';
import { useRouter, useSearchParams } from '../services/router';
import { getResponsibilitiesSuggestions, getSkillSuggestions } from '../services/gemini';

const MONTHS = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = ['Year', ...Array.from({ length: 60 }, (_, i) => (new Date().getFullYear() - i).toString())];

const EDUCATION_LEVELS = [
  'Secondary School',
  'Vocational Certificate or Diploma',
  'Apprenticeship or Internship Training',
  'Associates',
  'Bachelors',
  'Masters',
  'Doctorate or Ph.D.'
];

interface BuilderProps {
  user?: any;
  initialTemplateId?: string;
}

const Builder: React.FC<BuilderProps> = ({ user, initialTemplateId }) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ResumeData>(() => ({
    ...INITIAL_RESUME,
    templateId: initialTemplateId || searchParams.get('template') || INITIAL_RESUME.templateId
  }));
  const [activeStep, setActiveStep] = useState(0);
  const [eduSubStep, setEduSubStep] = useState<'selection' | 'form'>(data.education.length > 0 ? 'form' : 'selection');
  const [completeness, setCompleteness] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState<string | null>(null);

  // Skills specific state
  const [skillSearch, setSkillSearch] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);

  const steps = [
    { id: 'heading', title: 'Heading', number: 1 },
    { id: 'experience', title: 'Work history', number: 2 },
    { id: 'education', title: 'Education', number: 3 },
    { id: 'skills', title: 'Skills', number: 4 },
    { id: 'summary', title: 'Summary', number: 5 },
    { id: 'finalize', title: 'Finalize', number: 6 },
  ];

  useEffect(() => {
    // Calculate completeness based on data
    let score = 0;
    if (data.personalInfo.fullName) score += 20;
    if (data.experience.length > 0) score += 20;
    if (data.education.length > 0) score += 20;
    if (data.skills.length > 0) score += 20;
    if (data.personalInfo.summary) score += 20;
    setCompleteness(score);
  }, [data]);

  // Initial skills suggestion based on profession
  useEffect(() => {
    if (activeStep === 3 && suggestedSkills.length === 0) {
      const jobTitle = data.experience[0]?.position || data.personalInfo.location || 'Professional';
      setSkillSearch(jobTitle);
      handleSkillSearch(jobTitle);
    }
  }, [activeStep]);

  const handlePersonalInfoUpdate = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateArrayItem = (field: 'experience' | 'education', id: string, key: string, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map(item => item.id === id ? { ...item, [key]: value } : item)
    }));
  };

  const addItem = (field: 'experience' | 'education', initialValue: Partial<any> = {}) => {
    const newItem = field === 'experience' 
      ? { id: Date.now().toString(), company: '', position: '', location: '', isRemote: false, startDate: '', endDate: '', current: false, description: '', ...initialValue }
      : { id: Date.now().toString(), school: '', degree: '', location: '', startDate: '', endDate: '', grade: '', ...initialValue };
    setData(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
    if (field === 'education') setEduSubStep('form');
  };

  const handleDateUpdate = (id: string, field: 'startDate' | 'endDate', part: 'month' | 'year', value: string, type: 'experience' | 'education') => {
    const items = type === 'experience' ? data.experience : data.education;
    const item = items.find(e => e.id === id);
    if (!item) return;
    
    const currentVal = (item[field as keyof (Experience | Education)] as string) || '';
    const parts = currentVal.split(' ');
    let month = parts[0] || '';
    let year = parts[1] || '';
    
    if (part === 'month') month = value === 'Month' ? '' : value;
    else year = value === 'Year' ? '' : value;
    
    const newVal = `${month} ${year}`.trim();
    updateArrayItem(type, id, field, newVal);
  };

  const fetchAiSuggestions = async (expId: string, jobTitle: string) => {
    if (!jobTitle) {
      alert("Please enter a job title first to get relevant suggestions.");
      return;
    }
    setIsGenerating(true);
    setShowAiPanel(expId);
    try {
      const suggestions = await getResponsibilitiesSuggestions(jobTitle);
      setAiSuggestions(suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSkillSearch = async (query: string) => {
    if (!query) return;
    setIsSkillsLoading(true);
    try {
      const skills = await getSkillSuggestions(query);
      setSuggestedSkills(skills);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSkillsLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setData(prev => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      }
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const addAiSuggestion = (expId: string, suggestion: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp) return;
    const currentDesc = exp.description || '';
    const newDesc = currentDesc.trim() ? `${currentDesc}\n${suggestion}` : suggestion;
    updateArrayItem('experience', expId, 'description', newDesc);
  };

  const renderHeadingStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <button onClick={() => push('/templates')} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform">
          <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
        </button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">What’s the best way for employers to contact you?</h2>
        <p className="text-gray-500 font-medium">We suggest including an email and phone number.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 mb-12">
        <div className="flex flex-col items-center space-y-4 shrink-0">
          <div className="w-40 h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group cursor-pointer relative shadow-sm hover:shadow-md transition-shadow">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Saanvi" alt="Profile" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity">
              <Camera className="text-blue-600 w-8 h-8" />
            </div>
          </div>
          <button className="text-blue-600 font-bold text-sm hover:underline">Upload Photo</button>
        </div>

        <div className="flex-1 space-y-8">
          <p className="text-[10px] text-gray-400 font-bold">* indicates a required field</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" value={data.personalInfo.fullName.split(' ')[0] || ''} onChange={(v: string) => handlePersonalInfoUpdate('fullName', `${v} ${data.personalInfo.fullName.split(' ')[1] || ''}`)} />
            <Input label="Surname" value={data.personalInfo.fullName.split(' ')[1] || ''} onChange={(v: string) => handlePersonalInfoUpdate('fullName', `${data.personalInfo.fullName.split(' ')[0] || ''} ${v}`)} />
            <div className="col-span-1 md:col-span-2">
              <Input label="Profession" value={data.personalInfo.location} onChange={(v: string) => handlePersonalInfoUpdate('location', v)} placeholder="e.g. Retail Sales Associate" />
            </div>
            <Input label="City" value="" onChange={() => {}} placeholder="e.g. New Delhi" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Country" value="India" onChange={() => {}} />
              <Input label="Pin Code" value="" onChange={() => {}} placeholder="110034" />
            </div>
            <Input label="Phone" value={data.personalInfo.phone} onChange={(v: string) => handlePersonalInfoUpdate('phone', v)} placeholder="+91 22 1234 5677" />
            <Input label="Email *" value={data.personalInfo.email} onChange={(v: string) => handlePersonalInfoUpdate('email', v)} placeholder="saanvipatel@sample.in" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-black text-[#1a2b48] flex items-center uppercase tracking-wider">
          Add additional information to your resume <span className="text-gray-400 normal-case font-medium ml-2">(optional)</span>
          <Info className="w-4 h-4 ml-2 text-gray-400" />
        </h3>
        <div className="flex flex-wrap gap-3">
          <Pill icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
        </div>
      </div>
    </div>
  );

  const renderWorkHistoryStep = () => (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <button onClick={() => setActiveStep(0)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform">
            <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
          </button>
          <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Tell us about your most recent job</h2>
          <p className="text-gray-500 font-medium text-lg">We’ll start there and work backward.</p>
        </div>
        <button className="flex items-center text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
          <Lightbulb className="w-4 h-4 mr-2" /> Tips
        </button>
      </div>

      <div className="space-y-12">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">* indicates a required field</p>
        
        {data.experience.map((exp) => (
          <div key={exp.id} className="relative group p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-8">
            <button 
              onClick={() => setData(prev => ({...prev, experience: prev.experience.filter(e => e.id !== exp.id)}))} 
              className="absolute top-10 right-10 p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input label="Job Title *" value={exp.position} onChange={(v: string) => updateArrayItem('experience', exp.id, 'position', v)} placeholder="Analyst" />
              <Input label="Employer *" value={exp.company} onChange={(v: string) => updateArrayItem('experience', exp.id, 'company', v)} placeholder="Tata Group" />
              
              <div className="md:col-span-2">
                <Input label="Location" value={exp.location} onChange={(v: string) => updateArrayItem('experience', exp.id, 'location', v)} placeholder="New Delhi, India" />
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <label className="flex items-center cursor-pointer space-x-3">
                  <div className="relative">
                    <input type="checkbox" className="peer hidden" checked={exp.isRemote} onChange={(e) => updateArrayItem('experience', exp.id, 'isRemote', e.target.checked)} />
                    <div className="w-6 h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                      <CheckCircle className={`w-4 h-4 text-white transition-opacity ${exp.isRemote ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#1a2b48]">Remote</span>
                </label>
              </div>

              <div className="md:col-span-1 space-y-2">
                <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider">Start Date</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer text-black" value={(exp.startDate || '').split(' ')[0] || 'Month'} onChange={(e) => handleDateUpdate(exp.id, 'startDate', 'month', e.target.value, 'experience')}>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer text-black" value={(exp.startDate || '').split(' ')[1] || 'Year'} onChange={(e) => handleDateUpdate(exp.id, 'startDate', 'year', e.target.value, 'experience')}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 space-y-2">
                <label className={`text-[11px] font-black text-[#1a2b48] uppercase tracking-wider ${exp.current ? 'opacity-30' : ''}`}>End Date</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select disabled={exp.current} className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 text-black" value={(exp.endDate || '').split(' ')[0] || 'Month'} onChange={(e) => handleDateUpdate(exp.id, 'endDate', 'month', e.target.value, 'experience')}>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {!exp.current && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
                  </div>
                  <div className="relative">
                    <select disabled={exp.current} className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 text-black" value={(exp.endDate || '').split(' ')[1] || 'Year'} onChange={(e) => handleDateUpdate(exp.id, 'endDate', 'year', e.target.value, 'experience')}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {!exp.current && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 relative">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider block">Responsibilities</label>
                <button onClick={() => fetchAiSuggestions(exp.id, exp.position)} className="flex items-center space-x-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-xs hover:bg-blue-100 transition-all border border-blue-100 shadow-sm active:scale-95">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Suggestions</span>
                </button>
              </div>
              <textarea className="w-full border border-gray-100 rounded-2xl p-6 h-40 text-sm font-medium focus:border-blue-500 transition-all outline-none bg-slate-50/50 placeholder:text-gray-300 text-black" placeholder="Outline your key achievements and duties..." value={exp.description} onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)} />
              {showAiPanel === exp.id && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-30 p-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center mb-6">
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center"><Wand2 className="w-4 h-4 mr-2 text-blue-600" /> AI Insights for {exp.position || "this role"}</h4>
                     <button onClick={() => setShowAiPanel(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-4 h-4 text-slate-400" /></button>
                  </div>
                  {isGenerating ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Scanning role-specific data...</p></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiSuggestions.map((suggestion, i) => (
                        <div key={i} onClick={() => addAiSuggestion(exp.id, suggestion)} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer group relative">
                           <p className="text-xs font-medium text-slate-700 leading-relaxed pr-8">{suggestion}</p>
                           <Plus className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <button onClick={() => addItem('experience')} className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-blue-600 font-black flex items-center justify-center hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs">
          <Plus className="w-5 h-5 mr-2" /> Add another position
        </button>
      </div>
    </div>
  );

  const renderEducationStep = () => {
    if (eduSubStep === 'selection') {
      return (
        <div className="max-w-5xl w-full mx-auto animate-in fade-in duration-500 flex flex-col items-center pt-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-black text-[#1a2b48] tracking-tight">What is your highest level of education?</h2>
            <p className="text-gray-500 text-xl font-medium">Choose the most recent or highest degree you have completed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-6">
            {EDUCATION_LEVELS.map((level) => (
              <button 
                key={level}
                onClick={() => addItem('education', { degree: level })}
                className="p-10 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-600 transition-all group flex flex-col items-center justify-center text-center min-h-[140px]"
              >
                <span className="text-xl font-bold text-[#1a2b48] group-hover:text-blue-600">{level}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => setEduSubStep('form')}
            className="mt-12 text-blue-600 font-bold hover:underline text-lg decoration-2 underline-offset-4"
          >
            Prefer not to answer
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500 pb-20">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <button onClick={() => data.education.length === 0 ? setEduSubStep('selection') : setActiveStep(1)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform">
              <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
            </button>
            <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Tell us about your education</h2>
            <p className="text-gray-500 font-medium text-lg">List your degrees or schools in reverse chronological order.</p>
          </div>
        </div>

        <div className="space-y-12">
          {data.education.map((edu) => (
            <div key={edu.id} className="relative group p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-8">
              <button onClick={() => setData(prev => ({...prev, education: prev.education.filter(e => e.id !== edu.id)}))} className="absolute top-10 right-10 p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label="School Name *" value={edu.school} onChange={(v: string) => updateArrayItem('education', edu.id, 'school', v)} placeholder="e.g. Stanford University" />
                <Input label="School Location" value={edu.location} onChange={(v: string) => updateArrayItem('education', edu.id, 'location', v)} placeholder="e.g. Palo Alto, CA" />
                <div className="md:col-span-2">
                  <Input label="Degree *" value={edu.degree} onChange={(v: string) => updateArrayItem('education', edu.id, 'degree', v)} placeholder="e.g. Bachelor of Science in Computer Science" />
                </div>
                
                <div className="md:col-span-1 space-y-2">
                  <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider">Completion Date</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer text-black" value={(edu.startDate || '').split(' ')[0] || 'Month'} onChange={(e) => handleDateUpdate(edu.id, 'startDate', 'month', e.target.value, 'education')}>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer text-black" value={(edu.startDate || '').split(' ')[1] || 'Year'} onChange={(e) => handleDateUpdate(edu.id, 'startDate', 'year', e.target.value, 'education')}>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => setEduSubStep('selection')} className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-blue-600 font-black flex items-center justify-center hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs">
            <Plus className="w-5 h-5 mr-2" /> Add another degree
          </button>
        </div>
      </div>
    );
  };

  const renderSkillsStep = () => (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500 flex flex-col lg:flex-row gap-12 pt-4">
      {/* Left: Search & Suggestions (40%) */}
      <div className="lg:w-[40%] space-y-8">
        <div className="space-y-6">
          <div className="relative group">
            <input 
              type="text"
              placeholder="Title, industry, keyword"
              className="w-full border border-gray-200 rounded-2xl pl-14 pr-14 py-5 text-sm font-medium bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none shadow-sm text-black"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSkillSearch(skillSearch)}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <button 
              onClick={() => handleSkillSearch(skillSearch)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Popular Job Titles</span>
              <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center">More <ChevronDown className="ml-1 w-3 h-3" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Cashier', 'Customer Service Representative', 'Manager'].map(title => (
                <button 
                  key={title} 
                  onClick={() => { setSkillSearch(title); handleSkillSearch(title); }}
                  className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  <Search className="w-3 h-3" />
                  <span>{title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50/50 rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-inner flex flex-col min-h-[500px]">
          <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Showing results for <span className="text-slate-900 font-black">{skillSearch || 'Suggestions'}</span>
            </h3>
            <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              <Info className="w-3 h-3" />
              <span>Filter by Keyword</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isSkillsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generating expert suggestions...</p>
              </div>
            ) : suggestedSkills.length > 0 ? (
              suggestedSkills.map((skill, i) => (
                <button 
                  key={i}
                  onClick={() => toggleSkill(skill)}
                  className={`w-full flex items-center p-4 rounded-2xl bg-white border transition-all text-left group
                    ${data.skills.includes(skill) ? 'border-blue-600 shadow-md ring-2 ring-blue-50' : 'border-gray-100 hover:border-blue-400 hover:shadow-sm'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-4 transition-colors
                    ${data.skills.includes(skill) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-600 group-hover:bg-blue-50'}`}>
                    {data.skills.includes(skill) ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    {i === 0 && (
                      <div className="flex items-center text-[8px] font-black uppercase tracking-widest text-amber-600 mb-0.5">
                        <Star className="w-2.5 h-2.5 mr-1 fill-current" /> Expert Recommended
                      </div>
                    )}
                    <span className={`text-sm font-bold ${data.skills.includes(skill) ? 'text-blue-600' : 'text-slate-700'}`}>{skill}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-20 text-center space-y-4 px-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Wand2 className="w-8 h-8 text-blue-200" />
                </div>
                <p className="text-gray-400 text-xs font-medium leading-relaxed">Search for your job title to get industry-standard skill suggestions.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Added Skills & Preview (60%) */}
      <div className="lg:w-[60%] space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Added Skills:</h2>
        </div>

        {/* Removed B I U formatting tools as per user request */}
        <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-2xl shadow-slate-100 overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative">
             <div className="space-y-4">
                {data.skills.length > 0 ? (
                  data.skills.map((skill, i) => (
                    <div key={i} className="flex items-start group animate-in slide-in-from-left-2 duration-300">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mr-4" />
                      <span className="text-base font-medium text-slate-700 leading-tight flex-1">{skill}</span>
                      <button onClick={() => toggleSkill(skill)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-6">
                    <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                       <Code className="w-12 h-12" />
                    </div>
                    <p className="text-gray-400 font-medium max-w-xs">No skills added yet. Select expert-curated skills from the left to populate your layout.</p>
                  </div>
                )}
             </div>

             <button 
               onClick={() => handleSkillSearch(skillSearch)}
               className="absolute bottom-6 right-6 flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold text-xs shadow-xl hover:bg-blue-700 transition-all active:scale-95"
             >
                <Sparkles className="w-4 h-4 text-white" />
                <span>AI Brain: Regenerate</span>
             </button>
          </div>

          <div className="bg-slate-50/80 px-10 py-6 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-center space-x-4 flex-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Skill Saturation: {data.skills.length}/10</span>
               <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                 <div className="bg-blue-600 h-full transition-all duration-700 ease-out" style={{ width: `${Math.min(100, (data.skills.length / 10) * 100)}%` }} />
               </div>
            </div>
            <div className="ml-8 flex items-center space-x-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layout: Standard</span>
              <Info className="w-4 h-4 text-slate-300 cursor-help" />
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-4">
           <button className="px-14 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl shadow-blue-100 active:scale-95">
             Preview
           </button>
           <button 
             onClick={() => setActiveStep(prev => prev + 1)}
             className="px-16 py-4 bg-amber-400 text-slate-900 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-amber-500 transition-all shadow-xl shadow-amber-100 active:scale-95 flex items-center"
           >
             Next: Summary <ChevronRight className="ml-2 w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-inter overflow-hidden">
      <div className="w-full md:w-64 bg-gradient-to-b from-blue-600 to-indigo-950 text-white flex flex-col shrink-0 no-print shadow-2xl z-10">
        <div className="p-8">
          <button onClick={() => push('/')} className="flex items-center space-x-2 group mb-12">
            <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
            <span className="text-2xl font-black tracking-tighter">resu</span>
          </button>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <button key={step.id} onClick={() => setActiveStep(idx)} className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 ${activeStep === idx ? 'bg-white/20 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-black mr-4 transition-colors ${activeStep === idx ? 'border-white bg-white text-blue-700' : 'border-white/20 text-white/40'}`}>
                  {step.number}
                </div>
                <span className={`text-sm font-bold uppercase tracking-wider ${activeStep === idx ? 'opacity-100' : 'opacity-60'}`}>{step.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/80">
              <span>Completeness:</span>
              <span>{completeness}%</span>
            </div>
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden border border-white/10">
              <div className="bg-white h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${completeness}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-12 scrollbar-hide">
          {activeStep === 0 && renderHeadingStep()}
          {activeStep === 1 && renderWorkHistoryStep()}
          {activeStep === 2 && renderEducationStep()}
          {activeStep === 3 && renderSkillsStep()}
          {activeStep > 3 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="bg-blue-50 p-8 rounded-full text-blue-600 shadow-inner"><LayoutIcon className="w-14 h-14" /></div>
              <h2 className="text-3xl font-black text-[#1a2b48]">Section under construction</h2>
              <button onClick={() => setActiveStep(0)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest">Back to Start</button>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR - Hide on Skills step as it has its own fixed buttons */}
        {activeStep !== 3 && (
          <div className="h-28 border-t border-gray-100 flex items-center justify-center md:justify-end px-12 bg-white sticky bottom-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex space-x-4">
              <button className="px-12 py-4 bg-white border-2 border-[#1a2b48] text-[#1a2b48] rounded-full font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all active:scale-95">Preview</button>
              <button onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))} className="px-14 py-4 bg-[#ffc107] text-[#1a2b48] rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#ffb300] transition-all shadow-xl shadow-yellow-100 flex items-center">
                Next: {steps[activeStep + 1]?.title || 'Finalize'} <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:flex w-[400px] bg-slate-50 border-l border-gray-100 p-10 flex-col items-center shrink-0 no-print">
        <div className="w-full flex justify-between items-center mb-10">
           <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
             <ChevronRight className="w-4 h-4 mr-1 animate-pulse" />
             30% Higher chance of getting a job
           </div>
        </div>
        <div className="w-full shadow-[0_40px_80px_rgba(0,0,0,0.1)] bg-white rounded-sm overflow-hidden transform hover:scale-[1.03] transition-transform duration-700 cursor-zoom-in border border-slate-200">
           <div className="origin-top scale-[0.45] w-[210mm] h-[297mm]">
              <MasterTemplateSelector data={data} />
           </div>
        </div>
        <div className="mt-10 space-y-6 text-center">
          <button onClick={() => push('/templates')} className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:text-indigo-700 transition-colors flex items-center mx-auto border-b-2 border-transparent hover:border-blue-600 pb-1">Change template</button>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[240px]">† Results are based on real-world hiring data.</p>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }: any) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider">{label}</label>
    <input type="text" className="border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-white text-black transition-all placeholder:text-gray-300" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
  </div>
);

const Pill = ({ icon, label }: any) => (
  <button className="flex items-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95">
    {icon}
    <span>{label}</span>
    <Plus className="w-3 h-3 ml-2" />
  </button>
);

export default Builder;