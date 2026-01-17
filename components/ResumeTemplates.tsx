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
 */
const YukiBlueTemplate: React.FC<TemplateProps> = ({ data }) => {
  // Colors sampled from the Zety screenshot
  const sidebarBlue = "#1e88e5";
  const headerBarBlue = "#1565c0"; // Darker bar for sidebar headers

  return (
    <div className="bg-white min-h-[29.7cm] w-full flex font-sans leading-relaxed text-[#333] overflow-hidden shadow-sm">
      {/* LEFT SIDEBAR */}
      <div className="w-[33%] bg-[#1e88e5] text-white flex flex-col shrink-0">
        <div className="flex flex-col px-6 py-10 items-center">
          {/* Profile Image - Large and Circular */}
          <div className="w-32 h-32 mb-8 rounded-full border-[6px] border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250&h=250" 
              alt={data.personalInfo.fullName} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Name - Big, Bold, Uppercase */}
          <h1 className="text-[42px] font-black uppercase leading-[0.9] text-left w-full tracking-tighter mb-10 px-2">
            {data.personalInfo.fullName.split(' ').map((part, i) => (
              <React.Fragment key={i}>
                {part}
                {i < data.personalInfo.fullName.split(' ').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
        </div>
        
        <div className="w-full flex flex-col pb-12">
          {/* Contact Section */}
          <section>
            <div className="bg-[#1565c0] px-8 py-2.5 mb-6">
              <h2 className="text-[16px] font-black uppercase tracking-widest">Contact</h2>
            </div>
            <div className="px-8 space-y-4 text-[11px] font-medium">
              <div>
                <p className="font-bold mb-0.5">Address</p>
                <p className="opacity-95">{data.personalInfo.location || 'Portland, ME 04108'}</p>
              </div>
              <div>
                <p className="font-bold mb-0.5">Phone</p>
                <p className="opacity-95">{data.personalInfo.phone || '(555) 555-5555'}</p>
              </div>
              <div>
                <p className="font-bold mb-0.5">E-mail</p>
                <p className="opacity-95 break-all leading-snug">{data.personalInfo.email || 'yuki@example.com'}</p>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="mt-10">
            <div className="bg-[#1565c0] px-8 py-2.5 mb-6">
              <h2 className="text-[16px] font-black uppercase tracking-widest">Skills</h2>
            </div>
            <div className="px-8 flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="bg-transparent px-3 py-1.5 rounded-full text-[10px] font-black border border-white/50 text-center leading-none uppercase tracking-wide">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* Languages Section */}
          {data.languages && data.languages.length > 0 && (
            <section className="mt-10">
              <div className="bg-[#1565c0] px-8 py-2.5 mb-6">
                <h2 className="text-[16px] font-black uppercase tracking-widest">Languages</h2>
              </div>
              <div className="px-8 flex flex-wrap gap-2">
                {data.languages.map((lang, i) => (
                  <div key={i} className="bg-transparent px-3 py-1.5 rounded-full text-[10px] font-black border border-white/50 text-center leading-none uppercase tracking-wide">
                    {lang}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* MAIN CONTENT (RIGHT) */}
      <div className="flex-1 p-10 md:p-12 space-y-10 bg-white">
        {/* Summary */}
        <section>
          <p className="text-[13px] text-[#444] font-medium leading-[1.6]">
            {data.personalInfo.summary}
          </p>
          <div className="border-b border-gray-100 mt-8" />
        </section>

        {/* Work History */}
        <section className="space-y-6">
          <h2 className="text-[20px] font-black text-[#1e88e5] border-b border-gray-200 pb-2 mb-6 uppercase tracking-tight">Work History</h2>
          <div className="space-y-8">
            {data.experience.map(exp => (
              <div key={exp.id} className="grid grid-cols-12 gap-6">
                <div className="col-span-3 text-[12px] font-bold text-gray-400 pt-0.5">
                  {exp.startDate} -<br/>{exp.endDate || (exp.current ? 'Present' : '')}
                </div>
                <div className="col-span-9 space-y-1">
                  <h3 className="text-[17px] font-black text-gray-900 leading-tight">{exp.position}</h3>
                  <p className="text-[12px] font-bold text-gray-500 italic">
                    {exp.company}, {exp.location}
                  </p>
                  <ul className="list-disc pl-5 text-[12px] text-[#555] space-y-1.5 font-medium leading-relaxed mt-2">
                    {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-[20px] font-black text-[#1e88e5] border-b border-gray-200 pb-2 mb-6 uppercase tracking-tight">Certifications</h2>
            <ul className="list-disc pl-10 text-[12px] text-[#555] space-y-2.5 font-medium leading-relaxed">
              {data.certifications.map((cert, i) => (
                <li key={i}>{cert}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        <section className="space-y-6">
          <h2 className="text-[20px] font-black text-[#1e88e5] border-b border-gray-200 pb-2 mb-6 uppercase tracking-tight">Education</h2>
          <div className="space-y-8">
            {data.education.map(edu => (
              <div key={edu.id} className="grid grid-cols-12 gap-6">
                <div className="col-span-3 text-[12px] font-bold text-gray-400 pt-0.5">
                  {edu.startDate}
                </div>
                <div className="col-span-9 space-y-1">
                  <h3 className="text-[17px] font-black text-gray-900 leading-tight">{edu.degree}</h3>
                  <p className="text-[12px] font-bold text-gray-500 italic">
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
