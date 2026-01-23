import React, { useEffect, useState } from 'react';
import { 
  FileText, Plus, Clock, BarChart3, 
  Settings, CreditCard, Zap, 
  Edit3, Trash2, Loader2, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { User } from '../types';
import { MockAPI } from '../services/api';
import { safeStorage } from '../services/mongodb';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onUpdateUser: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    loadData();
    handlePendingSave();
  }, [user.id]);

  const handlePendingSave = async () => {
    const pending = safeStorage.getItem('resumaster_pending_save');
    if (pending) {
      try {
        const resumeData = JSON.parse(pending);
        await MockAPI.saveResume(user.id, {
          ...resumeData,
          userId: user.id,
          title: resumeData.personalInfo.fullName ? `${resumeData.personalInfo.fullName}'s Resume` : 'Imported Resume',
          lastEdited: new Date().toISOString()
        });
        safeStorage.removeItem('resumaster_pending_save');
        safeStorage.removeItem('resumaster_current_draft'); // Clear guest draft
        await loadData(); // Refresh list to show the new item
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

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    try {
      const updated = await MockAPI.processPayment(user.id, planId);
      onUpdateUser(updated);
      alert("Payment Successful! Welcome to ResuMaster Pro.");
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this resume permanently?")) {
      await MockAPI.deleteResume(user.id, id);
      await loadData();
    }
  };

  const handleEditResume = (resume: any) => {
    // Store in draft key so builder can pick it up
    safeStorage.setItem('resumaster_current_draft', JSON.stringify(resume));
    onNavigate(`builder?id=${resume.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-12 pb-24 px-4">
      {isUpgrading && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6">
          <div className="bg-white p-12 rounded-[3rem] text-slate-900 text-center max-w-sm w-full animate-in zoom-in">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
             </div>
             <h3 className="text-2xl font-black mb-2">Processing Payment</h3>
             <p className="text-slate-500 font-medium mb-8">Securely connecting to Gateway...</p>
             <div className="flex items-center justify-center space-x-2 grayscale opacity-40">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Secure</span>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900">Hi, {user.name.split(' ')[0]}!</h1>
            <p className="text-slate-500 font-medium">Manage your professional documents and AI analysis here.</p>
          </div>
          <button onClick={() => { safeStorage.removeItem('resumaster_current_draft'); onNavigate('builder'); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center hover:bg-blue-600 transition-all shadow-xl">
            <Plus className="w-5 h-5 mr-2" /> New Resume
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <StatCard icon={<FileText />} label="Resumes" value={resumes.length.toString()} />
           <StatCard icon={<BarChart3 />} label="ATS Match" value="Active" />
           <StatCard icon={<Zap />} label="Status" value={user.plan.toUpperCase()} color="text-blue-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tighter">My Documents</h2>
              {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-slate-300" /></div>
              ) : resumes.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No documents yet. Click 'New Resume' to start.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resumes.map(r => (
                    <div key={r.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col hover:shadow-xl transition-all group relative">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 line-clamp-1">{r.title || 'Untitled'}</h3>
                          <p className="text-[10px] text-slate-400 flex items-center mt-1 uppercase tracking-widest font-black">
                            <Clock className="w-3 h-3 mr-1" /> {new Date(r.lastEdited).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-auto">
                        <button 
                          onClick={() => handleEditResume(r)} 
                          className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(r.id)} 
                          className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>

           <div className="lg:col-span-4 space-y-8">
              {user.plan === 'free' && (
                <div className="bg-animate-gradient p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-black leading-tight">Unlock AI Executive Power</h3>
                    <p className="text-blue-100 text-sm font-medium">Land interviews 3x faster with premium templates and deep ATS scans.</p>
                    <button onClick={() => handleUpgrade('pro')} className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                      Go Pro (₹195)
                    </button>
                  </div>
                </div>
              )}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Settings</h3>
                <div className="space-y-2">
                  <SettingItem icon={<Settings />} label="Account Settings" />
                  <SettingItem icon={<CreditCard />} label="Billing & Plan" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color = "text-slate-900" }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center space-x-6">
    <div className="p-4 bg-slate-50 text-slate-900 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

const SettingItem = ({ icon, label }: any) => (
  <button className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm">
    <span className="text-slate-400">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Dashboard;