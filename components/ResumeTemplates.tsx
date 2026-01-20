import React from 'react';
import { ResumeData } from '../types';
import { ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

/**
 * MASTER TEMPLATE SELECTOR
 */
export const MasterTemplateSelector: React.FC<TemplateProps> = ({ data }) => {
  return <YukiBlueTemplate data={data} />;
};

/**
 * PIXEL-PERFECT YUKI BLUE (Zety Cascade Clone)
 */
const YukiBlueTemplate: React.FC<TemplateProps> = ({ data }) => {
  const sidebarPadding = "px-9";

  return (
    <div className="bg-white min-h-[29.7cm] w-[210mm] flex font-sans text-[#333] overflow-hidden shadow-sm selection:bg-blue-100">
      {/* LEFT SIDEBAR (33%) */}
      <div className="w-[33%] bg-[#004b93] text-white flex flex-col shrink-0 min-h-full pb-12">
        {/* Photo Container */}
        {data.personalInfo.profileImage && (
          <div className="pt-14 pb-8 flex justify-center">
            <div className="w-40 h-40 rounded-full border-[6px] border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shadow-2xl">
              <img 
                src={data.personalInfo.profileImage} 
                alt={data.personalInfo.fullName} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}

        <div className={`flex flex-col ${!data.personalInfo.profileImage ? 'pt-14' : ''}`}>
          {/* CONTACT SECTION */}
          <section className="mb-10">
            <div className="bg-black/15 px-9 py-2.5 mb-6">
              <h2 className="text-[12px] font-black uppercase tracking-[0.25em]">Contact</h2>
            </div>
            <div className={`${sidebarPadding} space-y-5 text-[11px]`}>
              <div className="space-y-1">
                <p className="font-bold opacity-50 uppercase tracking-tighter text-[9px]">Address</p>
                <p className="font-semibold leading-relaxed text-white/90">{data.personalInfo.location || 'Location'}</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold opacity-50 uppercase tracking-tighter text-[9px]">Phone</p>
                <p className="font-semibold text-white/90">{data.personalInfo.phone || 'Phone'}</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold opacity-50 uppercase tracking-tighter text-[9px]">E-mail</p>
                <p className="font-semibold text-white/90 break-all leading-snug">{data.personalInfo.email || 'Email'}</p>
              </div>
            </div>
          </section>

          {/* SKILLS SECTION */}
          <section className="mb-10">
            <div className="bg-black/15 px-9 py-2.5 mb-6">
              <h2 className="text-[12px] font-black uppercase tracking-[0.25em]">Skills</h2>
            </div>
            <div className={`${sidebarPadding} space-y-4`}>
              {data.skills.length > 0 ? data.skills.map((skill, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[11px] font-bold leading-tight text-white/90">{skill.name}</p>
                  <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <p className="text-[10px] opacity-40 italic px-9">Add skills in builder...</p>
              )}
            </div>
          </section>

          {/* LANGUAGES SECTION */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-10">
              <div className="bg-black/15 px-9 py-2.5 mb-6">
                <h2 className="text-[12px] font-black uppercase tracking-[0.25em]">Languages</h2>
              </div>
              <div className={`${sidebarPadding} space-y-3`}>
                {data.languages.map((lang, i) => (
                  <p key={i} className="text-[11px] font-bold text-white/90">{lang}</p>
                ))}
              </div>
            </section>
          )}

          {/* HOBBIES SECTION - SIDEBAR DYNAMIC FIELD */}
          {data.hobbies && data.hobbies.length > 0 && (
            <section>
              <div className="bg-black/15 px-9 py-2.5 mb-6">
                <h2 className="text-[12px] font-black uppercase tracking-[0.25em]">Hobbies</h2>
              </div>
              <div className={`${sidebarPadding} space-y-3`}>
                {data.hobbies.map((hobby, i) => (
                  <p key={i} className="text-[11px] font-bold text-white/90">{hobby}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* MAIN CONTENT (67%) */}
      <div className="flex-1 flex flex-col bg-white">
        <header className="pl-12 pr-12 pt-14 pb-10 border-b border-gray-100 flex flex-col items-start justify-center">
          <h1 className="text-[38px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-3 whitespace-nowrap">
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-[15px] font-bold text-[#004b93] uppercase tracking-[0.1em] leading-tight">
            {data.personalInfo.location || 'Professional Title'}
          </p>
        </header>

        <div className="pl-12 pr-12 py-12 space-y-12">
          {/* SUMMARY */}
          <section>
            <div className="flex items-center space-x-4 border-b-[3px] border-slate-900 pb-2 mb-6">
               <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Summary</h2>
            </div>
            <p className="text-[12px] text-slate-700 font-medium leading-[1.7] text-justify">
              {data.personalInfo.summary || 'Write a brief professional summary here to highlight your key strengths and achievements...'}
            </p>
          </section>

          {/* EXPERIENCE */}
          <section>
            <div className="flex items-center space-x-4 border-b-[3px] border-slate-900 pb-2 mb-6">
               <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Experience</h2>
            </div>
            <div className="space-y-10">
              {data.experience.length > 0 ? data.experience.map(exp => (
                <div key={exp.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{exp.position}</h3>
                      <p className="text-[12px] font-bold text-[#004b93] italic leading-none">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                        {exp.startDate} — {exp.endDate || (exp.current ? 'Present' : '')}
                      </span>
                    </div>
                  </div>
                  <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-2 font-medium leading-relaxed marker:text-[#004b93]">
                    {exp.description ? exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="pl-1">{line}</li>
                    )) : <li className="italic text-slate-300">Details pending...</li>}
                  </ul>
                </div>
              )) : (
                <p className="text-[11px] text-slate-300 italic">Add experience in the builder...</p>
              )}
            </div>
          </section>

          {/* PROJECTS - MAIN CONTENT DYNAMIC FIELD */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <div className="flex items-center space-x-4 border-b-[3px] border-slate-900 pb-2 mb-6">
                <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Projects</h2>
              </div>
              <div className="space-y-8">
                {data.projects.map(project => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#004b93] flex items-center font-bold">
                          View Project <ExternalLink className="w-2.5 h-2.5 ml-1" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          <section>
            <div className="flex items-center space-x-4 border-b-[3px] border-slate-900 pb-2 mb-6">
               <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Education</h2>
            </div>
            <div className="space-y-8">
              {data.education.length > 0 ? data.education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight leading-tight">{edu.degree}</h3>
                    <p className="text-[12px] font-bold text-slate-500 italic leading-none">{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{edu.startDate}</span>
                  </div>
                </div>
              )) : (
                <p className="text-[11px] text-slate-300 italic">Add education in the builder...</p>
              )}
            </div>
          </section>

          {/* CERTIFICATIONS */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <div className="flex items-center space-x-4 border-b-[3px] border-slate-900 pb-2 mb-6">
                <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Certifications</h2>
              </div>
              <div className="space-y-3">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#004b93] shrink-0" />
                    <p className="text-[11px] font-bold text-slate-700">{cert}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};