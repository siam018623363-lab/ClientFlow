
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../App';
import { supabase } from '../../lib/supabase';

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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'স্বাগতম!' : 'Welcome Back!'}
          </h1>
          <p className={`text-slate-500 mt-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'লগইন করতে আপনার তথ্য দিন' : 'Enter your details to login'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold text-center font-english">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'ইমেইল' : 'Email'}
            </label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all font-english"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all font-english"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center ${language === 'bn' ? 'font-bengali' : 'font-english'}`}
          >
            {loading ? 'Logging in...' : (language === 'bn' ? 'লগইন করুন' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/register" className="text-sm text-indigo-600 font-bold hover:underline">
            {language === 'bn' ? 'অ্যাকাউন্ট নেই? রেজিস্ট্রেশন করুন' : 'Don\'t have an account? Register'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
