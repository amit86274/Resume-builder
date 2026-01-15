
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: "Plans & Pricing",
    questions: [
      {
        q: "Is ResuMaster AI actually free?",
        a: "Yes! You can use our resume and cover letter builder, all free templates, and download your resume in TXT format without paying anything. Premium templates and PDF/DOCX exports require a Pro subscription."
      },
      {
        q: "What is the 14-day Pro trial?",
        a: "Our trial allows you full access to all premium features for 14 days for just ₹195. If you don't cancel, you'll be automatically enrolled in our 4-week subscription for ₹445."
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Absolutely. You can cancel your subscription from your dashboard settings with just one click. You will retain access to Pro features until the end of your current billing period."
      }
    ]
  },
  {
    category: "Downloads & Formats",
    questions: [
      {
        q: "What file formats do you support?",
        a: "Free users can download in TXT format. Pro users get access to high-quality PDF and DOCX formats which are optimized for ATS compatibility."
      },
      {
        q: "Will my resume be ATS-friendly?",
        a: "Yes. All our templates (both free and premium) are human-designed and tested against major ATS software like Workday and Lever to ensure your resume gets through."
      }
    ]
  },
  {
    category: "AI Features",
    questions: [
      {
        q: "How does the AI Resume Analyzer work?",
        a: "Our AI scans your content for keywords, formatting errors, and missing sections. It compares your resume against industry standards and gives you a score out of 100 with actionable tips."
      },
      {
        q: "Is there a limit on AI usage?",
        a: "Free users have a daily limit for AI-powered rewrites and analysis. Pro and Annual plan users have unlimited access to all AI features."
      }
    ]
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggle = (idx: string) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Everything you need to know about ResuMaster AI.</p>
        </div>

        <div className="space-y-12">
          {faqData.map((category, catIdx) => (
            <div key={catIdx}>
              <h2 className="text-xl font-bold text-blue-600 uppercase tracking-wider mb-6 pb-2 border-b border-gray-100">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={id} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-blue-100'}`}>
                      <button 
                        onClick={() => toggle(id)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-bold text-gray-900">{item.q}</span>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed text-sm">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-gray-50 rounded-3xl text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Reach out to our team.</p>
          <button className="bg-white text-gray-900 px-6 py-2 border rounded-xl font-bold hover:bg-gray-100 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
