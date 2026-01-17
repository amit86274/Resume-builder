import React, { useState } from 'react';
import { 
  CheckCircle, Zap, Shield, FileCheck, ArrowRight, 
  Star, Quote, ChevronDown, ChevronUp, Sparkles,
  Trophy, Users, MousePointer2, Globe, Cpu, Terminal, Layers
} from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b border-gray-100 transition-all duration-300 ${isOpen ? 'bg-blue-50/30' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-blue-600 transition-colors group px-4"
      >
        <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-900'}`}>{question}</span>
        <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-6 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description, iconBg, delay, tag }: any) => (
  <div 
    className="relative group p-1 bg-gradient-to-br from-slate-100 to-white rounded-[2.5rem] hover:from-blue-400 hover:to-indigo-500 transition-all duration-500 shadow-xl animate-in slide-in-from-bottom-4"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="bg-white p-8 md:p-10 rounded-[2.4rem] h-full flex flex-col items-start transition-all duration-500 group-hover:bg-white/95">
      <div className="flex justify-between w-full mb-8">
        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg`}>
          {React.cloneElement(icon, { className: 'w-7 h-7 text-white' })}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600 transition-colors pt-2">
          {tag}
        </span>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium mb-8 flex-grow">{description}</p>
      
      <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden mt-auto">
        <div className="w-0 group-hover:w-full h-full bg-blue-600 transition-all duration-1000 ease-out" />
      </div>
    </div>
  </div>
);

interface LandingProps {
  onStart: () => void;
  onNavigate: (page: string) => void;
}

const Landing: React.FC<LandingProps> = ({ onStart, onNavigate }) => {
  const reviews = [
    {
      name: "Ananya Iyer",
      role: "Software Engineer at TCS",
      content: "ResuMaster helped me optimize my resume for ATS. I got three interview calls within a week of using the AI analyzer!",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=ananya"
    },
    {
      name: "Vikram Malhotra",
      role: "Product Manager",
      content: "The templates are world-class. I love how easy it is to switch between designs without losing my data. Truly a game changer.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=vikram"
    },
    {
      name: "Sneha Kapoor",
      role: "Recent Graduate",
      content: "As a fresher, I didn't know how to word my projects. The AI rewrite feature gave me professional bullet points that actually make sense.",
      rating: 4,
      avatar: "https://i.pravatar.cc/150?u=sneha"
    },
    {
      name: "Rajesh Kumar",
      role: "Data Scientist",
      content: "The AI analysis is surprisingly deep. It pointed out missing skills I hadn't even thought about. Highly recommended for professionals.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=rajesh"
    }
  ];

  const faqs = [
    {
      question: "Where can I get a free resume template?",
      answer: "You can find high-quality, ATS-friendly resume templates for free right here on ResuMaster AI. Simply click 'Get Started' to choose from our range of professional designs and start building your career."
    },
    {
      question: "How can I choose the best resume template for my industry?",
      answer: "We recommend choosing a template based on your industry's culture. For corporate roles (Banking, Law), use our 'Executive' or 'Modern' templates. For tech and creative roles, our 'Creative Portfolio' or 'Tech Specialist' templates offer more visual flair while remaining ATS-compliant."
    },
    {
      question: "Why are ResuMaster AI's templates best for your job application?",
      answer: "Our templates are human-designed by recruiting experts and tested against major Applicant Tracking Systems (ATS). They ensure your content is parsed correctly while presenting a polished, professional image to human recruiters."
    },
    {
      question: "Should I use a template for my resume?",
      answer: "Absolutely. A professional template ensures correct formatting, proper spacing, and a clean hierarchy. This allows recruiters to find key information in seconds, significantly increasing your chances of landing an interview."
    },
    {
      question: "Does ResuMaster AI have templates for resumes with no experience?",
      answer: "Yes, we have specifically designed 'Minimal' and 'Student' templates that focus on education, projects, and skills, making them perfect for freshers or those making a career pivot with limited direct experience."
    },
    {
      question: "Is ResuMaster AI really free to use?",
      answer: "Yes! You can build, edit, and preview your resume completely for free. We offer free templates and free TXT downloads. Premium PDF/DOCX exports and advanced AI features are available through our affordable Pro plans."
    },
    {
      question: "Is my data safe with ResuMaster AI?",
      answer: "Your privacy is our priority. We use industry-standard encryption to protect your personal information and resume data. We do not sell your data to third parties."
    }
  ];

  return (
    <div className="bg-white selection:bg-blue-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 lg:pt-32 lg:pb-48 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[80px] animate-float" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[80px] animate-float-delayed" />
          
          <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-8 shadow-sm animate-in fade-in duration-1000">
              <Sparkles className="w-4 h-4" />
              <span>India's #1 AI Resume Builder</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1] animate-in slide-in-from-bottom-8 duration-1000">
              Build a Professional Resume <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">in Minutes</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 mb-12 font-medium leading-[1.8] animate-in fade-in duration-1000 delay-300 px-4">
              Stop fighting with margins. Let AI handle the heavy lifting while you focus on landing your dream job at top Indian companies.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-5 animate-in fade-in duration-1000 delay-500">
              <button 
                onClick={onStart}
                className="group px-10 py-5 bg-animate-gradient text-white text-base font-black rounded-2xl transition-all duration-300 shadow-xl hover:shadow-blue-500/20 flex items-center justify-center transform hover:scale-105 active:scale-95 uppercase tracking-widest"
              >
                Create My Resume
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white text-slate-900 text-base font-black border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center justify-center shadow-sm uppercase tracking-widest"
              >
                Learn More
              </button>
            </div>
            
            <div className="mt-28 pt-12 border-t border-slate-200/60 flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center space-x-2 text-slate-900"><Trophy className="w-5 h-5" /><span className="font-black text-xs uppercase tracking-tighter">Gold Standard</span></div>
               <div className="flex items-center space-x-2 text-slate-900"><Users className="w-5 h-5" /><span className="font-black text-xs uppercase tracking-tighter">100K+ Users</span></div>
               <div className="flex items-center space-x-2 text-slate-900"><Globe className="w-5 h-5" /><span className="font-black text-xs uppercase tracking-tighter">Global Impact</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Engineering Section */}
      <section className="py-32 relative overflow-hidden bg-white">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg width="100%" height="100%">
            <pattern id="features-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#features-grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-24 gap-12 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center px-4 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-[0.3em] mb-6">
                <Cpu className="w-4 h-4 mr-2" /> Engineered for impact
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
                Smart Engineering. <br />
                <span className="text-blue-600">Better Results.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                We've spent thousands of hours analyzing winning resumes to build an engine that doesn't just format—it optimizes.
              </p>
            </div>
            
            <div className="hidden lg:flex flex-wrap justify-center gap-4 max-w-sm">
               {[
                 { label: "Core Engine", val: "Gemini 3", icon: <Cpu /> },
                 { label: "Parsing Rate", val: "99.8%", icon: <Terminal /> },
                 { label: "Layout Logic", val: "Dynamic", icon: <Layers /> }
               ].map((stat, i) => (
                 <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex-1 min-w-[160px] group hover:bg-white hover:shadow-xl transition-all">
                    <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-xl font-black text-slate-900 tracking-tight">{stat.val}</div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap />}
              iconBg="bg-blue-600 shadow-blue-200"
              title="AI Content Engine"
              tag="Module 01"
              description="Instantly transform basic notes into powerful professional bullets. Perfect grammar and action-oriented verbs, every time."
              delay="0"
            />
            <FeatureCard 
              icon={<FileCheck />}
              iconBg="bg-indigo-600 shadow-indigo-200"
              title="Real-time ATS Scan"
              tag="Module 02"
              description="Watch your score climb as you build. Get precise feedback to bypass automated gatekeepers used by top global firms."
              delay="150"
            />
            <FeatureCard 
              icon={<MousePointer2 />}
              iconBg="bg-slate-900 shadow-slate-200"
              title="Intuitive Canvas"
              tag="Module 03"
              description="Customize your layout without the formatting headaches. Everything snaps to a perfect typographic grid automatically."
              delay="300"
            />
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION: Real Results. Real People. */}
      <section id="reviews" className="py-32 bg-animate-gradient text-white overflow-hidden relative border-y border-white/10">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight">
              Real Results. <span className="text-white/70">Real People.</span>
            </h2>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of successful candidates who used ResuMaster to upgrade their careers and land top roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="group p-8 rounded-[2.5rem] bg-white/95 backdrop-blur-md shadow-2xl hover:shadow-white/10 hover:-translate-y-2 transition-all duration-500">
                <div className="flex mb-6 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <div className="relative mb-8">
                  <Quote className="absolute -top-4 -left-2 w-10 h-10 text-blue-600/10 -z-10" />
                  <p className="text-[15px] leading-[1.7] text-slate-800 font-semibold italic relative z-10">"{review.content}"</p>
                </div>
                <div className="flex items-center pt-6 border-t border-slate-100">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-[14px] mr-4 object-cover ring-2 ring-blue-100 shadow-md" />
                  <div>
                    <h4 className="font-black text-slate-900 leading-tight text-sm">{review.name}</h4>
                    <p className="text-[10px] text-blue-600 uppercase tracking-widest font-black mt-1">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-10">
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-1">4.9/5</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">User Satisfaction</div>
            </div>
            <div className="w-px bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-1">92%</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Interview Rate</div>
            </div>
            <div className="w-px bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-1">50K+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Monthly Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Everything you need to know</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Got Questions?</h2>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-animate-gradient py-32 relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">Ready to Land Your Dream Job?</h3>
          <p className="text-blue-50 mb-14 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Your next interview is just 5 minutes away. Join thousands of professionals who already upgraded their careers with ResuMaster AI.
          </p>
          <button 
            onClick={onStart}
            className="px-12 py-6 bg-white text-blue-600 text-lg font-black rounded-2xl shadow-2xl hover:bg-slate-50 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest"
          >
            Create My Resume Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
