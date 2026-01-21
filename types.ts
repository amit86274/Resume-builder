
export interface ResumeData {
  id: string;
  _id?: string;
  userId?: string;
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
    profileImage?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: string[];
  projects: Project[];
  certifications: string[];
  hobbies: string[];
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
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'annual';
  subscription?: {
    status: 'active' | 'expired' | 'cancelled';
    currentPeriodEnd: string;
    razorpayCustomerId?: string;
  };
  metadata: {
    resumeCount: number;
    totalDownloads: number;
    lastLogin: string;
  };
}

export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  plan: 'pro' | 'annual';
  status: 'captured' | 'failed' | 'refunded';
  razorpayPaymentId: string;
  razorpayOrderId: string;
  createdAt: string;
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
