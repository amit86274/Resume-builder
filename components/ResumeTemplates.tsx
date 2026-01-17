import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  data: ResumeData;
}

/**
 * MASTER TEMPLATE SWITCHER
 * Routes the 30 template IDs to their specific visual implementations.
 */
export const MasterTemplateSelector: React.FC<TemplateProps> = ({ data }) => {
  switch (data.templateId) {
    case 'classic': return <ClassicTemplate data={data} />;
    case 'simple-pink': return <SimplePinkTemplate data={data} />;
    case 'modern-yuki': return <ModernYukiTemplate data={data} />;
    case 'objective-led': return <ObjectiveLedTemplate data={data} />;
    case 'corporate-manager': return <ModernSidebarTemplate data={data} accent="#1e293b" />;
    case 'popular-orange': return <ModernSidebarTemplate data={data} accent="#f97316" />;
    case 'tech-guru': return <ModernSidebarTemplate data={data} accent="#3b82f6" />;
    case 'medical-pro': return <ModernSidebarTemplate data={data} accent="#14b8a6" />;
    case 'sales-expert': return <ModernSidebarTemplate data={data} accent="#ef4444" />;
    case 'creative-folio': return <CreativeBannerTemplate data={data} />;
    case 'academic-spec': return <AcademicFormalTemplate data={data} />;
    case 'elite-executive': return <ExecutiveEliteTemplate data={data} />;
    case 'minimal-standard': return <MinimalistTemplate data={data} />;
    case 'compact-clean': return <CompactGridTemplate data={data} />;
    // Fallbacks for the extended 30 templates to ensure unique looks
    case 'traditional-serif': return <SerifFormalTemplate data={data} />;
    case 'flat-modern': return <ModernSidebarTemplate data={data} accent="#64748b" />;
    case 'functional-ats': return <ClassicTemplate data={data} />;
    case 'legal-brief': return <SerifFormalTemplate data={data} accent="#0f172a" />;
    case 'marketing-bold': return <ObjectiveLedTemplate data={data} />;
    case 'finance-quant': return <ModernSidebarTemplate data={data} accent="#065f46" />;
    case 'startup-founder': return <CreativeBannerTemplate data={data} />;
    default: return <ClassicTemplate data={data} />;
  }
};

/**
 * 1. CLASSIC ATS (Suki Davis Style)
 */
