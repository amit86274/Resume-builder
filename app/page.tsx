
'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, Zap, FileCheck, ArrowRight, 
  Star, Quote, ChevronDown, Sparkles,
  Trophy, Users, MousePointer2, Globe, Cpu, Terminal, Layers
} from 'lucide-react';
import { useRouter } from '../services/router';

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

export default function HomePage() {
  const { push } = useRouter();

  const reviews = [
    { name: "Ananya Iyer", role: "Software Engineer at TCS", content: "ResuMaster helped me build a stunning resume in minutes. I got three interview calls within a week!", rating: 5, avatar: "https://i.pravatar.cc/150?u=ananya" },
    { name: "Vikram Malhotra", role: "Product Manager", content: "The templates are world-class. I love how easy it is to switch between designs without losing data.", rating: 5, avatar: "https://i.pravatar.cc/150?u=vikram" },
    { name: "Sneha Kapoor", role: "Recent Graduate", content: "The AI rewrite feature gave me professional bullet points that actually make sense. Great for freshers!", rating: 4, avatar: "https://i.pravatar.cc/150?u=sneha" },
    { name: "Rajesh Kumar", role: "Data Scientist", content: "The AI porting feature moved all my LinkedIn data into a professional template instantly.", rating: 5, avatar: "https://i.pravatar.cc/150?u=rajesh" }
  ];

  const faqs = [
    { question: "Is ResuMaster AI really free to use?", answer: "Yes! You can build, edit, and preview your resume completely for free. We offer free templates and free TXT downloads." },
    { question: "Will my resume be ATS-friendly?", answer: "Absolutely. All our templates are engineered to pass major ATS systems like Workday, Lever, and Greenhouse." },
    { question: "Is my data safe with ResuMaster AI?", answer: "Your privacy is our priority. We use industry-standard encryption to protect your personal information." }
  ];

  return (
    <div className="bg-white selection:bg-blue-100">
      <section className="relative pt-20 pb-28 lg:pt-32 lg:pb-48 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>India's #1 AI Resume Builder</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Build a Professional Resume <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">in Minutes</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 mb-12 font-medium leading-[1.8]">
            Stop fighting with margins. Let AI handle the heavy lifting while you focus on landing your dream job at top Indian companies.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-5">
            <button onClick={() => push('/templates')} className="group px-10 py-5 bg-animate-gradient text-white text-base font-black rounded-2xl transition-all shadow-xl hover:shadow-blue-500/20 flex items-center justify-center transform hover:scale-105 uppercase tracking-widest">
              Create My Resume <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button onClick={() => push('/auth?mode=login')} className="px-10 py-5 bg-white text-slate-900 text-base font-black border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm uppercase tracking-widest">
              Sign In
            </button>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<Zap />} iconBg="bg-blue-600" title="AI Content Engine" tag="Module 01" description="Instantly transform basic notes into powerful professional bullets using Gemini 3." delay="0" />
          <FeatureCard icon={<FileCheck />} iconBg="bg-indigo-600" title="Smart AI Porting" tag="Module 02" description="Move your existing resume into a professional template in seconds. 99% accuracy." delay="150" />
          <FeatureCard icon={<MousePointer2 />} iconBg="bg-slate-900" title="Intuitive Canvas" tag="Module 03" description="Customize your layout without formatting headaches. Everything snaps to a grid." delay="300" />
        </div>
      </section>

      <section className="py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-20">Real Results. <span className="text-blue-400">Real People.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 text-left">
                <div className="flex mb-6 text-amber-400"><Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /></div>
                <p className="text-slate-300 font-medium italic mb-8">"{review.content}"</p>
                <div className="flex items-center">
                  <img src={review.avatar} className="w-10 h-10 rounded-xl mr-4" alt={review.name} />
                  <div><h4 className="font-bold text-sm">{review.name}</h4><p className="text-[10px] text-blue-400 uppercase font-black">{review.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-black text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => <FAQItem key={i} question={faq.question} answer={faq.answer} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
