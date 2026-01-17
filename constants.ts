import { ResumeTemplate, TemplateTier, ResumeData } from './types';

export const TEMPLATES: ResumeTemplate[] = [
  { 
    id: 'yuki-blue', 
    name: 'Professional Resume Template: Yuki Style', 
    tier: TemplateTier.FREE, 
    thumbnail: 'https://cdn-images.zety.com/templates/professional-intern-resume-template--blue-color-imageFirst-5f9f5986-8aad-4cb5-bd8c-e867989ceb8a.png' 
  }
];

export const MOCK_RESUME_DATA: ResumeData = {
  id: 'mock',
  title: 'Mock Resume',
  templateId: 'yuki-blue',
  lastEdited: new Date().toISOString(),
  personalInfo: {
    fullName: 'Yuki Miller',
    email: 'yuki@example.com',
    phone: '(555) 555-5555',
    location: 'Portland, ME 04108',
    linkedin: 'linkedin.com/in/yukimiller',
    portfolio: 'yukimiller.com',
    summary: "Innovative data scientist with 9 years' experience, proficient in AI and analytics, enhancing operations through strategic data-driven solutions.",
  },
  experience: [
    {
      id: 'e1',
      company: 'Tech Innovations Lab',
      position: 'Intern',
      location: 'Portland, ME',
      startDate: '2025-06',
      endDate: '2025-12',
      current: false,
      description: 'Developed AI models, increasing efficiency by 20%\nStreamlined data processing, cutting costs by $10K\nCollaborated on projects improving performance by 15%'
    },
    {
      id: 'e2',
      company: 'Quantify Financial',
      position: 'Junior Data Analyst',
      location: 'Portland, ME',
      startDate: '2023-01',
      endDate: '2025-05',
      current: false,
      description: 'Analyzed datasets, contributing to 30% revenue growth\nImproved dashboard visibility, boosting engagements 50%\nEnhanced reporting accuracy, reducing errors by 25%'
    },
    {
      id: 'e3',
      company: 'DataHub Analytics',
      position: 'Data Analyst',
      location: 'Portland, ME',
      startDate: '2016-01',
      endDate: '2022-12',
      current: false,
      description: 'Led analytics projects, saving $50K annually\nIntegrated new metrics, enhancing insights 40%\nSupported teams, improving workflow efficiency by 30%'
    }
  ],
  education: [
    {
      id: 'ed1',
      school: 'Stanford University',
      degree: 'Master of Science: Data Science',
      location: 'Westbrook, ME',
      startDate: '2015-06',
      endDate: '',
      grade: ''
    },
    {
      id: 'ed2',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Arts: Computer Science',
      location: 'Westbrook, ME',
      startDate: '2014-06',
      endDate: '',
      grade: ''
    }
  ],
  skills: ['Data Analysis', 'Python Programming', 'Machine Learning', 'Predictive Modeling', 'Statistical Analysis'],
  languages: ['Spanish', 'Mandarin', 'German'],
  projects: [],
  certifications: [
    'Certified AI Practitioner - AI Certification Institute',
    'Data Analytics Professional - Global Data Institute',
    'Advanced Python Developer - Python Certifications Board'
  ],
};

export const INITIAL_RESUME: ResumeData = {
  id: '1',
  title: 'My Resume',
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
};

export const PLANS = [
  {
    id: 'free',
    name: 'Basic',
    price: '₹0',
    features: ['3 Resumes', 'TXT Downloads', 'Limited AI', 'Standard Templates'],
    color: 'bg-gray-100',
    buttonText: 'Current Plan'
  },
  {
    id: 'pro',
    name: 'Pro (Trial)',
    price: '₹195',
    subtext: 'for 14 days, then ₹445/4 weeks',
    features: ['Unlimited Resumes', 'PDF/DOCX Exports', 'Unlimited AI', 'Premium Templates'],
    color: 'bg-blue-600 text-white',
    buttonText: 'Start Trial'
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '₹1,195',
    subtext: 'per year (₹99.58/mo)',
    features: ['All Pro Features', 'Best Value', 'Priority Support', 'GST Invoices'],
    color: 'bg-purple-600 text-white',
    buttonText: 'Go Annual'
  }
];
