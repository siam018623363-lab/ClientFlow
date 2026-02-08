import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../App';
import { supabase } from '../../lib/supabase';

const Register: React.FC = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name, phone: formData.phone },
          emailRedirectTo: `${window.location.origin}/#/login`,
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError(language === 'bn' 
            ? 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত। অনুগ্রহ করে লগইন করুন।' 
            : 'This email is already registered. Please try logging in.');
        } else {
          throw signUpError;
        }
        return;
      }

      if (data.user) {
        alert(language === 'bn' 
          ? 'আপনার ইমেইলে একটি ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। অনুগ্রহ করে ইমেইল কনফার্ম করুন।' 
          : 'A verification link has been sent to your email. Please confirm it.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-3xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-black text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'রেজিস্ট্রেশন' : 'Create Account'}
          </h1>
          <p className={`text-slate-500 mt-3 font-medium ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'আপনার ব্যবসা ম্যানেজ করতে নতুন অ্যাকাউন্ট তৈরি করুন' : 'Start your management journey today'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold font-english text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className={`block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
            </label>
            <input type="text" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-english font-bold focus:bg-white focus:ring-4 focus:ring-[#007E6E]/10 focus:border-[#007E6E]/30 transition-all" placeholder="Tanvir Ahmed" onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className={`block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'মোবাইল' : 'Mobile Number'}
            </label>
            <input type="text" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-english font-bold focus:bg-white focus:ring-4 focus:ring-[#007E6E]/10 focus:border-[#007E6E]/30 transition-all" placeholder="01700000000" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className={`block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'ইমেইল' : 'Email Address'}
            </label>
            <input type="email" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-english font-bold focus:bg-white focus:ring-4 focus:ring-[#007E6E]/10 focus:border-[#007E6E]/30 transition-all" placeholder="name@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className={`block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <input type="password" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-english font-bold focus:bg-white focus:ring-4 focus:ring-[#007E6E]/10 focus:border-[#007E6E]/30 transition-all" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className={`w-full py-5 bg-[#007E6E] text-white rounded-2xl font-black text-lg shadow-xl hover:brightness-110 transition-all flex items-center justify-center ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {loading ? 'Processing...' : (language === 'bn' ? 'নিবন্ধন করুন' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link to="/login" className={`text-base text-[#007E6E] font-bold hover:underline ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ইতিমধ্যেই অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

// Fixed: Added missing default export
export default Register;