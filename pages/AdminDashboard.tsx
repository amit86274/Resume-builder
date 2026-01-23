import React, { useEffect, useState } from 'react';
import { 
  Users, IndianRupee, TrendingUp, ShieldCheck, 
  Search, Download, BarChart, ArrowUpRight, 
  Loader2, Lock, UserCheck, ShieldAlert, Database,
  Activity, HardDrive, Server, Globe, Cpu, Zap, Settings
} from 'lucide-react';
import { AdminAPI } from '../services/api';
import { db } from '../services/mongodb';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const allUsers = await AdminAPI.getAllUsers();
      const finance = await AdminAPI.getFinancialStats();
      setUsers(allUsers);
      setStats(finance);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
            <Database className="w-6 h-6 text-blue-400 absolute inset-0 m-auto" />
          </div>
          <div className="space-y-1">
            <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Connecting to MongoDB Atlas...</p>
            <p className="text-[10px] text-slate-400 font-mono">cluster0.uzvsg.mongodb.net</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-10 pb-24 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5 mr-2" /> Atlas Enterprise Panel
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">System Administration</h1>
            <p className="text-slate-500 font-medium">Real-time management for <span className="text-indigo-600 font-bold">resumebuilder</span> database.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={loadData} className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center">
               <Activity className={`w-4 h-4 mr-2 ${loading ? 'animate-pulse text-indigo-600' : ''}`} /> Refresh Cluster
             </button>
             <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10">
               Database Dump
             </button>
          </div>
        </div>

        {/* Financial Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard 
            label="Gross Revenue" 
            value={`₹${stats?.totalRevenue.toLocaleString('en-IN')}`} 
            icon={<IndianRupee />} 
            trend="+18% from last month"
            color="bg-green-500"
          />
          <AdminStatCard 
            label="Total Nodes" 
            value="3" 
            icon={<Cpu />} 
            trend="1 Primary, 2 Secondaries"
            color="bg-blue-500"
          />
          <AdminStatCard 
            label="Storage Used" 
            value="1.2 GB" 
            icon={<HardDrive />} 
            trend="Atlas M10 Dedicated"
            color="bg-purple-500"
          />
          <AdminStatCard 
            label="Active Connections" 
            value="124" 
            icon={<Zap />} 
            trend="Peak performance"
            color="bg-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* User List Table */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-3">
                 <h2 className="text-xl font-black uppercase tracking-tighter">Collections: users</h2>
                 <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-lg text-[10px] font-black">{stats?.totalUsers} Documents</span>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Query BSON ObjectIDs..." 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all text-black"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ObjectId / Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subscription</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black uppercase">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[10px] font-mono text-slate-400">ID: {u._id || u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          u.plan === 'free' ? 'bg-slate-100 text-slate-500' : 
                          u.plan === 'pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center space-x-2">
                           {u.role === 'admin' ? (
                             <ShieldCheck className="w-4 h-4 text-purple-600" />
                           ) : (
                             <UserCheck className="w-4 h-4 text-slate-400" />
                           )}
                           <span className={`text-[10px] font-black uppercase ${u.role === 'admin' ? 'text-purple-600' : 'text-slate-500'}`}>{u.role}</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
             <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                <div className="relative z-10 space-y-6">
                   <div className="flex justify-between items-center">
                      <div className="p-3 bg-indigo-600/20 rounded-2xl w-fit text-indigo-400"><Database className="w-6 h-6" /></div>
                      <div className="flex items-center space-x-2">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Atlas Live</span>
                      </div>
                   </div>
                   <h3 className="text-2xl font-black">Cluster0 Status</h3>
                   <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">Engine</span>
                        <span className="text-xs font-black text-indigo-400 uppercase">{db.engine}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">Primary Region</span>
                        <div className="flex items-center space-x-2">
                           <Globe className="w-3 h-3 text-slate-500" />
                           <span className="text-xs font-black text-white uppercase">{db.region}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">Total Documents</span>
                        <span className="text-xs font-black text-white">{stats?.dbStats.documentCount}</span>
                      </div>
                   </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Connection String (Masked)</p>
                  <code className="text-[10px] block bg-black/40 p-3 rounded-xl text-slate-400 break-all border border-white/5">
                    mongodb+srv://keyframe:****@cluster0.uzvsg.mongodb.net/
                  </code>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Database Tools</h3>
                <div className="space-y-2">
                   <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white group-hover:text-indigo-600 transition-all"><BarChart className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-slate-700">Profiler Metrics</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-300" />
                   </button>
                   <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white group-hover:text-indigo-600 transition-all"><Settings className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-slate-700">IP Whitelist</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-300" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({ label, value, icon, trend, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4 relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <div className={`p-4 ${color} text-white rounded-2xl shadow-lg shadow-${color.split('-')[1]}-200`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
    <div className="pt-4 flex items-center text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 border-t border-slate-50">
      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
      {trend}
    </div>
  </div>
);

export default AdminDashboard;