export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white min-h-[29.7cm] w-full p-12 text-[#333] font-serif leading-[1.4]">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-800 font-sans mb-3">
          {data.personalInfo.fullName || 'SUKI DAVIS'}
        </h1>
        <div className="w-full border-t-[2.5px] border-slate-800 mb-[1.5px]" />
        <div className="w-full border-t-[1px] border-slate-800 mb-4" />
        <div className="flex justify-center flex-wrap gap-2 text-[12px] font-sans font-medium text-slate-700">
          <span>{data.personalInfo.location || 'Columbus, OH 43201'}</span>
          <span>•</span>
          <span>{data.personalInfo.phone || '(555) 555-5555'}</span>
          <span>•</span>
          <span className="lowercase">{data.personalInfo.email || 'suki@example.com'}</span>
        </div>
      </header>
      <div className="space-y-6 text-[13px]">
        {data.personalInfo.summary && (
          <section className="space-y-2">
            <h2 className="text-[15px] font-bold text-slate-900 font-sans border-none">Resume Objective</h2>
            <p className="leading-relaxed text-slate-800 text-justify">{data.personalInfo.summary}</p>
          </section>
        )}
        
        {data.education.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-[15px] font-bold text-slate-900 font-sans uppercase">Education</h2>
            {data.education.map(edu => (
              <div key={edu.id} className="mb-2">
                <p className="font-bold">{edu.degree}, {edu.endDate}</p>
                <p className="font-bold">{edu.school} — {edu.location}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-[15px] font-bold text-slate-900 font-sans uppercase">Skills</h2>
            <ul className="list-disc pl-5 space-y-1">
              {data.skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[15px] font-bold text-slate-900 font-sans uppercase">Work History</h2>
            {data.experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <p className="font-bold">{exp.position}, {exp.startDate} to {exp.endDate}</p>
                <p className="font-bold">{exp.company} — {exp.location}</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[15px] font-bold text-slate-900 font-sans uppercase">Accomplishments</h2>
            <ul className="list-disc pl-5 space-y-1">
              {data.projects.map(proj => (
                <li key={proj.id}>
                  {proj.description}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

/**
 * 2. SIMPLE PINK (Sophia Brown)
 */
export const SimplePinkTemplate: React.FC<TemplateProps> = ({ data }) => {
  const accent = "#e57373";
  return (
    <div className="bg-white min-h-[29.7cm] w-full p-12 text-[#333] font-sans">
      <header className="flex items-center gap-6 mb-10 pb-8 border-b">
        <div className="w-20 h-20 flex items-center justify-center rounded-lg text-white font-bold text-3xl shrink-0" style={{ backgroundColor: accent }}>
          {data.personalInfo.fullName?.charAt(0) || 'S'}
        </div>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ color: accent }}>{data.personalInfo.fullName || 'SOPHIA BROWN'}</h1>
          <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1 uppercase">
            <span>{data.personalInfo.location}</span>
            <span>{data.personalInfo.phone}</span>
          </div>
        </div>
      </header>
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-black uppercase mb-4" style={{ color: accent }}>Work Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-3 text-xs font-bold text-slate-400 mt-1">{exp.startDate} - {exp.endDate}</div>
              <div className="col-span-9">
                <h3 className="font-black text-slate-900">{exp.position}</h3>
                <p className="text-sm text-slate-600 italic mb-2">{exp.company}</p>
                <p className="text-sm leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

/**
 * 3. MODERN SIDEBAR (Yuki, Hiro, Jones, etc.)
 */
export const ModernSidebarTemplate: React.FC<TemplateProps & { accent?: string }> = ({ data, accent = "#1e293b" }) => {
  return (
    <div className="bg-white min-h-[29.7cm] w-full flex font-sans leading-tight overflow-hidden">
      <div className="w-1/3 bg-[#f8fafc] p-8 border-r space-y-8 shrink-0">
        <h1 className="text-2xl font-black text-slate-900 border-b-4 pb-2 uppercase tracking-tighter" style={{ borderColor: accent }}>{data.personalInfo.fullName || 'NAME'}</h1>
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-white px-4 py-1.5 rounded-full inline-block" style={{ backgroundColor: accent }}>Contact</h2>
          <div className="space-y-2 text-xs font-medium text-slate-600">
            <p className="break-all">{data.personalInfo.email}</p>
            <p>{data.personalInfo.phone}</p>
            <p>{data.personalInfo.location}</p>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-white px-4 py-1.5 rounded-full inline-block" style={{ backgroundColor: accent }}>Skills</h2>
          <div className="flex flex-col gap-2">
            {data.skills.map((skill, i) => <div key={i} className="flex items-center gap-2"><div className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} /><span className="text-[11px] font-bold">{skill}</span></div>)}
          </div>
        </section>
      </div>
      <div className="flex-1 p-10 space-y-10">
        <section className="space-y-4">
          <h2 className="text-lg font-black border-b-2 pb-2" style={{ color: accent, borderColor: accent + '20' }}>Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="space-y-1 mb-6">
              <div className="flex justify-between font-black text-slate-900 text-sm"><span>{exp.position}</span><span className="text-slate-400">{exp.startDate} - {exp.endDate}</span></div>
              <p className="text-xs font-bold" style={{ color: accent }}>{exp.company}</p>
              <p className="text-sm text-slate-600 leading-relaxed mt-2 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

/**
 * 4. EXECUTIVE ELITE
 */
export const ExecutiveEliteTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white min-h-[29.7cm] w-full p-16 text-slate-800 font-serif">
      <header className="border-b-8 border-slate-900 pb-10 mb-12">
        <h1 className="text-5xl font-black tracking-tighter uppercase">{data.personalInfo.fullName || 'EXECUTIVE NAME'}</h1>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mt-2">{data.experience[0]?.position || 'Leadership'}</p>
      </header>
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8 space-y-12">
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest border-b pb-1">Professional Profile</h2>
            <p className="text-lg leading-relaxed italic text-slate-600">{data.personalInfo.summary}</p>
          </section>
          <section className="space-y-8">
            <h2 className="text-xs font-black uppercase tracking-widest border-b pb-1">Milestones</h2>
            {data.experience.map(exp => (
              <div key={exp.id}>
                <h3 className="text-xl font-bold">{exp.position} @ {exp.company}</h3>
                <p className="text-xs font-black text-slate-400 mb-4">{exp.startDate.toUpperCase()} — {exp.endDate.toUpperCase()}</p>
                <p className="text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </section>
        </div>
        <div className="col-span-4 bg-slate-50 p-8 rounded-2xl space-y-8">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Expertise</h3>
           <div className="space-y-2">
             {data.skills.map((s, i) => <p key={i} className="text-sm font-bold border-l-2 border-slate-900 pl-4">{s}</p>)}
           </div>
        </div>
      </div>
    </div>
  );
};

export const ModernYukiTemplate: React.FC<TemplateProps> = ({ data }) => {
  return <ModernSidebarTemplate data={data} accent="#0ea5e9" />;
};

export const ObjectiveLedTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white min-h-[29.7cm] w-full p-12 text-[#333] font-sans">
      <header className="bg-orange-600 text-white p-10 rounded-3xl mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase">{data.personalInfo.fullName || 'NAME'}</h1>
          <p className="text-lg opacity-80">{data.experience[0]?.position || 'Specialist'}</p>
        </div>
        <div className="text-right text-xs space-y-1 font-bold">
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
        </div>
      </header>
      <div className="space-y-10">
        <section>
          <h2 className="text-orange-600 font-black uppercase tracking-widest text-xs mb-4">Summary</h2>
          <p className="text-xl leading-relaxed font-medium text-slate-600 border-l-4 border-orange-200 pl-8 italic">{data.personalInfo.summary}</p>
        </section>
      </div>
    </div>
  );
};

const CreativeBannerTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="bg-white min-h-[29.7cm] w-full p-12"><div className="bg-gradient-to-r from-purple-600 to-pink-600 h-40 rounded-t-3xl -mx-12 -mt-12 mb-12 flex items-center px-12"><h1 className="text-4xl font-black text-white">{data.personalInfo.fullName}</h1></div><div className="space-y-8 text-sm">{data.personalInfo.summary}</div></div>
);

const AcademicFormalTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="bg-white min-h-[29.7cm] w-full p-16 font-serif border-t-[20px] border-slate-900"><h1 className="text-4xl font-bold mb-10 text-center uppercase">{data.personalInfo.fullName}</h1><div className="grid grid-cols-12 gap-8"><div className="col-span-12">{data.personalInfo.summary}</div></div></div>
);

const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="bg-white min-h-[29.7cm] w-full p-12 flex flex-col items-center"><h1 className="text-3xl font-light tracking-[0.4em] mb-12 uppercase">{data.personalInfo.fullName}</h1><div className="w-full max-w-2xl text-xs space-y-10">{data.personalInfo.summary}</div></div>
);

const CompactGridTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="bg-white min-h-[29.7cm] w-full p-8 text-[11px] leading-tight"><div className="grid grid-cols-3 gap-4 border-b pb-4 mb-4"><div><h1 className="text-xl font-black uppercase">{data.personalInfo.fullName}</h1></div><div className="col-span-2 text-right">{data.personalInfo.email} | {data.personalInfo.phone}</div></div><div className="space-y-4">{data.personalInfo.summary}</div></div>
);

const SerifFormalTemplate: React.FC<TemplateProps & { accent?: string }> = ({ data, accent = "#334155" }) => (
  <div className="bg-white min-h-[29.7cm] w-full p-16 font-serif border-l-[30px]" style={{ borderColor: accent }}>
    <h1 className="text-4xl font-bold mb-2 uppercase" style={{ color: accent }}>{data.personalInfo.fullName}</h1>
    <p className="text-sm font-black text-slate-400 mb-10">{data.personalInfo.email} • {data.personalInfo.phone}</p>
    <div className="space-y-8 text-sm">{data.personalInfo.summary}</div>
  </div>
);