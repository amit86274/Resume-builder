import { ResumeTemplate, TemplateTier, ResumeData } from './types';

export const TEMPLATES: ResumeTemplate[] = [
  { 
    id: 'classic', 
    name: 'Classic ATS (Suki Davis)', 
    tier: TemplateTier.FREE, 
    thumbnail: 'https://images.unsplash.com/photo-1598520422279-06521f96405d?auto=format&fit=crop&q=80&w=600&h=800' 
  }
];

export const MOCK_RESUME_DATA: ResumeData = {
  id: 'mock',
  title: 'Mock Resume',
  templateId: 'classic',
  lastEdited: new Date().toISOString(),
  personalInfo: {
    fullName: 'SUKI DAVIS',
    email: 'suki@example.com',
    phone: '(555) 555-5555',
    location: 'Columbus, OH 43201',
    linkedin: 'linkedin.com/in/sukidavis',
    portfolio: 'sukidavis.com',
    summary: 'Dynamic crew member with hospitality management expertise. Proven record in customer service excellence, ensuring food safety standards, and boosting operational efficiency. Skilled in team collaboration, problem solving, and effective communication.',
  },
  experience: [
    {
      id: 'e1',
      company: 'Sunset Grill',
      position: 'Crew Member',
      location: 'Columbus, OH',
      startDate: '01/2024',
      endDate: '12/2025',
      current: false,
      description: 'Assisted 150+ customers daily with meal preferences\nEnsured food safety standards met 100% of the time\nIncreased team efficiency by 20% through process improvements'
    },
    {
      id: 'e2',
      company: 'Maple Leaf Dining',
      position: 'Service Associate',
      location: 'Columbus, OH',
      startDate: '01/2022',
      endDate: '12/2023',
      current: false,
      description: 'Managed cash transactions exceeding $10k monthly\nAchieved 95% customer satisfaction ratings consistently\nTrained 5 new team members in service protocols'
    }
  ],
  education: [
    {
      id: 'ed1',
      school: 'Springfield University',
      degree: 'Bachelor of Arts: Hospitality Management',
      location: 'Northwood, OH',
      startDate: '2018',
      endDate: '05/2022',
      grade: '3.8 GPA'
    },
    {
      id: 'ed2',
      school: 'Springfield High School',
      degree: 'High School Diploma: General Studies',
      location: 'Northwood, OH',
      startDate: '2014',
      endDate: '06/2018',
      grade: ''
    }
  ],
  skills: ['Customer Service Excellence', 'Team Collaboration', 'Food Safety Compliance', 'Efficient Multitasking'],
  projects: [
    { id: 'p1', name: 'Menu Revamp', link: '', description: 'Revamped menu layout, boosting sales by 15%' },
    { id: 'p2', name: 'Scheduling Sync', link: '', description: 'Implemented new scheduling system, reducing overtime costs by 10%' }
  ],
  certifications: ['Food Safety Certified', 'First Aid'],
};

export const INITIAL_RESUME: ResumeData = {
  id: '1',
  title: 'My Resume',
  templateId: 'classic',
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