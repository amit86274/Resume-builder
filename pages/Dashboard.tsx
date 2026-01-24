import React, { useEffect, useState } from 'react';
import { 
  FileText, Plus, Clock, BarChart3, 
  Settings, CreditCard, Zap, 
  Edit3, Trash2, Loader2, CheckCircle2, 
  ShieldCheck, ChevronRight, Sparkles,
  Trophy, Target, Briefcase, User as UserIcon,
  Search, Filter, MoreHorizontal, LayoutGrid, List,
  AlertCircle, TrendingUp, Download, Eye
} from 'lucide-react';
import { User, ResumeData } from '../types';
import { MockAPI } from '../services/api';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onUpdateUser: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadData();
    handlePendingSave();
  }, [user.id]);

  const handlePendingSave = async () => {
    const pending = localStorage.getItem('resumaster_pending_save');
    if (pending) {
      try {
        const resumeData = JSON.parse(pending);
        await MockAPI.saveResume(user.id, {
          ...resumeData,
          userId: user.id,
          title: resumeData.personalInfo.fullName ? `${resumeData.personalInfo.fullName}'s Resume` : 'Imported Resume',
          lastEdited: new Date().toISOString()
        });
        localStorage.removeItem('resumaster_pending_save');
        localStorage.removeItem('resumaster_current_draft'); 
        await loadData();
      } catch (e) {
        console.error("Error saving pending resume", e);
      }
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await MockAPI.getResumes(user.id);
      setResumes(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (planId: string) => {
    const amount = planId === 'pro' ? 195 : 1195;
    
    if (!(window as any).Razorpay) {
      alert("Razorpay payment gateway is not available. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_YourKeyHere", 
      amount: amount * 100, 
      currency: "INR",
      name: "ResuMaster AI",
      description: `Upgrade to ${planId.toUpperCase()} Plan`,
      image: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
      handler: async function (response: any) {
        setIsUpgrading(true);
        try {
          const updatedUser = await MockAPI.processPayment(user.id, planId, response);
          onUpdateUser(updatedUser);
        } catch (err) {
          alert("Payment verification failed. Please contact support.");
        } finally {
          setIsUpgrading(false);
        }
      },
      prefill: {
        name: user.name,
        email: user.email
      },
      theme: {
        color: "#2563eb"
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this resume permanently?")) {
      await MockAPI.deleteResume(user.id, id);
      await loadData();
    }
  };

  const handleEditResume = (resume: any) => {
    localStorage.setItem('resumaster_current_draft', JSON.stringify(resume));
    onNavigate(`builder?id=${resume.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-inter">
      {isUpgrading && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6">
          <div className="bg-white p-12 rounded-[3rem] text-slate-900 text-center max-w-sm w-full animate-in zoom-in shadow-2xl">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
             </div>
             <h3 className="text-2xl font-black mb-2 tracking-tight">Syncing Payment</h3>
             <p className="text-slate-500 font-medium mb-8">Upgrading your account to Pro...</p>
          </div>
        </div>
      )}

      {/* Modern Dashboard Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Welcome, {user.name.split(' ')[0]}!
                </h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center ${user.plan === 'pro' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                  {user.plan === 'pro' && <Zap className="w-3 h-3 mr-1" />}
                  {user.plan} account
                </span>
              </div>
              <p className="text-slate-400 font-medium max-w-xl">
                You have {resumes.length} active resumes. Let's get you that dream interview at {user.plan === 'pro' ? 'Google, Meta or TCS.' : 'top Indian firms.'}
              </p>
            </div>
            <button 
              onClick={() => { localStorage.removeItem('resumaster_current_draft'); onNavigate('builder'); }} 
              className="group relative inline-flex items-center px-8 py-4 bg-animate-gradient text-white rounded-2xl font-black shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-[0.1em] text-xs"
            >
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" /> 
              Create New Resume
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center space-x-6 group hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Average Score</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-slate-900">84/100</span>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                      <TrendingUp className="w-2.5 h-2.5 mr-1" /> Top 10%
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center space-x-6 group hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ATS Compatibility</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-slate-900">Verified</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Section Header */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Your Documents</h2>
                <div className="flex bg-white rounded-xl p-1 border border-slate-200">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" placeholder="Filter resumes..." className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-black" />
                </div>
              </div>
            </div>

            {/* Resume List/Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Vault...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="bg-white p-20 rounded-[3.5rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center group cursor-pointer hover:bg-white/80 transition-all" onClick={() => onNavigate('templates')}>
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:scale-110 group-hover:text-indigo-200 transition-all duration-500 mb-8">
                  <FileText className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No resumes found</h3>
                <p className="text-slate-400 font-medium max-w-sm mb-10">Start your career upgrade by choosing a professional template.</p>
                <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Get Started</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                {resumes.map(r => (
                  <ResumeCard 
                    key={r.id} 
                    resume={r} 
                    viewMode={viewMode}
                    onEdit={() => handleEditResume(r)}
                    onDelete={() => handleDelete(r.id)}
                    onPreview={() => {
                      localStorage.setItem('resumaster_current_draft', JSON.stringify(r));
                      onNavigate(`builder?id=${r.id}&step=finalize`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar Sidebar (Upsells & Career Hub) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Upgrade Banner (Zety Style) */}
            {user.plan === 'free' && (
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Trophy className="w-48 h-48 rotate-12" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Go Premium</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tighter leading-tight">Land interviews 3x faster with Pro.</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">Unlock unlimited AI rewrites, premium PDF formats, and deep ATS analysis.</p>
                  </div>
                  <div className="space-y-4">
                    <button onClick={() => handleUpgrade('pro')} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-100 active:scale-95 transition-all">Upgrade for ₹195</button>
                    <p className="text-[9px] text-center font-black uppercase tracking-widest text-slate-600">Exclusive 14-day full access offer</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Career Insights */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-600" /> Career Catalyst
                </h3>
              </div>
              <div className="space-y-6">
                <InsightItem 
                  title="Improve Skill Density" 
                  desc="Adding 'Node.js' to your skills could increase search visibility by 24% for current job market." 
                  icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
                />
                <InsightItem 
                  title="Portfolio Link Missing" 
                  desc="Profiles with portfolio links receive 65% more engagement from recruiters." 
                  icon={<Target className="w-4 h-4 text-blue-500" />}
                />
                <InsightItem 
                  title="High Impact Verbs" 
                  desc="Excellent use of action verbs in your experience section. ATS score is above average." 
                  icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                />
              </div>
              <div className="pt-4">
                <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all">Explore Career Hub</button>
              </div>
            </div>

            {/* Quick Actions / Links */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </h3>
              <div className="space-y-2">
                <SidebarAction icon={<UserIcon className="w-4 h-4" />} label="Edit Profile" />
                <SidebarAction icon={<CreditCard className="w-4 h-4" />} label="Billing & Plan" />
                <SidebarAction icon={<Briefcase className="w-4 h-4" />} label="Job Preferences" badge="New" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeCard = ({ resume, onEdit, onDelete, onPreview, viewMode }: any) => {
  const isList = viewMode === 'list';
  
  if (isList) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{resume.title || 'Untitled'}</h3>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Last Edited {new Date(resume.lastEdited).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onEdit} className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit"><Edit3 className="w-4 h-4" /></button>
          <button onClick={onPreview} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Preview"><Eye className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-200 flex flex-col hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 group relative">
      <div className="flex justify-between items-start mb-10">
        <div className="w-16 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500 relative">
          <FileText className="w-10 h-10" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-in zoom-in">
             <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
           <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">84 Score</div>
           <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">A4 Layout</p>
        </div>
      </div>
      
      <div className="space-y-1 mb-10 flex-1">
        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{resume.title || 'Untitled Resume'}</h3>
        <p className="text-xs text-slate-400 font-medium">India Professional • Standard Format</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button onClick={onEdit} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2">
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Draft</span>
        </button>
        <div className="flex space-x-2">
           <button onClick={onPreview} className="flex-1 py-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all flex items-center justify-center"><Eye className="w-4 h-4" /></button>
           <button onClick={onDelete} className="flex-1 py-4 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

const InsightItem = ({ icon, title, desc }: any) => (
  <div className="flex items-start space-x-4 group cursor-default">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-[11px] font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{title}</p>
      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{desc}</p>
    </div>
  </div>
);

const SidebarAction = ({ icon, label, badge }: any) => (
  <button className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-all group">
    <div className="flex items-center space-x-4">
      <span className="text-slate-300 group-hover:text-indigo-600 transition-colors">{icon}</span>
      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
    {badge ? (
      <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase rounded-full tracking-widest">{badge}</span>
    ) : (
      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
    )}
  </button>
);

export default Dashboard;