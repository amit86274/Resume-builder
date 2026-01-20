
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Plus, Trash2, Sparkles, 
  RotateCcw, Download, Eye, FileSearch, CheckCircle,
  Layout as LayoutIcon, Briefcase, GraduationCap, Code,
  X, Loader2, Info, Save, Languages, Award, User,
  Camera, Linkedin, ChevronDown, Lightbulb, Wand2, Search,
  Star, Keyboard, Crop, Image as ImageIcon, Maximize, Move, Sliders, Type,
  Globe, BadgeCheck, Palette, Rocket, Link as LinkIcon, FileText, CheckCircle2
} from 'lucide-react';
import { ResumeData, TemplateTier, Experience, Education, Skill, Project } from '../types';
import { INITIAL_RESUME, TEMPLATES, MOCK_RESUME_DATA } from '../constants';
import { MasterTemplateSelector } from '../components/ResumeTemplates';
import { useRouter, useSearchParams } from '../services/router';
import { 
  getResponsibilitiesSuggestions, 
  getSkillSuggestions, 
  generateSummarySuggestions,
  improveSummary 
} from '../services/gemini';

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
  
  const [data, setData] = useState<ResumeData>(() => {
    const base = {
      ...INITIAL_RESUME,
      templateId: initialTemplateId || searchParams.get('template') || INITIAL_RESUME.templateId
    };

    if (prefilledData) {
      // Merge prefilled data and ensure IDs exist for all list items
      return {
        ...base,
        personalInfo: {
          ...base.personalInfo,
          ...prefilledData.personalInfo,
        },
        experience: (prefilledData.experience || []).map(exp => ({
          ...exp,
          id: exp.id || Math.random().toString(36).substring(7),
          isRemote: exp.isRemote || false,
          current: exp.current || false,
          description: exp.description || '',
        })) as Experience[],
        education: (prefilledData.education || []).map(edu => ({
          ...edu,
          id: edu.id || Math.random().toString(36).substring(7),
        })) as Education[],
        skills: (prefilledData.skills || []).map(skill => ({
          ...skill,
          level: skill.level || 80,
        })) as Skill[],
        projects: (prefilledData.projects || []).map(proj => ({
          ...proj,
          id: proj.id || Math.random().toString(36).substring(7),
        })) as Project[],
        languages: prefilledData.languages || [],
        certifications: prefilledData.certifications || [],
        hobbies: prefilledData.hobbies || [],
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

  // Summary logic
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summarySuggestions, setSummarySuggestions] = useState<string[]>([]);

  // Additional info logic
  const [manualLang, setManualLang] = useState('');
  const [manualCert, setManualCert] = useState('');
  const [manualHobby, setManualHobby] = useState('');
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ name: '', link: '', description: '' });

  // Photo & Cropping State
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Skills specific state
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const [manualSkill, setManualSkill] = useState('');

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

  // AI Summary Logic
  const handleFetchSummarySuggestions = async () => {
    setIsSummaryLoading(true);
    const title = data.personalInfo.location || data.experience[0]?.position || 'Professional';
    const skillsList = data.skills.map(s => s.name);
    try {
      const suggestions = await generateSummarySuggestions(title, skillsList);
      setSummarySuggestions(suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleImproveSummary = async () => {
    if (!data.personalInfo.summary) return;
    setIsSummaryLoading(true);
    const title = data.personalInfo.location || data.experience[0]?.position || 'Professional';
    const skillsList = data.skills.map(s => s.name);
    try {
      const improved = await improveSummary(data.personalInfo.summary, title, skillsList);
      handlePersonalInfoUpdate('summary', improved);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Photo Logic
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

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - cropOffset.x, y: clientY - dragStart.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setCropOffset({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const fetchAiSuggestions = async (expId: string, jobTitle: string) => {
    if (!jobTitle) { alert("Please enter a job title first."); return; }
    setIsGenerating(true);
    setShowAiPanel(expId);
    try {
      const suggestions = await getResponsibilitiesSuggestions(jobTitle);
      setAiSuggestions(suggestions);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleAutoSkillFetch = async () => {
    setIsSkillsLoading(true);
    const query = data.personalInfo.location || data.experience[0]?.position || 'Professional';
    const existingNames = data.skills.map(s => s.name);
    try {
      const skills = await getSkillSuggestions(query, existingNames);
      setSuggestedSkills(skills);
    } catch (e) { console.error(e); } finally { setIsSkillsLoading(false); }
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

  const renderHeadingStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <button onClick={() => push('/templates')} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform">
          <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
        </button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">How can employers contact you?</h2>
        <p className="text-gray-500 font-medium">We suggest including an email and phone number.</p>
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
              <div className="relative cursor-move select-none" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}>
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
        <p className="text-gray-500 font-medium text-lg">We’ll start there and work backward.</p>
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
                <textarea className="w-full border border-gray-100 rounded-2xl p-6 h-40 text-sm font-medium focus:border-blue-500 transition-all outline-none bg-slate-50/50" value={exp.description} onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)} />
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
          <input type="text" placeholder="Type a skill..." className="w-full border border-gray-200 rounded-2xl pl-12 pr-28 py-5 text-sm font-medium focus:border-blue-600 transition-all outline-none" value={manualSkill} onChange={(e) => setManualSkill(e.target.value)} />
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
        <p className="text-gray-500 font-medium text-lg">Briefly describe your career and key achievements.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center p-6 border-b border-slate-50">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center"><Type className="w-4 h-4 mr-2" /> Content Editor</h3>
               <button onClick={handleImproveSummary} disabled={!data.personalInfo.summary || isSummaryLoading} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50">
                  {isSummaryLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} <span>AI Improve</span>
               </button>
            </div>
            <textarea className="w-full h-80 p-8 text-base font-medium leading-relaxed bg-white outline-none resize-none placeholder:text-slate-200 text-slate-700" placeholder="Describe your professional journey..." value={data.personalInfo.summary} onChange={(e) => handlePersonalInfoUpdate('summary', e.target.value)} />
          </div>
        </div>
        <div className="lg:col-span-5 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Suggestions</h3>
          {isSummaryLoading ? <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div> : summarySuggestions.map((suggestion, i) => (
            <div key={i} onClick={() => handlePersonalInfoUpdate('summary', suggestion)} className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group">
              <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-4">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjectsStep = () => (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <button onClick={() => setActiveStep(4)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Showcase your projects</h2>
        <p className="text-gray-500 font-medium text-lg">Highlight your technical builds and side projects.</p>
      </div>

      <div className="space-y-12">
        {/* Wider Project Form */}
        <div className="p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Project Name" value={projectForm.name} onChange={(v: string) => setProjectForm(p => ({...p, name: v}))} placeholder="e.g. ResuMaster AI Platform" />
            <Input label="Link" value={projectForm.link} onChange={(v: string) => setProjectForm(p => ({...p, link: v}))} placeholder="github.com/user/project-repo" />
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider block">Project Description</label>
              <textarea 
                className="w-full border border-slate-100 rounded-2xl p-6 h-32 text-sm font-medium focus:border-blue-500 outline-none bg-slate-50/50 transition-all placeholder:text-slate-300" 
                placeholder="Highlight your key contributions, technologies used, and project impact..." 
                value={projectForm.description} 
                onChange={(e) => setProjectForm(p => ({...p, description: e.target.value}))} 
              />
            </div>
          </div>
          <button 
            onClick={() => { if(projectForm.name) { setData(p => ({...p, projects: [...p.projects, { ...projectForm, id: Date.now().toString() } as Project]})); setProjectForm({ name: '', link: '', description: '' }); } }} 
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            Add Project to List
          </button>
        </div>

        {/* Added Projects List */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-2">Projects Added:</h3>
          {data.projects.length > 0 ? (
            data.projects.map((project) => (
              <div key={project.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex justify-between items-start group shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Rocket className="w-4 h-4 text-orange-500" />
                    <h5 className="text-lg font-black text-slate-900">{project.name}</h5>
                  </div>
                  {project.link && <p className="text-xs text-blue-600 font-bold underline">{project.link}</p>}
                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{project.description}</p>
                </div>
                <button onClick={() => setData(p => ({...p, projects: p.projects.filter(proj => proj.id !== project.id)}))} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))
          ) : (
            <div className="py-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
              <p className="text-slate-400 font-bold">No projects added yet.</p>
            </div>
          )}
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
        <input type="text" placeholder="e.g. Hindi (Native), English (Fluent)" className="w-full border border-slate-100 rounded-[2rem] pl-8 pr-20 py-6 text-base font-medium focus:border-blue-500 outline-none bg-slate-50" value={manualLang} onChange={(e) => setManualLang(e.target.value)} />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg"><Plus className="w-5 h-5" /></button>
      </form>
      <div className="flex flex-wrap gap-4">
        {data.languages.map((lang, idx) => (
          <div key={idx} className="flex items-center space-x-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm group">
            <span className="text-sm font-black text-slate-700">{lang}</span>
            <button onClick={() => setData(p => ({...p, languages: p.languages.filter((_, i) => i !== idx)}))} className="text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificationsStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <button onClick={() => setActiveStep(6)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">Any certifications?</h2>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if(manualCert.trim()) { setData(p => ({...p, certifications: [...p.certifications, manualCert.trim()]})); setManualCert(''); } }} className="relative mb-12">
        <input type="text" placeholder="e.g. AWS Certified Solutions Architect" className="w-full border border-slate-100 rounded-[2rem] pl-8 pr-20 py-6 text-base font-medium focus:border-blue-500 outline-none bg-slate-50" value={manualCert} onChange={(e) => setManualCert(e.target.value)} />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg"><Plus className="w-5 h-5" /></button>
      </form>
      <div className="space-y-3">
        {data.certifications.map((cert, idx) => (
          <div key={idx} className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-indigo-200 transition-all">
            <span className="text-sm font-black text-slate-700">{cert}</span>
            <button onClick={() => setData(p => ({...p, certifications: p.certifications.filter((_, i) => i !== idx)}))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHobbiesStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <button onClick={() => setActiveStep(7)} className="text-blue-600 font-bold text-sm flex items-center mb-6 hover:translate-x-[-4px] transition-transform"><ChevronLeft className="w-4 h-4 mr-1" /> Go Back</button>
        <h2 className="text-4xl font-black text-[#1a2b48] tracking-tight mb-2">What are your hobbies?</h2>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if(manualHobby.trim()) { setData(p => ({...p, hobbies: [...p.hobbies, manualHobby.trim()]})); setManualHobby(''); } }} className="relative mb-12">
        <input type="text" placeholder="e.g. Photography, Reading, Travel" className="w-full border border-slate-100 rounded-[2rem] pl-8 pr-20 py-6 text-base font-medium focus:border-blue-500 outline-none bg-slate-50" value={manualHobby} onChange={(e) => setManualHobby(e.target.value)} />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg"><Plus className="w-5 h-5" /></button>
      </form>
      <div className="flex flex-wrap gap-4">
        {data.hobbies.map((hobby, idx) => (
          <div key={idx} className="flex items-center space-x-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm group transition-all hover:border-pink-200">
            <span className="text-sm font-black text-slate-700">{hobby}</span>
            <button onClick={() => setData(p => ({...p, hobbies: p.hobbies.filter((_, i) => i !== idx)}))} className="text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFinalizeStep = () => (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in duration-500 pb-20 text-center">
      <div className="mb-16 space-y-6">
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100"><CheckCircle2 className="w-12 h-12" /></div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Resume Ready!</h2>
        <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">You've built a high-performance, ATS-proof resume.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
         <button className="flex flex-col items-center justify-center p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl hover:shadow-2xl hover:border-blue-600 transition-all group">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Download className="w-8 h-8" /></div>
            <span className="text-lg font-black text-slate-900 uppercase tracking-widest">Download PDF</span>
         </button>
         <button className="flex flex-col items-center justify-center p-10 bg-slate-900 text-white rounded-[3rem] shadow-xl hover:bg-slate-800 transition-all group">
            <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Save className="w-8 h-8" /></div>
            <span className="text-lg font-black uppercase tracking-widest">Save to Dashboard</span>
         </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-inter overflow-hidden">
      <div className="w-full md:w-64 bg-gradient-to-b from-blue-600 to-indigo-950 text-white flex flex-col shrink-0 no-print shadow-2xl z-10">
        <div className="p-8">
          <button onClick={() => push('/')} className="flex items-center space-x-2 group mb-12">
            <Sparkles className="w-8 h-8 text-white" />
            <span className="text-2xl font-black tracking-tighter">resu</span>
          </button>
          <div className="space-y-1">
            {steps.map((step, idx) => (
              <button key={step.id} onClick={() => setActiveStep(idx)} className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${activeStep === idx ? 'bg-white/20 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black mr-4 transition-colors ${activeStep === idx ? 'border-white bg-white text-blue-700' : 'border-white/20 text-white/40'}`}>
                  {step.number}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeStep === idx ? 'opacity-100' : 'opacity-60'}`}>{step.title}</span>
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
          {activeStep === 4 && renderSummaryStep()}
          {activeStep === 5 && renderProjectsStep()}
          {activeStep === 6 && renderLanguagesStep()}
          {activeStep === 7 && renderCertificationsStep()}
          {activeStep === 8 && renderHobbiesStep()}
          {activeStep === 9 && renderFinalizeStep()}
        </div>
        <div className="h-28 border-t border-gray-100 flex items-center justify-center md:justify-end px-12 bg-white sticky bottom-0 z-50 shadow-sm">
          <div className="flex space-x-4">
            <button className="px-12 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all active:scale-95">Preview</button>
            <button onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))} className={`px-14 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all shadow-xl flex items-center whitespace-nowrap ${activeStep === 9 ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-blue-600 text-white shadow-blue-500/20 hover:opacity-90'}`}>
              {activeStep === 9 ? 'Finish' : `Next: ${steps[activeStep + 1]?.title || 'Finish'}`} <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-[400px] bg-slate-50 border-l border-gray-100 p-10 flex-col items-center shrink-0 no-print">
        <div className="w-full shadow-2xl bg-white rounded-sm overflow-hidden transform hover:scale-[1.03] transition-transform duration-700 cursor-zoom-in border border-slate-200 aspect-[210/297] relative group">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 origin-top scale-[0.38] w-[210mm] h-[297mm] transition-transform duration-500">
              <MasterTemplateSelector data={data} />
           </div>
           <div className="absolute inset-0 bg-transparent z-10" />
        </div>
        <div className="mt-10 space-y-6 text-center">
          <button onClick={() => push('/templates')} className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:text-indigo-700 transition-colors flex items-center mx-auto border-b-2 border-transparent hover:border-blue-600 pb-1 whitespace-nowrap">Change template</button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }: any) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[11px] font-black text-[#1a2b48] uppercase tracking-wider whitespace-nowrap">{label}</label>
    <input type="text" className="border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-white text-black transition-all placeholder:text-gray-300" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
  </div>
);

export default Builder;
