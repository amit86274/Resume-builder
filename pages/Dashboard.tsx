
import React, { useEffect, useState, useMemo } from 'react';
import { 
  FileText, Plus, Clock, BarChart3, 
  Settings, CreditCard, Zap, 
  Edit3, Trash2, Loader2, CheckCircle2, ShieldAlert,
  Search, Copy, MoreVertical, X, AlertTriangle, ArrowRight,
  Activity, History, Sparkles, User, BadgeCheck, ExternalLink,
  ChevronRight, Calendar
} from 'lucide-react';
import { User as UserType, ResumeData, Payment } from '../types';
import { MockAPI } from '../lib/api';

interface DashboardProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onUpdateUser: (user: UserType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showBilling, setShowBilling] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resumeData, paymentData] = await Promise.all([
        MockAPI.getResumes(user.id),
        MockAPI.getPayments(user.id)
      ]);
      setResumes(resumeData.sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()));
      setPayments(paymentData);
    } finally {
      setLoading(false);
    }
  };

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
          title: resumeData.personalInfo.fullName ? `${resumeData.personalInfo.fullName}'s Resume` : 'Imported Document',
          lastEdited: new Date().toISOString()
        });
        localStorage.removeItem('resumaster_pending_save');
        await loadData();
      } catch (e) {
        console.error("Dashboard: Error saving pending resume", e);
      }
    }
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await MockAPI.deleteResume(user.id, deletingId);
      setDeletingId(null);
      await loadData();
    }
  };

  const handleDuplicate = async (resume: any) => {
    setLoading(true);
    try {
      const { _id, id, ...rest } = resume;
      await MockAPI.saveResume(user.id, {
        ...rest,
        title: `${resume.title} (Copy)`,
        lastEdited: new Date().toISOString()
      });
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (renamingId && newTitle.trim()) {
      setLoading(true);
      try {
        const resume = resumes.find(r => (r._id || r.id) === renamingId);
        if (resume) {
          await MockAPI.saveResume(user.id, { ...resume, title: newTitle.trim() });
          setRenamingId(null);
          setNewTitle('');
          await loadData();
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredResumes = useMemo(() => {
    return resumes.filter(r => 
      (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.personalInfo?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resumes, searchQuery]);

  const handleEditResume = (resume: any) => {
    localStorage.setItem('resumaster_current_draft', JSON.stringify(resume));
    onNavigate(`builder?id=${resume._id || resume.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-inter">
      {/* MODALS */}
      {deletingId && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6"><AlertTriangle className="w-8 h-8" /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Wipe Document?</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">This action permanently removes the resume from Cluster0 and stops all neural tracking.</p>
            <div className="flex space-x-4">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {renamingId && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Rename Project</h3>
            <input autoFocus className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-black font-bold mb-8" value={newTitle} placeholder="Resume Title" onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()} />
            <div className="flex space-x-4">
              <button onClick={() => { setRenamingId(null); setNewTitle(''); }} className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest">Cancel</button>
              <button onClick={handleRename} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">Rename</button>
            </div>
          </div>
        </div>
      )}

      {/* BILLING HISTORY MODAL */}
      {showBilling && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Transaction History</h3>
              <button onClick={() => setShowBilling(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {payments.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-medium italic">No payments found in Cluster0.</div>
              ) : payments.map(p => (
                <div key={p._id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 uppercase tracking-tight">{p.plan} Subscription</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">₹{p.amount}</p>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Captured</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => setShowBilling(false)} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Close Record</button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row max-w-8xl mx-auto w-full px-6 py-12 gap-12">
        {/* LEFT PANE: RESUME MANAGEMENT */}
        <div className="flex-1 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Professional Console</h1>
              <p className="text-slate-400 font-medium mt-1">Directly managing {resumes.length} identity nodes on Atlas.</p>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" placeholder="Filter Documents..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <button onClick={() => onNavigate('templates')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-blue-600 transition-all shadow-xl active:scale-95 shrink-0">
                <Plus className="w-4 h-4 mr-2" /> New Design
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Synchronizing with Cluster0...</p>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="bg-white p-24 rounded-[4rem] text-center border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-6">
               <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center"><FileText className="w-10 h-10" /></div>
               <div className="space-y-1">
                 <h3 className="text-xl font-black text-slate-900">Workspace Empty</h3>
                 <p className="text-slate-400 font-medium">Create your first professional node to see it here.</p>
               </div>
               <button onClick={() => onNavigate('templates')} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Pick a Template</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredResumes.map((resume) => (
                <div key={resume._id || resume.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative border-b-[6px] border-b-white hover:border-b-blue-600">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-lg tracking-tight line-clamp-1">{resume.title || 'Untitled Project'}</h3>
                        <div className="flex items-center mt-1 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5 mr-1.5" /> 
                          {new Date(resume.lastEdited).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="relative group/menu">
                      <button className="p-2.5 text-slate-300 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all"><MoreVertical className="w-5 h-5" /></button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all translate-y-2 group-hover/menu:translate-y-0 z-20">
                         <button onClick={() => { setRenamingId(resume._id || resume.id); setNewTitle(resume.title); }} className="w-full flex items-center px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold text-xs uppercase tracking-widest"><Edit3 className="w-4 h-4 mr-3" /> Rename</button>
                         <button onClick={() => handleDuplicate(resume)} className="w-full flex items-center px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold text-xs uppercase tracking-widest"><Copy className="w-4 h-4 mr-3" /> Duplicate</button>
                         <div className="h-px bg-slate-50 my-2" />
                         <button onClick={() => setDeletingId(resume._id || resume.id)} className="w-full flex items-center px-5 py-3 text-red-400 hover:bg-red-50 hover:text-red-500 font-bold text-xs uppercase tracking-widest"><Trash2 className="w-4 h-4 mr-3" /> Delete</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <button onClick={() => handleEditResume(resume)} className="flex items-center space-x-2 text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] group/btn">
                      <span>Neural Edit</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                    </button>
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">AI</div>
                      <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-blue-600">PDF</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANE: PROFILE & PLAN */}
        <div className="lg:w-96 space-y-10">
          {/* PROFILE CARD */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
             <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20">
                   {user.name.charAt(0)}
                </div>
                <div className="space-y-1">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h2>
                   <div className="flex items-center space-x-1">
                     <p className="text-slate-400 font-medium text-xs truncate max-w-[140px]">{user.email}</p>
                     {user.role === 'admin' && <ShieldAlert className="w-3 h-3 text-purple-500" />}
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-3xl space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Plan</p>
                   <p className="text-sm font-black text-slate-900 flex items-center uppercase">{user.plan} <BadgeCheck className="w-3.5 h-3.5 ml-1 text-blue-600" /></p>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saved Resumes</p>
                   <p className="text-sm font-black text-slate-900">{resumes.length} / {user.plan === 'free' ? '3' : '∞'}</p>
                </div>
             </div>

             <div className="pt-4 space-y-3">
               <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                 <div className="flex items-center space-x-3">
                    <Settings className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">Account Configuration</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-200" />
               </button>
               <button onClick={() => setShowBilling(true)} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                 <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">Billing History</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-200" />
               </button>
             </div>
          </div>

          {/* PLAN UPGRADE CARD */}
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-8">
               <div className="space-y-3">
                 <div className="flex items-center space-x-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                   <Sparkles className="w-3.5 h-3.5" /> <span>India's AI Choice</span>
                 </div>
                 <h3 className="text-3xl font-black tracking-tight leading-tight">Neural Optimization</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">Unlock multi-page PDF rendering and unlimited ATS scans.</p>
               </div>

               {user.plan === 'free' ? (
                 <div className="space-y-6">
                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(100, (resumes.length / 3) * 100)}%` }} />
                   </div>
                   <button onClick={() => onNavigate('pricing')} className="w-full bg-white text-slate-900 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl shadow-blue-500/10 active:scale-95">
                     Go Pro — ₹195
                   </button>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center space-x-4">
                        <BadgeCheck className="w-6 h-6 text-blue-500" />
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-white/50">Renews on</span>
                            <span className="text-sm font-bold text-white">{user.subscription?.currentPeriodEnd ? new Date(user.subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-500 font-bold italic">Premium neural tracking active.</p>
                 </div>
               )}
            </div>
          </div>

          {/* LOGS / HISTORY FEED */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-4 flex items-center">
              <History className="w-4 h-4 mr-2" /> Recent Cluster Activity
            </h3>
            <div className="space-y-4">
               {resumes.slice(0, 3).map((r, i) => (
                 <div key={i} className="flex items-center space-x-4 px-6 py-4 bg-white border border-slate-100 rounded-2xl group cursor-pointer hover:border-blue-100 transition-all" onClick={() => handleEditResume(r)}>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                       <Activity className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                       <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{r.title}</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Modified {new Date(r.lastEdited).toLocaleDateString()}</p>
                    </div>
                 </div>
               ))}
               {resumes.length === 0 && (
                 <p className="text-xs font-bold text-slate-300 text-center py-6 italic">No activity logs found.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
