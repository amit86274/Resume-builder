import React from 'react';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';

interface BlogProps {
  onNavigate: (page: string) => void;
}

const articles = [
  {
    title: "How to Pass the 6-Second Resume Test",
    excerpt: "Recruiters spend an average of six seconds looking at a resume. Learn how to make yours count with these quick formatting tips.",
    category: "Resume Writing",
    author: "Arjun Mehta",
    date: "Oct 24, 2023",
    readTime: "5 min read",
    image: "http://c2fashionstudio.com/trendplatform/wp-content/themes/hello-theme-child/img/resume/resume1.jpeg"
  },
  {
    title: "The Ultimate Guide to ATS-Friendly Resumes",
    excerpt: "Is your resume getting stuck in a machine? Discover how Applicant Tracking Systems work and how to beat them with simple AI tools.",
    category: "Job Search",
    author: "Sia Sharma",
    date: "Oct 20, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "5 Common Interview Questions for Tech Roles",
    excerpt: "Preparing for a technical interview at a top Indian IT company? Here are the most common questions and how to answer them perfectly.",
    category: "Interviews",
    author: "Rahul Gupta",
    date: "Oct 15, 2023",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
  }
];

const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Career Advice & Tips</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Expert guidance to help you navigate the modern job market and land your next big role.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {articles.map((article, idx) => (
            <article key={idx} className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">{article.category}</span>
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm mb-6 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-xs text-gray-400 space-x-4 border-t pt-4">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" /> {article.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {article.readTime}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Funnel Section */}
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to put this advice into practice?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            Use our AI-powered builder to create a resume that recruiters actually want to read.
          </p>
          <button 
            onClick={() => onNavigate('builder')}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition"
          >
            Create My Resume <ArrowRight className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
