import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Plus, Trash2, Sparkles, 
  RotateCcw, Download, Eye, FileSearch, CheckCircle,
  Layout as LayoutIcon, Briefcase, GraduationCap, Code,
  X, Loader2, Info, Save, Languages, Award, User,
  Camera, Linkedin, ChevronDown, Lightbulb, Wand2, Search,
  Star, Keyboard, Crop, Image as ImageIcon, Maximize, Move, Sliders, Type,
  Globe, BadgeCheck, Palette, Rocket, Link as LinkIcon, FileText, CheckCircle2,
  Undo2, CloudUpload
} from 'lucide-react';
import { ResumeData, TemplateTier, Experience, Education, Skill, Project } from '../types';
import { INITIAL_RESUME, TEMPLATES, MOCK_RESUME_DATA } from '../constants';
import { MasterTemplateSelector } from '../components/ResumeTemplates';
import { useRouter, useSearchParams } from '../services/router';
import { 
  getResponsibilitiesSuggestions, 
  getSkillSuggestions, 
  generateSummarySuggestions,
  improveSummary,
  finalizeAndPolishResume
} from '../services/gemini';
import { MockAPI } from '../services/api';

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
  prefilledData?: Partial<ResumeData>;
}

const Builder: React.FC<BuilderProps> = ({ user, initialTemplateId, prefilledData }) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<ResumeData>(() => {
    const savedDraft = localStorage.getItem('resumaster_current_draft');
    if (savedDraft && !prefilledData) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error("Draft restore error", e);
      }
    }

    const baseTemplateId = initialTemplateId || searchParams.get('template') || INITIAL_RESUME.templateId;
    
    const base: ResumeData = {
      ...INITIAL_RESUME,
      templateId: baseTemplateId,
      id: `resume_${Math.random().toString(36).substring(7)}`,
      lastEdited: new Date().toISOString()
    };

    if (prefilledData) {
      return {
        ...base,
        personalInfo: {
          ...base.personalInfo,
          ...prefilledData.personalInfo,
        },
        experience: Array.isArray(prefilledData.experience) ? prefilledData.experience : [],
        education: Array.isArray(prefilledData.education) ? prefilledData.education : [],
        skills: Array.isArray(prefilledData.skills) ? prefilledData.skills : [],
        languages: Array.isArray(prefilledData.languages) ? prefilledData.languages : [],
        certifications: Array.isArray(prefilledData.certifications) ? prefilledData.certifications : [],
        projects: Array.isArray(prefilledData.projects) ? prefilledData.projects : [],
      };
    }
    return base;
  });

  const [activeStep, setActiveStep] = useState(0);
  const [eduSubStep, setEduSubStep] = useState<'selection' | 'form'>(data.education.length > 0 ? 'form' : 'selection');
  const [completeness, setCompleteness] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState<string | null>(null);

  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summarySuggestions, setSummarySuggestions] = useState<string[]>([]);
  const [summaryHistory, setSummaryHistory] = useState<string[]>([]);

  const [manualLang, setManualLang] = useState('');
  const [manualCert, setManualCert] = useState('');
  const [manualHobby, setManualHobby] = useState('');
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ name: '', link: '', description: '' });

  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const [manualSkill, setManualSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const steps = [
    { id: 'heading', title: 'Heading', number: 1 },
    { id: 'experience', title: 'Work history', number: 2 },
    { id: 'education', title: 'Education', number: 3 },
    { id: 'skills', title: 'Skills', number: 4 },
    { id: 'summary', title: 'Summary', number: 5 },
    { id: 'projects', title: 'Projects', number: 6 },
    { id: 'languages', title: 'Languages', number: 7 },
    { id: 'certifications', title: 'Certifications', number: 8 },
    { id: 'hobbies', title: 'Hobbies', number: 9 },
    { id: 'finalize', title: 'Finalize', number: 10 },
  ];

  useEffect(() => {
    localStorage.setItem('resumaster_current_draft', JSON.stringify(data));

    let score = 0;
    if (data.personalInfo.fullName) score += 10;
    if (data.experience.length > 0) score += 15;
    if (data.education.length > 0) score += 15;
    if (data.skills.length > 0) score += 15;
    if (data.personalInfo.summary) score += 15;
    if (data.projects.length > 0) score += 10;
    if (data.languages.length > 0) score += 10;
    if (data.certifications.length > 0) score += 10;
    setCompleteness(Math.min(100, score));
  }, [data]);

  useEffect(() => {
    if (activeStep === 3 && suggestedSkills.length === 0) {
      handleAutoSkillFetch();
    }
    if (activeStep === 4 && summarySuggestions.length === 0) {
      handleFetchSummarySuggestions();
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

  const handleAutoSkillFetch = async () => {
    setIsSkillsLoading(true);
    const query = data.personalInfo.location || data.experience[0]?.position || 'Professional';
    try {
      const skills = await getSkillSuggestions(query);
      setSuggestedSkills(skills);
    } catch (e) { console.error(e); } finally { setIsSkillsLoading(false); }
  };

  const handleFetchSummarySuggestions = async () => {
    setIsSummaryLoading(true);
    const title = data.personalInfo.location || data.experience[0]?.position || 'Professional';
    const skillsList = data.skills.map(s => s.name);
    try {
      const suggestions = await generateSummarySuggestions(title, skillsList);
      setSummarySuggestions(suggestions);
    } catch (e) { console.error(e); } finally { setIsSummaryLoading(false); }
  };

  const handleImproveSummary = async () => {
    if (!data.personalInfo.summary) return;
    setIsSummaryLoading(true);
    setSummaryHistory(prev => [data.personalInfo.summary, ...prev].slice(0, 10));
    const title = data.personalInfo.location || data.experience[0]?.position || 'Professional';
    const skillsList = data.skills.map(s => s.name);
    try {
      const improved = await improveSummary(data.personalInfo.summary, title, skillsList);
      handlePersonalInfoUpdate('summary', improved);
    } catch (e) { console.error(e); } finally { setIsSummaryLoading(false); }
  };

  const handleUndoSummary = () => {
    if (summaryHistory.length === 0) return;
    const [lastVersion, ...rest] = summaryHistory;
    handlePersonalInfoUpdate('summary', lastVersion);
    setSummaryHistory(rest);
  };

  const handleSelectSummarySuggestion = (suggestion: string) => {
    if (data.personalInfo.summary) {
      setSummaryHistory(prev => [data.personalInfo.summary, ...prev].slice(0, 10));
    }
    handlePersonalInfoUpdate('summary', suggestion);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setTempImage(result);
        setZoom(1);
        setCropOffset({ x: 0, y: 0 });
        setIsCropping(true);
        const img = new Image();
        img.src = result;
        img.onload = () => { imgRef.current = img; drawCanvas(); };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCrop = () => {
    if (canvasRef.current) {
      const croppedImage = canvasRef.current.toDataURL('image/png');
      handlePersonalInfoUpdate('profileImage', croppedImage);
      setIsCropping(false);
      setTempImage(null);
    }
  };

  const removePhoto = () => {
    handlePersonalInfoUpdate('profileImage', '');
  };

  const drawCanvas = () => {
    if (canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imgRef.current;
      if (!ctx) return;
      const size = 400;
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 195, 0, Math.PI * 2);
      ctx.clip();
      const scaleBase = size / Math.min(img.width, img.height);
      const finalScale = scaleBase * zoom;
      const drawWidth = img.width * finalScale;
      const drawHeight = img.height * finalScale;
      const x = (size - drawWidth) / 2 + cropOffset.x;
      const y = (size - drawHeight) / 2 + cropOffset.y;
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      ctx.restore();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 195, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (isCropping && imgRef.current) drawCanvas();
  }, [isCropping, zoom, cropOffset]);

  const fetchAiSuggestions = async (expId: string, jobTitle: string) => {
    if (!jobTitle) { alert("Please enter a job title first."); return; }
    setIsGenerating(true);
    setShowAiPanel(expId);
    try {
      const suggestions = await getResponsibilitiesSuggestions(jobTitle);
      setAiSuggestions(suggestions);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleAddManualSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualSkill.trim()) return;
    const skillName = manualSkill.trim();
    if (!data.skills.find(s => s.name === skillName)) {
      setData(prev => ({ ...prev, skills: [...prev.skills, { name: skillName, level: 80 }] }));
    }
    setManualSkill('');
  };

  const toggleSkill = (skillName: string) => {
    setData(prev => {
      const exists = prev.skills.find(s => s.name === skillName);
      if (exists) return { ...prev, skills: prev.skills.filter(s => s.name !== skillName) };
      return { ...prev, skills: [...prev.skills, { name: skillName, level: 80 }] };
    });
  };

  const updateSkillLevel = (name: string, level: number) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.name === name ? { ...s, level } : s)
    }));
  };

  const getLevelLabel = (level: number) => {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    if (level >= 25) return 'Beginner';
    return 'Novice';
  };

  const handleDownloadPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    window.scrollTo(0, 0);

    try {
      const polishedData = await finalizeAndPolishResume(data);
      setData(polishedData);
      
      await new Promise(r => setTimeout(r, 1200));

      const element = resumeRef.current;
      if (!element) throw new Error("Printable resume content not found.");
      
      const fileName = `${data.personalInfo.fullName.trim().replace(/\s+/g, '_')}_Resume.pdf`;
      
      const opt = {
        margin: [0, 0, 0, 0],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        pagebreak: { mode: ['css', 'legacy'] },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          allowTaint: true,
          letterRendering: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
      };
      
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
      
    } catch (err) {
      console.error("PDF Export error:", err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!user) {
      localStorage.setItem('resumaster_pending_save', JSON.stringify(data));
      push('/signup?redirect=dashboard');
      return;
    }

    setIsSaving(true);
    try {
      await MockAPI.saveResume(user.id, {
        ...data,
        title: data.personalInfo.fullName ? `${data.personalInfo.fullName}'s Resume` : 'My Resume',
        lastEdited: new Date().toISOString()
      });
      localStorage.removeItem('resumaster_current_draft');
      push('/dashboard');
    } catch (err) {
      alert("Error saving your resume. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderHeadingStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <button onClick={() => push('/templates')} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform">
          <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
        </button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">How can employers contact you?</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-10 mb-12">
        <div className="flex flex-col items-center space-y-4 shrink-0">
          <div className="relative group">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-48 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-blue-400 cursor-pointer relative shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {data.personalInfo.profileImage ? (
                <img src={data.personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover animate-in fade-in" />
              ) : (
                <div className="flex flex-col items-center space-y-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Camera className="w-10 h-10" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                </div>
              )}
            </div>
            {data.personalInfo.profileImage && (
              <button 
                onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                className="absolute -top-3 -right-3 p-2 bg-red-50 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 font-bold text-sm hover:underline">
            {data.personalInfo.profileImage ? 'Change Photo' : 'Upload Photo'}
          </button>
        </div>

        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" value={data.personalInfo.fullName.split(' ')[0] || ''} onChange={(v: string) => handlePersonalInfoUpdate('fullName', `${v} ${data.personalInfo.fullName.split(' ')[1] || ''}`)} />
            <Input label="Surname" value={data.personalInfo.fullName.split(' ')[1] || ''} onChange={(v: string) => handlePersonalInfoUpdate('fullName', `${data.personalInfo.fullName.split(' ')[0] || ''} ${v}`)} />
            <div className="col-span-1 md:col-span-2">
              <Input label="Job Title" value={data.personalInfo.location} onChange={(v: string) => handlePersonalInfoUpdate('location', v)} placeholder="e.g. Fullstack Developer" />
            </div>
            <Input label="Phone" value={data.personalInfo.phone} onChange={(v: string) => handlePersonalInfoUpdate('phone', v)} placeholder="+91 22 1234 5677" />
            <Input label="Email *" value={data.personalInfo.email} onChange={(v: string) => handlePersonalInfoUpdate('email', v)} placeholder="saanvipatel@sample.in" />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-sm font-black text-[#1a2b48] flex items-center uppercase tracking-wider">Social Information</h3>
        <Input label="LinkedIn URL" value={data.personalInfo.linkedin} onChange={(v: string) => handlePersonalInfoUpdate('linkedin', v)} placeholder="linkedin.com/in/username" />
      </div>

      {isCropping && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Adjust Photo</h3>
              <button onClick={() => setIsCropping(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-10 flex flex-col items-center space-y-10">
              <div className="relative cursor-move select-none" onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y }); }} onMouseMove={(e) => { if(isDragging) setCropOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}>
                <canvas ref={canvasRef} className="rounded-full shadow-2xl border-4 border-white bg-white" width={400} height={400} />
              </div>
              <div className="w-full max-w-sm space-y-4">
                <input type="range" min="0.5" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full accent-blue-600 appearance-none cursor-pointer" />
              </div>
            </div>
            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex justify-center space-x-4">
              <button onClick={() => setIsCropping(false)} className="px-10 py-5 bg-white text-slate-600 rounded-3xl font-black text-xs uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleApplyCrop} className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all">Apply Crop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderWorkHistoryStep = () => (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <button onClick={() => setActiveStep(0)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Tell us about your most recent job</h2>
      </div>
      <div className="space-y-12">
        {data.experience.map((exp) => (
          <div key={exp.id} className="relative group p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl space-y-8">
            <button onClick={() => setData(prev => ({...prev, experience: prev.experience.filter(e => e.id !== exp.id)}))} className="absolute top-10 right-10 p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-2xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input label="Job Title *" value={exp.position} onChange={(v: string) => updateArrayItem('experience', exp.id, 'position', v)} placeholder="Software Engineer" />
              <Input label="Employer *" value={exp.company} onChange={(v: string) => updateArrayItem('experience', exp.id, 'company', v)} placeholder="Tata Consultancy Services" />
              <div className="md:col-span-2">
                <Input label="Location" value={exp.location} onChange={(v: string) => updateArrayItem('experience', exp.id, 'location', v)} placeholder="Bangalore, India" />
              </div>
              <div className="md:col-span-2 flex items-center space-x-8">
                <label className="flex items-center cursor-pointer space-x-3">
                  <input type="checkbox" checked={exp.current} onChange={(e) => updateArrayItem('experience', exp.id, 'current', e.target.checked)} className="w-6 h-6 border-2 rounded-lg accent-blue-600" />
                  <span className="text-sm font-bold text-[#1a2b48]">I currently work here</span>
                </label>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider block">Responsibilities</label>
                <button onClick={() => fetchAiSuggestions(exp.id, exp.position)} className="flex items-center space-x-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-xs hover:bg-blue-100 transition-all border border-blue-100 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> <span>AI Suggestions</span>
                </button>
                <textarea className="w-full border border-gray-100 rounded-2xl p-6 h-40 text-sm font-medium focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-black" value={exp.description} onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => addItem('experience')} className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-blue-600 font-black flex items-center justify-center hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs"><Plus className="w-5 h-5 mr-2" /> Add another position</button>
      </div>
    </div>
  );

  const renderEducationStep = () => {
    if (eduSubStep === 'selection') {
      return (
        <div className="max-w-5xl w-full mx-auto animate-in fade-in duration-500 flex flex-col items-center pt-10 text-center">
          <h2 className="text-5xl font-black text-[#1a2b48] tracking-tight mb-16">What is your highest level of education?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-6">
            {EDUCATION_LEVELS.map((level) => (
              <button key={level} onClick={() => addItem('education', { degree: level })} className="p-10 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-600 transition-all group flex flex-col items-center justify-center text-center min-h-[140px]">
                <span className="text-xl font-bold text-[#1a2b48] group-hover:text-blue-600">{level}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500 pb-20">
        <div className="mb-10">
          <button onClick={() => setEduSubStep('selection')} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
          <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Tell us about your education</h2>
        </div>
        <div className="space-y-12">
          {data.education.map((edu) => (
            <div key={edu.id} className="relative group p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl space-y-8">
              <button onClick={() => setData(prev => ({...prev, education: prev.education.filter(e => e.id !== edu.id)}))} className="absolute top-10 right-10 p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-2xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label="School Name *" value={edu.school} onChange={(v: string) => updateArrayItem('education', edu.id, 'school', v)} placeholder="IIT Delhi" />
                <Input label="Degree *" value={edu.degree} onChange={(v: string) => updateArrayItem('education', edu.id, 'degree', v)} placeholder="Bachelor of Technology" />
                <Input label="Completion Date" value={edu.startDate} onChange={(v: string) => updateArrayItem('education', edu.id, 'startDate', v)} placeholder="May 2022" />
              </div>
            </div>
          ))}
          <button onClick={() => setEduSubStep('selection')} className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-blue-600 font-black flex items-center justify-center hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs"><Plus className="w-5 h-5 mr-2" /> Add another degree</button>
        </div>
      </div>
    );
  };

  const renderSkillsStep = () => (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500 flex flex-col lg:flex-row gap-12 pt-4">
      <div className="lg:w-[40%] space-y-8">
        <div className="bg-slate-50/50 rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-inner flex flex-col min-h-[500px]">
          <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center whitespace-nowrap"><Sparkles className="w-3.5 h-3.5 mr-2 text-blue-600" /> AI Suggestions</h3>
            <button onClick={handleAutoSkillFetch} disabled={isSkillsLoading} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"><RotateCcw className={`w-3 h-3 ${isSkillsLoading ? 'animate-spin' : ''}`} /><span>Refresh Brain</span></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isSkillsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning...</p></div>
            ) : suggestedSkills.map((skillName, i) => (
              <button key={i} onClick={() => toggleSkill(skillName)} className={`w-full flex items-center p-4 rounded-2xl bg-white border transition-all text-left ${data.skills.find(s => s.name === skillName) ? 'border-blue-600 shadow-md ring-2 ring-blue-50' : 'border-gray-100 hover:border-blue-400'}`}>
                <Plus className="w-4 h-4 mr-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-700">{skillName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:w-[60%] space-y-6">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">My Skills:</h2>
        <form onSubmit={handleAddManualSkill} className="relative group">
          <input type="text" placeholder="Type a skill..." className="w-full border border-gray-200 rounded-2xl pl-12 pr-28 py-5 text-sm font-medium focus:border-blue-600 transition-all outline-none text-black" value={manualSkill} onChange={(e) => setManualSkill(e.target.value)} />
          <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Add</button>
        </form>
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 overflow-y-auto min-h-[400px] space-y-8">
          {data.skills.length > 0 ? data.skills.map((skill, i) => (
            <div key={i} className="group space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-700">{skill.name}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{getLevelLabel(skill.level)}</span>
                  <button onClick={() => toggleSkill(skill.name)} className="p-1 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <input type="range" min="0" max="100" step="5" value={skill.level} onChange={(e) => updateSkillLevel(skill.name, parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-full accent-blue-600 appearance-none cursor-pointer" />
            </div>
          )) : <div className="text-center py-20 text-slate-400 font-bold">Start adding skills to boost your score.</div>}
        </div>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <button onClick={() => setActiveStep(3)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Write a powerful summary</h2>
      </div>
      <div className="space-y-12">
        <div className="w-full space-y-6">
          <div className="bg-white p-2 rounded-[3.5rem] shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center p-8 border-b border-slate-50">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center"><Type className="w-4 h-4 mr-2" /> Content Editor</h3>
               <div className="flex items-center space-x-3">
                 <button onClick={handleUndoSummary} disabled={summaryHistory.length === 0} className={`flex items-center space-x-2 px-6 py-3 border-2 border-slate-100 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${summaryHistory.length > 0 ? 'bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200' : 'bg-slate-50 text-slate-300 cursor-not-allowed border-transparent'}`} title="Undo last change"><RotateCcw className="w-3.5 h-3.5" /> <span>Undo</span></button>
                 <button onClick={handleImproveSummary} disabled={!data.personalInfo.summary || isSummaryLoading} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20">{isSummaryLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} <span>AI Improve</span></button>
               </div>
            </div>
            <textarea className="w-full h-80 p-10 text-lg font-medium leading-relaxed bg-white outline-none resize-none placeholder:text-slate-200 text-black" placeholder="Describe your professional journey..." value={data.personalInfo.summary} onChange={(e) => handlePersonalInfoUpdate('summary', e.target.value)} />
          </div>
        </div>
        <div className="w-full bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">AI Personalization Suggestions</h3>
            {isSummaryLoading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
          </div>
          <div className="flex flex-col space-y-6">
            {summarySuggestions.length > 0 ? summarySuggestions.map((suggestion, i) => (
              <div key={i} onClick={() => handleSelectSummarySuggestion(suggestion)} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full">
                <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6">{suggestion}</p>
                <div className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"><CheckCircle2 className="w-3 h-3 mr-2" /> Use this Suggestion</div>
              </div>
            )) : !isSummaryLoading && <div className="py-10 text-center text-slate-400 font-bold italic">No suggestions found. Try adding more skills or experience details.</div>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectsStep = () => (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <button onClick={() => setActiveStep(4)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Showcase your projects</h2>
      </div>
      <div className="space-y-12">
        <div className="p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Project Name" value={projectForm.name} onChange={(v: string) => setProjectForm(p => ({...p, name: v}))} placeholder="e.g. ResuMaster AI Platform" />
            <Input label="Link" value={projectForm.link} onChange={(v: string) => setProjectForm(p => ({...p, link: v}))} placeholder="github.com/user/project" />
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider block">Description</label>
              <textarea className="w-full border border-slate-100 rounded-2xl p-6 h-32 text-sm font-medium focus:border-blue-500 outline-none bg-slate-50/50 transition-all text-black" placeholder="Highlight impact..." value={projectForm.description} onChange={(e) => setProjectForm(p => ({...p, description: e.target.value}))} />
            </div>
          </div>
          <button onClick={() => { if(projectForm.name) { setData(p => ({...p, projects: [...p.projects, { ...projectForm, id: Date.now().toString() } as Project]})); setProjectForm({ name: '', link: '', description: '' }); } }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">Add Project</button>
        </div>
        <div className="space-y-4">
          {data.projects.map((project) => (
            <div key={project.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex justify-between items-start group shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center space-x-3"><Rocket className="w-4 h-4 text-orange-500" /><h5 className="text-lg font-black text-slate-900">{project.name}</h5></div>
                {project.link && <p className="text-xs text-blue-600 font-bold underline">{project.link}</p>}
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{project.description}</p>
              </div>
              <button onClick={() => setData(p => ({...p, projects: p.projects.filter(proj => proj.id !== project.id)}))} className="p-3 text-slate-300 hover:text-red-500 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguagesStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <button onClick={() => setActiveStep(5)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">What languages do you speak?</h2>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if(manualLang.trim()) { setData(p => ({...p, languages: [...p.languages, manualLang.trim()]})); setManualLang(''); } }} className="relative mb-12">
        <input type="text" placeholder="e.g. Hindi, English" className="w-full border border-slate-100 rounded-[2rem] pl-8 pr-20 py-6 text-base font-medium focus:border-blue-500 outline-none bg-slate-50 text-black" value={manualLang} onChange={(e) => setManualLang(e.target.value)} />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg"><Plus className="w-5 h-5" /></button>
      </form>
      <div className="flex flex-wrap gap-4">{data.languages.map((lang, idx) => (<div key={idx} className="flex items-center space-x-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm"><span className="text-sm font-black text-slate-700">{lang}</span><button onClick={() => setData(p => ({...p, languages: p.languages.filter((_, i) => i !== idx)}))} className="text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button></div>))}</div>
    </div>
  );

  const renderCertificationsStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <button onClick={() => setActiveStep(6)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Any certifications?</h2>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if(manualCert.trim()) { setData(p => ({...p, certifications: [...p.certifications, manualCert.trim()]})); setManualCert(''); } }} className="relative mb-12"><input type="text" placeholder="e.g. AWS" className="w-full border border-slate-100 rounded-[2rem] pl-8 pr-20 py-6 text-base font-medium focus:border-blue-500 outline-none bg-slate-50 text-black" value={manualCert} onChange={(e) => setManualCert(e.target.value)} /><button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg"><Plus className="w-5 h-5" /></button></form>
      <div className="space-y-3">{data.certifications.map((cert, idx) => (<div key={idx} className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"><span className="text-sm font-black text-slate-700">{cert}</span><button onClick={() => setData(p => ({...p, certifications: p.certifications.filter((_, i) => i !== idx)}))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>))}</div>
    </div>
  );

  const renderHobbiesStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10"><button onClick={() => setActiveStep(7)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button><h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">What are your hobbies?</h2></div>
      <form onSubmit={(e) => { e.preventDefault(); if(manualHobby.trim()) { setData(p => ({...p, hobbies: [...p.hobbies, manualHobby.trim()]})); setManualHobby(''); } }} className="relative mb-12"><input type="text" placeholder="e.g. Reading" className="w-full border border-slate-100 rounded-[2rem] pl-8 pr-20 py-6 text-base font-medium focus:border-blue-500 outline-none bg-slate-50 text-black" value={manualHobby} onChange={(e) => setManualHobby(e.target.value)} /><button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg"><Plus className="w-5 h-5" /></button></form>
      <div className="flex flex-wrap gap-4">{data.hobbies.map((hobby, idx) => (<div key={idx} className="flex items-center space-x-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm"><span className="text-sm font-black text-slate-700">{hobby}</span><button onClick={() => setData(p => ({...p, hobbies: p.hobbies.filter((_, i) => i !== idx)}))} className="text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button></div>))}</div>
    </div>
  );

  const renderFinalizeStep = () => (
    <div className="max-w-7xl w-full mx-auto animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col items-center mb-16 no-print">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100 animate-bounce"><CheckCircle2 className="w-10 h-10" /></div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight text-center mb-4 uppercase">Your Resume is Ready!</h2>
        <p className="text-slate-500 text-xl font-medium text-center max-w-xl leading-relaxed mb-12">Review your masterpiece below.</p>
      </div>
      
      {/* FINAL EXPORT PREVIEW */}
      <div className="relative flex justify-center w-full px-4 mb-20">
         <div 
          ref={resumeRef}
          data-resume-target="true"
          className="bg-white rounded-sm border border-slate-50 overflow-visible"
          style={{ width: '210mm', minHeight: '297mm', position: 'relative', boxShadow: isExporting ? 'none' : '0 50px 100px rgba(0,0,0,0.15)' }}
         >
            <MasterTemplateSelector data={data} />
         </div>
      </div>

      <div className="flex flex-col items-center no-print">
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-3xl justify-center">
           <button onClick={handleDownloadPdf} disabled={isExporting} className={`flex-1 flex items-center justify-center space-x-4 p-8 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl transition-all group w-full transform hover:-translate-y-1 ${isExporting ? 'opacity-70 cursor-not-allowed grayscale' : 'hover:bg-blue-700'}`}>
              {isExporting ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7" />}
              <div className="text-left"><span className="block text-xs font-black uppercase tracking-widest opacity-80">{isExporting ? 'AI Final Polish...' : 'Export Document'}</span><span className="text-lg font-black tracking-tight">{isExporting ? 'Generating PDF...' : 'Download as PDF'}</span></div>
           </button>
           <button onClick={handleSaveToDashboard} disabled={isSaving} className="flex-1 flex items-center justify-center space-x-4 p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl hover:bg-slate-800 transition-all group w-full transform hover:-translate-y-1">
              {isSaving ? <Loader2 className="w-7 h-7 animate-spin" /> : <CloudUpload className="w-7 h-7" />}
              <div className="text-left"><span className="block text-xs font-black uppercase tracking-widest opacity-80">Cloud Sync</span><span className="text-lg font-black tracking-tight">{user ? 'Save to Dashboard' : 'Sign up & Save'}</span></div>
           </button>
        </div>
        <div className="mt-12 flex items-center space-x-4 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]"><span className="flex items-center"><BadgeCheck className="w-4 h-4 mr-2 text-blue-500" /> AI-Enhanced Precision</span><span className="w-1.5 h-1.5 bg-slate-200 rounded-full" /><span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> ATS Compatible</span></div>
      </div>
    </div>
  );

  const isFinalizeStep = activeStep === 9;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-inter overflow-hidden">
      <div className="w-full md:w-64 bg-gradient-to-b from-blue-600 to-indigo-950 text-white flex flex-col shrink-0 no-print shadow-2xl z-10">
        <div className="p-8">
          <button onClick={() => push('/')} className="flex items-center space-x-2 group mb-12"><Sparkles className="w-8 h-8 text-white" /><span className="text-2xl font-black tracking-tighter">resu</span></button>
          <div className="space-y-1">
            {steps.map((step, idx) => (
              <button key={step.id} onClick={() => setActiveStep(idx)} className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${activeStep === idx ? 'bg-white/20 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black mr-4 transition-colors ${activeStep === idx ? 'border-white bg-white text-blue-700' : 'border-white/20 text-white/40'}`}>{step.number}</div>
                <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeStep === idx ? 'opacity-100' : 'opacity-60'}`}>{step.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/80"><span>Completeness:</span><span>{completeness}%</span></div>
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden border border-white/10"><div className="bg-white h-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${completeness}%` }} /></div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-12 scrollbar-hide">
          {activeStep === 0 && renderHeadingStep()}
          {activeStep === 1 && renderWorkHistoryStep()}
          {activeStep === 2 && renderEducationStep()}
          {activeStep === 3 && renderSkillsStep()}
          {activeStep === 4 && renderSummaryStep()}
          {activeStep === 5 && renderProjectsStep()}
          {activeStep === 6 && renderLanguagesStep()}
          {activeStep === 7 && renderCertificationsStep()}
          {activeStep === 8 && renderHobbiesStep()}
          {activeStep === 9 && renderFinalizeStep()}
        </div>
        {!isFinalizeStep && (
          <div className="h-28 border-t border-gray-100 flex items-center justify-center md:justify-end px-12 bg-white sticky bottom-0 z-50 shadow-sm no-print">
            <div className="flex space-x-4">
              <button onClick={() => setActiveStep(9)} className="px-12 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all active:scale-95">Finish Early</button>
              <button onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))} className={`px-14 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all shadow-xl flex items-center whitespace-nowrap bg-blue-600 text-white shadow-blue-500/20 hover:opacity-90`}>{activeStep === 8 ? 'Finalize' : `Next: ${steps[activeStep + 1]?.title || 'Finish'}`} <ChevronRight className="ml-2 w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
      {!isFinalizeStep && (
        <div className="hidden lg:flex w-[400px] bg-slate-50 border-l border-gray-100 p-10 flex-col items-center shrink-0 no-print">
          <div className="w-full shadow-2xl bg-white rounded-sm overflow-hidden transform-gpu hover:scale-[1.03] transition-transform duration-700 border border-slate-200 aspect-[210/297] relative group">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 origin-top scale-[0.38] w-[210mm] min-h-[297mm] transition-transform duration-500"><MasterTemplateSelector data={data} /></div>
             <div className="absolute inset-0 bg-transparent z-10" />
          </div>
          <div className="mt-10 space-y-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /><span>Auto-saving draft...</span></div>
            <button onClick={() => push('/templates')} className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:text-indigo-700 transition-colors flex items-center mx-auto border-b-2 border-transparent hover:border-blue-600 pb-1 whitespace-nowrap">Change template</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }: any) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider whitespace-nowrap">{label}</label>
    <input type="text" className="border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-white text-black transition-all placeholder:text-gray-300" value={value || ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
  </div>
);

export default Builder;