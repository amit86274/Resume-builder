
import React, { useState } from 'react';
import { 
  Mail, Lock, ArrowRight, 
  CheckCircle2, Sparkles, 
  Eye, EyeOff, Loader2, AlertCircle, User as UserIcon
} from 'lucide-react';
import { MockAPI } from '../lib/api';

interface AuthProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: any) => void;
  onNavigate: (page: string) => void;
}

const Auth: React.FC<AuthProps> = ({ initialMode = 'login', onAuthSuccess, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResetSent, setIsResetSent] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const validateForm = () => {
    if (mode === 'signup' && !formData.name.trim()) {
      setError("Please enter your full name");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (mode !== 'forgot' && formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setIsLoading('email');
    try {
      if (mode === 'forgot') {
        await MockAPI.forgotPassword(formData.email);
        setIsResetSent(true);
      } else {
        const user = mode === 'signup' 
          ? await MockAPI.signup(formData.name, formData.email, formData.password)
          : await MockAPI.login(formData.email, formData.password);
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-50/50">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
        
        {/* Brand Side */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-animate-gradient text-white relative">
          <div className="relative z-10">
            <button onClick={() => onNavigate('landing')} className="flex items-center space-x-2 mb-20">
              <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
              <span className="text-2xl font-black">ResuMaster AI</span>
            </button>
            <h2 className="text-5xl font-black mb-10 leading-tight">Elevate your career with AI.</h2>
            <ul className="space-y-6">
              {[
                "AI-Powered Content Optimization",
                "ATS-Compatible Master Templates",
                "Real-time Neural Porting",
                "Premium PDF Exports"
              ].map((text, i) => (
                <li key={i} className="flex items-center space-x-4">
                  <div className="p-1 bg-white/20 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg opacity-90">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative z-10 pt-10 border-t border-white/10">
            <p className="text-sm font-medium opacity-60">Join 100,000+ professionals using ResuMaster AI to land their dream roles.</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-10 md:p-20 flex flex-col justify-center bg-white relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          )}

          <div className="max-w-md w-full mx-auto">
            {isResetSent ? (
              <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900">Link Sent!</h2>
                <p className="text-slate-500 font-medium leading-relaxed">Check your inbox for a password reset link.</p>
                <button onClick={() => { setIsResetSent(false); setMode('login'); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all">Back to Login</button>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                    {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Get Started' : 'Reset Access'}
                  </h1>
                  <p className="text-slate-400 font-medium">The most advanced AI resume engine in India.</p>
                </div>

                {error && (
                  <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 font-bold text-sm animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === 'signup' && (
                    <div className="relative group">
                       <UserIcon className="absolute left-5 top-[21px] w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                       <input required type="text" placeholder="Full Name" className="w-full pl-14 pr-5 py-5 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-semibold transition-all text-black" onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                  )}
                  <div className="relative group">
                    <Mail className="absolute left-5 top-[21px] w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input required type="email" placeholder="Email Address" className="w-full pl-14 pr-5 py-5 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-semibold transition-all text-black" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  {mode !== 'forgot' && (
                    <div className="relative group">
                      <Lock className="absolute left-5 top-[21px] w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <input required type={showPassword ? "text" : "password"} placeholder="Password" className="w-full pl-14 pr-12 py-5 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-semibold transition-all text-black" onChange={e => setFormData({...formData, password: e.target.value})} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-[21px] text-slate-400 hover:text-blue-500 transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  )}

                  {mode === 'login' && (
                    <div className="text-right">
                      <button type="button" onClick={() => setMode('forgot')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot Password?</button>
                    </div>
                  )}

                  <button type="submit" className="w-full py-6 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] bg-slate-900 hover:bg-blue-600 shadow-2xl shadow-slate-900/10 active:scale-95 transition-all">
                    {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'} <ArrowRight className="ml-2 w-4 h-4 inline" />
                  </button>
                </form>

                <div className="mt-12 text-center">
                  <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">
                    {mode === 'login' ? "New to ResuMaster? Join Now" : "Already have an account? Login"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
