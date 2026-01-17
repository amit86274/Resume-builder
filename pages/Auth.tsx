import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Lock, ArrowRight, Chrome, 
  CheckCircle2, Sparkles, 
  Eye, EyeOff, Loader2, AlertCircle, ChevronLeft
} from 'lucide-react';
import { MockAPI } from '../services/api';

interface AuthProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: any) => void;
  onNavigate: (page: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const Auth: React.FC<AuthProps> = ({ initialMode = 'login', onAuthSuccess, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResetSent, setIsResetSent] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  
  const GOOGLE_CLIENT_ID = "177022877254-ec4lvlhokefb9i8ck0julbhc5pg6sr8v.apps.googleusercontent.com";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const isGoogleIdValid = GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.startsWith("YOUR_GOOGLE");

  useEffect(() => {
    const handleGoogleCredentialResponse = (response: any) => {
      try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        
        handleSocialSuccess('google', {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          sub: payload.sub
        });
      } catch (e) {
        setError("Failed to process Google login. Please try again.");
      }
    };

    const initGoogle = () => {
      if (window.google && isGoogleIdValid) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: mode === 'signup' ? 'signup_with' : 'signin_with',
              shape: 'rectangular',
            });
          }
        } catch (err) {
          console.error("Google Auth Initialization Error:", err);
        }
      }
    };

    const timer = setTimeout(initGoogle, 1000);
    return () => clearTimeout(timer);
  }, [mode, GOOGLE_CLIENT_ID, isGoogleIdValid]);

  const handleSocialSuccess = async (provider: string, profile: any) => {
    setIsLoading(provider);
    try {
      const user = await MockAPI.socialLogin(provider, profile);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "Social login failed.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleSimulatedGoogleAuth = async () => {
    setIsLoading('google');
    setError(null);
    try {
      const user = await MockAPI.socialLogin('google');
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "Google connection failed.");
    } finally {
      setIsLoading(null);
    }
  };

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
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-[50px] px-4 bg-slate-50/50 transition-all duration-500">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Branding & Social Proof Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-animate-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" /> 
          <div className="relative z-10">
            <button onClick={() => onNavigate('landing')} className="flex items-center space-x-2 mb-16">
              <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
              <span className="text-2xl font-black drop-shadow-md">ResuMaster AI</span>
            </button>
            <h2 className="text-4xl font-black leading-tight mb-8 drop-shadow-md">
              Build a resume that <br />
              <span className="text-white/90">actually works.</span>
            </h2>
            <ul className="space-y-6">
              {[
                "AI-Powered Smart Content", 
                "99% ATS Pass Rate", 
                "Free Expert Templates"
              ].map((text, i) => (
                <li key={i} className="flex items-center space-x-4">
                  <div className="bg-white/20 p-1 rounded-full backdrop-blur-md">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-bold drop-shadow-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-10 text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
            Trusted by candidates at Google, Meta & TCS
          </div>
        </div>

        {/* Form Panel */}
        <div className="p-8 md:p-16 flex flex-col justify-center relative bg-white min-h-[600px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="relative mb-6">
                 <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                 <Sparkles className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px]">
                {mode === 'forgot' ? 'Sending Reset Link...' : 'Verifying Account...'}
              </p>
            </div>
          )}

          <div className="max-w-md w-full mx-auto">
            {isResetSent ? (
              <div className="text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-green-100">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900">Check your email</h2>
                  <p className="text-slate-500 font-medium">We've sent a password reset link to <span className="text-slate-900 font-bold">{formData.email}</span></p>
                </div>
                <button 
                  onClick={() => { setIsResetSent(false); setMode('login'); }}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 text-xs"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  {mode === 'forgot' && (
                    <button 
                      onClick={() => setMode('login')} 
                      className="inline-flex items-center text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] mb-4 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                  )}
                  <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                  </h1>
                  <p className="text-slate-500 font-medium">
                    {mode === 'forgot' ? 'Enter your email to receive a reset link.' : 'Join 50k+ professionals using AI to win.'}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 font-bold text-sm animate-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" /> {error}
                  </div>
                )}

                {/* Social Logins - Hidden in forgot password mode */}
                {mode !== 'forgot' && (
                  <>
                    <div className="mb-8">
                      {isGoogleIdValid ? (
                        <div ref={googleButtonRef} className="w-full min-h-[50px] overflow-hidden rounded-xl border border-slate-100"></div>
                      ) : (
                        <button 
                          onClick={handleSimulatedGoogleAuth} 
                          className="w-full flex items-center justify-center space-x-3 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 font-black text-slate-700 transition-all hover:border-blue-200 uppercase tracking-widest text-xs"
                        >
                          <Chrome className="w-5 h-5 text-red-500" /> 
                          <span>Continue with Google</span>
                        </button>
                      )}
                    </div>

                    <div className="relative mb-8">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                      <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]"><span className="bg-white px-4 text-slate-400 font-black">Or use email</span></div>
                    </div>
                  </>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="relative">
                       <input 
                        required 
                        type="text" 
                        placeholder="Full Name" 
                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-medium transition-all text-black" 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                       />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-5 top-[18px] w-5 h-5 text-slate-300" />
                    <input 
                      required 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-medium transition-all text-black" 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  {mode !== 'forgot' && (
                    <div className="relative">
                      <Lock className="absolute left-5 top-[18px] w-5 h-5 text-slate-300" />
                      <input 
                        required 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        className="w-full pl-14 pr-12 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-medium transition-all text-black" 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-[18px] text-slate-400 hover:text-blue-500 transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  )}

                  {mode === 'login' && (
                    <div className="flex justify-end">
                      <button 
                        type="button" 
                        onClick={() => setMode('forgot')} 
                        className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center shadow-xl shadow-slate-900/10 active:scale-[0.98] text-xs">
                    {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Get Started' : 'Send Reset Link'} <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </form>

                {mode !== 'forgot' && (
                  <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="w-full mt-8 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                    {mode === 'login' ? "New to ResuMaster? Create account" : "Already have an account? Sign In"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;