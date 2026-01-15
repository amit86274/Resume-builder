
export interface ResumeData {
  id: string;
  title: string;
  templateId: string;
  lastEdited: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'annual';
  trialEndsAt?: string;
  resumeCount: number;
}

export enum TemplateTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface ResumeTemplate {
  id: string;
  name: string;
  tier: TemplateTier;
  thumbnail: string;
}

export interface AnalyzerResult {
  score: number;
  missingSections: string[];
  contentSuggestions: string[];
  atsScore: number;
  generalFeedback: string;
}
