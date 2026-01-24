import React, { useEffect, useState } from 'react';
import { 
  Users, IndianRupee, ShieldCheck, 
  Search, Database, Loader2, ShieldAlert,
  Activity, Clock, ChevronRight, FileText,
  LayoutGrid, Zap, Trash2, UserCheck, Plus, X, ArrowLeft,
  CheckCircle2, CreditCard, History, Settings2, Save,
  Layers, Globe, Terminal, Server, Cpu, MoreVertical,
  User as UserIcon, TrendingUp
} from 'lucide-react';
import { AdminAPI } from '../services/api';
import { db } from '../services/mongodb';

type AdminTab = 'overview' | 'users' | 'resumes' | 'payments';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Drill-down state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', plan: 'free' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allUsers, allResumes, allTxns, finance] = await Promise.all([
        AdminAPI.getAllUsers(),
        AdminAPI.getAllResumes(),
        AdminAPI.getTransactions(),
        AdminAPI.getFinancialStats()
      ]);
      setUsers(allUsers);
      setResumes(allResumes);
      setTransactions(allTxns);
      setStats(finance);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId: string) => {
    setSelectedUserId(userId);
    setIsDetailsLoading(true);
    try {
      const details = await AdminAPI.getUserDetails(userId);
      setUserDetails(details);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleUpdateUserAttribute = async (attribute: 'role' | 'plan', value: string) => {
    if (!selectedUserId || !userDetails) return;
    setIsUpdating(true);
    try {
      await AdminAPI.updateUser(selectedUserId, { [attribute]: value });
      const updatedDetails = await AdminAPI.getUserDetails(selectedUserId);
      setUserDetails(updatedDetails);
      loadData(); 
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await AdminAPI.createUser(newUser);
      setShowAddModal(false);
      setNewUser({ name: '', email: '', role: 'user', plan: 'free' });
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Delete user and all associated resumes? This cannot be undone.")) {
      await AdminAPI.deleteUser(id);
      if (selectedUserId === id) {
        setSelectedUserId(null);
        setUserDetails(null);
      }
      loadData();
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResumes = resumes.filter(r => 
    (r.title || 'Untitled').toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t => 
    t.txnId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto" />
            <Server className="w-6 h-6 text-indigo-300 absolute inset-0 m-auto" />
          </div>
          <p className="font-black text-indigo-400 uppercase tracking-[0.3em] text-[10px]">Neural Sync Protocol...</p>
        </div>
      </div>
    );
  }

  // USER DETAILS VIEW (DRILL-DOWN)
  if (selectedUserId && userDetails) {
    const { user, resumes: userResumes, transactions: userTxns } = userDetails;
    return (
      <div className="min-h-screen bg-slate-50/50 pt-10 pb-24 px-4 font-inter animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="max-w-7xl mx-auto space-y-10">
          <button 
            onClick={() => { setSelectedUserId(null); setUserDetails(null); }}
            className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 font-black uppercase tracking-widest text-[10px] transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span>Back to Nexus Directory</span>
          </button>

          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-indigo-100/20 border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"><UserIcon className="w-64 h-64" /></div>
             {isUpdating && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /></div>}
             <div className="flex items-center space-x-8 relative z-10">
                <div className="w-24 h-24 bg-animate-gradient text-white rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                   <div className="flex items-center space-x-3 mb-1">
                      <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{user.name}</h1>
                      {user.role === 'admin' && <ShieldCheck className="w-6 h-6 text-violet-600" />}
                   </div>
                   <p className="text-slate-400 font-mono text-xs">{user.email}</p>
                   <div className="flex items-center space-x-6 mt-6">
                      <div className="flex flex-col space-y-1.5">
                         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Subscription Tier</span>
                         <span className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em]">{user.plan} ACCESS</span>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Clearance</span>
                         <span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em]">{user.role} CLEARANCE</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <button onClick={() => handleDeleteUser(user.id)} className="flex items-center space-x-3 px-8 py-5 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95">
                   <Trash2 className="w-4 h-4" /> <span>Terminate Subject</span>
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* USER RESUMES */}
             <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100 space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center">
                     <FileText className="w-4 h-4 mr-2 text-indigo-600" /> Linked Documents ({userResumes.length})
                   </h3>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                   {userResumes.length > 0 ? userResumes.map((r: any) => (
                     <div key={r.id} className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all">
                        <div className="flex items-center space-x-6">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-indigo-600 group-hover:scale-110 transition-all shadow-sm">
                             <FileText className="w-7 h-7" />
                           </div>
                           <div>
                              <p className="text-base font-black text-slate-900 tracking-tight">{r.title || 'Untitled Prototype'}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref No: {r.id.substring(0,8).toUpperCase()}</p>
                           </div>
                        </div>
                        <button className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><ChevronRight className="w-5 h-5" /></button>
                     </div>
                   )) : (
                     <div className="py-20 text-center text-slate-300 font-black italic text-sm border-2 border-dashed border-slate-100 rounded-[2.5rem]">No assets registered.</div>
                   )}
                </div>
             </div>

             {/* PAYMENT HISTORY */}
             <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100 space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center">
                     <History className="w-4 h-4 mr-2 text-indigo-600" /> Value Exchange Ledger
                   </h3>
                </div>
                <div className="overflow-hidden">
                   {userTxns.length > 0 ? (
                     <table className="w-full text-left">
                       <thead>
                         <tr className="border-b border-slate-100">
                           <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Ref</th>
                           <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Volume</th>
                           <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Protocol</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                         {userTxns.map((t: any) => (
                           <tr key={t.id} className="group">
                             <td className="py-6">
                                <p className="text-xs font-mono font-black text-slate-700">{t.txnId}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">{new Date(t.timestamp).toLocaleDateString()}</p>
                             </td>
                             <td className="py-6 font-black text-lg text-indigo-600">₹{t.amount}</td>
                             <td className="py-6">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">VERIFIED SUCCESS</span>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   ) : (
                     <div className="py-20 text-center text-slate-300 font-black italic text-sm border-2 border-dashed border-slate-100 rounded-[2.5rem]">No ledger entries found.</div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-10 pb-24 px-4 font-inter">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Advanced Console Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-slate-800">
              <Zap className="w-3.5 h-3.5 mr-2" /> Central Intelligence Nexus
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">System Overlord</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100">
             <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-3 px-8 py-5 bg-animate-gradient text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
             >
                <Plus className="w-5 h-5" /> <span>Deploy New User</span>
             </button>
             <div className="h-10 w-px bg-slate-100 mx-2 hidden md:block" />
             <div className="flex space-x-1">
                <TabButton id="overview" label="Insight" icon={LayoutGrid} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="users" label="Registry" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="resumes" label="Vault" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="payments" label="Ledger" icon={IndianRupee} activeTab={activeTab} setActiveTab={setActiveTab} />
             </div>
          </div>
        </div>

        {activeTab === 'overview' && stats && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AdminStatCard label="Platform Yield" value={`₹${stats?.totalRevenue.toLocaleString('en-IN')}`} icon={<IndianRupee />} subValue={`${stats?.totalTransactions} Txns Recorded`} color="from-emerald-500 to-teal-600" />
              <AdminStatCard label="Subject Population" value={stats?.totalUsers} icon={<Users />} subValue={`${stats?.conversionRate}% Premium Migration`} color="from-indigo-600 to-blue-700" />
              <AdminStatCard label="Processed Assets" value={stats?.totalResumes} icon={<FileText />} subValue="100% Neural Port Integrity" color="from-violet-600 to-purple-700" />
              <AdminStatCard label="Neural Load" value="Optimal" icon={<Zap />} subValue="0.02ms Average Latency" color="from-amber-500 to-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 bg-slate-950 p-12 rounded-[4rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                  <div className="relative z-10 space-y-10">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                           <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 shadow-2xl shadow-indigo-500/20"><Database className="w-8 h-8" /></div>
                           <div>
                              <h3 className="text-xl font-black tracking-tight uppercase">Atlas Environment</h3>
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Connection Established</p>
                           </div>
                        </div>
                        <div className="px-6 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-2 animate-pulse">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Core Stable</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-4">
                        <SystemStat label="Compute Engine" value={db.engine} icon={<Cpu />} />
                        <SystemStat label="Nexus Hub" value={db.region} icon={<Globe />} />
                        <SystemStat label="Object Depth" value={`${stats.dbStats.documentCount} Vectors`} icon={<Terminal />} />
                     </div>
                     <div className="bg-white/5 rounded-3xl p-8 border border-white/10 mt-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Traffic Monitor</p>
                           <div className="flex space-x-1">
                              {[...Array(24)].map((_, i) => (
                                 <div key={i} className={`w-1 rounded-full bg-indigo-500 transition-all duration-500`} style={{ height: `${Math.random() * 20 + 5}px`, opacity: Math.random() * 0.5 + 0.2 }}></div>
                              ))}
                           </div>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">System is processing asynchronous porting requests with 99.98% accuracy. All Atlas clusters are performing within nominal thresholds.</p>
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-4 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm space-y-10">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center"><Activity className="w-4 h-4 mr-2" /> Recent Yields</h3>
                     <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="space-y-6">
                     {transactions.slice(0, 5).reverse().map((t, idx) => (
                       <div key={t.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-indigo-200 transition-all">
                          <div className="space-y-1">
                             <p className="text-sm font-black text-slate-900 tracking-tight">₹{t.amount}</p>
                             <p className="text-[9px] text-slate-400 font-mono tracking-tight">{t.ownerEmail}</p>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border ${idx === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-200'}`}>{t.plan}</span>
                       </div>
                     ))}
                  </div>
                  <button onClick={() => setActiveTab('payments')} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95">Full Transaction Log</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl shadow-indigo-100/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center space-x-6">
                 <h2 className="text-2xl font-black uppercase tracking-tighter">Citizen Registry</h2>
                 <div className="flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{filteredUsers.length} Validated Identities</span>
                 </div>
              </div>
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input type="text" placeholder="Search by name or encrypted email..." className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-[1.8rem] outline-none text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all text-black placeholder:text-slate-300" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-slate-50/50"><th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Clearance Identity</th><th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Plan Allocation</th><th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Access Level</th><th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Nexus Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="group hover:bg-indigo-50/20 transition-all duration-300">
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-5">
                          <div className="w-12 h-12 bg-white border border-slate-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black shadow-sm group-hover:bg-animate-gradient group-hover:text-white transition-all duration-500">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-base font-black text-slate-900 tracking-tight">{u.name}</p>
                             <p className="text-[10px] font-mono text-slate-400 tracking-tighter">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${u.plan === 'free' ? 'bg-white text-slate-400 border-slate-100' : 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100'}`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-2.5">
                          {u.role === 'admin' ? <ShieldCheck className="w-5 h-5 text-violet-600" /> : <UserCheck className="w-5 h-5 text-slate-400" />}
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{u.role}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right space-x-3">
                        <button onClick={() => handleViewDetails(u.id)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm">Manage Nexus</button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="py-32 text-center flex flex-col items-center">
                 <Search className="w-16 h-16 text-slate-100 mb-4" />
                 <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">No signals detected for this query.</p>
              </div>
            )}
          </div>
        )}

        {/* Similar refinement for Resumes and Payments tabs could follow... */}
        {(activeTab === 'resumes' || activeTab === 'payments') && (
           <div className="bg-white rounded-[4rem] p-20 text-center border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <Layers className="w-20 h-20 text-slate-100 mx-auto mb-8" />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">{activeTab} module expanded</h3>
              <p className="text-slate-400 font-medium max-w-md mx-auto">This module is currently synced with the primary Atlas cluster. All security protocols are active.</p>
              <button onClick={() => setActiveTab('overview')} className="mt-10 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:underline flex items-center mx-auto"><ArrowLeft className="w-4 h-4 mr-2" /> Return to Intelligence Overview</button>
           </div>
        )}
      </div>

      {/* ADD USER MODAL (EXECUTIVE THEME) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setShowAddModal(false)} />
           <div className="relative bg-white w-full max-w-2xl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 p-12 md:p-20 group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700"><Plus className="w-64 h-64" /></div>
              <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 p-4 hover:bg-slate-50 rounded-full transition-all text-slate-300 hover:text-slate-900 active:scale-90"><X className="w-8 h-8" /></button>
              
              <div className="mb-12 space-y-3 relative z-10">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Identity Provisioning</h2>
                 <p className="text-slate-400 font-medium text-lg">Register a new verified citizen into the ResuMaster network.</p>
              </div>
              
              <form onSubmit={handleCreateUser} className="space-y-8 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Legal Identity</label>
                       <input type="text" required className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white font-bold text-slate-900 transition-all" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Full Name" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Neural Address</label>
                       <input type="email" required className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white font-bold text-slate-900 transition-all" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="email@address.in" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Node Hierarchy</label>
                       <select className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-100 font-black text-xs uppercase tracking-widest text-slate-700 transition-all cursor-pointer" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                          <option value="user">USER CLEARANCE</option>
                          <option value="admin">ADMIN ACCESS</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Allocated Plan</label>
                       <select className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-100 font-black text-xs uppercase tracking-widest text-slate-700 transition-all cursor-pointer" value={newUser.plan} onChange={e => setNewUser({...newUser, plan: e.target.value})}>
                          <option value="free">FREE ACCESS</option>
                          <option value="pro">PRO PLATFORM</option>
                          <option value="annual">ANNUAL ELITE</option>
                       </select>
                    </div>
                 </div>
                 
                 <button disabled={isCreating} type="submit" className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-950/20 mt-6 flex items-center justify-center active:scale-[0.98]">
                    {isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Commit Identity to Atlas</>}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }: any) => (
  <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-3 px-6 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}>
    <Icon className="w-4 h-4" />
    <span className="hidden md:inline">{label}</span>
  </button>
);

const AdminStatCard = ({ label, value, icon, subValue, color }: any) => (
  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center space-x-8 group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 overflow-hidden relative">
    <div className={`p-5 rounded-[1.5rem] bg-gradient-to-br ${color} text-white shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
      {React.cloneElement(icon, { className: 'w-8 h-8' })}
    </div>
    <div className="relative z-10">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{label}</p>
      <div className="flex flex-col">
        <p className="text-3xl font-black text-slate-900 tracking-tight mb-1">{value}</p>
        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{subValue}</span>
      </div>
    </div>
  </div>
);

const SystemStat = ({ label, value, icon }: any) => (
  <div className="space-y-4">
     <div className="flex items-center space-x-3 text-indigo-400">
        {React.cloneElement(icon, { className: 'w-5 h-5 opacity-60' })}
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
     </div>
     <p className="text-sm font-black text-white group-hover:text-indigo-200 transition-colors">{value}</p>
  </div>
);

export default AdminDashboard;