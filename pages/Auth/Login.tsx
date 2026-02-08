
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#007E6E]/5 via-white to-indigo-50/30 p-4 md:p-6 relative overflow-hidden">
      {/* Decorative Elements - hidden or scaled for mobile */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#007E6E]/5 rounded-full blur-[80px] md:blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[80px] md:blur-[100px]"></div>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-14 shadow-premium border border-white relative z-10 animate-fade-in mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#007E6E] to-[#00524a] rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-[#007E6E]/30 mx-auto mb-6 md:mb-8 transform hover:rotate-6 transition-transform">
            <Zap size={28} className="md:w-9 md:h-9" fill="white" />
          </div>
          <h1 className={`text-2xl md:text-4xl font-black text-slate-800 tracking-tight ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'লগইন করুন' : 'Welcome Back!'}
          </h1>
          <p className={`text-slate-400 mt-2 md:mt-3 font-medium text-xs md:text-base ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ব্যবসা পরিচালনা শুরু করতে আপনার একাউন্টে প্রবেশ করুন' : 'Sign in to access your business console'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 md:p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
          <div className="space-y-1.5 md:space-y-2">
            <label className={`block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007E6E] transition-colors" size={16} />
              <input 
                type="email" 
                required
                className="w-full pl-11 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 focus:border-[#007E6E]/20 transition-all font-english font-bold text-slate-700 text-sm"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className={`block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007E6E] transition-colors" size={16} />
              <input 
                type="password" 
                required
                className="w-full pl-11 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#007E6E]/5 focus:border-[#007E6E]/20 transition-all font-english font-bold text-slate-700 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-0.5">
             <button type="button" className="text-[9px] md:text-[10px] font-black uppercase text-[#007E6E]/60 hover:text-[#007E6E] transition-colors">Forgot Password?</button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 md:py-5 bg-gradient-to-r from-[#007E6E] to-[#00524a] text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl md:shadow-2xl shadow-[#007E6E]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 md:gap-3 mt-4 md:mt-6 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <>
                <LogIn size={18} className="md:w-5 md:h-5" />
                {language === 'bn' ? 'লগইন করুন' : 'Sign In Now'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-[10px] md:text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">New to ClientFlow?</p>
          <Link to="/register" className="text-sm md:text-base text-[#007E6E] font-black hover:underline decoration-2 underline-offset-4">
            {language === 'bn' ? 'ফ্রি একাউন্ট খুলুন' : 'Create Free Account'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
