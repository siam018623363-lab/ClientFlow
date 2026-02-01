
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
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className={`text-3xl font-bold text-slate-800 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'রেজিস্ট্রেশন' : 'Sign Up'}
          </h1>
          <p className={`text-slate-500 mt-2 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Start your management journey'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold font-english text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
            </label>
            <input type="text" required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-english" placeholder="Tanvir Ahmed" onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'মোবাইল' : 'Mobile'}
            </label>
            <input type="text" required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-english" placeholder="01700000000" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'ইমেইল' : 'Email'}
            </label>
            <input type="email" required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-english" placeholder="name@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <input type="password" required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-english" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className={`w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {loading ? 'Processing...' : (language === 'bn' ? 'নিবন্ধন করুন' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className={`text-sm text-indigo-600 font-bold hover:underline ${language === 'bn' ? 'font-bengali' : 'font-english'}`}>
            {language === 'bn' ? 'ইতিমধ্যেই অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
