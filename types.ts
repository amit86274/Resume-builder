
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
    profileImage?: string; // Base64 string of the uploaded/cropped image
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: string[];
  projects: Project[];
  certifications: string[];
  hobbies: string[];
  settings?: CustomizationSettings;
}

export interface CustomizationSettings {
  primaryColor: string;      // Sidebar background
  secondaryColor: string;    // Sub-heading background (sidebar)
  sidebarTextColor: string;  // Text color in sidebar
  mainTextColor: string;     // Text color in main content
  subHeadingColor: string;   // Color for positions/degrees in main content
  accentColor: string;       // Color for name/title/icons
  headingFont: string;
  bodyFont: string;
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  isRemote: boolean;
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