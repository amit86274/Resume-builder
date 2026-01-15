
import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white p-8 shadow-lg min-h-[11in] w-full text-gray-800 flex flex-col space-y-6">
      <header className="border-b-4 border-blue-600 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-wide">{data.personalInfo.fullName || 'Your Name'}</h1>
        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </header>

      {data.personalInfo.summary && (
        <section>
          <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 uppercase mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.personalInfo.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 uppercase mb-3">Work Experience</h2>
          <div className="space-y-4">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-700">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 uppercase mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="text-sm bg-gray-100 px-2 py-1 rounded">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-blue-600 border-b border-gray-200 uppercase mb-3">Education</h2>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-700">{edu.school}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white p-12 shadow-lg min-h-[11in] w-full text-gray-800 font-serif">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-widest uppercase mb-2">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="flex justify-center space-x-4 text-xs tracking-wider text-gray-500">
          <span>{data.personalInfo.email}</span>
          <span>&bull;</span>
          <span>{data.personalInfo.phone}</span>
          <span>&bull;</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </header>

      <div className="space-y-8">
        <section>
          <p className="text-sm italic text-gray-600 text-center max-w-2xl mx-auto">{data.personalInfo.summary}</p>
        </section>

        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase border-b border-gray-300 pb-1 mb-4">Experience</h2>
          <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm">{exp.company}</h3>
                  <span className="text-xs text-gray-500 italic">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-xs uppercase tracking-tight text-gray-600 mb-2">{exp.position}</p>
                <p className="text-xs leading-relaxed text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8">
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-gray-300 pb-1 mb-4">Skills</h2>
            <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-700">
              {data.skills.map((skill, i) => <span key={i}>{skill}</span>)}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-gray-300 pb-1 mb-4">Education</h2>
            {data.education.map(edu => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold text-xs">{edu.school}</h3>
                <p className="text-xs text-gray-600">{edu.degree}</p>
                <p className="text-[10px] text-gray-400 italic">{edu.startDate} – {edu.endDate}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};
