
import { ResumeTemplate, TemplateTier, ResumeData } from './types';

export const TEMPLATES: ResumeTemplate[] = [
  { id: 'modern', name: 'Modern Professional', tier: TemplateTier.FREE, thumbnail: 'https://picsum.photos/seed/res1/300/400' },
  { id: 'minimal', name: 'Minimalist Clean', tier: TemplateTier.FREE, thumbnail: 'https://picsum.photos/seed/res2/300/400' },
  { id: 'executive', name: 'Executive Suite', tier: TemplateTier.PREMIUM, thumbnail: 'https://picsum.photos/seed/res3/300/400' },
  { id: 'creative', name: 'Creative Portfolio', tier: TemplateTier.PREMIUM, thumbnail: 'https://picsum.photos/seed/res4/300/400' },
  { id: 'tech', name: 'Tech Specialist', tier: TemplateTier.PREMIUM, thumbnail: 'https://picsum.photos/seed/res5/300/400' },
];

export const INITIAL_RESUME: ResumeData = {
  id: '1',
  title: 'My Resume',
  templateId: 'modern',
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
