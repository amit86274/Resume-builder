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
 * PIXEL-PERFECT YUKI BLUE (Exact Screenshot Replication)
 * Proportions: Sidebar (35%) | Main Content (65%)
 */
const YukiBlueTemplate: React.FC<TemplateProps> = ({ data }) => {
  // Specific color codes from the Zety screenshot analysis
  const sidebarBlue = "#2088e5"; // Bright Professional Blue
  const headerBarBlue = "#1664c0"; // Darker Header Bar Blue (for section titles)
  const accentBlue = "#1e88e5"; // Section Title Blue for main content

  return (
    <div className="bg-white min-h-[29.7cm] w-full flex font-sans text-[#333] overflow-hidden shadow-sm">
      {/* LEFT SIDEBAR (Widened to 35% to make name area wider) */}
      <div className="w-[35%] bg-[#2088e5] text-white flex flex-col shrink-0">
        <div className="flex flex-col pl-8 pr-10 pt-8 pb-2">
          {/* Circular Profile Photo - Centered in top area */}
          <div className="w-36 h-36 mb-6 rounded-full border-[6px] border-white/20 overflow-hidden bg-white/10 flex items-center justify-center self-center shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300" 
              alt={data.personalInfo.fullName} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Name: Reduced font weight, line height (leading-[1]), and bottom margin */}
          <h1 className="text-[40px] font-bold uppercase leading-[1] text-left w-full tracking-tighter mb-2">
            {data.personalInfo.fullName.split(' ').map((part, i) => (
              <React.Fragment key={i}>
                {part}
                {i < data.personalInfo.fullName.split(' ').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
        </div>
        
        <div className="w-full flex flex-col pb-12">
          {/* SIDEBAR SECTION: CONTACT */}
          <section>
            <div className="bg-[#1664c0] px-8 py-3.5 mb-6">
              <h2 className="text-[14px] font-black uppercase tracking-[0.2em]">Contact</h2>
            </div>
            {/* Increased text size from 11px to 13px */}
            <div className="px-8 space-y-5 text-[13px]">
              <div>
                <p className="font-bold text-white mb-0.5 uppercase tracking-tighter">Address</p>
                <p className="text-white/90 font-medium leading-tight">{data.personalInfo.location || 'Portland, ME 04108'}</p>
              </div>
              <div>
                <p className="font-bold text-white mb-0.5 uppercase tracking-tighter">Phone</p>
                <p className="text-white/90 font-medium">{data.personalInfo.phone || '(555) 555-5555'}</p>
              </div>
              <div>
                <p className="font-bold text-white mb-0.5 uppercase tracking-tighter">E-mail</p>
                <p className="text-white/90 font-medium break-all leading-snug">{data.personalInfo.email || 'yuki@example.com'}</p>
              </div>
            </div>
          </section>

          {/* SIDEBAR SECTION: SKILLS (Pill Tags) */}
          <section className="mt-12">
            <div className="bg-[#1664c0] px-8 py-3.5 mb-6">
              <h2 className="text-[14px] font-black uppercase tracking-[0.2em]">Skills</h2>
            </div>
            <div className="px-8 flex flex-wrap gap-2.5">
              {(data.skills.length > 0 ? data.skills : ['Data Analysis', 'Python', 'ML']).map((skill, i) => (
                <div key={i} className="bg-transparent px-3 py-1.5 rounded-full text-[9px] font-black border border-white/50 text-center uppercase tracking-widest leading-none">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* SIDEBAR SECTION: LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <section className="mt-12">
              <div className="bg-[#1664c0] px-8 py-3.5 mb-6">
                <h2 className="text-[14px] font-black uppercase tracking-[0.2em]">Languages</h2>
              </div>
              <div className="px-8 flex flex-wrap gap-2.5">
                {data.languages.map((lang, i) => (
                  <div key={i} className="bg-transparent px-3 py-1.5 rounded-full text-[9px] font-black border border-white/50 text-center uppercase tracking-widest leading-none">
                    {lang}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* MAIN CONTENT (Reduced space-y to 6 for tighter section grouping) */}
      <div className="flex-1 pt-12 pb-12 pl-10 pr-12 md:pt-14 md:pb-14 md:pl-10 md:pr-14 space-y-6 bg-white">
        {/* Professional Summary */}
        <section>
          <p className="text-[14px] text-[#444] font-medium leading-[1.65]">
            {data.personalInfo.summary || 'Strategic professional with extensive experience in driving growth through data-driven solutions.'}
          </p>
          {/* Reduced margin-top for the divider line significantly */}
          <div className="w-full h-[1px] bg-gray-100 mt-4" />
        </section>

        {/* WORK HISTORY */}
        <section className="space-y-4">
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-2 mb-4">
             <h2 className="text-[20px] font-black text-[#1e88e5] uppercase tracking-tight leading-none">Work History</h2>
          </div>
          <div className="space-y-8">
            {data.experience.map(exp => (
              <div key={exp.id} className="grid grid-cols-12 gap-4">
                {/* Left side: Dates - Compact col-span-2 */}
                <div className="col-span-2 text-[11px] font-bold text-gray-400 pt-1 leading-relaxed">
                  {exp.startDate} -<br/>
                  {exp.endDate || (exp.current ? 'Present' : '')}
                </div>
                {/* Right side: Role, Company, Description - Tightened space-y-0.5 */}
                <div className="col-span-10 space-y-0.5">
                  <h3 className="text-[18px] font-black text-gray-900 leading-tight">{exp.position}</h3>
                  <p className="text-[13px] font-bold text-gray-500 italic mb-7">
                    {exp.company}, {exp.location}
                  </p>
                  <ul className="list-disc pl-5 text-[13px] text-[#555] space-y-2 font-medium leading-relaxed mt-2">
                    {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2 mb-4">
               <h2 className="text-[20px] font-black text-[#1e88e5] uppercase tracking-tight leading-none">Certifications</h2>
            </div>
            <ul className="list-disc pl-10 text-[13px] text-[#555] space-y-3 font-medium leading-relaxed">
              {data.certifications.map((cert, i) => (
                <li key={i}>{cert}</li>
              ))}
            </ul>
          </section>
        )}

        {/* EDUCATION */}
        <section className="space-y-4">
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-2 mb-4">
             <h2 className="text-[20px] font-black text-[#1e88e5] uppercase tracking-tight leading-none">Education</h2>
          </div>
          <div className="space-y-8">
            {data.education.map(edu => (
              <div key={edu.id} className="grid grid-cols-12 gap-4">
                <div className="col-span-2 text-[11px] font-bold text-gray-400 pt-1 leading-relaxed">
                  {edu.startDate}
                </div>
                {/* Right side: Degree, School - Tightened space-y-0.5 */}
                <div className="col-span-10 space-y-0.5">
                  <h3 className="text-[18px] font-black text-gray-900 leading-tight">{edu.degree}</h3>
                  <p className="text-[13px] font-bold text-gray-500 italic mb-6">
                    {edu.school}, {edu.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};