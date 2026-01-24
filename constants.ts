import { ResumeTemplate, TemplateTier, ResumeData } from './types';

export const TEMPLATES: ResumeTemplate[] = [
  { 
    id: 'yuki-blue', 
    name: 'Professional Resume Template: Yuki Style', 
    tier: TemplateTier.FREE, 
    thumbnail: 'http://c2fashionstudio.com/trendplatform/wp-content/themes/hello-theme-child/img/resume/resume1.jpeg' 
  }
];

const DEFAULT_SETTINGS = {
  primaryColor: '#004b93',
  secondaryColor: 'rgba(0,0,0,0.15)',
  sidebarTextColor: '#ffffff',
  mainTextColor: '#333333',
  subHeadingColor: '#1a2b48',
  accentColor: '#004b93',
  headingFont: 'Inter',
  bodyFont: 'Inter',
};

export const MOCK_RESUME_DATA: ResumeData = {
  id: 'mock-1',
  title: 'My Professional Resume',
  templateId: 'yuki-blue',
  lastEdited: new Date().toISOString(),
  personalInfo: {
    fullName: 'Yuki Miller',
    email: 'yuki.miller@example.com',
    phone: '(555) 555-5555',
    location: 'Fullstack | Next JS | React JS | Python',
    linkedin: 'linkedin.com/in/yukimiller',
    portfolio: 'yukimiller.dev',
    summary: 'Innovative data scientist with 9 years\' experience, proficient in AI and analytics, enhancing operations through strategic data-driven solutions. Proven track record in leading cross-functional teams to deliver scalable machine learning models and actionable business insights.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Innovations Lab',
      position: 'Senior AI Intern',
      location: 'Portland, ME',
      isRemote: false,
      startDate: 'June 2025',
      endDate: 'December 2025',
      current: false,
      description: 'Developed advanced AI models, increasing operational efficiency by 20%\nStreamlined core data processing pipelines, cutting infrastructure costs by $10K\nCollaborated on computer vision projects improving detection performance by 15%',
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Stanford University',
      degree: 'Master of Science: Data Science',
      location: 'Stanford, CA',
      startDate: '2018-09',
      endDate: '2020-06',
      grade: '3.9 GPA',
    }
  ],
  skills: [
    { name: 'Data Analysis', level: 90 },
    { name: 'Python Programming', level: 95 },
    { name: 'Machine Learning', level: 85 }
  ],
  languages: ['Spanish (Fluent)', 'German (Native)'],
  projects: [
    {
      id: 'proj-1',
      name: 'ResuMaster AI Platform',
      link: 'https://github.com/example/resumaster',
      description: 'Built a full-stack resume builder using React, Node.js, and Gemini API. Implemented real-time PDF generation and AI-driven content optimization.',
    }
  ],
  certifications: ['Certified AI Practitioner', 'Data Analytics Professional'],
  hobbies: ['Chess', 'Photography', 'Travel'],
  settings: { ...DEFAULT_SETTINGS }
};

export const INITIAL_RESUME: ResumeData = {
  id: '',
  title: 'Untitled Resume',
  templateId: 'yuki-blue',
  lastEdited: new Date().toISOString(),
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  hobbies: [],
  settings: { ...DEFAULT_SETTINGS }
};