
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../App';
import { supabase } from '../../lib/supabase';
import { LogIn, Mail, Lock, Zap } from 'lucide-react';

const Login: React.FC = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#007E6E]/5 via-white to-indigo-50/30 p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#007E6E]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 md:p-14 shadow-premium border border-white relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#007E6E] to-[#00524a] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-[#007E6E]/30 mx-auto mb-8 transform hover:rotate-6 transition-transform">
            <Zap size={36} fill="white" />
          </div>
          <h1 className={`text-3xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ফিরে আসার জন্য ধন্যবাদ!' : 'Welcome Back!'}
          </h1>
          <p className={`text-slate-400 mt-3 font-medium text-sm md:text-base ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'আপনার ড্যাশবোর্ড এক্সেস করতে লগইন করুন' : 'Sign in to access your business console'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007E6E] transition-colors" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 focus:border-[#007E6E]/20 transition-all font-english font-bold text-slate-700"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007E6E] transition-colors" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 focus:border-[#007E6E]/20 transition-all font-english font-bold text-slate-700"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
             <button type="button" className="text-[10px] font-black uppercase text-[#007E6E]/60 hover:text-[#007E6E] transition-colors">Forgot Password?</button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-gradient-to-r from-[#007E6E] to-[#00524a] text-white rounded-2xl font-black text-lg shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <>
                <LogIn size={20} />
                {language === 'bn' ? 'লগইন করুন' : 'Sign In Now'}
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">New to ClientFlow?</p>
          <Link to="/register" className="text-base text-[#007E6E] font-black hover:underline decoration-2 underline-offset-4">
            {language === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Create Free Account'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
