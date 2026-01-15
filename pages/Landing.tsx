
import React, { useState } from 'react';
import { 
  CheckCircle, Zap, Shield, FileCheck, ArrowRight, 
  Star, Quote, ChevronDown, ChevronUp, Sparkles,
  Trophy, Users, MousePointer2, Globe
} from 'lucide-react';

interface LandingProps {
  onStart: () => void;
  onNavigate: (page: string) => void;
}

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
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
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden bg-slate-50">
        {/* Animated Background Graphics */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-pink-400 rounded-full animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse-soft" />
          
          {/* SVG Pattern Background */}
          <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-8 animate-bounce-short">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen AI Resume Builder is here</span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
              Design Your Future with <br />
              <span className="text-transparent bg-clip-text bg-animate-gradient">AI Precision</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 font-medium leading-relaxed">
              Stop fighting with margins. Let AI handle the heavy lifting while you focus on landing that dream role at top companies like Google, TCS, and Microsoft.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={onStart}
                className="group px-10 py-5 bg-slate-900 text-white text-xl font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center transform hover:scale-105"
              >
                Build My Resume
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white text-slate-900 text-xl font-bold border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                See Success Stories
              </button>
            </div>
            
            {/* Stats / Trust Bar */}
            <div className="mt-24 pt-12 border-t border-slate-200/60">
              <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center space-x-2"><Trophy className="w-6 h-6" /><span className="font-bold text-xl uppercase tracking-tighter">Gold Standard</span></div>
                <div className="flex items-center space-x-2"><Users className="w-6 h-6" /><span className="font-bold text-xl uppercase tracking-tighter">50K+ Users</span></div>
                <div className="flex items-center space-x-2"><Globe className="w-6 h-6" /><span className="font-bold text-xl uppercase tracking-tighter">Global Reach</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">Why Choose ResuMaster?</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mb-8" />
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">We've combined professional career expertise with the world's most advanced AI.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-white" />}
              iconBg="bg-amber-500 shadow-amber-200"
              title="Hyper-Fast AI Rewriting"
              description="Turn messy notes into professional accomplishments in milliseconds. Powered by Gemini 3 Flash."
              delay="0"
            />
            <FeatureCard 
              icon={<FileCheck className="w-10 h-10 text-white" />}
              iconBg="bg-green-500 shadow-green-200"
              title="Real-time ATS Scoring"
              description="Don't guess. See your score live and get instant fix suggestions before you even hit export."
              delay="150"
            />
            <FeatureCard 
              icon={<MousePointer2 className="w-10 h-10 text-white" />}
              iconBg="bg-blue-600 shadow-blue-200"
              title="Drag-and-Drop Perfect"
              description="Full creative control with 30+ stunning layouts that automatically stay within recruiter-preferred bounds."
              delay="300"
            />
          </div>
        </div>
      </section>

      {/* Reviews - Vibrant Gradient Background */}
      <section id="reviews" className="py-32 bg-animate-gradient text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8 text-center lg:text-left">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black mb-6">Real Results. <br /><span className="text-white/80">Real People.</span></h2>
              <p className="text-xl text-blue-50 max-w-lg">Join thousands of successful candidates who used ResuMaster to upgrade their careers.</p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center px-8 py-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="text-3xl font-black text-white">4.9/5</div>
                <div className="text-xs font-bold uppercase tracking-widest text-blue-100">User Rating</div>
              </div>
              <div className="text-center px-8 py-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="text-3xl font-black text-white">92%</div>
                <div className="text-xs font-bold uppercase tracking-widest text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/30 transition-all duration-500 hover:-translate-y-2">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-white fill-current' : 'text-white/20'}`} />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-slate-50 mb-8 italic">"{review.content}"</p>
                <div className="flex items-center pt-6 border-t border-white/10">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-2xl mr-4 object-cover ring-2 ring-white/20" />
                  <div>
                    <h4 className="font-bold text-white leading-tight">{review.name}</h4>
                    <p className="text-sm text-blue-100 uppercase tracking-tighter">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Clean & Modernized */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Help Center</span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width CTA Section above footer - Updated to bg-animate-gradient */}
      <section className="bg-animate-gradient py-24 relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Stop overthinking. Start building.</h3>
          <p className="text-blue-100 mb-12 text-xl max-w-2xl mx-auto font-medium">Your next interview is just 5 minutes away. Join thousands who already landed their dream job.</p>
          <button 
            onClick={onStart}
            className="bg-white text-blue-700 px-16 py-6 rounded-2xl font-black text-2xl hover:bg-slate-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 transform hover:scale-105 active:scale-95"
          >
            Get Started for Free
          </button>
        </div>
        
        {/* Animated background particles */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-white/20 rounded-full animate-float" />
        <div className="absolute bottom-1/4 right-10 w-6 h-6 bg-white/10 rounded-full animate-float-delayed" />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, iconBg, title, description, delay }: { icon: any; iconBg: string; title: string; description: string; delay: string }) => (
  <div className={`group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-3`}>
    <div className={`${iconBg} w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight">{title}</h3>
    <p className="text-lg text-slate-500 leading-relaxed font-medium">{description}</p>
  </div>
);

export default Landing;
