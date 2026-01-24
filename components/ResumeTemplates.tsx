import React from 'react';
import { ResumeData } from '../types';

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
 * Optimized for Multi-page PDF Export with dynamic customization.
 */
const YukiBlueTemplate: React.FC<TemplateProps> = ({ data }) => {
  const sidebarPadding = "px-9";
  const settings = data.settings || {
    primaryColor: '#004b93',
    secondaryColor: 'rgba(0,0,0,0.15)',
    sidebarTextColor: '#ffffff',
    mainTextColor: '#333333',
    subHeadingColor: '#1a2b48',
    accentColor: '#004b93',
    headingFont: 'Inter',
    bodyFont: 'Inter',
  };

  const fontStyle = {
    fontFamily: settings.bodyFont,
  };

  const headingStyle = {
    fontFamily: settings.headingFont,
  };

  const subHeadingStyle = {
    ...headingStyle,
    color: settings.subHeadingColor
  };

  return (
    <div 
      className="w-[210mm] min-h-[297mm] flex text-[#333] selection:bg-blue-100 relative !m-0 !p-0"
      style={{ 
        boxSizing: 'border-box', 
        border: 'none',
        // This background ensures the sidebar color persists across all generated pages
        background: `linear-gradient(to right, ${settings.primaryColor} 0%, ${settings.primaryColor} 33%, #ffffff 33%, #ffffff 100%)`,
        overflow: 'visible',
        ...fontStyle
      }}
    >
      {/* LEFT SIDEBAR (33%) */}
      <div className="w-[33%] flex flex-col shrink-0 pb-12 m-0 p-0 border-none" style={{ height: 'auto', color: settings.sidebarTextColor }}>
        {/* Photo Container */}
        {data.personalInfo.profileImage && (
          <div className="pt-14 pb-8 flex justify-center" style={{ pageBreakInside: 'avoid' }}>
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
          <section className="mb-10" style={{ pageBreakInside: 'avoid' }}>
            <div className="px-9 py-2.5 mb-6" style={{ backgroundColor: settings.secondaryColor }}>
              <h2 className="text-[12px] font-black uppercase tracking-[0.25em]" style={headingStyle}>Contact</h2>
            </div>
            <div className={`${sidebarPadding} space-y-5 text-[11px]`}>
              <div className="space-y-1">
                <p className="font-bold opacity-50 uppercase tracking-tighter text-[9px]">Address</p>
                <p className="font-semibold leading-relaxed opacity-90">{data.personalInfo.location || 'Location'}</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold opacity-50 uppercase tracking-tighter text-[9px]">Phone</p>
                <p className="font-semibold opacity-90">{data.personalInfo.phone || 'Phone'}</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold opacity-50 uppercase tracking-tighter text-[9px]">E-mail</p>
                <p className="font-semibold opacity-90 break-all leading-snug">{data.personalInfo.email || 'Email'}</p>
              </div>
              {data.personalInfo.linkedin && (
                <div className="space-y-1">
                  <p className="font-bold opacity-50 uppercase tracking-tighter text-[9px]">LinkedIn</p>
                  <p className="font-semibold opacity-90 break-all leading-snug">{data.personalInfo.linkedin}</p>
                </div>
              )}
            </div>
          </section>

          {/* SKILLS SECTION */}
          <section className="mb-10" style={{ pageBreakInside: 'avoid' }}>
            <div className="px-9 py-2.5 mb-6" style={{ backgroundColor: settings.secondaryColor }}>
              <h2 className="text-[12px] font-black uppercase tracking-[0.25em]" style={headingStyle}>Skills</h2>
            </div>
            <div className={`${sidebarPadding} space-y-4`}>
              {data.skills && data.skills.length > 0 ? data.skills.map((skill, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[11px] font-bold leading-tight opacity-90">{skill.name}</p>
                  <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <p className="text-[10px] opacity-40 italic px-9">Add skills...</p>
              )}
            </div>
          </section>

          {/* LANGUAGES SECTION */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-10" style={{ pageBreakInside: 'avoid' }}>
              <div className="px-9 py-2.5 mb-6" style={{ backgroundColor: settings.secondaryColor }}>
                <h2 className="text-[12px] font-black uppercase tracking-[0.25em]" style={headingStyle}>Languages</h2>
              </div>
              <div className={`${sidebarPadding} space-y-3`}>
                {data.languages.map((lang, i) => (
                  <p key={i} className="text-[11px] font-bold opacity-90">{lang}</p>
                ))}
              </div>
            </section>
          )}

          {/* HOBBIES SECTION */}
          {data.hobbies && data.hobbies.length > 0 && (
            <section style={{ pageBreakInside: 'avoid' }}>
              <div className="px-9 py-2.5 mb-6" style={{ backgroundColor: settings.secondaryColor }}>
                <h2 className="text-[12px] font-black uppercase tracking-[0.25em]" style={headingStyle}>Hobbies</h2>
              </div>
              <div className={`${sidebarPadding} space-y-3`}>
                {data.hobbies.map((hobby, i) => (
                  <p key={i} className="text-[11px] font-bold opacity-90">{hobby}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* MAIN CONTENT (67%) */}
      <div className="flex-1 flex flex-col bg-transparent border-none" style={{ color: settings.mainTextColor }}>
        <header className="pl-12 pr-12 pt-14 pb-6 border-b border-gray-100 flex flex-col items-start justify-center" style={{ pageBreakInside: 'avoid' }}>
          <h1 className="text-[38px] font-black uppercase tracking-tighter leading-none mb-3" style={{ ...headingStyle, color: settings.accentColor }}>
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-[15px] font-bold uppercase tracking-[0.1em] leading-tight" style={{ ...headingStyle, color: settings.accentColor }}>
            {data.personalInfo.location || 'Professional Title'}
          </p>
        </header>

        <div className="pl-12 pr-12 pt-8 pb-12 space-y-12">
          {/* SUMMARY */}
          {data.personalInfo.summary && (
            <section style={{ pageBreakInside: 'avoid' }}>
              <div className="flex items-center space-x-4 border-b-[3px] pb-2 mb-6" style={{ borderColor: settings.accentColor }}>
                 <h2 className="text-[14px] font-black uppercase tracking-[0.2em] leading-none" style={{ ...headingStyle, color: settings.accentColor }}>Summary</h2>
              </div>
              <p className="text-[12px] font-medium leading-[1.7] text-justify">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          <section>
            <div className="flex items-center space-x-4 border-b-[3px] pb-2 mb-6" style={{ pageBreakInside: 'avoid', borderColor: settings.accentColor }}>
               <h2 className="text-[14px] font-black uppercase tracking-[0.2em] leading-none" style={{ ...headingStyle, color: settings.accentColor }}>Experience</h2>
            </div>
            <div className="space-y-10">
              {data.experience && data.experience.length > 0 ? data.experience.map(exp => (
                <div key={exp.id} className="space-y-3" style={{ pageBreakInside: 'avoid' }}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-[14px] font-black uppercase tracking-tight" style={subHeadingStyle}>{exp.position}</h3>
                      <p className="text-[12px] font-bold italic leading-none" style={{ color: settings.accentColor }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-[11px] font-black uppercase tracking-tight whitespace-nowrap">
                        {exp.startDate} — {exp.endDate || (exp.current ? 'Present' : '')}
                      </span>
                    </div>
                  </div>
                  {/* Fixed: Removed non-standard CSS property 'markerColor' from style object */}
                  <ul className="list-disc pl-5 text-[11px] opacity-80 space-y-2 font-medium leading-relaxed">
                    {exp.description && exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="pl-1">{line}</li>
                    ))}
                  </ul>
                </div>
              )) : (
                <p className="text-[11px] text-slate-300 italic">Work experience details will appear here...</p>
              )}
            </div>
          </section>

          {/* EDUCATION */}
          <section style={{ pageBreakInside: 'avoid' }}>
            <div className="flex items-center space-x-4 border-b-[3px] pb-2 mb-6" style={{ borderColor: settings.accentColor }}>
               <h2 className="text-[14px] font-black uppercase tracking-[0.2em] leading-none" style={{ ...headingStyle, color: settings.accentColor }}>Education</h2>
            </div>
            <div className="space-y-8">
              {data.education && data.education.length > 0 ? data.education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <h3 className="text-[14px] font-black uppercase tracking-tight leading-tight" style={subHeadingStyle}>{edu.degree}</h3>
                    <p className="text-[12px] font-bold opacity-60 italic leading-none">{edu.school}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-[11px] font-black uppercase tracking-tight whitespace-nowrap">{edu.startDate}</span>
                  </div>
                </div>
              )) : (
                <p className="text-[11px] text-slate-300 italic">Education history will appear here...</p>
              )}
            </div>
          </section>

          {/* CERTIFICATIONS */}
          {data.certifications && data.certifications.length > 0 && (
            <section style={{ pageBreakInside: 'avoid' }}>
              <div className="flex items-center space-x-4 border-b-[3px] pb-2 mb-6" style={{ borderColor: settings.accentColor }}>
                <h2 className="text-[14px] font-black uppercase tracking-[0.2em] leading-none" style={{ ...headingStyle, color: settings.accentColor }}>Certifications</h2>
              </div>
              <div className="space-y-4">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: settings.accentColor }} />
                    <p className="text-[12px] font-bold leading-tight opacity-90">{cert}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <section style={{ pageBreakInside: 'avoid' }}>
              <div className="flex items-center space-x-4 border-b-[3px] pb-2 mb-6" style={{ borderColor: settings.accentColor }}>
                <h2 className="text-[14px] font-black uppercase tracking-[0.2em] leading-none" style={{ ...headingStyle, color: settings.accentColor }}>Projects</h2>
              </div>
              <div className="space-y-6">
                {data.projects.map(proj => (
                  <div key={proj.id} className="space-y-1">
                    <h3 className="text-[14px] font-black uppercase tracking-tight" style={subHeadingStyle}>{proj.name}</h3>
                    {proj.link && <p className="text-[11px] text-blue-600 underline font-bold">{proj.link}</p>}
                    <p className="text-[12px] opacity-90 leading-relaxed">{proj.description}</p>
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