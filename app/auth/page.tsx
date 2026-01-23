
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Lock, ArrowRight, Chrome, 
  CheckCircle2, Sparkles, 
  Eye, EyeOff, Loader2, AlertCircle, ChevronLeft, User
} from 'lucide-react';
import { MockAPI } from '../../services/api';
import { useRouter, useSearchParams } from '../../services/router';
import { useUser } from '../../context/UserContext';

export default function AuthPage() {
  const { setUser } = useUser();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  
  const initialMode = (searchParams.get('mode') as 'login' | 'signup' | 'forgot') || 'login';
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResetSent, setIsResetSent] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading('email');
    setError(null);
    try {
      if (mode === 'forgot') {
        await MockAPI.forgotPassword(formData.email);
        setIsResetSent(true);
      } else {
        const user = mode === 'signup' 
          ? await MockAPI.signup(formData.name, formData.email)
          : await MockAPI.login(formData.email, formData.password);
        setUser(user);
        push(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-[50px] px-4 bg-slate-50">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-animate-gradient text-white relative">
          <div className="relative z-10">
            <button onClick={() => push('/')} className="flex items-center space-x-2 mb-16">
              <Sparkles className="w-8 h-8" /><span className="text-2xl font-black">ResuMaster AI</span>
            </button>
            <h2 className="text-4xl font-black mb-8">Build a resume that <br />actually works.</h2>
            <ul className="space-y-6">
              {["AI-Powered Smart Content", "99% ATS Pass Rate", "Free Expert Templates"].map((t, i) => (
                <li key={i} className="flex items-center space-x-4"><CheckCircle2 className="w-5 h-5" /> <span className="font-bold">{t}</span></li>
              ))}
            </ul>
          </div>
          <p className="relative z-10 text-[10px] font-black uppercase tracking-widest opacity-60">Trusted by candidates at Google, Meta & TCS</p>
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center relative bg-white min-h-[600px]">
          {isLoading && <div className="absolute inset-0 bg-white/90 z-50 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>}
          
          <div className="max-w-md w-full mx-auto">
            {isResetSent ? (
              <div className="text-center space-y-6">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-3xl font-black">Check your email</h2>
                <p className="text-slate-500 font-medium">We've sent a reset link to <b>{formData.email}</b></p>
                <button onClick={() => { setIsResetSent(false); setMode('login'); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Back to Login</button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  {mode === 'forgot' && <button onClick={() => setMode('login')} className="flex items-center text-slate-400 font-black text-[10px] uppercase mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>}
                  <h1 className="text-3xl font-black text-slate-900">{mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}</h1>
                  <p className="text-slate-500 font-medium">Join 50k+ professionals using AI to win.</p>
                </div>
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3"><AlertCircle className="w-5 h-5" /> {error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                      <input type="text" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Email</label>
                    <input type="email" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  {mode !== 'forgot' && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center"><label className="text-[10px] font-black uppercase text-slate-400">Password</label>{mode === 'login' && <button type="button" onClick={() => setMode('forgot')} className="text-[10px] text-blue-600 font-black">Forgot?</button>}</div>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                      </div>
                    </div>
                  )}
                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                    {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Link'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                <p className="mt-8 text-center text-slate-500 font-medium">
                  {mode === 'login' ? <>Don't have an account? <button onClick={() => setMode('signup')} className="text-blue-600 font-bold">Sign Up</button></> : <>Already have an account? <button onClick={() => setMode('login')} className="text-blue-600 font-bold">Sign In</button></>}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
